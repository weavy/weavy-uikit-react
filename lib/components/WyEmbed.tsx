import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import type {
  EmbedRemoveEventType,
  EmbedSwapEventType,
} from "@weavy/uikit-web/dist/types/types/embeds.events.d.ts";
import { onWyAction } from "../blocks/events";

// Creates a React component from a Lit component
export const WyEmbed = createComponent({
  react: React,
  tagName: "wy-embed",
  elementClass: WeavyComponents.WyEmbed,
  events: {
    onWyAction,
  },
});

export const WyEmbedSelect = createComponent({
  react: React,
  tagName: "wy-embed-select",
  elementClass: WeavyComponents.WyEmbedSelect,
  events: {
    onEmbedRemove: "embed-remove" satisfies EmbedRemoveEventType["type"] as EventName<EmbedRemoveEventType>,
    onEmbedSwap: "embed-swap" satisfies EmbedSwapEventType["type"] as EventName<EmbedSwapEventType>,
  },
});
