"use client";

import React from "react";
import { createComponent, EventName, WebComponentProps } from "@lit/react";
import {
  WY_COMPONENT_TAGNAME,
  WyComponent as WyComponentWC,
} from "@weavy/uikit-web";
import { WyAppEventType } from "@weavy/uikit-web/dist/types/types/app.events.js";

// Creates a React component from a Lit component
export const WyComponent = createComponent({
  react: React,
  tagName: WY_COMPONENT_TAGNAME,
  elementClass: WyComponentWC,
  events: {
    onWyApp:
      "wy-app" satisfies WyAppEventType["type"] as EventName<WyAppEventType>,
  },
});

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      [WY_COMPONENT_TAGNAME]: WebComponentProps<WyComponentWC>;
    }
  }
}

export type { WyAppEventType };
