import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WyEmbed as WyEmbedWC } from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyEmbed = createComponent({
  react: React,
  tagName: "wy-embed",
  elementClass: WyEmbedWC,
  events: {
    onEmbedRemove: "embed-remove" as EventName<
      CustomEvent<{
        id: number;
      }>
    >,
    onEmbedSwap: "embed-swap" as EventName<CustomEvent>,
  },
});
