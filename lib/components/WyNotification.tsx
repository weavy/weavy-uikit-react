import React from "react";
import { createComponent, EventName } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import type {
  NotificationCloseEventType,
  NotificationHideEventType,
  NotificationMarkEventType,
  NotificationSelectEventType,
} from "@weavy/uikit-web/dist/types/types/notifications.events.d.ts";
import { onWyAction } from "../blocks/events";

// Creates a React component from a Lit component

export const WyNotificationList = createComponent({
  react: React,
  tagName: "wy-notification-list",
  elementClass: WeavyComponents.WyNotificationList,
  events: {
    onWyAction
  }
});

export const WyNotificationHeader = createComponent({
  react: React,
  tagName: "wy-notification-header",
  elementClass: WeavyComponents.WyNotificationHeader,
});

export const WyNotificationListitem = createComponent({
  react: React,
  tagName: "wy-notification-list-item",
  elementClass: WeavyComponents.WyNotificationListItem,
  events: {
    onSelect: "select" satisfies NotificationSelectEventType["type"] as EventName<NotificationSelectEventType>,
    onMark: "mark" satisfies NotificationMarkEventType["type"] as EventName<NotificationMarkEventType>,
    onHide: "hide" satisfies NotificationHideEventType["type"] as EventName<NotificationHideEventType>,
    onClose: "close" satisfies NotificationCloseEventType["type"] as EventName<NotificationCloseEventType>,
  },
});
