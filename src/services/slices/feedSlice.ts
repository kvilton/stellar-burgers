import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { TOrder } from '@utils-types';
import { getFeedsApi } from '../../utils/burger-api';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false
};

export const fetchFeeds = createAsyncThunk(
  'feed/fetchAll',
  async () => {
    return getFeedsApi();
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export default feedSlice.reducer;
