// Two customers with one of everything. Call inside a transaction, or clean up afterwards.
import { randomUUID } from "node:crypto";
import { customer, insert, order, short } from "./factory";
import type { Tx } from "./helpers";

export async function person(tx: Tx, authUserId: string = randomUUID(), createAuthUser = true) {
  const email = `p-${short()}@example.test`;
  if (createAuthUser) await tx`insert into auth.users (id, email) values (${authUserId}, ${email})`;
  const c = await customer(tx, { auth_user_id: authUserId, email });
  const address = await insert(tx, "addresses", { customer_id: c.id, full_name: "A", line1: "1 Street", city: "Lahore" });
  const wishlist = await insert(tx, "wishlists", { customer_id: c.id });
  const o = await order(tx, c.id, { email });
  const item = await insert(tx, "order_items", { order_id: o.id, title: "T", variant_title: "V", sku: "S", quantity: 1, unit_price_amount: 100 });
  const orderAddress = await insert(tx, "order_addresses", { order_id: o.id, full_name: "A", line1: "1", city: "Lahore", country: "PK" });
  const payment = await insert(tx, "payments", { order_id: o.id, method: "bank", amount: 300, receipt_path: "r/1.jpg" });
  const history = await insert(tx, "order_status_history", { order_id: o.id, kind: "order", to_status: "pending", note: "internal" });
  return { authUserId, email, customer: c, address, wishlist, order: o, item, orderAddress, payment, history };
}
