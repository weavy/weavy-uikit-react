import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import { PollOptionType } from "@weavy/uikit-web/dist/types/types/polls.types.d.ts";

// Creates a React component from a Lit component
export const WyCommentList = createComponent({
  react: React,
  tagName: "wy-comment-list",
  elementClass: WeavyComponents.WyCommentList,
});

export const WyComment = createComponent({
  react: React,
  tagName: "wy-comment",
  elementClass: WeavyComponents.WyComment,
  events: {
    onVote: "vote" as EventName<
      CustomEvent<{
        id: number;
        parentId: number;
        parentType: string;
      }>
    >,
    onSubscribe: "subscribe" as EventName<
      CustomEvent<{
        id: number;
        subscribe: boolean;
      }>
    >,
    onTrash: "trash" as EventName<
      CustomEvent<{
        id: number;
      }>
    >,
    onRestore: "restore" as EventName<
      CustomEvent<{
        id: number;
      }>
    >,
  },
});

export const WyCommentView = createComponent({
  react: React,
  tagName: "wy-comment-view",
  elementClass: WeavyComponents.WyCommentView,
  events: {
    onVote: "vote" as EventName<
      CustomEvent<{
        id: number;
      }>
    >,
    onTrash: "trash" as EventName<
      CustomEvent<{
        id: number;
      }>
    >,
    onEdit: "edit" as EventName<
      CustomEvent<{
        edit: boolean;
      }>
    >,
  },
});

export const WyCommentEdit = createComponent({
  react: React,
  tagName: "wy-comment-edit",
  elementClass: WeavyComponents.WyCommentEdit,
  events: {
    onEdit: "edit" as EventName<
      CustomEvent<{
        edit: boolean;
      }>
    >,
  },
});

// Creates a React component from a Lit component
export const WyCommentEditor = createComponent({
  react: React,
  tagName: "wy-comment-editor",
  elementClass: WeavyComponents.WyCommentEditor,
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

export const WyCommentTrashed = createComponent({
  react: React,
  tagName: "wy-comment-trashed",
  elementClass: WeavyComponents.WyCommentTrashed,
  events: {
    onRestore: "restore" as EventName<
      CustomEvent<{
        id: number;
      }>
    >,
  },
});
