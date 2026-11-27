import { describe, expect, it } from "vitest";
import { getTableColumns } from "drizzle-orm";
import { products, productImages, categories } from "../../packages/db/src/schema/catalog";
import { publishStatusEnum } from "../../packages/db/src/schema/identity";

describe("catalog schema matches the Supabase migrations", () => {
  it("publish status includes archived", () => {
    expect(publishStatusEnum.enumValues).toEqual(["draft", "published", "scheduled", "archived"]);
  });

  it("catalog tables expose the columns the migrations added", () => {
    const p = getTableColumns(products) as Record<string, { name: string }>;
    expect(p.material?.name).toBe("material");
    expect(p.color?.name).toBe("color");
    const i = getTableColumns(productImages) as Record<string, { name: string }>;
    expect(i.storagePath?.name).toBe("storage_path");
    const c = getTableColumns(categories) as Record<string, { name: string }>;
    expect([c.status?.name, c.imageUrl?.name, c.imageStoragePath?.name]).toEqual(["status", "image_url", "image_storage_path"]);
  });
});
