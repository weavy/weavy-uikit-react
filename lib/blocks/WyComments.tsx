"use client";

import React from "react";
import { createComponent, WebComponentProps } from "@lit/react";
import {
  WyComments as WyCommentsWC,
} from "@weavy/uikit-web";
import { onWyAction, onWyApp, onWyPreviewClose, onWyPreviewOpen } from "./events";

// Creates a React component from a Lit component
export const WyComments = createComponent({
  react: React,
  tagName: "wy-comments",
  elementClass: WyCommentsWC,
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
      "wy-comments": WebComponentProps<WyCommentsWC>;
    }
  }
}
