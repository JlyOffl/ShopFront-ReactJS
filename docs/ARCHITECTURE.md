# Architecture

This project applies the ideas from Juntao Qiu's article
[Modularizing React Applications with Established UI Patterns](https://martinfowler.com/articles/modularizing-react-apps.html)
(martinfowler.com, 2023) at enterprise scale, using Redux Toolkit + RTK Query for state and data.

> *React is a humble library for building views.* The application is a regular TypeScript application
> that happens to use React for its view layer.

## The layers

```
┌───────────────────────────────────────────────────────────────────────────┐
│ app/          Composition root: store, router, theme, layout, persistence │
├───────────────────────────────────────────────────────────────────────────┤
│ pages/        Route-level composition. Hooks in → humble components out.  │
├───────────────────────────────────────────────────────────────────────────┤
│ features/<feature>/                                                       │
│   components/  VIEW         Humble, pure components. Props in, events out │
│   <Feature>.tsx CONTAINER   Wires hooks to views (e.g. Payment.tsx)       │
│   hooks/       VIEW-MODEL   State + side effects; the "state machine      │
│                             behind the view". Composes api/state/model    │
│   state/       APP STATE    Redux slices — serializable client state      │
│   api/         GATEWAY      RTK Query endpoints + zod contract validation │
│                             (anti-corruption layer)                       │
│   model/       DOMAIN       Plain TypeScript classes & functions          │
│   index.ts     PUBLIC API   The only thing other features/pages import    │
├───────────────────────────────────────────────────────────────────────────┤
│ shared/       domain/ (shared kernel), api/ (network client), ui/, config │
└───────────────────────────────────────────────────────────────────────────┘
         dependencies point downwards only — enforced by eslint.config.js
```

| Layer | May import | Must not import |
|---|---|---|
| `model/` | `@/shared/domain` | React, Redux, MUI, zod, any other layer or feature |
| `api/` | RTK Query, zod, own `model` types | React, MUI, hooks, components, state |
| `state/` | RTK, own `model`, other features' public actions | React, api, components |
| `hooks/` | everything in its feature, other features' public API | — |
| `components/` | React, MUI, own `model` types | Redux, api, state, hooks, `@/app` |
| `pages/`, `app/` | features via `@/features/<name>` only | feature internals |

## Mapping the article to this code

| Article step | Where it lives here |
|---|---|
| Split view and non-view code (`usePaymentMethods`) | `features/payment/hooks/usePaymentMethods.ts` |
| Extract sub-component (`PaymentMethods`, pure) | `features/payment/components/PaymentMethods.tsx` |
| Data modelling (`PaymentMethod` class, `payInCash`, `convertPaymentMethods`) | `features/payment/model/PaymentMethod.ts` |
| Hook as state machine (`useRoundUp`) | `features/payment/hooks/useRoundUp.ts` — flag kept in Redux so checkout can read it |
| `DonationCheckbox`, `formatCheckboxLabel` | `features/payment/components/DonationCheckbox.tsx`, `model/formatters.ts` |
| Shotgun surgery → Replace Conditional with Polymorphism (`CountryPayment`, round-up strategies) | `features/payment/model/CountryPayment.ts`, `model/roundUp.ts` |
| Extract a network client / gateway (React Query suggested) | `shared/api/baseApi.ts` (RTK Query) + `features/*/api/*.ts` |
| Final `Payment` that reads like HTML | `features/payment/Payment.tsx` |

## Decisions worth knowing

**Domain objects are not stored in Redux.** Redux state and the RTK Query cache must be serializable,
so they hold plain DTOs. Hooks turn them into domain objects with `useMemo`
(`new Cart(lines)`, `convertPaymentMethods(data)`, `toOrders(data)`). Views only ever see domain objects.

**Validate at the edge.** Every endpoint parses its response with a zod schema in `transformResponse`.
A backend contract change fails in one file with a clear error instead of leaking `undefined` into views.

**Server state vs client state.** RTK Query owns server state (caching, de-duplication, invalidation via
tags, retries). Redux slices own client state only: selected market, cart, payment choices. URL search
params own shareable view state (catalog search/category).

**Market switching is an event, not a branch.** `countryChanged` is handled by `cartSlice` and
`paymentSlice` (`extraReducers`) to reset themselves; RTK Query keys every request by country. Nothing
in the views checks a country code.

**Adding a new market** touches the strategy registry only:

```ts
// features/payment/model/CountryPayment.ts
NZ: new CountryPayment('$', roundUpToNearestInteger),
```

plus `COUNTRIES` in `shared/domain/country.ts` and the server's data.

**Cross-feature use cases live in hooks.** `orders/hooks/usePlaceOrder.ts` orchestrates cart + payment +
orders, so `CheckoutPage` stays declarative.

## Testing strategy

| What | How | Example |
|---|---|---|
| Domain | Plain unit tests, no DOM | `model/*.test.ts` |
| Reducers | Call the reducer directly | `cart/state/cartSlice.test.ts` |
| Humble views | Render with props only | `payment/components/PaymentMethods.test.tsx` |
| Hooks | `renderHookWithProviders` with a real store | `payment/hooks/useRoundUp.test.tsx` |
| Feature / flow | Real store + router, network mocked by MSW | `payment/Payment.test.tsx`, `pages/CheckoutPage.test.tsx` |

The same MSW handlers power the browser in development, so the UI and the tests run against one fake backend.
