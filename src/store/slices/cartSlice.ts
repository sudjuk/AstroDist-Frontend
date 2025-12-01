import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logout } from './authSlice';
import { AsteroidObservationsService } from '../../api/generated';

export interface CartState {
  draftId: number;
  count: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  draftId: 0,
  count: 0,
  loading: false,
  error: null,
};

type CartApiResponse = {
  draftId?: number;
  count?: number;
};

export const fetchCartInfo = createAsyncThunk<
  CartApiResponse,
  void,
  { rejectValue: string }
>('cart/fetchCartInfo', async (_, { rejectWithValue }) => {
  try {
    const data = await AsteroidObservationsService.getApiAsteroidObservationsCart();
    return data as CartApiResponse;
  } catch (e: any) {
    const msg = e?.message || 'Ошибка загрузки корзины';
    return rejectWithValue(msg);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCartInfo.fulfilled,
        (state, action: PayloadAction<CartApiResponse | undefined>) => {
          state.loading = false;
          state.error = null;
          state.draftId = action.payload?.draftId ?? 0;
          state.count = action.payload?.count ?? 0;
        }
      )
      .addCase(fetchCartInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
        state.draftId = 0;
        state.count = 0;
      })
      .addCase(logout, () => initialState);
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;




