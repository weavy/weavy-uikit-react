import React from "react";
import { createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web"

// Creates a React component from a Lit component
export const WyBadge = createComponent({
  react: React,
  tagName: "wy-badge",
  elementClass: WeavyComponents.WyBadge,
});
