import React from "react";
import { createComponent } from "@lit/react";
import { WyMeetingCard as WyMeetingCardWC } from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyMeetingCard = createComponent({
  react: React,
  tagName: "wy-meeting-card",
  elementClass: WyMeetingCardWC,
});
