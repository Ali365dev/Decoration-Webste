import { describe, expect, it } from "vitest";
import { getPublishedPageBySlug } from "../../packages/domain/src/cms";

describe("cms homepage", () => {
  it("resolves home page blocks for storefront", async () => {
    const page = await getPublishedPageBySlug("home");
    expect(page?.status).toBe("published");
    expect(page?.blocks.some((b) => b.type === "hero")).toBe(true);
    expect(page?.blocks.some((b) => b.type === "product_grid")).toBe(true);
  });
});
