"use client";

import React from "react";
import { createComponent, WebComponentProps } from "@lit/react";
import { WyChat as WyChatWC } from "@weavy/uikit-web";
import { onWyAction, onWyApp, onWyPreviewClose, onWyPreviewOpen } from "./events";

// Creates a React component from a Lit component
export const WyChat = createComponent({
  react: React,
  tagName: "wy-chat",
  elementClass: WyChatWC,
  events: {
    onWyApp,
    onWyAction,
    onWyPreviewOpen,
    onWyPreviewClose
  },
});

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "wy-chat": WebComponentProps<WyChatWC>;
    }
  }
}
