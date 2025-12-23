import React from "react";
import { createComponent, EventName } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import { ClosedEventType, HideEventType } from "@weavy/uikit-web/dist/types/types/ui.events.d.js";

// Creates a React component from a Lit component
export const WyToasts = createComponent({
  react: React,
  tagName: "wy-toasts",
  elementClass: WeavyComponents.WyToasts,
  events: {
    onHide: "hide" satisfies HideEventType["type"] as EventName<HideEventType>,
  },
});

export const WyToast = createComponent({
  react: React,
  tagName: "wy-toast",
  elementClass: WeavyComponents.WyToast,
  events: {
    onClosed: "closed" satisfies ClosedEventType["type"] as EventName<ClosedEventType>,
  },
});
