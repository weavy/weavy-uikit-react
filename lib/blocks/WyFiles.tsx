'use client';

import React from "react";
import { createComponent } from "@lit/react";
import { WyFiles as WyFilesWC } from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyFiles = createComponent({
  react: React,
  tagName: "wy-files",
  elementClass: WyFilesWC,
});
