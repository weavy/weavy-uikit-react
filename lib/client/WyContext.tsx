"use client";

import React, { useRef } from "react";
import { createComponent, EventName, WebComponentProps } from "@lit/react";
import {
  WY_CONTEXT_TAGNAME,
  WyContext as WyContextWC,
  WyNotificationsEventType,
} from "@weavy/uikit-web";
import { useWeavyContext } from "../hooks";
import { WeavyContext } from "./weavy";

// Creates a React component from a Lit component
const WyContextComponent = createComponent({
  react: React,
  tagName: WY_CONTEXT_TAGNAME,
  elementClass: WyContextWC,
  events: {
    onWyNotifications:
      "wy-notifications" satisfies WyNotificationsEventType["type"] as EventName<WyNotificationsEventType>,
  },
});

// Injects a React context provider
export function WyContext({
  children,
  ...props
}: React.ComponentProps<typeof WyContextComponent>) {
  const contextRef = useRef(null);
  const weavy = useWeavyContext(contextRef.current);
  return (
    <WyContextComponent ref={contextRef} {...props}>
      <WeavyContext.Provider value={weavy ?? null}>
        {children}
      </WeavyContext.Provider>
    </WyContextComponent>
  );
}

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      [WY_CONTEXT_TAGNAME]: WebComponentProps<WyContextWC>;
    }
  }
}
