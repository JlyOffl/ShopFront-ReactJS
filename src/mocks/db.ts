import type { CountryCode } from '@/shared/domain';

/**
 * In-memory fake backend used by MSW in the browser and in tests.
 * Shapes here are the *remote* contract (DTOs), deliberately independent of
 * the domain classes — that is what the gateway layer protects us from.
 */
interface ProductRecord {
  id: string;
  name: string;
  description: string;
  category: string;
  inStock: boolean;
  rating?: number;
  prices: Record<CountryCode, number>;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  countryCode: CountryCode;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  lines: { productId: string; name: string; unitPrice: number; quantity: number }[];
  paymentProvider: string;
  subtotal: number;
  donation: number;
  total: number;
}

const PRODUCTS: ProductRecord[] = [
  {
    id: 'p-flat-white',
    name: 'Flat White',
    description: 'Double ristretto with silky micro-foam.',
    category: 'Coffee',
    inStock: true,
    rating: 4.5,
    prices: { AU: 5.2, US: 4.75, JP: 620, DK: 42.5 },
  },
  {
    id: 'p-cold-brew',
    name: 'Cold Brew',
    description: '18-hour slow steeped, served over ice.',
    category: 'Coffee',
    inStock: true,
    rating: 4,
    prices: { AU: 6.3, US: 5.5, JP: 680, DK: 47 },
  },
  {
    id: 'p-banana-bread',
    name: 'Banana Bread',
    description: 'Toasted with whipped honey butter.',
    category: 'Bakery',
    inStock: true,
    rating: 5,
    prices: { AU: 6.5, US: 5.25, JP: 540, DK: 39.5 },
  },
  {
    id: 'p-croissant',
    name: 'Butter Croissant',
    description: 'Laminated in-house every morning.',
    category: 'Bakery',
    inStock: false,
    rating: 4.5,
    prices: { AU: 5.9, US: 4.5, JP: 412, DK: 35 },
  },
  {
    id: 'p-beans',
    name: 'House Blend Beans 250g',
    description: 'Chocolate, hazelnut and stone fruit.',
    category: 'Retail',
    inStock: true,
    rating: 4.5,
    prices: { AU: 19.8, US: 16.4, JP: 2160, DK: 129.5 },
  },
  {
    id: 'p-keepcup',
    name: 'Reusable Cup',
    description: 'Glass and cork, 340ml.',
    category: 'Retail',
    inStock: true,
    prices: { AU: 34.95, US: 27.99, JP: 3312, DK: 229 },
  },
];

const PAYMENT_METHODS: Record<CountryCode, { name: string; displayName?: string }[]> = {
  AU: [{ name: 'apple', displayName: 'Apple Pay' }, { name: 'google', displayName: 'Google Pay' }, { name: 'paypal', displayName: 'PayPal' }],
  US: [{ name: 'apple', displayName: 'Apple Pay' }, { name: 'card', displayName: 'Credit card' }],
  JP: [{ name: 'paypay', displayName: 'PayPay' }, { name: 'konbini', displayName: 'Konbini' }],
  DK: [{ name: 'mobilepay', displayName: 'MobilePay' }],
};

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

const seedOrders = (): OrderRecord[] => [
  {
    id: 'ord_20261003_a1b2c3',
    createdAt: '2026-10-03T09:15:00.000Z',
    countryCode: 'AU',
    status: 'DELIVERED',
    lines: [
      { productId: 'p-flat-white', name: 'Flat White', unitPrice: 5.2, quantity: 2 },
      { productId: 'p-banana-bread', name: 'Banana Bread', unitPrice: 6.5, quantity: 1 },
    ],
    paymentProvider: 'apple',
    subtotal: 16.9,
    donation: 0.1,
    total: 17,
  },
  {
    id: 'ord_20261015_d4e5f6',
    createdAt: '2026-10-15T23:40:00.000Z',
    countryCode: 'JP',
    status: 'SHIPPED',
    lines: [{ productId: 'p-keepcup', name: 'Reusable Cup', unitPrice: 3312, quantity: 1 }],
    paymentProvider: 'paypay',
    subtotal: 3312,
    donation: 88,
    total: 3400,
  },
  {
    id: 'ord_20261024_g7h8i9',
    createdAt: '2026-10-24T14:05:00.000Z',
    countryCode: 'DK',
    status: 'PAID',
    lines: [{ productId: 'p-beans', name: 'House Blend Beans 250g', unitPrice: 129.5, quantity: 2 }],
    paymentProvider: 'mobilepay',
    subtotal: 259,
    donation: 0,
    total: 259,
  },
];

let orders: OrderRecord[] = seedOrders();
let sequence = 1;

export const db = {
  products(countryCode: CountryCode) {
    return PRODUCTS.map(({ prices, ...product }) => ({ ...product, price: prices[countryCode] }));
  },

  paymentMethods(countryCode: CountryCode) {
    return PAYMENT_METHODS[countryCode];
  },

  orders() {
    return orders;
  },

  order(id: string) {
    return orders.find((order) => order.id === id);
  },

  createOrder(input: {
    countryCode: CountryCode;
    lines: { productId: string; quantity: number }[];
    paymentProvider: string;
    donation: number;
  }): OrderRecord | { error: string } {
    const lines = [];
    for (const { productId, quantity } of input.lines) {
      const product = PRODUCTS.find((item) => item.id === productId);
      if (!product) return { error: `Unknown product ${productId}` };
      if (!product.inStock) return { error: `${product.name} is sold out` };
      lines.push({ productId, name: product.name, unitPrice: product.prices[input.countryCode], quantity });
    }
    const subtotal = round2(lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0));
    const order: OrderRecord = {
      id: `ord_${Date.now()}_${(sequence++).toString(36).padStart(6, '0')}`,
      createdAt: new Date().toISOString(),
      countryCode: input.countryCode,
      status: 'PENDING',
      lines,
      paymentProvider: input.paymentProvider,
      subtotal,
      donation: input.donation,
      total: round2(subtotal + input.donation),
    };
    orders = [order, ...orders];
    return order;
  },

  cancelOrder(id: string): OrderRecord | undefined {
    const order = orders.find((item) => item.id === id);
    if (!order) return undefined;
    const updated = { ...order, status: 'CANCELLED' as const };
    orders = orders.map((item) => (item.id === id ? updated : item));
    return updated;
  },
};

/** Called between tests so they never leak state into each other. */
export const resetDb = (): void => {
  orders = seedOrders();
  sequence = 1;
};
