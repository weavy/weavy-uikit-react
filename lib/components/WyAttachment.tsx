import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import { FileOpenEventType } from "@weavy/uikit-web/dist/types/types/files.types.d.ts";

// Creates a React component from a Lit component
export const WyAttachment = createComponent({
  react: React,
  tagName: "wy-attachment",
  elementClass: WeavyComponents.WyAttachment,
});

export const WyAttachmentsList = createComponent({
  react: React,
  tagName: "wy-attachments-list",
  elementClass: WeavyComponents.WyAttachmentsList,
  events: {
    onFileOpen: "file-open" as EventName<FileOpenEventType>,
  },
});
