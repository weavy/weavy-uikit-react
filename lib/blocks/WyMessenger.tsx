"use client";

import React from "react";
import { createComponent, WebComponentProps } from "@lit/react";
import {
  WyMessenger as WyMessengerWC,
  WyMessengerBadge as WyMessengerBadgeWC,
  WyMessengerButton as WyMessengerButtonWC,
  WyConversations as WyConversationsWC,
  WyMessengerNew as WyMessengerNewWC,
} from "@weavy/uikit-web";
import { onWyAction, onWyApp, onWyPreviewClose, onWyPreviewOpen, onWyUnread } from "./events";

// Creates a React component from a Lit component
export const WyMessenger = createComponent({
  react: React,
  tagName: "wy-messenger",
  elementClass: WyMessengerWC,
  events: {
    onWyAction,
    onWyApp,
    onWyPreviewOpen,
    onWyPreviewClose,
    onWyUnread,
  },
});

// Creates a React component from a Lit component
export const WyMessengerBadge = createComponent({
  react: React,
  tagName: "wy-messenger-badge",
  elementClass: WyMessengerBadgeWC,
  events: {
    onWyUnread,
  },
});

// Creates a React component from a Lit component
export const WyMessengerButton = createComponent({
  react: React,
  tagName: "wy-messenger-button",
  elementClass: WyMessengerButtonWC,
  events: {
    onWyAction,
    onWyApp,
    onWyPreviewOpen,
    onWyPreviewClose,
    onWyUnread,
  },
});

// Creates a React component from a Lit component
export const WyConversations = createComponent({
  react: React,
  tagName: "wy-conversations",
  elementClass: WyConversationsWC,
  events: {
    onWyAction,
    onWyApp,
    onWyUnread,
  },
});

// Creates a React component from a Lit component
export const WyMessengerNew = createComponent({
  react: React,
  tagName: "wy-messenger-new",
  elementClass: WyMessengerNewWC,
  events: {
    onWyApp,
  },
});

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "wy-messenger": WebComponentProps<WyMessengerWC>;
      "wy-messenger-badge": WebComponentProps<WyMessengerBadgeWC>;
      "wy-messenger-button": WebComponentProps<WyMessengerButtonWC>;
      "wy-conversations": WebComponentProps<WyConversationsWC>;
      "wy-messenger-new": WebComponentProps<WyMessengerNewWC>;
    }
  }
}
