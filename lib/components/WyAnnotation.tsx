import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import type { FileOpenEventType } from "@weavy/uikit-web/dist/types/types/files.events.d.ts";

// Creates a React component from a Lit component
export const WyAnnotation = createComponent({
  react: React,
  tagName: "wy-annotation",
  elementClass: WeavyComponents.WyAnnotation,
});

export const WyAnnotationList = createComponent({
  react: React,
  tagName: "wy-annotation-list",
  elementClass: WeavyComponents.WyAnnotationList,
  events: {
    onFileOpen: "file-open" satisfies FileOpenEventType["type"] as EventName<FileOpenEventType>,
  },
});
