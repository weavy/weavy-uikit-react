import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import type {
  FileOrderType,
} from "@weavy/uikit-web/dist/types/types/files.types.d.ts";
import type {
  FileDeleteForeverEventType,
  FileEditNameEventType,
  FileOpenEventType,
  FileRenameEventType,
  FileRestoreEventType,
  FileSubscribeEventType,
  FileTrashEventType,
} from "@weavy/uikit-web/dist/types/types/files.events.d.ts";
import type { OrderEventType } from "@weavy/uikit-web/dist/types/types/lists.events.d.ts";

// Creates a React component from a Lit component
export const WyFileTable = createComponent({
  react: React,
  tagName: "wy-file-table",
  elementClass: WeavyComponents.WyFileTable,
  events: {
    onFileOpen: "file-open" satisfies FileOpenEventType["type"] as EventName<FileOpenEventType>,
    onOrder: "order" satisfies OrderEventType<FileOrderType>["type"] as EventName<OrderEventType<FileOrderType>>,
    onEditName: "edit-name" satisfies FileEditNameEventType["type"] as EventName<FileEditNameEventType>,
    onRename: "rename" satisfies FileRenameEventType["type"] as EventName<FileRenameEventType>,
    onTrash: "trash" satisfies FileTrashEventType["type"] as EventName<FileTrashEventType>,
    onRestore: "restore" satisfies FileRestoreEventType["type"] as EventName<FileRestoreEventType>,
    onDeleteForever: "delete-forever" satisfies FileDeleteForeverEventType["type"] as EventName<FileDeleteForeverEventType>,
    onSubscribe: "subscribe" satisfies FileSubscribeEventType["type"] as EventName<FileSubscribeEventType>,
  },
});
