# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This is not a monorepo — there is no root `package.json` or workspace tooling. It contains two independently-run projects that talk to each other over HTTP:

- `restaurant-api/` — Node/Express/MongoDB backend (JWT auth, menus, foods, orders).
- `restaurant-admin/` — React/Vite admin frontend, originally exported from a Figma "Make" design and progressively being wired to the real API.

Always `cd` into the relevant subproject before running commands; there is nothing to run from the repo root.

## Commands

### restaurant-api

```bash
cd restaurant-api
npm install
npm run dev     # nodemon server.js — auto-restart dev server
npm start       # node server.js — plain start
```

Requires a `.env` file (not committed) with:
```
PORT=5000
MONGO_URI=<mongodb-atlas-uri>
JWT_SECRET=<secret>
```

There is no test suite and no lint config in this project — don't invent `npm test`/`npm run lint` invocations.

### restaurant-admin

```bash
cd restaurant-admin
npm i
npm run dev      # vite dev server
npm run build    # vite build
```

Requires a `.env` (not committed) defining `VITE_API_BASE_URL` (consumed in `src/services/api/axios.ts`) pointing at the running `restaurant-api` instance, e.g. `http://localhost:5000/api`.

There is no test suite and no lint config in this project either.

## restaurant-api architecture

Layered request pipeline, enforced per-route (not globally): `Router → Joi validate middleware → protect (JWT) → authorize (RBAC) → controller → Mongoose model → MongoDB Atlas`, with a global `errorHandler` (`middleware/errorMiddleware.js`) as the last app-level middleware in `server.js`.

- **Controllers are thin** and always delegate thrown/async errors via `next(error)`; they never handle errors inline. Operational errors are raised as `new AppError(message, statusCode)` (`utils/AppError.js`), which the error handler renders as `{ success: false, status, message }`. Mongoose `CastError`/`ValidationError`/duplicate-key (11000) and JWT errors (`JsonWebTokenError`/`TokenExpiredError`) are special-cased in `errorMiddleware.js`.
- **Success responses** go through `sendResponse` (`utils/responseHandler.js`), which always shapes `{ success: true, status: "success", message, timestamp, data, meta? }`. Use it for any new success response rather than calling `res.json` directly.
- **Auth/RBAC middleware are the exception to the above**: `middleware/authMiddleware.js` (`protect`) and `middleware/roleMiddleware.js` (`authorize`) short-circuit with hand-rolled `res.status(401/403).json(...)` instead of `AppError`/`sendResponse`. This is existing, intentional-looking inconsistency, not a bug to silently "fix" — if you touch these files, match their existing style rather than mixing in `sendResponse`.
- **Validation** (`validators/*.js`, Joi schemas) runs via the `validate(schema)` middleware factory (`middleware/validateMiddleware.js`) before the controller, validating `req.body` only.
- **Known filename/require casing mismatch**: every route file requires its controller with a capitalized name (e.g. `require("../controllers/orderController")`), but the actual files are lowercase (`ordercontroller.js`, `authcontroller.js`, `foodcontroller.js`, `menucontroller.js`). This only works because Windows/macOS default filesystems are case-insensitive — it will break on a case-sensitive filesystem (Linux, most Docker images/CI). If you touch these files, prefer fixing the mismatch (rename the file or fix the require) over leaving it, and be aware `git mv` may be needed to get case-only renames tracked correctly.
- **Data model relationships**: `User (1) —< Order (many)` via `Order.customer`; `Menu (1) —< Food (many)` via `Food.menu`. Order line items intentionally **snapshot** `foodName`/`priceAtPurchase`/`quantity` at order-creation time (`controllers/ordercontroller.js`) rather than only referencing `Food` by id — this preserves historical order accuracy if a food's price/name changes later. Preserve this snapshotting behavior when modifying order creation.
- **Order status workflow** is a fixed enum: `Pending → Confirmed → Preparing → Out For Delivery → Delivered`, plus `Cancelled`. Customers can cancel their own order only if it isn't already `Delivered`/`Out For Delivery`; only admins can arbitrarily set status via `PATCH /:orderId/status`.
- Security middleware order in `server.js` matters: `helmet()` → rate limiter (`config/rateLimiter.js`, 100 req/15min) → `cors()` → body parsers → `morgan("dev")` → routes → `errorHandler` last.
- Extensive additional design docs live in `restaurant-api/docs/` (`PROJECT_ARCHITECTURE.md`, `DEVELOPER_GUIDE.md`, `AI_CONTEXT.md`, `API_DOCUMENTATION.md`, `PROJECT_ROADMAP.md`, `CHANGELOG.md`) — these describe the same layered architecture in more detail and track a roadmap (service layer, DTO layer, Swagger, logging, Docker, tests) that has **not** been implemented yet. Don't assume roadmap items exist just because they're documented there.

## restaurant-admin architecture

- **Routing**: `react-router` v7 `createBrowserRouter`, defined in `src/app/routes.tsx`. Everything except `/login` is nested under `ProtectedRoute` (`src/components/ProtectedRoute.tsx`), which redirects to `/login` based on `useAuth().isAuthenticated`; the actual app chrome is `AppLayout` (`src/app/layouts/AppLayout.tsx`).
- **Auth flow**: `AuthProvider` (`src/features/auth/context/AuthProvider.tsx`) holds `user`/`token` in React state, persisted via `src/services/storage/authStorage.ts` (localStorage, keys `auth_token`/`auth_user`). On mount it calls `GET /auth/profile` to validate/restore the session. The shared axios instance (`src/services/api/axios.ts` + `src/services/api/interceptors.ts`) attaches `Authorization: Bearer <token>` on every request and force-navigates to `/login` (via `window.location.href`, not router navigation) on any `401` response.
- **Feature-folder pattern**: `src/features/auth/` (`api/`, `components/`, `context/`, `hooks/`, `pages/`, `schemas/`, `types/`) is the template for how future features should be structured. It's currently the *only* fully-implemented feature end-to-end.
- **Everything else is not yet wired to the API.** `src/services/{food,menu,order,dashboard}.service.ts` exist but are empty placeholder files. Page components under `src/app/pages/` (`Orders.tsx`, `Foods.tsx`, `Dashboard.tsx`, `Kitchen.tsx`, `Delivery.tsx`, `Customers.tsx`, `Analytics.tsx`, etc.) are largely unmodified Figma exports that render from local `MOCK_*` constants defined at the top of each file. When asked to connect a page to real data, follow the `features/auth` pattern (api/hooks/types) rather than fetching directly in the page component, and check whether the corresponding backend route already exists in `restaurant-api/routes/` before assuming it needs to be built.
- **Two parallel `components/ui` trees exist**: `src/app/components/ui/` (the full shadcn/Radix set carried over from the Figma export, used by `src/app/pages/*`) and `src/components/ui/` (a smaller, separately-curated subset used by `src/features/auth/*`). When adding UI to a page under `src/app/pages`, import from `src/app/components/ui`; when adding UI inside `src/features/*`, import from `src/components/ui`. Don't assume they're interchangeable or dedupe them without checking both usages.
- **Path alias**: `@/*` → `src/*` (set in both `vite.config.ts` and `tsconfig.json`).
- `vite.config.ts` has a custom `figmaAssetResolver` plugin that resolves `figma:asset/*` import specifiers to `src/assets/*` — this is load-bearing for the Figma-exported pages. Per its own comment, don't remove the `react()`/`tailwindcss()` plugins even if Tailwind looks unused in a given change, and don't add `.css`/`.tsx`/`.ts` to `assetsInclude`.
- Data layer is set up for TanStack React Query (`src/providers/QueryProvider.tsx`, 5 min `staleTime`, `retry: 1`, no refetch-on-focus) but it isn't actually used by the auth feature yet (`AuthProvider` calls the API directly with plain `useState`/`useEffect`). Prefer React Query for new data-fetching hooks rather than replicating the manual `useState`/`useEffect` pattern.
- Styling is Tailwind v4 via the `@tailwindcss/vite` plugin; global styles/tokens live in `src/styles/` (`index.css`, `tailwind.css`, `theme.css`, `fonts.css`).
