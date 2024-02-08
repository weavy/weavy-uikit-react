import React from "react";
import { createComponent } from "@lit/react";
import { WyButton as WyButtonWC } from "@weavy/uikit-web"

// Creates a React component from a Lit component
export const WyButton = createComponent({
  react: React,
  tagName: "wy-button",
  elementClass: WyButtonWC,
});

