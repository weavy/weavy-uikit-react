import React from "react";
import { createComponent } from "@lit/react";
import { WyEmpty as WyEmptyWC } from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyEmpty = createComponent({
  react: React,
  tagName: "wy-empty",
  elementClass: WyEmptyWC,
});
