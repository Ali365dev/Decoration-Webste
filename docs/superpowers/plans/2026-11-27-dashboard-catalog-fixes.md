# Dashboard Catalog Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make dashboard Add/Edit Product and Categories work against the real database, with images uploaded to Cloudinary by direct signed upload.

**Architecture:** The storefront's `/api/admin/*` routes do the work: pure helpers (zod schemas, slug and variant logic, Cloudinary signing) live in `_*.ts` files next to the routes and are unit-tested; database writes run in one Drizzle transaction and are tested against local Supabase. The dashboard (Next pages router, JS) maps form fields to the API shape in a pure module, uploads images straight to Cloudinary on Save, and loads page data in the browser instead of at build time.

**Tech Stack:** Next.js (storefront: app router, TS; dashboard: pages router, JS, MUI), Drizzle + postgres-js, zod 4, vitest, Cloudinary upload REST API (no SDK).

**Spec:** `docs/superpowers/specs/2026-11-27-dashboard-catalog-fixes-design.md`

## Global Constraints

- Design freeze: no visual change to any dashboard or storefront screen. Wiring and logic only. No new UI libraries, and no new npm packages at all (Cloudinary signing uses Node `crypto`).
- No database migration. The Supabase migrations already have every column used here; only `packages/db/src/schema` catches up.
- `CLOUDINARY_API_SECRET` and `ADMIN_API_KEY` stay server-side; the browser receives only `cloudName`, `apiKey`, `timestamp`, `signature`, `folder`.
- Admin API stays off in production (existing `guardAdmin`).
- Cloudinary folders: `dec-walls/products`, `dec-walls/categories`.
- Product "delete" sets status `archived`. Removed variants are set `isActive = false`, never deleted.
- Do not commit. Each task ends with a review stop; commit only when the user asks (user rule).
- Before editing storefront route handlers, read the relevant guide in `apps/storefront/node_modules/next/dist/docs/` (AGENTS.md: this Next version has breaking changes).

## Review Focus

1. **Duplicate SKU across products** (a size SKU like `WP-001-a4` already used by another product) — the whole save aborts with 409 "SKU already in use", and no product row is left behind. Test in Task 4.
2. **Editing a product that has a hover image or label the form doesn't show** — those survive a save. Test in Task 4.
3. **Save pressed twice quickly** — only one product is created. Covered by disabling Submit while saving (Task 7) and checked in the browser (Task 8).
4. **Cloudinary upload fails midway** (network, bad signature) — the product is not saved, the form stays filled, a toast shows the reason. Test in Task 6 (`uploadImages` rejects) and checked in Task 8.
5. **Products imported earlier with store-relative image paths** (`/bareeze/image-17.jpg`) — they stay unchanged when the product is saved without touching images. Test in Task 6 (`toApiPayload` passes existing URLs through untouched).

---

### Task 1: Drizzle schema catches up with the database

**Files:**
- Modify: `packages/db/src/schema/identity.ts` (publishStatusEnum)
- Modify: `packages/db/src/schema/catalog.ts` (products, productImages, categories)
- Test: `tests/unit/schema-catalog.test.ts`

**Interfaces:**
- Produces: `publishStatusEnum` values `["draft","published","scheduled","archived"]`; `products.material`, `products.color` (text, nullable); `productImages.storagePath` (`storage_path`, text, nullable); `categories.status` (publishStatusEnum, not null, default `published`), `categories.imageUrl` (`image_url`), `categories.imageStoragePath` (`image_storage_path`).

- [ ] **Step 1: Write the failing test** — `tests/unit/schema-catalog.test.ts`

```ts
import { getTableColumns } from "drizzle-orm";
import { products, productImages, categories } from "../../packages/db/src/schema/catalog";
import { publishStatusEnum } from "../../packages/db/src/schema/identity";

it("publish status includes archived", () => {
  expect(publishStatusEnum.enumValues).toEqual(["draft", "published", "scheduled", "archived"]);
});
it("catalog tables expose the columns the migrations added", () => {
  expect(getTableColumns(products).material.name).toBe("material");
  expect(getTableColumns(products).color.name).toBe("color");
  expect(getTableColumns(productImages).storagePath.name).toBe("storage_path");
  const c = getTableColumns(categories);
  expect([c.status.name, c.imageUrl.name, c.imageStoragePath.name]).toEqual(["status", "image_url", "image_storage_path"]);
});
```

- [ ] **Step 2:** `npx vitest run tests/unit/schema-catalog.test.ts` → FAIL (`material` undefined).
- [ ] **Step 3:** Add the enum value and columns listed under Produces.
- [ ] **Step 4:** `npx vitest run tests/unit/schema-catalog.test.ts` → PASS; `npm run typecheck` → no new errors; `npm run test:db -- tests/db/schema.test.ts` (local Supabase running) → PASS, confirming the schema matches the real tables.
- [ ] **Step 5:** Stop for review (no commit).

---

### Task 2: Cloudinary upload signing route

**Files:**
- Create: `apps/storefront/app/api/admin/uploads/_sign.ts`
- Create: `apps/storefront/app/api/admin/uploads/sign/route.ts`
- Modify: `apps/storefront/.env.example` (add `CLOUDINARY_CLOUD_NAME=`, `CLOUDINARY_API_KEY=`, `CLOUDINARY_API_SECRET=` placeholders, if the file exists)
- Test: `tests/unit/cloudinary-sign.test.ts`

**Interfaces:**
- Produces: `UPLOAD_FOLDERS = ["dec-walls/products", "dec-walls/categories"] as const`; `signUploadParams(params: Record<string, string | number>, apiSecret: string): string` — Cloudinary rule: sort keys alphabetically, join `key=value` with `&`, append secret, SHA-1 hex.
- Produces: `POST /api/admin/uploads/sign` body `{ folder }` → `200 { data: { cloudName, apiKey, timestamp, signature, folder } }`; `400` for a folder not in `UPLOAD_FOLDERS`; `503 "Cloudinary not configured"` if any of the three env vars is missing; guarded by `guardAdmin`. The dashboard proxy (`pages/api/admin/[...path].js`) already forwards any path, so it needs no change.

- [ ] **Step 1: Write the failing tests**

```ts
it("matches Cloudinary's documented signature", () => {
  // From Cloudinary docs "Generating authentication signatures"
  expect(signUploadParams({ eager: "w_400,h_300,c_pad|w_260,h_200,c_crop", public_id: "sample_image", timestamp: 1315060510 }, "abcd"))
    .toBe("bfd09f95f331f558cbd1320e67aa8d488770583e");
});
it("is independent of key order", () => {
  expect(signUploadParams({ timestamp: 1, folder: "a" }, "s")).toBe(signUploadParams({ folder: "a", timestamp: 1 }, "s"));
});
it("route refuses without the admin key", async () => { /* set ADMIN_API_KEY, call POST with no x-admin-key → 401 */ });
it("route refuses an unknown folder", async () => { /* folder "other" → 400 */ });
it("route returns a signature and never the secret", async () => { /* body JSON must not contain CLOUDINARY_API_SECRET's value */ });
```

Call the route's exported `POST` directly with `new NextRequest("http://x/api/admin/uploads/sign", { method: "POST", headers, body })`, using `vi.stubEnv` for the env vars.

- [ ] **Step 2:** `npx vitest run tests/unit/cloudinary-sign.test.ts` → FAIL (module not found).
- [ ] **Step 3:** Implement `_sign.ts` and the route. `timestamp = Math.floor(Date.now() / 1000)`; sign `{ folder, timestamp }`.
- [ ] **Step 4:** Re-run → PASS.
- [ ] **Step 5:** Stop for review.

---

### Task 3: Product input rules (pure helpers)

**Files:**
- Create: `apps/storefront/app/api/admin/products/_product-input.ts`
- Test: `tests/unit/product-input.test.ts`

**Interfaces:**
- Produces:
  - `productInputSchema` (zod) parsing to `ProductInput`:
    `{ name: string(min 3); slug?: string; description: string | null; status: "draft"|"published"|"scheduled"|"archived" (default "draft"); priceAmount: number > 0; compareAtAmount: number | null (0 → null); material: string | null; sku: string(min 1); stock: int ≥ 0; categoryId: uuid | null; collectionIds: uuid[] (default []); variants: { title: string(min 1); priceAmount: number > 0; inventoryQuantity: int ≥ 0; sku?: string }[] (default []); images: { url: string(min 1); publicId: string | null; isPrimary: boolean }[] (default []) }`
  - `slugify(text: string): string` — lowercase, non-alphanumerics → `-`, trimmed of `-`; `"Ocean Blue 24×36\""` → `"ocean-blue-24-36"`.
  - `nextFreeSlug(base: string, taken: string[]): string` — `base`, else `base-2`, `base-3`, …
  - `buildVariantRows(input: ProductInput): VariantRow[]` where `VariantRow = { sku; title; priceAmount: string; inventoryQuantity; isDefault; sortOrder; isActive: true }`. No variants → one row `{ sku: input.sku, title: "Default", priceAmount: input.priceAmount, inventoryQuantity: input.stock, isDefault: true }`. With variants → one row each, `sku = v.sku ?? \`${input.sku}-${slugify(v.title)}\``, first is default, `sortOrder` = index. Duplicate SKUs within the input → throw `InputError("Two sizes have the same SKU")`.
  - `planVariantChanges(existing: { id: string; sku: string }[], next: VariantRow[]): { insert: VariantRow[]; update: { id: string; row: VariantRow }[]; deactivate: string[] }` — matched by SKU.
  - `class InputError extends Error { status = 400 }`

- [ ] **Step 1: Write the failing tests** (one `it` each):
  - `productInputSchema` turns `compareAtAmount: 0` into `null` and rejects `priceAmount: 0`, `stock: -1`, `status: "deleted"`.
  - `slugify` example above; `nextFreeSlug("wall", ["wall","wall-2"])` → `"wall-3"`; `nextFreeSlug("wall", [])` → `"wall"`.
  - `buildVariantRows` with no variants → exactly one default row with the form SKU, price `"1999"` as string, stock.
  - `buildVariantRows` with sizes `["A4","A3"]` and sku `"WP"` → SKUs `["WP-a4","WP-a3"]`, only the first `isDefault`.
  - `buildVariantRows` with two sizes both `sku: "X"` → throws `InputError`.
  - `planVariantChanges([{id:"1",sku:"A"},{id:"2",sku:"B"}], rows for ["B","C"])` → update id `2`, insert `C`, deactivate `["1"]`.
- [ ] **Step 2:** `npx vitest run tests/unit/product-input.test.ts` → FAIL.
- [ ] **Step 3:** Implement the module.
- [ ] **Step 4:** Re-run → PASS.
- [ ] **Step 5:** Stop for review.

---

### Task 4: Product save in one transaction + product routes

**Files:**
- Create: `apps/storefront/app/api/admin/products/_product-save.ts`
- Modify: `apps/storefront/app/api/admin/products/route.ts` (POST)
- Modify: `apps/storefront/app/api/admin/products/[id]/route.ts` (GET, PUT, DELETE)
- Test: `tests/db/product-save.test.ts`

**Interfaces:**
- Consumes: Task 3's `ProductInput`, `productInputSchema`, `buildVariantRows`, `planVariantChanges`, `nextFreeSlug`, `slugify`, `InputError`; Task 1's columns.
- Produces:
  - `createProduct(db: Database, input: ProductInput): Promise<{ id: string; slug: string }>`
  - `updateProduct(db: Database, id: string, input: ProductInput): Promise<{ id: string } | null>` (null = not found)
  - `loadProduct(db: Database, id: string): Promise<ProductDetail | null>` = product row + `images` (sorted by sortOrder) + `variants` (active only, sorted) + `categoryId: string | null` (first link) + `collectionIds: string[]`.
  - `class ConflictError extends Error { status = 409 }` thrown for duplicate SKU (`product_variants_sku_uq`) with message `"SKU already in use: <sku>"`.
  - Routes: `POST /products` → 201 `{ data: { id, slug } }`; `PUT /products/:id` → 200 `{ data: { id } }` / 404; `GET /products/:id` → `{ data: ProductDetail }`; `DELETE` → status `archived`. Errors → `{ error: message }` with `InputError` 400, `ConflictError` 409, zod error 400 with the first issue's path and message.

Behaviour:
- Both writes run inside `db.transaction`. Create: slug = `input.slug ?? slugify(name)` passed through `nextFreeSlug` against existing slugs with that prefix; insert product; insert variant rows; insert `category_products` (if categoryId); insert `collection_products`; insert images with `sortOrder` = index and `storagePath = publicId`.
- Update: never changes slug or `label`; updates name, description, status, priceAmount, compareAtAmount, material, `updatedAt`; applies `planVariantChanges` (deactivate → `isActive=false`); replaces category and collection links; images: delete rows whose URL is not in the input, update `sortOrder`/`isPrimary` on kept ones (keeping `isHover`, `alt`), insert new ones.

- [ ] **Step 1: Write the failing tests** — `tests/db/product-save.test.ts`, using `createDb(LOCAL_DATABASE_URL)` from `@dec-walls/db/client` and `assertLocalUrl` from `./helpers`; each test uses unique names via `short()` and deletes its products in `afterAll`.
  - `creates product, two sizes, category link, collection link and images in one call` — `loadProduct` returns 2 variants, the categoryId, collectionIds, images in order with the primary flagged.
  - `duplicate SKU aborts the whole create` — pre-insert a variant with SKU `X-<short>`; create with that SKU → rejects with `ConflictError`; `select count(*) from products where name = <name>` is 0.
  - `same name twice gets slug-2`.
  - `update keeps slug, label and hover image` — create, then set `label='NEW IN'` and one image `is_hover=true` via SQL; update with a new name and the same image URLs → slug unchanged, label `'NEW IN'`, hover image still `is_hover`.
  - `removing a size deactivates it, not deletes it` — row still exists with `is_active=false`; `loadProduct` no longer returns it.
  - `archive sets status archived` — call the route's DELETE with the admin key.
- [ ] **Step 2:** `npm run test:db -- tests/db/product-save.test.ts` → FAIL.
- [ ] **Step 3:** Implement `_product-save.ts` and wire the routes.
- [ ] **Step 4:** Re-run → PASS; `npm test` → existing unit tests still pass; `npm run typecheck` clean.
- [ ] **Step 5:** Stop for review.

---

### Task 5: Categories write API

**Files:**
- Create: `apps/storefront/app/api/admin/categories/_category-input.ts`
- Modify: `apps/storefront/app/api/admin/categories/route.ts` (GET adds fields, add POST)
- Create: `apps/storefront/app/api/admin/categories/[id]/route.ts` (PUT, DELETE)
- Test: `tests/unit/category-input.test.ts`, `tests/db/category-api.test.ts`

**Interfaces:**
- Consumes: `slugify` (Task 3), `InputError`, `ConflictError` (Tasks 3–4).
- Produces:
  - `categoryInputSchema` → `CategoryInput { name: string(min 1); slug?: string; parentId: uuid | null; status: publish status (default "published"); imageUrl: string | null; imagePublicId: string | null }`.
  - `GET /categories` rows add `status`, `imageUrl`.
  - `POST /categories` → 201 `{ data: row }`; `PUT /categories/:id` → 200 / 404; `DELETE /categories/:id` → 200 `{ data: { id } }`, or 409 `"This category has sub-categories. Move or delete them first."` when any row has `parent_id = id`. Duplicate slug → 409 `"A category with this slug already exists"`. `parentId === id` on PUT → 400.
  - Slug defaults to `slugify(name)`. `imagePublicId` is stored in `image_storage_path`.

- [ ] **Step 1: Write the failing tests**
  - unit: schema defaults status to `published`; rejects empty name; rejects non-uuid parentId.
  - db: `create, rename, delete a category`; `delete refuses when it has a child` (409, both rows remain); `duplicate slug → 409`; `deleting a category keeps its products` (product row remains, link gone).
- [ ] **Step 2:** Run both → FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run both → PASS.
- [ ] **Step 5:** Stop for review.

---

### Task 6: Dashboard services — mapping, uploads, category writes

**Files:**
- Create: `apps/dashboard/src/services/productMapping.js`
- Create: `apps/dashboard/src/services/uploads.js`
- Modify: `apps/dashboard/src/services/products.js` (use the mapping)
- Modify: `apps/dashboard/src/services/categories.js` (real writes; map `status`, `imageUrl`)
- Modify: `tests/unit/crud-dashboard.test.ts` (import the real `fromApiProduct` instead of the copied `mapProduct`; category write tests hit `/api/admin/categories`)
- Test: `tests/unit/dashboard-product-mapping.test.ts`, `tests/unit/dashboard-uploads.test.ts`

**Interfaces:**
- Consumes: API shapes from Tasks 2, 4, 5.
- Produces:
  - `fromApiProduct(p) → FormProduct` — existing `mapProduct` fields plus `categoryId`, `collectionIds`, `images: { url, publicId }[]` (ordered, primary first; `publicId` read from the API image's `storagePath`), `variants: { id, sku, size: title, price: number, stock }[]` (empty when the only variant is the default one).
  - `toApiPayload(form, { collectionIds, variants, images }) → ProductInput` — `price→priceAmount`, `comparePrice→compareAtAmount`, `size→title`, `price→priceAmount`, `stock→inventoryQuantity`; `images` are `{ url, publicId, isPrimary }` objects passed through as given.
  - `uploadImage(file: File, folder: "dec-walls/products" | "dec-walls/categories"): Promise<{ url: string; publicId: string }>` — POST `/api/admin/uploads/sign`, then `fetch` multipart to `https://api.cloudinary.com/v1_1/${cloudName}/image/upload` with `file, api_key, timestamp, signature, folder`; returns `secure_url`, `public_id`; throws `Error(<cloudinary error.message>)` on failure.
  - `uploadImages(items, folder)` — items are `{ url, publicId }` (already saved) or `{ file }` (new); uploads the new ones in order, returns all as `{ url, publicId }` in the same order; rejects if any upload fails.
  - `createCategory(data)`, `updateCategory(id, data)`, `deleteCategory(id)` → `/api/admin/categories[/id]`; errors rethrown with `error.response.data.error` as the message.
  - `apiError(err): string` exported from `products.js` — the API's `error` text, else `err.message`.

- [ ] **Step 1: Write the failing tests**
  - `fromApiProduct` maps two variants to sizes and keeps `categoryId`/`collectionIds`; a product with only a default variant gives `variants: []` and `sku`/`stock` from it.
  - `toApiPayload` → `{ priceAmount: 1999, compareAtAmount: 0, variants: [{ title: "A4", priceAmount: 2500, inventoryQuantity: 3 }] }`; an existing image `{ url: "/bareeze/image-17.jpg", publicId: null }` comes out unchanged.
  - `uploadImages` with `[{url:"a",publicId:"p"}, {file}]` calls sign once and Cloudinary once, returns both in order (mock `axios.post` and `global.fetch`).
  - `uploadImages` rejects with Cloudinary's message when `fetch` returns `{ error: { message: "Invalid Signature" } }`.
  - `createCategory` posts to `/api/admin/categories`.
- [ ] **Step 2:** `npx vitest run tests/unit/dashboard-*.test.ts tests/unit/crud-dashboard.test.ts` → FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Re-run → PASS.
- [ ] **Step 5:** Stop for review.

---

### Task 7: Dashboard pages and forms

**Files:**
- Modify: `apps/dashboard/src/pages/catalog/products/add/index.js`
- Modify: `apps/dashboard/src/pages/catalog/products/edit/[id].js`
- Modify: `apps/dashboard/src/pages/catalog/products/[id].js`
- Modify: `apps/dashboard/src/views/catalog/products/ProductForm.js`
- Modify: `apps/dashboard/src/views/catalog/categories/CategoryManager.js`

**Interfaces:**
- Consumes: Task 6's `getProductById` (returns `fromApiProduct`), `getCategories`, `getCollections`, `toApiPayload`, `uploadImages`, `apiError`, category writes.

- [ ] **Step 1: Capture visual baseline.** Start both apps (`npm run dev:store`, `npm run dev:dashboard`), screenshot `/catalog/products/add`, `/catalog/products/edit/<real id>`, `/catalog/products/<real id>`, `/catalog/categories` (with dialog open). Save to `docs/superpowers/screenshots/2026-11-27-before/`.
- [ ] **Step 2: Pages load in the browser.** Remove `getStaticProps`/`getStaticPaths` and the fake-db import from the three pages. Each page loads with `useEffect` + `router.isReady` and renders the same view component; while loading, render the view's existing empty state (pass `categories=[]`, `collections=[]`; for edit/detail render nothing until the product arrives). Not found → `router.replace('/404')`.
- [ ] **Step 3: ProductForm.**
  - Images state becomes `{ url, publicId }` for saved images and `{ url: <dataURL>, file }` for new drops; thumbnails still use `url`, so markup is unchanged.
  - `onSubmit`: set `submitting`; `uploadImages(ordered images with primary first, "dec-walls/products")`; `toApiPayload(...)`; create/update; on error `toast.error(apiError(err))` and stay on the page; `finally` clear `submitting`. Submit button gets `disabled={submitting}` (no other visual change).
  - Keep variant `id`/`sku` in state so edits keep SKUs.
  - Remove `.required()` from `description` in the yup schema.
  - After create, go to `/catalog/products/${created.id}`.
- [ ] **Step 4: CategoryManager.** On save, upload `imageFile` with `uploadImage(file, "dec-walls/categories")`, send `{ name, slug, parentId, status, imageUrl, imagePublicId }`; on error `toast.error(err.message)` and keep the dialog open; same for delete and quick-add. Remove the "In a real app, upload…" comment.
- [ ] **Step 5:** `npm run build:dashboard` → succeeds.
- [ ] **Step 6:** Stop for review.

---

### Task 8: End-to-end check in the browser

- [ ] **Step 1:** With both apps and local Supabase running, in the dashboard: add a product with sizes A4 and A3 and two images → redirected to detail; images are `res.cloudinary.com` URLs; storefront shows it once published.
- [ ] **Step 2:** Double-click Save on a new product → exactly one product in the list.
- [ ] **Step 3:** Edit price and category → saved; a product with a store-relative image still shows it after save.
- [ ] **Step 4:** Use a SKU that already exists → toast "SKU already in use: …", form stays filled.
- [ ] **Step 5:** Turn off the network during an upload (browser devtools offline) → toast, no product created.
- [ ] **Step 6:** Archive → gone from storefront. Categories: create with image, rename, try deleting a parent (refused message), delete a leaf.
- [ ] **Step 7:** Screenshot the same four screens to `docs/superpowers/screenshots/2026-11-27-after/` and compare with the baseline; only data may differ.
- [ ] **Step 8:** `npm test`, `npm run typecheck`, `npm run test:db` → all pass. Report results to the user; commit only if asked.
