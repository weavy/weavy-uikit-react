import React from "react";
import { createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import { onWyAction } from "../blocks/events";

// Creates a React component from a Lit component
export const WyAttachment = createComponent({
  react: React,
  tagName: "wy-attachment",
  elementClass: WeavyComponents.WyAttachment,
  events: {
    onWyAction
  },
});

export const WyAttachmentList = createComponent({
  react: React,
  tagName: "wy-attachment-list",
  elementClass: WeavyComponents.WyAttachmentList,
  events: {
    onWyAction,
  },
});
