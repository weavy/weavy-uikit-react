import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyConversation = createComponent({
  react: React,
  tagName: "wy-conversation",
  elementClass: WeavyComponents.WyConversation,
  events: {
    onReleaseFocus: "release-focus" as EventName<CustomEvent>,
  },
});

export const WyConversationAppbar = createComponent({
  react: React,
  tagName: "wy-conversation-appbar",
  elementClass: WeavyComponents.WyConversationAppbar,
  events: {
    onReleaseFocus: "release-focus" as EventName<CustomEvent>,
  },
});

export const WyConversationNew = createComponent({
  react: React,
  tagName: "wy-conversation-new",
  elementClass: WeavyComponents.WyConversationNew,
  events: {
    onReleaseFocus: "release-focus" as EventName<CustomEvent>,
  },
});
