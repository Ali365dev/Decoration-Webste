import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { signUploadParams, UPLOAD_FOLDERS } from "../../apps/storefront/app/api/admin/uploads/_sign";
import { POST } from "../../apps/storefront/app/api/admin/uploads/sign/route";

const SECRET = "super-secret-value-xyz";

function req(body: unknown, key?: string) {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (key) headers["x-admin-key"] = key;
  return new NextRequest("http://x/api/admin/uploads/sign", { method: "POST", headers, body: JSON.stringify(body) });
}

describe("signUploadParams", () => {
  it("matches Cloudinary's documented signature", () => {
    expect(
      signUploadParams({ eager: "w_400,h_300,c_pad|w_260,h_200,c_crop", public_id: "sample_image", timestamp: 1315060510 }, "abcd"),
    ).toBe("bfd09f95f331f558cbd1320e67aa8d488770583e");
  });

  it("is independent of key order", () => {
    expect(signUploadParams({ timestamp: 1, folder: "a" }, "s")).toBe(signUploadParams({ folder: "a", timestamp: 1 }, "s"));
  });

  it("allows only the product, category and storefront content folders", () => {
    expect(UPLOAD_FOLDERS).toEqual(["dec-walls/products", "dec-walls/categories", "dec-walls/storefront"]);
  });
});

describe("POST /api/admin/uploads/sign", () => {
  afterEach(() => vi.unstubAllEnvs());

  function env(withCloudinary = true) {
    vi.stubEnv("ADMIN_API_KEY", "k");
    vi.stubEnv("CLOUDINARY_CLOUD_NAME", withCloudinary ? "demo" : "");
    vi.stubEnv("CLOUDINARY_API_KEY", withCloudinary ? "123" : "");
    vi.stubEnv("CLOUDINARY_API_SECRET", withCloudinary ? SECRET : "");
  }

  it("refuses without the admin key", async () => {
    env();
    expect((await POST(req({ folder: "dec-walls/products" }))).status).toBe(401);
  });

  it("refuses an unknown folder", async () => {
    env();
    expect((await POST(req({ folder: "other" }, "k"))).status).toBe(400);
  });

  it("says when Cloudinary is not configured", async () => {
    env(false);
    const res = await POST(req({ folder: "dec-walls/products" }, "k"));
    expect(res.status).toBe(503);
    expect((await res.json()).error).toBe("Cloudinary not configured");
  });

  it("returns a valid signature and never the secret", async () => {
    env();
    const res = await POST(req({ folder: "dec-walls/categories" }, "k"));
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).not.toContain(SECRET);
    const { data } = JSON.parse(text);
    expect(data).toMatchObject({ cloudName: "demo", apiKey: "123", folder: "dec-walls/categories" });
    expect(data.signature).toBe(signUploadParams({ folder: data.folder, timestamp: data.timestamp }, SECRET));
  });
});
