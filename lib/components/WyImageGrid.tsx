import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WyImageGrid as WyImageGridWC } from "@weavy/uikit-web";
import { FileOpenEventType } from "@weavy/uikit-web/dist/types/types/files.types.d.ts";

// Creates a React component from a Lit component
export const WyImageGrid = createComponent({
  react: React,
  tagName: "wy-image-grid",
  elementClass: WyImageGridWC,
  events: {
    onFileOpen: "file-open" as EventName<FileOpenEventType>,
  },
});
