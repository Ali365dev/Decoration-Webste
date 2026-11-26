# Component Reuse Map

Per planned ecommerce screen (sidebar structure as specified). Classification: 1 Reuse without changes · 2 Reuse with modifications · 3 Connect with another existing component · 4 Remove from primary navigation · 5 Deprecate only after checking dependencies · 6 Create new (genuinely missing).

## Overview

| Screen | Existing to reuse | Changes required | Works already | Missing | Class |
|---|---|---|---|---|---|
| Dashboard | `pages/dashboards/ecommerce/index.js` + `views/dashboards/ecommerce/*` | Rewire widgets to real mock Order/Product totals instead of random data; swap USD→PKR formatting | Chart rendering, responsive grid, widget cards | Linking "Total Orders"/"Revenue" numbers to actual mock order data | 2 |
| Analytics | `pages/dashboards/analytics/index.js` + `views/dashboards/analytics/*` | Replace "Sessions"/"Performance" widgets with Sales-by-category, Top products, Customer growth | Timeline, overview cards, country-sales map widget | Product/category-specific analytics widgets | 2 |

## Catalog

| Screen | Existing to reuse | Changes required | Works already | Missing | Class |
|---|---|---|---|---|---|
| Products (list) | `views/table/data-grid/TableServerSide.js` + `ServerSideToolbar.js` + `pages/tables/data-grid` pattern | New columns (image, name, SKU, category, price, stock, status), wire to new Product mock service | Sort/filter/pagination/server-side pattern, MUI DataGrid toolbar w/ search | Product entity + fake-db + bulk actions (publish/archive/delete) | 6 (new page), 2 (reused table infra) |
| Add Product | `views/apps/invoice/add/AddCard.js` (line-item form pattern) + `views/forms/form-elements/file-uploader/FileUploaderMultiple.js` + `views/forms/form-elements/editor/EditorControlled.js` (rich text description) + `views/forms/form-elements/autocomplete/AutocompleteMultipleValues.js` (variants/tags) | Assemble into one Product form: title, description (editor), images (file-uploader), price/compare-price, SKU, category/collection (autocomplete), variants, inventory qty | Validation pattern (yup), image upload UI, rich text editor | Variant matrix UI (size/color), category tree picker | 2 (compose existing pieces), 6 (variant matrix) |
| Categories | `views/components/tree-view/TreeViewBasic.js` / `TreeViewControlled.js` for hierarchy + `views/table/mui/TableBasic.js` for flat list | Feed real category tree data | Tree expand/collapse, drag reorder (if TreeViewRichObject used) | Category CRUD dialogs | 3 |
| Collections | Same table/dialog pattern as Categories; `views/pages/dialog-examples/DialogCreateApp.js` as a "create collection" dialog shape | Rename fields, link products to collection (multi-select) | Dialog shell, tabs-in-dialog pattern | Product-to-collection assignment UI | 3 |
| Reviews | `views/components/ratings/RatingsBasic.js`/`RatingsHoverFeedback.js` for star display + `views/table/mui/TableBasic.js` for list + MUI DataGrid for moderation queue | Add approve/reject/reply actions | Rating display components | Review entity, moderation workflow | 6 |

## Inventory

| Screen | Existing to reuse | Changes required | Works already | Missing | Class |
|---|---|---|---|---|---|
| Overview | `views/ui/cards/statistics/CardStatisticsHorizontal.js`/`Vertical.js` (KPI tiles: total SKUs, low stock count, out-of-stock count) | New data source | KPI tile layout | Inventory aggregation logic | 3 |
| Stock Management | `views/table/data-grid/TableEditable.js` (inline-editable DataGrid) | Edit stock qty inline per product | Inline cell editing already implemented | Stock adjustment audit trail | 2 |
| Low Stock | Filtered view of Stock Management table (reuse `TableFilter.js` pattern) | Threshold-based filter | Filter infra | Threshold config (Settings) | 3 |
| Stock History | `views/dashboards/analytics/AnalyticsActivityTimeline.js` or `views/components/timeline/TimelineOutlined.js` | Feed stock-change events | Timeline rendering | Stock movement log entity | 6 |

## Sales (Orders)

| Screen | Existing to reuse | Changes required | Works already | Missing | Class |
|---|---|---|---|---|---|
| All Orders | `views/apps/invoice/list/TableHeader.js` + invoice list DataGrid columns | Rename Invoice→Order fields (customer, items, total, payment method, status), add PKR formatting | Search, status-color chips, pagination, row click→detail | Order entity distinct from Invoice (multi-item, shipping info) | 2 |
| Pending/Processing/Shipped/Delivered/Cancelled/Returns | Same All Orders table, status-filtered (reuse `TableFilter.js`) | Status filter presets as separate nav entries/tabs | Filter mechanism | "Returns" needs its own reason/refund fields | 3 |
| Order Detail | `views/apps/invoice/preview/Preview.js` + `PreviewCard.js` + `PreviewActions.js` + `AddPaymentDrawer.js` | Add shipment/tracking section, customer link, line items w/ product thumbnails | PDF-style preview layout, "Add Payment" drawer, print/download actions | Shipment sub-section, status timeline | 2 |

## Customers

| Screen | Existing to reuse | Changes required | Works already | Missing | Class |
|---|---|---|---|---|---|
| All Customers | `views/apps/user/list/*` (table + `AddUserDrawer.js`) | Rename fields (name, phone, city, total orders, total spent), remove role/plan fields | Search/filter/pagination, add-drawer form pattern | Customer entity | 2 |
| Customer Segments | `views/apps/roles/RoleCards.js` (card-grid pattern) repurposed, or new DataGrid with segment tags | Define segment logic (VIP, repeat, new) | Card-grid layout | Segmentation logic | 6 |
| Customer Detail | `views/apps/user/view/UserViewPage.js` + `UserViewLeft.js` + `UserViewOverview.js` + `UsersInvoiceListTable.js` (already lists a user's invoices — directly reusable as "Order History" tab!) | Swap billing/security/notification tabs → Order History, Addresses, Reviews tabs | **`UsersInvoiceListTable.js` is a near-perfect existing Order History component** | Address book tab | 2 |

## Payments & Finance

| Screen | Existing to reuse | Changes required | Works already | Missing | Class |
|---|---|---|---|---|---|
| Overview | `views/ui/cards/advanced/CardFinanceApp.js` + `CardTransactions.js` + `CardTotalEarings.js` | Wire to real mock transaction totals | KPI/chart card shells | Aggregation logic | 3 |
| Transactions | `views/apps/invoice/list` table pattern (reuse again) + `views/ui/cards/advanced/CardPaymentHistory.js` | New Transaction entity columns (method, reference, status) | Table infra | Transaction entity | 6 |
| Payment Verification | `views/pages/dialog-examples/DialogAddCard.js` dialog shell, repurposed into "review receipt" dialog + `views/forms/form-elements/file-uploader/FileUploaderSingle.js` (view uploaded receipt image) | Approve/Reject buttons, status change | File preview, dialog shell | Receipt-upload-to-order linkage, approve/reject workflow | 6 |
| Payment Methods | `views/pages/account-settings/billing/PaymentMethodCard.js` | List store's accepted methods (COD/Bank/Easypaisa/JazzCash/SadaPay) instead of a customer's saved cards | Card UI | PK payment-method config | 2 |
| Bank Accounts / Wallet Accounts | `views/pages/account-settings/billing/BillingAddressCard.js` pattern (card list + add/edit dialog) | New fields (bank name, account title, IBAN; wallet number) | Card+dialog pattern | Entity + CRUD | 6 |
| COD Reconciliation | New table, but reuse `views/table/data-grid/TableSelection.js` (bulk row selection) for "mark collected" bulk action | Bulk status update | Row selection + bulk action pattern | COD reconciliation entity/logic | 6 |
| Refunds | `views/apps/invoice/edit/Edit.js` pattern (editable line items) + `views/forms/form-wizard/StepperLinearWithValidation.js` for refund approval steps | Refund request → review → approve/reject → refunded steps | Stepper, edit form | Refund entity | 6 |

## Shipping & Delivery

| Screen | Existing to reuse | Changes required | Works already | Missing | Class |
|---|---|---|---|---|---|
| Overview | KPI cards (`CardStatisticsHorizontal.js`) | Shipment counts by status | KPI tile | Shipment aggregation | 3 |
| Shipping Zones | `views/table/mui/TableBasic.js` + add/edit dialog | Zone name, cities, rate | — | Zone entity | 6 |
| Delivery Charges | Simple form table (reuse `views/forms/form-layouts/FormLayoutsBasic.js`) | Rate per zone/weight | Form layout | Rate entity | 6 |
| Couriers | `views/apps/user/list` card/table pattern | Courier name, contact, active areas | Table/list pattern | Courier entity | 6 |
| Shipments | `views/apps/invoice/list` table pattern again (list + status) | Shipment list linked to Orders | Table infra | Shipment entity | 6 |
| Tracking | `views/components/timeline/TimelineCenter.js` (status timeline) + `views/apps/calendar` for pickup scheduling (optional) | Tracking event timeline per shipment | Timeline component | Tracking event entity | 3/6 |

## Marketing

| Screen | Existing to reuse | Changes required | Works already | Missing | Class |
|---|---|---|---|---|---|
| Coupons | `views/apps/invoice/list` table + `views/forms/form-elements/input-mask` (code format) | Coupon code, type (%, fixed), usage limit, expiry | Table + form infra | Coupon entity | 6 |
| Discounts | Same as Coupons, simpler form | — | — | Discount entity | 6 |
| Flash Sales | `views/apps/calendar/Calendar.js` + `AddEventSidebar.js` (schedule start/end) + countdown-capable widget from `views/ui/cards/gamification/*` | Product selection + date range | Calendar scheduling UI | Flash sale entity | 3 |
| Campaigns | `views/apps/email/ComposePopup.js` repurposed for campaign composer (optional) | Campaign metadata table | Compose UI shell | Campaign entity | 6 |
| Newsletter | `views/table/mui/TableBasic.js` (subscriber list) + `views/forms/form-elements/text-field` | Subscriber import/export | Table | Subscriber entity | 6 |

## Team Management

| Screen | Existing to reuse | Changes required | Works already | Missing | Class |
|---|---|---|---|---|---|
| Staff Members | `views/apps/user/list/*` (same as Customers, different fields: role, department) | Field rename | Full CRUD table pattern | Staff entity (distinct from Customer) | 2 |
| Roles | `views/apps/roles/RoleCards.js` + `Table.js` | Rename demo roles to store roles (Owner/Manager/Support/Warehouse) | Role-permission matrix UI | Store-specific permission set | 1/2 |
| Permissions | `views/apps/permissions/TableHeader.js` + fake-db `permissions.js` | Rename permission names to store actions | List/search | Store-specific permission list | 2 |
| Activity Logs | `views/dashboards/analytics/AnalyticsActivityTimeline.js` / `views/components/timeline/*` | Feed staff action events | Timeline UI | Activity log entity | 6 |

## Reports

| Screen | Existing to reuse | Changes required | Works already | Missing | Class |
|---|---|---|---|---|---|
| Sales | `views/charts/apex-charts/ApexColumnChart.js`/`ApexLineChart.js` + `views/dashboards/ecommerce/EcommerceSalesOverviewWithTabs.js` | Date-range filter, PKR | Chart components | Report aggregation | 3 |
| Products | `views/charts/recharts/RechartsBarChart.js` (top sellers) | Product performance data | Chart | Aggregation | 3 |
| Customers | `views/dashboards/analytics/AnalyticsSalesCountry.js` (repurpose "country" map → "city" map for Pakistan) | City-level breakdown | Map/chart widget | City-level aggregation | 3 |
| Inventory | `views/charts/chartjs/ChartjsHorizontalBarChart.js` | Stock levels by category | Chart | Aggregation | 3 |
| Payments | `views/ui/cards/advanced/CardTransactions.js` + chart | Payment-method breakdown (COD vs online) | Card/chart | Aggregation | 3 |

## Settings

| Screen | Existing to reuse | Changes required | Works already | Missing | Class |
|---|---|---|---|---|---|
| General / Store Info | `views/pages/account-settings/TabAccount.js` | Replace "my account" fields with store name/logo/address/contact | Tabbed settings shell, form validation | Store entity | 2 |
| Payments | `views/pages/account-settings/billing/PaymentMethodCard.js` | Toggle COD/Bank/Easypaisa/JazzCash/SadaPay on/off | Card list UI | Config entity | 2 |
| Shipping | New form (reuse `FormLayoutsBasic.js`) | Default zones/rates | Form layout | Config entity | 6 |
| Tax | New simple form | Tax rate % | Form layout | Config entity | 6 |
| Notifications | `views/pages/account-settings/TabNotifications.js` | Rename to order/stock alert toggles | Toggle-list UI | — | 2 |
| SEO | New form (title/meta/sitemap toggle) — no existing analog | — | — | Config entity | 6 |

**Overall pattern:** ~55% of planned screens are Class 2/3 (reuse existing table/form/card/dialog/timeline patterns with field/data changes), ~40% are Class 6 (genuinely new entities — mostly Payments/Shipping/Marketing domain objects that have no template analog), and the Invoice/User/Roles apps supply nearly all the "hard" interaction plumbing (drawers, multi-step edit, PDF preview, tabbed detail) needed for Orders/Customers/Team.
