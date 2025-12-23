"use client";

import React from "react";
import { createComponent, WebComponentProps } from "@lit/react";
import { WyFiles as WyFilesWC } from "@weavy/uikit-web";
import { onWyAction, onWyApp, onWyPreviewClose, onWyPreviewOpen } from "./events";

// Creates a React component from a Lit component
export const WyFiles = createComponent({
  react: React,
  tagName: "wy-files",
  elementClass: WyFilesWC,
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
      "wy-files": WebComponentProps<WyFilesWC>;
    }
  }
}
