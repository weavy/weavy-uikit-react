import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import type {
  FileDeleteForeverEventType,
  FileEditNameEventType,
  FileRenameEventType,
  FileRestoreEventType,
  FileSubscribeEventType,
  FileTrashEventType,
} from "@weavy/uikit-web/dist/types/types/files.events.d.ts";

// Creates a React component from a Lit component
export const WyFileItem = createComponent({
  react: React,
  tagName: "wy-file-item",
  elementClass: WeavyComponents.WyFileItem,
  events: {
    onEditName: "edit-name" satisfies FileEditNameEventType["type"] as EventName<FileEditNameEventType>,
    onRename: "rename" satisfies FileRenameEventType["type"] as EventName<FileRenameEventType>,
    onSubscribe: "subscribe" satisfies FileSubscribeEventType["type"] as EventName<FileSubscribeEventType>,
    onTrash: "trash" satisfies FileTrashEventType["type"] as EventName<FileTrashEventType>,
    onRestore: "restore" satisfies FileRestoreEventType["type"] as EventName<FileRestoreEventType>,
    onDeleteForever: "delete-forever" satisfies FileDeleteForeverEventType["type"] as EventName<FileDeleteForeverEventType>,
  },
});
