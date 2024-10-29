import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyPoll = createComponent({
  react: React,
  tagName: "wy-poll",
  elementClass: WeavyComponents.WyPoll,
  events: {
    onReleaseFocus: "release-focus" as EventName<CustomEvent>,
    onVote: "vote" as EventName<
      CustomEvent<{
        id: number;
      }>
    >,
  },
});

export const WyPollOption = createComponent({
  react: React,
  tagName: "wy-poll-option",
  elementClass: WeavyComponents.WyPollOption,
  events: {
    onReleaseFocus: "release-focus" as EventName<CustomEvent>,
    onVote: "vote" as EventName<
      CustomEvent<{
        id: number;
      }>
    >,
  },
});
