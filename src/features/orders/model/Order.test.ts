import { describe, expect, it } from 'vitest';
import { Order, toOrders, type OrderData } from './Order';

const base: OrderData = {
  id: 'ord_000000abc123',
  createdAt: '2026-10-01T10:00:00.000Z',
  countryCode: 'AU',
  status: 'PAID',
  lines: [
    { productId: 'p1', name: 'Coffee', unitPrice: 4.5, quantity: 2 },
    { productId: 'p2', name: 'Muffin', unitPrice: 3, quantity: 1 },
  ],
  paymentProvider: 'apple',
  subtotal: 12,
  donation: 0,
  total: 12,
};

describe('Order', () => {
  it('exposes derived, display-ready values', () => {
    const order = new Order(base);
    expect(order.reference).toBe('#ABC123');
    expect(order.itemCount).toBe(3);
    expect(order.statusLabel).toBe('Paid');
    expect(order.hasDonation).toBe(false);
  });

  it('only allows cancelling orders that have not shipped', () => {
    expect(new Order(base).isCancellable).toBe(true);
    expect(new Order({ ...base, status: 'SHIPPED' }).isCancellable).toBe(false);
    expect(new Order({ ...base, status: 'CANCELLED' }).isCancellable).toBe(false);
  });

  it('sorts newest first', () => {
    const orders = toOrders([
      { ...base, id: 'old', createdAt: '2026-01-01T00:00:00.000Z' },
      { ...base, id: 'new', createdAt: '2026-06-01T00:00:00.000Z' },
    ]);
    expect(orders.map((o) => o.id)).toEqual(['new', 'old']);
  });
});
