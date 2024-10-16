import React from 'react'
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
import { zhHK } from '@mui/x-date-pickers/locales';

import useMediaQuery from '@mui/material/useMediaQuery'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material';

import { isTokenExpired } from 'pocketbase';

import Root from './routers/root'
import ErrorPage from "./error-page"
import LoginPage from './pages/login-page'
import SpentRecordPage from './pages/spent-record-page'
import pb from './services/pocketbase'

import QuickCreatePage from './pages/quick-create-page'
import ConfigPage from './pages/config-page'
import ConfigTypePage from './pages/config-pages/config-type-page'
import ConfigPaymentPage from './pages/config-pages/config-payment-page'

import { themeOptions } from './themes';

import UserDefaultPage from './routers/user-default-page';
import ConfigPreferencePage from './pages/config-pages/config-preference-page';

import { useGetUserSettingsQuery } from "./redux/userSettingsSlice";
import SubscriptionRecordPage from './pages/subscription-record-page';
import ConfigBudgetPage from './pages/config-pages/config-budget-page';
import ConfigPresetPage from './pages/config-pages/config-preset-page';
import Logout from './routers/logout';

import { PocketBaseContext } from './context'
import ConfigAboutPage from './pages/config-pages/config-about-page';
import RecordChartPage from './pages/record-chart-page';

export default function App() {

    const { data: userSettings } = useGetUserSettingsQuery(undefined, { skip: !pb.authStore.isValid })
    const colorMode = userSettings?.color_mode || 'system'

    const router = createBrowserRouter(
        createRoutesFromElements([
            (
                <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
                    <Route index element={<UserDefaultPage />} />

                    <Route path="spentRecord" element={<SpentRecordPage />} />
                    <Route path="quickCreate" element={<QuickCreatePage />} />
                    <Route path="subscriptionRecord" element={<SubscriptionRecordPage />} />
                    <Route path="recordChart" element={<RecordChartPage />} />

                    <Route path="config" element={<ConfigPage />}>
                        {/* <Route index element={<Navigate to="preference" replace />} /> */}

                        <Route path="preference" element={<ConfigPreferencePage />} />
                        <Route path="budget" element={<ConfigBudgetPage />} />
                        <Route path="type" element={<ConfigTypePage />} />
                        <Route path="payment" element={<ConfigPaymentPage />} />
                        <Route path="preset" element={<ConfigPresetPage />} />
                        <Route path="about" element={<ConfigAboutPage />} />
                    </Route>
                </Route>
            ), (
                <Route path="/login" element={<LoginPage />} />
            ), (
                <Route path="/logout" element={<Logout />} />
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
            <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale='zh-HK' localeText={zhHK.components.MuiLocalizationProvider.defaultProps.localeText}>
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