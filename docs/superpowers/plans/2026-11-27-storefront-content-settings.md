# Storefront Content Settings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The shop owner edits the header menu, footer, contact and social links, and the content, order and visibility of the existing home page sections in the dashboard. Saves go live on the storefront at once, including the deployed site.

**Architecture:** Content lives in the existing CMS tables: `pages` + `page_sections`, `navigation_menus` + `navigation_items`, and `content_blocks`. Shared zod schemas and today's hard-coded content (the defaults) live in packages. The storefront reads the database and falls back to the defaults. The storefront admin API writes, with a version check, then refreshes the local and deployed caches. The dashboard gets four Settings → Storefront screens on top of a new service file.

**Tech Stack:** Next.js 16 app router (storefront, TypeScript), Next.js pages router + MUI (dashboard, JavaScript), drizzle-orm on Supabase Postgres, zod v4 (`zod/v4`), vitest.

**Spec:** `docs/superpowers/specs/2026-11-27-storefront-content-settings-design.md`

## Global Constraints

- **Never commit.** The owner's rule replaces this skill's "Commit" steps; each task ends with its checks instead.
- **Live Supabase only.** Never use the local Docker database for manual checks. Read-only queries on live are fine. Any write to live (the content copy in Task 7, test edits in Task 10) needs the owner's yes first.
- **No destructive or schema migrations.** The tables already exist; show/hide is `data.hidden: true` on a `page_sections` row.
- **Never touch the 9 existing `banners` rows.**
- **Before using any Next.js API, read `node_modules/next/dist/docs/`.** This version has breaking changes.
- **Don't revert other uncommitted work** in `apps/storefront/app/api/admin/*` or the dashboard auth files. The only shared edit is adding `"dec-walls/storefront"` to `UPLOAD_FOLDERS` in `apps/storefront/app/api/admin/uploads/_sign.ts`.
- Section types in scope: `announcement`, `hero`, `banner`, `category_showcase`, `product_grid`, `collection_tabs`, `video_showcase`, `trust_badges`, `customer_reviews`, `newsletter`.
- Menu keys: `main` (up to 3 levels), `footer-information`, `footer-customer-service` (1 level each). The content block key is `site.contact`.
- Social networks: `facebook`, `instagram`, `youtube` only.
- Links must start with `/` or `https://`.
- Copy for a failed live refresh: "Saved. The live site will update within 5 minutes." Copy for a conflict: "Someone else saved changes. Reload to see them."
- Environment: `REVALIDATE_SECRET` on both storefronts, and `STOREFRONT_PUBLIC_URL` locally. The owner sets them in Vercel; never change Vercel settings.

## Review Focus

1. **Bad section data in the database** (a hero with no slides, a field of the wrong type, an unknown `type`): that one section is skipped, or uses its default, and the rest of the page renders. Test in Task 3.
2. **Invalid menu edits** (4 levels deep, an empty label, a link like `javascript:alert(1)` or `www.x.com`): rejected on save with a message that names the field, and nothing is written. Test in Task 1.
3. **Stale save from a second tab:** refused with 409, the newer content survives, and the dashboard shows the conflict copy. Tests in Tasks 2, 6 and 8.
4. **Live refresh unreachable or the secret missing:** the save still succeeds, and the response says the refresh failed so the dashboard can show the fallback copy. Tests in Tasks 5 and 6.
5. **Re-running the content copy** after the owner has edited content: nothing is overwritten or duplicated. Test in Task 7.

---

### Task 1: Content schemas and defaults

**Files:**
- Create: `packages/validation/src/cms.ts`. Add `"./cms": "./src/cms.ts"` to `packages/validation/package.json` exports.
- Create: `packages/domain/src/cms/defaults.ts`. Move today's hard-coded content here, unchanged: the `homePage` blocks, `categoryTiles`, the 3 hero slides from `apps/storefront/components/cms/cms-block-renderer.tsx:193-215`, the footer constants and `CONTACT`/`SOCIAL` hrefs from `apps/storefront/components/layout/store-footer.tsx`, and `mainNav` (re-exported from `navigation.ts`).
- Modify: `packages/domain/src/cms/index.ts` to import its content from `defaults.ts`.
- Test: `tests/unit/cms-schemas.test.ts`

**Interfaces:**
- Produces (validation):
  - `linkHref`: a zod string matching `^(\/(?!\/)|https:\/\/)`.
  - `sectionDataSchemas: Record<SectionType, ZodType>`, with one schema per in-scope type. Every one allows an optional `hidden: boolean`. `hero` requires `slides: { image, label, heading, ctaLabel, ctaHref }[]` with 1–8 items.
  - `SectionType`.
  - `navItemSchema` (recursive `{ label, href, children }`).
  - `menuSchema(key: MenuKey)`, which enforces each key's depth.
  - `MenuKey`.
  - `contactSchema` (`{ address, email, phone, social: { network: "facebook"|"instagram"|"youtube", href }[] }`).
  - `parseSection(type: string, data: unknown): { ok: true; data } | { ok: false; error: string }`.
- Produces (domain defaults):
  - `defaultHomePage: CmsPageDto`. Its hero block's `data` is `{ slides: [...3] }`. `sortOrder` is renumbered 10, 20, 30… in today's sort order.
  - `defaultMenus: Record<MenuKey, { name: string; items: NavItemDto[] }>`. The footer names are "Information" and "Customer Service".
  - `defaultContact: SiteContact`.
  - `type SiteContact`.

- [ ] **Step 1: Write the failing tests.**
  - `every default section passes its schema`: loop over `defaultHomePage.blocks`, `parseSection(b.type, b.data).ok === true`.
  - `default menus pass menuSchema`, and `defaultContact passes contactSchema`.
  - `rejects a 4-level main menu`, `rejects empty label`, `rejects href "javascript:alert(1)" and "www.x.com"`. The error message contains the field path.
  - `rejects unknown social network "tiktok"`.
  - `default sections keep today's order`: the block types in order equal `["hero","announcement","banner","category_showcase","category_showcase","category_showcase","product_grid","collection_tabs","video_showcase","trust_badges","customer_reviews","newsletter"]`. This is today's order by `sortOrder` (1, 1.5, 2, 4, 4.3, 4.6, 4.9, 5, 6, 9, 10, 11).
- [ ] **Step 2: Run `npx vitest run tests/unit/cms-schemas.test.ts`.** Expect FAIL (module not found).
- [ ] **Step 3: Implement the schemas, then move the defaults.** Defaults are data only; `cms/index.ts` keeps its exported functions.
- [ ] **Step 4: Run the test (PASS), then `npx vitest run` (all pass) and `npx tsc --noEmit -p apps/storefront`.** Expect no new errors outside `app/api/admin`.

### Task 2: Navigation rows ↔ tree, and content versions

**Files:**
- Create: `packages/domain/src/cms/rows.ts`
- Test: `tests/unit/cms-rows.test.ts`

**Interfaces:**
- Produces:
  - `type NavRow = { id: string; parentId: string | null; label: string; href: string; sortOrder: number }`
  - `rowsToNavTree(rows: NavRow[]): NavItemDto[]`, ordered by `sortOrder`; orphan rows are dropped.
  - `navTreeToRows(menuId: string, items: NavItemDto[], newId: () => string): (NavRow & { menuId: string })[]`, where `sortOrder` is the index × 10.
  - `contentVersion(value: unknown): string`, a sha256 hex of stable-key JSON.

- [ ] **Step 1: Write the failing tests.**
  - The round trip `rowsToNavTree(navTreeToRows(id, defaultMenus.main.items, seqId))` deep-equals the input, ignoring `id`.
  - Rows given in shuffled order come back in `sortOrder` order.
  - `contentVersion({a:1,b:2}) === contentVersion({b:2,a:1})`, and it changes when any nested value changes.
- [ ] **Step 2: Run it.** Expect FAIL.
- [ ] **Step 3: Implement.** `contentVersion` uses `node:crypto` `createHash("sha256")` over JSON with sorted keys.
- [ ] **Step 4: Run it.** Expect PASS.

### Task 3: Storefront reads from the database, with fallback

**Files:**
- Modify: `packages/domain/src/cms/index.ts` (`getPublishedPageBySlug`, `getMainNavigation`, `getFooterLinks`, new `getSiteContact`)
- Create: `packages/domain/src/cms/load.ts` (the database queries)
- Test: `tests/unit/cms-load.test.ts`

**Interfaces:**
- Consumes: `parseSection`, `menuSchema`, `contactSchema` (Task 1); `rowsToNavTree` (Task 2); `defaultHomePage`, `defaultMenus`, `defaultContact`.
- Produces:
  - `getPublishedPageBySlug("home"): Promise<CmsPageDto>`. Sections come from the database when a published `home` row exists, otherwise from `defaultHomePage`. Hidden sections are excluded. A section that fails `parseSection` is skipped with a `console.error`.
  - `getMainNavigation(): Promise<NavItemDto[]>`.
  - `getFooterLinks(): Promise<{ information: FooterColumn; customerService: FooterColumn }>`, where `type FooterColumn = { title: string; links: { label: string; href: string }[] }`.
  - `getSiteContact(): Promise<SiteContact>`.
  - `buildHomePage(pageRow, sectionRows): CmsPageDto`, a pure function the tests use.
- All four functions return the defaults when `getDb()` is null, the rows are missing, or the query throws.

- [ ] **Step 1: Write the failing tests** (against the pure `buildHomePage` and against the no-database path):
  - `with no DB returns defaults`: getPublishedPageBySlug, getMainNavigation, getFooterLinks and getSiteContact each equal their defaults.
  - `skips hidden sections`.
  - `skips a section with bad data and keeps the rest`: a hero `{ slides: [] }` plus a valid newsletter section give 1 block, which is the newsletter. *(Review Focus 1)*
  - `skips unknown section type "carousel"`.
- [ ] **Step 2: Run it.** Expect FAIL.
- [ ] **Step 3: Implement the queries in `load.ts`** with drizzle over `pages`, `pageSections`, `navigationMenus`, `navigationItems` and `contentBlocks`. Wrap each query in try/catch and fall back to the defaults.
- [ ] **Step 4: Run it, then the full suite.** Expect PASS.

### Task 4: Storefront rendering uses the data

**Files:**
- Modify: `apps/storefront/components/cms/cms-block-renderer.tsx` (the `hero` case renders `block.data.slides`)
- Modify: `apps/storefront/components/layout/store-footer.tsx` (props `{ links: { information: FooterColumn; customerService: FooterColumn }; contact: SiteContact }`; no constants)
- Modify: `apps/storefront/app/(store)/layout.tsx` (add `export const revalidate = 300`; pass `getSiteContact()`)
- Modify: the other `StoreFooter` callers, `app/(bare)/cart/page.tsx` and `app/(bare)/account/page.tsx`

**Interfaces:**
- Consumes: Task 3's functions and types.

- [ ] **Step 1: Read `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/02-route-segment-config/index.md`** and the caching-without-cache-components guide, to confirm `revalidate` on a layout.
- [ ] **Step 2: Implement.** The footer column headings come from `FooterColumn.title`. Social icons are picked by `network` from the existing SVGs.
- [ ] **Step 3: Check with the database still empty.** `curl -s localhost:3000/` is a 200, and the home HTML has the same section headings and the same 3 hero headings ("Wall Art", "Bedding", "Home Decor") as before. Footer: "Information", "Customer Service", the phone "+92 300 0606662". Run `npx tsc --noEmit -p apps/storefront` with no new errors.

### Task 5: Live-site refresh endpoint and notifier

**Files:**
- Create: `apps/storefront/app/api/revalidate/route.ts`
- Create: `apps/storefront/lib/live-refresh.ts`
- Test: `tests/unit/live-refresh.test.ts`

**Interfaces:**
- Produces:
  - `POST /api/revalidate` with header `x-revalidate-secret`:
    - 404 if `REVALIDATE_SECRET` is unset.
    - 401 if the secret doesn't match (`timingSafeEqual` on equal-length buffers; a different length means no match).
    - Otherwise it calls `revalidatePath("/", "layout")` and returns 204.
    - It reads no body.
  - `secretMatches(given: string | null, expected: string | undefined): boolean`.
  - `notifyLiveSite(fetchImpl = fetch): Promise<"ok" | "skipped" | "failed">`:
    - `"skipped"` when `STOREFRONT_PUBLIC_URL` or `REVALIDATE_SECRET` is unset.
    - Otherwise a POST with a 3000 ms `AbortSignal.timeout`.
    - `"ok"` on 204, `"failed"` on any other status or an error.

- [ ] **Step 1: Write the failing tests.**
  - `secretMatches`: true for equal; false for different, null, a different length, or an undefined expected.
  - `notifyLiveSite`: `"skipped"` without env; `"ok"` when the mocked fetch returns 204; `"failed"` on 500; `"failed"` when the fetch rejects. *(Review Focus 4)*
- [ ] **Step 2: Run it.** Expect FAIL.
- [ ] **Step 3: Implement both.**
- [ ] **Step 4: Run it.** Expect PASS. Then `curl -s -o /dev/null -w "%{http_code}" -X POST localhost:3000/api/revalidate` gives 404 while the secret is unset.

### Task 6: Admin API for storefront content

**Files:**
- Create: `apps/storefront/app/api/admin/storefront/home/route.ts` (GET, PUT)
- Create: `apps/storefront/app/api/admin/storefront/menus/[key]/route.ts` (GET, PUT)
- Create: `apps/storefront/app/api/admin/storefront/contact/route.ts` (GET, PUT)
- Create: `apps/storefront/app/api/admin/storefront/_save.ts` (shared helpers)
- Modify: `apps/storefront/app/api/admin/uploads/_sign.ts`, adding `"dec-walls/storefront"` to `UPLOAD_FOLDERS`
- Test: `tests/unit/storefront-admin-input.test.ts`

**Interfaces:**
- Consumes: Task 1 schemas, Task 2 `contentVersion`/`navTreeToRows`/`rowsToNavTree`, Task 3 loaders, Task 5 `notifyLiveSite`, `guardAdmin`, `errorResponse`.
- Produces:
  - `GET /api/admin/storefront/home` returns `{ data: { seoTitle, seoDescription, sections: { id, type, sortOrder, hidden, data }[] }, version }`.
  - `PUT` body `{ version, seoTitle, seoDescription, sections: { id, hidden, data }[] }`. The array order is the new order.
  - `GET /api/admin/storefront/menus/:key` returns `{ data: { name, items: NavItemDto[] }, version }`. `PUT` body `{ version, name, items }`.
  - `GET /api/admin/storefront/contact` returns `{ data: SiteContact, version }`. `PUT` body `{ version, ...SiteContact }`.
  - Every successful PUT returns `{ data, version, liveRefresh: "ok"|"skipped"|"failed" }`.
  - A version mismatch gives 409 `{ error: "Someone else saved changes. Reload to see them." }`.
  - When nothing is stored yet, GET returns the defaults, and PUT creates the rows.
  - `parseHomeUpdate(body, existing: { id: string; type: string }[]): HomeUpdate`. It throws a 400 error when a section id is unknown, missing, duplicated, or its `type` differs, and when data fails `parseSection`.

- [ ] **Step 1: Write the failing tests for `parseHomeUpdate` and the menu PUT parsing:**
  - `accepts a reorder and hide`.
  - `rejects an added section id`, `rejects a dropped section`.
  - `rejects bad hero data with field path in message`.
  - `rejects 4-level main menu`. *(Review Focus 2)*
  - `stale version is a conflict`: a pure `assertVersion(stored, given)` throws `{ status: 409 }`. *(Review Focus 3)*
- [ ] **Step 2: Run it.** Expect FAIL.
- [ ] **Step 3: Implement the routes.**
  - Each PUT runs in `db.transaction`. It reads the current content, compares `contentVersion` (409 on mismatch), then writes.
    - Home: update the `pages` SEO fields, and each `page_sections` row's `sort_order` (index × 10) and `data` (with `hidden`).
    - Menus: delete then insert that menu's `navigation_items` only.
    - Contact: upsert `content_blocks` key `site.contact` with status `published`.
  - After the commit, call `revalidatePath("/", "layout")`, then `await notifyLiveSite()`.
- [ ] **Step 4: Run the tests (PASS), then smoke-test the GETs.** `curl -s -H "x-admin-key: $ADMIN_API_KEY" localhost:3000/api/admin/storefront/home | head -c 300` shows the defaults with a version. No PUT against live yet.

### Task 7: One-time content copy (insert-if-missing)

**Files:**
- Create: `packages/db/src/seed-cms.ts` (CLI: `npx tsx packages/db/src/seed-cms.ts [--apply]`, a dry run by default)
- Create: `packages/domain/src/cms/seed-rows.ts` (a pure row builder)
- Test: `tests/unit/cms-seed-rows.test.ts`

**Interfaces:**
- Consumes: the Task 1 defaults and Task 2 `navTreeToRows`.
- Produces: `planCmsSeed(existing: { homePage: boolean; menus: MenuKey[]; contact: boolean }): { pages; sections; menus; items; blocks }`, listing only what's missing.

- [ ] **Step 1: Write the failing tests.**
  - `plans everything when empty`: 1 page, 12 sections, 3 menus, and items equal to the defaults' flattened counts, plus 1 block.
  - `plans nothing when all exist`. *(Review Focus 5)*
  - `plans only the missing footer menu`.
- [ ] **Step 2: Run it.** Expect FAIL.
- [ ] **Step 3: Implement `planCmsSeed`, and the CLI on top of it.**
  - The CLI checks what exists, prints the plan, and writes only with `--apply`.
  - It writes in one transaction with `on conflict do nothing` on the unique keys (`pages.slug`, `navigation_menus.key`, `content_blocks.key`).
  - It never touches `banners`.
- [ ] **Step 4: Run the tests (PASS), then the dry run against live.** It's read-only; expect a plan of 1 page, 12 sections, 3 menus, N items and 1 block.
- [ ] **Step 5: STOP. Ask the owner for permission to run `--apply` against live.** Show them the dry-run output. Only after a yes, run it. Then:
  - Re-run the dry run; expect "nothing to do".
  - `curl localhost:3000/` shows the same hero, footer and phone as in Task 4 Step 3.

### Task 8: Dashboard service

**Files:**
- Create: `apps/dashboard/src/services/storefront.js`
- Test: `tests/unit/dashboard-storefront.test.ts` (mock axios like `tests/unit/dashboard-categories.test.ts`)

**Interfaces:**
- Produces:
  - `getHomeContent()` and `saveHomeContent(payload)`
  - `getMenu(key)` and `saveMenu(key, payload)`
  - `getContact()` and `saveContact(payload)`
  - Each `save*` resolves to `{ data, version, notice }`. `notice` is `null` when `liveRefresh` is `"ok"` or `"skipped"`, and "Saved. The live site will update within 5 minutes." when it's `"failed"`.
  - On a 409, `save*` throws `ConflictError` (exported) with the server's message.

- [ ] **Step 1: Write the failing tests.**
  - The `save*` functions PUT to `/api/admin/storefront/...` with the version.
  - `liveRefresh: "failed"` gives the notice copy.
  - A 409 response throws `ConflictError` whose message is the conflict copy. *(Review Focus 3)*
- [ ] **Step 2: Run it.** Expect FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run it.** Expect PASS.

### Task 9: Dashboard screens

**Files:**
- Modify: `apps/dashboard/src/navigation/vertical/index.js`. Add a "Storefront" group after "Settings" with Home page `/settings/storefront/home`, Header menu `/settings/storefront/header`, and Footer & contact `/settings/storefront/footer`.
- Create: `apps/dashboard/src/pages/settings/storefront/{home,header,footer}.js`
- Create: `apps/dashboard/src/views/settings/storefront/`:
  - `HomeSections.js`: the list with show/hide switches, up/down buttons, an expand row, and one Save button.
  - `sections/*.js`: one form per section type, each with its own preview.
  - `MenuTreeEditor.js`
  - `FooterEditor.js`
  - `ImageField.js`: preview, upload via `uploadImage(file, "dec-walls/storefront")`, and a URL field.
  - `CollectionSelect.js`: real collections from `getCollections()`, plus `new-in` and `sale`.
  - `LinkField.js`

**Interfaces:**
- Consumes: Task 8's service and the existing `uploadImage` and `getCollections`.

- [ ] **Step 1: Load the `unslop` skill. Write the direction from the existing dashboard theme (polish mode: no new palette or fonts), then build the screens.**
  - The category showcase sub-links use `CollectionSelect`. A sub-link stores `{ label, href: "/collections/<slug>" }`.
  - The Save button is disabled while saving.
  - Success, notice and conflict messages show in the existing snackbar/alert pattern.
  - Leaving a screen with unsaved changes asks for confirmation.
- [ ] **Step 2: Run the `design:ux-copy` skill** on every label, helper text, empty state and error on the four screens, and apply its fixes.
- [ ] **Step 3: Run the `design:accessibility-review` skill:** keyboard reorder (up/down buttons reachable by Tab), visible focus, labels for every input, and errors tied to their fields with `aria-describedby`. Apply its fixes.
- [ ] **Step 4: Check in the Browser pane** at `localhost:3001/settings/storefront/home`, header and footer. Every screen loads the content from Task 7, with no console errors. Take screenshots.

### Task 10: End-to-end check

- [ ] **Step 1: STOP. Ask the owner for permission to make test edits on live.**
  - The edits: one hero heading, one menu label, and the phone number.
  - Each will be put back afterwards.
- [ ] **Step 2: After a yes, make the edits.**
  - In the dashboard, change the hero slide 1 heading, the "HOME DECOR" menu label and the phone, then save each.
  - On `localhost:3000`, each change shows right after saving, without a restart.
  - Hide the newsletter section and it's gone. Move trust badges up one and the order changes.
- [ ] **Step 3: Check the stale save.** Open the home screen in two tabs. Save in tab A, then save in tab B. Tab B shows the conflict copy, and A's change stands.
- [ ] **Step 4: Restore every original value, and confirm the storefront matches its Task 4 Step 3 state.**
- [ ] **Step 5: Run `npx vitest run` and `npx tsc --noEmit -p apps/storefront`.** Report the results, the screenshots, and the env steps for the owner: set `REVALIDATE_SECRET` in Vercel and `.env.local`, and `STOREFRONT_PUBLIC_URL` in `.env.local`.
