import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { TOrder } from '@utils-types';
import { orderBurgerApi } from '../../utils/burger-api';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null
};

type TApiOrder = Awaited<
  ReturnType<typeof orderBurgerApi>
>['order'];

export const createOrder = createAsyncThunk<
  TApiOrder,
  string[]
>('order/create', async (ingredients) => {
  const response = await orderBurgerApi(ingredients);
  return response.order;
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })

      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;

        const order = action.payload;

        state.orderModalData = {
          _id: order._id,
          name: order.name,
          status: order.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt
        } as TOrder;
      })

      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
      });
  }
});

export const { clearOrderModalData } = orderSlice.actions;
export default orderSlice.reducer;
