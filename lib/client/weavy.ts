'use client';

import { Weavy, WeavyContextBase, AppTypes, ConversationTypes } from "@weavy/uikit-web";

/* @ts-expect-error Override Weavy version */
WeavyContextBase.version = WEAVY_VERSION;

/* @ts-expect-error Override Weavy sourceName */
WeavyContextBase.sourceName = WEAVY_SOURCE_NAME;

export { Weavy, AppTypes, ConversationTypes }
