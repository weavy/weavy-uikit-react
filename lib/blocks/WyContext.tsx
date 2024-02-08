import React from 'react';
import { createComponent } from '@lit/react';
import { Weavy, WyContext as WyContextWC } from '@weavy/uikit-web';

/* @ts-expect-error Override Weavy version */
Weavy.version = WEAVY_VERSION;

/* @ts-expect-error Override Weavy sourceName */
Weavy.sourceName = WEAVY_SOURCE_NAME;

// Creates a React component from a Lit component
export const WyContext = createComponent({
  react: React,
  tagName: 'wy-context',
  elementClass: WyContextWC,
});