# @weavy/uikit-react

<img src="https://img.shields.io/badge/Platform-React-orange"/> <img src="https://img.shields.io/badge/Language-TypeScript-orange"/>

React based UI kit for Weavy.


## Installation

```shell
npm install @weavy/uikit-react
```

## Minimum requirements

- `React` >= 18.0.0
- `Weavy Backend` >= 11.0.0

## Gettting started


> Make sure you have a Weavy backend up and running in order to test any of the frontend examples. To quickly get a backend up and running you can register for a free account on <a href="https://get.weavy.io">get.weavy.io</a>. <br>That is the easiest and quickest way to get started and does not require you to deploy your own backend.
 
The React UI kit is dependant of the theme library that are shared by all our ui kits.

In your project directory, run:

```shell
npm install @weavy/themes
```

The Weavy UI kit components that you decide to use must be wrapped in the `WeavyProvider` component. The `WeavyProvider` handles all the common functionality for all the Weavy React UI components.


 ```js
 import React from 'react';
 import { WeavyProvider } from '@weavy/uikit-react';

export default function App() {
    return (        
        <WeavyProvider>
            <!-- Weavy components goes here -->
        </WeavyProvider>        
    )
}
```

## Adding the `Messenger` component

In your app.tsx or wherever you would like to add the Weavy Messenger:

> If you registered for a free account on <a href="https://get.weavy.io">get.weavy.io</a>, you can use the demo/test JWT token generated for you and use it in the `getToken` below and just return it as a string. But in a real application, this is typically fetched from a backend enpoint or similar that returns a valid JWT for your currently signed in user.

 ```js
import React from 'react';
import { WeavyClient, WeavyProvider, Messenger } from '@weavy/uikit-react';

const getToken = () => {
    return new Promise(function (resolve, reject) {
        // typically an api call to your backend which returns a JWT
        var token = getTokenFromSomewhere();
        if (token) {
            resolve(token);
        } else {
            reject("Failed to retrieve token");
        }
    });
}

const weavyClient = new WeavyClient({ url: "https://url-to-weavy.backend", tokenFactory: getToken})

function App() {
    return (
        <div className="App">
            <WeavyProvider client={weavyClient}>
                <Messenger />
            </WeavyProvider>
        </div>
    )
}

export default App;
```


## Add the stylesheet

In your index.tsx (or index.js if you are not using TypeScript) file, add the following


```js
// ---------------------------------------------------------
// add the following line of code
// ---------------------------------------------------------
import "@weavy/themes/dist/weavy-default.css";  
// ---------------------------------------------------------

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
```


## Run the app

Start your React app. You should see the Weavy Messenger component rendering a Conversation list and a Conversation with the currently selected conversation.


## Documentation

To learn more about all the different components that you can use and how to setup the authentication flow, head over to our [Documentation site](https://weavy.com/docs/frontend/uikit-react)