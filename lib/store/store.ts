import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth/authSlice";
import classReducer from "./classes/classSlices";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    class: classReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
