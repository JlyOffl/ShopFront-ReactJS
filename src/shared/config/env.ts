/**
 * Typed, validated access to build-time configuration.
 * Nothing else in the app should read import.meta.env directly.
 */
const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';

// Absolute URL so the same value works in the browser and in Node-based tests.
const apiBaseUrl = new URL(import.meta.env.VITE_API_BASE_URL ?? '/api', origin).href.replace(/\/$/, '');

export const env = {
  apiBaseUrl,
  enableMocks: import.meta.env.VITE_ENABLE_MOCKS === 'true',
  isDev: import.meta.env.DEV,
  isTest: import.meta.env.MODE === 'test',
} as const;

export const apiUrl = (path: string): string => `${env.apiBaseUrl}/${path.replace(/^\//, '')}`;
