import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WyFileVersions as WyFileVersionsWC } from "@weavy/uikit-web";
import { FileType } from "@weavy/uikit-web/dist/types/types/files.types.d.ts";

// Creates a React component from a Lit component
export const WyFileVersions = createComponent({
  react: React,
  tagName: "wy-file-versions",
  elementClass: WyFileVersionsWC,
  events: {
    onFileVersionSelect: "file-version-select" as EventName<
      CustomEvent<{
        versionFile: FileType;
      }>
    >,
  },
});
