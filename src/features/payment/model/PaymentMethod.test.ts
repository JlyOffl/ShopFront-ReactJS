import { describe, expect, it } from 'vitest';
import { convertPaymentMethods, PaymentMethod, payInCash, resolveSelectedProvider } from './PaymentMethod';

describe('PaymentMethod', () => {
  it('builds a friendly label', () => {
    expect(new PaymentMethod({ name: 'apple' }).label).toBe('Pay with Apple');
    expect(new PaymentMethod({ name: 'paypay', displayName: 'PayPay' }).label).toBe('Pay with PayPay');
    expect(payInCash.label).toBe('Pay in cash');
  });

  it('treats cash as the default method', () => {
    expect(payInCash.isDefaultMethod).toBe(true);
    expect(new PaymentMethod({ name: 'apple' }).isDefaultMethod).toBe(false);
  });
});

describe('convertPaymentMethods', () => {
  it('returns nothing when the server has no configured methods', () => {
    expect(convertPaymentMethods([])).toEqual([]);
  });

  it('appends the cash option', () => {
    const methods = convertPaymentMethods([{ name: 'apple' }, { name: 'google' }]);
    expect(methods.map((m) => m.provider)).toEqual(['apple', 'google', 'cash']);
  });
});

describe('resolveSelectedProvider', () => {
  const options = convertPaymentMethods([{ name: 'apple' }]);

  it('falls back to the default method', () => {
    expect(resolveSelectedProvider(options, null)).toBe('cash');
  });

  it('keeps a valid user choice', () => {
    expect(resolveSelectedProvider(options, 'apple')).toBe('apple');
  });

  it('ignores a choice that is no longer offered (e.g. after switching country)', () => {
    expect(resolveSelectedProvider(options, 'mobilepay')).toBe('cash');
  });
});
