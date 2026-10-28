import { normalise } from '@/shared/domain';

/**
 * A round-up algorithm is just a function — the article's point that, since
 * functions are first-class in JavaScript, we can inject the varying
 * behaviour instead of creating a subclass per country.
 */
export type RoundUpStrategy = (amount: number) => number;

export const roundUpToNearestInteger: RoundUpStrategy = (amount) => Math.floor(amount + 1);

export const roundUpToNearestTen: RoundUpStrategy = (amount) => Math.floor(amount / 10 + 1) * 10;

export const roundUpToNearestHundred: RoundUpStrategy = (amount) => Math.floor(amount / 100 + 1) * 100;

export const calculateTipFor =
  (roundUp: RoundUpStrategy) =>
  (amount: number): number =>
    normalise(roundUp(amount) - amount);
