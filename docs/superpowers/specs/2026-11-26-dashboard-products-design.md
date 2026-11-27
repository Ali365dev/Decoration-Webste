# Design: add the dashboard and connect products to the store

Date: 2026-11-26. Status: waiting for approval.

## Intent

Bring the existing admin dashboard (`../web/full-version`) into this repo as `apps/dashboard` and connect it to the store, so that a product changed in the dashboard changes in the store. Products come first; other sections follow as separate projects.

## Order of work

1. **Dashboard move (this design)**
2. **Products connected (this design)**
3. Staff login
4. Orders and checkout (the store does not create orders today)
5. Remaining sections, one at a time

## Goals

- The dashboard runs from `apps/dashboard` on `127.0.0.1:3001`; the store stays on `127.0.0.1:3000`.
- Products can be listed, viewed, created, edited and archived from the dashboard.
- A published product appears in the store on the next page load. Draft and archived products do not appear.
- The products the store has now are imported into the database with the same slugs, prices, images, categories and collections.

## Not in this design

- Staff login. The dashboard keeps its demo login, which is **not** security.
- Deploying the dashboard or the admin API.
- Orders, customers, payments, shipping, marketing, reports, settings, reviews and inventory screens. They keep their fake data.
- Creating or editing categories and collections.
- Upgrading or restyling the dashboard, or converting it to TypeScript.

## Would count as failure

- Anyone without the admin key can change products.
- The store loses a product, changes a URL, or stops running without a database.
- The original `../web/full-version` folder is modified.

## Approaches

| Approach | Gain | Cost | Decision |
|---|---|---|---|
| 1. Shared database, admin API in the storefront | Product logic stays in the existing TypeScript packages | Admin endpoints live in the public app and need access checks | **Chosen** |
| 2. Shared database, admin API in the dashboard | Admin endpoints stay off the public site | The old JavaScript app may not use the packages easily, so logic may be duplicated | Not chosen |
| 3. Shared local file | No database needed | Not suited to a live store; replaced later | Not chosen |

## How it works

```
Dashboard page -> src/services/products.js
  -> dashboard server route (adds the admin key)
  -> storefront /api/admin/*
  -> packages/domain -> packages/db -> Postgres
Store pages -> packages/domain -> Postgres
```

Everything below is the proposed way to build it. These are my calls unless the table above says otherwise.

### Moving the dashboard

- Copy the current working files, including uncommitted changes. Leave out `node_modules`, `.next`, `.git`, `.env`, `yarn.lock` and `.DS_Store`. Its Git history stays in the original folder.
- Add `.env.example` with placeholder values.
- Keep it **outside** the npm workspaces (list `apps/storefront` and `packages/*` explicitly). It uses React 18 and the store uses React 19. It talks to the store over HTTP, so it needs no shared packages. It keeps its own lockfile and `.npmrc`.
- Add root scripts `dev:dashboard` and `build:dashboard`. Remove the dead `dev:ops` script and update the README's mentions of `apps/ops`.
- Get it running and building on its current versions before connecting anything.

### Database

- Develop against local Supabase (CLI is installed; Docker must be running). No account or hosted keys are needed for this design.
- Turn the placeholder `supabase/config.toml` into a working one and generate the first migration from the Drizzle schema.
- Enable row level security on every table, with no public write access, so Supabase's own public API cannot bypass the admin key. The existing `supabase/policies/rls.sql` covers only some tables and uses `create policy if not exists`, which Postgres does not accept, so it needs rewriting as a migration.
- Schema additions: `brand`, `material` and `warehouse_city` on products (all optional); an `archived` product status.
- SKU and stock live on `product_variants`. A product without sizes gets one default variant. The separate inventory tables stay unused for now.
- A repeatable import script loads categories, collections and products from the current seed data. Running it twice creates no duplicates and does not overwrite dashboard edits. It generates missing SKUs and starts stock at 0. Stock does not affect buying today.

### Store

- With `DATABASE_URL` set, catalog reads come from the database, including home page product grids and the sitemap. Without it, they come from the seed data as now.
- If the database is set but unreachable, show an error. Do not silently serve seed data.
- Keep the current behavior of collection pages, including `sale`, `new-in` and the name-matching fallbacks.
- Product-showing pages render fresh on each request. Caching can come later.
- Navigation menus stay as they are in code.
- The product page currently hardcodes size choices and some size prices and SKUs for particular products. Sizes, size prices and SKUs come from product variants instead, so sizes added in the dashboard show in the store and cart. The import turns the hardcoded values into variants. Without a database, the same values come from the seed data.
- A product with no rating shows no rating in the dashboard.

### Admin API

- Routes under `/api/admin/`: product list, get, create, update, archive; category list; collection list; image upload.
- Every request needs the secret `ADMIN_API_KEY`. If the key is not configured, the API is off. It is also off when `NODE_ENV` is `production`, until staff login exists.
- The key is used only by server code. The browser never receives it.
- Because the dashboard's forwarding route adds the key, it forwards only the listed routes, accepts only requests from the dashboard's own host and origin, and refuses to run in production. The dashboard listens on `127.0.0.1` only.
- Inputs are validated. Duplicate slug or SKU returns a clear message that the form shows.

### Dashboard changes

- `services/products.js` and the read functions in `services/categories.js` and `services/collections.js` call the real API.
- IDs change from numbers to text IDs. Product detail and edit pages must stop reading the fake product array directly.
- Brand and warehouse city become optional, because imported products have neither. Description becomes optional for the same reason.
- The form creates a slug from the name. An existing product's slug does not change when renamed.
- "Delete" archives the product, so later order records stay valid.
- Images upload to Supabase Storage instead of being saved as embedded text. The store's image settings must allow the local storage address in development.
- Existing images with store-relative paths (such as `/bareeze/image-17.jpg`) must display in the dashboard, while the saved path stays unchanged.
- Fields the dashboard does not edit (hover image, label, compare-at price when untouched) must survive a save.
- On the Categories and Collections pages, show real names and disable create, edit and delete. Product counts there use real products.
- Screens that stay on fake data (including inventory, discounts, flash sales, reports and reviews) must still load. Where they use fake products, they keep using the fake list, not a mix of old and new IDs. A visible "Demo data" label marks unconnected sections.
- The fake request interceptor must let the new routes through.

## How we check it

- Both apps build; store type check and existing tests pass.
- Automated tests cover: key missing or wrong, production refusal, validation, import run twice, and draft/archived products hidden from the store.
- In the browser: create a draft (not in store), publish it (in store), change price and image (store updates), archive it (gone).
- Store pages look the same before and after the import, and still run without `DATABASE_URL`.
- Open every dashboard menu item and note any that fail, including failures that existed before the move.

## Left to the builder

File layout, request and response shapes, test structure, and the wording of messages.

## Before going live (later work)

Staff login, a hosted Supabase project (you create it and enter the keys yourself), and a decision on where the dashboard is hosted.
