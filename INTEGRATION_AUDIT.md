# Dec Walls integration audit (Phase 1)

Date: 2026-11-26. Branch: `version-2`. No application code, UI or database content was changed. This file is the only addition.

## 0. Summary

The database exists and holds the catalog. Very little of either app uses it.

- The store cannot take orders. Checkout shows "Order placed!" and saves nothing.
- The dashboard cannot create products, and its product view and edit pages do not open.
- The homepage reads built-in seed data, so database changes never reach it.
- There is no customer or staff authentication.
- Of the dashboard's 22 service files, 3 call the real backend (products; categories and collections for reading). The other 19 use fake in-memory data.

### How findings were checked

| Method | Scope |
|---|---|
| Code reading | Storefront routes and main components, shared packages, SQL, dashboard services, product screens and data-source imports. Some large presentational components and most dashboard views were searched, not read in full. |
| Live database | Queries inside a `READ ONLY` transaction: structure, grants, RLS, buckets, row counts. |
| Running dev servers | `GET` requests only, against the servers already running on ports 3000 and 3001. |
| Tests | `vitest run` with `DATABASE_URL` unset; `tsc --noEmit` for the storefront and each package. |

**Not checked:** production builds, lint, Playwright, mobile layouts, visual baseline, form submissions or any write, Supabase dashboard settings (auth providers, backups), Cloudinary account contents. Findings marked **(runtime)** were reproduced; others come from code or database inspection.

---

## 1. Architecture

```text
apps/storefront     Next 16.3.6, React 19, App Router, Tailwind 4   port 3000   (npm workspace)
apps/full-version   Next 13.2.4, React 18, Pages Router, MUI 5      port 3001   (outside workspaces, own lockfile)
packages/           auth, config, db, design-system, domain, integrations, types, ui, validation
supabase/           config.toml (placeholder), migrations/, policies/rls.sql
```

Current data paths:

```text
Dashboard products -> /api/admin/[...path] proxy (adds ADMIN_API_KEY)
                   -> storefront /api/admin/* -> Drizzle -> Supabase Postgres
Dashboard, rest    -> axios-mock-adapter -> src/@fake-db (lost on reload)
Store catalog      -> packages/domain/catalog -> Drizzle (seed data if no DATABASE_URL)
Store homepage     -> packages/domain/cms -> seed files only
Store cart         -> React context + localStorage
Store checkout     -> browser only
```

- **Database access** is a direct Postgres connection through Drizzle and the Supabase pooler.
- **Supabase client libraries:** `packages/auth/src/supabase.ts` defines browser, server and service clients. No storefront file uses them. The browser and server ones require `NEXT_PUBLIC_SUPABASE_ANON_KEY`, but `.env.local` sets only the publishable key, so they would throw.
- **Environment:** `.env.local` has the Supabase URL, publishable key, `DATABASE_URL`, `ADMIN_API_KEY` and Cloudinary keys. There is no `SUPABASE_SERVICE_ROLE_KEY`. No env file is tracked by Git.
- **Git:** much of the work is uncommitted, including **the whole dashboard** (`apps/full-version`), the admin API, the migrations and the seed script.
- **Stale docs:** `README.md`, `docs/architecture.md` and `docs/authz.md` describe an `apps/ops` app and staff login that do not exist.
- **Earlier spec:** `docs/superpowers/specs/2026-11-26-dashboard-products-design.md` is only partly built (section 8).

---

## 2. Database

### 2.1 Live state

40 tables, 32 foreign keys, 3 enums, no functions, no triggers, no storage buckets, 0 auth users. Table and column names match the Drizzle schema in `packages/db/src/schema/`.

| Table | Rows | Note |
|---|---|---|
| products | 109 | all `published` |
| product_variants | 109 | one `<slug>-default` each; **all stock 0** |
| product_images | 170 | 167 Cloudinary, 3 `pyariwalls.pk` |
| categories | 154 | **136 empty**; none has a parent |
| category_products | 100 | 9 products have no category |
| collections | 152 | **121 empty** |
| collection_products | 309 | |
| all other 33 tables | 0 | orders, customers, staff, roles, settings, CMS and so on |

56 products have no description. 2 have a compare-at price.

### 2.2 Security

| Finding | Detail |
|---|---|
| RLS | Enabled on all 40 tables with **0 policies**, so `anon` and `authenticated` are denied. |
| Grants | `anon`, `authenticated` and `service_role` have no `SELECT` or `INSERT` on `products`. The grant summary for `anon` and `authenticated` shows only `REFERENCES`, `TRIGGER`, `TRUNCATE` across 40 tables. Supabase's Data API therefore cannot currently read the catalog, even with a service key. |
| `TRUNCATE` | Granted to `anon` and `authenticated`. RLS does not restrict `TRUNCATE`. The REST API offers no truncate operation, but the grant should be revoked. |
| App connection | The app connects with `DATABASE_URL`. If that is the default `postgres` role, RLS does not restrict it, so server code is the only access control. The role was not queried. |
| Drift | No repo SQL enables RLS. It was set outside the migrations. |
| `supabase/policies/rls.sql` | Not applied. It uses `create policy if not exists`, which Postgres rejects, and covers only some tables. |
| `packages/db/seeds/roles.sql` | Not applied. It would add one role and permissions, with no role-permission links. |

### 2.3 Migrations

- `supabase/migrations/20261126000000_initial_schema.sql` and `packages/db/migrations/0000_brainy_talisman.sql` are identical.
- `drizzle.config.ts` now writes to `supabase/migrations`, which has no Drizzle `meta/` journal. The next `db:generate` is likely to produce a second full initial migration.
- The live database has no migration-history table, so nothing records what was applied.
- `db:push` was added to `package.json`. It changes the database without a reviewed migration and should not be used on this project.

### 2.4 Schema gaps

**Missing for features the apps already show**

| Need | Current schema |
|---|---|
| Brand, material, warehouse city (dashboard product form) | no columns, no `brands` table |
| `archived` product status | enum is `draft`, `published`, `scheduled` |
| Category image, status, description | `categories` has slug, name, parent, order only |
| Collection image | no column |
| Order phone, WhatsApp, delivery instructions, area | phone only on `order_addresses`; no WhatsApp, area or instructions |
| Order payment method, payment status, discount, coupon | none on `orders` |
| Payment receipt and transaction ID | `payments.provider_ref` only; no receipt path, verifier or verified time |
| Order history | no `order_status_history` |
| Item snapshot (SKU, product, image, size) | `order_items` has `title`, price, quantity, nullable `variant_id` |
| Coupon minimum, usage limits, usage count | `discounts` has none; no `coupon_usages` |
| Shipping zones, methods, charges; payment methods and accounts | no tables |
| Contact messages, newsletter subscribers | no tables |

**Status values do not match**

| Concept | Database | Dashboard | Store |
|---|---|---|---|
| Order | pending, paid, fulfilled, cancelled, refunded | pending, processing, shipped, delivered, cancelled, returned | tracking steps: placed, packed, shipped, out for delivery, delivered |
| Payment | free text | pending, verified, rejected, refunded | none |
| Payment method | free-text `provider` | COD, Bank Transfer, Easypaisa, JazzCash, SadaPay | cod, bank, jazzcash, easypaisa |
| Product | draft, published, scheduled | draft, published, **archived** | published |

The database `order_status` mixes payment (`paid`, `refunded`) with fulfilment, which the brief says must be separate.

**Integrity**

- No `CHECK` constraints: prices, stock, quantities, totals and ratings can be negative or out of range.
- `categories.parent_id` and `navigation_items.parent_id` have no foreign key.
- Many foreign-key columns have no supporting index (for example `product_images.product_id`, `order_items.order_id`, `orders.customer_id`).
- Nothing enforces one default variant, one primary image, one wishlist per customer or a unique cart session token.
- No `updated_at` triggers; many tables have no timestamps.
- `discounts.is_active` and `reviews.is_approved` are integers, not booleans.

**Duplication**

- Stock lives in both `product_variants.inventory_quantity` and `inventory_items`. Only the first has data.
- Price lives on both `products` and `product_variants`. Nothing keeps them in step.
- No duplicate tables were found.

### 2.5 Names in the brief compared with existing tables

| Brief | Use |
|---|---|
| profiles | existing `customers` (and `staff_users`) |
| customer_addresses | existing `addresses` |
| inventory | existing `product_variants.inventory_quantity` |
| coupons | existing `discounts`, extended |
| store_settings | existing `settings` |
| payments, order_addresses, carts, wishlists, banners, inventory_movements | exist already |
| brands, coupon_usages, order_status_history, shipping_methods, payment_methods | add only if the matching feature is in scope |

---

## 3. Storefront

### 3.1 Status by feature

| Feature | Status | Detail |
|---|---|---|
| Homepage products | Not connected **(runtime)** | `resolveProductGridBlock` reads `homeProducts`. The rendered page referenced seed image paths and no Cloudinary URL. |
| Hero, banners, tiles, announcements | Hardcoded | Hero slides are fixed in `cms-block-renderer.tsx` and ignore the CMS block data. `banners` and CMS tables are unused. |
| Homepage reviews | Hardcoded | Six named testimonials in `domain/cms`; `reviews` is empty. Confirm they are real before launch. |
| Navigation, footer | Hardcoded | `cms/navigation.ts` and constants in `store-footer.tsx`. |
| Collection page | Partly works | Reads the database. `new-in` depends on the label `NEW IN`; `sale` on a compare-at price. |
| Homepage "Best seller" and "Top rated" | Broken **(runtime for best-seller)** | Tabs silently fall back to New In. `/collections/best-seller` returns 404. |
| Filters | Partly works | Browser-side. Price ceiling fixed at 69,900. "In stock" tests publish status, not stock; "Out of stock" is fixed at 0. |
| Sorting | Partly works | Only name and price work. Featured, relevance, best selling and date do nothing; date-new-to-old is the default. |
| Pagination | Missing | No UI. `listProducts` loads all published rows, then slices in memory, with no ordering. |
| Search | Partly works | Name only, first 100 results. An empty search shows at most 100 of 109 products. |
| Product detail | Partly works | Reads the database but **does not filter by status**: a draft or archived product opens by direct URL. |
| Variants, SKU, colour, stock | Hardcoded | Sizes, one size price, SKUs and colours are tied to three slugs in `product-experience.tsx`. "In stock" is fixed text and structured data. `product_variants` is never read by the store. |
| "Frequently bought together" | Broken | Fixed items and prices. "Add selected to bag" adds only the current product, whatever is ticked. |
| Recommendations | Partly works | Always New In. |
| Product card "Add to bag" | **Broken** | Only toggles local state. Nothing is added. |
| Wishlist | Missing | Card heart is local state; the product-page heart is a link; `/wishlist` has only a heading and text. The domain module is an in-memory `Map` that no page uses. |
| Compare button | No action | |
| Cart | Browser only | `localStorage`. Add, remove and quantity work in code. Stored prices are never rechecked, and there is no stock or availability check. |
| Coupons | **Unsafe** | `DECWALLS10` and `WELCOME` are hardcoded in the browser, with no expiry, limit or minimum. The discount is not recalculated when quantities change and is not carried from cart to checkout. |
| Shipping fee | Hardcoded twice | Free from Rs.5,000, otherwise Rs.200, in cart and checkout. |
| Checkout | **Not connected** | Waits 1.2 s, invents an order number, clears the cart and shows success. No order, customer, address or payment is saved. The receipt is never uploaded. |
| Payment accounts | **Launch risk** | Bank, JazzCash and Easypaisa numbers are written into the code and look like placeholders (for example `0300-1234567`). Customers are told to send money to them. Verify these before any public use. |
| Account | UI only | Login, register and reset validate, then say accounts are not available. No profile, address, order list or order detail screens exist. |
| Order tracking | **Misleading** | Any order number shows "Shipped". |
| Contact, newsletter (two forms) | **Misleading** | Show success and send nothing. |
| Blogs, policies, FAQs, stores, catalogues, about | Static | `lib/site-content.ts`. Acceptable unless you want them editable. |

### 3.2 Other

- Sitemap lists 100 of 109 products **(runtime)** because `pageSize` is 100.
- `robots.ts` hardcodes a `127.0.0.1` sitemap URL.
- `getFooterLinks()` returns `/pages/shipping` and `/pages/stores`, both 404 **(runtime)**. The visible footer uses its own list; whether any visible link points to them was not established.
- The product page uses `hello@decwalls.pk`; the rest uses `info@decwalls.com`.
- The store imports `@dec-walls/db` and `drizzle-orm` without declaring them in its `package.json`, and `db` is not in `transpilePackages`. It works through workspace hoisting.

---

## 4. Admin dashboard

### 4.1 Products

| Action | Status | Cause |
|---|---|---|
| List | Partly works | The API returns bare product rows, so image, SKU and stock are empty or 0. Category is always null. The API ignores query parameters. |
| View, edit | **Broken (runtime)** | `getStaticPaths` builds paths from fake numeric IDs with `fallback: false`. A UUID returns 404; a fake ID returns 500. |
| Add page | **Broken (runtime)** | Returns 500. `getStaticProps` calls the service with a relative URL on the server. |
| Create | **Broken** | The form sends `price`; the API requires `slug` and `priceAmount`. The form sends no slug, so the API would answer 400. No error handling in the submit function. |
| Update (once reachable) | **Silent data loss** | Only keys that match columns are saved, such as name, description and status. Price, compare price, SKU, stock, images, variants, category, collections, brand, material and city are ignored, yet "Product updated" is shown. |
| Update, validation | Blocked | Brand and category are required, but mapped data has neither. |
| Status "Archived" | Fails | Not a database enum value. |
| Delete | Wrong meaning | Sets status to `scheduled` to mean archived. The store's product page still shows it. |
| Image upload | Missing | Images become base64 strings in the browser. There is no upload endpoint, and the API does not save images. |

**Field mapping**

| Form field | API / column | Result |
|---|---|---|
| name, description, status | same | saved on update (except `archived`) |
| price | `priceAmount` | mismatch |
| comparePrice | `compareAtAmount` | mismatch |
| sku, stock | `product_variants.sku`, `.inventory_quantity` | never written |
| variants `{size, price, stock}` | `product_variants {title, price_amount, inventory_quantity}` | never written |
| categoryId | `category_products` | never written or read |
| collectionIds | `collection_products` | never written or read |
| images, primaryImage | `product_images` | never written |
| brand, material, warehouseCity | none | no column |
| (none) | slug | required, never generated |
| (none) | label, hover image | not editable; `NEW IN` controls a store collection |

### 4.2 All modules

| Module | Data source |
|---|---|
| Products | real API, broken as above |
| Categories, collections | real reads. Create, edit and delete still call fake endpoints, so changes do not reach the database. The service comments say these controls are disabled; no such disabling was found. |
| Dashboard home, analytics | static template widgets; two use fake orders |
| Reviews | fake |
| Inventory (4 screens) | fake, separate from real stock |
| Orders list, preview | fake order service |
| Order add, edit | invoice template demo data |
| Customers list, detail | fake service inside the template "user view" |
| Payments, transactions, verification, refunds, bank and wallet accounts, COD reconciliation | fake or static |
| Shipping, zones, couriers, shipments, tracking | fake |
| Coupons, discounts, flash sales, campaigns, newsletter | fake |
| Staff, activity logs | fake |
| Roles, permissions | template demo |
| Reports (5) | calculated from fake data |
| Settings | fake |
| Banners | **no screen exists** |
| Brands | **no screen or table**; a text field on the product form |

The template's component-showcase pages and demo apps are also still in the app.

---

## 5. Authentication, authorization and the admin API

| Item | Finding |
|---|---|
| Customer auth | None. |
| Staff auth | None. The login is a browser mock with users and passwords in `@fake-db/auth/jwt.js`. It protects no server code. |
| JWT secrets | Named `NEXT_PUBLIC_*`, so they are exposed to the browser. |
| Dashboard proxy | Adds the admin key to **any** caller. It has no session, host or origin check, although the earlier spec required the last two. |
| Cross-site writes | From the code, a web page open on the same computer could send a `text/plain` POST to `localhost:3001`; the proxy would add the key and the store would parse it as JSON. Not tested. |
| Admin API key | Without it the API returns 401 **(runtime)**. |
| Production | The admin API and proxy return 503, so **the dashboard cannot work when deployed** until staff login exists. |
| Input validation | None beyond three presence checks on create. `PUT` writes the request body into the row, so any column except slug, id and created time can be set. Zod schemas exist but are unused here. |
| Errors | Raw database error text can reach the client. |
| Route protection | No middleware in the store; permissions in `packages/auth` are not used by any route. |

---

## 6. Images

- The code uses **Cloudinary** (`upload-images.ts`, 167 live image URLs). The brief asks for **Supabase Storage**. There are no buckets. This needs your decision (section 10).
- 3 product images and some hardcoded images still load from third-party shops (`pyariwalls.pk`, `bareezehome.com.pk`). Those links can break, and you should confirm you have the right to use the images.
- Homepage and seed images also come from `apps/storefront/public/`.

---

## 7. Duplicated logic and unused code

| Area | Duplication |
|---|---|
| Catalog | database path and seed fallback, with different rules for collections and the homepage |
| Cart | `cart-context.tsx` (used) and `domain/cart` (unused; picks the first product if the ID is not found) |
| Checkout, orders | browser code (used) and `domain/checkout` (unused, in memory, no-op payment marks orders paid) |
| Wishlist | card state, `domain/wishlist`, and database tables |
| Product shape | database row, `ProductDto`, dashboard `mapProduct`, fake product, cart item. API routes return raw rows instead of a shared DTO. |
| Validation | `packages/validation` has schemas the live forms and API do not use |
| Price formatting, shipping rules | repeated across components |

Seed fallback is a risk in production: if `DATABASE_URL` is missing, the store serves seed data without any error.

`packages/types` has no generated database types; Drizzle infers row types from the hand-written schema.

---

## 8. Tests, type checks and the earlier spec

**Vitest: 104 passed, 1 failed (105).** The failure (`cms.test.ts`) expects a `product_grid` homepage block that no longer exists.

Passing tests do **not** show that integration works:

- `crud-dashboard.test.ts` imports only Vitest. It tests copies of logic written inside the test file, not the dashboard code.
- Cart, checkout, order and wishlist tests exercise in-memory modules the store does not use.
- No test covers the admin API or the database.

**Type check:** the storefront and packages pass, except `packages/db` with 4 `TS6059` errors (the seed script imports files outside `rootDir`).

**Config:** an empty `DATABASE_URL=` fails validation and throws instead of using the fallback. `.env.example` ships it empty.

**Playwright:** not run. Its assertions look out of date.

**Earlier spec, still missing:** brand/material/city columns, `archived` status, SKU and stock saving, store sizes from variants, status filtering on product pages, Storage upload, slug creation, duplicate SKU/slug messages, working view/edit pages, disabled category and collection controls, wider "Demo data" labels (one text match found), proxy origin check, RLS migration, and its listed API tests.

---

## 9. What already works

- Store pages tested returned 200: home, New In, Sale, a product, search, cart, checkout, account, wishlist **(runtime; a 200 does not mean the feature works)**.
- `/categories/bedding` redirects to its collection **(runtime)**.
- Collection and product pages read from the database through `packages/domain/catalog`.
- The catalog was imported with unique slugs and SKUs; every product has an image, a variant and a collection.
- The import script skips existing products. It does not repair links for a product left half-imported.
- Local cart add (from the product page), remove and quantity logic.
- The dashboard product list loads real names, prices and statuses.
- The admin API refuses requests without the key and is off in production.
- Drizzle schema matches the live tables and columns, which is a sound base.

---

## 10. Decisions needed from you

| # | Question | Recommendation |
|---|---|---|
| 1 | Is this Supabase project production? Can a backup or staging copy be used for write tests? | Treat it as production. Test writes on local Supabase or a second project. |
| 2 | May the current uncommitted work be committed before changes start? | Yes. It gives a rollback point and a "before" for design comparison. I will not commit without your instruction. |
| 3 | Data access: keep server-side Drizzle, or move to Supabase client queries under RLS? | Keep Drizzle on the server, use Supabase Auth for sign-in, enforce permissions in server code, and keep RLS deny-by-default as a second barrier. RLS then does not protect server queries, so customer policies and a restricted role would be needed if you want the database to enforce ownership. |
| 4 | Images: Supabase Storage or Cloudinary? | New uploads to Supabase Storage as the brief asks; leave existing Cloudinary URLs working. |
| 5 | **Design freeze and missing screens.** Account orders, profile and addresses, wishlist contents and a banner manager have no UI. | Approve building only what you need from existing components and styles. Otherwise those items stay out of scope. |
| 6 | Guest checkout, or account required? | Guest checkout, with optional accounts. |
| 7 | Stock is 0 for all products. Will you supply real quantities? | Needed before stock is enforced, or everything becomes sold out. |
| 8 | Real payment account details, and which methods (including SadaPay)? | Confirm before checkout goes live. |
| 9 | Which dashboard modules are in scope? | First: products, categories, collections, inventory, orders, payment verification, customers, overview. Next: coupons, shipping, settings. Later or never: couriers, flash sales, campaigns, wallet accounts, COD reconciliation, advanced reports. |
| 10 | Collections as well as categories? 121 collections and 136 categories are empty. | Keep both, since store URLs use collections. Do not delete empty rows without your approval. |
| 11 | Hardcoded bundle, testimonials, "Best seller" and "Top rated"? | Tell me the intended rule for each. I will not invent one. |
| 12 | Where will the dashboard be hosted? | Decide before the security phase. |

---

## 11. Recommended integration approach

Keep the stack and the existing UI. Change data wiring only.

| Phase | Work |
|---|---|
| 2. Architecture | `DATABASE_ARCHITECTURE.md`: final schema, one status model (order, payment, fulfilment separate), one product contract, price and stock owned by variants, access model. |
| 3. Database | Establish a migration baseline matching live without re-running it. Then additive migrations only: missing columns and tables, constraints, indexes, triggers, grants, RLS, storage bucket. Rehearse locally first. |
| 4. Shared backend | Shared DTOs and Zod validation, one catalog query path with status filtering and database-side pagination, one server-side pricing function, transactional order creation with row-locked stock. |
| 5. Dashboard | Staff authentication first, then products (fix routing, field mapping, images), categories and collections, inventory, orders and payments, customers, overview, then approved extras. |
| 6. Storefront | Homepage data, variants and stock on product pages, card actions, cart revalidation, **real checkout**, tracking, account and wishlist as approved. |
| 7. Security | Verify route, API, RLS and storage permissions with negative tests. |
| 8. Testing | Replace copy-based tests with tests of real code, run the brief's end-to-end workflows, compare screenshots at desktop and mobile widths. |

Two deliberate changes to the brief's order:

- **Staff login moves to the start of Phase 5**, before more write endpoints are added.
- **Visual baseline screenshots** should be taken at the start of Phase 2, before any code changes.

### Before any public launch

1. Checkout saves nothing but reports success.
2. Payment account numbers look like placeholders.
3. Coupons are controlled by the browser.
4. Tracking, contact and newsletter report results that did not happen.
5. Draft and archived products open by direct URL.
6. No real staff authentication.

If the store is already public, items 1 and 2 need attention now.
