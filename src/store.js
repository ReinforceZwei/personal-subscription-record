import { configureStore } from '@reduxjs/toolkit'
import recordReducer from './redux/recordSlice'
import typeReducer from './redux/typeSlice'
import paymentReducer from './redux/paymentSlice'
import userSettingsReducer from './redux/userSettingsSlice'

export default configureStore({
    reducer: {
        record: recordReducer,
        type: typeReducer,
        payment: paymentReducer,
        userSettings: userSettingsReducer,
    }
})