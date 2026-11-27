import { afterEach, describe, expect, it, vi } from "vitest";
import axios from "../../apps/dashboard/node_modules/axios";
import {
  ConflictError,
  getContact,
  getHomeContent,
  getMenu,
  saveContact,
  saveHomeContent,
  saveMenu,
} from "../../apps/dashboard/src/services/storefront.js";

afterEach(() => vi.restoreAllMocks());

const saved = (liveRefresh: string) => ({ data: { data: { ok: true }, version: "v2", liveRefresh } });

describe("reading", () => {
  it("returns data and version for each part", async () => {
    const get = vi.spyOn(axios, "get").mockResolvedValue({ data: { data: { x: 1 }, version: "v1" } });
    expect(await getHomeContent()).toEqual({ data: { x: 1 }, version: "v1" });
    expect(await getMenu("main")).toEqual({ data: { x: 1 }, version: "v1" });
    expect(await getContact()).toEqual({ data: { x: 1 }, version: "v1" });
    expect(get.mock.calls.map((c) => c[0])).toEqual([
      "/api/admin/storefront/home",
      "/api/admin/storefront/menus/main",
      "/api/admin/storefront/contact",
    ]);
  });
});

describe("saving", () => {
  it("PUTs the content with its version", async () => {
    const put = vi.spyOn(axios, "put").mockResolvedValue(saved("ok"));
    await saveHomeContent({ sections: [] }, "v1");
    await saveMenu("footer-information", { name: "Information", items: [] }, "v1");
    await saveContact({ phone: "1" }, "v1");
    expect(put.mock.calls).toEqual([
      ["/api/admin/storefront/home", { sections: [], version: "v1" }],
      ["/api/admin/storefront/menus/footer-information", { name: "Information", items: [], version: "v1" }],
      ["/api/admin/storefront/contact", { phone: "1", version: "v1" }],
    ]);
  });

  it("has no notice when the live site refreshed", async () => {
    vi.spyOn(axios, "put").mockResolvedValue(saved("ok"));
    expect(await saveContact({}, "v1")).toEqual({ data: { ok: true }, version: "v2", notice: null });
  });

  it("explains a refresh that isn't configured (Final review fix 3)", async () => {
    vi.spyOn(axios, "put").mockResolvedValue(saved("skipped"));
    expect((await saveContact({}, "v1")).notice).toBe("Saved. The live site will update within 5 minutes.");
  });

  it("explains a failed live refresh", async () => {
    vi.spyOn(axios, "put").mockResolvedValue(saved("failed"));
    expect((await saveContact({}, "v1")).notice).toBe("Saved. The live site will update within 5 minutes.");
  });

  it("turns a 409 into a ConflictError with the server's message", async () => {
    vi.spyOn(axios, "put").mockRejectedValue({ response: { status: 409, data: { error: "Someone else saved changes. Reload to see them." } } });
    const err = await saveHomeContent({}, "old").catch((e) => e);
    expect(err).toBeInstanceOf(ConflictError);
    expect(err.message).toBe("Someone else saved changes. Reload to see them.");
  });

  it("passes on a 400 with the server's message", async () => {
    vi.spyOn(axios, "put").mockRejectedValue({ response: { status: 400, data: { error: "items.0.href: Links must start with / or https://" } } });
    const err = await saveMenu("main", {}, "v").catch((e) => e);
    expect(err).not.toBeInstanceOf(ConflictError);
    expect(err.message).toBe("items.0.href: Links must start with / or https://");
  });
});
