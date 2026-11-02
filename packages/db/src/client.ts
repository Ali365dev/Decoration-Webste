import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getEnv, hasDatabase } from "@dec-walls/config";
import * as schema from "./schema";

export type Database = ReturnType<typeof createDb>;

let client: ReturnType<typeof postgres> | null = null;
let db: Database | null = null;

export function createDb(connectionString?: string) {
  const url =
    connectionString ??
    getEnv().DATABASE_URL ??
    "postgresql://postgres:postgres@127.0.0.1:54322/postgres";
  const sql = postgres(url, { prepare: false, max: 10 });
  return drizzle(sql, { schema });
}

export function getDb(): Database | null {
  if (!hasDatabase() && !process.env.DATABASE_URL) {
    return null;
  }
  if (!db) {
    client = postgres(
      getEnv().DATABASE_URL ??
        "postgresql://postgres:postgres@127.0.0.1:54322/postgres",
      { prepare: false, max: 10 },
    );
    db = drizzle(client, { schema });
  }
  return db;
}

export { schema };
