import { FunctionComponent } from "react";
import { Box, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { OrbitController, SceneConfig, View } from "@novorender/api";
import { SliderController } from "./SliderController";
import { orbitControllerDefaults } from "../constants/orbitControllerDefaults";
import { useDefaultCamera } from "../utils/getDefaultCamera";

interface ViewManagerProps {
  view: View;
  sceneConfig: SceneConfig;
}

enum Axis {
  X = "X",
  Y = "Y",
  Z = "Z",
}

export const ViewManager: FunctionComponent<ViewManagerProps> = (props) => {
  const { view, sceneConfig } = props;

  const { fov, pivot } = orbitControllerDefaults;
  const [x, y, z] = pivot;

  // On Camera controller rotational velocity change
  const onRotationalVelocityChange = async (newVelocity: number) => {
    const { activeController } = view;
    console.log(activeController);
    // view.modifyRenderState({ grid: { enabled: true } }); // enable grid
    OrbitController.assert(activeController);
    activeController.updateParams({ rotationalVelocity: newVelocity });
  };

  // On Camera controller FOV change
  const onFieldOfViewChange = async (fov: number) => {
    const { activeController } = view;
    console.log(activeController);
    OrbitController.assert(activeController);
    activeController.fov = fov;
  };

  // On Camera controller FOV change
  const onCameraPositionChange = async (newPosition: number, axis: Axis) => {
    const { activeController } = view;
    console.log(activeController);
    OrbitController.assert(activeController);
    let [x, y, z] = activeController.pivot;
    switch (axis) {
      case Axis.X:
        console.log(`Position X changed to ${newPosition}`);
        x = newPosition;
        break;
      case Axis.Y:
        console.log(`Position Y changed to ${newPosition}`);
        y = newPosition;
        break;
      case Axis.Z:
        console.log(`Position Z changed to ${newPosition}`);
        z = newPosition;
        break;
      default:
        console.log(`Unknown newPosition: ${newPosition}`);
    }

    activeController.pivot = [x, y, z];
  };

  const onResetView = () => {
    console.log("inside onLoadPublicScene");
    const cadCamera = useDefaultCamera(sceneConfig);
    if (!cadCamera) {
      return;
    }
    const { kind, fov, position, rotation } = cadCamera;
    view.modifyRenderState({ camera: { kind, position, rotation, fov } });
  };

  return (
    <Box
      component="section"
      sx={{
        p: 2,
        backgroundColor: "grey",
        border: "1px dashed grey",
        position: "absolute",
        top: "50px",
        right: "20px",
        zIndex: 1,
      }}
    >
      <Typography>Camera controller settings</Typography>
      <HomeIcon onClick={onResetView} color="primary" />
      <SliderController
        label="Rotational Velocity"
        minValue={1}
        maxValue={10}
        onValueChange={onRotationalVelocityChange}
      />
      <SliderController
        label="FOV"
        minValue={1}
        maxValue={180}
        defaultValue={fov}
        onValueChange={onFieldOfViewChange}
      />
      <SliderController
        label={`Position ${Axis.X}`}
        minValue={-10}
        maxValue={1000}
        defaultValue={x}
        onValueChange={(value) => onCameraPositionChange(value, Axis.X)}
      />
      <SliderController
        label={`Position ${Axis.Y}`}
        minValue={-10}
        maxValue={1000}
        defaultValue={y}
        onValueChange={(value) => onCameraPositionChange(value, Axis.Y)}
      />
      <SliderController
        label={`Position ${Axis.Z}`}
        minValue={-10}
        maxValue={1000}
        defaultValue={z}
        onValueChange={(value) => onCameraPositionChange(value, Axis.Z)}
      />
    </Box>
  );
};
