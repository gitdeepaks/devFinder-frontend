import { createSlice } from '@reduxjs/toolkit';

const feedSlice = createSlice({
  name: 'feed',
  initialState: null,
  reducers: {
    addFeed: (_state, action) => {
      return action.payload;
    },
    removeFeed: (state, action) => {
      const newArrayFeed = state.filter((user) => user._id !== action.payload);
      return newArrayFeed;
    },
  },
});

export const { addFeed, removeFeed } = feedSlice.actions;
export const feedReducer = feedSlice.reducer;
