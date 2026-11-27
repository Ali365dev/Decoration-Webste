import { afterEach, describe, expect, it, vi } from "vitest";
import { notifyLiveSite, secretMatches } from "../../apps/storefront/lib/live-refresh";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("secretMatches", () => {
  it("is true for the same secret", () => expect(secretMatches("s3cret-value", "s3cret-value")).toBe(true));
  it("is false for a different secret", () => expect(secretMatches("s3cret-valuX", "s3cret-value")).toBe(false));
  it("is false for a different length", () => expect(secretMatches("s3cret", "s3cret-value")).toBe(false));
  it("is false when none is given", () => expect(secretMatches(null, "s3cret-value")).toBe(false));
  it("is false when none is configured", () => expect(secretMatches("x", undefined)).toBe(false));
  it("is false when both are empty", () => expect(secretMatches("", "")).toBe(false));
});

describe("notifyLiveSite", () => {
  const configure = () => {
    vi.stubEnv("STOREFRONT_PUBLIC_URL", "https://shop.example.test/");
    vi.stubEnv("REVALIDATE_SECRET", "s3cret-value");
  };

  it("is skipped when not configured", async () => {
    vi.stubEnv("STOREFRONT_PUBLIC_URL", "");
    vi.stubEnv("REVALIDATE_SECRET", "");
    const fetchImpl = vi.fn();
    expect(await notifyLiveSite(fetchImpl)).toBe("skipped");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("posts the secret to the live site's revalidate route", async () => {
    configure();
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    expect(await notifyLiveSite(fetchImpl)).toBe("ok");
    const [url, init] = fetchImpl.mock.calls[0]!;
    expect(url).toBe("https://shop.example.test/api/revalidate");
    expect(init.method).toBe("POST");
    expect(init.headers["x-revalidate-secret"]).toBe("s3cret-value");
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("fails on a 500", async () => {
    configure();
    expect(await notifyLiveSite(vi.fn().mockResolvedValue(new Response(null, { status: 500 })))).toBe("failed");
  });

  it("fails when the request throws", async () => {
    configure();
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await notifyLiveSite(vi.fn().mockRejectedValue(new Error("timeout")))).toBe("failed");
  });
});
