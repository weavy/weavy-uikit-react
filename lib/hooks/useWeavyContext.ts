import React, { useEffect } from "react";
import { useController } from "@lit/react/use-controller.js";
import { ContextController, WeavyContext } from "@weavy/uikit-web";
import { Context } from "@weavy/uikit-web/dist/types/contexts/index.js";

/**
 * Hook to consume the Weavy context from the Weavy Web Components using the Context Community Protocol. 
 * The useWeavyContext(ref) must be used with an element reference from any child from the DOM tree since it relies on standard events in the DOM.
 * 
 * @see https://github.com/webcomponents-cg/community-protocols/blob/main/proposals/context.md
 * @param ref { React.RefObject | HTMLElement } - Reference object that needs to be placed in the DOM.
 * @param context { Context } - The context to use. Defaults to WeavyContext from ukit-web.
 * @returns Weavy instance 
 * @example
 * import React, { useRef } from "react"
 * import { useWeavyContext } from "@weavy/uikit-react"
 * 
 * export const MyComponent = () => {
 *   const domRef = useRef(null)
 *   const weavy = useWeavyContext(domRef)
 * 
 *   useEffect(() => {
 *     if (weavy) {
 *       console.log("We got weavy", weavy.version)
 *     }
 *   }, [weavy])
 * 
 *   // ...
 *   return (
 *     <>
 *       <span ref={domRef}></span>
 *     </>
 *   )
 * }
 */
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
