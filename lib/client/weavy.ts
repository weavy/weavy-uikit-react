'use client';

import { Weavy, WeavyClient, AppTypeGuids, AppTypeStrings, MessengerTypes, WeavyType, WeavyOptions } from "@weavy/uikit-web";
import { createContext } from "react";

/* @ts-expect-error Override Weavy version */
WeavyClient.version = WEAVY_VERSION;

/* @ts-expect-error Override Weavy sourceName */
WeavyClient.sourceName = WEAVY_SOURCE_NAME;

/* @ts-expect-error Override Weavy sourceFormat */
WeavyClient.sourceFormat = WEAVY_SOURCE_FORMAT ?? WeavyClient.sourceFormat;

// React context provider
export const WeavyContext = createContext<WeavyType | null>(null);

export { Weavy, AppTypeGuids, AppTypeStrings, MessengerTypes }
export type { WeavyType, WeavyOptions }
