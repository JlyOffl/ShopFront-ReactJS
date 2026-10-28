import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderRoutes } from '@/test/render';
import { CatalogPage } from './CatalogPage';
import { CheckoutPage } from './CheckoutPage';
import { OrderDetailsPage } from './OrderDetailsPage';

const routes = [
  { path: '/', element: <CatalogPage /> },
  { path: '/checkout', element: <CheckoutPage /> },
  { path: '/orders/:orderId', element: <OrderDetailsPage /> },
];

describe('checkout flow', () => {
  it('adds a product, pays with a donation and lands on the new order', async () => {
    const { user, store } = renderRoutes(routes, { route: '/' });

    await user.click(await screen.findByRole('button', { name: 'Add House Blend Beans 250g to cart' }));
    await user.click(screen.getByRole('link', { name: /checkout/i }));

    // Checkout page: cart + payment
    expect(await screen.findByRole('table', { name: 'Shopping cart' })).toBeInTheDocument();
    await user.click(await screen.findByRole('radio', { name: 'Pay with PayPal' }));
    await user.click(screen.getByRole('checkbox', { name: 'I would like to donate $0.20 to charity.' }));
    await user.click(screen.getByRole('button', { name: 'Pay $20.00' }));

    // Order details page
    expect(await screen.findByText('Thanks! Your order has been placed.')).toBeInTheDocument();
    const items = await screen.findByRole('list', { name: 'Order items' });
    expect(within(items).getByText('House Blend Beans 250g')).toBeInTheDocument();
    expect(screen.getByText('Charity donation')).toBeInTheDocument();

    // Cart and payment state were reset after the order was placed
    expect(store.getState().cart.lines).toEqual([]);
    expect(store.getState().payment).toEqual({ selectedProvider: null, agreeToDonate: false });
  });

  it('shows an empty state when there is nothing to pay for', () => {
    renderRoutes(routes, { route: '/checkout' });
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });
});
