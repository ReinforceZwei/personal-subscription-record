import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import '@fontsource-variable/noto-sans-tc';

import App from './app.jsx'

export const PocketBaseContext = React.createContext({})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
