import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { getDb } from "@dec-walls/db/client";
import { withCustomer } from "@dec-walls/db/with-customer";
import {
  addresses,
  customers,
  orderAddresses,
  orderItems,
  orders,
  productImages,
  products,
  wishlistItems,
  wishlists,
} from "@dec-walls/db/schema";
import { resolveCustomerId } from "@/app/api/checkout/_checkout-customer";
import type { SignedInCustomer } from "@/lib/customer-session";

export type AccountOrder = {
  id: string;
  number: string;
  status: string;
  createdAt: string;
  total: number;
  currency: string;
  itemCount: number;
  items: { title: string; variant: string; quantity: number; unitPrice: number; imageUrl: string | null }[];
  estimatedDays: number | null;
};

export type AccountAddress = {
  key: string;
  fullName: string;
  lines: string[];
  phone: string | null;
  isDefault: boolean;
  fromOrder: boolean;
};

export type AccountWish = { slug: string; name: string; price: number; currency: string; imageUrl: string | null };

export type AccountData = {
  profile: { fullName: string; email: string; phone: string; memberSince: string };
  orders: AccountOrder[];
  addresses: AccountAddress[];
  wishlist: AccountWish[];
};

const ORDER_LIMIT = 25;

/**
 * Everything the account page shows, read under row level security as the signed-in customer,
 * so each query can only ever see that customer's rows.
 */
export async function loadAccount(user: SignedInCustomer): Promise<AccountData | null> {
  const db = getDb();
  if (!db) return null;

  // Make sure the auth user has its customer row (the database trigger normally did this).
  await resolveCustomerId(db, user, { email: user.email, fullName: user.fullName ?? "", phone: "" });

  return withCustomer(db, user.id, async (tx) => {
    const [me] = await tx
      .select({ fullName: customers.fullName, email: customers.email, phone: customers.phone, createdAt: customers.createdAt })
      .from(customers)
      .where(eq(customers.authUserId, user.id));

    const orderRows = await tx
      .select({
        id: orders.id,
        number: orders.number,
        status: orders.status,
        createdAt: orders.createdAt,
        total: orders.totalAmount,
        currency: orders.currency,
        estimatedDays: orders.estimatedDays,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(ORDER_LIMIT);

    const ids = orderRows.map((o) => o.id);
    const itemRows = ids.length
      ? await tx
          .select({ orderId: orderItems.orderId, title: orderItems.title, variant: orderItems.variantTitle, quantity: orderItems.quantity, unitPrice: orderItems.unitPriceAmount, imageUrl: orderItems.imageUrl })
          .from(orderItems)
          .where(inArray(orderItems.orderId, ids))
      : [];
    const shipRows = ids.length
      ? await tx
          .select({
            orderId: orderAddresses.orderId,
            fullName: orderAddresses.fullName,
            line1: orderAddresses.line1,
            line2: orderAddresses.line2,
            city: orderAddresses.city,
            region: orderAddresses.region,
            phone: orderAddresses.phone,
          })
          .from(orderAddresses)
          .where(and(inArray(orderAddresses.orderId, ids), eq(orderAddresses.type, "shipping")))
      : [];

    const saved = await tx
      .select({
        id: addresses.id,
        fullName: addresses.fullName,
        line1: addresses.line1,
        line2: addresses.line2,
        city: addresses.city,
        region: addresses.region,
        phone: addresses.phone,
        isDefault: addresses.isDefault,
      })
      .from(addresses)
      .orderBy(desc(addresses.isDefault));

    const wishRows = await tx
      .select({
        slug: products.slug,
        name: products.name,
        price: products.priceAmount,
        currency: products.priceCurrency,
        imageUrl: sql<string | null>`(
          select ${productImages.url} from ${productImages}
          where ${productImages.productId} = ${products.id}
          order by ${productImages.isPrimary} desc, ${productImages.sortOrder} asc
          limit 1)`,
      })
      .from(wishlistItems)
      .innerJoin(wishlists, eq(wishlists.id, wishlistItems.wishlistId))
      .innerJoin(products, eq(products.id, wishlistItems.productId));

    const itemsByOrder = new Map<string, AccountOrder["items"]>();
    for (const row of itemRows) {
      const list = itemsByOrder.get(row.orderId) ?? [];
      list.push({ title: row.title, variant: row.variant, quantity: row.quantity, unitPrice: Number(row.unitPrice), imageUrl: row.imageUrl });
      itemsByOrder.set(row.orderId, list);
    }

    const addressList: AccountAddress[] = saved.map((a) => ({
      key: a.id,
      fullName: a.fullName,
      lines: [a.line1, a.line2, [a.city, a.region].filter(Boolean).join(", ")].filter((l): l is string => Boolean(l)),
      phone: a.phone,
      isDefault: a.isDefault,
      fromOrder: false,
    }));
    // Until addresses can be saved, show the delivery addresses used on past orders, newest first.
    const seen = new Set(addressList.map((a) => a.lines.join("|").toLowerCase()));
    const orderIndex = new Map(ids.map((id, i) => [id, i]));
    for (const s of [...shipRows].sort((a, b) => (orderIndex.get(a.orderId) ?? 0) - (orderIndex.get(b.orderId) ?? 0))) {
      const lines = [s.line1, s.line2, [s.city, s.region].filter(Boolean).join(", ")].filter((l): l is string => Boolean(l));
      const key = lines.join("|").toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      addressList.push({ key: `order-${s.orderId}`, fullName: s.fullName, lines, phone: s.phone, isDefault: false, fromOrder: true });
    }

    return {
      profile: {
        fullName: me?.fullName ?? user.fullName ?? "",
        email: me?.email ?? user.email,
        phone: me?.phone ?? "",
        memberSince: (me?.createdAt ?? new Date()).toISOString(),
      },
      orders: orderRows.map((o) => {
        const items = itemsByOrder.get(o.id) ?? [];
        return {
          id: o.id,
          number: o.number,
          status: o.status,
          createdAt: o.createdAt.toISOString(),
          total: Number(o.total),
          currency: o.currency,
          estimatedDays: o.estimatedDays,
          itemCount: items.reduce((n, i) => n + i.quantity, 0),
          items,
        };
      }),
      addresses: addressList,
      wishlist: wishRows.map((w) => ({ ...w, price: Number(w.price) })),
    };
  });
}
