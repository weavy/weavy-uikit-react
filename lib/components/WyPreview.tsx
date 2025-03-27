import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import { WyPreviewCloseEventType, WyPreviewOpenEventType } from "@weavy/uikit-web/dist/types/types/events.types.js";

// Creates a React component from a Lit component
export const WyPreview = createComponent({
  react: React,
  tagName: "wy-preview",
  elementClass: WeavyComponents.WyPreview,
  events: {
    onReleaseFocus: "release-focus" as EventName<CustomEvent>,
    onWyPreviewOpen: "wy-preview-open" satisfies WyPreviewOpenEventType["type"] as EventName<WyPreviewOpenEventType>,
    onWyPreviewClose: "wy-preview-close" satisfies WyPreviewCloseEventType["type"] as EventName<WyPreviewCloseEventType>,
  },
});

export const WyPreviewItem = createComponent({
  react: React,
  tagName: "wy-preview-item",
  elementClass: WeavyComponents.WyPreviewItem,
});

export const WyPreviewEmbed = createComponent({
  react: React,
  tagName: "wy-preview-embed",
  elementClass: WeavyComponents.WyPreviewEmbed,
});

export const WyPreviewIcon = createComponent({
  react: React,
  tagName: "wy-preview-icon",
  elementClass: WeavyComponents.WyPreviewIcon,
});

export const WyPreviewImage = createComponent({
  react: React,
  tagName: "wy-preview-image",
  elementClass: WeavyComponents.WyPreviewImage,
});

export const WyPreviewMedia = createComponent({
  react: React,
  tagName: "wy-preview-media",
  elementClass: WeavyComponents.WyPreviewMedia,
});

export const WyPreviewText = createComponent({
  react: React,
  tagName: "wy-preview-text",
  elementClass: WeavyComponents.WyPreviewText,
});

export type { WyPreviewOpenEventType, WyPreviewCloseEventType };