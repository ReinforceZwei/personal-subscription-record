import React from 'react'
import ReactDOM from 'react-dom/client'

import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Navigate,
} from 'react-router-dom'

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'

import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Root from './routers/root.jsx'
import ErrorPage from "./error-page"
import LoginPage from './pages/login-page.jsx'
import SpentRecordPage from './pages/spent-record-page.jsx'
import pb from './services/pocketbase.js'

import rootLoader from './routers/loaders/root-loader.js'
import logoutAction from './routers/actions/logout-action.js'
import QuickCreatePage from './pages/quick-create-page.jsx'
import ConfigPage from './pages/config-page.jsx'
import ConfigTypePage from './pages/config-pages/config-type-page.jsx'
import ConfigPaymentPage from './pages/config-pages/config-payment-page.jsx'

export const PocketBaseContext = React.createContext({})

const router = createBrowserRouter(
  createRoutesFromElements([
    (
      <Route path="/" element={<Root />} loader={rootLoader}>
        <Route index element={<Navigate to="/spentRecord" replace />} />

        <Route path="spentRecord" element={<SpentRecordPage />} />
        <Route path="quickCreate" element={<QuickCreatePage />} />

        <Route path="config" element={<ConfigPage />}>
          <Route index element={<Navigate to="type" replace />} />

          <Route path="type" element={<ConfigTypePage />} />
          <Route path="payment" element={<ConfigPaymentPage />} />
        </Route>
      </Route>
    ), (
      <Route path="/login" element={<LoginPage />} />
    ), (
      <Route path="/logout" loader={logoutAction} />
    )
  ])
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PocketBaseContext.Provider value={pb}>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <div>
        <RouterProvider router={router} />
        </div>
      </LocalizationProvider>
    </PocketBaseContext.Provider>
  </React.StrictMode>,
)
