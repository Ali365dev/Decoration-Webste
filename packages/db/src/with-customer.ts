import { sql } from "drizzle-orm";
import type { Database } from "./client";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type CustomerTx = Parameters<Parameters<Database["transaction"]>[0]>[0];

/**
 * Runs customer queries under row level security (DATABASE_ARCHITECTURE.md section 2.1).
 *
 * `authUserId` MUST come from a session verified with the auth server, never from request input.
 * Inside `work`, use only `tx`: any other connection runs as `postgres` and skips the rules.
 * Some columns are hidden from customers, so select columns by name; selecting a whole table
 * such as `orders` or `payments` is refused.
 */
export async function withCustomer<T>(
  db: Database,
  authUserId: string,
  work: (tx: CustomerTx) => Promise<T>,
): Promise<T> {
  if (!UUID.test(authUserId)) {
    throw new Error("withCustomer needs a verified user id");
  }
  const claims = JSON.stringify({ sub: authUserId, role: "authenticated" });
  return db.transaction(async (tx) => {
    // Both settings are transaction-local, so a pooled connection never keeps them.
    await tx.execute(sql`set local role authenticated`);
    await tx.execute(sql`select set_config('request.jwt.claims', ${claims}, true)`);
    return work(tx);
  });
}
