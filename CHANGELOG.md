# Dec Walls — Integration Changelog

Branch: `version-2`

---

## Phase 1–3 — Foundation (pre-session)

- Initial Next.js storefront scaffolded
- UI/UX iterations and component cleanup
- Database schema drafted (Drizzle + Supabase PostgreSQL 17)
- Core tables: `customers`, `orders`, `order_items`, `order_addresses`, `payments`, `products`, `product_variants`, `carts`, `cart_items`, `wishlists`, `wishlist_items`, `discounts`, `reviews`, `shipments`, `refunds`

---

## Phase 4 — Shared Backend (`8273b64`)

**Files changed:**
- `packages/db/src/schema/` — Drizzle schema locked in
- `packages/domain/src/catalog/index.ts` — catalog query helpers
- `packages/types/src/index.ts` — shared DTOs
- `packages/validation/` — Zod v4 contracts (`import { z } from "zod/v4"`)
- `packages/config/` — env validation

**What it does:**
- Shared config, Zod validation schemas, pricing helpers, Supabase client factory (`getDb`, `getServiceDb`)
- Domain layer separated from Next.js — no React imports in `@dec-walls/domain`

---

## Phase 5 — Dashboard Auth + Admin API Routes (`92de355`)

**Files changed:**
- `apps/storefront/app/api/admin/stats/route.ts`
- `apps/storefront/app/api/admin/orders/route.ts`
- `apps/storefront/app/api/admin/customers/route.ts`
- `apps/storefront/app/api/admin/inventory/route.ts`
- `apps/storefront/app/api/admin/_mappers.ts`
- `apps/dashboard/src/lib/admin-auth.js` + `admin-auth.d.ts`
- `apps/dashboard/src/pages/api/auth/login.js` + `me.js`
- `tests/unit/admin-api-mapping.test.ts`
- `tests/unit/admin-auth.test.ts`

**What it does:**
- Service-role admin API routes for stats, orders, customers, inventory
- `requirePermission(role, action)` RBAC guard — throws 403 on missing permission
- Mapper layer converts raw DB rows to clean API shapes
- JWT-based admin auth (`login` + `me` endpoints) for the ops dashboard

---

## Phase 6 — Storefront Wired to Real Data (`10efa12`)

**Files changed:**
- `apps/storefront/app/api/checkout/route.ts` — full checkout pipeline hitting DB
- `apps/storefront/app/api/track/route.ts` — order tracking by number/email
- `apps/storefront/app/api/track/_track-helpers.ts` — status step mapping
- `apps/storefront/app/(bare)/checkout/checkout-client.tsx` — calls real checkout API
- `apps/storefront/components/account/account-experience.tsx` — calls real auth
- `apps/storefront/components/pages/track-order-form.tsx` — calls real track API
- `packages/db/src/schema/commerce.ts` — added columns:
  - `orders`: `discountAmount`, `couponCode`, `idempotencyKey`, `shippingZoneName`, `estimatedDays`, `contactName`, `contactPhone`, `whatsapp`
  - New tables: `orderStatusHistory`, `shippingZones`, `contactMessages`, `newsletterSubscribers`
- `packages/domain/src/catalog/index.ts` — real variant queries

**What it does:**
- Checkout creates real `orders`, `order_items`, `order_addresses`, `payments` rows
- Tracking queries real order + status history
- Auth via Supabase (`signInWithPassword`, `signUp`, `resetPasswordForEmail`)
- Find-or-create customer on checkout by email

---

## Phase 7 — Security Hardening (`42ae1c5`)

**Files changed:**
- `apps/storefront/next.config.ts` — HTTP security headers
- `apps/storefront/app/api/checkout/route.ts` — exploit fixes
- `apps/storefront/app/api/track/_track-helpers.ts` — enum fix
- `supabase/migrations/20261128000100_phase6_tables_rls.sql` — RLS policies
- `apps/storefront/app/api/checkout/_checkout-helpers.ts` — extracted helpers
- `tests/unit/checkout-api.test.ts`
- `tests/unit/track-order.test.ts`

**What it does:**

Security headers added to all routes:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security` (production only)
- `Content-Security-Policy`

Checkout exploit fixes:
- **Discount overflow**: client could send `discount > subtotal` making orders free — capped with `Math.min(rawDiscount, subtotal)`
- **Payment status**: was `"awaiting_proof"` which violates DB constraint — fixed to `"pending"`
- **Idempotency**: unique constraint on `orders.idempotency_key`; duplicate requests return existing order instead of 500

Track order fix:
- `STATUS_STEP` map corrected to real DB enum values (`pending | processing | shipped | delivered | cancelled | returned`) — removed invalid `paid`, `fulfilled`, `refunded`

RLS migration (`supabase/migrations/20261128000100_phase6_tables_rls.sql`):
- `shipping_zones`: public SELECT
- `contact_messages`: public INSERT
- `newsletter_subscribers`: public INSERT
- **Status: not yet applied to live** — run `supabase db push --db-url "$DATABASE_URL"` when ready

---

## Phase 8 — Real Integration Tests (`9f88e36`)

**Files changed:**
- `apps/storefront/app/api/checkout/_checkout-helpers.ts` — `checkoutSchema`, `calcOrderTotals`, `mapCheckoutToOrder`, `buildOrderNumber` extracted from `route.ts`
- `tests/integration/checkout.test.ts` — rewritten (11 tests, real helpers)
- `tests/integration/order-lifecycle.test.ts` — new (4 tests)

**What it does:**
- Replaced in-memory domain stubs with real imported helpers
- Checkout integration tests cover: Zod schema validation, totals calculation, shipping threshold (free ≥ PKR 5000), discount cap, all payment methods
- Order lifecycle tests cover: full status progression, `cancelled`/`returned` → step 0, `delivered` → step 4, `shipped` → step 3

---

## Phase 9 — Server-Side Coupon Validation (`35cfcd0`)

**Files changed:**
- `packages/db/src/schema/commerce.ts` — schema additions:
  - `discounts` table: added `minOrderAmount`, `usageLimit`, `perCustomerLimit`
  - New `couponUsages` table: `couponId`, `orderId`, `customerId`, `discountAmount`, `releasedAt`
- `apps/storefront/app/api/coupons/_coupon-helpers.ts` — new
- `apps/storefront/app/api/coupons/validate/route.ts` — new
- `apps/storefront/app/api/checkout/route.ts` — coupon guard added
- `apps/storefront/app/(bare)/checkout/checkout-client.tsx` — calls validate API
- `tests/unit/coupon-validation.test.ts` — new (11 tests)

**What it does:**

New `GET /api/coupons/validate?code=X&subtotal=Y`:
- Looks up coupon in `discounts` table with live usage count subquery
- Validates: active flag, `startsAt`/`endsAt` window, `minOrderAmount`, `usageLimit`
- Returns `{ valid, discountAmount, message }`

Checkout route guard:
- Ignores client-sent `discount` entirely
- Looks up `couponCode` server-side, rejects with 400 if invalid/expired/exhausted
- Caps discount at subtotal via `calcOrderTotals`
- Writes `couponUsages` row alongside order on success

Checkout client:
- `applyCoupon()` is now async, calls `/api/coupons/validate` instead of matching hardcoded codes

---

## Test Suite Summary

| File | Tests | Status |
|------|-------|--------|
| `tests/unit/coupon-validation.test.ts` | 11 | ✓ |
| `tests/unit/checkout-api.test.ts` | 13 | ✓ |
| `tests/unit/track-order.test.ts` | 8 | ✓ |
| `tests/unit/admin-api-mapping.test.ts` | 12 | ✓ |
| `tests/unit/admin-auth.test.ts` | 10 | ✓ |
| `tests/integration/checkout.test.ts` | 11 | ✓ |
| `tests/integration/order-lifecycle.test.ts` | 4 | ✓ |
| All other unit tests | 129 | ✓ |
| **Total** | **198** | **✓** |

---

## Pending

- **Phase 7 RLS migration** — apply to live Supabase:
  ```bash
  export $(grep '^DATABASE_URL=' apps/storefront/.env.local)
  supabase db push --db-url "${DATABASE_URL/6543/5432}"
  ```
- **Phase 10** — TBD (candidates: payment proof upload, admin order management, email notifications)
