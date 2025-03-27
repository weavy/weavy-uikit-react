import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import type { FileOpenEventType } from "@weavy/uikit-web/dist/types/types/events.types.d.ts";

// Creates a React component from a Lit component
export const WyImageGrid = createComponent({
  react: React,
  tagName: "wy-image-grid",
  elementClass: WeavyComponents.WyImageGrid,
  events: {
    onFileOpen: "file-open" as EventName<FileOpenEventType>,
  },
});
