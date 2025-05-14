import React from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import "./App.css";

import { useWeavy } from "../lib";
import { WyCopilot } from "../lib";
import { WeavyComponents } from "../lib";

const { WyAvatar } = WeavyComponents;

export function App() {
  const weavy = useWeavy({
    url: new URL(WEAVY_URL),
    tokenUrl: "/api/token",
    //disableEnvironmentImports: true
  });

  // @ts-expect-error globalThis
  globalThis.weavy = weavy;

  return (
    <React.StrictMode>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img
            src={viteLogo}
            className="logo"
            alt="Vite logo"
            decoding="async"
            loading="lazy"
          />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img
            src={reactLogo}
            className="logo react"
            alt="React logo"
            decoding="async"
            loading="lazy"
          />
        </a>
        <WyAvatar name="Weavy Yo"></WyAvatar>
      </div>
      <h1>Vite + React</h1>
      <h3>Powered by uikit-web</h3>

      <WyCopilot agent="gemini" onWyApp={(e) => { console.log("app", e.detail)}} className="WyMessenger"></WyCopilot>
    </React.StrictMode>
  );
}

export default App;
