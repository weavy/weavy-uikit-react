"use client";

import React from "react";
import { createComponent, EventName, WebComponentProps } from "@lit/react";
import {
  WY_COMMENTS_TAGNAME,
  WyComments as WyCommentsWC,
} from "@weavy/uikit-web";
import { WyPreviewOpenEventType } from "@weavy/uikit-web/dist/types/types/events.types.js";

// Creates a React component from a Lit component
export const WyComments = createComponent({
  react: React,
  tagName: WY_COMMENTS_TAGNAME,
  elementClass: WyCommentsWC,
  events: {
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

export type { WyPreviewOpenEventType };
