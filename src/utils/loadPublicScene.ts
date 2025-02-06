import { OrbitController, SceneConfig, View } from "@novorender/api";
import { createAPI, SceneData } from "@novorender/data-js-api";
import { vec3 } from "gl-matrix";
import { orbitControllerDefaults } from "../constants/orbitControllerDefaults";

// import { useDefaultCamera } from "./getDefaultCamera";

export const loadPublicScene = async (
  view: View,
  offset?: number
): Promise<{ sceneData: SceneData; sceneConfig: SceneConfig }> => {
  const serviceUrl = "https://data-v2.novorender.com/api";
  // Initialize the data API with the Novorender data server service
  const dataApi = createAPI({
    serviceUrl,
  });

  // Condos scene ID, but can be changed to any public scene ID
  const sceneData = await dataApi.loadScene("3b5e65560dc4422da5c7c3f827b6a77c");

  if ("error" in sceneData) {
    throw sceneData;
  }

  // Destructure relevant properties into variables
  const { url: _url } = sceneData as SceneData;
  const url = new URL(_url);
  const parentSceneId = url.pathname.replaceAll("/", "");
  url.pathname = "";

  // load the scene using URL gotten from `sceneData`
  const sceneConfig = await view.loadScene(url, parentSceneId, "index.json");

  const { center, radius } = sceneConfig.boundingSphere;
  console.log("center :", center);

  const adjustedCenter = offset
    ? vec3.fromValues(
        center[0] + offset,
        center[1] + offset,
        center[2] + offset
      )
    : center;

  view.activeController.autoFit(adjustedCenter, radius);

  return { sceneData, sceneConfig };
};

const adjustCameraPosition = (view: View) => {
  const { activeController } = view;
  console.log(activeController);

  OrbitController.assert(activeController);

  const { fov, distance, pivot, rotation } = orbitControllerDefaults;

  activeController.fov = fov;
  activeController.distance = distance;
  activeController.pivot = pivot;

  // view.modifyRenderState({ camera: { rotation } }); // Not working - why ?
};
