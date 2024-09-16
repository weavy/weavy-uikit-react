'use client';

import { Weavy, WeavyClient, AppTypes, ConversationTypes } from "@weavy/uikit-web";
import { WyNotificationsEventType } from "@weavy/uikit-web/dist/types/types/notifications.types.js";
import { createContext } from "react";

/* @ts-expect-error Override Weavy version */
WeavyClient.version = WEAVY_VERSION;

/* @ts-expect-error Override Weavy sourceName */
WeavyClient.sourceName = WEAVY_SOURCE_NAME;

// React context provider
export const WeavyContext = createContext<Weavy | null>(null);

export { Weavy, AppTypes, ConversationTypes }
export type { WyNotificationsEventType }
