import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { convertPaymentMethods } from '../model';
import { PaymentMethods } from './PaymentMethods';

// A humble view needs no store, router or network to test — just props.
describe('<PaymentMethods />', () => {
  const options = convertPaymentMethods([{ name: 'apple', displayName: 'Apple Pay' }]);

  it('renders one radio per option and marks the selected one', () => {
    render(<PaymentMethods options={options} selected="cash" onSelect={() => {}} />);

    expect(screen.getByRole('radio', { name: 'Pay with Apple Pay' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Pay in cash' })).toBeChecked();
  });

  it('reports the chosen provider', async () => {
    const onSelect = vi.fn();
    render(<PaymentMethods options={options} selected="cash" onSelect={onSelect} />);

    await userEvent.click(screen.getByRole('radio', { name: 'Pay with Apple Pay' }));

    expect(onSelect).toHaveBeenCalledWith('apple');
  });

  it('renders nothing when there are no options', () => {
    const { container } = render(<PaymentMethods options={[]} selected="cash" onSelect={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });
});
