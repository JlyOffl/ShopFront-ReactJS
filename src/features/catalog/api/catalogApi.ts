import { z } from 'zod';
import { baseApi } from '@/shared/api/baseApi';
import type { CountryCode } from '@/shared/domain';
import type { ProductData } from '../model';

export const ProductDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().default(''),
  category: z.string(),
  price: z.number().nonnegative(),
  inStock: z.boolean(),
  rating: z.number().min(0).max(5).optional(),
});

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<ProductData[], CountryCode>({
      query: (countryCode) => ({ url: 'products', params: { countryCode } }),
      transformResponse: (raw: unknown) => z.array(ProductDtoSchema).parse(raw),
      providesTags: (result = []) => [
        ...result.map(({ id }) => ({ type: 'Product' as const, id })),
        { type: 'Product' as const, id: 'LIST' },
      ],
    }),
  }),
});

export const { useGetProductsQuery } = catalogApi;
