import { configureStore } from '@reduxjs/toolkit'
import recordReducer from './redux/recordSlice'
import typeReducer from './redux/typeSlice'
import paymentReducer from './redux/paymentSlice'
import userSettingsReducer from './redux/userSettingsSlice'
import routingReducer from './redux/routingSlice'

export default configureStore({
    reducer: {
        record: recordReducer,
        type: typeReducer,
        payment: paymentReducer,
        userSettings: userSettingsReducer,
        routing: routingReducer,
    }
})