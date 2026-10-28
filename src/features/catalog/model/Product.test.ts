import { describe, expect, it } from 'vitest';
import { ALL_CATEGORIES, categoriesOf, filterProducts, Product, toProducts } from './Product';

const products = toProducts([
  { id: '1', name: 'Flat White', description: 'Double shot', category: 'Coffee', price: 5, inStock: true },
  { id: '2', name: 'Banana Bread', description: 'Toasted', category: 'Bakery', price: 6, inStock: false },
  { id: '3', name: 'Cold Brew', description: 'Slow steeped', category: 'Coffee', price: 6.5, inStock: true },
]);

describe('Product', () => {
  it('derives initials and falls back for a missing rating', () => {
    const product = new Product({
      id: 'x',
      name: 'Flat White',
      description: '',
      category: 'Coffee',
      price: 1,
      inStock: true,
    });
    expect(product.initials).toBe('FW');
    expect(product.rating).toBe(0);
  });
});

describe('catalog filtering', () => {
  it('filters by category and free text', () => {
    expect(filterProducts(products, { query: '', category: 'Coffee' }).map((p) => p.id)).toEqual(['1', '3']);
    expect(filterProducts(products, { query: 'toast', category: ALL_CATEGORIES }).map((p) => p.id)).toEqual([
      '2',
    ]);
  });

  it('lists distinct, sorted categories', () => {
    expect(categoriesOf(products)).toEqual(['Bakery', 'Coffee']);
  });
});
