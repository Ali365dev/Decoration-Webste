import { createRequire } from "node:module";
import type postgresType from "../../node_modules/postgres";

// `postgres` is a dependency of packages/db, so resolve it from there.
const requireFromDb = createRequire(new URL("../../packages/db/package.json", import.meta.url));
const postgres = requireFromDb("postgres") as typeof postgresType;

const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost"]);
export const LOCAL_DATABASE_URL = "postgresql://postgres:postgres@127.0.0.1:54322/postgres";

/** Throws unless the connection string can only reach this machine. */
export function assertLocalUrl(url: string): string {
  const parsed = new URL(url);
  const override = parsed.searchParams.has("host") || parsed.searchParams.has("hostaddr");
  if (!LOCAL_HOSTS.has(parsed.hostname) || override) {
    throw new Error(`Database tests only run against a local database, not "${parsed.hostname}"`);
  }
  return url;
}

export function connect(url = process.env.TEST_DATABASE_URL ?? LOCAL_DATABASE_URL, max = 1) {
  return postgres(assertLocalUrl(url), { prepare: false, max, onnotice: () => {} });
}

export type Sql = ReturnType<typeof connect>;
export type Tx = postgresType.TransactionSql;

class Rollback extends Error {}

/** Runs work in a transaction that is always rolled back. */
export async function rolledBack<T>(sql: Sql, work: (tx: Tx) => Promise<T>): Promise<T> {
  let result: T | undefined;
  try {
    await sql.begin(async (tx) => {
      result = await work(tx);
      throw new Rollback();
    });
  } catch (error) {
    if (!(error instanceof Rollback)) throw error;
  }
  return result as T;
}

/** Switches the current transaction to a public API role. */
export async function becomeRole(tx: Tx, role: "anon" | "authenticated", authUserId: string | null) {
  await tx.unsafe(`set local role ${role}`);
  const claims = JSON.stringify(authUserId ? { sub: authUserId, role } : { role });
  await tx`select set_config('request.jwt.claims', ${claims}, true)`;
}

export function asRole<T>(
  sql: Sql,
  role: "anon" | "authenticated",
  authUserId: string | null,
  work: (tx: Tx) => Promise<T>,
): Promise<T> {
  return rolledBack(sql, async (tx) => {
    await becomeRole(tx, role, authUserId);
    return work(tx);
  });
}

/**
 * Runs a statement inside a savepoint and reports how it failed, so one
 * transaction can check several refusals. Returns null if it succeeded.
 */
export async function failureOf(tx: Tx, run: (sp: Tx) => Promise<unknown>): Promise<string | null> {
  try {
    await tx.savepoint(async (sp) => {
      await run(sp as unknown as Tx);
    });
    return null;
  } catch (error) {
    const e = error as { code?: string; message: string; constraint_name?: string };
    return `${e.code ?? ""} ${e.constraint_name ?? ""} ${e.message}`;
  }
}
