import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WyUsersSearch as WyUsersSearchWC } from "@weavy/uikit-web";
import { MemberType } from "@weavy/uikit-web/dist/types/types/members.types.d.ts";

// Creates a React component from a Lit component
export const WyUsersSearch = createComponent({
  react: React,
  tagName: "wy-users-search",
  elementClass: WyUsersSearchWC,
  events: {
    onSubmit: "submit" as EventName<
      CustomEvent<{
        members: MemberType[];
      }>
    >,
  },
});
