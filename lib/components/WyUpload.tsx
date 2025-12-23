import React from "react";
import { createComponent, EventName } from "@lit/react";
import { WeavyComponents } from "@weavy/uikit-web"
import type { BlobUploadedEventType } from "@weavy/uikit-web/dist/types/types/files.events.d.ts";

// Creates a React component from a Lit component
export const WyUpload = createComponent({
  react: React,
  tagName: "wy-upload",
  elementClass: WeavyComponents.WyUpload,
  events: {
    onBlobUploaded: "blob-uploaded" satisfies BlobUploadedEventType["type"] as EventName<BlobUploadedEventType>
  }
});

