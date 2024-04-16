import React from 'react';
import { createComponent } from '@lit/react';
import { WyContext as WyContextWC } from '@weavy/uikit-web';
import "../weavy"

// Creates a React component from a Lit component
export const WyContext = createComponent({
  react: React,
  tagName: 'wy-context',
  elementClass: WyContextWC,
});