import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import { PollOptionType } from "@weavy/uikit-web/dist/types/types/polls.types.d.ts";

// Creates a React component from a Lit component
export const WyEditor = createComponent({
  react: React,
  tagName: "wy-editor",
  elementClass: WeavyComponents.WyEditor,
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
