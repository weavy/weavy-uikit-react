import { EventName } from "@lit/react";
import type {
  WyPreviewOpenEventType,
  WyPreviewCloseEventType,
} from "@weavy/uikit-web/dist/types/types/files.events.d.js";
import type { WyUnreadEventType } from "@weavy/uikit-web/dist/types/types/ui.events.d.js";
import type { WyActionEventType } from "@weavy/uikit-web/dist/types/types/action.events.d.js";
import type { WyAppEventType } from "@weavy/uikit-web/dist/types/types/app.events.d.js";
import type { WyMessageEventType } from "@weavy/uikit-web/dist/types/types/messages.events.d.js";
import type {
  WyLinkEventType,
  WyNotificationEventType,
} from "@weavy/uikit-web/dist/types/types/notifications.events.d.ts";

export const onWyAction =
  "wy-action" satisfies WyActionEventType["type"] as EventName<WyActionEventType>;
export const onWyApp =
  "wy-app" satisfies WyAppEventType["type"] as EventName<WyActionEventType>;
export const onWyLink =
  "wy-link" satisfies WyLinkEventType["type"] as EventName<WyLinkEventType>;
export const onWyMessage =
  "wy-message" satisfies WyMessageEventType["type"] as EventName<WyMessageEventType>;
export const onWyNotification =
  "wy-notification" satisfies WyNotificationEventType["type"] as EventName<WyNotificationEventType>;
export const onWyPreviewOpen =
  "wy-preview-open" satisfies WyPreviewOpenEventType["type"] as EventName<WyPreviewOpenEventType>;
export const onWyPreviewClose =
  "wy-preview-close" satisfies WyPreviewCloseEventType["type"] as EventName<WyPreviewCloseEventType>;
export const onWyUnread =
  "wy-unread" satisfies WyUnreadEventType["type"] as EventName<WyUnreadEventType>;

export type {
  WyActionEventType,
  WyAppEventType,
  WyLinkEventType,
  WyMessageEventType,
  WyNotificationEventType,
  WyPreviewOpenEventType,
  WyPreviewCloseEventType,
  WyUnreadEventType,
};
