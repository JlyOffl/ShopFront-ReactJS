import { z } from 'zod';
import { baseApi } from '@/shared/api/baseApi';
import { COUNTRY_CODES, type CountryCode } from '@/shared/domain';
import { ORDER_STATUSES, type OrderData } from '../model';

export const OrderDtoSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  countryCode: z.enum(COUNTRY_CODES),
  status: z.enum(ORDER_STATUSES),
  lines: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      unitPrice: z.number(),
      quantity: z.number().int().positive(),
    }),
  ),
  paymentProvider: z.string(),
  subtotal: z.number(),
  donation: z.number().nonnegative(),
  total: z.number(),
});

export interface PlaceOrderRequest {
  countryCode: CountryCode;
  lines: { productId: string; quantity: number }[];
  paymentProvider: string;
  donation: number;
  /** What the customer saw on the button; the server re-computes and rejects mismatches. */
  expectedTotal: number;
}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOrders: build.query<OrderData[], void>({
      query: () => 'orders',
      transformResponse: (raw: unknown) => z.array(OrderDtoSchema).parse(raw),
      providesTags: (result = []) => [
        ...result.map(({ id }) => ({ type: 'Order' as const, id })),
        { type: 'Order' as const, id: 'LIST' },
      ],
    }),
    getOrder: build.query<OrderData, string>({
      query: (orderId) => `orders/${encodeURIComponent(orderId)}`,
      transformResponse: (raw: unknown) => OrderDtoSchema.parse(raw),
      providesTags: (_result, _error, orderId) => [{ type: 'Order', id: orderId }],
    }),
    placeOrder: build.mutation<OrderData, PlaceOrderRequest>({
      query: (body) => ({ url: 'orders', method: 'POST', body }),
      transformResponse: (raw: unknown) => OrderDtoSchema.parse(raw),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }],
    }),
    cancelOrder: build.mutation<OrderData, string>({
      query: (orderId) => ({ url: `orders/${encodeURIComponent(orderId)}/cancel`, method: 'POST' }),
      transformResponse: (raw: unknown) => OrderDtoSchema.parse(raw),
      invalidatesTags: (_result, _error, orderId) => [
        { type: 'Order', id: orderId },
        { type: 'Order', id: 'LIST' },
      ],
    }),
  }),
});

export const { useGetOrdersQuery, useGetOrderQuery, usePlaceOrderMutation, useCancelOrderMutation } = ordersApi;
