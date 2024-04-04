import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import modelReducer from "./modelInfo/modelInfoSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    models: modelReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
