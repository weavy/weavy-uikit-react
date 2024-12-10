'use client';

import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WyNotificationToasts as WyNotificationToastsWC } from "@weavy/uikit-web";
import type { WyLinkEventType } from "@weavy/uikit-web/dist/types/types/notifications.types.d.ts";

// Creates a React component from a Lit component
export const WyNotificationToasts = createComponent({
  react: React,
  tagName: "wy-notification-toasts",
  elementClass: WyNotificationToastsWC,
  events: {
    onWyLink: "wy:link" as EventName<
      WyLinkEventType
    >,
  },
});

export type { WyLinkEventType }