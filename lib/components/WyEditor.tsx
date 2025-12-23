import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import type { EditorSubmitEventType } from "@weavy/uikit-web/dist/types/types/editor.events.d.ts";

// Creates a React component from a Lit component
export const WyEditor = createComponent({
  react: React,
  tagName: "wy-editor",
  elementClass: WeavyComponents.WyEditor,
  events: {
    onSubmit: "submit" satisfies EditorSubmitEventType["type"] as EventName<EditorSubmitEventType>,
  },
});

// Creates a React component from a Lit component
export const WyCommentEditor = createComponent({
  react: React,
  tagName: "wy-comment-editor",
  elementClass: WeavyComponents.WyCommentEditor,
  events: {
    onSubmit: "submit" satisfies EditorSubmitEventType["type"] as EventName<EditorSubmitEventType>,
  },
});

export const WyMessageEditor = createComponent({
  react: React,
  tagName: "wy-message-editor",
  elementClass: WeavyComponents.WyMessageEditor,
  events: {
    onSubmit: "submit" satisfies EditorSubmitEventType["type"] as EventName<EditorSubmitEventType>,
  },
});
