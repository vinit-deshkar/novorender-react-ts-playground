import { quat, vec3 } from "gl-matrix";

export const orbitControllerDefaults = {
  fov: 45,
  distance: 20,
  pivot: vec3.fromValues(750, 195, 21.5),
  rotation: quat.fromValues(1, 2, 3, 4),
};
