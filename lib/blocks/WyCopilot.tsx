"use client";

import React from "react";
import { createComponent, EventName, WebComponentProps } from "@lit/react";
import { WY_COPILOT_TAGNAME, WyCopilot as WyCopilotWC } from "@weavy/uikit-web";
import type { WyAppEventType } from "@weavy/uikit-web/dist/types/types/app.events.js";
import type { WyMessageEventType } from "@weavy/uikit-web/dist/types/types/messages.events.js";
import type { WyPreviewOpenEventType } from "@weavy/uikit-web/dist/types/types/files.events.js";

// Creates a React component from a Lit component
export const WyCopilot = createComponent({
  react: React,
  tagName: WY_COPILOT_TAGNAME,
  elementClass: WyCopilotWC,
  events: {
    onWyApp:
      "wy-app" satisfies WyAppEventType["type"] as EventName<WyAppEventType>,
    onWyMessage:
      "wy-message" satisfies WyMessageEventType["type"] as EventName<WyMessageEventType>,
    onWyPreviewOpen:
      "wy-preview-open" satisfies WyPreviewOpenEventType["type"] as EventName<WyPreviewOpenEventType>,
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

export type { WyPreviewOpenEventType, WyAppEventType, WyMessageEventType };
