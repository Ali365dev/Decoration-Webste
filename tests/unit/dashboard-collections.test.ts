import { afterEach, describe, expect, it, vi } from "vitest";
import axios from "../../apps/dashboard/node_modules/axios";
import { getCollections } from "../../apps/dashboard/src/services/collections.js";

afterEach(() => vi.restoreAllMocks());

describe("getCollections", () => {
  it("gives every collection a product count and a product id list, so the table and editor never crash", async () => {
    vi.spyOn(axios, "get").mockResolvedValue({
      data: { data: [{ id: "c1", slug: "bedding", name: "Bedding", description: null, status: "published", productCount: 5 }] },
    });
    const { collections } = await getCollections();
    expect(collections[0]).toMatchObject({ slug: "bedding", productCount: 5, productIds: [], description: "" });
  });
});
