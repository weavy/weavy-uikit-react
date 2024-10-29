import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import { FileType } from "@weavy/uikit-web/dist/types/types/files.types.d.ts";

// Creates a React component from a Lit component
export const WyFileItem = createComponent({
  react: React,
  tagName: "wy-file-item",
  elementClass: WeavyComponents.WyFileItem,
  events: {
    onEditName: "edit-name" as EventName<
      CustomEvent<{
        file: FileType;
      }>
    >,
    onRename: "rename" as EventName<
      CustomEvent<{
        file: FileType;
        name: string;
      }>
    >,
    onTrash: "trash" as EventName<
      CustomEvent<{
        file: FileType;
      }>
    >,
    onRestore: "restore" as EventName<
      CustomEvent<{
        file: FileType;
      }>
    >,
    onDeleteForever: "delete-forever" as EventName<
      CustomEvent<{
        file: FileType;
      }>
    >,
    onSubscribe: "subscribe" as EventName<
      CustomEvent<{
        file: FileType;
        subscribe: boolean;
      }>
    >,
  },
});
