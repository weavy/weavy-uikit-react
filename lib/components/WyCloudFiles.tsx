import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import type { ExternalBlobType } from "@weavy/uikit-web/dist/types/types/files.types.d.ts";

// Creates a React component from a Lit component
export const WyCloudFiles = createComponent({
  react: React,
  tagName: "wy-cloud-files",
  elementClass: WeavyComponents.WyCloudFiles,
  events: {
    onExternalBlobs: "external-blobs" as EventName<
      CustomEvent<{
        externalBlobs: ExternalBlobType[] | null;
      }>
    >,
    onReleaseFocus: "release-focus" as EventName<CustomEvent>
  },
});

