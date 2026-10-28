import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { countryChanged } from '@/features/region';
import { clampQuantity, MAX_QUANTITY_PER_LINE, type CartItemInput, type CartLine } from '../model';

export interface CartState {
  lines: CartLine[];
}

const initialState: CartState = { lines: [] };

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    itemAdded(state, action: PayloadAction<CartItemInput>) {
      const { id, name, price } = action.payload;
      const existing = state.lines.find((line) => line.productId === id);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + 1, MAX_QUANTITY_PER_LINE);
      } else {
        state.lines.push({ productId: id, name, unitPrice: price, quantity: 1 });
      }
    },
    quantityChanged(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const line = state.lines.find((item) => item.productId === action.payload.productId);
      if (line) line.quantity = clampQuantity(action.payload.quantity);
    },
    itemRemoved(state, action: PayloadAction<string>) {
      state.lines = state.lines.filter((line) => line.productId !== action.payload);
    },
    cartCleared() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Prices are per market, so a cart can never span currencies.
    builder.addCase(countryChanged, () => initialState);
  },
  selectors: {
    selectCartLines: (state) => state.lines,
  },
});

export const { itemAdded, quantityChanged, itemRemoved, cartCleared } = cartSlice.actions;
export const { selectCartLines } = cartSlice.selectors;
