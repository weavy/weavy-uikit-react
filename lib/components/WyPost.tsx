import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import type { PollVoteEventType } from "@weavy/uikit-web/dist/types/types/polls.events.d.ts";
import type {
  PostEditEventType,
  PostRestoreEventType,
  PostSubscribeEventType,
  PostTrashEventType,
} from "@weavy/uikit-web/dist/types/types/posts.events.d.ts";
import { onWyAction, onWyPreviewClose, onWyPreviewOpen } from "../blocks/events";

const onEdit =
  "edit" satisfies PostEditEventType["type"] as EventName<PostEditEventType>;
const onVote =
  "vote" satisfies PollVoteEventType["type"] as EventName<PollVoteEventType>;
const onSubscribe =
  "subscribe" satisfies PostSubscribeEventType["type"] as EventName<PostSubscribeEventType>;
const onTrash =
  "trash" satisfies PostTrashEventType["type"] as EventName<PostTrashEventType>;
const onRestore =
  "restore" satisfies PostRestoreEventType["type"] as EventName<PostRestoreEventType>;

// Creates a React component from a Lit component
export const WyPostList = createComponent({
  react: React,
  tagName: "wy-post-list",
  elementClass: WeavyComponents.WyPostList,
  events: {
    onEdit,
    onWyAction,
    onWyPreviewOpen,
    onWyPreviewClose
  },
});

export const WyPost = createComponent({
  react: React,
  tagName: "wy-post",
  elementClass: WeavyComponents.WyPost,
  events: {
    onVote,
    onSubscribe,
    onTrash,
    onRestore,
    onWyAction,
    onWyPreviewOpen,
    onWyPreviewClose
  },
});

export const WyPostView = createComponent({
  react: React,
  tagName: "wy-post-view",
  elementClass: WeavyComponents.WyPostView,
  events: {
    onVote,
    onSubscribe,
    onTrash,
    onEdit,
    onWyAction,
    onWyPreviewOpen,
    onWyPreviewClose
  },
});

export const WyPostEdit = createComponent({
  react: React,
  tagName: "wy-post-edit",
  elementClass: WeavyComponents.WyPostEdit,
  events: {
    onEdit,
  },
});

export const WyPostTrashed = createComponent({
  react: React,
  tagName: "wy-post-trashed",
  elementClass: WeavyComponents.WyPostTrashed,
  events: {
    onRestore,
  },
});
