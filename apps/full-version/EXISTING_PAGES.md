# Existing Pages — Full Route Inventory

Every route under `src/pages/`, its backing view file(s), and current content. Classification uses:
1. Reuse without changes · 2. Reuse with modifications · 3. Connect with another existing component · 4. Remove from primary navigation · 5. Deprecate only after checking dependencies · 6. Create new (genuinely missing)

## Dashboards

| Route | Page file | Backing view(s) | Current content | Class |
|---|---|---|---|---|
| `/dashboards/crm` | `pages/dashboards/crm/index.js` | `views/dashboards/crm/*` (13 widgets) | Generic CRM KPIs/charts | 4 (remove from nav; keep file as reference) |
| `/dashboards/analytics` | `pages/dashboards/analytics/index.js` | `views/dashboards/analytics/*` (11 widgets) | Generic analytics widgets (sessions, revenue, performance) | 2 → becomes **Overview/Analytics** |
| `/dashboards/ecommerce` | `pages/dashboards/ecommerce/index.js` | `views/dashboards/ecommerce/*` (10 widgets: sales overview, impressions/orders, live visitors, weekly sales, table) | Cosmetic ecommerce-labelled charts, random data | 2 → becomes **Overview/Dashboard**, rewire to real mock sales/order data |

## Apps (closest to real business logic)

| Route(s) | Backing view(s) | Current content | Class |
|---|---|---|---|
| `/apps/invoice/list`, `/add`, `/edit/[id]`, `/preview/[id]`, `/print/[id]` | `views/apps/invoice/*` | Full invoice CRUD: list w/ search+filter+status+pagination, add form w/ line items, edit, preview (PDF-style), print, "Add Payment" & "Send Invoice" drawers | 2 → becomes **Orders** module (list/detail/create), drawers → payment recording |
| `/apps/user/list` | `views/apps/user/list/*` | User list table + "Add User" drawer | 2 → becomes **Customers → All Customers** |
| `/apps/user/view/[tab]` | `views/apps/user/view/*` (Overview, Security, Billing, Notifications, Connections, suspend/subscription dialogs) | Tabbed user profile | 2 → becomes **Customer Details** (Overview/Orders/Addresses tabs) |
| `/apps/roles` | `views/apps/roles/*` (RoleCards, Table) | Role cards + permission matrix table | 1/2 → **Team Management → Roles** |
| `/apps/permissions` | `views/apps/permissions/TableHeader.js` + fake-db | Permissions list table | 1/2 → **Team Management → Permissions** |
| `/apps/email` | `views/apps/email/*` | Full email client UI | 4 (not needed for ecommerce admin; optionally repurpose for customer support inbox later) |
| `/apps/chat` | `views/apps/chat/*` | Full chat UI | 4 (not needed; could later become staff internal chat — low priority) |
| `/apps/calendar` | `views/apps/calendar/*` | FullCalendar wrapper + event sidebar | 3 → reusable for **Flash Sales / Campaign scheduling** or courier pickup calendar |
| `/acl` | `pages/acl/index.js` | CASL ACL demo page | 5 → keep CASL wiring, remove demo page from nav, repurpose pattern for staff permission gating |

## Charts (component documentation)

| Route | Content | Class |
|---|---|---|
| `/charts/apex-charts`, `/charts/chartjs`, `/charts/recharts` | Every chart-type variant (area, bar, radar, scatter, etc.) with source code | 4 (remove from nav) — individual chart components (3) are reused inside Reports/Analytics screens |

## Components & UI (pure MUI documentation — ~45 routes)

| Route group | Examples | Class |
|---|---|---|
| `/components/*` (19 routes) | accordion, alerts, avatars, badges, button-group, buttons, chips, dialogs, list, menu, pagination, progress, ratings, snackbar, swiper, tabs, timeline, toast, tree-view | 4 (remove from nav; individual components reused ad hoc inside real screens, e.g. dialogs, toast, tabs) |
| `/ui/typography`, `/ui/icons` | Style-guide pages | 4 |
| `/ui/cards/{actions,advanced,basic,gamification,statistics,widgets}` | Card variant galleries | 4 (remove from nav; statistics/advanced cards reused as KPI tiles in Dashboard/Reports) |
| `/tables/mui`, `/tables/data-grid` | Table variant galleries | 4 (remove from nav; `TableServerSide`/`TableBasic` patterns reused for every listing screen) |
| `/forms/form-elements/*` (12 routes), `/forms/form-layouts`, `/forms/form-validation`, `/forms/form-wizard` | Every form control variant | 4 (remove from nav; react-hook-form+yup pattern, file-uploader, autocomplete, editor, pickers reused in Product/Settings forms) |

## Generic page templates (`pages/pages/*`)

| Route | Content | Class |
|---|---|---|
| `/pages/account-settings/[tab]` | Account/Security/Billing/Notifications/Connections tabs | 2 → becomes **Settings** shell (General/Store Info/Notifications tabs reuse this layout) |
| `/pages/auth/login-v1`, `login-v2`, `login-with-appbar`, `register-v1`, `register-v2`, `register-multi-steps`, `forgot-password-v1/v2`, `reset-password-v1/v2`, `two-steps-v1/v2`, `verify-email-v1/v2` (16 routes) | Auth page variants, duplicate of top-level `/login`, `/register`, `/forgot-password` | 4 (remove from nav; keep **one** login + one forgot-password variant, delete the rest after dependency check — see DUPLICATE_AND_DEMO_CONTENT.md) |
| `/pages/dialog-examples` | Gallery of 8 dialog patterns (add address, add card, pricing, edit user, refer & earn, create app, share project, authentication) | 4 (remove from nav; dialogs individually reused: add-address→shipping address, add-card→payment method, edit-user→staff edit) |
| `/pages/faq` | FAQ page template | 4 (remove, or repurpose later as storefront-facing FAQ — out of admin scope) |
| `/pages/help-center/*` (3 routes) | Help center landing/category/article | 4 (remove from admin nav; not needed for store admin) |
| `/pages/misc/*` (5 routes: 401/404/500/coming-soon/under-maintenance) | Error/status pages | 1 (reuse as-is for app error states) |
| `/pages/pricing` | SaaS pricing table | 4 (remove — irrelevant to single-store admin) |
| `/pages/user-profile/[tab]` | Profile/Teams/Projects/Connections tabs | 3 → **Profile** tab reusable for **Staff Member detail**; Teams/Projects not needed |
| `/pages/wizard-examples/checkout`, `create-deal`, `property-listing` (3 routes) | Multi-step wizards (cart→address→payment→confirmation; deal stepper; property listing stepper) | 3 → **checkout wizard steps directly map to Order creation / Refund approval wizard**; others remove |

## Top-level duplicates

| Route | vs. | Class |
|---|---|---|
| `/login` | duplicate of `/pages/auth/login-v1` | 5 (keep ONE, deprecate other after checking `_app.js`/middleware references) |
| `/register` | duplicate of `/pages/auth/register-v1` | 4 (ecommerce admin is invite-only staff, self-registration likely not needed — remove from nav, keep file dormant) |
| `/forgot-password` | duplicate of `/pages/auth/forgot-password-v1` | 5 (keep ONE) |

## Root/system

| Route | Class |
|---|---|
| `/` (`pages/index.js`) | 2 → redirect/landing becomes **Dashboard** |
| `/401`, `/404`, `/500`, `_app.js`, `_document.js` | 1 (keep as-is, framework required) |

## Genuinely new pages required (Class 6)

Products, Add/Edit Product, Product Detail, Categories, Collections, Reviews, Inventory Overview/Stock Management/Low Stock/Stock History, Order status sub-views (Pending/Processing/Shipped/Delivered/Cancelled/Returns as filtered views of the Invoice-derived Orders list — not fully new, see ROUTE_RESTRUCTURE_PLAN.md), Customer Segments, Payments Overview/Transactions/Payment Verification/Payment Methods/Bank Accounts/Wallet Accounts/COD Reconciliation/Refunds, Shipping Overview/Zones/Delivery Charges/Couriers/Shipments/Tracking, Coupons/Discounts/Flash Sales/Campaigns/Newsletter, Activity Logs, Reports (Sales/Products/Customers/Inventory/Payments), Settings (Store Info/Payments/Shipping/Tax/SEO sub-tabs).
