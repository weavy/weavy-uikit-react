import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyReactions = createComponent({
  react: React,
  tagName: "wy-reactions",
  elementClass: WeavyComponents.WyReactions,
  events: {
    onReleaseFocus: "release-focus" as EventName<CustomEvent>,
  },
});

export const WyReactionItem = createComponent({
  react: React,
  tagName: "wy-reaction-item",
  elementClass: WeavyComponents.WyReactionItem,
});
