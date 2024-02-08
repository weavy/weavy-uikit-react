import React from "react";
import { EventName, createComponent } from "@lit/react";
import { 
  WyConversation as WyConversationWC,
  WyConversationNew as WyConversationNewWC,
} from "@weavy/uikit-web"

// Creates a React component from a Lit component
export const WyConversation = createComponent({
  react: React,
  tagName: "wy-conversation",
  elementClass: WyConversationWC,
  events: {
    onReleaseFocus: "release-focus" as EventName<CustomEvent>
  }
});

export const WyConversationNew = createComponent({
  react: React,
  tagName: "wy-conversation-new",
  elementClass: WyConversationNewWC,
  events: {
    onReleaseFocus: "release-focus" as EventName<CustomEvent>
  }
});

