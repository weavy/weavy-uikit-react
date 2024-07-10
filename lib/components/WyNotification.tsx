import React from "react";
import { createComponent } from "@lit/react";
import { 
  WyNotificationBadge as WyNotificationBadgeWC,
  WyNotificationButtonList as WyNotificationButtonListWC,
  WyNotificationList as WyNotificationListWC,
  WyNotificationListItem as WyNotificationListItemWC,
} from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyNotificationBadge = createComponent({
  react: React,
  tagName: "wy-notification-badge",
  elementClass: WyNotificationBadgeWC
});

export const WyNotificationButtonList = createComponent({
  react: React,
  tagName: "wy-notification-button-list",
  elementClass: WyNotificationButtonListWC
});

export const WyNotificationList = createComponent({
  react: React,
  tagName: "wy-notification-list",
  elementClass: WyNotificationListWC
});

export const WyNotificationListitem = createComponent({
  react: React,
  tagName: "wy-notification-list-item",
  elementClass: WyNotificationListItemWC
});
