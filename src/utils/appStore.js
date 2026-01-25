import { configureStore } from '@reduxjs/toolkit';
import { connectionReducer } from './connection-slice';
import { feedReducer } from './feed-slice';
import { userReducer } from './user-slice';

export const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connections: connectionReducer,
  },
});
