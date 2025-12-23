import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import type {
  LeaveEventType,
  PinEventType,
  RemoveEventType,
  SelectedEventType,
  StarEventType,
  TrashEventType,
} from "@weavy/uikit-web/dist/types/types/app.events.d.ts";
import type { MessagesMarkEventType } from "@weavy/uikit-web/dist/types/types/messages.events.d.ts";
import { onWyAction } from "../blocks/events";

// Creates a React component from a Lit component
export const WyConversationList = createComponent({
  react: React,
  tagName: "wy-conversation-list",
  elementClass: WeavyComponents.WyConversationList,
  events: {
    onWyAction,
  },
});

export const WyConversationItem = createComponent({
  react: React,
  tagName: "wy-conversation-item",
  elementClass: WeavyComponents.WyConversationItem,
  events: {
    onSelected: "selected" satisfies SelectedEventType["type"] as EventName<SelectedEventType>,
    onStar: "star" satisfies StarEventType["type"] as EventName<StarEventType>,
    onPin: "pin" satisfies PinEventType["type"] as EventName<PinEventType>,
    onMark: "mark" satisfies MessagesMarkEventType["type"] as EventName<MessagesMarkEventType>,
    onLeave: "leave" satisfies LeaveEventType["type"] as EventName<LeaveEventType>,
    onRemove: "remove" satisfies RemoveEventType["type"] as EventName<RemoveEventType>,
    onTrash: "trash" satisfies TrashEventType["type"] as EventName<TrashEventType>,
  },
});
