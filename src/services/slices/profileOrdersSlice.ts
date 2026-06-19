import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { TOrder } from '@utils-types';
import { getOrdersApi } from '../../utils/burger-api';

type TProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
};

const initialState: TProfileOrdersState = {
  orders: [],
  isLoading: false
};

export const fetchProfileOrders = createAsyncThunk<
  TOrder[]
>('profileOrders/fetchAll', async () => {
  return getOrdersApi();
});

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export default profileOrdersSlice.reducer;
