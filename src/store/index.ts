import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from './slices/filtersSlice';
import daysReducer from './slices/daysSlice';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import requestsReducer from './slices/requestsSlice';

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    days: daysReducer,
    auth: authReducer,
    cart: cartReducer,
    requests: requestsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


