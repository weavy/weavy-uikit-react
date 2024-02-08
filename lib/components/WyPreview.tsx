import React from "react";
import { EventName, createComponent } from "@lit/react";
import {
  WyPreview as WyPreviewWC,
  WyPreviewItem as WyPreviewItemWC,
  WyPreviewEmbed as WyPreviewEmbedWC,
  WyPreviewIcon as WyPreviewIconWC,
  WyPreviewImage as WyPreviewImageWC,
  WyPreviewMedia as WyPreviewMediaWC,
  WyPreviewText as WyPreviewTextWC,
} from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyPreview = createComponent({
  react: React,
  tagName: "wy-preview",
  elementClass: WyPreviewWC,
  events: {
    onReleaseFocus: "release-focus" as EventName<CustomEvent>,
  },
});

export const WyPreviewItem = createComponent({
  react: React,
  tagName: "wy-preview-item",
  elementClass: WyPreviewItemWC,
});

export const WyPreviewEmbed = createComponent({
  react: React,
  tagName: "wy-preview-embed",
  elementClass: WyPreviewEmbedWC,
});

export const WyPreviewIcon = createComponent({
  react: React,
  tagName: "wy-preview-icon",
  elementClass: WyPreviewIconWC,
});

export const WyPreviewImage = createComponent({
  react: React,
  tagName: "wy-preview-image",
  elementClass: WyPreviewImageWC,
});

export const WyPreviewMedia = createComponent({
  react: React,
  tagName: "wy-preview-media",
  elementClass: WyPreviewMediaWC,
});

export const WyPreviewText = createComponent({
  react: React,
  tagName: "wy-preview-text",
  elementClass: WyPreviewTextWC,
});
