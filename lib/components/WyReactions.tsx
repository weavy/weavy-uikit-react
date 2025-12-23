import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import type { CloseEventType } from "@weavy/uikit-web/dist/types/types/ui.events.d.js";

const onClose = "close" satisfies CloseEventType["type"] as EventName<CloseEventType>;

// Creates a React component from a Lit component
export const WyReactions = createComponent({
  react: React,
  tagName: "wy-reactions",
  elementClass: WeavyComponents.WyReactions,
  events: {
    onClose
  },
});

export const WyReactionItem = createComponent({
  react: React,
  tagName: "wy-reaction-item",
  elementClass: WeavyComponents.WyReactionItem,
});
