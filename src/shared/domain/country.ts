/**
 * Shared kernel: concepts every feature agrees on.
 * Plain TypeScript — no framework imports allowed here (enforced by ESLint).
 */
export const COUNTRY_CODES = ['AU', 'US', 'JP', 'DK'] as const;

export type CountryCode = (typeof COUNTRY_CODES)[number];

export interface Country {
  readonly code: CountryCode;
  readonly name: string;
  readonly flag: string;
}

export const COUNTRIES: readonly Country[] = [
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
];

export const DEFAULT_COUNTRY: CountryCode = 'AU';

export const isCountryCode = (value: unknown): value is CountryCode =>
  typeof value === 'string' && (COUNTRY_CODES as readonly string[]).includes(value);

export const countryByCode = (code: CountryCode): Country =>
  COUNTRIES.find((country) => country.code === code) ?? COUNTRIES[0]!;
