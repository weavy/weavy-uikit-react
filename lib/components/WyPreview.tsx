import React from "react";
import { createComponent, EventName } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import {
  onWyAction,
  onWyPreviewClose,
  onWyPreviewOpen,
} from "../blocks/events";
import type { FilePreviewLoadedEventType } from "@weavy/uikit-web/dist/types/types/files.events.d.js";

const onFilePreviewLoaded =
  "file-preview-loaded" satisfies FilePreviewLoadedEventType["type"] as EventName<FilePreviewLoadedEventType>;

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

export const WyPreviewEmbed = createComponent({
  react: React,
  tagName: "wy-preview-embed",
  elementClass: WeavyComponents.WyPreviewEmbed,
  events: {
    onFilePreviewLoaded,
  },
});

export const WyPreviewIcon = createComponent({
  react: React,
  tagName: "wy-preview-icon",
  elementClass: WeavyComponents.WyPreviewIcon,
  events: {
    onFilePreviewLoaded,
  },
});

export const WyPreviewImage = createComponent({
  react: React,
  tagName: "wy-preview-image",
  elementClass: WeavyComponents.WyPreviewImage,
  events: {
    onFilePreviewLoaded,
  },
});

export const WyPreviewItem = createComponent({
  react: React,
  tagName: "wy-preview-item",
  elementClass: WeavyComponents.WyPreviewItem,
  events: {
    onFilePreviewLoaded,
  },
});

export const WyPreviewMedia = createComponent({
  react: React,
  tagName: "wy-preview-media",
  elementClass: WeavyComponents.WyPreviewMedia,
  events: {
    onFilePreviewLoaded,
  },
});

export const WyPreviewText = createComponent({
  react: React,
  tagName: "wy-preview-text",
  elementClass: WeavyComponents.WyPreviewText,
  events: {
    onFilePreviewLoaded,
  },
});
