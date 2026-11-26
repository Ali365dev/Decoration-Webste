import { randomUUID } from "node:crypto";
import { sql as q } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "../../packages/db/src/client";
import { withCustomer } from "../../packages/db/src/with-customer";
import { connect, LOCAL_DATABASE_URL } from "./helpers";
import { person } from "./people";

// Transaction-mode pooler of the local stack (supabase/config.toml).
const POOLER_URL = process.env.TEST_POOLER_URL ?? "postgresql://postgres.pooler-dev:postgres@127.0.0.1:54329/postgres";

const admin = connect();
let people: Awaited<ReturnType<typeof person>>[] = [];

beforeAll(async () => {
  people = [await admin.begin((tx) => person(tx)), await admin.begin((tx) => person(tx))];
});

afterAll(async () => {
  // local test data only
  for (const p of people) {
    for (const table of ["order_status_history", "payments", "order_addresses", "order_items"]) {
      await admin`delete from ${admin(table)} where order_id = ${p.order.id}`;
    }
    await admin`delete from orders where id = ${p.order.id}`;
    await admin`delete from customers where id = ${p.customer.id}`;
    await admin`delete from auth.users where id = ${p.authUserId}`;
  }
  await admin.end();
});

describe.each([
  ["direct connection", LOCAL_DATABASE_URL],
  ["transaction pooler", POOLER_URL],
])("withCustomer over the %s", (_name, url) => {
  const single = connect(url, 1);
  const pool = connect(url, 5);
  const db = drizzle(single) as unknown as Database;
  const pooled = drizzle(pool) as unknown as Database;
  afterAll(async () => {
    await single.end();
    await pool.end();
  });

  const whoami = q`select current_user as role, auth.uid() as uid`;
  const expectClean = async () => {
    const [row] = await db.execute(whoami);
    expect(row).toEqual({ role: "postgres", uid: null });
  };

  it("runs the work as that customer", async () => {
    const [a] = people;
    const seen = await withCustomer(db, a!.authUserId, async (tx) => ({
      who: (await tx.execute(whoami))[0],
      orders: await tx.execute(q`select id from orders`),
    }));
    expect(seen.who).toEqual({ role: "authenticated", uid: a!.authUserId });
    expect([...seen.orders]).toEqual([{ id: a!.order.id }]);
  });

  it("leaves no identity behind after success", async () => {
    await withCustomer(db, people[0]!.authUserId, async () => {});
    await expectClean();
  });

  it("leaves no identity behind, and no writes, after an error", async () => {
    const [a] = people;
    await expect(withCustomer(db, a!.authUserId, async (tx) => {
      await tx.execute(q`update customers set full_name = 'rolled back' where id = ${a!.customer.id}`);
      throw new Error("boom");
    })).rejects.toThrow("boom");
    await expectClean();
    const [row] = await admin`select full_name from customers where id = ${a!.customer.id}`;
    expect(row!.full_name).toBe("Test Customer");
  });

  it("never shows one customer another's order under load", async () => {
    const results = await Promise.all(Array.from({ length: 50 }, (_, i) => {
      const p = people[i % 2]!;
      return withCustomer(pooled, p.authUserId, async (tx) => ({
        expected: p.order.id,
        ids: [...(await tx.execute(q`select id from orders, pg_sleep(0.01)`))].map((r) => r.id),
      }));
    }));
    for (const r of results) expect(r.ids).toEqual([r.expected]);
  });

  it.each(["", "not-a-uuid", "x'; reset role; --", `${randomUUID()}; reset role`])(
    "rejects the id %j before opening a transaction", async (bad) => {
      let ran = false;
      await expect(withCustomer(db, bad, async () => { ran = true; })).rejects.toThrow(/user id/i);
      expect(ran).toBe(false);
      await expectClean();
    });
});
