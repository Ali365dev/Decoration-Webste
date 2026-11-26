import type postgres from "../../node_modules/postgres";

export function readOnly<T>(url: string, work: (tx: postgres.TransactionSql) => T | Promise<T>): Promise<T>;
export function targetUrl(): string;
export function runPreflight(tx: postgres.TransactionSql): Promise<{ rule: string; violations: number }[]>;
export function takeSnapshot(
  tx: postgres.TransactionSql,
): Promise<{ counts: Record<string, number>; productSlugs: string; imageUrls: string }>;
