import React from "react";
import { EventName, createComponent } from "@lit/react";
import {
  WyReactions as WyReactionsWC,
  WyReactionItem as WyReactionItemWC,
} from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyReactions = createComponent({
  react: React,
  tagName: "wy-reactions",
  elementClass: WyReactionsWC,
  events: {
    onReleaseFocus: "release-focus" as EventName<CustomEvent>,
  },
});

export const WyReactionItem = createComponent({
  react: React,
  tagName: "wy-reaction-item",
  elementClass: WyReactionItemWC,
});
