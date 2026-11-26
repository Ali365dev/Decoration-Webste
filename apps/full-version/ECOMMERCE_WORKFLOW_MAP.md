# Ecommerce Workflow Map

Each workflow broken into steps, noting whether a working UI piece already exists to connect (reuse) or needs building (new).

## 1. Product workflow
**Products → Add Product → Product Details → Edit Product → Inventory**

| Step | Status | Notes |
|---|---|---|
| Products list | Needs building (new page) | Reuse `TableServerSide.js` infra — table mechanics exist, Product entity doesn't |
| Add Product | Needs building (new page, composed from existing pieces) | File-uploader, rich-text editor, autocomplete, yup validation all exist individually; no unified Product form exists |
| Product Details | Needs building | Reuse invoice-preview card layout as a template for a read-only detail view |
| Edit Product | Needs building | Reuse invoice-edit pattern (`views/apps/invoice/edit/Edit.js`) — same shape: load existing record into the add-form |
| → Inventory link | Needs building | No connection exists today between "a product" and "a stock qty" — must be built as the Product entity's `stock` field feeding the Inventory screens |

**Connection gap:** nothing currently ties a product record to its stock row; this link must be designed in the data layer (Phase 7, section 7) before the UI, since Inventory screens, Low Stock, and Stock History all depend on reading from the same Product/Inventory source of truth.

## 2. Order workflow
**Orders → Order Details → Customer Details → Payment Details → Shipment Details**

| Step | Status | Notes |
|---|---|---|
| Orders list | Reuse-ready | `views/apps/invoice/list` table is feature-complete (search/filter/status/pagination) — just needs Invoice→Order field rename |
| Order Details | Reuse-ready | `views/apps/invoice/preview/Preview.js` + `PreviewCard.js` already render a document-style detail view with customer info, line items, totals |
| → Customer Details | Partially connected | Invoice preview shows customer name/email/address but has no link/navigation to a Customer record — must add a clickable link to `/customers/view/[tab]` |
| → Payment Details | Partially connected | `AddPaymentDrawer.js` exists and can record a payment against an invoice, but there's no dedicated Payment entity/detail view to navigate to yet — needs building |
| → Shipment Details | Not connected | No shipment concept exists on the Invoice/Order model at all — needs building (Shipment entity + "Create Shipment" action on Order Detail page) |

**Connection gap:** the order detail page needs three new outbound links (to Customer, Payment, Shipment) that don't exist in the invoice template; the underlying entities for Payment and Shipment must be created first.

## 3. Payment workflow
**Payment Transactions → Receipt Verification → Approve/Reject → Updated Payment Status → Related Order**

| Step | Status | Notes |
|---|---|---|
| Payment Transactions list | Needs building | No Transaction entity exists; reuse invoice-list table shape |
| Receipt Verification | Needs building | Reuse `FileUploaderSingle.js` (view uploaded receipt) + a dialog shell (`DialogAddCard.js` shape) for the reviewer UI |
| Approve/Reject | Needs building | No existing approve/reject action pattern in the template — closest analog is the suspend/activate toggle in `UserSuspendDialog.js` (confirmation dialog + status flip), reusable as the interaction pattern |
| Updated Payment Status | Needs building | Must propagate the new status into the mock service layer |
| → Related Order | Needs building | Once a Transaction has an `orderId` field, the Order Detail page's "Payment Details" link (see workflow 2) resolves here |

**Connection gap:** this entire workflow is new; the only reusable pieces are interaction patterns (file preview, confirm dialog), not data or screens.

## 4. Inventory workflow
**Products → Inventory → Stock Adjustment → Stock History → Updated Stock**

| Step | Status | Notes |
|---|---|---|
| Products → Inventory | Needs building (see workflow 1 gap) | Requires the Product↔Inventory data link first |
| Stock Adjustment | Partially reusable | `TableEditable.js` already supports inline cell editing — can be wired directly to a stock qty column |
| Stock History | Needs building | Reuse timeline component (`TimelineOutlined.js`) for rendering; no stock-movement log entity exists |
| → Updated Stock | Needs building | Every adjustment must write both to the Product's live stock value AND append a Stock History entry — a small mock-service function, not UI work |

## 5. Customer workflow
**Customers → Customer Details → Order History → Order Details**

| Step | Status | Notes |
|---|---|---|
| Customers list | Reuse-ready | `views/apps/user/list` table + `AddUserDrawer.js` |
| Customer Details | Reuse-ready | `views/apps/user/view/UserViewPage.js` tabbed layout |
| → Order History | **Already exists almost exactly as needed** | `views/apps/user/view/UsersInvoiceListTable.js` already renders a user's invoice list inside their profile — this is literally an Order History tab, just needs Invoice→Order renaming |
| → Order Details | Reuse-ready | Clicking a row in that table can route straight to the renamed invoice-preview page (workflow 2) |

**This is the most complete workflow already** — all four steps have direct existing analogs; it is primarily a renaming/relinking exercise, not new construction.

## 6. Shipping workflow
**Orders → Create Shipment → Assign Courier → Add Tracking → Update Delivery Status**

| Step | Status | Notes |
|---|---|---|
| Orders → Create Shipment | Needs building | No "Create Shipment" action exists anywhere; closest UI analog is the invoice "Add Payment" drawer pattern (a slide-in drawer triggered from Order Detail) — reusable as the interaction shell |
| Assign Courier | Needs building | Reuse an autocomplete/select component for courier picker; Courier entity doesn't exist |
| Add Tracking | Needs building | Reuse text-field + date-picker form components; no tracking entity exists |
| Update Delivery Status | Needs building | Reuse the status-chip pattern from the invoice list (`invoiceStatus` chip rendering) applied to a new `shipmentStatus` field |

**Connection gap:** this workflow has zero existing data layer; UI interaction patterns (drawer, autocomplete, status chips, timeline for tracking events) are all borrowable from elsewhere in the template, but every entity (Shipment, Courier, Tracking Event) must be created from scratch.

## Summary ranking (most to least reuse-ready)
1. **Customer workflow** — essentially done, rename only.
2. **Order workflow** — core screens exist, needs 3 new outbound links + 2 new entities (Payment, Shipment) to land on.
3. **Product workflow** — form pieces exist individually, need composing; Inventory link is new.
4. **Inventory workflow** — one reusable table (editable), rest is new.
5. **Payment workflow** — only interaction patterns reusable, all data layer new.
6. **Shipping workflow** — only interaction patterns reusable, all data layer new.
