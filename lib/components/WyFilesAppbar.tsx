import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import type {
  BlobType,
  ExternalBlobType,
  FileOrderType,
} from "@weavy/uikit-web/dist/types/types/files.types.d.ts";

// Creates a React component from a Lit component
export const WyFilesAppbar = createComponent({
  react: React,
  tagName: "wy-files-appbar",
  elementClass: WeavyComponents.WyFilesAppbar,
  events: {
    onReleaseFocus: "release-focus" as EventName<CustomEvent>,
    onUploadFiles: "upload-files" as EventName<
      CustomEvent<{
        files: FileList | null;
        input: HTMLInputElement;
      }>
    >,
    onExternalBlobs: "external-blobs" as EventName<
      CustomEvent<{
        externalBlobs: ExternalBlobType[] | null;
      }>
    >,
    onCreateFiles: "create-files" as EventName<
      CustomEvent<{
        blobs: BlobType[] | null;
        replace: boolean;
      }>
    >,
    onOrder: "order" as EventName<
      CustomEvent<{
        order: FileOrderType;
      }>
    >,
    onView: "view" as EventName<
      CustomEvent<{
        view: "grid" | "list";
      }>
    >,
    onShowTrashed: "show-trashed" as EventName<
      CustomEvent<{
        showTrashed: boolean;
      }>
    >,
    onSubscribe: "subscribe" as EventName<
      CustomEvent<{
        subscribe: boolean;
      }>
    >,
  },
});
