import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WyCloudFiles as WyCloudFilesWC } from "@weavy/uikit-web";
import { ExternalBlobType } from "@weavy/uikit-web/dist/types/types/files.types";

// Creates a React component from a Lit component
export const WyCloudFiles = createComponent({
  react: React,
  tagName: "wy-cloud-files",
  elementClass: WyCloudFilesWC,
  events: {
    onExternalBlobs: "external-blobs" as EventName<
      CustomEvent<{
        externalBlobs: ExternalBlobType[] | null;
      }>
    >,
    onReleaseFocus: "release-focus" as EventName<CustomEvent>
  },
});

