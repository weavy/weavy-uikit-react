import React from "react";
import { createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web"

// Creates a React component from a Lit component
export const WyAvatar = createComponent({
  react: React,
  tagName: "wy-avatar",
  elementClass: WeavyComponents.WyAvatar,
});

export const WyAvatarGroup = createComponent({
  react: React,
  tagName: "wy-avatar-group",
  elementClass: WeavyComponents.WyAvatarGroup,
});

export const WyAvatarHeader = createComponent({
  react: React,
  tagName: "wy-avatar-header",
  elementClass: WeavyComponents.WyAvatarHeader,
});