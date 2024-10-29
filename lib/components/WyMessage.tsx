import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import { PollOptionType } from "@weavy/uikit-web/dist/types/types/polls.types.d.ts";

// Creates a React component from a Lit component
export const WyMessage = createComponent({
  react: React,
  tagName: "wy-message",
  elementClass: WeavyComponents.WyMessage,
});

export const WyMessages = createComponent({
  react: React,
  tagName: "wy-messages",
  elementClass: WeavyComponents.WyMessages,
  events: {
    onScrollToBottom: "scroll-to-bottom" as EventName<CustomEvent>,
  },
});

export const WyMessageEditor = createComponent({
  react: React,
  tagName: "wy-message-editor",
  elementClass: WeavyComponents.WyMessageEditor,
  events: {
    onSubmit: "submit" as EventName<
      CustomEvent<{
        text: string | undefined;
        meetingId: number | undefined;
        blobs: (number | undefined)[] | undefined;
        attachments: number[];
        pollOptions: PollOptionType[];
        embed: number;
      }>
    >,
  },
});

export const WyMessageTyping = createComponent({
  react: React,
  tagName: "wy-message-typing",
  elementClass: WeavyComponents.WyMessageTyping,
});
