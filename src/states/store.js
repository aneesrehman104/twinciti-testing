import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import modelReducer from './modelInfo/modelInfoSlice';
import chatReducer from './chat/chatSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        models: modelReducer,
        chats: chatReducer,
    },
});

export const RootState = store.getState;
export const AppDispatch = store.dispatch;

export default store;
