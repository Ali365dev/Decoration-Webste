import { afterAll, describe, expect, it } from "vitest";
import { readOnly, runPreflight, takeSnapshot } from "../../scripts/db/lib.mjs";
import { product, variant } from "./factory";
import { connect, LOCAL_DATABASE_URL, rolledBack } from "./helpers";

const sql = connect();
afterAll(() => sql.end());
const failing = (results: { rule: string; violations: number }[]) => results.filter((r) => r.violations > 0).map((r) => r.rule);

describe("preflight", () => {
  it("passes on the migrated catalog", async () => {
    await rolledBack(sql, async (tx) => {
      // Banners are filled by the backfill, so that emptiness rule only holds before migrating.
      expect(failing(await runPreflight(tx))).toEqual(["banners must be empty"]);
    });
  });

  it("names the rule that a duplicate SKU breaks", async () => {
    await rolledBack(sql, async (tx) => {
      await tx`drop index product_variants_sku_lower_uq`;
      const p = await product(tx);
      await variant(tx, p.id, { sku: "dup-1x" });
      await variant(tx, p.id, { sku: "DUP-1X" });
      expect(failing(await runPreflight(tx))).toContain("SKUs unique ignoring case");
    });
  });

  it("cannot write, even by mistake", async () => {
    await expect(readOnly(LOCAL_DATABASE_URL, (tx) => tx`update products set name = name`)).rejects.toThrow(/read-only/i);
  });

  it("summarises the catalog without printing rows", async () => {
    const snapshot = await readOnly(LOCAL_DATABASE_URL, takeSnapshot);
    expect(snapshot.counts.products).toBe(109);
    expect(snapshot.productSlugs).toMatch(/^[0-9a-f]{32}$/);
    expect(snapshot.imageUrls).toMatch(/^[0-9a-f]{32}$/);
  });
});
