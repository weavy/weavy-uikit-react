import React from "react";
import { EventName, createComponent } from "@lit/react";
import { 
  WyMessage as WyMessageWC,
  WyMessages as WyMessagesWC,
  WyMessageEditor as WyMessageEditorWC,
  WyMessageTyping as WyMessageTypingWC
} from "@weavy/uikit-web";
import { PollOptionType } from "@weavy/uikit-web/dist/types/types/polls.types.d.ts";

// Creates a React component from a Lit component
export const WyMessage = createComponent({
  react: React,
  tagName: "wy-message",
  elementClass: WyMessageWC,
});

export const WyMessages = createComponent({
  react: React,
  tagName: "wy-messages",
  elementClass: WyMessagesWC,
  events: {
    onScrollToBottom: "scroll-to-bottom" as EventName<CustomEvent>
  }
});

export const WyMessageEditor = createComponent({
  react: React,
  tagName: "wy-message-editor",
  elementClass: WyMessageEditorWC,
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
  elementClass: WyMessageTypingWC,
});
