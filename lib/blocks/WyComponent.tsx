"use client";

import React from "react";
import { createComponent, WebComponentProps } from "@lit/react";
import {
  WY_COMPONENT_TAGNAME,
  WyComponent as WyComponentWC,
} from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyComponent = createComponent({
  react: React,
  tagName: WY_COMPONENT_TAGNAME,
  elementClass: WyComponentWC,
});

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      [WY_COMPONENT_TAGNAME]: WebComponentProps<WyComponentWC>;
    }
  }
}
