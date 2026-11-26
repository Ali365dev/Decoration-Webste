# Duplicate & Demo Content — Removal Candidates

Everything here is a candidate for removal from **primary navigation** only. Per the strict rules, nothing should be deleted from disk until dependencies are checked (imports from `_app.js`, layouts, or other reused views).

## Pure component/style documentation (safe to remove from nav; files may stay as a reference library)

| Route group | Routes | Reason |
|---|---|---|
| `/components/*` | accordion, alerts, avatars, badges, button-group, buttons, chips, dialogs, list, menu, pagination, progress, ratings, snackbar, swiper, tabs, timeline, toast, tree-view (19 routes) | MUI component variant galleries with "source code" tabs — template documentation, not app functionality. Individual underlying components (dialogs, toast, tabs, tree-view) are still imported directly into real screens; only the **demo pages** are removed, not the components. |
| `/ui/typography`, `/ui/icons` | 2 routes | Style guide, not app content |
| `/ui/cards/{basic,advanced,statistics,widgets,gamification,actions}` | 6 routes | Card variant galleries. Several individual card components (`CardStatisticsHorizontal`, `CardFinanceApp`, etc.) are reused inside real dashboards/reports — keep the components, drop the gallery pages. |
| `/charts/apex-charts`, `/charts/chartjs`, `/charts/recharts` | 3 routes | Chart variant galleries; individual chart components reused in Reports |
| `/tables/mui`, `/tables/data-grid` | 2 routes | Table variant galleries; `TableServerSide`/`TableEditable`/`TableFilter` reused everywhere |
| `/forms/form-elements/*` (12), `/forms/form-layouts`, `/forms/form-validation`, `/forms/form-wizard` | 15 routes | Form control variant galleries; react-hook-form+yup pattern and individual controls reused in Product/Settings forms |

**Subtotal: ~47 routes removable from nav, zero business value lost.**

## Duplicate/overlapping auth & page templates

| Keep | Remove from nav (duplicate) | Reason |
|---|---|---|
| `/login` (top-level) | `/pages/auth/login-v1`, `/pages/auth/login-v2`, `/pages/auth/login-with-appbar` | Three near-identical login screens; one is enough for a single-store admin |
| `/forgot-password` (top-level) | `/pages/auth/forgot-password-v1`, `/pages/auth/forgot-password-v2` | Duplicate forgot-password flow |
| *(none — registration not needed)* | `/register` (top-level), `/pages/auth/register-v1`, `register-v2`, `register-multi-steps` | Admin is invite-only staff; self-service registration has no role in a single-store back office. Deprecate (class 5) after confirming nothing else imports the register flow. |
| *(none)* | `/pages/auth/reset-password-v1`, `v2` | Reset-password should be a token-based flow off forgot-password, not a separate nav entry; fold into one flow |
| *(none)* | `/pages/auth/two-steps-v1`, `v2` | 2FA UI — nice-to-have later under Settings → Security, not primary nav today |
| *(none)* | `/pages/auth/verify-email-v1`, `v2` | Email verification — not relevant to invite-only staff onboarding (can revisit if self-serve customer accounts are added later) |

**Subtotal: ~13 duplicate auth routes → keep 2, remove 11 from nav.**

## Generic SaaS templates irrelevant to a single-store admin

| Route | Reason |
|---|---|
| `/pages/pricing` | SaaS subscription pricing table — not applicable to an internal admin tool |
| `/pages/faq` | Public-facing FAQ template — out of admin scope (could matter for a separate storefront later, not this admin) |
| `/pages/help-center`, `/pages/help-center/[category]`, `/pages/help-center/[category]/[subcategory]/[article]` | Public help-center template — same reasoning, 3 routes |
| `/pages/dialog-examples` | Gallery of 8 dialogs — demo only; individual dialogs (add-address, add-card, edit-user) are reused directly inside real screens |
| `/pages/wizard-examples/create-deal`, `/pages/wizard-examples/property-listing` | CRM/real-estate domain wizards, no ecommerce relevance |
| `/pages/user-profile/teams`, `/pages/user-profile/projects` | "Teams"/"Projects" tabs are SaaS-product concepts, not applicable to store staff profiles |
| `/apps/email` | Full email client — out of scope unless repurposed later as a support inbox |
| `/apps/chat` | Full chat client — out of scope unless repurposed later as internal staff chat |
| `/dashboards/crm` | Generic CRM dashboard — superseded by the Overview/Analytics dashboards being built from the eCommerce + Analytics dashboard variants |

**Subtotal: ~11 more routes removable from nav.**

## Routes to keep but repurpose (not duplicates, just renamed targets)

- `/pages/wizard-examples/checkout` → structurally reusable for an internal "Create Manual Order" wizard (Cart→Address→Payment→Confirmation maps directly).
- `/pages/account-settings/[tab]` → becomes the Settings shell.
- `/pages/user-profile/[tab]` (profile tab only) → becomes Staff Member detail.
- `/pages/misc/*` (401/404/500/coming-soon/under-maintenance) → keep as-is, standard app chrome.

## Net effect

Of ~90 current route files, roughly **70 are demo/showcase/duplicate** and should disappear from the sidebar (though many underlying components keep being imported into real screens). Only ~20 routes (dashboards, invoice app, user app, roles/permissions app, account-settings, misc errors) carry forward as direct building blocks for the new ecommerce admin, confirming the audit finding that this is fundamentally a component library wearing a demo-app skin.
