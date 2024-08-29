import React from "react";
import { EventName, createComponent } from "@lit/react";
import {
  WyCommentList as WyCommentListWC,
  WyComment as WyCommentWC,
  WyCommentView as WyCommentViewWC,
  WyCommentEdit as WyCommentEditWC,
  WyCommentEditor as WyCommentEditorWC,
  WyCommentTrashed as WyCommentTrashedWC,
} from "@weavy/uikit-web";
import { PollOptionType } from "@weavy/uikit-web/dist/types/types/polls.types.d.ts";

// Creates a React component from a Lit component
export const WyCommentList = createComponent({
  react: React,
  tagName: "wy-comment-list",
  elementClass: WyCommentListWC,
});

export const WyComment = createComponent({
  react: React,
  tagName: "wy-comment",
  elementClass: WyCommentWC,
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
  elementClass: WyCommentViewWC,
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
  elementClass: WyCommentEditWC,
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
  elementClass: WyCommentEditorWC,
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
  elementClass: WyCommentTrashedWC,
  events: {
    onRestore: "restore" as EventName<
      CustomEvent<{
        id: number;
      }>
    >,
  },
});
