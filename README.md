# Dec Walls

Production-oriented e-commerce monorepo: customer storefront, ops admin, and CMS — powered by Next.js and Supabase.

## Structure

```text
apps/storefront   Public storefront (SEO)
apps/ops          Admin + CMS
packages/*        Shared UI, design system, domain, db, auth, integrations
supabase/         Config + RLS policies
docs/             Architecture notes
```

## Prerequisites

- Node.js 20+
- npm 10+
- Supabase project (optional for UI seed mode)

## Setup

```bash
cp .env.example apps/storefront/.env.local
cp .env.example apps/ops/.env.local
npm install
```

Fill Supabase + `DATABASE_URL` when ready. Without them, domain seed data still serves the storefront and ops dashboards.

## Develop

```bash
npm run dev:storefront   # http://127.0.0.1:3000
npm run dev:ops          # http://127.0.0.1:3001
# or both
npm run dev
```

## Database

```bash
npm run db:generate
npm run db:migrate
```

Apply [`supabase/policies/rls.sql`](supabase/policies/rls.sql) in the Supabase SQL editor.

## Test

```bash
npx vitest run
npx playwright test
```

## Design sources

- Tokens: [`design.md`](design.md)
- Homepage composition: [`desgin/homePage/`](desgin/homePage/) (Bareeze Home capture)

See [`docs/architecture.md`](docs/architecture.md) for boundaries and data flow.
