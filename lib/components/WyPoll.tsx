import React from "react";
import { EventName, createComponent } from "@lit/react";
import {
  WyPoll as WyPollWC,
  WyPollOption as WyPollOptionWC,
} from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyPoll = createComponent({
  react: React,
  tagName: "wy-poll",
  elementClass: WyPollWC,
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
  elementClass: WyPollOptionWC,
  events: {
    onReleaseFocus: "release-focus" as EventName<CustomEvent>,
    onVote: "vote" as EventName<
      CustomEvent<{
        id: number;
      }>
    >,
  },
});
