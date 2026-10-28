import { delay, http, HttpResponse } from 'msw';
import { apiUrl } from '@/shared/config/env';
import { DEFAULT_COUNTRY, isCountryCode, type CountryCode } from '@/shared/domain';
import { db } from './db';

const countryFrom = (request: Request): CountryCode => {
  const code = new URL(request.url).searchParams.get('countryCode');
  return isCountryCode(code) ? code : DEFAULT_COUNTRY;
};

interface PlaceOrderBody {
  countryCode: CountryCode;
  lines: { productId: string; quantity: number }[];
  paymentProvider: string;
  donation: number;
  expectedTotal: number;
}

export const handlers = [
  http.get(apiUrl('products'), async ({ request }) => {
    await delay();
    return HttpResponse.json(db.products(countryFrom(request)));
  }),

  http.get(apiUrl('payment-methods'), async ({ request }) => {
    await delay();
    return HttpResponse.json(db.paymentMethods(countryFrom(request)));
  }),

  http.get(apiUrl('orders'), async () => {
    await delay();
    return HttpResponse.json(db.orders());
  }),

  http.get(apiUrl('orders/:orderId'), async ({ params }) => {
    await delay();
    const order = db.order(String(params.orderId));
    return order ? HttpResponse.json(order) : HttpResponse.json({ message: 'Order not found' }, { status: 404 });
  }),

  http.post(apiUrl('orders'), async ({ request }) => {
    await delay();
    const body = (await request.json()) as PlaceOrderBody;
    if (!isCountryCode(body.countryCode) || !Array.isArray(body.lines) || body.lines.length === 0) {
      return HttpResponse.json({ message: 'Invalid order request' }, { status: 400 });
    }
    const result = db.createOrder(body);
    if ('error' in result) {
      return HttpResponse.json({ message: result.error }, { status: 422 });
    }
    if (Math.abs(result.total - body.expectedTotal) > 0.001) {
      return HttpResponse.json({ message: 'Prices changed — please review your cart.' }, { status: 409 });
    }
    return HttpResponse.json(result, { status: 201 });
  }),

  http.post(apiUrl('orders/:orderId/cancel'), async ({ params }) => {
    await delay();
    const existing = db.order(String(params.orderId));
    if (!existing) return HttpResponse.json({ message: 'Order not found' }, { status: 404 });
    if (existing.status !== 'PENDING' && existing.status !== 'PAID') {
      return HttpResponse.json({ message: 'This order can no longer be cancelled.' }, { status: 409 });
    }
    return HttpResponse.json(db.cancelOrder(existing.id));
  }),
];
