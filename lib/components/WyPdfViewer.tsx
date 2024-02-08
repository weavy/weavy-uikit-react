import React from "react";
import { createComponent } from "@lit/react";
import { WyPdfViewer as WyPdfViewerWC } from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyPdfViewer = createComponent({
  react: React,
  tagName: "wy-pdf-viewer",
  elementClass: WyPdfViewerWC,
});
