# Frontend Implementation Roadmap

8 phases per the master prompt. Phase 1 is complete (this audit). Phases 2–8 are planned but **not started** — awaiting approval per the "never automatically proceed to the next phase" rule.

## Phase 1 — Audit and component reuse mapping ✅ DONE
Deliverables: `PROJECT_AUDIT.md`, `EXISTING_PAGES.md`, `COMPONENT_REUSE_MAP.md`, `DUPLICATE_AND_DEMO_CONTENT.md`, `ROUTE_RESTRUCTURE_PLAN.md`, `ECOMMERCE_WORKFLOW_MAP.md`, this file. No application code touched.

## Phase 2 — Application organization and navigation
- Rewrite `src/navigation/vertical/index.js` and `src/navigation/horizontal/index.js` to the target structure in `ROUTE_RESTRUCTURE_PLAN.md`.
- Remove the ~70 demo/showcase/duplicate routes from both nav files (keep underlying view files on disk, per "deprecate only after checking dependencies").
- Rename `/apps/invoice/*` routes to `/sales/orders/*`, `/apps/user/*` to `/customers/*` and `/team/staff`, `/apps/roles` to `/team/roles`, `/apps/permissions` to `/team/permissions` (verify no hardcoded path references break in `_app.js`, ACL config, or breadcrumb helpers before renaming).
- Update `src/configs/auth.js`-adjacent navigation/ACL subject names if they reference old route names.
- Verify `src/@fake-db/server-side-menu/{vertical,horizontal}.js` (server-rendered menu demo data) doesn't need to mirror the same structure if that demo page stays out of nav.

## Phase 3 — Dashboard and analytics
- Rewire `views/dashboards/ecommerce/*` widgets to pull from the new mock Order/Product data (Phase 4/5 must exist first for real numbers — acceptable to stub with placeholder aggregation functions initially).
- Apply PKR currency formatting (`Rs.` symbol, `Asia/Karachi` date/time) across all dashboard widgets.
- Repurpose `views/dashboards/analytics/*` widgets per `COMPONENT_REUSE_MAP.md` (Sales-by-category, Top products, Customer growth).

## Phase 4 — Product catalog and inventory
- Define TypeScript/JS interfaces (or JSDoc types, matching current JS-only codebase) for `Product`, `Category`, `Collection`, `Review`, `InventoryRecord`, `StockMovement`.
- Create `src/@fake-db/apps/products.js`, `categories.js`, `collections.js`, `reviews.js`, `inventory.js` following the existing `mock.onGet/onPost` pattern seen in `invoice.js`/`userList.js`.
- Create a thin service layer (e.g. `src/services/products.js`) wrapping axios calls to these mock endpoints, so the UI never imports fake-db directly — this is what Phase 7's "centralized mock data" requirement needs structurally.
- Build Products list, Add/Edit Product, Product Detail, Categories, Collections, Reviews pages per `COMPONENT_REUSE_MAP.md` and `ROUTE_RESTRUCTURE_PLAN.md`.
- Build Inventory Overview/Stock Management/Low Stock/Stock History pages, wired to the same Product data so stock counts stay consistent (see `ECOMMERCE_WORKFLOW_MAP.md` workflow 1 & 4 connection gaps).
- Use realistic Pakistani product data (PKR prices, local brand/category names) in the mock seed data.

## Phase 5 — Orders and customers
- Rename/adapt the Invoice app into Orders (list, detail/preview, print) per `ROUTE_RESTRUCTURE_PLAN.md`; implement status-filtered sub-views via query param rather than duplicate pages.
- Rename/adapt the User app into Customers; wire `UsersInvoiceListTable.js` as the Order History tab (see workflow 5 — nearly complete already).
- Add the Order Detail outbound links to Customer/Payment/Shipment (stubbed until Phase 6 entities exist).
- Create `Order` and `Customer` entities/services analogous to Phase 4's pattern, seeded with Pakistani customer names/cities/phone formats.

## Phase 6 — Payments, COD, shipping, and delivery
- Create `Payment`/`Transaction`, `BankAccount`, `WalletAccount`, `Refund`, `Shipment`, `Courier`, `TrackingEvent`, `ShippingZone` entities + fake-db + services.
- Build all Payments & Finance screens and Shipping & Delivery screens per `ROUTE_RESTRUCTURE_PLAN.md`.
- Implement the Payment Verification approve/reject workflow and COD Reconciliation bulk-action screen (see workflow 3 — fully new).
- Implement Create Shipment → Assign Courier → Add Tracking → Update Delivery Status (see workflow 6 — fully new), triggered from Order Detail.
- Wire Payment Methods/Bank/Wallet config screens to the Pakistan-specific methods: COD, Bank Transfer, Easypaisa, JazzCash, SadaPay.

## Phase 7 — Marketing, reviews, staff, reports, and settings
- Build Coupons, Discounts, Flash Sales, Campaigns, Newsletter screens.
- Finalize Reviews moderation queue (built skeleton in Phase 4, finish approve/reject here if deferred).
- Build Team Management: Staff (separate from Customers), Roles, Permissions (adapt existing apps), Activity Logs (new).
- Build Reports: Sales, Products, Customers, Inventory, Payments — all chart-driven, reusing Apex/Chart.js/Recharts components already in the template.
- Build Settings: General/Store Info/Payments/Shipping/Tax/Notifications/SEO tabs, reusing the account-settings tabbed shell.
- **Thread PKR currency + Asia/Karachi timezone + Pakistani mock data (cities, Easypaisa/JazzCash/SadaPay/bank transfer/COD) through every screen built in this phase and retroactively through Phases 4–6**, since this requirement spans the whole catalog/order/payment/shipping surface, not just one phase.

## Phase 8 — Complete functionality testing and backend readiness
- Run `npm run lint` and the Next.js production build (`npm run build`) after each major phase, not just at the end.
- Manually click through every connected workflow in `ECOMMERCE_WORKFLOW_MAP.md` end-to-end (Product→Inventory, Order→Customer→Payment→Shipment, Payment verification→Order update, Customer→Order History→Order Detail, Orders→Shipment→Tracking).
- Verify no dead buttons/menus/filters remain per the "no decorative or dead buttons" rule.
- Document the mock service layer's API shape (endpoint, request/response shape per entity) in a `BACKEND_READINESS.md` (or equivalent) so a real backend can later replace `src/@fake-db/*` + `src/services/*` without UI changes — this is the deliverable that makes the app "backend-ready" without building the backend now.

## Process notes
- Do not proceed past Phase 1 without explicit approval, per the master prompt's rule 11.
- Each phase should end with its own lint/build/test check (per rule in section 12 of the master prompt), not deferred entirely to Phase 8.
- No visual/design-system changes planned in any phase — only content, data, navigation, and connections, per rule 8.
