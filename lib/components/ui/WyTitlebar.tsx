import React from "react";
import { createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyTitlebar = createComponent({
  react: React,
  tagName: "wy-titlebar",
  elementClass: WeavyComponents.WyTitlebar,
});

export const WyTitlebarText = createComponent({
  react: React,
  tagName: "wy-titlebar-text",
  elementClass: WeavyComponents.WyTitlebarText,
});