import { useEffect, useRef, useState } from "react";
import { createColorSetHighlight, SceneConfig, View } from "@novorender/api";
import { ViewManager } from "./components/ViewManager";
import { SceneData } from "@novorender/data-js-api";
import { createView } from "./utils/createView";
import { loadPublicScene } from "./utils/loadPublicScene";

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
      console.log("inside onLoadPublicScene");
      const view = await createView(canvas);
      const loadSceneResult = await loadPublicScene(view);

      // await loadPublicScene(view, 20);

      const { sceneData, sceneConfig } = loadSceneResult;
      setSceneConfig(sceneConfig);

      view.modifyRenderState({ grid: { enabled: true }, camera: {} });

      // Register event handler for object selection etc.
      await registerEventHandlers(view, sceneData);

      // Mark the isViewReady state as true and set the view in state
      setView(view);
      // Run the view
      await view.run();
      view.dispose();
    } catch (error) {
      console.error("Error initializing view:", error);
    }
  };

  const registerEventHandlers = async (view: View, sceneData: SceneData) => {
    const limeGreen = createColorSetHighlight([0, 1, 0]);
    const { db } = sceneData;

    view.canvas.onclick = async (e: MouseEvent) => {
      const result = await view.pick(e.offsetX, e.offsetY);
      const objectIds: number[] = [];
      if (result) {
        console.log(`You picked object id:${result.objectId}`);
        // Add selected object to highlight group
        objectIds.push(result.objectId);

        // Load metadata
        // try {
        //   const objectData = await db?.getObjectMetdata(result.objectId);
        //   // Display metadata
        //   console.log(objectData);
        // } catch (e) {
        //   console.log("Error while fetching object data :", e);
        // }
      }

      view.modifyRenderState({
        highlights: {
          groups: [{ action: limeGreen, objectIds }],
        },
      });
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
