import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import type { PollVoteEventType } from "@weavy/uikit-web/dist/types/types/polls.events.d.ts";
import type { TypingEventType } from "@weavy/uikit-web/dist/types/types/typing.events.d.ts";
import { onWyAction, onWyPreviewClose, onWyPreviewOpen } from "../blocks/events";

const onVote =
  "vote" satisfies PollVoteEventType["type"] as EventName<PollVoteEventType>;
const onTyping =
  "typing" satisfies TypingEventType["type"] as EventName<TypingEventType>;

// Creates a React component from a Lit component
export const WyMessage = createComponent({
  react: React,
  tagName: "wy-message",
  elementClass: WeavyComponents.WyMessage,
  events: {
    onVote,
    onWyAction,
    onWyPreviewOpen,
    onWyPreviewClose
  },
});

export const WyMessageTyping = createComponent({
  react: React,
  tagName: "wy-message-typing",
  elementClass: WeavyComponents.WyMessageTyping,
  events: {
    onTyping,
  },
});
