import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WySheet as WySheetWC } from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WySheet = createComponent({
  react: React,
  tagName: "wy-sheet",
  elementClass: WySheetWC,
  events: {
    onReleaseFocus: "release-focus" as EventName<CustomEvent>,
    onRemoveModal: "removeModal" as EventName<Event>,
  }
});
