# @weavy/uikit-react

<img src="https://img.shields.io/badge/Platform-React-orange"/> <img src="https://img.shields.io/badge/Language-TypeScript-orange"/>

React components based UIKit for Weavy powered by `@weavy/uikit-web` web components under the hood. It comes with regular React components for Weavy Blocks and React hooks for simplified configuration and usage.

> See [UIKit React documentation](https://weavy.com/docs/frameworks/react).

## Installation

```shell
npm install @weavy/uikit-react
```

## Getting started

You need a Weavy server in order to test any of the frontend examples. If you don't have one, you can create one for free after signing up for an account on <a href="https://get.weavy.com">get.weavy.com</a>.

You also need an application with a user system and a token endpoint. See [Weavy Authentication](https://weavy.com/docs) for more info about configuring authentication and single sign-on between your application and Weavy.

> [Weavy docs](https://weavy.com/docs)

### Use Weavy React Components

To use any block you must first configure Weavy with an `url` and a `tokenUrl` or `tokenFactory`. This can be done using the `useWeavy` hook or alternatively use the `<WyContext />` provider.

```jsx
import { useWeavy, WyMessenger } from "@weavy/uikit-react";

export function App() {
  const weavy = useWeavy({
    url: "https://myenvironment.weavy.io",
    tokenUrl: "https://myserver.test/api/token",
  });

  return (
    <>
      ...
      <WyMessenger />
    </>
  );
}
```

## Run the React components demo in developer mode

The developer mode compiles and starts up a developer server that also provides authentication for a single _developer_ user.

### .env

You must provide an `.env` file with your _WEAVY_URL_ and _WEAVY_APIKEY_ to run the development test server. See the [.env.example](./.env.example) for an example configuration.

```ini
WEAVY_URL="https://mysite.weavy.io"
WEAVY_APIKEY=""
```

### Dev server

Once you have configured you `.env` you can start up the auth server and dev server. The dev server runs in watch mode.

```bash
npm install
npm start
```
