import React from "react";
import { createComponent } from "@lit/react";
import { WyPortal as WyPortalWC } from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyPortal = createComponent({
  react: React,
  tagName: "wy-portal",
  elementClass: WyPortalWC,
});
