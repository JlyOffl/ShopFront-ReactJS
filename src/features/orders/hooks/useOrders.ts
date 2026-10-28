import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useMemo } from 'react';
import { toErrorMessage } from '@/shared/api/errors';
import { useCancelOrderMutation, useGetOrderQuery, useGetOrdersQuery } from '../api/ordersApi';
import { Order, toOrders, type OrderData } from '../model';

const NO_ORDERS: OrderData[] = [];

export const useOrders = () => {
  const { data = NO_ORDERS, isLoading, isError, error, refetch } = useGetOrdersQuery();
  const orders = useMemo(() => toOrders(data), [data]);

  return { orders, isLoading, errorMessage: isError ? toErrorMessage(error) : null, retry: refetch };
};

export const useOrder = (orderId: string | undefined) => {
  const { data, isLoading, isError, error, refetch } = useGetOrderQuery(orderId ?? skipToken);
  const order = useMemo(() => (data ? new Order(data) : null), [data]);

  return { order, isLoading, errorMessage: isError ? toErrorMessage(error) : null, retry: refetch };
};

export const useCancelOrder = () => {
  const [cancelOrder, { isLoading, error, reset }] = useCancelOrderMutation();

  const cancel = useCallback(
    async (orderId: string): Promise<boolean> => {
      try {
        await cancelOrder(orderId).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [cancelOrder],
  );

  return { cancel, isCancelling: isLoading, errorMessage: error ? toErrorMessage(error) : null, reset };
};
