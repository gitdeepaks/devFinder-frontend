import { createSlice } from '@reduxjs/toolkit';

const connectionSlice = createSlice({
  name: 'connection',
  initialState: null,
  reducers: {
    addConnection: (state, action) => {
      return action.payload;
    },
    removeConnection: (state, action) => null,
  },
});

export const { addConnection } = connectionSlice.actions;
export const connectionReducer = connectionSlice.reducer;
