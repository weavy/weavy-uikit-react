# @weavy/uikit-react

<img src="https://img.shields.io/badge/Platform-React-orange"/> <img src="https://img.shields.io/badge/Language-TypeScript-orange"/>

React components for Weavy: chat, feeds, file sharing, comments, notifications and AI agents as `<WyMessenger>`, `<WyChat>`, `<WyFeed>`, `<WyFiles>`, `<WyComments>`, `<WyCopilot>`, `<WyNotifications>` and more. The components are thin [`@lit/react`](https://lit.dev/docs/frameworks/react/) wrappers around the [`@weavy/uikit-web`](https://www.npmjs.com/package/@weavy/uikit-web) web components, so they always have the full feature set of the web components. The `useWeavy` hook and the `<WyContext>` provider configure the connection to your Weavy environment. Supports React 16 and later, including React Server Components.

## Installation

```bash
npm install @weavy/uikit-react
```

## Documentation

Guides, concepts and the component reference are maintained on [docs.weavy.com](https://docs.weavy.com):

- [Weavy and React](https://docs.weavy.com/guides/react) – step-by-step guide: create an environment, configure authentication and add your first component, including SSR and Next.js.
- [Adding the Weavy UIKit](https://docs.weavy.com/learn/uikit), [Authentication](https://docs.weavy.com/learn/authentication), [Components](https://docs.weavy.com/learn/components), [Styling](https://docs.weavy.com/learn/styling) and [Localization](https://docs.weavy.com/learn/localization).
- [UIKit reference](https://docs.weavy.com/reference/uikit/) – properties, events and slots for every component.
- [Changelog](https://docs.weavy.com/resources/changelog).

## Development

The dev server runs the demo app in `demo/` in watch mode, together with a local auth server that signs in test users against your Weavy environment. The package depends on the local `@weavy/uikit-web` package, so build that first (or run `npm run build` from the repository root).

1. Copy `.env.example` to `.env` and set `WEAVY_URL` and `WEAVY_APIKEY` for your environment.
2. Install and start:

```bash
npm install
npm start
```

The optional `HTTPS_PEM_*` and `HTTPS_PFX_*` variables in `.env` enable TLS for the dev server in the same way as in `@weavy/uikit-web`.

```bash
npm run lint    # ESLint on lib/
npm run build   # ESM + legacy build with type check
```
