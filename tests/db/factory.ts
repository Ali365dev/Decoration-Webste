// Builds rows for tests. Always call inside a transaction that is rolled back.
import { randomUUID } from "node:crypto";
import type { Tx } from "./helpers";

export const short = () => randomUUID().slice(0, 8);

export async function insert(tx: Tx, table: string, row: Record<string, unknown>) {
  const [created] = await tx`insert into ${tx(`public.${table}`)} ${tx(row as never)} returning *`;
  return created as Record<string, any>;
}

export async function product(tx: Tx, over: Record<string, unknown> = {}) {
  return insert(tx, "products", { slug: `t-${short()}`, name: "Test product", price_amount: 100, status: "published", ...over });
}

export async function variant(tx: Tx, productId: string, over: Record<string, unknown> = {}) {
  return insert(tx, "product_variants", { product_id: productId, sku: `SKU-${short()}`, title: "Size", price_amount: 100, inventory_quantity: 5, ...over });
}

export async function customer(tx: Tx, over: Record<string, unknown> = {}) {
  return insert(tx, "customers", { email: `c-${short()}@example.test`, full_name: "Test Customer", ...over });
}

export const orderValues = (customerId: string | null, over: Record<string, unknown> = {}) => ({
  number: `T-${short()}`, customer_id: customerId, email: "buyer@example.test", contact_name: "Buyer",
  contact_phone: "0300", idempotency_key: randomUUID(), subtotal_amount: 100, shipping_amount: 200, total_amount: 300, ...over,
});

export async function order(tx: Tx, customerId: string | null, over: Record<string, unknown> = {}) {
  return insert(tx, "orders", orderValues(customerId, over));
}
