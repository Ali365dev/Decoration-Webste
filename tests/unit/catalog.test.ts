import { describe, expect, it } from "vitest";
import { listProducts, getProductBySlug } from "../../packages/domain/src/catalog";

describe("catalog domain", () => {
  it("lists published products", async () => {
    const result = await listProducts({ page: 1, pageSize: 10 });
    expect(result.total).toBeGreaterThan(0);
    expect(result.items.every((p) => p.status === "published")).toBe(true);
  });

  it("loads a product by slug", async () => {
    const product = await getProductBySlug("quilt-bed-sheet");
    expect(product?.name).toContain("Quilt");
  });
});
