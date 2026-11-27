import { afterEach, describe, expect, it, vi } from "vitest";
import axios from "../../apps/dashboard/node_modules/axios";
import { uploadImages } from "../../apps/dashboard/src/services/uploads.js";
import { createCategory, updateCategory, deleteCategory } from "../../apps/dashboard/src/services/categories.js";
import { apiError } from "../../apps/dashboard/src/services/products.js";

const sign = { data: { data: { cloudName: "demo", apiKey: "123", timestamp: 1, signature: "sig", folder: "dec-walls/products" } } };

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("uploadImages", () => {
  it("uploads only new files, signs once per file, keeps order", async () => {
    const post = vi.spyOn(axios, "post").mockResolvedValue(sign);
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ secure_url: "https://res.cloudinary.com/new.jpg", public_id: "new" }) });
    vi.stubGlobal("fetch", fetchMock);
    const file = new Blob(["x"], { type: "image/png" });

    const out = await uploadImages([{ url: "a", publicId: "p" }, { url: "data:...", file }], "dec-walls/products");

    expect(out).toEqual([{ url: "a", publicId: "p" }, { url: "https://res.cloudinary.com/new.jpg", publicId: "new" }]);
    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith("/api/admin/uploads/sign", { folder: "dec-walls/products" });
    expect(fetchMock.mock.calls[0][0]).toBe("https://api.cloudinary.com/v1_1/demo/image/upload");
    const sent = fetchMock.mock.calls[0][1].body as FormData;
    expect([sent.get("api_key"), sent.get("timestamp"), sent.get("signature"), sent.get("folder")]).toEqual(["123", "1", "sig", "dec-walls/products"]);
  });

  it("rejects with Cloudinary's message when an upload fails", async () => {
    vi.spyOn(axios, "post").mockResolvedValue(sign);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: { message: "Invalid Signature" } }) }));
    await expect(uploadImages([{ url: "d", file: new Blob(["x"]) }], "dec-walls/products")).rejects.toThrow("Invalid Signature");
  });
});

describe("category writes", () => {
  it("createCategory posts to the real API", async () => {
    const post = vi.spyOn(axios, "post").mockResolvedValue({ data: { data: { id: "c1" } } });
    expect(await createCategory({ name: "Wall Art" })).toEqual({ id: "c1" });
    expect(post).toHaveBeenCalledWith("/api/admin/categories", { name: "Wall Art" });
  });

  it("updateCategory and deleteCategory use the id route", async () => {
    const put = vi.spyOn(axios, "put").mockResolvedValue({ data: { data: { id: "c1" } } });
    const del = vi.spyOn(axios, "delete").mockResolvedValue({ data: { data: { id: "c1" } } });
    await updateCategory("c1", { name: "x" });
    await deleteCategory("c1");
    expect(put).toHaveBeenCalledWith("/api/admin/categories/c1", { name: "x" });
    expect(del).toHaveBeenCalledWith("/api/admin/categories/c1");
  });

  it("rethrows with the API's error message", async () => {
    vi.spyOn(axios, "delete").mockRejectedValue({ response: { data: { error: "This category has sub-categories. Move or delete them first." } } });
    await expect(deleteCategory("c1")).rejects.toThrow("This category has sub-categories");
  });
});

describe("apiError", () => {
  it("prefers the API's error text, else the error message", () => {
    expect(apiError({ response: { data: { error: "SKU already in use: X" } } })).toBe("SKU already in use: X");
    expect(apiError(new Error("Network Error"))).toBe("Network Error");
  });
});
