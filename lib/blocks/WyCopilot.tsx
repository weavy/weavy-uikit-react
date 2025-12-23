"use client";

import React from "react";
import { createComponent, WebComponentProps } from "@lit/react";
import { WyCopilot as WyCopilotWC } from "@weavy/uikit-web";
import { onWyAction, onWyApp, onWyMessage, onWyPreviewClose, onWyPreviewOpen } from "./events";

// Creates a React component from a Lit component
export const WyCopilot = createComponent({
  react: React,
  tagName: "wy-copilot",
  elementClass: WyCopilotWC,
  events: {
    onWyApp,
    onWyAction,
    onWyMessage,
    onWyPreviewOpen,
    onWyPreviewClose
  },
});

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "wy-copilot": WebComponentProps<WyCopilotWC>;
    }
  }
}
