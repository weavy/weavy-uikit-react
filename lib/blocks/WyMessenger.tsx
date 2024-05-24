'use client';

import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WyMessenger as WyMessengerWC } from "@weavy/uikit-web";
import {
  RealtimeAppEventType,
  RealtimeConversationDeliveredEventType,
  RealtimeConversationMarkedEventType,
  RealtimeMemberEventType,
  RealtimeMessageEventType,
} from "@weavy/uikit-web/dist/types/types/realtime.types";

// Creates a React component from a Lit component
export const WyMessenger = createComponent({
  react: React,
  tagName: "wy-messenger",
  elementClass: WyMessengerWC,
  events: {
    onWyMessageCreated: "wy:message_created" as EventName<
      CustomEvent<RealtimeMessageEventType>
    >,
    onWyAppCreated: "wy:app_created" as EventName<
      CustomEvent<RealtimeAppEventType>
    >,
    onWyConversationMarked: "wy:conversation_marked" as EventName<
      CustomEvent<RealtimeConversationMarkedEventType>
    >,
    onWyConversationDelivered: "wy:conversation_delivered" as EventName<
      CustomEvent<RealtimeConversationDeliveredEventType>
    >,
    onWyMemberAdded: "wy:member_added" as EventName<
      CustomEvent<RealtimeMemberEventType>
    >,
  },
});
