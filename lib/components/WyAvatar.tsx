import React from "react";
import { createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web"

// Creates a React component from a Lit component
export const WyAvatar = createComponent({
  react: React,
  tagName: "wy-avatar",
  elementClass: WeavyComponents.WyAvatar,
});

