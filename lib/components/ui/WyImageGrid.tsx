import React from "react";
import { createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import { onWyAction } from "../../blocks/events";

// Creates a React component from a Lit component
export const WyImageGrid = createComponent({
  react: React,
  tagName: "wy-image-grid",
  elementClass: WeavyComponents.WyImageGrid,
  events: {
    onWyAction
  }
});
