# Authorization

## Realms

- **Customer** — storefront session via Supabase Auth → `customers`
- **Staff** — ops session via Supabase Auth → `staff_users` + role

## Roles

`super_admin`, `admin`, `manager`, `editor`, `inventory_manager`, `support`

## Enforcement

1. Ops middleware / login gate (Supabase session)
2. `requirePermission(session, 'products.write')` in server code
3. Postgres RLS for customer ownership and published reads

Local development uses `getDevStaffSession()` when Supabase is not configured.
