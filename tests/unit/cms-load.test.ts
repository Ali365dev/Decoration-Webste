import { afterEach, describe, expect, it, vi } from "vitest";
import { buildHomePage } from "../../packages/domain/src/cms/load";
import { getFooterLinks, getMainNavigation, getPublishedPageBySlug, getSiteContact } from "../../packages/domain/src/cms";
import { defaultContact, defaultHomePage, defaultMenus } from "../../packages/domain/src/cms/defaults";

const page = { id: "p1", slug: "home", title: "Dec Walls", status: "published" as const, seoTitle: "T", seoDescription: "D" };
const newsletter = defaultHomePage.blocks.find((b) => b.type === "newsletter")!;
const trust = defaultHomePage.blocks.find((b) => b.type === "trust_badges")!;
const section = (id: string, type: string, sortOrder: number, data: Record<string, unknown>) => ({ id, type, sortOrder, data });

afterEach(() => vi.restoreAllMocks());

describe("with no database", () => {
  it("returns today's content everywhere", async () => {
    expect(process.env.DATABASE_URL).toBeUndefined();
    expect(await getPublishedPageBySlug("home")).toEqual(defaultHomePage);
    expect(await getMainNavigation()).toEqual(defaultMenus.main.items);
    expect(await getSiteContact()).toEqual(defaultContact);
    expect(await getFooterLinks()).toEqual({
      information: { title: "Information", links: defaultMenus["footer-information"].items.map(({ label, href }) => ({ label, href })) },
      customerService: { title: "Customer Services", links: defaultMenus["footer-customer-service"].items.map(({ label, href }) => ({ label, href })) },
    });
  });

  it("has no page for other slugs", async () => {
    expect(await getPublishedPageBySlug("about")).toBeNull();
  });
});

describe("buildHomePage", () => {
  it("keeps valid sections in sort order with the page's SEO fields", () => {
    const built = buildHomePage(page, [section("b", "newsletter", 20, newsletter.data), section("a", "trust_badges", 10, trust.data)]);
    expect(built.seoTitle).toBe("T");
    expect(built.blocks.map((b) => b.id)).toEqual(["a", "b"]);
  });

  it("skips hidden sections", () => {
    const built = buildHomePage(page, [section("a", "newsletter", 10, { ...newsletter.data, hidden: true }), section("b", "trust_badges", 20, trust.data)]);
    expect(built.blocks.map((b) => b.id)).toEqual(["b"]);
  });

  it("skips a section with bad data and keeps the rest", () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const built = buildHomePage(page, [section("a", "hero", 10, { slides: [] }), section("b", "newsletter", 20, newsletter.data)]);
    expect(built.blocks.map((b) => b.type)).toEqual(["newsletter"]);
    expect(log).toHaveBeenCalledOnce();
  });

  it('skips unknown section type "carousel"', () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const built = buildHomePage(page, [section("a", "carousel", 10, {}), section("b", "newsletter", 20, newsletter.data)]);
    expect(built.blocks.map((b) => b.type)).toEqual(["newsletter"]);
  });
});
