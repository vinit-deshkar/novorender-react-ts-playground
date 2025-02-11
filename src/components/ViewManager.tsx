import { FunctionComponent } from "react";
import { Box, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import {
  OrbitController,
  RenderStateChanges,
  SceneConfig,
  View,
} from "@novorender/api";
import { SliderController } from "./SliderController";
import { orbitControllerDefaults } from "../constants/orbitControllerDefaults";
import { useDefaultCamera } from "../utils/cameraHelpers";

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
  const onRotationalVelocityChange = (newVelocity: number) => {
    const { activeController } = view;
    console.log(activeController);
    // view.modifyRenderState({ grid: { enabled: true } }); // enable grid
    OrbitController.assert(activeController);
    activeController.updateParams({ rotationalVelocity: newVelocity });
  };

  // On Camera controller FOV change
  const onFieldOfViewChange = (fov: number) => {
    const { activeController } = view;
    console.log(activeController);
    OrbitController.assert(activeController);
    activeController.fov = fov;
  };

  // On Camera controller FOV change
  const onCameraPositionChange = (newPosition: number, axis: Axis) => {
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

  const clipHandlerX = (x: number) => {
    console.log("x :", x);
    view.modifyRenderState({
      clipping: {
        draw: true,
        enabled: true,
        planes: [{ normalOffset: [1, 0, 0, x] }],
      },
    } as RenderStateChanges);
  };

  const clipHandlerZ = (z: number) => {
    console.log("z :", z);
    view.modifyRenderState({
      clipping: {
        draw: true,
        enabled: true,
        planes: [{ normalOffset: [-0, -0, -1, -z] }],
      },
    } as RenderStateChanges);
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
      <SliderController
        label="Move YZ Plane Along X"
        minValue={700}
        maxValue={750}
        defaultValue={0}
        onValueChange={clipHandlerX}
      />
      <SliderController
        label="Move XY Plane Along Z"
        minValue={-10}
        maxValue={20}
        defaultValue={0}
        onValueChange={clipHandlerZ}
      />
    </Box>
  );
};
