import React from "react";
import { createComponent, EventName } from "@lit/react";
import {
  WyToasts as WyToastsWC,
  WyToast as WyToastWC,
} from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyToasts = createComponent({
  react: React,
  tagName: "wy-toasts",
  elementClass: WyToastsWC,
  events: {
    onHide: "hide" as EventName<CustomEvent>,
    onReleaseFocus: "release-focus" as EventName<CustomEvent>,
  },
});

export const WyToast = createComponent({
  react: React,
  tagName: "wy-toast",
  elementClass: WyToastWC,
  events: {
    onHide: "closed" as EventName<
      CustomEvent<{
        silent: boolean;
      }>
    >,
    onReleaseFocus: "release-focus" as EventName<CustomEvent>,
  },
});
