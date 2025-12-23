import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web";
import type { ExternalBlobsEventType } from "@weavy/uikit-web/dist/types/types/files.events.d.ts";

// Creates a React component from a Lit component
export const WyCloudFiles = createComponent({
  react: React,
  tagName: "wy-cloud-files",
  elementClass: WeavyComponents.WyCloudFiles,
  events: {
    onExternalBlobs:
      "external-blobs" satisfies ExternalBlobsEventType["type"] as EventName<ExternalBlobsEventType>,
  },
});
