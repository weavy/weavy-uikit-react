"use client";

import React from "react";
import { EventName, WebComponentProps, createComponent } from "@lit/react";
import {
  WY_NOTIFICATION_TOASTS_TAGNAME,
  WyNotificationToasts as WyNotificationToastsWC,
} from "@weavy/uikit-web";
import type {
  WyLinkEventType,
  WyNotificationEventType,
} from "@weavy/uikit-web/dist/types/types/notifications.types.d.ts";

// Creates a React component from a Lit component
export const WyNotificationToasts = createComponent({
  react: React,
  tagName: WY_NOTIFICATION_TOASTS_TAGNAME,
  elementClass: WyNotificationToastsWC,
  events: {
    onWyLink:
      "wy-link" satisfies WyLinkEventType["type"] as EventName<WyLinkEventType>,
    onWyNotification:
      "wy-notification" satisfies WyNotificationEventType["type"] as EventName<WyNotificationEventType>,
  },
});

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      [WY_NOTIFICATION_TOASTS_TAGNAME]: WebComponentProps<WyNotificationToastsWC>;
    }
  }
}

export type { WyLinkEventType };
