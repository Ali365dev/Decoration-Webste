# Route Restructure Plan

Target sidebar structure as specified by the user, mapped to actual/planned file paths. "Existing" = renamed/repurposed from a current route. "New" = genuinely new file (Class 6).

## Overview
| Nav item | Target route | Source |
|---|---|---|
| Dashboard | `/dashboards/ecommerce` (kept path, content rewired) | Existing (`pages/dashboards/ecommerce/index.js`) |
| Analytics | `/dashboards/analytics` (kept path, widgets rewired) | Existing (`pages/dashboards/analytics/index.js`) |

## Catalog
| Nav item | Target route | Source |
|---|---|---|
| Products | `/catalog/products` | New page; reuse `views/table/data-grid/TableServerSide.js` pattern |
| Add Product | `/catalog/products/add` | New page; compose existing form components |
| (implicit) Product Detail/Edit | `/catalog/products/edit/[id]` | New page; reuse invoice-edit layout pattern |
| Categories | `/catalog/categories` | New page; reuse `TreeViewBasic.js` + `TableBasic.js` |
| Collections | `/catalog/collections` | New page; reuse dialog + table pattern |
| Reviews | `/catalog/reviews` | New page; reuse ratings components + DataGrid |

## Inventory
| Nav item | Target route | Source |
|---|---|---|
| Overview | `/inventory/overview` | New page; reuse statistic cards |
| Stock Management | `/inventory/stock` | New page; reuse `TableEditable.js` |
| Low Stock | `/inventory/low-stock` | New page; filtered view of Stock Management |
| Stock History | `/inventory/history` | New page; reuse timeline components |

## Sales
| Nav item | Target route | Source |
|---|---|---|
| All Orders | `/sales/orders` | Existing, renamed from `/apps/invoice/list` |
| Pending Orders | `/sales/orders/pending` | Existing table, status-filtered (query param or dedicated page) |
| Processing | `/sales/orders/processing` | Same as above |
| Shipped | `/sales/orders/shipped` | Same as above |
| Delivered | `/sales/orders/delivered` | Same as above |
| Cancelled | `/sales/orders/cancelled` | Same as above |
| Returns | `/sales/orders/returns` | Same table + new return-reason fields |
| (implicit) Order Detail | `/sales/orders/preview/[id]` | Existing, renamed from `/apps/invoice/preview/[id]` |

> Recommendation: implement status views as ONE page (`/sales/orders/index.js`) with a status filter param (`?status=pending`) rather than 6 separate page files, to avoid duplicating the table component 6 times. Nav entries link to the same page with different query params.

## Customers
| Nav item | Target route | Source |
|---|---|---|
| All Customers | `/customers` | Existing, renamed from `/apps/user/list` |
| Customer Segments | `/customers/segments` | New page |
| (implicit) Customer Detail | `/customers/view/[tab]` | Existing, renamed from `/apps/user/view/[tab]` — reuse `UsersInvoiceListTable.js` as Order History tab |

## Payments & Finance
| Nav item | Target route | Source |
|---|---|---|
| Overview | `/payments/overview` | New page; reuse finance/transaction cards |
| Transactions | `/payments/transactions` | New page; reuse invoice-list table pattern |
| Payment Verification | `/payments/verification` | New page; new dialog workflow |
| Payment Methods | `/payments/methods` | New page; reuse `PaymentMethodCard.js` |
| Bank Accounts | `/payments/bank-accounts` | New page; reuse `BillingAddressCard.js` pattern |
| Wallet Accounts | `/payments/wallet-accounts` | New page; same pattern (Easypaisa/JazzCash/SadaPay) |
| COD Reconciliation | `/payments/cod-reconciliation` | New page; reuse `TableSelection.js` |
| Refunds | `/payments/refunds` | New page; reuse invoice-edit + stepper |

## Shipping & Delivery
| Nav item | Target route | Source |
|---|---|---|
| Overview | `/shipping/overview` | New page |
| Shipping Zones | `/shipping/zones` | New page |
| Delivery Charges | `/shipping/delivery-charges` | New page |
| Couriers | `/shipping/couriers` | New page |
| Shipments | `/shipping/shipments` | New page; reuse invoice-list table |
| Tracking | `/shipping/tracking/[id]` | New page; reuse timeline component |

## Marketing
| Nav item | Target route | Source |
|---|---|---|
| Coupons | `/marketing/coupons` | New page; reuse invoice-list table |
| Discounts | `/marketing/discounts` | New page |
| Flash Sales | `/marketing/flash-sales` | New page; reuse calendar scheduling |
| Campaigns | `/marketing/campaigns` | New page |
| Newsletter | `/marketing/newsletter` | New page |

## Team Management
| Nav item | Target route | Source |
|---|---|---|
| Staff Members | `/team/staff` | Existing pattern, renamed from `/apps/user/list` (separate instance/data from Customers) |
| Roles | `/team/roles` | Existing, renamed from `/apps/roles` |
| Permissions | `/team/permissions` | Existing, renamed from `/apps/permissions` |
| Activity Logs | `/team/activity-logs` | New page; reuse timeline component |

## Reports
| Nav item | Target route | Source |
|---|---|---|
| Sales | `/reports/sales` | New page; reuse apex/recharts components |
| Products | `/reports/products` | New page; reuse recharts bar chart |
| Customers | `/reports/customers` | New page; reuse analytics sales-by-country widget (→ by city) |
| Inventory | `/reports/inventory` | New page; reuse chartjs horizontal bar |
| Payments | `/reports/payments` | New page; reuse transaction card + chart |

## Settings
| Nav item | Target route | Source |
|---|---|---|
| General | `/settings/general` | Existing pattern, renamed from `/pages/account-settings` (Account tab) |
| Store Information | `/settings/store` | New sub-tab, reuse account-settings form layout |
| Payments | `/settings/payments` | New sub-tab; reuse `PaymentMethodCard.js` |
| Shipping | `/settings/shipping` | New sub-tab |
| Tax | `/settings/tax` | New sub-tab |
| Notifications | `/settings/notifications` | Existing, renamed from account-settings Notifications tab |
| SEO | `/settings/seo` | New sub-tab |

## Routes removed from primary navigation (not deleted from disk yet)
See `DUPLICATE_AND_DEMO_CONTENT.md` for the full ~70-route removal list (component/UI/chart/table/form showcases, duplicate auth variants, generic SaaS templates, email/chat/CRM-dashboard).

## Navigation config files to edit (Phase 2, not now)
- `src/navigation/vertical/index.js`
- `src/navigation/horizontal/index.js`

Both currently define the full demo menu tree (625 and 643 lines respectively) and will need a full rewrite to the structure above.
