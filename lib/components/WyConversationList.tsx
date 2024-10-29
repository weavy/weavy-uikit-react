import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyConversationList = createComponent({
  react: React,
  tagName: "wy-conversation-list",
  elementClass: WeavyComponents.WyConversationList,
  events: {
    onConversationSelected: "conversation-selected" as EventName<
      CustomEvent<{
        id: number | undefined;
      }>
    >,
  },
});

export const WyConversationListItem = createComponent({
  react: React,
  tagName: "wy-conversation-list-item",
  elementClass: WeavyComponents.WyConversationListItem,
  events: {
    onRefetch: "refetch" as EventName<CustomEvent>,
    onSelected: "selected" as EventName<
      CustomEvent<{
        id: number;
      }>
    >,
    onStar: "star" as EventName<
      CustomEvent<{
        id: number;
        star: boolean;
      }>
    >,
    onPin: "pin" as EventName<
      CustomEvent<{
        id: number;
        pin: boolean;
      }>
    >,
    onMark: "mark" as EventName<
      CustomEvent<{
        id: number;
        markAsRead: boolean;
        messageId: number | undefined;
      }>
    >,
    onLeave: "leave" as EventName<
      CustomEvent<{
        id: number;
      }>
    >,
  },
});
