"use client";

import React from "react";
import { createComponent, EventName, WebComponentProps } from "@lit/react";
import {
  WY_MESSENGER_TAGNAME,
  WyMessenger as WyMessengerWC,
} from "@weavy/uikit-web";
import { WyPreviewOpenEventType } from "@weavy/uikit-web/dist/types/types/files.types.js";

// Creates a React component from a Lit component
export const WyMessenger = createComponent({
  react: React,
  tagName: WY_MESSENGER_TAGNAME,
  elementClass: WyMessengerWC,
  events: {
    onWyPreviewOpen:
      "wy-preview-open" satisfies WyPreviewOpenEventType["type"] as EventName<WyPreviewOpenEventType>,
  },
});

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      [WY_MESSENGER_TAGNAME]: WebComponentProps<WyMessengerWC>;
    }
  }
}

export type { WyPreviewOpenEventType };
