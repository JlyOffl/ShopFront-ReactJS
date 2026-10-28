import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { toErrorMessage } from '@/shared/api/errors';
import type { CountryCode } from '@/shared/domain';
import { useGetPaymentMethodsQuery } from '../api/paymentApi';
import { convertPaymentMethods, resolveSelectedProvider, type PaymentMethodData } from '../model';
import { paymentMethodSelected, selectSelectedProvider } from '../state/paymentSlice';

const NO_METHODS: PaymentMethodData[] = [];

/**
 * Compare with the article's first version: no fetch, no mapping, no
 * `provider === 'cash'` here. RTK Query handles caching/retries, the domain
 * converts and decides defaults, Redux keeps the user's choice.
 */
export const usePaymentMethods = (countryCode: CountryCode) => {
  const dispatch = useAppDispatch();
  const { data = NO_METHODS, isLoading, isError, error, refetch } = useGetPaymentMethodsQuery(countryCode);
  const userChoice = useAppSelector(selectSelectedProvider);

  const paymentMethods = useMemo(() => convertPaymentMethods(data), [data]);
  const selectedProvider = useMemo(
    () => resolveSelectedProvider(paymentMethods, userChoice),
    [paymentMethods, userChoice],
  );

  const selectPaymentMethod = useCallback(
    (provider: string) => dispatch(paymentMethodSelected(provider)),
    [dispatch],
  );

  return {
    paymentMethods,
    selectedProvider,
    selectPaymentMethod,
    isLoading,
    errorMessage: isError ? toErrorMessage(error) : null,
    retry: refetch,
  };
};
