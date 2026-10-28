import { useCallback } from 'react';
import { useCountryCode } from '@/features/region';
import { countryPaymentFor } from '../model';

/**
 * Resolves the strategy for the current market. Strategies are singletons in
 * the registry, so the reference is stable across renders (safe for useMemo deps).
 */
export const useCountryPayment = () => {
  const countryCode = useCountryCode();
  return { countryCode, strategy: countryPaymentFor(countryCode) };
};

/** Stable money formatter for the current market, handy for humble views. */
export const useMoneyFormatter = () => {
  const { strategy } = useCountryPayment();
  return useCallback((amount: number) => strategy.formatAmount(amount), [strategy]);
};
