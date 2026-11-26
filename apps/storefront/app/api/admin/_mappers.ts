export interface OrderRow {
  id: string;
  number: string;
  status: string;
  total: number;
  createdAt: Date;
  customerEmail: string | null;
  customerName: string | null;
}

export interface CustomerRow {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  city: string | null;
  createdAt: Date;
  orderCount: number;
  totalSpent: number;
}

export interface VariantRow {
  id: string;
  productId: string;
  sku: string | null;
  inventoryQuantity: number;
  price: number;
  productName: string;
  productSlug: string;
  productStatus: string;
}

export function mapOrderRow(row: OrderRow) {
  return {
    id: row.id,
    orderNumber: row.number,
    status: row.status,
    total: Number(row.total),
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
    customer: {
      email: row.customerEmail ?? "",
      name: row.customerName ?? "Guest",
    },
  };
}

export function mapCustomerRow(row: CustomerRow) {
  return {
    id: row.id,
    email: row.email,
    fullName: row.fullName ?? "",
    phone: row.phone ?? "",
    city: row.city ?? "",
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
    orderCount: Number(row.orderCount ?? 0),
    totalSpent: Number(row.totalSpent ?? 0),
  };
}

export function mapVariantRow(row: VariantRow) {
  return {
    id: row.id,
    productId: row.productId,
    sku: row.sku ?? "",
    stock: Number(row.inventoryQuantity),
    price: Number(row.price),
    productName: row.productName,
    productSlug: row.productSlug,
    productStatus: row.productStatus,
  };
}
