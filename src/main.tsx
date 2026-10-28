import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';
import { env } from '@/shared/config/env';

/** Start Mock Service Worker before the first request when mocks are enabled. */
async function enableMocking(): Promise<void> {
  if (!env.enableMocks) return;
  const { worker } = await import('./mocks/browser');
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
  });
}

void enableMocking().then(() => {
  const container = document.getElementById('root');
  if (!container) throw new Error('Root element #root not found');

  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
