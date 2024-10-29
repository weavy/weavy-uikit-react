import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyEmbed = createComponent({
  react: React,
  tagName: "wy-embed",
  elementClass: WeavyComponents.WyEmbed,
  events: {
    onEmbedRemove: "embed-remove" as EventName<
      CustomEvent<{
        id: number;
      }>
    >,
    onEmbedSwap: "embed-swap" as EventName<CustomEvent>,
  },
});
