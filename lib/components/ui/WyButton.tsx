import React from "react";
import { createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web"

// Creates a React component from a Lit component
export const WyButton = createComponent({
  react: React,
  tagName: "wy-button",
  elementClass: WeavyComponents.WyButton,
});

export const WyButtons = createComponent({
  react: React,
  tagName: "wy-buttons",
  elementClass: WeavyComponents.WyButtons,
});

