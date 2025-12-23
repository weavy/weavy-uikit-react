"use client";

import React from "react";
import { createComponent, WebComponentProps } from "@lit/react";
import { WyPosts as WyPostsWC } from "@weavy/uikit-web";
import { onWyAction, onWyApp, onWyPreviewClose, onWyPreviewOpen } from "./events";

// Creates a React component from a Lit component
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

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "wy-posts": WebComponentProps<WyPostsWC>;
    }
  }
}
