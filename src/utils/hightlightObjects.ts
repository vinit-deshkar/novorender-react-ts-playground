import { createColorSetHighlight, View } from "@novorender/api";

export const highlightObjects = (view: View, objectIds: number[]) => {
  const highlight = createColorSetHighlight([0, 1, 0]);
  const renderState = {
    highlights: {
      groups: [{ action: highlight, objectIds }],
    },
  };
  view.modifyRenderState(renderState);
};
