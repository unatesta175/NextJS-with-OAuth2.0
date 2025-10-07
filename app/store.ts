import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import roleReducer from './features/auth/roleSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    role: roleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


