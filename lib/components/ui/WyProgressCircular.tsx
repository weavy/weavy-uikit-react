import React from "react";
import { createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyProgressCircular = createComponent({
  react: React,
  tagName: "wy-progress-circular",
  elementClass: WeavyComponents.WyProgressCircular,
});
