"use client";

import React from "react";
import { createComponent, EventName, WebComponentProps } from "@lit/react";
import {
  WY_COMMENTS_TAGNAME,
  WyComments as WyCommentsWC,
} from "@weavy/uikit-web";
import { WyAppEventType } from "@weavy/uikit-web/dist/types/types/app.events.js";
import { WyPreviewOpenEventType } from "@weavy/uikit-web/dist/types/types/files.events.js";

// Creates a React component from a Lit component
export const WyComments = createComponent({
  react: React,
  tagName: WY_COMMENTS_TAGNAME,
  elementClass: WyCommentsWC,
  events: {
    onWyApp:
      "wy-app" satisfies WyAppEventType["type"] as EventName<WyAppEventType>,
    onWyPreviewOpen:
      "wy-preview-open" satisfies WyPreviewOpenEventType["type"] as EventName<WyPreviewOpenEventType>,
  },
});

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      [WY_COMMENTS_TAGNAME]: WebComponentProps<WyCommentsWC>;
    }
  }
}

export type { WyAppEventType, WyPreviewOpenEventType };
