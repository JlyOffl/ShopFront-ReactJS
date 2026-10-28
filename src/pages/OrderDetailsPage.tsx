import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Alert, Button, Stack } from '@mui/material';
import { Link, useLocation, useParams } from 'react-router';
import { OrderDetails, useCancelOrder, useOrder } from '@/features/orders';
import { formatAmountFor } from '@/features/payment';
import { formatDateTime } from '@/shared/lib/dates';
import { ErrorState, LoadingState, PageHeader } from '@/shared/ui';

interface LocationState {
  justPlaced?: boolean;
}

export const OrderDetailsPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const justPlaced = (location.state as LocationState | null)?.justPlaced === true;

  const { order, isLoading, errorMessage, retry } = useOrder(orderId);
  const { cancel, isCancelling, errorMessage: cancelError } = useCancelOrder();

  return (
    <>
      <PageHeader
        title="Order details"
        actions={
          <Button component={Link} to="/orders" startIcon={<ArrowBackIcon />}>
            All orders
          </Button>
        }
      />
      <Stack spacing={2}>
        {justPlaced && <Alert severity="success">Thanks! Your order has been placed.</Alert>}
        {cancelError && <Alert severity="error">{cancelError}</Alert>}
        {isLoading && <LoadingState label="Loading order…" />}
        {errorMessage && <ErrorState message={errorMessage} onRetry={retry} />}
        {order && (
          <OrderDetails
            order={order}
            formatMoney={(amount) => formatAmountFor(order.countryCode, amount)}
            formatDate={formatDateTime}
            onCancel={() => void cancel(order.id)}
            isCancelling={isCancelling}
          />
        )}
      </Stack>
    </>
  );
};
