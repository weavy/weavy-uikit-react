"use client";

import React from "react";
import { createComponent, WebComponentProps } from "@lit/react";
import { 
  WyFiles as WyFilesWC, 
  WyFile as WyFileWC, 
  WyFileNew as WyFileNewWC 
} from "@weavy/uikit-web";
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

export const WyFile = createComponent({
  react: React,
  tagName: "wy-file",
  elementClass: WyFileWC,
  events: {
    onWyApp,
    onWyAction,
    onWyPreviewOpen,
    onWyPreviewClose
  },
});

export const WyFileNew = createComponent({
  react: React,
  tagName: "wy-file-new",
  elementClass: WyFileNewWC,
  events: {
    onWyApp,
    onWyAction
  },
});

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "wy-files": WebComponentProps<WyFilesWC>;
      "wy-file": WebComponentProps<WyFileWC>;
      "wy-file-new": WebComponentProps<WyFileNewWC>;
    }
  }
}
