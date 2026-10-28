import { createListenerMiddleware } from '@reduxjs/toolkit';
import { z } from 'zod';
import { COUNTRY_CODES } from '@/shared/domain';
import type { RootState } from './store';

const STORAGE_KEY = 'shopfront:v1';

/** Only what should survive a refresh. Server data is re-fetched, never persisted. */
const PersistedStateSchema = z.object({
  region: z.object({ countryCode: z.enum(COUNTRY_CODES) }),
  cart: z.object({
    lines: z.array(
      z.object({
        productId: z.string(),
        name: z.string(),
        unitPrice: z.number(),
        quantity: z.number().int().positive(),
      }),
    ),
  }),
});

type PersistedState = z.infer<typeof PersistedStateSchema>;

export const loadPersistedState = (): Partial<RootState> | undefined => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = PersistedStateSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : undefined;
  } catch {
    return undefined; // private mode, quota, corrupted JSON — start fresh
  }
};

const savePersistedState = (state: RootState): void => {
  try {
    const snapshot: PersistedState = { region: state.region, cart: state.cart };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    /* storage unavailable — persistence is best effort */
  }
};

export const createPersistenceListener = ({ enabled = true } = {}) => {
  const listener = createListenerMiddleware();
  if (!enabled) return listener;
  listener.startListening({
    predicate: (action) => action.type.startsWith('cart/') || action.type.startsWith('region/'),
    effect: (_action, api) => savePersistedState(api.getState() as RootState),
  });
  return listener;
};
