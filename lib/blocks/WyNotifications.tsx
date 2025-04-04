"use client";

import React from "react";
import { EventName, WebComponentProps, createComponent } from "@lit/react";
import {
  WY_NOTIFICATIONS_TAGNAME,
  WyNotifications as WyNotificationsWC,
} from "@weavy/uikit-web";
import type { WyLinkEventType } from "@weavy/uikit-web/dist/types/types/notifications.events.d.ts";
import type { WyAppEventType } from "@weavy/uikit-web/dist/types/types/app.events.js";

// Creates a React component from a Lit component
export const WyNotifications = createComponent({
  react: React,
  tagName: WY_NOTIFICATIONS_TAGNAME,
  elementClass: WyNotificationsWC,
  events: {
    onWyApp:
      "wy-app" satisfies WyAppEventType["type"] as EventName<WyAppEventType>,
    onWyLink:
      "wy-link" satisfies WyLinkEventType["type"] as EventName<WyLinkEventType>,
  },
});

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      [WY_NOTIFICATIONS_TAGNAME]: WebComponentProps<WyNotificationsWC>;
    }
  }
}

export type { WyAppEventType, WyLinkEventType };
