export type OrderStatusRow = { status: string };

const STATUS_STEP: Record<string, number> = {
  pending: 0,
  paid: 1,
  processing: 1,
  fulfilled: 2,
  shipped: 3,
  delivered: 4,
  cancelled: 0,
  refunded: 0,
};

export function mapOrderStatus(status: string): number {
  return STATUS_STEP[status] ?? 0;
}
