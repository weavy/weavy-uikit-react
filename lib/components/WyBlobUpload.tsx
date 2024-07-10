import React from "react";
import { createComponent } from "@lit/react";
import { WyBlobUpload as WyBlobUploadWC } from "@weavy/uikit-web"

// Creates a React component from a Lit component
export const WyBlobUpload = createComponent({
  react: React,
  tagName: "wy-blob-upload",
  elementClass: WyBlobUploadWC,
});

