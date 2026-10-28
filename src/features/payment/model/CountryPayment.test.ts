import { describe, expect, it } from 'vitest';
import { CountryPayment, countryPaymentFor, formatAmountFor } from './CountryPayment';
import { formatButtonLabel, formatCheckboxLabel } from './formatters';
import { roundUpToNearestHundred, roundUpToNearestInteger, roundUpToNearestTen } from './roundUp';

describe('round-up algorithms', () => {
  it('rounds up to the nearest integer', () => {
    expect(roundUpToNearestInteger(19.8)).toBe(20);
    expect(roundUpToNearestInteger(19)).toBe(20);
  });

  it('rounds up to the nearest ten', () => {
    expect(roundUpToNearestTen(89.5)).toBe(90);
    expect(roundUpToNearestTen(91)).toBe(100);
  });

  it('rounds up to the nearest hundred', () => {
    expect(roundUpToNearestHundred(3312)).toBe(3400);
  });
});

describe('CountryPayment', () => {
  it('calculates the tip without floating point noise', () => {
    const au = new CountryPayment('$', roundUpToNearestInteger);
    expect(au.getTip(19.8)).toBe(0.2);
    expect(au.getRoundUpAmount(19.8)).toBe(20);
  });

  it('uses the Japanese strategy for JP', () => {
    const jp = countryPaymentFor('JP');
    expect(jp.currencySign).toBe('¥');
    expect(jp.getRoundUpAmount(3312)).toBe(3400);
    expect(jp.getTip(3312)).toBe(88);
    expect(jp.formatAmount(3312)).toBe('¥3,312');
  });

  it('uses the Danish strategy for DK', () => {
    const dk = countryPaymentFor('DK');
    expect(dk.getTip(89.5)).toBe(0.5);
    expect(dk.formatAmount(89.5)).toBe('kr. 89.50');
  });

  it('formats amounts for a given country', () => {
    expect(formatAmountFor('AU', 1234.5)).toBe('$1,234.50');
  });
});

describe('payment labels', () => {
  const au = countryPaymentFor('AU');

  it('asks for a donation until the customer agrees', () => {
    expect(formatCheckboxLabel(false, 0.2, au)).toBe('I would like to donate $0.20 to charity.');
    expect(formatCheckboxLabel(true, 0.2, au)).toBe('Thanks for your donation.');
  });

  it('shows the total on the button', () => {
    expect(formatButtonLabel(au, 20)).toBe('Pay $20.00');
  });
});
