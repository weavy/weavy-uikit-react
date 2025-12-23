"use client";

import React from "react";
import { WebComponentProps, createComponent } from "@lit/react";
import {
  WyNotifications as WyNotificationsWC,
  WyNotificationBadge as WyNotificationBadgeWC,
  WyNotificationButton as WyNotificationButtonWC,
  WyNotificationToasts as WyNotificationToastsWC,
} from "@weavy/uikit-web";
import { onWyAction, onWyApp, onWyLink, onWyNotification, onWyUnread } from "./events";


// Creates a React component from a Lit component
export const WyNotifications = createComponent({
  react: React,
  tagName: "wy-notifications",
  elementClass: WyNotificationsWC,
  events: {
    onWyAction,
    onWyApp,
    onWyLink,
    onWyUnread
  },
});

// Creates a React component from a Lit component
export const WyNotificationBadge = createComponent({
  react: React,
  tagName: "wy-notification-badge",
  elementClass: WyNotificationBadgeWC,
  events: {
    onWyApp,
    onWyUnread,
  },
});

// Creates a React component from a Lit component
export const WyNotificationButton = createComponent({
  react: React,
  tagName: "wy-notification-button",
  elementClass: WyNotificationButtonWC,
  events: {
    onWyAction,
    onWyApp,
    onWyLink,
    onWyUnread,
  },
});

// Creates a React component from a Lit component
export const WyNotificationToasts = createComponent({
  react: React,
  tagName: "wy-notification-toasts",
  elementClass: WyNotificationToastsWC,
  events: {
    onWyApp,
    onWyLink,
    onWyNotification,
  },
});

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "wy-notifications": WebComponentProps<WyNotificationsWC>;
      "wy-notification-badge": WebComponentProps<WyNotificationBadgeWC>;
      "wy-notification-button": WebComponentProps<WyNotificationButtonWC>;
      "wy-notification-toasts": WebComponentProps<WyNotificationToastsWC>;
    }
  }
}
