"use client";

import React from "react";
import { createComponent, WebComponentProps } from "@lit/react";
import { 
  WyFeed as WyFeedWC,
  WyPosts as WyPostsWC,
  WyPostEditor as WyPostEditorWC,
} from "@weavy/uikit-web";
import { onWyAction, onWyApp, onWyPreviewClose, onWyPreviewOpen } from "./events";

// Creates a React component from a Lit component
export const WyFeed = createComponent({
  react: React,
  tagName: "wy-feed",
  elementClass: WyFeedWC,
  events: {
    onWyAction,
    onWyApp,
    onWyPreviewOpen,
    onWyPreviewClose
  },
});

export const WyPosts = createComponent({
  react: React,
  tagName: "wy-posts",
  elementClass: WyPostsWC,
  events: {
    onWyAction,
    onWyApp,
    onWyPreviewOpen,
    onWyPreviewClose
  },
});

export const WyPostEditor = createComponent({
  react: React,
  tagName: "wy-post-editor",
  elementClass: WyPostEditorWC,
  events: {
    onWyApp,
  },
});

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "wy-feed": WebComponentProps<WyFeedWC>;
      "wy-posts": WebComponentProps<WyPostsWC>;
      "wy-post-editor": WebComponentProps<WyPostEditorWC>;
    }
  }
}
