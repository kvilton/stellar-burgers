import {
  createAsyncThunk,
  createSlice,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';

import {
  orderBurgerApi,
  getOrderByNumberApi,
  TNewOrder
} from '../../utils/burger-api';

import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

interface IOrderState {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TNewOrder | null;
  currentOrder: TOrder | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: IOrderState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  currentOrder: null,
  isLoading: false,
  error: null
};

export const orderBurger = createAsyncThunk<TNewOrder, string[]>(
  'order/orderBurger',
  async (ingredients, { rejectWithValue }) => {
    try {
      const res = await orderBurgerApi(ingredients);

      if (!res.success) {
        return rejectWithValue(res);
      }

      return res.order;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'order/fetchOrderByNumber',
  async (number, { rejectWithValue }) => {
    try {
      const res = await getOrderByNumberApi(number);

      if (!res.success) {
        return rejectWithValue(res);
      }

      return res.orders[0];
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addIngredient: {
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      },

      prepare(ingredient: TIngredient) {
        return {
          payload: {
            ...ingredient,
            id: nanoid()
          }
        };
      }
    },

    removeIngredient(state, action: PayloadAction<string>) {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload
        );
    },

    moveIngredientUp(state, action: PayloadAction<number>) {
      const index = action.payload;

      if (index > 0) {
        [
          state.constructorItems.ingredients[index],
          state.constructorItems.ingredients[index - 1]
        ] = [
          state.constructorItems.ingredients[index - 1],
          state.constructorItems.ingredients[index]
        ];
      }
    },

    moveIngredientDown(state, action: PayloadAction<number>) {
      const index = action.payload;

      if (index < state.constructorItems.ingredients.length - 1) {
        [
          state.constructorItems.ingredients[index],
          state.constructorItems.ingredients[index + 1]
        ] = [
          state.constructorItems.ingredients[index + 1],
          state.constructorItems.ingredients[index]
        ];
      }
    },

    sendOrderRequest(state) {
      state.orderRequest = true;
    },

    clearConstructor(state) {
      state.constructorItems = {
        bun: null,
        ingredients: []
      };
    },

    clearOrderModalData(state) {
      state.orderModalData = null;
    }
  },

  extraReducers(builder) {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(
        orderBurger.fulfilled,
        (state, action: PayloadAction<TNewOrder>) => {
          state.isLoading = false;
          state.orderRequest = false;
          state.orderModalData = action.payload;

          state.constructorItems = {
            bun: null,
            ingredients: []
          };
        }
      )

      .addCase(orderBurger.rejected, (state, action) => {
        state.isLoading = false;
        state.orderRequest = false;
        state.error = action.error.message ?? 'Ошибка размещения заказа';
      })

      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.isLoading = false;
          state.currentOrder = action.payload;
        }
      )

      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка получения заказа';
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  sendOrderRequest,
  clearConstructor,
  clearOrderModalData
} = orderSlice.actions;

export const removeIngridient = removeIngredient;
export const clearOrderModal = clearOrderModalData;

export default orderSlice.reducer;
