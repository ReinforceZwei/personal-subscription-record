import { configureStore } from '@reduxjs/toolkit'
import recordReducer from './redux/recordSlice'

export default configureStore({
    reducer: {
        record: recordReducer
    }
})