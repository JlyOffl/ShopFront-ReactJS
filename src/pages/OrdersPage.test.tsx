import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { OrdersPage } from './OrdersPage';

describe('<OrdersPage />', () => {
  it('lists orders newest first, each formatted in its own currency', async () => {
    renderWithProviders(<OrdersPage />, { route: '/orders' });

    const table = await screen.findByRole('table', { name: 'Orders' });
    const rows = within(table).getAllByRole('row').slice(1); // skip header

    expect(rows).toHaveLength(3);
    expect(within(rows[0]!).getByText('kr. 259.00')).toBeInTheDocument();
    expect(within(rows[1]!).getByText('¥3,400')).toBeInTheDocument();
    expect(within(rows[2]!).getByText('$17.00')).toBeInTheDocument();
  });
});
