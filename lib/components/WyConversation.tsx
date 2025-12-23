import React from "react";
import { createComponent, EventName } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import type { CreateConversationEventType } from "@weavy/uikit-web/dist/types/types/conversation.events.d.ts";
import { onWyAction, onWyPreviewClose, onWyPreviewOpen } from "../blocks/events";

// Creates a React component from a Lit component
export const WyConversation = createComponent({
  react: React,
  tagName: "wy-conversation",
  elementClass: WeavyComponents.WyConversation,
  events: {
    onWyAction,
    onWyPreviewOpen,
    onWyPreviewClose
  }
});

export const WyConversationAppbar = createComponent({
  react: React,
  tagName: "wy-conversation-header",
  elementClass: WeavyComponents.WyConversationHeader,
  events: {
    onWyAction,
  },
});

export const WyConversationNew = createComponent({
  react: React,
  tagName: "wy-conversation-new",
  elementClass: WeavyComponents.WyConversationNew,
  events: {
    onSelected: "create" satisfies CreateConversationEventType["type"] as EventName<CreateConversationEventType>,
  },
});
