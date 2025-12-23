import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import type { FileVersionSelectEventType } from "@weavy/uikit-web/dist/types/types/files.events.d.ts";

// Creates a React component from a Lit component
export const WyFileVersions = createComponent({
  react: React,
  tagName: "wy-file-versions",
  elementClass: WeavyComponents.WyFileVersions,
  events: {
    onFileVersionSelect:
      "file-version-select" satisfies FileVersionSelectEventType["type"] as EventName<FileVersionSelectEventType>,
  },
});
