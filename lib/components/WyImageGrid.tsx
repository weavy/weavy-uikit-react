import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WyImageGrid as WyImageGridWC } from "@weavy/uikit-web";
import { FileType } from "@weavy/uikit-web/dist/types/types/files.types";

// Creates a React component from a Lit component
export const WyImageGrid = createComponent({
  react: React,
  tagName: "wy-image-grid",
  elementClass: WyImageGridWC,
  events: {
    onFileOpen: "file-open" as EventName<
      CustomEvent<{
        file: FileType;
      }>
    >,
  },
});
