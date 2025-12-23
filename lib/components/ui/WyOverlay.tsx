import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import { CloseEventType } from "@weavy/uikit-web/dist/types/types/ui.events.d.js";

// Creates a React component from a Lit component
export const WyOverlay = createComponent({
  react: React,
  tagName: "wy-overlay",
  elementClass: WeavyComponents.WyOverlay,
  events: {
    onClose: "close" satisfies CloseEventType["type"] as EventName<CloseEventType>
  }
});
