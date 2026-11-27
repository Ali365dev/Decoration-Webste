import { and, eq, isNull, sql } from "drizzle-orm";
import type { Database } from "@dec-walls/db/client";
import { customers } from "@dec-walls/db/schema";
import type { SignedInCustomer } from "@/lib/customer-session";

export { getSignedInUser } from "@/lib/customer-session";

type Contact = { email: string; fullName: string; phone: string };

/**
 * The customer row an order belongs to.
 * Signed in: the row linked to the auth user. An unlinked row with the account's email is
 * linked, or a new linked row is created (same rules as the link_customer_to_auth_user trigger).
 * Guest: the row with the typed email, matched case-insensitively, or a new one.
 */
export async function resolveCustomerId(
  db: Database,
  user: SignedInCustomer | null,
  contact: Contact,
): Promise<string | null> {
  if (user) {
    const [linked] = await db.select({ id: customers.id }).from(customers).where(eq(customers.authUserId, user.id));
    if (linked) return linked.id;

    const [claimed] = await db
      .update(customers)
      .set({ authUserId: user.id })
      .where(and(sql`lower(${customers.email}) = ${user.email}`, isNull(customers.authUserId)))
      .returning({ id: customers.id });
    if (claimed) return claimed.id;

    const [created] = await db
      .insert(customers)
      .values({ email: user.email, fullName: user.fullName ?? (contact.fullName || null), phone: contact.phone || null, authUserId: user.id })
      .onConflictDoNothing()
      .returning({ id: customers.id });
    if (created) return created.id;

    // Another request linked it at the same moment.
    const [again] = await db.select({ id: customers.id }).from(customers).where(eq(customers.authUserId, user.id));
    return again?.id ?? null;
  }

  const [existing] = await db
    .select({ id: customers.id })
    .from(customers)
    .where(sql`lower(${customers.email}) = ${contact.email}`)
    .orderBy(customers.createdAt)
    .limit(1);
  if (existing) return existing.id;

  const [created] = await db
    .insert(customers)
    .values({ email: contact.email, fullName: contact.fullName, phone: contact.phone })
    .onConflictDoNothing()
    .returning({ id: customers.id });
  if (created) return created.id;

  const [again] = await db.select({ id: customers.id }).from(customers).where(eq(customers.email, contact.email));
  return again?.id ?? null;
}
