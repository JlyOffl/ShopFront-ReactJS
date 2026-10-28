import type { CountryCode } from '@/shared/domain';
import {
  calculateTipFor,
  roundUpToNearestHundred,
  roundUpToNearestInteger,
  roundUpToNearestTen,
  type RoundUpStrategy,
} from './roundUp';

/**
 * Strategy object that encapsulates everything that varies by country
 * (currency sign, decimals, round-up algorithm).
 *
 * This is the "Replace Conditional with Polymorphism" step from the article:
 * views and hooks never branch on a country code — they just call this object.
 */
export class CountryPayment {
  private readonly _currencySign: string;
  private readonly fractionDigits: number;
  private readonly algorithm: RoundUpStrategy;

  public constructor(currencySign: string, roundUpAlgorithm: RoundUpStrategy, fractionDigits = 2) {
    this._currencySign = currencySign;
    this.algorithm = roundUpAlgorithm;
    this.fractionDigits = fractionDigits;
  }

  get currencySign(): string {
    return this._currencySign;
  }

  getRoundUpAmount(amount: number): number {
    return this.algorithm(amount);
  }

  getTip(amount: number): number {
    return calculateTipFor(this.getRoundUpAmount.bind(this))(amount);
  }

  formatAmount(amount: number): string {
    const digits = amount.toLocaleString('en-US', {
      minimumFractionDigits: this.fractionDigits,
      maximumFractionDigits: this.fractionDigits,
    });
    return `${this._currencySign}${digits}`;
  }
}

/**
 * The only place that knows about individual countries.
 * Adding a market = one line here (plus its data on the server).
 */
const registry: Record<CountryCode, CountryPayment> = {
  AU: new CountryPayment('$', roundUpToNearestInteger),
  US: new CountryPayment('$', roundUpToNearestInteger),
  JP: new CountryPayment('¥', roundUpToNearestHundred, 0),
  DK: new CountryPayment('kr. ', roundUpToNearestTen),
};

export const countryPaymentFor = (countryCode: CountryCode): CountryPayment => registry[countryCode];

export const formatAmountFor = (countryCode: CountryCode, amount: number): string =>
  countryPaymentFor(countryCode).formatAmount(amount);
