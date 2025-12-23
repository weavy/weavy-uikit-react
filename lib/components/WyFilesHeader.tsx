import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import type {
  CreateFilesEventType,
  ExternalBlobsEventType,
  UploadFilesEventType,
} from "@weavy/uikit-web/dist/types/types/files.events.d.ts";
import type {
  OrderEventType,
  ShowTrashedEventType,
  ViewEventType,
} from "@weavy/uikit-web/dist/types/types/lists.events.d.ts";
import type { SubscribeEventType } from "@weavy/uikit-web/dist/types/types/app.events.d.ts";
import type { FileOrderType, FileViewType } from "@weavy/uikit-web/dist/types/types/files.types.d.ts";

// Creates a React component from a Lit component
export const WyFilesHeader = createComponent({
  react: React,
  tagName: "wy-files-header",
  elementClass: WeavyComponents.WyFilesHeader,
  events: {
    onUploadFiles: "upload-files" satisfies UploadFilesEventType["type"] as EventName<UploadFilesEventType>,
    onExternalBlobs: "external-blobs" satisfies ExternalBlobsEventType["type"] as EventName<ExternalBlobsEventType>,
    onCreateFiles: "create-files" satisfies CreateFilesEventType["type"] as EventName<CreateFilesEventType>,
    onOrder: "order" satisfies OrderEventType<FileOrderType>["type"] as EventName<OrderEventType<FileOrderType>>,
    onView: "view" satisfies ViewEventType<FileViewType>["type"] as EventName<ViewEventType<FileViewType>>,
    onShowTrashed: "show-trashed" satisfies ShowTrashedEventType["type"] as EventName<ShowTrashedEventType>,
    onSubscribe: "subscribe" satisfies SubscribeEventType["type"] as EventName<SubscribeEventType>,
  },
});
