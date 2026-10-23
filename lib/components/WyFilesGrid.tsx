import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import type {
  FileOrderType,
} from "@weavy/uikit-web/dist/types/types/files.types.d.ts";
import type { OrderEventType } from "@weavy/uikit-web/dist/types/types/lists.events.d.ts";
import { onWyAction } from "../blocks/events";

// Creates a React component from a Lit component
export const WyFileGrid = createComponent({
  react: React,
  tagName: "wy-file-grid",
  elementClass: WeavyComponents.WyFilesGrid,
  events: {
    onWyAction,
    onOrder: "order" satisfies OrderEventType<FileOrderType>["type"] as EventName<OrderEventType<FileOrderType>>,
  },
});
