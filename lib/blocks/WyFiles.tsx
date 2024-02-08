import React from "react";
import { EventName, createComponent } from "@lit/react";
import { WyFiles as WyFilesWC } from "@weavy/uikit-web";
import { RealtimeFileEventType } from "@weavy/uikit-web/dist/types/types/realtime.types";

// Creates a React component from a Lit component
export const WyFiles = createComponent({
  react: React,
  tagName: "wy-files",
  elementClass: WyFilesWC,
  events: {
    onWyFileCreated: "wy:file_created" as EventName<
      CustomEvent<RealtimeFileEventType>
    >,
    onWyFileUpdated: "wy:file_updated" as EventName<
      CustomEvent<RealtimeFileEventType>
    >,
    onWyFileTrashed: "wy:file_trashed" as EventName<
      CustomEvent<RealtimeFileEventType>
    >,
    onWyFileRestored: "wy:file_restored" as EventName<
      CustomEvent<RealtimeFileEventType>
    >,
    onWyFileDeleted: "wy:file_deleted" as EventName<
      CustomEvent<RealtimeFileEventType>
    >,
  },
});
