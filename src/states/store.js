import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import modelReducer from './modelInfo/modelInfoSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        models: modelReducer,
    },
});

export const RootState = store.getState;
export const AppDispatch = store.dispatch;

export default store;
