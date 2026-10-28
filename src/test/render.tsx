import { ThemeProvider } from '@mui/material';
import { render, renderHook, type RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { PropsWithChildren, ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { setupStore, type AppStore, type RootState } from '@/app/store';
import { theme } from '@/app/theme';

interface ProviderOptions {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
  /** Initial URL. */
  route?: string;
}

const createWrapper = (store: AppStore, route: string, routes?: { path: string; element: ReactNode }[]) =>
  function Wrapper({ children }: PropsWithChildren) {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <MemoryRouter initialEntries={[route]}>
            {routes ? (
              <Routes>
                {routes.map((r) => (
                  <Route key={r.path} path={r.path} element={r.element} />
                ))}
              </Routes>
            ) : (
              children
            )}
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );
  };

/** Render a component with the real store, theme and router. */
export const renderWithProviders = (
  ui: ReactElement,
  { preloadedState, store = setupStore(preloadedState, { persist: false }), route = '/', ...options }: ProviderOptions &
    Omit<RenderOptions, 'wrapper'> = {},
) => ({
  store,
  user: userEvent.setup(),
  ...render(ui, { wrapper: createWrapper(store, route), ...options }),
});

/** Render a set of routes — useful for flows that navigate between pages. */
export const renderRoutes = (
  routes: { path: string; element: ReactNode }[],
  { preloadedState, store = setupStore(preloadedState, { persist: false }), route = '/' }: ProviderOptions = {},
) => ({
  store,
  user: userEvent.setup(),
  ...render(<></>, { wrapper: createWrapper(store, route, routes) }),
});

/** Render a hook against a real store. */
export const renderHookWithProviders = <Result, Props>(
  hook: (props: Props) => Result,
  { preloadedState, store = setupStore(preloadedState, { persist: false }), route = '/' }: ProviderOptions = {},
) => ({ store, ...renderHook(hook, { wrapper: createWrapper(store, route) }) });
