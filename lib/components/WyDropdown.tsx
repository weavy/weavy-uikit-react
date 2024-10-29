import React from "react";
import { createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyDropdown = createComponent({
  react: React,
  tagName: "wy-dropdown",
  elementClass: WeavyComponents.WyDropdown,
});

export const WyDropdownItem = createComponent({
  react: React,
  tagName: "wy-dropdown-item",
  elementClass: WeavyComponents.WyDropdownItem,
});

export const WyDropdownOption = createComponent({
  react: React,
  tagName: "wy-dropdown-option",
  elementClass: WeavyComponents.WyDropdownOption,
});

export const WyDropdownDivider = createComponent({
  react: React,
  tagName: "wy-dropdown-divider",
  elementClass: WeavyComponents.WyDropdownDivider,
});
