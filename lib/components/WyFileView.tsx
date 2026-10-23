import React from "react";
import { createComponent, EventName } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import type { FilePreviewLoadedEventType } from "@weavy/uikit-web/dist/types/types/files.events.d.js";

const onFilePreviewLoaded =
  "file-preview-loaded" satisfies FilePreviewLoadedEventType["type"] as EventName<FilePreviewLoadedEventType>;

// Creates a React component from a Lit component
export const WyFileView = createComponent({
  react: React,
  tagName: "wy-file-view",
  elementClass: WeavyComponents.WyFileView,
  events: {
    onFilePreviewLoaded
  },
});

export const WyFileViewEmbed = createComponent({
  react: React,
  tagName: "wy-file-view-embed",
  elementClass: WeavyComponents.WyFileViewEmbed,
  events: {
    onFilePreviewLoaded,
  },
});

export const WyFileViewIcon = createComponent({
  react: React,
  tagName: "wy-file-view-icon",
  elementClass: WeavyComponents.WyFileViewIcon,
  events: {
    onFilePreviewLoaded,
  },
});

export const WyFileViewImage = createComponent({
  react: React,
  tagName: "wy-file-view-image",
  elementClass: WeavyComponents.WyFileViewImage,
  events: {
    onFilePreviewLoaded,
  },
});

export const WyFileViewMedia = createComponent({
  react: React,
  tagName: "wy-file-view-media",
  elementClass: WeavyComponents.WyFileViewMedia,
  events: {
    onFilePreviewLoaded,
  },
});

export const WyFileViewText = createComponent({
  react: React,
  tagName: "wy-file-view-text",
  elementClass: WeavyComponents.WyFileViewText,
  events: {
    onFilePreviewLoaded,
  },
});
