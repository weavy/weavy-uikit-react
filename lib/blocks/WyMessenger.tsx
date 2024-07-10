'use client';

import React from "react";
import { createComponent } from "@lit/react";
import { WyMessenger as WyMessengerWC } from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyMessenger = createComponent({
  react: React,
  tagName: "wy-messenger",
  elementClass: WyMessengerWC,
});
