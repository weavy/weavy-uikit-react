import React from "react";
import { createComponent, EventName } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import type { FilePreviewLoadedEventType } from "@weavy/uikit-web/dist/types/types/files.events.d.js";

// Creates a React component from a Lit component
export const WyPdfViewer = createComponent({
  react: React,
  tagName: "wy-pdf-viewer",
  elementClass: WeavyComponents.WyPdfViewer,
  events: {
    onFilePreviewLoaded: "file-preview-loaded" satisfies FilePreviewLoadedEventType["type"] as EventName<FilePreviewLoadedEventType>,
  }
});
