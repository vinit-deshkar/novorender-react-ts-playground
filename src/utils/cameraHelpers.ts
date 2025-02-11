import { SceneConfig, View } from "@novorender/api";
import { quat, vec3 } from "gl-matrix";

export type CadCamera = {
  kind: "pinhole" | "orthographic";
  position: vec3;
  rotation: quat;
  fov: number;
};

export function getDefaultCamera(
  boundingBox?: [number, number, number, number]
): CadCamera | undefined {
  if (!boundingBox) {
    return;
  }

  const centerX = (boundingBox[0] + boundingBox[2]) / 2;
  const centerY = (boundingBox[1] + boundingBox[3]) / 2;
  const width = boundingBox[2] - boundingBox[0];
  const height = boundingBox[3] - boundingBox[1];

  const fov = 60;
  const maxDim = Math.max(width, height);
  const distance = maxDim / (2 * Math.tan((fov * Math.PI) / 360));

  const initPosition = vec3.fromValues(0, 0, distance);
  const rotation = quat.fromValues(
    0.25000000000000006,
    0.43301270189221935,
    0.07945931129894554,
    0.8623724356957945
  );
  const rotatedPosition = vec3.transformQuat(
    vec3.create(),
    initPosition,
    rotation
  );
  const position = vec3.fromValues(
    rotatedPosition[0] + centerX,
    rotatedPosition[1] + centerY,
    rotatedPosition[2]
  );

  return {
    kind: "pinhole",
    position,
    rotation,
    fov,
  };
}

export function useDefaultCamera(
  sceneConfig: SceneConfig
): CadCamera | undefined {
  const aabb = sceneConfig.aabb;
  const bb = [aabb.min[0], aabb.min[1], aabb.max[0], aabb.max[1]] as [
    number,
    number,
    number,
    number
  ];

  if (!bb) {
    return;
  }

  return getDefaultCamera(bb);
}

export const useFlightCameraController = (view: View) => {
  view.switchCameraController("flight");
  console.log("activeController updated to flight", view.activeController);
};
