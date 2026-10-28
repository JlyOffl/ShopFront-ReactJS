import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import type { CountryPayment } from '../model';
import { donationToggled, selectAgreeToDonate } from '../state/paymentSlice';

/**
 * The "state machine behind the view" from the article. The flag lives in
 * Redux (so the checkout can read it when placing the order); the
 * calculation is delegated to the injected strategy — no country branches.
 */
export const useRoundUp = (amount: number, strategy: CountryPayment) => {
  const dispatch = useAppDispatch();
  const agreeToDonate = useAppSelector(selectAgreeToDonate);

  const { total, tip } = useMemo(
    () => ({
      total: agreeToDonate ? strategy.getRoundUpAmount(amount) : amount,
      tip: strategy.getTip(amount),
    }),
    [agreeToDonate, amount, strategy],
  );

  const updateAgreeToDonate = useCallback(() => dispatch(donationToggled()), [dispatch]);

  return { total, tip, agreeToDonate, updateAgreeToDonate };
};
