"use client";

import React from "react";
import { createComponent, EventName, WebComponentProps } from "@lit/react";
import { WY_COPILOT_TAGNAME, WyCopilot as WyCopilotWC } from "@weavy/uikit-web";
import {
  WyAppEventType,
  WyMessageEventType,
  WyPreviewOpenEventType,
} from "@weavy/uikit-web/dist/types/types/events.types.js";

// Creates a React component from a Lit component
export const WyCopilot = createComponent({
  react: React,
  tagName: WY_COPILOT_TAGNAME,
  elementClass: WyCopilotWC,
  events: {
    onWyPreviewOpen:
      "wy-preview-open" satisfies WyPreviewOpenEventType["type"] as EventName<WyPreviewOpenEventType>,
    onWyApp:
      "wy-app" satisfies WyAppEventType["type"] as EventName<WyAppEventType>,
    onWyMessage:
      "wy-message" satisfies WyMessageEventType["type"] as EventName<WyMessageEventType>,
  },
});

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      [WY_COPILOT_TAGNAME]: WebComponentProps<WyCopilotWC>;
    }
  }
}

export type {
  WyPreviewOpenEventType,
  WyAppEventType,
  WyMessageEventType,
};
