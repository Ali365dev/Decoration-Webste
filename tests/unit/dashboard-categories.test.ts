import { afterEach, describe, expect, it, vi } from "vitest";
import axios from "../../apps/dashboard/node_modules/axios";
import { getCategories } from "../../apps/dashboard/src/services/categories.js";

const rows = [
  { id: "1", slug: "wall-art", name: "Wall Art", parentId: null, status: "published", imageUrl: "https://res.cloudinary.com/x.jpg", imageStoragePath: "x", productCount: 2 },
  { id: "2", slug: "bedding", name: "Bedding", parentId: null, status: "draft", imageUrl: null, imageStoragePath: null, productCount: 0 },
];

afterEach(() => vi.restoreAllMocks());

describe("getCategories", () => {
  it("maps image and its Cloudinary id", async () => {
    vi.spyOn(axios, "get").mockResolvedValue({ data: { data: rows } });
    const { categories } = await getCategories();
    expect(categories[0]).toMatchObject({ image: "https://res.cloudinary.com/x.jpg", imagePublicId: "x", status: "published" });
  });

  it("filters by search text on name or slug", async () => {
    vi.spyOn(axios, "get").mockResolvedValue({ data: { data: rows } });
    expect((await getCategories({ q: "wall" })).categories.map((c) => c.id)).toEqual(["1"]);
    expect((await getCategories({ q: "BED" })).categories.map((c) => c.id)).toEqual(["2"]);
  });

  it("filters by status, empty means all", async () => {
    vi.spyOn(axios, "get").mockResolvedValue({ data: { data: rows } });
    expect((await getCategories({ status: "draft" })).categories.map((c) => c.id)).toEqual(["2"]);
    expect((await getCategories({ q: "", status: "" })).total).toBe(2);
  });

  it("keeps the full list in allData for parent pickers", async () => {
    vi.spyOn(axios, "get").mockResolvedValue({ data: { data: rows } });
    expect((await getCategories({ q: "wall" })).allData).toHaveLength(2);
  });
});
