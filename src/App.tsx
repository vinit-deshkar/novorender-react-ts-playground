import { useEffect, useRef, useState } from "react";
import {
  downloadGLTF,
  RenderStateChanges,
  SceneConfig,
  View,
} from "@novorender/api";
import { ViewManager } from "./components/ViewManager";
import { SceneData } from "@novorender/data-js-api";
import { ViewBuilder } from "./utils/ViewBuilder";
import { SceneManager } from "./utils/SceneManager";
import { highlightObjects } from "./utils/hightlightObjects";
import { useFlightCameraController } from "./utils/cameraHelpers";

function App() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [view, setView] = useState<View | null>(null); // Store `view` in state
  const [sceneConfig, setSceneConfig] = useState<SceneConfig | null>(null); // Store `sceneConfig` in state

  useEffect(() => {
    if (canvas.current) {
      main(canvas.current);
    }
  }, []);

  useEffect(() => {
    if (view) {
      console.log("View is ready!");
    }
  }, [view]);

  // Create a simple sphere mesh object.
  const main = async (canvas: HTMLCanvasElement) => {
    try {
      // Create instance of View
      const viewBuilder = new ViewBuilder();
      const view = await viewBuilder.createView(canvas);
      const sceneManager = new SceneManager(view);
      const { sceneData, sceneConfig } = await sceneManager.loadPublicScene();
      useFlightCameraController(view);

      const objects = await downloadGLTF(
        new URL("https://assets.novorender.com/gltf/logo.glb")
      );

      setSceneConfig(sceneConfig);

      view.modifyRenderState({
        grid: { enabled: true },
        dynamic: { objects },
      } as RenderStateChanges);

      // Register event handler for object selection etc.
      await registerEventHandlers(view, sceneData);

      // Mark the isViewReady state as true and set the view in state
      setView(view);

      // Run the view
      await view.run();

      // Dispose the view
      view.dispose();
    } catch (error) {
      console.error("Error initializing view:", error);
    }
  };

  const registerEventHandlers = async (view: View, sceneData: SceneData) => {
    view.canvas.onclick = async (e: MouseEvent) => {
      const result = await view.pick(e.offsetX, e.offsetY);
      if (!result) {
        return;
      }

      console.log(`You picked object id:${result.objectId}`);
      highlightObjects(view, [result.objectId]);

      // Load metadata
      try {
        const { db } = sceneData;
        const objectData = await db?.getObjectMetdata(result.objectId);
        console.log("objectData :", objectData);
        // Display metadata
        alert(JSON.stringify(objectData));
      } catch (e) {
        console.log("Error while fetching object data :", e);
      }
    };
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        height: "100vh",
        position: "relative",
      }}
    >
      <canvas
        ref={canvas}
        style={{
          width: "100vw", // Full viewport width
          height: "100vh", // Full viewport height
          position: "absolute", // Position the canvas absolutely within the container
          top: 0, // Align to the top of the viewport
          left: 0, // Align to the left of the viewport
        }}
      ></canvas>
      {view && sceneConfig ? (
        <ViewManager view={view} sceneConfig={sceneConfig} />
      ) : null}
    </div>
  );
}

export default App;
