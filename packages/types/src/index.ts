export type Money = {
  amount: number;
  currency: string;
};

export type PublishStatus = "draft" | "published" | "scheduled";

export type StaffRole =
  | "super_admin"
  | "admin"
  | "manager"
  | "editor"
  | "inventory_manager"
  | "support";

export type Permission =
  | "products.read"
  | "products.write"
  | "inventory.read"
  | "inventory.write"
  | "orders.read"
  | "orders.write"
  | "customers.read"
  | "customers.write"
  | "cms.read"
  | "cms.write"
  | "cms.publish"
  | "media.read"
  | "media.write"
  | "users.read"
  | "users.write"
  | "settings.read"
  | "settings.write"
  | "analytics.read";

export type ProductDto = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  status: PublishStatus;
  price: Money;
  compareAtPrice: Money | null;
  primaryImageUrl: string | null;
  hoverImageUrl: string | null;
  label: string | null;
};

export type ProductVariantDto = {
  id: string;
  productId: string;
  sku: string;
  title: string;
  price: Money;
  inventoryQuantity: number;
};

export type CategoryDto = {
  id: string;
  slug: string;
  name: string;
  parentId: string | null;
};

export type CollectionDto = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
};

export type CartItemDto = {
  id: string;
  variantId: string;
  productId: string;
  title: string;
  quantity: number;
  unitPrice: Money;
  imageUrl: string | null;
};

export type CartDto = {
  id: string;
  items: CartItemDto[];
  subtotal: Money;
};

export type OrderStatus =
  | "pending"
  | "paid"
  | "fulfilled"
  | "cancelled"
  | "refunded";

export type OrderDto = {
  id: string;
  number: string;
  status: OrderStatus;
  total: Money;
  createdAt: string;
};

export type CmsBlockType =
  | "announcement"
  | "hero"
  | "video"
  | "collection_tabs"
  | "banner"
  | "product_grid"
  | "newsletter"
  | "rich_text";

export type CmsBlockDto = {
  id: string;
  type: CmsBlockType;
  sortOrder: number;
  data: Record<string, unknown>;
};

export type CmsPageDto = {
  id: string;
  slug: string;
  title: string;
  status: PublishStatus;
  seoTitle: string | null;
  seoDescription: string | null;
  blocks: CmsBlockDto[];
};

export type NavItemDto = {
  id: string;
  label: string;
  href: string;
  children: NavItemDto[];
};

export type MediaAssetDto = {
  id: string;
  url: string;
  alt: string | null;
  mimeType: string;
  width: number | null;
  height: number | null;
};

export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};
