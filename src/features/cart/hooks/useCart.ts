import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Cart, type CartItemInput } from '../model';
import { cartCleared, itemAdded, itemRemoved, quantityChanged, selectCartLines } from '../state/cartSlice';

/**
 * View-model hook: exposes the domain `Cart` plus intention-revealing
 * commands. Components never see `dispatch` or action creators.
 */
export const useCart = () => {
  const dispatch = useAppDispatch();
  const lines = useAppSelector(selectCartLines);
  const cart = useMemo(() => new Cart(lines), [lines]);

  const addItem = useCallback((item: CartItemInput) => dispatch(itemAdded(item)), [dispatch]);
  const removeItem = useCallback((productId: string) => dispatch(itemRemoved(productId)), [dispatch]);
  const changeQuantity = useCallback(
    (productId: string, quantity: number) => dispatch(quantityChanged({ productId, quantity })),
    [dispatch],
  );
  const clear = useCallback(() => dispatch(cartCleared()), [dispatch]);

  return { cart, addItem, removeItem, changeQuantity, clear };
};
