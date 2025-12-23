import React from "react";
import { createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyIcon = createComponent({
  react: React,
  tagName: "wy-icon",
  elementClass: WeavyComponents.WyIcon,
});

export const WyIconStack = createComponent({
  react: React,
  tagName: "wy-icon-stack",
  elementClass: WeavyComponents.WyIconStack,
});

export const WyIconDisplay = createComponent({
  react: React,
  tagName: "wy-icon-display",
  elementClass: WeavyComponents.WyIconDisplay,
});