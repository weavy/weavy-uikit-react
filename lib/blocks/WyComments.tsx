'use client';

import React from "react";
import { createComponent } from "@lit/react";
import { WyComments as WyCommentsWC } from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyComments = createComponent({
  react: React,
  tagName: "wy-comments",
  elementClass: WyCommentsWC,
});
