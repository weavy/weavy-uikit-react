import React from "react";
import { createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyNotificationBadge = createComponent({
  react: React,
  tagName: "wy-notification-badge",
  elementClass: WeavyComponents.WyNotificationBadge,
});

export const WyNotificationButtonList = createComponent({
  react: React,
  tagName: "wy-notification-button-list",
  elementClass: WeavyComponents.WyNotificationButtonList,
});

export const WyNotificationList = createComponent({
  react: React,
  tagName: "wy-notification-list",
  elementClass: WeavyComponents.WyNotificationList,
});

export const WyNotificationListitem = createComponent({
  react: React,
  tagName: "wy-notification-list-item",
  elementClass: WeavyComponents.WyNotificationListItem,
});
