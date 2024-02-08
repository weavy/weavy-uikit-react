import React from "react";
import { createComponent } from "@lit/react";
import { WyPresence as WyPresenceWC } from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyPresence = createComponent({
  react: React,
  tagName: "wy-presence",
  elementClass: WyPresenceWC,
});
