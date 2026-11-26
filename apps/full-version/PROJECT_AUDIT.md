# Project Audit — Materialize Next.js Admin Template → Ecommerce Admin

**Date:** Phase 1 audit (read-only, no code changed)
**Stack:** Next.js 13.2.4 (Pages Router), React 18.2.0, MUI 5.11, Redux Toolkit 1.9, react-hook-form + yup, axios + axios-mock-adapter, ApexCharts/Chart.js/Recharts, i18next, CASL (ACL).

## What this project currently is

This is the **stock Pixinvent Materialize demo** — a template showcase, not a business application. It ships:

- 3 dashboard variants: CRM, Analytics, **eCommerce** (the eCommerce one is charts/widgets only — no catalog, no orders, no customers).
- 4 full "apps": **Email**, **Chat**, **Calendar**, **Invoice** (list/add/edit/preview/print), **User** (list + multi-tab view), **Roles & Permissions**.
- 1 ACL demo page (CASL-based route/action guarding).
- A huge `components/`, `ui/`, `charts/`, `forms/`, `tables/` tree that is **pure MUI component documentation** (every variant of every MUI component, each with a "source code" view) — this is template documentation, not business UI.
- `pages/pages/*` — generic SaaS page templates: account-settings, 10 auth-page variants, FAQ, help-center, pricing, user-profile, dialog examples, wizard examples (checkout/create-deal/property-listing), misc error pages.
- A fake backend: `axios-mock-adapter` intercepting routes like `/apps/invoice/invoices`, `/apps/users/list`, `/apps/permissions/list`, `/jwt/login` — all in-memory arrays in `src/@fake-db/`.

## High-level stats

| Item | Count |
|---|---|
| Route files under `src/pages/` | ~90 files / ~70 distinct routes |
| View files under `src/views/` | ~310 files |
| Dedicated "apps" (non-UI-showcase) | 6 (Email, Chat, Calendar, Invoice, User, Roles/Permissions) |
| Dashboard variants | 3 (CRM, Analytics, eCommerce) |
| Pure component-showcase pages (`components/`, `ui/`, `charts/`, `forms/`, `tables/`) | ~45 routes |
| Generic SaaS page templates (`pages/pages/*`) | ~25 routes |
| Fake-db entity files | 6 (invoice, userList, permissions, calendar, chat, email) — **no product/order/customer/payment entity exists yet** |

## Strengths for this use case

- **Invoice app** is structurally very close to an **Orders** module: has list table w/ filters+search+pagination, add/edit forms, a preview (≈ order detail) and print view, plus a "send invoice"/"add payment" drawer pattern that maps well to COD/payment workflows.
- **User List + User View (tabbed)** is structurally very close to a **Customers** module (list table + multi-tab detail page with billing/security/overview tabs).
- **Roles & Permissions app** maps directly to **Team Management → Roles/Permissions**.
- **MUI DataGrid (`tables/data-grid`) and MUI Table patterns** are reusable for every planned listing screen (Products, Orders, Customers, Transactions, Coupons, Staff, etc.) — sorting/filtering/pagination/selection are already solved generically.
- **Form patterns** (react-hook-form + yup, file-uploader, autocomplete, pickers, rich text editor) cover everything needed for Product/Coupon/Settings forms — no new form infra required.
- **Wizard/Stepper** (`StepperLinearWithValidation`, checkout wizard) is reusable for multi-step flows (e.g., shipment creation, refund approval, store onboarding).
- **Dialog examples** include add-address, add-card, pricing dialog, edit-user-info — directly reusable for address/payment-method/plan dialogs.
- **ACL (CASL)** is already wired — reusable as-is for staff role-based permissions instead of being built from scratch.
- **i18next** is already set up for future multi-language support (useful if store needs Urdu/English).

## Weaknesses / gaps for this use case

- **No ecommerce domain entities at all** — no Product, Category, Collection, Inventory, Order, Payment, Shipment, Coupon, Review fake-db or types exist. The "eCommerce" dashboard is cosmetic (charts named "sales", "orders" but backed by random numbers, no real linked data).
- **~70% of the navigation and routes are irrelevant demo/documentation content** (component showcases, 10 auth-page variants, wizard examples, dialog examples, pricing/FAQ/help-center templates) that should not appear in a production sidebar.
- **No currency/locale setup for PKR or Asia/Karachi** — current mock data uses USD (`$724`) and US-style addresses/companies.
- **No payment-method concepts** (COD, bank transfer, Easypaisa, JazzCash, SadaPay) exist anywhere in config or fake-db.
- Duplicate/overlapping demo pages exist (e.g., `pages/` top-level `login`/`register`/`forgot-password` AND `pages/pages/auth/*` variants duplicate the same functionality multiple times).

## Bottom line

This template is an **excellent component and pattern library**, not an ecommerce app. The fastest path is: keep `@core`, layouts, table/form/dialog components, and the Invoice/User/Roles apps as structural skeletons; strip ~45 showcase routes and ~20 duplicate auth/page-template routes from primary nav; build the missing domain layer (types + fake-db + service functions) for Product/Order/Customer/Payment/Shipment/Coupon; and reskin currency/locale to PKR/Pakistan.
