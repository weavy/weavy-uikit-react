'use client';

import { Weavy, WeavyClient, AppTypeGuids, AppTypeStrings, MessengerTypes, WeavyType, WyNotificationsEventType, WeavyOptions } from "@weavy/uikit-web";
import { createContext } from "react";

/* @ts-expect-error Override Weavy version */
WeavyClient.version = WEAVY_VERSION;

/* @ts-expect-error Override Weavy sourceName */
WeavyClient.sourceName = WEAVY_SOURCE_NAME;

// React context provider
export const WeavyContext = createContext<WeavyType | null>(null);

export { Weavy, AppTypeGuids, AppTypeStrings, MessengerTypes }
export type { WeavyType, WyNotificationsEventType, WeavyOptions }
