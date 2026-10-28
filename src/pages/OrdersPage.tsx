import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router';
import { OrdersTable, useOrders } from '@/features/orders';
import { formatAmountFor } from '@/features/payment';
import { formatDateTime } from '@/shared/lib/dates';
import { EmptyState, ErrorState, LoadingState, PageHeader } from '@/shared/ui';

export const OrdersPage = () => {
  const navigate = useNavigate();
  const { orders, isLoading, errorMessage, retry } = useOrders();

  return (
    <>
      <PageHeader title="Orders" subtitle="Orders from every market, newest first." />
      {isLoading && <LoadingState label="Loading orders…" />}
      {errorMessage && <ErrorState message={errorMessage} onRetry={retry} />}
      {!isLoading && !errorMessage && orders.length === 0 && (
        <EmptyState
          title="No orders yet"
          action={
            <Button component={Link} to="/" variant="contained">
              Start shopping
            </Button>
          }
        />
      )}
      {orders.length > 0 && (
        <OrdersTable
          orders={orders}
          // Each order is formatted with its own market's strategy, not the current one.
          formatAmount={(order, amount) => formatAmountFor(order.countryCode, amount)}
          formatDate={formatDateTime}
          onSelect={(order) => navigate(`/orders/${order.id}`)}
        />
      )}
    </>
  );
};
