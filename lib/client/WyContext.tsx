"use client";

import React, { useRef } from "react";
import { createComponent } from "@lit/react";

import {
  WyContext as WyContextWC,
} from "@weavy/uikit-web";
import { useWeavyContext } from "../hooks";
import { WeavyContext } from "./weavy";


// Creates a React component from a Lit component
const WyContextComponent = createComponent({
  react: React,
  tagName: "wy-context",
  elementClass: WyContextWC,
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
