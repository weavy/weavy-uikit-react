import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import type { MemberSearchSubmitEventType } from "@weavy/uikit-web/dist/types/types/members.events.d.ts";

// Creates a React component from a Lit component
export const WyUsersSearch = createComponent({
  react: React,
  tagName: "wy-users-search",
  elementClass: WeavyComponents.WyUsersSearch,
  events: {
    onSubmit: "submit" satisfies MemberSearchSubmitEventType["type"] as EventName<MemberSearchSubmitEventType>,
  },
});
