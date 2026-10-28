import { describe, expect, it } from 'vitest';
import { Cart, clampQuantity, MAX_QUANTITY_PER_LINE } from './Cart';

const lines = [
  { productId: 'p1', name: 'Coffee', unitPrice: 4.1, quantity: 3 },
  { productId: 'p2', name: 'Muffin', unitPrice: 3.35, quantity: 1 },
];

describe('Cart', () => {
  it('sums items and subtotal with 2-decimal precision', () => {
    const cart = new Cart(lines);
    expect(cart.itemCount).toBe(4);
    expect(cart.subtotal).toBe(15.65);
    expect(cart.lineTotal(lines[0]!)).toBe(12.3);
  });

  it('knows when it is empty', () => {
    expect(new Cart([]).isEmpty).toBe(true);
    expect(new Cart(lines).isEmpty).toBe(false);
  });

  it('reports quantity per product and the per-line limit', () => {
    const cart = new Cart([{ productId: 'p1', name: 'Coffee', unitPrice: 1, quantity: MAX_QUANTITY_PER_LINE }]);
    expect(cart.quantityOf('p1')).toBe(MAX_QUANTITY_PER_LINE);
    expect(cart.quantityOf('missing')).toBe(0);
    expect(cart.canAddMoreOf('p1')).toBe(false);
  });
});

describe('clampQuantity', () => {
  it('keeps quantities within 1..MAX', () => {
    expect(clampQuantity(0)).toBe(1);
    expect(clampQuantity(2.7)).toBe(2);
    expect(clampQuantity(99)).toBe(MAX_QUANTITY_PER_LINE);
    expect(clampQuantity(Number.NaN)).toBe(1);
  });
});
