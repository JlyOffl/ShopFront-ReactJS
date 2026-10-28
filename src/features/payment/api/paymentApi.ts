import { z } from 'zod';
import { baseApi } from '@/shared/api/baseApi';
import type { CountryCode } from '@/shared/domain';
import type { PaymentMethodData } from '../model';

/**
 * Gateway / anti-corruption layer.
 * The remote contract is validated here, at the edge, so a backend change
 * fails loudly in one file instead of leaking `undefined` into the views.
 */
export const RemotePaymentMethodSchema = z.object({
  name: z.string().min(1),
  displayName: z.string().optional(),
});

export type RemotePaymentMethod = z.infer<typeof RemotePaymentMethodSchema>;

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // The cache holds plain, serializable DTOs; hooks turn them into domain objects.
    getPaymentMethods: build.query<PaymentMethodData[], CountryCode>({
      query: (countryCode) => ({ url: 'payment-methods', params: { countryCode } }),
      transformResponse: (raw: unknown) => z.array(RemotePaymentMethodSchema).parse(raw),
      providesTags: (_result, _error, countryCode) => [{ type: 'PaymentMethod', id: countryCode }],
    }),
  }),
});

export const { useGetPaymentMethodsQuery } = paymentApi;
