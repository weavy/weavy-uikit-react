import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyOverlay = createComponent({
  react: React,
  tagName: "wy-overlay",
  elementClass: WeavyComponents.WyOverlay,
  events: {
    onReleaseFocus: "release-focus" as EventName<CustomEvent>,
    onClose: "close" as EventName<CustomEvent>
  }
});
