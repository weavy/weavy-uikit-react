import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import type { OrderEventType } from "@weavy/uikit-web/dist/types/types/lists.events.d.ts";
import type { FileOrderType } from "@weavy/uikit-web/dist/types/types/files.types.d.ts";
import { onWyAction, onWyPreviewClose, onWyPreviewOpen } from "../blocks/events";

// Creates a React component from a Lit component
export const WyFilesList = createComponent({
  react: React,
  tagName: "wy-files-list",
  elementClass: WeavyComponents.WyFilesList,
  events: {
    onOrder: "order" satisfies OrderEventType<FileOrderType>["type"] as EventName<OrderEventType<FileOrderType>>,
    onWyAction,
    onWyPreviewOpen,
    onWyPreviewClose
  },
});
