import React from "react";
import { createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WySpinner = createComponent({
  react: React,
  tagName: "wy-spinner",
  elementClass: WeavyComponents.WySpinner,
});
