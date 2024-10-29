import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";

// Creates a React component from a Lit component
export const WyPost = createComponent({
  react: React,
  tagName: "wy-post",
  elementClass: WeavyComponents.WyPost,
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

export const WyPostView = createComponent({
  react: React,
  tagName: "wy-post-view",
  elementClass: WeavyComponents.WyPostView,
  events: {
    onVote: "vote" as EventName<
      CustomEvent<{
        id: number;
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
    onEdit: "edit" as EventName<
      CustomEvent<{
        edit: boolean;
      }>
    >,
  },
});

export const WyPostEdit = createComponent({
  react: React,
  tagName: "wy-post-edit",
  elementClass: WeavyComponents.WyPostEdit,
  events: {
    onEdit: "edit" as EventName<
      CustomEvent<{
        edit: boolean;
      }>
    >,
  },
});

export const WyPostTrashed = createComponent({
  react: React,
  tagName: "wy-post-trashed",
  elementClass: WeavyComponents.WyPostTrashed,
  events: {
    onRestore: "restore" as EventName<CustomEvent>,
  },
});
