import { describe, expect, it } from 'vitest';
import { countryChanged } from '@/features/region';
import { MAX_QUANTITY_PER_LINE } from '../model';
import { cartCleared, cartSlice, itemAdded, itemRemoved, quantityChanged } from './cartSlice';

const reducer = cartSlice.reducer;
const coffee = { id: 'p1', name: 'Coffee', price: 4.5 };

describe('cartSlice', () => {
  it('adds a new line, then increments it', () => {
    let state = reducer(undefined, itemAdded(coffee));
    state = reducer(state, itemAdded(coffee));
    expect(state.lines).toEqual([{ productId: 'p1', name: 'Coffee', unitPrice: 4.5, quantity: 2 }]);
  });

  it('never exceeds the per-line maximum', () => {
    let state = reducer(undefined, itemAdded(coffee));
    state = reducer(state, quantityChanged({ productId: 'p1', quantity: 500 }));
    state = reducer(state, itemAdded(coffee));
    expect(state.lines[0]?.quantity).toBe(MAX_QUANTITY_PER_LINE);
  });

  it('removes and clears lines', () => {
    const state = reducer(undefined, itemAdded(coffee));
    expect(reducer(state, itemRemoved('p1')).lines).toEqual([]);
    expect(reducer(state, cartCleared()).lines).toEqual([]);
  });

  it('empties the cart when the market changes', () => {
    const state = reducer(undefined, itemAdded(coffee));
    expect(reducer(state, countryChanged('JP')).lines).toEqual([]);
  });
});
