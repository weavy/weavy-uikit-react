import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import type { PollVoteEventType } from "@weavy/uikit-web/dist/types/types/polls.events.d.ts";
import type {
  CommentRestoreEventType,
  CommentTrashEventType,
} from "@weavy/uikit-web/dist/types/types/comments.events.d.ts";
import { onWyPreviewClose, onWyPreviewOpen } from "../blocks/events";

// Creates a React component from a Lit component
export const WyCommentList = createComponent({
  react: React,
  tagName: "wy-comment-list",
  elementClass: WeavyComponents.WyCommentList,
  events: {
    onWyPreviewOpen,
    onWyPreviewClose
  }
});

export const WyComment = createComponent({
  react: React,
  tagName: "wy-comment",
  elementClass: WeavyComponents.WyComment,
  events: {
    onVote: "vote" satisfies PollVoteEventType["type"] as EventName<PollVoteEventType>,
    onTrash: "trash" satisfies CommentTrashEventType["type"] as EventName<CommentTrashEventType>,
    onRestore: "restore" satisfies CommentRestoreEventType["type"] as EventName<CommentRestoreEventType>,
    onWyPreviewOpen,
    onWyPreviewClose,
  },
});
