import React from "react";
import { createComponent, EventName } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import { SearchEventType } from "@weavy/uikit-web/dist/types/types/search.events.d.js";

// Creates a React component from a Lit component
export const WySearch = createComponent({
  react: React,
  tagName: "wy-search",
  elementClass: WeavyComponents.WySearch,
  events: {
    onSearch: "search" satisfies SearchEventType["type"] as EventName<SearchEventType>
  }
});
