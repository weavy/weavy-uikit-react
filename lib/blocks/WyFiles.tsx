"use client";

import React from "react";
import { createComponent, EventName, WebComponentProps } from "@lit/react";
import { WY_FILES_TAGNAME, WyFiles as WyFilesWC } from "@weavy/uikit-web";
import { WyPreviewOpenEventType } from "@weavy/uikit-web/dist/types/types/files.types.js";

// Creates a React component from a Lit component
export const WyFiles = createComponent({
  react: React,
  tagName: WY_FILES_TAGNAME,
  elementClass: WyFilesWC,
  events: {
    onWyPreviewOpen:
      "wy-preview-open" satisfies WyPreviewOpenEventType["type"] as EventName<WyPreviewOpenEventType>,
  },
});

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      [WY_FILES_TAGNAME]: WebComponentProps<WyFilesWC>;
    }
  }
}

export type { WyPreviewOpenEventType };
