import {
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { customers } from "./identity";
import { orderStatusEnum } from "./identity";
import { productVariants, products } from "./catalog";

export const carts = pgTable("carts", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id").references(() => customers.id),
  sessionToken: text("session_token"),
  currency: text("currency").notNull().default("PKR"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cartId: uuid("cart_id")
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),
    variantId: uuid("variant_id")
      .notNull()
      .references(() => productVariants.id),
    quantity: integer("quantity").notNull().default(1),
    unitPriceAmount: numeric("unit_price_amount", {
      precision: 12,
      scale: 2,
    }).notNull(),
  },
  (t) => [uniqueIndex("cart_items_uq").on(t.cartId, t.variantId)],
);

export const wishlists = pgTable("wishlists", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
});

export const wishlistItems = pgTable(
  "wishlist_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    wishlistId: uuid("wishlist_id")
      .notNull()
      .references(() => wishlists.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
  },
  (t) => [uniqueIndex("wishlist_items_uq").on(t.wishlistId, t.productId)],
);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    number: text("number").notNull(),
    customerId: uuid("customer_id").references(() => customers.id),
    email: text("email").notNull(),
    status: orderStatusEnum("status").notNull().default("pending"),
    currency: text("currency").notNull().default("PKR"),
    subtotalAmount: numeric("subtotal_amount", {
      precision: 12,
      scale: 2,
    }).notNull(),
    shippingAmount: numeric("shipping_amount", {
      precision: 12,
      scale: 2,
    })
      .notNull()
      .default("0"),
    totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
    contactName: text("contact_name").notNull().default(""),
    contactPhone: text("contact_phone").notNull().default(""),
    whatsapp: text("whatsapp"),
    discountAmount: numeric("discount_amount", { precision: 12, scale: 2 }).notNull().default("0"),
    couponCode: text("coupon_code"),
    shippingZoneName: text("shipping_zone_name"),
    estimatedDays: integer("estimated_days"),
    idempotencyKey: text("idempotency_key").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [uniqueIndex("orders_number_uq").on(t.number)],
);

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id").references(() => productVariants.id),
  productId: uuid("product_id").references(() => products.id),
  title: text("title").notNull(),
  variantTitle: text("variant_title").notNull().default(""),
  sku: text("sku").notNull().default(""),
  quantity: integer("quantity").notNull(),
  unitPriceAmount: numeric("unit_price_amount", {
    precision: 12,
    scale: 2,
  }).notNull(),
  imageUrl: text("image_url"),
});

export const orderAddresses = pgTable("order_addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  fullName: text("full_name").notNull(),
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: text("city").notNull(),
  region: text("region"),
  postalCode: text("postal_code"),
  country: text("country").notNull(),
  phone: text("phone"),
  area: text("area"),
  instructions: text("instructions"),
});

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  provider: text("provider").notNull().default("manual"),
  providerRef: text("provider_ref"),
  status: text("status").notNull().default("pending"),
  method: text("method").notNull().default("cod"),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("PKR"),
  receiptPath: text("receipt_path"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const orderStatusHistory = pgTable("order_status_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  kind: text("kind").notNull(),
  fromStatus: text("from_status"),
  toStatus: text("to_status").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const shippingZones = pgTable("shipping_zones", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  deliveryCharge: numeric("delivery_charge", { precision: 12, scale: 2 }).notNull(),
  estimatedDays: integer("estimated_days").notNull(),
  isActive: integer("is_active").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  source: text("source").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const refunds = pgTable("refunds", {
  id: uuid("id").defaultRandom().primaryKey(),
  paymentId: uuid("payment_id")
    .notNull()
    .references(() => payments.id),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const shipments = pgTable("shipments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  carrier: text("carrier"),
  trackingNumber: text("tracking_number"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const discounts = pgTable("discounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull().unique(),
  type: text("type").notNull(),
  value: numeric("value", { precision: 12, scale: 2 }).notNull(),
  isActive: integer("is_active").notNull().default(1),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  minOrderAmount: numeric("min_order_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  usageLimit: integer("usage_limit"),
  perCustomerLimit: integer("per_customer_limit"),
});

export const couponUsages = pgTable("coupon_usages", {
  id: uuid("id").defaultRandom().primaryKey(),
  couponId: uuid("coupon_id").notNull().references(() => discounts.id),
  orderId: uuid("order_id").notNull().references(() => orders.id),
  customerId: uuid("customer_id").notNull().references(() => customers.id),
  discountAmount: numeric("discount_amount", { precision: 12, scale: 2 }).notNull(),
  releasedAt: timestamp("released_at", { withTimezone: true }),
});

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").references(() => customers.id),
  rating: integer("rating").notNull(),
  title: text("title"),
  body: text("body"),
  isApproved: integer("is_approved").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
