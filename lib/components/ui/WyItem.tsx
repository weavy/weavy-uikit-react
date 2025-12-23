import React from "react";
import { createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyItem = createComponent({
  react: React,
  tagName: "wy-item",
  elementClass: WeavyComponents.WyItem
});

export const WyItemList = createComponent({
  react: React,
  tagName: "wy-item-list",
  elementClass: WeavyComponents.WyItemList
});
