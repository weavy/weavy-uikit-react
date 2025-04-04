"use client";

import React from "react";
import { createComponent, EventName, WebComponentProps } from "@lit/react";
import { WY_POSTS_TAGNAME, WyPosts as WyPostsWC } from "@weavy/uikit-web";
import { WyPreviewOpenEventType } from "@weavy/uikit-web/dist/types/types/files.events.js";
import { WyAppEventType } from "@weavy/uikit-web/dist/types/types/app.events.js";

// Creates a React component from a Lit component
export const WyPosts = createComponent({
  react: React,
  tagName: WY_POSTS_TAGNAME,
  elementClass: WyPostsWC,
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
      [WY_POSTS_TAGNAME]: WebComponentProps<WyPostsWC>;
    }
  }
}

export type { WyAppEventType, WyPreviewOpenEventType };
