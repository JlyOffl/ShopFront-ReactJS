import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { cartSlice } from '@/features/cart';
import { paymentSlice } from '@/features/payment';
import { regionSlice } from '@/features/region';
import { baseApi } from '@/shared/api/baseApi';
import { createPersistenceListener } from './persistence';

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  [regionSlice.reducerPath]: regionSlice.reducer,
  [cartSlice.reducerPath]: cartSlice.reducer,
  [paymentSlice.reducerPath]: paymentSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

/**
 * Store factory (not a singleton) so every test gets an isolated store and
 * the app can hydrate from persisted state.
 */
export const setupStore = (preloadedState?: Partial<RootState>, { persist = true } = {}) => {
  const persistence = createPersistenceListener({ enabled: persist });

  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(persistence.middleware).concat(baseApi.middleware),
    devTools: import.meta.env.DEV,
  });

  setupListeners(store.dispatch);
  return store;
};

export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
