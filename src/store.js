import { configureStore } from '@reduxjs/toolkit'
import recordReducer from './redux/recordSlice'
import typeReducer from './redux/typeSlice'
import paymentReducer from './redux/paymentSlice'
import userSettingsReducer from './redux/userSettingsSlice'
import routingReducer from './redux/routingSlice'
import budgetReducer from './redux/budgetSlice'

import { pocketbaseApi } from './redux/api'

export default configureStore({
    reducer: {
        [pocketbaseApi.reducerPath]: pocketbaseApi.reducer,
        record: recordReducer,
        type: typeReducer,
        payment: paymentReducer,
        userSettings: userSettingsReducer,
        routing: routingReducer,
        budget: budgetReducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(pocketbaseApi.middleware)
    },
})