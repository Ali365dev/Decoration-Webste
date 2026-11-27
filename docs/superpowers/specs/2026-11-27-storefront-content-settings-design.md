# Storefront content settings: design

Date: 2026-11-27 · Status: ready for approval · Branch: `version-2`

## Intent

The shop owner should be able to change what the storefront shows (header menu, footer, home page hero, the other home page sections, announcement bar, contact details and social links) from the admin dashboard, without a developer or a redeploy. Today all of that is hard-coded in `packages/domain/src/cms/*` and a few storefront components.

## Goals

- Edit the content of the **existing** home page sections: text, images, links, which collection a product grid or tab shows, and the items inside a section (hero slides, category tiles, trust badges, reviews, showcase sub-links).
- Show/hide and reorder the existing home page sections.
- Edit the header menu (three levels: top item → column → link) and the footer link columns.
- Edit the announcement bar messages, contact details (address, email, phone) and social links.
- A save goes live on the storefront immediately, **including the deployed site** (owner's answer: "Instantly").
- The storefront never goes blank: if the database has no content, or a read fails, it shows today's hard-coded content.

## Non-goals

- No page builder: no new section types, no new pages, no layout or design changes.
- No draft/preview/scheduling. Saves are live.
- No editing of product, collection or category data here (those screens exist already).
- No multi-language content.

## Anti-goals (would make this a failure even if it works)

- The storefront looks different on day one. After the initial copy, the shop must render the same as now.
- A bad edit breaks the whole page. One section with bad data must not take down the page.
- Any data in live is deleted or overwritten without the owner's go-ahead. The 9 existing `banners` rows stay untouched.

## Constraints

- **Live Supabase only** (the owner's rule). Read-only queries are fine; the one-time content copy into live is a write and needs the owner's explicit go-ahead before it runs.
- **No destructive migrations.** Additive only, with a rollback file under `supabase/rollback/`.
- **Admin writes go through the storefront admin API** (`apps/storefront/app/api/admin/*`, protected by `guardAdmin` with the `x-admin-key` header). The dashboard calls them through its proxy `apps/dashboard/src/pages/api/admin/[...path].js`, like products and categories do.
- `guardAdmin` returns 503 in production until staff login exists, so **editing works in local development against the live database, not on the deployed dashboard yet.** The storefront's reads work everywhere. The one exception added to production is the revalidate endpoint described under Admin API.
- Next.js 16 (`apps/storefront`): read `node_modules/next/dist/docs/` before using its APIs. Cache Components is off, so `revalidatePath` and route `revalidate` work as before.
- The dashboard (`apps/dashboard`) is the existing MUI template (pages router, JavaScript). New screens follow the existing catalog screens' patterns and look.
- Other uncommitted work is in progress in `apps/storefront/app/api/admin/*` (the catalog fixes) and the dashboard auth files. Don't revert it. Adding a folder to `UPLOAD_FOLDERS` in `apps/storefront/app/api/admin/uploads/_sign.ts` is the one shared edit.
- Never commit unless the owner asks.

## Approaches considered

- **A. Use the existing CMS tables (chosen).** The home page is one `pages` row (`slug = 'home'`) plus one `page_sections` row per current section (`type` + `data` JSON + `sort_order`). The header and footer use `navigation_menus` + `navigation_items` (one row per link, with `parent_id` and `sort_order`). Site-wide bits go in `content_blocks` rows keyed by name. The tables already exist, are empty, and match the current `CmsBlockDto` / `NavItemDto` shapes.
- **B. One JSON settings document**, edited in one long form. Rejected: it ignores the tables built for this, reordering links is clumsy, and two people saving at once overwrite each other.
- **Direct editing in Supabase Studio.** Rejected: not usable by a shop owner and easy to break.

The owner picked **A, live on save**.

## Data model (all tables exist; no schema change needed)

| Content | Where | Shape |
|---|---|---|
| Home page | `pages` row, `slug = 'home'`, `status = 'published'` | `title`, `seo_title`, `seo_description` |
| Home sections | `page_sections` rows for that page | `type` (one of today's block types), `sort_order`, `data` = today's block data. Show/hide is `data.hidden: true`. |
| Hero slides | inside the `hero` section's `data.slides[]` | `{ image, label, heading, ctaLabel, ctaHref }`, today's 3 slides, currently hard-coded in `cms-block-renderer.tsx` |
| Category tiles | inside the `banner` (category grid) section's `data.tiles[]` | today's `categoryTiles` |
| Header menu | `navigation_menus` key `main` + `navigation_items` | 3 levels via `parent_id`; `label`, `href`, `sort_order`. Today's `mainNav` |
| Footer columns | `navigation_menus` keys `footer-information` and `footer-customer-service` | Today's `INFORMATION_LINKS` / `CUSTOMER_SERVICE_LINKS` in `store-footer.tsx`. The column heading is the menu `name`. |
| Contact and social | `content_blocks` key `site.contact`, `status = 'published'` | `{ address, email, phone, social: [{ network: 'facebook'\|'instagram'\|'youtube', href }] }`. Only the three networks the footer has icons for; anything else is rejected on save *(builder's call; more networks need new icons, a later change)* |
| Announcement bar | the `announcement` section's `data.messages[]` | as today |

`sort_order` is an integer; today's fractional `sortOrder` values (1, 1.5, 2, 4, 4.3, …) are renumbered 10, 20, 30… in the same order during the copy. The `hero` block's current, never-rendered fields (`titleLine1`, `titleLine2`, `imageUrl`, `imageUrlAlt`, `ctaHref`) are dropped once the slides move into `data.slides`.

Section types in scope (today's home page): `announcement`, `hero`, `banner` (category grid), `category_showcase` (×3), `product_grid`, `collection_tabs`, `video_showcase`, `trust_badges`, `customer_reviews`, `newsletter`. The renderer's unused `video` and `rich_text` cases stay as they are.

The `banners` table is left untouched (its 9 rows are an older, partial copy of the hero slides and tiles).

## Storefront (reads)

- `packages/domain/src/cms`: `getPublishedPageBySlug('home')`, `getMainNavigation()`, `getFooterLinks()` and a new `getSiteContact()` read the database when `getDb()` is available. They fall back to today's hard-coded values when there is no database, no row, or the query throws (log the error, like `resolveProductGridBlock` now does). Sections with `data.hidden` are left out.
- `cms-block-renderer.tsx`: the `hero` case renders `block.data.slides`, falling back to today's 3 slides when it's empty. Each section renders inside its own error boundary (or its data is validated before rendering), so one bad section is skipped instead of breaking the page.
- `store-footer.tsx`: render the link columns and contact/social from props instead of its constants, keeping the constants as fallback. Social icons stay as built-in SVGs chosen by `network`. Note: today `StoreFooter` ignores its `links` prop and `getFooterLinks()` returns columns the footer never shows (`customerCare`/`information`/`policies`). The copy uses the links the footer actually renders (its own constants), and `getFooterLinks()` is reshaped to return those two columns. The cart and account pages call it too.
- Freshness: the home page already has `revalidate = 300`. The `(store)` layout (header/footer) gets the same. Each admin save also calls `revalidatePath('/', 'layout')`, so changes show at once.

## Admin API (writes, in `apps/storefront/app/api/admin/`)

New routes, all behind `guardAdmin`, validated with zod, following the response helpers in `_respond.ts`:

- `GET/PUT /api/admin/storefront/home`: page SEO fields plus the ordered section list. PUT replaces the ordering, hidden flags and each section's `data` in one transaction. It validates each section's `data` against a per-type zod schema. It never changes a section's `type`, and never adds or removes sections.
- `GET/PUT /api/admin/storefront/menus/:key` (`main`, `footer-information`, `footer-customer-service`): the full nested tree. PUT replaces that menu's items in one transaction; deleting and re-inserting that one menu's items is fine. Max depth is 3 for `main` and 1 for footers.
- `GET/PUT /api/admin/storefront/contact`: the `site.contact` block.
- After every successful PUT: `revalidatePath('/', 'layout')` on the storefront that handled it (usually the local one), **then** a call to the deployed storefront's revalidate endpoint (below).
- **Simultaneous saves** *(builder's call)*: each GET returns a `version` (a hash of the content as loaded) and each PUT sends it back. If the stored content has changed since, the PUT is refused with 409 and the dashboard says "Someone else saved changes. Reload to see them." No schema change is needed.
- **Instant refresh of the deployed site** (owner's decision): a new route `POST /api/revalidate` on the storefront. It is reachable in production and is the only new thing that is.
  - It is protected by its own secret, `REVALIDATE_SECRET`, sent in a header and compared in constant time. This is not `ADMIN_API_KEY`, so a leak of one doesn't expose the other.
  - It takes no input. It only calls `revalidatePath('/', 'layout')` and returns 204, so it can't read or change data; the worst misuse is forcing extra page rebuilds. It responds 404 when the secret isn't configured.
  - After saving, the admin API calls `${STOREFRONT_PUBLIC_URL}/api/revalidate` with a short timeout. If that fails, the save still stands and the dashboard shows "Saved. The live site will update within 5 minutes." (`revalidate = 300` stays as the safety net.)
  - The owner sets `REVALIDATE_SECRET` in the Vercel project and in the local `.env.local`, and sets `STOREFRONT_PUBLIC_URL` locally. The builder lists these steps and never sets them in Vercel itself.
- Uploads: add `dec-walls/storefront` to `UPLOAD_FOLDERS`; the dashboard reuses the existing signed Cloudinary upload.

## Dashboard (`apps/dashboard`)

A new **Storefront** group in the Settings navigation (`src/navigation/vertical/index.js`) with four screens:

1. **Home page**: the list of sections in their current order. Each row has the section name, a show/hide switch, and up/down buttons. Expanding a row opens a small form for that section type. Repeating items (slides, tiles, badges, reviews, showcase links, tabs) can be added, removed and reordered inside a section. Collection fields are a dropdown of real collections (from the existing collections service), plus the special `new-in` and `sale`. The category showcase sub-links are collection pickers too, not free text, because the renderer uses the last part of each link as the collection whose products it shows. One "Save" button for the page.
2. **Header menu**: an editable tree (top items → columns → links) with label, link, add, remove, and up/down buttons.
3. **Footer**: the two link columns (heading plus links) and, on the same screen, contact details and social links.
4. Announcement bar messages are edited inside **Home page** (it's a section).

**UI quality (the owner's request):** design and finish the four screens with the `unslop` skill. Take its direction from the existing dashboard theme, so it runs as a polish pass: no new palette or fonts. Also check them with `design:ux-copy` for labels, help text, empty states and error messages, and with `design:accessibility-review` for keyboard use, focus, contrast and form errors. Every section form shows a small, true-to-life preview of how that section looks on the storefront (for example the hero slide image with its heading over it), so the owner can see what they're editing.

Image fields show a preview, an upload button (Cloudinary) and a plain URL field, so the existing `/home/*.jpg` paths keep working.
Links are free text but must start with `/` or `https://`.

The existing fake Settings tabs (General, Store, …) are out of scope and stay as they are.

## One-time content copy into live

A script (`packages/db/src/seed-cms.ts` or similar) builds the rows from today's hard-coded content (`homePage` blocks with the renderer's hero slides moved into `data.slides`, `categoryTiles`, `mainNav`, the footer constants, `CONTACT`, `SOCIAL`). It inserts them only where the target rows don't exist yet: it never overwrites, and is safe to re-run. **It runs against live only after the owner says yes.** Afterwards, compare the home page, header and footer with how they looked before the copy.

## Testing

- Unit tests: the per-type zod schemas, the nav tree ↔ rows conversion, and the fallback behaviour (empty DB → hard-coded content).
- DB tests in `tests/db` follow the existing pattern, against the local rehearsal setup. Per the owner's rule, nothing runs against live without asking.
- Browser check: edit a hero slide heading, a menu label and the phone number in the dashboard; each shows on the storefront right after saving. Hide a section → it disappears; reorder → order changes. Then put the original values back.

## Left to the builder

- File and component names, the exact form layouts within the MUI template, and how the per-type forms are split.
- Whether "one bad section is skipped" is done with a React error boundary or by validating before render.
- Exact zod limits (lengths, number of slides, and so on), within reason.
