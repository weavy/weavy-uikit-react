import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import type { PollVoteEventType } from "@weavy/uikit-web/dist/types/types/polls.events.d.ts";

// Creates a React component from a Lit component
export const WyPoll = createComponent({
  react: React,
  tagName: "wy-poll",
  elementClass: WeavyComponents.WyPoll,
  events: {
    onVote:
      "vote" satisfies PollVoteEventType["type"] as EventName<PollVoteEventType>,
  },
});

export const WyPollOption = createComponent({
  react: React,
  tagName: "wy-poll-option",
  elementClass: WeavyComponents.WyPollOption,
  events: {
    onVote:
      "vote" satisfies PollVoteEventType["type"] as EventName<PollVoteEventType>,
  },
});
