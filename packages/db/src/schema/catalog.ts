import {
  boolean,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { publishStatusEnum } from "./identity";

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    status: publishStatusEnum("status").notNull().default("draft"),
    priceAmount: numeric("price_amount", { precision: 12, scale: 2 }).notNull(),
    priceCurrency: text("price_currency").notNull().default("PKR"),
    compareAtAmount: numeric("compare_at_amount", {
      precision: 12,
      scale: 2,
    }),
    label: text("label"),
    material: text("material"),
    color: text("color"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    uniqueIndex("products_slug_uq").on(t.slug),
    index("products_status_idx").on(t.status),
  ],
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    sku: text("sku").notNull(),
    title: text("title").notNull(),
    priceAmount: numeric("price_amount", { precision: 12, scale: 2 }).notNull(),
    priceCurrency: text("price_currency").notNull().default("PKR"),
    inventoryQuantity: integer("inventory_quantity").notNull().default(0),
    isDefault: boolean("is_default").default(false).notNull(),
    compareAtAmount: numeric("compare_at_amount", { precision: 12, scale: 2 }),
    reorderLevel: integer("reorder_level").notNull().default(10),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [uniqueIndex("product_variants_sku_uq").on(t.sku)],
);

export const productImages = pgTable("product_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  alt: text("alt"),
  sortOrder: integer("sort_order").notNull().default(0),
  isPrimary: boolean("is_primary").default(false).notNull(),
  isHover: boolean("is_hover").default(false).notNull(),
  storagePath: text("storage_path"),
});

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    parentId: uuid("parent_id"),
    sortOrder: integer("sort_order").notNull().default(0),
    status: publishStatusEnum("status").notNull().default("published"),
    imageUrl: text("image_url"),
    imageStoragePath: text("image_storage_path"),
  },
  (t) => [uniqueIndex("categories_slug_uq").on(t.slug)],
);

export const categoryProducts = pgTable(
  "category_products",
  {
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [
    uniqueIndex("category_products_uq").on(t.categoryId, t.productId),
  ],
);

export const collections = pgTable(
  "collections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    status: publishStatusEnum("status").notNull().default("draft"),
  },
  (t) => [uniqueIndex("collections_slug_uq").on(t.slug)],
);

export const collectionProducts = pgTable(
  "collection_products",
  {
    collectionId: uuid("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [
    uniqueIndex("collection_products_uq").on(t.collectionId, t.productId),
  ],
);

export const inventoryLocations = pgTable("inventory_locations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
});

export const inventoryItems = pgTable(
  "inventory_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    variantId: uuid("variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    locationId: uuid("location_id")
      .notNull()
      .references(() => inventoryLocations.id),
    quantity: integer("quantity").notNull().default(0),
  },
  (t) => [
    uniqueIndex("inventory_items_uq").on(t.variantId, t.locationId),
  ],
);

export const inventoryMovements = pgTable("inventory_movements", {
  id: uuid("id").defaultRandom().primaryKey(),
  variantId: uuid("variant_id")
    .notNull()
    .references(() => productVariants.id),
  locationId: uuid("location_id")
    .notNull()
    .references(() => inventoryLocations.id),
  delta: integer("delta").notNull(),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
