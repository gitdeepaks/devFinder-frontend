import { createSlice } from '@reduxjs/toolkit';

const connectionSlice = createSlice({
  name: 'connection',
  initialState: null,
  reducers: {
    addConnection: (_state, action) => {
      return action.payload;
    },
    removeConnection: (_state, _action) => null,
  },
});

export const { addConnection } = connectionSlice.actions;
export const connectionReducer = connectionSlice.reducer;
