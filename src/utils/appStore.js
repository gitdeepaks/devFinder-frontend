import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './user-slice';

export const appStore = configureStore({
  reducer: {
    user: userReducer,
  },
});
