import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WyFilesList as WyFilesListWC } from "@weavy/uikit-web";
import {
  FileOrderType,
  FileType,
} from "@weavy/uikit-web/dist/types/types/files.types";

// Creates a React component from a Lit component
export const WyFilesList = createComponent({
  react: React,
  tagName: "wy-files-list",
  elementClass: WyFilesListWC,
  events: {
    onFileOpen: "file-open" as EventName<
      CustomEvent<{
        file: FileType;
      }>
    >,
    onOrder: "order" as EventName<
      CustomEvent<{
        order: FileOrderType;
      }>
    >,
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
