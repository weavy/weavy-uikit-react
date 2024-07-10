'use client';

import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WyNotifications as WyNotificationsWC } from "@weavy/uikit-web";
import { WyLinkEventType } from "@weavy/uikit-web/dist/types/types/notifications.types";

// Creates a React component from a Lit component
export const WyNotifications = createComponent({
  react: React,
  tagName: "wy-notifications",
  elementClass: WyNotificationsWC,
  events: {
    onWyLink: "wy:link" as EventName<
      WyLinkEventType
    >,
  },
});
