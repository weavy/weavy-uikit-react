import React from "react";
import {  createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import { onWyAction } from "../blocks/events";

// Creates a React component from a Lit component
export const WyAnnotation = createComponent({
  react: React,
  tagName: "wy-annotation",
  elementClass: WeavyComponents.WyAnnotation,
});

export const WyAnnotationList = createComponent({
  react: React,
  tagName: "wy-annotation-list",
  elementClass: WeavyComponents.WyAnnotationList,
  events: {
    onWyAction
  },
});
