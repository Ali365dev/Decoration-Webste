import { describe, expect, it } from "vitest";
import { categoryInputSchema } from "../../apps/storefront/app/api/admin/categories/_category-input";

describe("categoryInputSchema", () => {
  it("defaults status to published and nulls to null", () => {
    expect(categoryInputSchema.parse({ name: "Wall Art" })).toEqual({
      name: "Wall Art",
      parentId: null,
      status: "published",
      imageUrl: null,
      imagePublicId: null,
    });
  });

  it("treats an empty parent as no parent", () => {
    expect(categoryInputSchema.parse({ name: "x", parentId: "" }).parentId).toBeNull();
  });

  it("rejects an empty name", () => {
    expect(() => categoryInputSchema.parse({ name: "  " })).toThrow();
  });

  it("rejects a non-uuid parent", () => {
    expect(() => categoryInputSchema.parse({ name: "x", parentId: "12" })).toThrow();
  });
});
