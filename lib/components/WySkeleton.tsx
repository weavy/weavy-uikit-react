import React from "react";
import { createComponent } from "@lit/react";
import { WySkeleton as WySkeletonWC } from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WySkeleton = createComponent({
  react: React,
  tagName: "wy-skeleton",
  elementClass: WySkeletonWC,
});
