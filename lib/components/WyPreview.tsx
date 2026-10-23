import React from "react";
import { createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import {
  onWyAction,
  onWyPreviewClose,
  onWyPreviewOpen,
} from "../blocks/events";

// Creates a React component from a Lit component
export const WyPreview = createComponent({
  react: React,
  tagName: "wy-preview",
  elementClass: WeavyComponents.WyPreview,
  events: {
    onWyPreviewOpen,
    onWyPreviewClose,
    onWyAction,
  },
});
