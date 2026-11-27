# Phase 3: Database Migrations and RLS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Write the SQL migrations and security rules for the approved architecture, and prove them on a local Supabase copy. Nothing is applied to the live database.

**Architecture:** Reviewed SQL files in `supabase/migrations` are the only way the database changes. Each is rehearsed on top of the existing baseline with a catalog fixture loaded, then tested with Vitest against local Postgres, the local transaction pooler and the local Supabase API.

**Tech Stack:** Supabase CLI 2.107.0, PostgreSQL 17, Drizzle 0.44, `postgres` 3.4, `@supabase/supabase-js` (already installed), Vitest 3.

**Spec:** [DATABASE_ARCHITECTURE.md](../../../DATABASE_ARCHITECTURE.md). Section numbers below (§) refer to it.

## Global Constraints

- **Never write to the live database.** Do not run `supabase link`, `supabase db push`, `npm run db:push`, `db:migrate`, `db:seed` or `drizzle-kit generate` against it. `apps/storefront/.env.local` points at live; never load it in rehearsal commands or tests.
- Database tests must **throw before connecting** unless the host is `127.0.0.1` or `localhost`.
- No `drop table`, `drop column`, `truncate` or `delete from` in any forward migration (§15).
- **No `git commit`.** The user commits only when they ask. Each task ends with a checkpoint instead.
- No new npm packages.
- No UI changes. Nothing under `apps/*/components`, `apps/*/app` pages or `apps/dashboard/src` changes in this phase.
- Money is `numeric(12,2)`; times are `timestamptz`; every app-used table has `created_at` and `updated_at`, `not null default now()` (§4).
- Existing product slugs and image URLs must be identical before and after (§15).
- Docker Desktop must be running. It was **not** running when this plan was written.

## Review Focus

1. **New SQL functions are callable by anyone by default.** `adjust_stock` through the Supabase API as `anon` or a signed-in customer must be refused (tests in Tasks 6 and 7).
2. **A pooled connection keeps a customer's identity.** After `withCustomer` succeeds *or throws*, the next query on that connection must run as `postgres` with no claims (Task 8).
3. **Existing live rows break a new constraint.** Preflight must report every violating row count as 0 before apply, including the two compare-at prices (Tasks 5 and 9).
4. **The running dev store points at live.** Changing the Drizzle schema before live has the columns would break its catalog queries (Task 9 is gated on this).
5. **Current app code conflicts with new rules.** The existing admin delete writes status `scheduled`, which the new constraint rejects. It must be listed in the runbook as broken until Phase 4 or 5 (Task 10).

## File Structure

```text
supabase/config.toml                         modify: PostgreSQL 17, local pooler
supabase/migrations/20261127000100_lock_down.sql
supabase/migrations/20261127000200_enum_values.sql
supabase/migrations/20261127000300_columns_tables.sql
supabase/migrations/20261127000400_backfill.sql
supabase/migrations/20261127000500_constraints_indexes.sql
supabase/migrations/20261127000600_functions_triggers.sql
supabase/migrations/20261127000700_policies_storage.sql
supabase/rollback/<same names>.sql           reverse of each (enum values cannot be removed)
supabase/RUNBOOK.md                          live apply steps, gated on approval
scripts/db/rehearse.sh                       reset to baseline, load fixture, apply the rest
scripts/db/preflight.mjs                     read-only violation counts
scripts/db/snapshot.mjs                      read-only counts and slug/URL hashes
tests/db/fixtures/baseline-catalog.sql       catalog only, no customer data
tests/db/helpers.ts                          local-only connection, role helpers
tests/db/*.test.ts
vitest.db.config.ts                          database tests only
vitest.config.ts                             modify: exclude tests/db/**
packages/db/src/with-customer.ts
packages/db/src/schema/*.ts                  modify: mirror the migrations (Task 9)
```

---

### Task 1: Local rehearsal environment

**Files:** Modify `supabase/config.toml`, `vitest.config.ts`, `package.json`. Create `tests/db/helpers.ts`, `tests/db/guard.test.ts`, `tests/db/fixtures/baseline-catalog.sql`, `scripts/db/rehearse.sh`, `vitest.db.config.ts`.

**Interfaces — Produces:**
- `assertLocalUrl(url: string): string` (returns the URL or throws)
- `connect(): postgres.Sql` using `TEST_DATABASE_URL`, default `postgresql://postgres:postgres@127.0.0.1:54322/postgres`
- `asRole(sql, role: "anon" | "authenticated", authUserId: string | null, work: (tx) => Promise<T>): Promise<T>`, always rolled back
- `npm run db:rehearse`, `npm run test:db`

- [ ] **Step 1:** Write `guard.test.ts`:
```ts
expect(() => assertLocalUrl("postgresql://u:p@aws-0-x.pooler.supabase.com:6543/postgres")).toThrow(/local/i);
expect(() => assertLocalUrl("postgresql://u:127.0.0.1@db.example.com/postgres")).toThrow(/local/i);
expect(assertLocalUrl("postgresql://postgres:postgres@127.0.0.1:54322/postgres")).toContain("127.0.0.1");
```
- [ ] **Step 2:** Add `vitest.db.config.ts` (include `tests/db/**/*.test.ts`, `fileParallelism: false`); exclude `tests/db/**` in `vitest.config.ts`; add scripts `test:db` and `db:rehearse`. Run `npm run test:db`. Expected: FAIL, `assertLocalUrl` missing.
- [ ] **Step 3:** Implement the helpers. Compare the parsed `URL.hostname`, not a substring. Run `npm run test:db`. Expected: PASS.
- [ ] **Step 4:** In `config.toml` set `major_version = 17` and enable `[db.pooler]` with `pool_mode = "transaction"`. Run `supabase start`. Expected: services start. If the CLI rejects the minimal file, regenerate it with `supabase init --force` and keep `project_id`, ports and auth URLs.
- [ ] **Step 5:** Build the fixture **before any schema file changes**: `supabase db reset --local --no-seed --version 20261126000000`, run `packages/db/src/seed.ts` with `DATABASE_URL` set inline to the local URL, then `supabase db dump --local --data-only --schema public -f tests/db/fixtures/baseline-catalog.sql`. Expected: 109 products in the local database.
- [ ] **Step 6:** Write `rehearse.sh` (`set -euo pipefail`): reset to the baseline, load the fixture, `supabase migration up --local`. Load SQL with `docker exec -i supabase_db_dec-walls psql -U postgres -v ON_ERROR_STOP=1` (`psql` is not installed on the host). Run `npm run db:rehearse`. Expected: exit 0.
- [ ] **Step 7:** Checkpoint: `git status --short` shows only this task's files as new changes.

### Task 2: Lock down and enum values (§10.1, §15 steps 2–3)

**Files:** Create migrations `..000100`, `..000200`, their rollbacks, `tests/db/lockdown.test.ts`.

- [ ] **Step 1:** Tests: for every `public` base table, `relrowsecurity` is true; for `anon` and `authenticated`, `has_table_privilege` is false for `SELECT, INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER, REFERENCES` (this test is narrowed in Task 7 to the non-granted set); a table created inside a rolled-back transaction as `postgres` grants those roles nothing; `enum_range` of `publish_status` contains `archived` and `order_status` contains `processing, shipped, delivered, returned`.
- [ ] **Step 2:** `npm run db:rehearse && npm run test:db`. Expected: FAIL.
- [ ] **Step 3:** `000100`: `enable row level security` on all 40 tables; revoke all on all tables and sequences from both roles; `alter default privileges for role postgres in schema public revoke all on tables, sequences, functions` (one statement per object type) from `anon, authenticated`, and revoke default function execute from `public`. `000200`: only `alter type ... add value if not exists` statements.
- [ ] **Step 4:** Rehearse and test. Expected: PASS.
- [ ] **Step 5:** Checkpoint.

### Task 3: Columns and new tables (§5–§9, §15 step 4)

**Files:** Create `..000300`, rollback, `tests/db/schema.test.ts`.

**Interfaces — Produces:** every `+` and new column in §5–§9, and tables `order_status_history`, `coupon_usages`, `shipping_zones`, `payment_accounts`, `contact_messages`, `newsletter_subscribers`.

- [ ] **Step 1:** Test from one expected map `{table: [column, udt, nullable, hasDefault]}` transcribed from §5–§9, checked against `information_schema.columns`. Assert 46 base tables and no `brands` table. Assert `inventory_movements.location_id` is nullable.
- [ ] **Step 2:** Rehearse and test. Expected: FAIL.
- [ ] **Step 3:** Write the migration. It begins with a `do` block raising `orders_not_empty` if `orders`, `order_items` or `payments` has rows. Use `add column if not exists`. Set defaults: `payments.status 'pending'`, `payments.provider 'manual'`, `order_addresses.type 'shipping'`, `addresses.country` unchanged. Enable RLS on each new table in the same file. `categories.status` is `publish_status not null default 'published'`.
- [ ] **Step 4:** Rehearse and test. Expected: PASS.
- [ ] **Step 5:** Checkpoint.

### Task 4: Backfill starting data (§5, §8, §9, §15 step 5)

**Files:** Create `..000400`, rollback, `tests/db/backfill.test.ts`. Read `apps/storefront/components/cms/cms-block-renderer.tsx` (hero slides), `packages/domain/src/cms/index.ts` (`categoryTiles`) and `components/product/product-experience.tsx` (sizes); copy values exactly.

- [ ] **Step 1:** Tests:
  - each product's compare-at price now equals its original variant's `compare_at_amount`
  - `khaise` has active variants `SINGLE (60X90 IN.)` (price = product price) and `DOUBLE (90X95 IN.)` (`18000.00`, compare null), SKUs `FKH-137-KHAISE-<size>`, stock 0; its `Default` variant has `is_active = false`
  - `silk-plain-bed-sheet-set`: one active `KING (100X100 IN.)`, SKU `FPBS-199-SILK PLAIN BED SHEET SET-KING (100X100 IN.)`
  - `capp-169-qf-rp`: one active `King`, SKU `CAPP-169-QF-RP-Bed In a Bag-King`
  - colors `PEACH` (silk), `O-WHITE` (khaise), `GREY` (capp)
  - banners: 3 `hero` and 6 `category_tile`, all published, same order, labels, links and images as the code; the Canvas & Wall Art tile uses the primary image of `makkah-madinah-scenic-frame-set`, else `/home/cat-4.jpg`
  - one `shipping_zones` row `Standard delivery`, `200.00`, `5`; settings `shipping` = `{defaultZoneId: <its id>, freeDeliveryThreshold: 5000}`; `payments` = `{codEnabled: true}`; one `roles` row `super_admin`
  - `payment_accounts` is empty
  - running the file twice changes no row count
- [ ] **Step 2:** Rehearse and test. Expected: FAIL.
- [ ] **Step 3:** Write the migration with `on conflict do nothing` or `where not exists`. A missing product slug is skipped. Compare-at is copied only where it exceeds the variant price.
- [ ] **Step 4:** Rehearse and test. Expected: PASS.
- [ ] **Step 5:** Checkpoint.

### Task 5: Constraints and indexes (§4–§9, §15 step 6)

**Files:** Create `..000500`, rollback, `tests/db/constraints.test.ts`.

- [ ] **Step 1:** One test per rule, each expecting the insert or update to fail (inside a rolled-back transaction): negative price or stock; quantity 0; compare-at ≤ price; product status `scheduled`; collection status `archived`; SKU differing only by case; second default variant, primary image or hover image for a product; slug `Bad Slug`; category as its own parent and a two-level cycle (the cycle trigger belongs to this file); order status `paid`; total ≠ subtotal − discount + shipping; second payment or address for an order; repeated idempotency key; payment method `sadapay`; percentage coupon 101; coupon codes differing only by case; second default address; second wishlist; zero movement delta; a second movement with the same order, variant and type.
- [ ] **Step 2:** Add a test that every foreign-key column is the leading column of some index.
- [ ] **Step 3:** Rehearse and test. Expected: FAIL.
- [ ] **Step 4:** Write the migration. Compare enum columns as `status::text`. Include the foreign keys `categories.parent_id` (restrict) and `customers.auth_user_id → auth.users` (set null).
- [ ] **Step 5:** Rehearse and test. Expected: PASS, including Task 4 tests (the fixture satisfies every rule).
- [ ] **Step 6:** Checkpoint.

### Task 6: Functions and triggers (§4, §5, §7)

**Files:** Create `..000600`, rollback, `tests/db/functions.test.ts`.

**Interfaces — Produces:**
- `public.adjust_stock(p_variant_id uuid, p_delta int, p_type text, p_reason text, p_order_id uuid default null, p_staff_id uuid default null) returns int` — new quantity; raises message `insufficient_stock` or `variant_not_found`
- `public.current_customer_id() returns uuid`
- `orders.number` default `'DW-' || nextval('public.order_number_seq')`, starting 10001
- triggers `set_updated_at`, `sync_product_price`

- [ ] **Step 1:** Tests:
  - restock +5 returns 5 and writes one movement with `resulting_quantity = 5`
  - delta −1 at stock 0 raises `insufficient_stock` and writes nothing
  - two connections each take the last unit at once: exactly one succeeds, final stock 0
  - the same `return` for the same order twice: second call fails and stock is unchanged
  - first two new orders get `DW-10001`, `DW-10002`
  - changing, deactivating or adding variants updates `products.price_amount` and `compare_at_amount` to the lowest active variant; with no active variant the old values stay
  - updating a row advances `updated_at`
  - `has_function_privilege` for `anon` and `authenticated` on `adjust_stock` is false
- [ ] **Step 2:** Rehearse and test. Expected: FAIL.
- [ ] **Step 3:** Write the migration. `adjust_stock` uses a single `update ... set inventory_quantity = inventory_quantity + p_delta where id = ... and inventory_quantity + p_delta >= 0 returning`, then inserts the movement. Every function sets `search_path = ''`; only `current_customer_id` is `security definer`. `revoke execute ... from public, anon, authenticated` on each, then grant `current_customer_id` to `authenticated`.
- [ ] **Step 4:** Rehearse and test. Expected: PASS.
- [ ] **Step 5:** Checkpoint.

### Task 7: Policies, grants and buckets (§10.2, §10.4)

**Files:** Create `..000700`, rollback, `tests/db/policies.test.ts`, `tests/db/api.test.ts`. Modify `tests/db/lockdown.test.ts`. Mark `supabase/policies/rls.sql` as replaced with a header comment; do not delete it.

**Interfaces — Consumes:** `asRole`, `current_customer_id()`.

- [ ] **Step 1:** `policies.test.ts` builds two customers A and B (auth users, customers, address, wishlist, order, item, address, payment, history) plus a draft and an archived product. For every row of the §10.2 table assert both what is allowed and what is refused. At minimum: A selects only A's rows from each private table; A cannot update B's address or insert one with B's `customer_id`; A may update own `full_name` but not `email` or `auth_user_id`; A cannot update orders or payments; selecting `idempotency_key`, `receipt_path`, `verified_by`, history `note` or `inventory_quantity` is permission denied; `anon` sees no draft or archived product, nor its variants, images or links; an unpublished or out-of-date banner is hidden; `anon` and `authenticated` get nothing from `settings`, `staff_users`, `discounts`, `payment_accounts`, messages and subscribers.
- [ ] **Step 2:** Narrow the lockdown test to assert that granted privileges equal exactly the §10.2 matrix, and that neither role has `TRUNCATE` anywhere.
- [ ] **Step 3:** `api.test.ts` uses `@supabase/supabase-js` against the local API with keys read from `supabase status -o env` (pass as environment variables; do not write them to a file). Anon cannot read `orders`; signed-in A reads only A's orders; `rpc("adjust_stock", ...)` fails for both; anon cannot download from `receipts` or upload to either bucket.
- [ ] **Step 4:** Rehearse and test. Expected: FAIL.
- [ ] **Step 5:** Write the migration. Insert buckets `catalog` (public, 5242880 bytes, `image/jpeg,image/png,image/webp`) and `receipts` (private, 10485760 bytes, `image/jpeg,image/png,application/pdf`) with `on conflict do nothing`. Add no `storage.objects` policy.
- [ ] **Step 6:** Rehearse and test. Expected: PASS.
- [ ] **Step 7:** Checkpoint.

### Task 8: Prove Option C (§2.1)

**Files:** Create `packages/db/src/with-customer.ts`, `tests/db/with-customer.test.ts`. Modify `packages/db/package.json` (export `./with-customer`).

**Interfaces — Produces:** `withCustomer<T>(db: Database, authUserId: string, work: (tx: Parameters<Parameters<Database["transaction"]>[0]>[0]) => Promise<T>): Promise<T>`. The caller must pass an ID taken from a verified session; session verification itself is Phase 4.

- [ ] **Step 1:** Tests, run twice: direct connection and `TEST_POOLER_URL` (take it from the local stack; it must pass `assertLocalUrl`). Use a one-connection client with `prepare: false`.
  - inside: `current_user = 'authenticated'`, `auth.uid()` = A, only A's orders
  - after success: `current_user = 'postgres'` and `auth.uid()` is null
  - after `work` throws: the same, and its writes are rolled back
  - 50 interleaved A and B calls on a 5-connection pool: no result contains the other's row
  - `""`, `"not-a-uuid"` and `"x'; reset role; --"` are rejected before any transaction starts
- [ ] **Step 2:** Run. Expected: FAIL, module missing.
- [ ] **Step 3:** Implement: validate the UUID; in `db.transaction`, run `set local role authenticated`, then `select set_config('request.jwt.claims', $1, true)` with a **bound parameter**, then `work(tx)`.
- [ ] **Step 4:** Run. Expected: PASS on both connections. **If it fails on the pooler, stop and report. Do not switch to another approach (§2.1).**
- [ ] **Step 5:** Checkpoint.

### Task 9: Verification scripts, rollback rehearsal, schema mirror

**Files:** Create `scripts/db/preflight.mjs`, `scripts/db/snapshot.mjs`, `tests/db/preflight.test.ts`. Modify `packages/db/src/schema/{identity,catalog,commerce,cms}.ts`.

**Interfaces — Produces:** both scripts take the connection string from `DB_URL` only (never an env file), run inside one `READ ONLY` transaction, and print no row contents. `preflight` prints `<rule>: <violating rows>` for every constraint in `000500` that applies to existing columns, plus order-table row counts, and exits 1 if any is non-zero. `snapshot` prints row counts and a hash each of sorted product slugs and sorted image URLs.

- [ ] **Step 1:** Test: on the baseline fixture preflight exits 0; after inserting one case-duplicate SKU it exits 1 and names that rule. An attempted write inside either script's transaction fails.
- [ ] **Step 2:** Run. Expected: FAIL. Implement. Run. Expected: PASS.
- [ ] **Step 3:** Snapshot before and after `db:rehearse`'s forward migrations. Expected: same product count and both hashes; variants **+4** (two Khaise, one silk sheet, one Bed in a Bag).
- [ ] **Step 4:** Apply the rollback files in reverse order, then rehearse again. Expected: both succeed; after rollback the snapshot hashes still match and no new table remains. Enum values remain, by design.
- [ ] **Step 5:** **Gate before editing the Drizzle schema:** the dev store on port 3000 points at live, and new schema columns would break its queries until live is migrated. Ask the user either to point it at local Supabase or to defer Steps 6–7 until after live apply.
- [ ] **Step 6:** Mirror every column and table in the schema files. Test: `drizzle-kit pull` from local into a scratch directory, and compare table and column names; zero differences. Do not run `drizzle-kit generate`.
- [ ] **Step 7:** Generate types with `supabase gen types typescript --local` into `packages/db/src/database.types.ts`. Run `npm run typecheck`. Expected: no new errors beyond the 4 existing `TS6059` ones.
- [ ] **Step 8:** Checkpoint.

### Task 10: Runbook and phase report

**Files:** Create `supabase/RUNBOOK.md`.

- [ ] **Step 1:** Write the live steps in order, each marked **needs the user's approval**: confirm backup; `DB_URL=... node scripts/db/snapshot.mjs` and `preflight.mjs`; mark the baseline applied with `supabase migration repair --db-url <url> --status applied 20261126000000`; apply with the user watching; re-run snapshot; how to roll back each step. Include what breaks until later phases: admin delete (writes `scheduled`), and the 4 products-page size variants having no stock.
- [ ] **Step 2:** Run `npm run db:rehearse && npm run test:db`, then `env -u DATABASE_URL npx vitest run`. Expected: database tests all pass; unit tests 104 pass and the 1 known `cms.test.ts` failure.
- [ ] **Step 3:** `grep -niE "drop table|drop column|truncate table|delete from" supabase/migrations/20261127*`. Expected: no matches.
- [ ] **Step 4:** Report as the brief requires: inspected, changed, files, database changes (local only), tests, results, remaining issues. State that live is unchanged.
