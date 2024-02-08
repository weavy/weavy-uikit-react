import React from "react";
import { createComponent } from "@lit/react";
import {
  WyDropdown as WyDropdownWC,
  WyDropdownItem as WyDropdownItemWC,
  WyDropdownOption as WyDropdownOptionWC,
  WyDropdownDivider as WyDropdownDividerWC,
} from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyDropdown = createComponent({
  react: React,
  tagName: "wy-dropdown",
  elementClass: WyDropdownWC,
});

export const WyDropdownItem = createComponent({
  react: React,
  tagName: "wy-dropdown-item",
  elementClass: WyDropdownItemWC,
});

export const WyDropdownOption = createComponent({
  react: React,
  tagName: "wy-dropdown-option",
  elementClass: WyDropdownOptionWC,
});

export const WyDropdownDivider = createComponent({
  react: React,
  tagName: "wy-dropdown-divider",
  elementClass: WyDropdownDividerWC,
});
