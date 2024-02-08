# Instructions for migration when upgrading @weavy/uikit-react

Please refer to [Weavy docs](https://www.weavy.com/docs) for detailed documentation.

> [UIKit React documentation](https://www.weavy.com/docs/frameworks/react)

## Migrate from UIKit React v19.x to v20.0.0

The UIKit React has been replaced with a UIKit powered by the `@weavy/uikit-web` Web components. It comes with regular React components for Weavy Blocks and React hooks for simplified configuration and usage. That means regular React components have access to all the latest features and updates provided in UIKit Web.

### CSS and styling

The previously imported stylesheet is no longer used. Remove any references and style overrides. All new styling options can be found in the [UIKit Web styling documentation](https://www.weavy.com/docs/reference/uikit-web/styling).

### Token URL

The `tokenFactory` can optionally be replaced with a `tokenUrl` as long as the API endpoint returns a JSON-encoded `access_token`.

See [UIKit Web Authentication](https://www.weavy.com/docs/reference/uikit-web/authentication).

### Weavy configuration

`WeavyClient` has been replaced with a configuration using a `useWeavy` hook or using a predefined `<WyContext />` provider. This means there is no requirement to use a `<WeavyProvider>`. You may also just replace the `new WeavyClient()` with the underlying `new Weavy()`.

#### Option 1: Replace `WeavyClient` with `Weavy`

1. Change the name of `new WeavyClient({ ...options })` to `new Weavy({ ...options })`.
2. Remove the `<WeavyProvider>...</WeavyProvider>` tag.

#### Option 2: Replace the `<WeavyProvider>` with `<WyContext>`

1. Replace the `<WeavyProvider>` tag with `<WyContext url={WEAVY_URL} tokenFactory={async () => "access_token" }>`
2. Remove the `WeavyClient` instance.

#### Option 3: Change to `useWeavy()` hook

1. Replace `new WeavyClient({ ...options })` with `useWeavy({...options })` and place the hook _inside_ any top-level component such as your `App` component.
2. Remove the `<WeavyProvider>...</WeavyProvider>` tag.

### React component names

The names of the React components has changed to have a common `Wy` prefix and align with the naming of the blocks in UIKit Web. Rename the imports and tags for your components.

Please refer to UIKIt Web documentation if you want to create a custom Messenger to replace the MessengerProvider.

| Previous component      | New component            |
| ----------------------- | ------------------------ |
| `<Chat />`              | `<WyChat />`             |
| `<Files />`             | `<WyFiles />`            |
| `<Messenger />`         | `<WyMessenger />`        |
| `<Posts />`             | `<WyPosts />`            |
| `<WeavyProvider />`     | `<WyContext />`          |
| `<MessengerProvider />` | N/A                      |
| `<ConversationList />`  | `<WyConversationList />` |
| `<Conversation />`      | `<WyConversation />`     |
| `<ConversationBadge />` | `<WyBadge />`            |
