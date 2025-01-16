import React, { lazy, Suspense, useEffect, useMemo } from 'react'
import {
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
    Route,
    Navigate,
} from 'react-router-dom'

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { zhHK } from '@mui/x-date-pickers/locales';

import useMediaQuery from '@mui/material/useMediaQuery'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material';

import { isTokenExpired } from 'pocketbase';
import pb from './services/pocketbase'
import { themeOptions } from './themes';
import { useGetUserSettingsQuery } from "./redux/userSettingsSlice";
import { PocketBaseContext, ThemeContext } from './context'

import PageTopProgressBar from './components/page-top-progress-bar'
const Root = lazy(() => import('./routers/root'))
const ErrorPage = lazy(() => import('./error-page'))
const LoginPage = lazy(() => import('./pages/login-page'))
const SpentRecordPage = lazy(() => import('./pages/spent-record-page'))
const QuickCreatePage = lazy(() => import('./pages/quick-create-page'))
const ConfigPage = lazy(() => import('./pages/config-page'))
const ConfigTypePage = lazy(() => import('./pages/config-pages/config-type-page'))
const ConfigPaymentPage = lazy(() => import('./pages/config-pages/config-payment-page'))
const UserDefaultPage = lazy(() => import('./routers/user-default-page'))
const ConfigPreferencePage = lazy(() => import('./pages/config-pages/config-preference-page'))
const SubscriptionRecordPage = lazy(() => import('./pages/subscription-record-page'))
const ConfigBudgetPage = lazy(() => import('./pages/config-pages/config-budget-page'))
const ConfigPresetPage = lazy(() => import('./pages/config-pages/config-preset-page'))
const Logout = lazy(() => import('./routers/logout'))
const ConfigAboutPage = lazy(() => import('./pages/config-pages/config-about-page'))
const RecordChartPage = lazy(() => import('./pages/record-chart-page'))

export default function App() {

    //const { data: userSettings } = useGetUserSettingsQuery(undefined, { skip: !pb.authStore.isValid })
    const [colorMode, setColorMode] = React.useState<'light' | 'dark' | 'system'>('system')
    //const colorMode = 'system'

    const router = createBrowserRouter(
        createRoutesFromElements([
            (
                <Route path="/" element={<Suspense fallback={<PageTopProgressBar />}><Root /></Suspense>} errorElement={<Suspense fallback={<PageTopProgressBar />}><ErrorPage /></Suspense>}>
                    <Route index element={<Suspense fallback={<PageTopProgressBar />}><UserDefaultPage /></Suspense>} />

                    <Route path="spentRecord" element={<Suspense fallback={<PageTopProgressBar />}><SpentRecordPage /></Suspense>} />
                    <Route path="quickCreate" element={<Suspense fallback={<PageTopProgressBar />}><QuickCreatePage /></Suspense>} />
                    <Route path="subscriptionRecord" element={<Suspense fallback={<PageTopProgressBar />}><SubscriptionRecordPage /></Suspense>} />
                    <Route path="recordChart" element={<Suspense fallback={<PageTopProgressBar />}><RecordChartPage /></Suspense>} />

                    <Route path="config" element={<Suspense fallback={<PageTopProgressBar />}><ConfigPage /></Suspense>}>
                        {/* <Route index element={<Navigate to="preference" replace />} /> */}

                        <Route path="preference" element={<Suspense fallback={<PageTopProgressBar />}><ConfigPreferencePage /></Suspense>} />
                        <Route path="budget" element={<Suspense fallback={<PageTopProgressBar />}><ConfigBudgetPage /></Suspense>} />
                        <Route path="type" element={<Suspense fallback={<PageTopProgressBar />}><ConfigTypePage /></Suspense>} />
                        <Route path="payment" element={<Suspense fallback={<PageTopProgressBar />}><ConfigPaymentPage /></Suspense>} />
                        <Route path="preset" element={<Suspense fallback={<PageTopProgressBar />}><ConfigPresetPage /></Suspense>} />
                        <Route path="about" element={<Suspense fallback={<PageTopProgressBar />}><ConfigAboutPage /></Suspense>} />
                    </Route>
                </Route>
            ), (
                <Route path="/login" element={<Suspense fallback={<PageTopProgressBar />}><LoginPage /></Suspense>} />
            ), (
                <Route path="/logout" element={<Suspense fallback={<PageTopProgressBar />}><Logout /></Suspense>} />
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
            <ThemeContext.Provider value={{colorMode, setColorMode}}>
                <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale='zh-HK' localeText={zhHK.components.MuiLocalizationProvider.defaultProps.localeText}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <div>
                            <RouterProvider router={router} />
                        </div>
                    </ThemeProvider>
                    
                </LocalizationProvider>
            </ThemeContext.Provider>
        </PocketBaseContext.Provider>
        </div>
    )
}