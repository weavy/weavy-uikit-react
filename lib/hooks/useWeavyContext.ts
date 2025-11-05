import React, { useEffect } from "react";
import { useController } from "@lit/react/use-controller.js";
import { ContextController, WeavyContext } from "@weavy/uikit-web";
import { Context } from "@weavy/uikit-web/dist/types/contexts/index.js";

/**
 * Hook to consume the Weavy context from the Weavy Web Components using the Context Community Protocol. 
 * The useWeavyContext(ref) must be used with an element reference from any child from the DOM tree since it relies on standard events in the DOM.
 * 
 * @see https://github.com/webcomponents-cg/community-protocols/blob/main/proposals/context.md
 * @param ref { (() => HTMLElement) | HTMLElement } - Reference object or function returning a reference object. The object needs to be placed in the DOM.
 * @param context { Context } - The context to use. Defaults to WeavyContext from uikit-web.
 * @returns Weavy instance 
 * @example
 * import React, { useRef } from "react"
 * import { useWeavyContext } from "@weavy/uikit-react"
 * 
 * export const MyComponent = () => {
 *   const domRef = useRef(null)
 *   const weavy = useWeavyContext(() => domRef.current)
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
  ref: (() => TElement | null) | TElement | null,
  context?: TContext
) {
  // Using ref.current for backward compatibility only

  // eslint-disable-next-line react-hooks/refs
  const domRef = (typeof ref === "function" ? ref() : (ref && "current" in ref) ? ref.current as HTMLElement : ref) || undefined;

  const controller = useController(
    React,
    (host) => new ContextController(host, context ?? WeavyContext, domRef)
  );

  useEffect(() => {
    if (domRef) {
      controller.setRef(domRef);
    }
  // eslint-disable-next-line react-hooks/refs
  }, [controller, domRef]);

  return controller.context?.value;
}

export type { Context };
