# Dec Walls database architecture (Phase 2)

Date: 2026-11-26. **Status: approved on 2026-11-26, including the calls in section 16.** Nothing in this document has been applied. It follows [INTEGRATION_AUDIT.md](INTEGRATION_AUDIT.md).

Items marked **(proposed while writing)** were not part of the design discussion. Please check those first (section 16).

---

## 1. Intent

Make the storefront and dashboard use one Supabase database, so that what an admin changes is what a customer sees, and what a customer orders is what an admin receives.

**Goals**

- One structure for products, stock, orders, customers and settings.
- Real checkout with server-calculated totals and no overselling.
- Customers can reach only their own records, enforced by the database.
- Only approved admins can manage the store.

**Not goals**

- Redesigning existing screens.
- Brands, warehouses, staff permission levels, made-to-order items.
- Cart syncing between devices, online card payments, automatic emails or SMS.
- Connecting the "later" modules (section 14).

**Failure, even if it technically works**

- Existing products, URLs or image links are lost.
- An existing screen looks different, apart from the approved changes below.
- A customer can read another customer's data, or change a price or status.
- The store reports success for something it did not save.

**Approved UI changes:** new screens for customer orders, profile, addresses and wishlist contents, a new-password screen, and dashboard banner management, all built from existing components and styles. Brand and warehouse fields are already removed from the dashboard. Staff role and permission controls will be disabled.

---

## 2. Data access: approaches

| Approach | Gain | Cost | Decision |
|---|---|---|---|
| A. Drizzle; server code checks all permissions | Least work | One missed ownership check can expose data | Not chosen |
| B. Supabase client and RLS for everything | Standard Supabase pattern | Rewrites most database code; more logic in SQL | Not chosen |
| **C. Drizzle; customer queries run under RLS** | Database enforces ownership; keeps existing code | All customer queries must use one wrapper; admin and checkout code stays privileged | **Chosen** |

### 2.1 How C works

Checked read-only on the live database (PostgreSQL 17.12): the app connects as `postgres`, which bypasses RLS and is a member of `authenticated` and `anon`. `auth.uid()` exists. Switching roles through the transaction pooler is **not yet tested**.

```text
withCustomer(request, work)
  1. verify the Supabase session with the auth server -> auth user id
  2. begin transaction
  3. set local role authenticated
  4. set_config('request.jwt.claims', {sub, role}, true)   -- transaction-local
  5. run work(tx), using only this transaction
  6. commit (role and claims are discarded)
```

| Path | Database identity | Access control |
|---|---|---|
| Customer reads and writes | `authenticated` + claims | **RLS** and column grants |
| Public catalog, search | privileged | server query filters to published and active |
| Checkout, tracking, contact, newsletter | privileged | server validation |
| Admin | privileged | verified session + active staff row |

Rules:

- The user ID comes only from a verified session, never from request input.
- Customer code must not import the privileged connection. A test or lint rule enforces this.
- If the wrapper fails a pooler test, work stops and we decide again. No silent fallback to A.

---

## 3. System overview

```text
Dashboard (3001) -- staff token --> Store server /api/admin/*  --+
Store pages and actions ----------> packages/domain ------------+--> Supabase Postgres
Browser -- sign-in --> Supabase Auth                             |
Browser -- signed upload URL --> Supabase Storage <--------------+
```

- The dashboard has no database connection. Its proxy forwards the signed-in admin's token and checks host and origin.
- The shared `ADMIN_API_KEY` stops being the thing that grants access. It may be removed once staff sign-in works.
- With a database configured, errors are shown. The store never falls back to seed data. In production a missing `DATABASE_URL` is a startup error. Seed data remains for local development and tests only.
- One `SUPABASE_SERVICE_ROLE_KEY` is needed on the server for Storage and user administration. It is **not set today**; you add it yourself.

---

## 4. Conventions

| Topic | Rule |
|---|---|
| Names | `snake_case` plural tables; `camelCase` in TypeScript |
| Keys | `uuid` primary key, `gen_random_uuid()` |
| Money | `numeric(12,2)`, PKR; calculated on the server |
| Time | `timestamptz`, UTC; shown in Asia/Karachi |
| Timestamps | every table used by the apps gets `created_at` and `updated_at`, `not null default now()`; one trigger maintains `updated_at` |
| Link names | `slug` unique, lowercase letters, numbers and hyphens; never changes on rename |
| Emails | stored trimmed and lowercase |
| Constraints | prices, totals and stock `>= 0`; quantities `> 0` |
| Foreign keys | every foreign-key column is indexed |
| Deleting | products are archived; orders, payments and history are never deleted by the apps |
| Existing data | additive changes only; no table or column is dropped |

Notation below: `*` required, `+` new column, `~` changed, `= x` default. Timestamp columns are implied.

---

## 5. Catalog and stock

```text
products 1──* product_variants 1──* inventory_movements
   ├──* product_images
   ├──* category_products   *──1 categories (parent_id -> categories)
   └──* collection_products *──1 collections
```

### products

| Column | Type and rules |
|---|---|
| id* | uuid PK |
| slug* | text, unique |
| name* | text |
| description | text |
| status* | `draft` = default, `published`, `archived`+ (`scheduled` stays in the shared enum, not allowed for products) |
| label | text; `NEW IN` still feeds the New In page |
| material+ | text |
| color+ | text |
| price_amount*, compare_at_amount, price_currency* | kept as a **read-only copy** of the lowest-priced active variant, maintained by trigger, for listing and sorting |

Indexes: `status`, `(status, created_at)`.

`color` has no field on the dashboard form. The three colours now written into the product page are copied in; changing them later needs a database edit. **(proposed while writing)**

### product_variants (owns SKU, price, old price and stock)

| Column | Type and rules |
|---|---|
| id* | uuid PK |
| product_id* | FK products, cascade |
| sku* | text, unique ignoring case |
| title* | text; size name, or `Default` |
| price_amount* | `> 0` |
| compare_at_amount+ | null or greater than price |
| price_currency* | = `PKR` |
| inventory_quantity* | integer = 0, `>= 0`; the stock available to sell |
| reorder_level+* | integer = 10; low-stock threshold |
| is_default* | boolean; at most one per product |
| is_active+* | boolean = true |
| sort_order+* | integer = 0 |

**Mapping from the existing dashboard form (proposed while writing).** The form has one SKU, price, compare price and stock, plus size rows holding only size, price and stock.

| Case | Result |
|---|---|
| No size rows | the default variant takes the form's SKU, price, compare price and stock |
| Size rows | one variant per row. SKU = form SKU + `-` + size. Compare price = the form's value only where it exceeds that row's price. The default variant becomes inactive |
| Row removed | variant becomes inactive; never deleted, because orders refer to it |

The 109 existing SKUs are `<slug>-default`. The product page will show the variant SKU, so this text changes on existing pages until you edit the SKUs.

### product_images

`id*`, `product_id*` (FK, cascade), `url*`, `storage_path+` (set only for Supabase uploads), `alt`, `sort_order*` = 0, `is_primary*`, `is_hover*`. At most one primary and one hover image per product. Saving a product preserves the hover image unless the admin removes it.

### categories

`id*`, `slug*` unique, `name*`, `parent_id` (+FK to categories, restrict delete; no self-parent or cycles), `sort_order*`, `status+*` `draft` or `published` = `published`, `image_url+`, `image_storage_path+`.

### collections

`id*`, `slug*` unique, `name*`, `description`, `status*` (`draft` = default, `published`). The dashboard's "inactive/active" maps to `draft/published`.

**Join tables** `category_products` and `collection_products`: `(parent id, product_id)` unique, `sort_order*` = 0, cascade on delete. The form's one category writes one `category_products` row; additional existing links are preserved unless the category is changed.

**Store rules for special pages**

| Page | Contents |
|---|---|
| New In | published products labelled `NEW IN`, plus members of the `new-in` collection **(proposed while writing: the dashboard cannot edit labels)** |
| Sale | published products with an active variant that has a compare price |
| Best Seller, Top Rated | ordinary collections you fill |
| Any other | collection members only. The name-matching and "show everything" fallbacks are removed |

If `best-seller` or `top-rated` has no products, its page shows the existing empty state.

### Stock

- Every item is counted. An item with 0 available cannot be ordered.
- Stock changes only through one database function, which updates the variant and writes a movement in the same transaction.

**inventory_movements:** `id*`, `variant_id*` (FK), `location_id` (~ now optional, unused), `delta*` (not 0), `type+*` (`restock`, `sale`, `adjustment`, `return`), `reason*`, `resulting_quantity+*`, `order_id+` (FK), `staff_id+` (FK), `created_at*`. Rows are never updated or deleted. A unique rule on `(order_id, variant_id, type)` stops stock being returned twice.

---

## 6. Customers, staff, wishlist

| Table | Columns and rules |
|---|---|
| customers | `id*`, `auth_user_id` (unique, +FK `auth.users`, set null), `email*` unique, `full_name`, `phone` |
| addresses | `id*`, `customer_id*` (FK cascade), `full_name*`, `line1*`, `line2`, `area+`, `city*`, `region` (province), `postal_code`, `country*` = `PK`, `phone`, `is_default*` (one per customer) |
| wishlists | `id*`, `customer_id*` (+unique) |
| wishlist_items | `wishlist_id*`, `product_id*`, unique together |
| staff_users | `id*`, `auth_user_id*` unique, `email*` unique, `full_name`, `role_id*`, `is_active*` |
| roles | one row, `super_admin`. `permissions` and `role_permissions` stay unused |

**Guest orders.** A guest order creates or reuses a `customers` row by email with no `auth_user_id`, so guests appear in the dashboard. A guest order never overwrites an existing customer's profile; its details are saved on the order. When someone registers and **verifies** that email, the server attaches the row to their account and the earlier orders appear.

**Customer list figures** are calculated, not stored: order count, total spent (verified payments minus refunds), city (latest order), joined date.

**Admins.** The first one is created once, by a script you run with an account you choose. Registration never creates staff. Each protected request checks for an active staff row, so deactivation applies on the next request.

**Wishlist for guests:** pressing the heart sends them to the account screen. **(proposed while writing)**

**Cart:** stays in the browser and stores variant IDs and quantities. The server returns current names, prices and stock. Old carts that only hold a slug are matched to a variant, or the line is removed with a message. `carts` and `cart_items` stay unused.

---

## 7. Orders and payments

```text
orders 1──* order_items ──> product_variants
   ├──1 order_addresses
   ├──1 payments 1──* refunds
   ├──* order_status_history
   └──0..1 coupon_usages
```

### orders

| Column | Type and rules |
|---|---|
| number* | unique, `DW-` + database sequence from 10001 |
| customer_id | FK customers |
| email* | text |
| contact_name+*, contact_phone+*, whatsapp+ | contact at time of order |
| status~* | see below; = `pending` |
| subtotal_amount*, discount_amount+* = 0, shipping_amount*, total_amount* | all `>= 0`; total = subtotal − discount + shipping (checked) |
| coupon_id+, coupon_code+ | FK discounts, plus the code as typed |
| shipping_zone_name+, estimated_days+ | copied at time of order |
| idempotency_key+* | unique; a repeated submit returns the first order |
| currency* | = `PKR` |

Indexes: `customer_id`, `(status, created_at)`, `created_at`, `email`.

**order_items:** `order_id*`, `variant_id`, `product_id+`, `title*` (product name), `variant_title+*`, `sku+*`, `image_url+`, `unit_price_amount*`, `quantity*`. These are copies; later product edits do not change past orders.

**order_addresses:** `order_id*` (+unique), `type*` = `shipping`, `full_name*`, `line1*`, `line2`, `area+`, `city*`, `region`, `postal_code`, `country*`, `phone`, `instructions+`.

**order_status_history (new):** `id*`, `order_id*`, `kind*` (`order`, `payment`), `from_status`, `to_status*`, `staff_id`, `note`, `created_at*`. Append only.

### payments (one per order; the only place payment method and status live)

`order_id*` (+unique), `method+*` (`cod`, `bank`, `jazzcash`, `easypaisa`), `status~*` (`pending` = default, `verified`, `rejected`, `refunded`), `amount*`, `currency*`, `provider*` (existing column, `manual`), `provider_ref` (transaction ID), `receipt_path+`, `account_snapshot+` (jsonb: account the customer was shown), `verified_by+` (FK staff), `verified_at+`.

**refunds:** `payment_id*`, `amount*` `> 0`, `reason`, `staff_id+`. The total cannot exceed the payment. A record only; no money is moved. Marking a payment `refunded` requires full refund rows; a partial refund leaves it `verified`. **(proposed while writing)**

### Status model

Order status uses the dashboard's six values. `processing`, `shipped`, `delivered` and `returned` are added to the enum. The old `paid`, `fulfilled` and `refunded` values remain in the type but a constraint forbids them.

```text
Order:    pending -> processing -> shipped -> delivered -> returned
          pending | processing -> cancelled          shipped -> returned
Payment:  pending -> verified -> refunded
          pending -> rejected -> pending   (admin reopens)
```

Order and payment status are independent. Cash on delivery stays `pending` until an admin records the cash. An admin cannot skip steps or leave `cancelled` or `returned`. Rejecting a payment does not cancel the order.

**Tracking page** (lookup by order number **and** email, rate limited):

| Order status | Steps shown |
|---|---|
| pending, processing | Order placed is current |
| shipped | Order placed and Packed done; Shipped current |
| delivered | all five done |
| cancelled, returned | the status in the existing message style, no timeline |

Two small text changes **(proposed while writing)**: the first step's note says "We have your order and payment", which is false for unpaid orders; and the form says the order number was sent by email and SMS, which this project does not send.

### Placing an order (one transaction)

1. Validate input. If the idempotency key exists, return that order.
2. Lock the variant rows in ID order. Reject inactive, unpublished or insufficient items and name them.
3. Take prices from the database. Check the coupon, locking its row. Calculate delivery and total.
4. If the total differs from what the customer was shown, save nothing and show the new total.
5. Insert customer (if needed), order, items (one line per variant), address, payment, coupon use and history.
6. Reduce stock and record `sale` movements.

Any failure saves nothing. The cart is cleared only after success.

### Stock after cancellation or return

| Event | Stock |
|---|---|
| Order placed | reduced immediately |
| Cancelled before shipping | restored automatically, once, as `return` |
| Returned | unchanged; the admin restocks resellable items from Stock Management |
| Refunded | unchanged |

Unpaid transfer orders keep their stock until an admin cancels them. There is no automatic expiry.

**(proposed while writing)** The existing screens have no "restock these items" control, so returned stock is added through the stock adjustment with reason type `return`.

---

## 8. Coupons, delivery, payment accounts

### discounts (the dashboard's coupons)

| Dashboard field | Column |
|---|---|
| code | `code*`, unique ignoring case |
| type | `type*`: `percentage`, `fixed` |
| value | `value*` `> 0`; percentage `<= 100` |
| minOrderAmount | `min_order_amount+*` = 0 |
| usageLimit | `usage_limit+` (null = unlimited) |
| perCustomerLimit | `per_customer_limit+` |
| usedCount | counted from `coupon_usages`, not stored |
| expiresAt | `ends_at` |
| isActive | `is_active` (stays integer 0 or 1; mapped to boolean in code) |

**coupon_usages (new):** `coupon_id*`, `order_id*` unique, `customer_id*`, `discount_amount*`, `released_at`. Cancelling an order releases its use. A discount never exceeds the subtotal. Per-customer limits are based on email, so a different email counts as a different customer.

### shipping_zones (new) — correction to the earlier proposal

The existing zone screen has **name, delivery charge and estimated days only**. It has no list of cities and no free-delivery amount, so it cannot decide which zone an address belongs to. I said earlier that it would control delivery charges; it can only partly.

**Proposed:** columns `name*` unique, `delivery_charge*`, `estimated_days*`, `is_active*`. Checkout uses **one default zone** (`settings.shipping.defaultZoneId`, already in the settings data) for the charge and days. The free-delivery amount is stored in settings, starting at 5,000. It has no screen field, so changing it needs a database edit. Other zones are saved but do not affect checkout.

Starting default zone: Standard delivery, Rs.200, 5 days (the page keeps showing "3–5 business days").

Charging by city, or editing the free-delivery amount in the dashboard, needs new fields on that screen. That would be a further approved UI change.

### payment_accounts (new)

`kind*` (`bank`, `wallet`), `provider*` (bank name, or `easypaisa`, `jazzcash`, `sadapay`), `account_title*`, `account_number*`, `iban`, `is_active*`.

- Checkout shows the oldest active account for each method. **(proposed while writing)**
- A transfer method with no active account is hidden. SadaPay accounts can be stored but are not offered at checkout.
- No account numbers are copied from the current code or demo data. They must be entered by you.
- Cash on delivery is switched on in settings.

---

## 9. Banners, settings, messages

**banners:** existing `key*` unique, `title` (heading), `body`, `href`, `image_url`, `status*`, `starts_at`, `ends_at`; new `placement+*` (`hero`, `category_tile`), `eyebrow+`, `cta_label+`, `badge+`, `sort_order+*`, `image_storage_path+`. The current three hero slides and six tiles are imported, so the homepage looks the same. If a placement has no published banner, the section is hidden. The editing screen controls only these two placements.

**Other homepage content** (announcements, section images, video, testimonials, trust badges, navigation, footer, content pages) stays in code. Homepage product rows read the database.

**settings** (`key*` unique, `value*` jsonb, one row per tab, each validated by a schema):

| Key | Used by the apps in this plan |
|---|---|
| general, store | saved; contact details are not yet pushed into the storefront footer or pages |
| shipping | default zone and free-delivery amount, used by cart and checkout |
| payments | cash on delivery on or off |
| tax | **saved only. Tax is not added to totals** |
| notifications | saved only; nothing is sent |
| seo | homepage title and description |

Settings are never readable by public roles; the server returns only the public values it needs. **(the tax, notification and SEO behaviour is proposed while writing)**

**contact_messages (new):** `name*`, `email*`, `subject`, `message*`, `status*` = `new`.
**newsletter_subscribers (new):** `email*` unique, `source` (`home`, `footer`). Signing up twice succeeds without a duplicate.
Both are length-limited and rate limited, and viewed in Supabase.

---

## 10. Security

### 10.1 Grants

1. Revoke everything on all public tables from `anon` and `authenticated`, including `TRUNCATE`, `TRIGGER` and `REFERENCES`, and change default privileges so new tables start closed.
2. Grant back only the table below. RLS stays enabled on every table.

`service_role` is used for Storage and Auth administration, not table access.

### 10.2 Policies

`current_customer_id()` is a `security definer`, `stable` SQL function with a fixed `search_path`, returning the `customers.id` for `auth.uid()`.

| Table | anon | authenticated |
|---|---|---|
| products | read published | same |
| product_variants (not `inventory_quantity`, `reorder_level`) | read active variants of published products | same |
| product_images, join tables | read where the product is published | same |
| categories, collections, banners | read published (banners also within dates) | same |
| customers | none | read own; update only `full_name`, `phone` |
| addresses | none | read, add, change, delete own |
| wishlists, wishlist_items | none | manage own |
| orders, order_items, order_addresses | none | **read** own; no idempotency key |
| payments (only id, order_id, method, status, amount, currency, created date) | none | read own |
| order_status_history (not `staff_id`, `note`) | none | read own |
| all other tables | none | none |

Grants on partly visible tables are column-level. These rules also apply to direct Supabase API calls, so they are tested through both routes. The server reports availability without exposing exact stock counts.

Policies apply to signed-in staff as ordinary users. Admin access goes through the admin API only.

### 10.3 Server rules

- Every admin route: valid session, active staff row, input schema, field allow-list. No request body is written straight into a row.
- Errors return safe messages: duplicate slug or SKU, invalid reference, insufficient stock, not allowed. Raw database errors are only logged.
- Public write endpoints (checkout, tracking, contact, newsletter, upload links) are rate limited.
- The demo JWT login and `NEXT_PUBLIC_JWT_*` secrets are removed.

### 10.4 Storage

| Bucket | Access | Limits | Who writes |
|---|---|---|---|
| `catalog` (products, categories, banners) | public read | 5 MB; JPG, PNG, WebP | admins, through server-issued signed upload URLs |
| `receipts` | private | 10 MB; JPG, PNG, PDF | customers, through single-use signed URLs |

- Uploading directly to Storage avoids sending a 10 MB receipt through the web server, which hosts such as Vercel limit.
- Before accepting an order the server checks the receipt exists, has an allowed type and size, and is not attached to another order. Admins view receipts through short-lived links.
- Replaced or removed files are deleted only after the database change succeeds and no row still refers to them. Unattached receipts are cleaned up later.
- Existing Cloudinary and third-party links are left unchanged.

---

## 11. One data contract

`packages/types` holds the shared shapes and `packages/validation` the Zod schemas. API routes return these shapes, never raw rows. The JavaScript dashboard maps them in one file per entity.

| Shape | Used by | Contents |
|---|---|---|
| `ProductDto` | store lists and product page | product, active variants (id, title, sku, price, compare price, `available`), images, category and collections |
| `AdminProductDto` | dashboard | all statuses, stock, reorder levels, all variants |
| `CartLine` | cart | `variantId`, `quantity`; everything else from the server |
| `OrderDto` / `AdminOrderDto` | account and tracking / dashboard | admin adds staff notes, receipt access, history |

| Form or UI | Database | Cart | Order item |
|---|---|---|---|
| name | products.name | looked up | title |
| size | variants.title | looked up | variant_title |
| SKU | variants.sku | looked up | sku |
| price | variants.price_amount | looked up | unit_price_amount |
| comparePrice | variants.compare_at_amount | looked up | not kept |
| stock | variants.inventory_quantity | availability | reduced by quantity |
| images | product_images | primary | image_url |
| categoryId, collectionIds | join tables | — | — |
| material | products.material | — | — |

Lists are filtered, sorted and paged **in the database**, with a fixed final sort key. "Best selling" sorts by delivered quantity; "Featured" and "Most relevant" use collection order, then newest.

**Types.** Drizzle supplies row types. `supabase gen types` output is generated from the real schema and compared in a check, so the Drizzle schema cannot drift unnoticed.

---

## 12. Dashboard figures

| Figure | Definition |
|---|---|
| Total orders | all orders except cancelled |
| Revenue | verified and refunded payment amounts minus refund rows, by order date |
| Products | not archived |
| Customers | all `customers` rows, including guests |
| Sales over time | revenue grouped by Karachi date |
| Low stock | active variants at or below reorder level |

**(proposed while writing)**

---

## 13. Tables in summary

| Group | Tables |
|---|---|
| Used, extended | products, product_variants, product_images, categories, collections, inventory_movements, customers, addresses, wishlists, orders, order_items, order_addresses, payments, refunds, discounts, banners |
| Used, as is or nearly | category_products, collection_products, wishlist_items, staff_users, roles, settings |
| **New (6)** | order_status_history, coupon_usages, shipping_zones, payment_accounts, contact_messages, newsletter_subscribers |
| Kept, unused, closed to public roles | inventory_items, inventory_locations, carts, cart_items, permissions, role_permissions, audit_logs, shipments, reviews, pages, page_sections, content_blocks, navigation_menus, navigation_items, articles, media_assets, seo_metadata, notifications |

No `brands` table. No `payment_methods` or `shipping_methods` table: methods are a fixed list, configured by payment accounts, zones and settings.

---

## 14. Scope and order

| Stage | Contents |
|---|---|
| Core | staff sign-in, products, categories, collections, stock, orders (list, detail, status), payment verification, customers, store shopping features |
| Next | coupons, banners, delivery, payment accounts, settings, dashboard totals and reports |
| Later | couriers, shipments, flash sales, discounts, campaigns, newsletter screen, COD reconciliation, reviews, activity logs, admin order creation and editing, invoice and packing prints |

Coupons connect in Next. In Core the hardcoded codes are removed, so the existing coupon boxes reject every code until then.

Checkout needs delivery and payment accounts, so the **database parts and starting values** of those are built in Core; their dashboard screens follow in Next. Until then only cash on delivery works unless accounts are added directly in the database.

Later screens keep showing demo data. Do not use them to run the store. The "Frequently bought together" block stays hardcoded and broken. Testimonials stay as written; confirm they are real.

---

## 15. Migration plan (Phase 3)

**One tool:** reviewed SQL files in `supabase/migrations`, applied with the Supabase CLI. `db:push` and `drizzle-kit generate` are not used to change the database. `packages/db/migrations` is no longer used. Set `supabase/config.toml` to PostgreSQL 17 (it says 15).

| # | Step | Content |
|---|---|---|
| 0 | Safety | you confirm a backup; record row counts and checks |
| 1 | Baseline | mark `20261126000000_initial_schema` as already applied on live. This writes only to the migration history |
| 2 | Lock down | enable RLS (idempotent), revoke grants, default privileges |
| 3 | Enum values | `archived`; the four order statuses. Separate file, because new values cannot be used in the same transaction |
| 4 | Columns and tables | everything new, nullable or with defaults; `location_id` made optional |
| 5 | Backfill | variant compare prices from products; image, banner, zone and settings starting rows; hardcoded sizes and colours |
| 6 | Constraints | checks, unique rules, foreign keys, indexes, after verifying existing rows pass |
| 7 | Functions, triggers | stock function, price copy, `updated_at`, `current_customer_id()`, order number sequence |
| 8 | Policies and buckets | section 10 |

Required columns added to tables that are empty today (orders and related) need no backfill; step 4 must confirm they are still empty.

**Backfilling sizes:** the sizes hardcoded for Khaise, the silk sheet set and Bed in a Bag, and the one hardcoded size price, become variants. New variants start at stock 0.

**Safety rules**

- Every step is rehearsed on local Supabase (Docker required) with a copy of the catalog, never customer data.
- Nothing is applied to live without your approval for that run.
- No `drop table`, `drop column`, `truncate` or data deletion.
- Each step has a written way to reverse it. Added enum values cannot be removed.
- **Cutover:** all 109 variants have zero stock. Enter quantities before real checkout is switched on. Until then checkout must not report success.

### How we will know it works

- Row counts, product slugs and image URLs are unchanged after migration.
- Tests with two customers: neither can read or change the other's records, through the app **or** the Supabase API.
- Anonymous users cannot see drafts, stock counts, settings or orders, or write anything.
- After a customer transaction, the pooled connection has no leftover role or identity.
- Two simultaneous orders for the last unit: exactly one succeeds.
- A repeated submit creates one order; cancelling twice restores stock once.
- Altered prices, discounts or totals from the browser have no effect.
- The brief's end-to-end workflows pass, and screenshots match apart from approved changes.

**Visual baseline:** not captured yet. It must be taken before the next UI change. The brand and warehouse removal happened before any baseline.

---

## 16. For your review

**Please check these first** (my calls while writing):

1. **Delivery:** one default zone; the free-delivery amount has no screen field (section 8). This corrects what I said earlier.
2. **Tax** is saved but not charged; notification switches send nothing (section 9).
3. **Size variants** get generated SKUs and share the form's compare price (section 5).
4. **Colour** has no dashboard field (section 5).
5. **New In** includes labelled products and `new-in` collection members (section 5).
6. **Tracking** page text changes; **guest** wishlist heart opens the account screen (sections 6, 7).
7. **Revenue** and other dashboard definitions (section 12).
8. **Refunds** must be full to mark a payment refunded; checkout shows the oldest active account (sections 7, 8).

Also marked in the text: how returned stock is added back.

**Needed from you before the related work**

| Item | Needed before |
|---|---|
| Is this Supabase project production, and is there a backup? | any live change |
| `SUPABASE_SERVICE_ROLE_KEY` added by you | sign-in administration and uploads |
| Which email will be the first admin | staff sign-in |
| A production email service in Supabase | public registration and reset |
| Real stock quantities | real checkout |
| Real payment account details (entered by you) | transfer payments |
| Where the dashboard and store will be hosted | security phase |
| Permission to commit the current work | recommended before Phase 3; nothing is committed without your instruction |

**Left to the builder:** file layout, API request and response details, error wording, rate-limit method and numbers, index tuning, test structure.
