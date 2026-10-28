import { Alert, Box, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router';
import { CartTable, useCart } from '@/features/cart';
import { usePlaceOrder } from '@/features/orders';
import { Payment, useMoneyFormatter, type PaymentResult } from '@/features/payment';
import { EmptyState, PageHeader } from '@/shared/ui';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, changeQuantity, removeItem } = useCart();
  const { placeOrder, isPlacing, errorMessage } = usePlaceOrder();
  const formatMoney = useMoneyFormatter();

  const handlePay = async (payment: PaymentResult) => {
    const order = await placeOrder(payment);
    if (order) navigate(`/orders/${order.id}`, { state: { justPlaced: true } });
  };

  if (cart.isEmpty) {
    return (
      <>
        <PageHeader title="Checkout" />
        <EmptyState
          title="Your cart is empty"
          description="Add something from the catalog to get started."
          action={
            <Button component={Link} to="/" variant="contained">
              Browse catalog
            </Button>
          }
        />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Checkout" subtitle="Review your items and choose how to pay." />
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, alignItems: 'start' }}>
        <CartTable cart={cart} formatMoney={formatMoney} onQuantityChange={changeQuantity} onRemove={removeItem} />
        <Payment amount={cart.subtotal} onPay={handlePay} isPaying={isPlacing} />
      </Box>
    </>
  );
};
