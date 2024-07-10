'use client';

import React from "react";
import { createComponent } from "@lit/react";
import { WyChat as WyChatWC } from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyChat = createComponent({
  react: React,
  tagName: "wy-chat",
  elementClass: WyChatWC,
});
