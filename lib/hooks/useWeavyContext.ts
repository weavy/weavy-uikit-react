import React, { useEffect } from "react";
import { useController } from "@lit/react/use-controller.js";
import { ContextController, WeavyContext } from "@weavy/uikit-web";
import { Context } from "@weavy/uikit-web/dist/types/contexts/index.js";

export function useWeavyContext<TContext extends Context<unknown, unknown> = typeof WeavyContext, TElement extends HTMLElement = HTMLElement>(
  ref: React.RefObject<TElement> | TElement | null,
  context?: TContext
) {
  const isRef = (r: typeof ref): r is React.RefObject<TElement> => {
    return Boolean(r) && (r as React.RefObject<TElement>).current !== undefined
}
  const domRef = (isRef(ref) ? ref.current : ref) || undefined;

  const controller = useController(
    React,
    (host) => new ContextController(host, context ?? WeavyContext, domRef)
  );

  useEffect(() => {
    if (domRef) {
      controller.ref = domRef;
    }
  }, [controller, domRef]);

  return controller.context?.value;
}

export type { Context };
