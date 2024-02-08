import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WyPosts as WyPostsWC } from "@weavy/uikit-web";
import {
  RealtimeCommentEventType,
  RealtimePostEventType,
  RealtimeReactionEventType,
} from "@weavy/uikit-web/dist/types/types/realtime.types";

// Creates a React component from a Lit component
export const WyPosts = createComponent({
  react: React,
  tagName: "wy-posts",
  elementClass: WyPostsWC,
  events: {
    onWyPostCreated: "wy:post_created" as EventName<
      CustomEvent<RealtimePostEventType>
    >,
    onWyCommentCreated: "wy:comment_created" as EventName<
      CustomEvent<RealtimeCommentEventType>
    >,
    onWyReactionAdded: "wy:reaction_added" as EventName<
      CustomEvent<RealtimeReactionEventType>
    >,
    onWyReactionRemoved: "wy:reaction_removed" as EventName<
      CustomEvent<RealtimeReactionEventType>
    >,
  },
});
