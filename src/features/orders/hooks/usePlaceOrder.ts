import { useCallback } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { cartCleared, useCart } from '@/features/cart';
import { paymentReset, type PaymentResult } from '@/features/payment';
import { useCountryCode } from '@/features/region';
import { toErrorMessage } from '@/shared/api/errors';
import { usePlaceOrderMutation } from '../api/ordersApi';
import { Order } from '../model';

/**
 * Orchestrates a use case that spans features (cart + payment + orders).
 * Pages stay declarative: they call `placeOrder(payment)` and navigate.
 */
export const usePlaceOrder = () => {
  const dispatch = useAppDispatch();
  const countryCode = useCountryCode();
  const { cart } = useCart();
  const [placeOrderMutation, { isLoading, error, reset }] = usePlaceOrderMutation();

  const placeOrder = useCallback(
    async (payment: PaymentResult): Promise<Order | null> => {
      if (cart.isEmpty) return null;
      try {
        const created = await placeOrderMutation({
          countryCode,
          lines: cart.items.map(({ productId, quantity }) => ({ productId, quantity })),
          paymentProvider: payment.provider,
          donation: payment.donation,
          expectedTotal: payment.total,
        }).unwrap();

        dispatch(cartCleared());
        dispatch(paymentReset());
        return new Order(created);
      } catch {
        return null; // error is surfaced through `errorMessage`
      }
    },
    [cart, countryCode, dispatch, placeOrderMutation],
  );

  return { placeOrder, isPlacing: isLoading, errorMessage: error ? toErrorMessage(error) : null, reset };
};
