import React from 'react'
import ReactDOM from 'react-dom/client'

// https://github.com/vitejs/vite/issues/12423#issuecomment-2080351394
import '@mui/material/styles/styled';

import './index.css'
import '@fontsource-variable/noto-sans-tc';

import store from './store.js'
import { Provider } from 'react-redux'
import App from './app.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
