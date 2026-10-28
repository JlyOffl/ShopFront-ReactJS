import { screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { server } from '@/mocks/server';
import { apiUrl } from '@/shared/config/env';
import { renderWithProviders } from '@/test/render';
import { Payment } from './Payment';

describe('<Payment />', () => {
  it('shows the server-configured methods plus cash, with cash selected by default', async () => {
    renderWithProviders(<Payment amount={19.8} onPay={() => {}} />);

    expect(await screen.findByRole('radio', { name: 'Pay with Apple Pay' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Pay in cash' })).toBeChecked();
    expect(screen.getByRole('button', { name: 'Pay $19.80' })).toBeEnabled();
  });

  it('rounds up for charity and reports the payment', async () => {
    const onPay = vi.fn();
    const { user } = renderWithProviders(<Payment amount={19.8} onPay={onPay} />);

    await user.click(await screen.findByRole('radio', { name: 'Pay with Google Pay' }));
    await user.click(screen.getByRole('checkbox', { name: 'I would like to donate $0.20 to charity.' }));

    expect(screen.getByText('Thanks for your donation.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Pay $20.00' }));

    expect(onPay).toHaveBeenCalledWith({ provider: 'google', donation: 0.2, total: 20 });
  });

  it('switches currency and round-up rules with the market (JP)', async () => {
    renderWithProviders(<Payment amount={3312} onPay={() => {}} />, {
      preloadedState: { region: { countryCode: 'JP' } },
    });

    expect(await screen.findByRole('radio', { name: 'Pay with PayPay' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'I would like to donate ¥88 to charity.' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pay ¥3,312' })).toBeInTheDocument();
  });

  it('shows no options when the server has none configured (pay in cash)', async () => {
    server.use(http.get(apiUrl('payment-methods'), () => HttpResponse.json([])));
    renderWithProviders(<Payment amount={10} onPay={() => {}} />);

    expect(await screen.findByRole('button', { name: 'Pay $10.00' })).toBeEnabled();
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
  });

  it('rejects a response that breaks the contract instead of rendering garbage', async () => {
    server.use(http.get(apiUrl('payment-methods'), () => HttpResponse.json([{ id: 1 }])));
    renderWithProviders(<Payment amount={10} onPay={() => {}} />);

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
  });
});
