import {
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
    Route,
    Navigate,
} from 'react-router-dom'
import { useEffect, useMemo } from 'react';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'

import useMediaQuery from '@mui/material/useMediaQuery'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material';

import { isTokenExpired } from 'pocketbase';

import Root from './routers/root.jsx'
import ErrorPage from "./error-page"
import LoginPage from './pages/login-page.jsx'
import SpentRecordPage from './pages/spent-record-page.jsx'
import pb from './services/pocketbase.js'

import logoutAction from './routers/actions/logout-action.js'
import QuickCreatePage from './pages/quick-create-page.jsx'
import ConfigPage from './pages/config-page.jsx'
import ConfigTypePage from './pages/config-pages/config-type-page.jsx'
import ConfigPaymentPage from './pages/config-pages/config-payment-page.jsx'

import { PocketBaseContext } from './main.jsx'
import { themeOptions } from './themes.js';

import { useDispatch, useSelector } from 'react-redux'
import UserDefaultPage from './routers/user-default-page.jsx';
import ConfigPreferencePage from './pages/config-pages/config-preference-page.jsx';

import { fetchUserSettings, selectUserSettings } from "./redux/userSettingsSlice";

export default function App() {
    const dispatch = useDispatch()

    const userSettings = useSelector(selectUserSettings)
    const colorMode = userSettings?.color_mode || 'system'

    useEffect(() => {
        dispatch(fetchUserSettings())

    }, [])

    const router = createBrowserRouter(
        createRoutesFromElements([
            (
                <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
                    <Route index element={<UserDefaultPage />} />

                    <Route path="spentRecord" element={<SpentRecordPage />} />
                    <Route path="quickCreate" element={<QuickCreatePage />} />

                    <Route path="config" element={<ConfigPage />}>
                        {/* <Route index element={<Navigate to="preference" replace />} /> */}

                        <Route path="preference" element={<ConfigPreferencePage />} />
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

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light'
    const theme = useMemo(
        () =>
            createTheme({
                ...themeOptions,
                palette: {
                    ...themeOptions.palette,
                    mode: colorMode === 'system' ? prefersDarkMode : colorMode,
                    
                },
            }),
        [prefersDarkMode, colorMode],
    );

    useEffect(() => {
        if (pb.authStore.isValid) {
            // 7 days
            if (isTokenExpired(pb.authStore.token, 604800)) {
                pb.collection("users").authRefresh()
            }
        }
    }, [])

    return (
        <div>
        <PocketBaseContext.Provider value={pb}>
            <LocalizationProvider dateAdapter={AdapterLuxon}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <div>
                        <RouterProvider router={router} />
                    </div>
                </ThemeProvider>
                
            </LocalizationProvider>
        </PocketBaseContext.Provider>
        </div>
    )
}