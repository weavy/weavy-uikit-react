import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import type {
  FileEditNameEventType,
  FileRenameEventType,
} from "@weavy/uikit-web/dist/types/types/files.events.d.ts";

// Creates a React component from a Lit component
export const WyFileTitle = createComponent({
  react: React,
  tagName: "wy-file-title",
  elementClass: WeavyComponents.WyFileTitle,
  events: {
    onEditName: "edit-name" satisfies FileEditNameEventType["type"] as EventName<FileEditNameEventType>,
    onRename: "rename" satisfies FileRenameEventType["type"] as EventName<FileRenameEventType>,
  },
});
