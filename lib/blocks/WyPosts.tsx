'use client';

import React from "react";
import { createComponent } from "@lit/react";
import { WyPosts as WyPostsWC } from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyPosts = createComponent({
  react: React,
  tagName: "wy-posts",
  elementClass: WyPostsWC,
});
