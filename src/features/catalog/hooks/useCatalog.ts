import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { useCountryCode } from '@/features/region';
import { toErrorMessage } from '@/shared/api/errors';
import { useGetProductsQuery } from '../api/catalogApi';
import { ALL_CATEGORIES, categoriesOf, filterProducts, toProducts, type ProductData } from '../model';

const NO_PRODUCTS: ProductData[] = [];

/**
 * Filter state lives in the URL (?q=&category=) so views are shareable and
 * survive refresh — no Redux needed for it.
 */
export const useCatalog = () => {
  const countryCode = useCountryCode();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? ALL_CATEGORIES;

  const { data = NO_PRODUCTS, isLoading, isFetching, isError, error, refetch } = useGetProductsQuery(countryCode);

  const allProducts = useMemo(() => toProducts(data), [data]);
  const categories = useMemo(() => categoriesOf(allProducts), [allProducts]);
  const products = useMemo(() => filterProducts(allProducts, { query, category }), [allProducts, query, category]);

  const updateParam = useCallback(
    (key: 'q' | 'category', value: string, emptyValue: string) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          if (value && value !== emptyValue) next.set(key, value);
          else next.delete(key);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return {
    products,
    categories,
    query,
    category,
    totalCount: allProducts.length,
    setQuery: (value: string) => updateParam('q', value, ''),
    setCategory: (value: string) => updateParam('category', value, ALL_CATEGORIES),
    isLoading,
    isRefreshing: isFetching && !isLoading,
    errorMessage: isError ? toErrorMessage(error) : null,
    retry: refetch,
  };
};
