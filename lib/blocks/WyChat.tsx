import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WyChat as WyChatWC } from "@weavy/uikit-web";
import {
  RealtimeAppEventType,
  RealtimeMessageEventType,
  RealtimeReactionEventType,
} from "@weavy/uikit-web/dist/types/types/realtime.types";

// Creates a React component from a Lit component
export const WyChat = createComponent({
  react: React,
  tagName: "wy-chat",
  elementClass: WyChatWC,
  events: {
    onWyMessageCreated: "wy:message_created" as EventName<
      CustomEvent<RealtimeMessageEventType>
    >,
    onWyReactionAdded: "wy:reaction_added" as EventName<
      CustomEvent<RealtimeReactionEventType>
    >,
    onWyReactionRemoved: "wy:reaction_removed" as EventName<
      CustomEvent<RealtimeReactionEventType>
    >,
    onWyAppUpdated: "wy:app_updated" as EventName<
      CustomEvent<RealtimeAppEventType>
    >,
  },
});
