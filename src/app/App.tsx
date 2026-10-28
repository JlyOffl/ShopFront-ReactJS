import { CssBaseline, ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';
import { loadPersistedState } from './persistence';
import { createAppRouter } from './router';
import { setupStore } from './store';
import { theme } from './theme';

const store = setupStore(loadPersistedState());
const router = createAppRouter();

/** Composition root: the only place that wires providers together. */
export const App = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </Provider>
);
