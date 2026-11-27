# Design: fix dashboard Add/Edit Product and Categories

Date: 2026-11-27. Status: waiting for approval.

## Intent

Add Product, Edit Product and the Categories page in the dashboard don't work against the real database. This makes them work end to end, and saves product and category images to Cloudinary.

## Goals

- Add Product creates a product, its size variants (SKU, price, stock), its category and collection links and its images, all in one step.
- Edit Product opens any real product, shows the values it already has, and saves changes to the same parts.
- Categories can be created, edited and deleted, including parent, status and image.
- When a save fails, the form shows the API's message (for example "slug already exists"), not nothing.
- Images upload to Cloudinary and are saved as `https://res.cloudinary.com/...` URLs.

## Not in this design

- Any visual change to the dashboard (design freeze). Wiring and logic only.
- Writing to collections (only linking products to existing collections).
- Staff login and production use of the admin API (it stays off in production).
- Deleting images from Cloudinary when they are removed from a product (they are only unlinked).

## Would count as failure

- A failed save leaves half a product (a product row without its variants or links).
- The Cloudinary secret or admin key reaches the browser.
- Data loss: deleting a product hard-deletes it, or a save wipes fields the form doesn't show (label, hover image).
- Any screen looks different.

## Approaches (images)

| Approach | Trade-off | Decision |
|---|---|---|
| A. Direct signed upload: the storefront signs, the browser uploads straight to Cloudinary | No new package (Node `crypto`); big files skip our servers and the JSON-only proxy | **Chosen** |
| B. Upload through the storefront server | Proxy would need multipart support; body size limits; slower | Not chosen |
| C. Unsigned upload preset | Anyone with the preset name can upload to the account | Rejected |

The rest of the fixes have one sensible way, described below.

## How it works

### Database

No database change. The Supabase migrations already added `products.material`, `categories.status`, `categories.image_url`, `categories.image_storage_path`, `product_images.storage_path` and the `archived` status. The Drizzle schema in `packages/db/src/schema` is behind; add those fields to it so the code can read and write them.

### Images (Cloudinary)

- New storefront route `POST /api/admin/uploads/sign`, behind the existing admin-key guard. Returns `{ cloudName, apiKey, timestamp, signature, folder }`, signed with SHA-1 over `folder` and `timestamp` using `CLOUDINARY_API_SECRET`. Folders: `dec-walls/products`, `dec-walls/categories`.
- The dashboard proxy's route list allows `uploads/sign`.
- In the dashboard, a small helper `uploadImage(file, folder)` gets a signature and posts the file to `https://api.cloudinary.com/v1_1/<cloud>/image/upload`, returning `{ url: secure_url, publicId: public_id }`.
- The product form and category dialog upload on save (not on drop), so dropping and then cancelling uploads nothing. Previews keep using local data URLs as now.
- The Cloudinary `public_id` is saved in `storage_path` / `image_storage_path`.
- `res.cloudinary.com` is added to the storefront's allowed image hosts so the store can show these images.

### Products API (storefront `app/api/admin/products`)

- `POST` and `PUT` accept one body: product fields, `categoryId`, `collectionIds`, `variants[]`, `images[]` (url, publicId, isPrimary, sortOrder). They run in one database transaction.
- `POST` creates a slug from the name when none is sent; if it is taken, adds `-2`, `-3`, and so on.
- A product with no sizes gets one default variant from the form's SKU, price and stock.
- `PUT` keeps the slug, replaces variants by SKU (updates existing ones, adds new ones, marks removed ones inactive rather than deleting them, because orders may point at them), replaces category/collection links, and replaces the image list while keeping the hover-image flag on images that stay. Fields not sent (label, compare-at price) are left alone.
- Inputs are validated (price > 0, stock ≥ 0, known status, unique SKU). Errors return 400/409 with a message.
- `GET /products/:id` also returns `categoryId` and `collectionIds`.
- "Delete" sets status to `archived` (today it sets `scheduled` by mistake).

### Categories API (storefront `app/api/admin/categories`)

- Add `POST`, `PUT /:id`, `DELETE /:id`. List returns `status` and `imageUrl`.
- Delete refuses with a clear message if the category has child categories. Product links go with it (the table already cascades). The product itself is not touched.
- Slug is unique; a duplicate returns 409.

### Dashboard

- Add and Edit Product pages stop using `getStaticProps`/`getStaticPaths` (they call a relative URL on the server and only know fake IDs). They load the product, categories and collections in the browser, with the same layout while loading.
- The product detail page (`catalog/products/[id].js`) gets the same fix, because it has the same fake-ID problem.
- `services/products.js` maps form fields to API fields (`price` → `priceAmount`, etc.) and maps `categoryId`, `collectionIds` and variants back when reading.
- `services/categories.js` write functions call the new API in place of the fake endpoints.
- Form submit catches errors and shows them with the existing toast; the button can't be double-submitted.
- The yup rule making description required is dropped (imported products have none) — already agreed in the earlier design.

## How we check it

- Both apps build; storefront type check and existing tests pass.
- New tests: sign route refuses without the admin key and returns a valid signature; product create with variants and links is all-or-nothing; duplicate slug/SKU messages; category delete with children refused.
- In the browser with both apps running: add a product with two sizes and two images → appears with Cloudinary images; edit price and category → saved; archive → gone from store; create, edit (with image) and delete a category.
- Screenshots before and after to confirm nothing looks different.

## Left to the builder

File layout, helper names, exact request/response shapes, message wording, test structure.
