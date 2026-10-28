import type { CountryPayment } from './CountryPayment';

export const formatCheckboxLabel = (agreeToDonate: boolean, tip: number, strategy: CountryPayment): string =>
  agreeToDonate
    ? 'Thanks for your donation.'
    : `I would like to donate ${strategy.formatAmount(tip)} to charity.`;

export const formatButtonLabel = (strategy: CountryPayment, total: number): string =>
  `Pay ${strategy.formatAmount(total)}`;
