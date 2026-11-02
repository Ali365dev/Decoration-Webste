# Architecture

Dec Walls is a Turborepo monorepo with two Next.js apps and shared domain packages backed by Supabase.

## Apps

- `apps/storefront` — public SEO storefront (port 3000)
- `apps/ops` — internal Admin + CMS (port 3001)

## Packages

- `@dec-walls/design-system` — tokens from `design.md`
- `@dec-walls/ui` — presentational primitives
- `@dec-walls/types` — shared DTOs
- `@dec-walls/validation` — Zod contracts
- `@dec-walls/config` — env validation
- `@dec-walls/db` — Drizzle schema + client
- `@dec-walls/auth` — Supabase clients + RBAC
- `@dec-walls/domain` — business use-cases (no React)
- `@dec-walls/integrations` — payment / email / search adapters

## Dependency rules

1. Apps call domain + UI packages.
2. Domain calls db, auth, validation, integrations.
3. UI never contains business logic.
4. Service-role Supabase keys stay server-side.

## Local development without Supabase

Domain modules ship seed/in-memory implementations so storefront and ops render before `DATABASE_URL` is configured. Wire Supabase Auth/Postgres/Storage using `.env.example`, then apply `supabase/policies/rls.sql` and Drizzle migrations.

## AuthZ

Staff roles and permissions live in `@dec-walls/auth`. Ops screens call `requirePermission` on the server. RLS policies additionally constrain customer data access.
