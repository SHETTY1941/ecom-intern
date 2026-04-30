# Local Store

A complete e-commerce site for "Local Store" — a friendly neighborhood shop selling pantry, bakery, produce, and kitchen goods.

## Stack

- **Frontend** (`artifacts/store`): React + Vite + TypeScript, wouter routing, TanStack Query, shadcn/ui, sonner toaster
- **Backend** (`artifacts/api-server`): Express 5, Drizzle ORM, PostgreSQL, pino logging, cookie-based sessions, bcryptjs
- **API contract** (`lib/api-spec`): OpenAPI spec with orval-generated React Query hooks (`lib/api-client-react`) and zod validators (`lib/api-zod`)
- **Database** (`lib/db`): Drizzle schema (users, products, cart_items, orders, order_items, reviews, sessions, contact_messages)

## Features

- Customer site: browse products, search, filter by category, sort (newest / price / rating), product detail with reviews, cart with quantity updates, checkout with shipping form, order history with status timeline, contact form
- Auth: register / login / logout via cookie sessions
- Admin panel (`/admin`): dashboard with revenue/orders/customers/top-products stats, product CRUD, order status management
- All product images generated and stored in `artifacts/store/public/images/products/`

## Auth model

Cookie-based sessions stored in the `sessions` table; cookie name `store_sid`. SESSION_SECRET is provisioned but session IDs are random tokens stored server-side. Roles: `user` and `admin`.

## Seeded credentials

- Admin: `admin@localstore.test` / `admin123`
- Sample customers: `maya@example.com`, `ben@example.com`, `sara@example.com` (all password `password123`)

## Common commands

- `pnpm --filter @workspace/api-spec run codegen` — regenerate API client + zod schemas after editing OpenAPI
- `pnpm --filter @workspace/db run push` — apply DB schema changes
- `pnpm --filter @workspace/api-server exec tsx src/seed.ts` — seed the database (idempotent — skips if any user exists)
- `pnpm run typecheck` — full repo typecheck
