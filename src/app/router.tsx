import { createBrowserRouter, type RouteObject } from 'react-router';
import { AppLayout } from './layout/AppLayout';
import { RouteErrorPage } from './layout/RouteErrorPage';

/** Pages are lazy-loaded so each route ships as its own chunk. */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, lazy: () => import('@/pages/CatalogPage').then((m) => ({ Component: m.CatalogPage })) },
      { path: 'checkout', lazy: () => import('@/pages/CheckoutPage').then((m) => ({ Component: m.CheckoutPage })) },
      { path: 'orders', lazy: () => import('@/pages/OrdersPage').then((m) => ({ Component: m.OrdersPage })) },
      {
        path: 'orders/:orderId',
        lazy: () => import('@/pages/OrderDetailsPage').then((m) => ({ Component: m.OrderDetailsPage })),
      },
      { path: '*', lazy: () => import('@/pages/NotFoundPage').then((m) => ({ Component: m.NotFoundPage })) },
    ],
  },
];

export const createAppRouter = () => createBrowserRouter(routes);
