import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import { env } from '@/shared/config/env';

const newCorrelationId = (): string =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;

/**
 * Single network client for the whole app (the article's "extract a network
 * client" step). Cross-cutting concerns — headers, auth, retries, correlation
 * ids — live here once instead of in every component's useEffect.
 */
const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.apiBaseUrl,
  prepareHeaders: (headers) => {
    headers.set('Accept', 'application/json');
    headers.set('X-Correlation-Id', newCorrelationId());
    // const token = selectAccessToken(getState() as RootState);
    // if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithRetry = retry(rawBaseQuery, { maxRetries: env.isTest ? 0 : 2 });

/**
 * Feature gateways extend this with `baseApi.injectEndpoints(...)` so each
 * feature owns its endpoints while sharing one cache and middleware.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['Product', 'PaymentMethod', 'Order'],
  endpoints: () => ({}),
});
