"use client";

import React from "react";
import { createComponent, WebComponentProps } from "@lit/react";
import {
  WyComponent as WyComponentWC,
} from "@weavy/uikit-web";
import * as events from "./events";

// Creates a React component from a Lit component
export const WyComponent = createComponent({
  react: React,
  tagName: "wy-component",
  elementClass: WyComponentWC,
  events: {
    ...events
  },
});

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "wy-component": WebComponentProps<WyComponentWC>;
    }
  }
}
