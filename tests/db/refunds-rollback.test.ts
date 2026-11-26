import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { afterAll, describe, expect, it } from "vitest";
import { customer, insert, order } from "./factory";
import { connect, failureOf, rolledBack, type Tx } from "./helpers";

const sql = connect();
afterAll(() => sql.end());

async function paid(tx: Tx, amount: number) {
  const o = await order(tx, (await customer(tx)).id);
  return insert(tx, "payments", { order_id: o.id, method: "cod", amount });
}
const refund = (tx: Tx, paymentId: string, amount: number) => insert(tx, "refunds", { payment_id: paymentId, amount });

describe("refunds", () => {
  it("may add up to the payment and no more", async () => {
    await rolledBack(sql, async (tx) => {
      const payment = await paid(tx, 100);
      await refund(tx, payment.id, 60);
      const last = await refund(tx, payment.id, 40);
      expect(await failureOf(tx, (s) => refund(s, payment.id, 1))).toContain("refund_exceeds_payment");
      expect(await failureOf(tx, (s) => s`update refunds set amount = 41 where id = ${last.id}`)).toContain("refund_exceeds_payment");
    });
  });

  it("cannot be exceeded by two simultaneous requests", async () => {
    const pool = connect(undefined, 2);
    const payment = await sql.begin((tx) => paid(tx, 100));
    try {
      const attempt = () => pool.begin(async (tx) => {
        await refund(tx, payment.id, 80);
        await tx`select pg_sleep(0.3)`;
      });
      const results = await Promise.allSettled([attempt(), attempt()]);
      expect(results.map((r) => r.status).sort()).toEqual(["fulfilled", "rejected"]);
    } finally {
      // local test data only
      await sql`delete from refunds where payment_id = ${payment.id}`;
      await sql`delete from payments where id = ${payment.id}`;
      const [gone] = await sql`delete from orders where id = ${payment.order_id} returning customer_id`;
      await sql`delete from customers where id = ${gone!.customer_id}`;
      await pool.end();
    }
  });
});

// Runs a rollback file the way the runbook does (psql, stop on first error).
const runFile = (path: string) =>
  execFileSync("docker", ["exec", "-i", "supabase_db_dec-walls", "psql", "-U", "postgres", "-q", "-v", "ON_ERROR_STOP=1"],
    { input: readFileSync(path), stdio: ["pipe", "ignore", "pipe"] });

describe("rollback files", () => {
  it("change nothing when they fail part way", async () => {
    const counts = () => sql`select (select count(*)::int from banners) as banners, (select count(*)::int from settings) as settings,
      (select count(*)::int from shipping_zones) as zones, (select count(*)::int from product_variants) as variants`;
    const made = await sql.begin(async (tx) => {
      const [size] = await tx`select id from product_variants where sku like 'FKH-137-KHAISE-SINGLE%'`;
      const o = await order(tx, null);
      await insert(tx, "order_items", { order_id: o.id, variant_id: size!.id, title: "T", variant_title: "V", sku: "S", quantity: 1, unit_price_amount: 1 });
      return o;
    });
    try {
      const [before] = await counts();
      expect(() => runFile("supabase/rollback/20261127000400_backfill.sql")).toThrow();
      expect((await counts())[0]).toEqual(before);
    } finally {
      await sql`delete from order_items where order_id = ${made.id}`;
      await sql`delete from orders where id = ${made.id}`;
    }
  });
});
