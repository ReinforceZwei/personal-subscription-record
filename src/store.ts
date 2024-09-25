import { configureStore } from '@reduxjs/toolkit'
import recordReducer from './redux/recordSlice'
import routingReducer from './redux/routingSlice'
import uiReducer from './redux/uiSlice'

import { pocketbaseApi } from './redux/api'

export const store = configureStore({
    reducer: {
        [pocketbaseApi.reducerPath]: pocketbaseApi.reducer,
        record: recordReducer,
        routing: routingReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(pocketbaseApi.middleware)
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store