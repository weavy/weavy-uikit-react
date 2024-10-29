import React from "react";
import { createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyPdfViewer = createComponent({
  react: React,
  tagName: "wy-pdf-viewer",
  elementClass: WeavyComponents.WyPdfViewer,
});
