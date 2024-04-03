import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

import { useWeavy } from '../lib';
import { WyMessenger } from '../lib';
import { WyAvatar } from '../lib';

export function App() {

  useWeavy({
    url: new URL(WEAVY_URL),
    tokenUrl: "/api/token",
    //disableEnvironmentImports: true
  })

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" decoding='async' loading='lazy' />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" decoding='async' loading='lazy' />
        </a>
        <WyAvatar name='Weavy Yo'></WyAvatar>
      </div>
      <h1>Vite + React</h1>
      <h3>Powered by uikit-web</h3>

        <WyMessenger></WyMessenger>

    </>
  )
}

export default App
