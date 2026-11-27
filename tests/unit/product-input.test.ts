import { describe, expect, it } from "vitest";
import {
  productInputSchema,
  slugify,
  nextFreeSlug,
  buildVariantRows,
  planVariantChanges,
  InputError,
  type ProductInput,
} from "../../apps/storefront/app/api/admin/products/_product-input";

const base = {
  name: "Ocean Blue",
  description: null,
  priceAmount: 1999,
  compareAtAmount: null,
  material: null,
  sku: "WP",
  stock: 5,
  categoryId: null,
};
const parse = (over: Record<string, unknown> = {}) => productInputSchema.parse({ ...base, ...over }) as ProductInput;

describe("productInputSchema", () => {
  it("turns compareAtAmount 0 into null and fills defaults", () => {
    const p = parse({ compareAtAmount: 0 });
    expect(p.compareAtAmount).toBeNull();
    expect(p.status).toBe("draft");
    expect(p.collectionIds).toEqual([]);
    expect(p.variants).toEqual([]);
    expect(p.images).toEqual([]);
  });

  it("rejects zero price, negative stock and unknown status", () => {
    expect(() => parse({ priceAmount: 0 })).toThrow();
    expect(() => parse({ stock: -1 })).toThrow();
    expect(() => parse({ status: "deleted" })).toThrow();
  });

  it("accepts numeric strings from form inputs", () => {
    expect(parse({ priceAmount: "2500", stock: "3" })).toMatchObject({ priceAmount: 2500, stock: 3 });
  });
});

describe("slugs", () => {
  it("slugify lowercases and dashes non-alphanumerics", () => {
    expect(slugify('Ocean Blue 24×36"')).toBe("ocean-blue-24-36");
  });

  it("nextFreeSlug picks the first free suffix", () => {
    expect(nextFreeSlug("wall", ["wall", "wall-2"])).toBe("wall-3");
    expect(nextFreeSlug("wall", [])).toBe("wall");
  });
});

describe("buildVariantRows", () => {
  it("makes one default row when there are no sizes", () => {
    expect(buildVariantRows(parse())).toEqual([
      { sku: "WP", title: "Default", priceAmount: "1999", inventoryQuantity: 5, isDefault: true, sortOrder: 0, isActive: true },
    ]);
  });

  it("makes one row per size with derived SKUs, first is default", () => {
    const rows = buildVariantRows(
      parse({ variants: [{ title: "A4", priceAmount: 2500, inventoryQuantity: 3 }, { title: "A3", priceAmount: 3000, inventoryQuantity: 1 }] }),
    );
    expect(rows.map((r) => r.sku)).toEqual(["WP-a4", "WP-a3"]);
    expect(rows.map((r) => r.isDefault)).toEqual([true, false]);
    expect(rows.map((r) => r.sortOrder)).toEqual([0, 1]);
  });

  it("throws InputError when two sizes share a SKU", () => {
    const input = parse({
      variants: [
        { title: "A4", priceAmount: 1, inventoryQuantity: 0, sku: "X" },
        { title: "A3", priceAmount: 1, inventoryQuantity: 0, sku: "X" },
      ],
    });
    expect(() => buildVariantRows(input)).toThrow(InputError);
  });
});

describe("planVariantChanges", () => {
  it("updates matches, inserts new, deactivates missing — by SKU", () => {
    const rows = buildVariantRows(
      parse({ variants: [{ title: "B", priceAmount: 1, inventoryQuantity: 0, sku: "B" }, { title: "C", priceAmount: 1, inventoryQuantity: 0, sku: "C" }] }),
    );
    const plan = planVariantChanges([{ id: "1", sku: "A" }, { id: "2", sku: "B" }], rows);
    expect(plan.update.map((u) => [u.id, u.row.sku])).toEqual([["2", "B"]]);
    expect(plan.insert.map((r) => r.sku)).toEqual(["C"]);
    expect(plan.deactivate).toEqual(["1"]);
  });
});
