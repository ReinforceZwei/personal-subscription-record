import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import '@fontsource-variable/noto-sans-tc';

import store from './store.js'
import { Provider } from 'react-redux'
import App from './app.jsx'

export const PocketBaseContext = React.createContext({})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
