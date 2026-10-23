import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import type {
  FileCommentsEventType,
  FileDeleteForeverEventType,
  FileEditEventType,
  FileEditNameEventType,
  FileRestoreEventType,
  FileSaveEventType,
  FileSubscribeEventType,
  FileTrashEventType,
  FileVersionsEventType
} from "@weavy/uikit-web/dist/types/types/files.events.d.ts";

// Creates a React component from a Lit component
export const WyFileMenu = createComponent({
  react: React,
  tagName: "wy-file-menu",
  elementClass: WeavyComponents.WyFileMenu,
  events: {
    onComments: "comments" satisfies FileCommentsEventType["type"] as EventName<FileCommentsEventType>,
    onVersions: "versions" satisfies FileVersionsEventType["type"] as EventName<FileVersionsEventType>,
    onEdit: "edit" satisfies FileEditEventType["type"] as EventName<FileEditEventType>,
    onEditName: "edit-name" satisfies FileEditNameEventType["type"] as EventName<FileEditNameEventType>,
    onSave: "save" satisfies FileSaveEventType["type"] as EventName<FileSaveEventType>,
    onSubscribe: "subscribe" satisfies FileSubscribeEventType["type"] as EventName<FileSubscribeEventType>,
    onTrash: "trash" satisfies FileTrashEventType["type"] as EventName<FileTrashEventType>,
    onRestore: "restore" satisfies FileRestoreEventType["type"] as EventName<FileRestoreEventType>,
    onDeleteForever: "delete-forever" satisfies FileDeleteForeverEventType["type"] as EventName<FileDeleteForeverEventType>,
  },
});
