import { configureStore } from '@reduxjs/toolkit'
import recordReducer from './redux/recordSlice'
import typeReducer from './redux/typeSlice'
import paymentReducer from './redux/paymentSlice'
import userSettingsReducer from './redux/userSettingsSlice'
import routingReducer from './redux/routingSlice'
import budgetReducer from './redux/budgetSlice'
import uiReducer from './redux/uiSlice'

import { baseApi } from './redux/api'

export default configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        record: recordReducer,
        type: typeReducer,
        payment: paymentReducer,
        userSettings: userSettingsReducer,
        routing: routingReducer,
        budget: budgetReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(baseApi.middleware)
    },
})