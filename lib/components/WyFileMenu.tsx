import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import type { FileType } from "@weavy/uikit-web/dist/types/types/files.types.d.ts";

// Creates a React component from a Lit component
export const WyFileMenu = createComponent({
  react: React,
  tagName: "wy-file-menu",
  elementClass: WeavyComponents.WyFileMenu,
  events: {
    onEditName: "edit-name" as EventName<
      CustomEvent<{
        file: FileType | undefined;
      }>
    >,
    onSubscribe: "subscribe" as EventName<
      CustomEvent<{
        file: FileType | undefined;
        subscribe: boolean;
      }>
    >,
    onTrash: "trash" as EventName<
      CustomEvent<{
        file: FileType | undefined;
      }>
    >,
    onRestore: "restore" as EventName<
      CustomEvent<{
        file: FileType | undefined;
      }>
    >,
    onDeleteForever: "delete-forever" as EventName<
      CustomEvent<{
        file: FileType | undefined;
      }>
    >,
  },
});
