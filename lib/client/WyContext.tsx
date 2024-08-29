"use client";

import React from "react";
import { createComponent } from "@lit/react";
import { WyContext as WyContextWC } from "@weavy/uikit-web";

// Creates a React component from a Lit component
const WeavyContext = createComponent({
  react: React,
  tagName: "wy-context",
  elementClass: WyContextWC,
})

export { WeavyContext as default };