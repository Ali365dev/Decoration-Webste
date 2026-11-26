const STATUS_STEP: Record<string, number> = {
  pending: 0,
  processing: 1,
  shipped: 3,
  delivered: 4,
  cancelled: 0,
  returned: 0,
};

export function mapOrderStatus(status: string): number {
  return STATUS_STEP[status] ?? 0;
}
