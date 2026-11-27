import { describe, expect, it } from "vitest";
import { contactSchema, menuSchema, parseSection } from "../../packages/validation/src/cms";
import { defaultContact, defaultHomePage, defaultMenus } from "../../packages/domain/src/cms/defaults";

const link = (label: string, href = "/collections/x", children: unknown[] = []) => ({ label, href, children });

describe("default content", () => {
  it("every default section passes its schema", () => {
    for (const block of defaultHomePage.blocks) {
      const result = parseSection(block.type, block.data);
      expect(result, `${block.type}: ${result.ok ? "" : result.error}`).toMatchObject({ ok: true });
    }
  });

  it("default menus pass menuSchema", () => {
    for (const key of ["main", "footer-information", "footer-customer-service"] as const) {
      expect(menuSchema(key).safeParse(defaultMenus[key].items).success).toBe(true);
    }
  });

  it("defaultContact passes contactSchema", () => {
    expect(contactSchema.safeParse(defaultContact).success).toBe(true);
  });

  it("default sections keep today's order", () => {
    expect(defaultHomePage.blocks.map((b) => b.type)).toEqual([
      "hero",
      "announcement",
      "banner",
      "category_showcase",
      "category_showcase",
      "category_showcase",
      "product_grid",
      "collection_tabs",
      "video_showcase",
      "trust_badges",
      "customer_reviews",
      "newsletter",
    ]);
    expect(defaultHomePage.blocks.map((b) => b.sortOrder)).toEqual([10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]);
  });

  it("default hero has today's three slides", () => {
    const hero = defaultHomePage.blocks.find((b) => b.type === "hero")!;
    expect((hero.data.slides as { heading: string }[]).map((s) => s.heading)).toEqual(["Wall Art", "Bedding", "Home Decor"]);
  });
});

describe("menu validation", () => {
  it("rejects a 4-level main menu", () => {
    const deep = [link("A", "/a", [link("B", "/b", [link("C", "/c", [link("D", "/d")])])])];
    expect(menuSchema("main").safeParse(deep).success).toBe(false);
  });

  it("accepts a 3-level main menu", () => {
    const ok = [link("A", "/a", [link("B", "/b", [link("C", "/c")])])];
    expect(menuSchema("main").safeParse(ok).success).toBe(true);
  });

  it("rejects children in a footer menu", () => {
    expect(menuSchema("footer-information").safeParse([link("A", "/a", [link("B", "/b")])]).success).toBe(false);
  });

  it("rejects empty label with the field path in the message", () => {
    const result = menuSchema("main").safeParse([link("  ")]);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual([0, "label"]);
  });

  it.each(["javascript:alert(1)", "www.x.com", "//evil.com", "http://x.com"])("rejects href %s", (href) => {
    expect(menuSchema("main").safeParse([link("A", href)]).success).toBe(false);
  });

  it.each(["/", "/collections/bedding", "https://instagram.com/decwalls"])("accepts href %s", (href) => {
    expect(menuSchema("main").safeParse([link("A", href)]).success).toBe(true);
  });
});

describe("section and contact validation", () => {
  it("rejects a hero with no slides, naming the field", () => {
    const result = parseSection("hero", { slides: [] });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("slides");
  });

  it("rejects an unknown section type", () => {
    expect(parseSection("carousel", {}).ok).toBe(false);
  });

  it("allows hidden on any section", () => {
    const newsletter = defaultHomePage.blocks.find((b) => b.type === "newsletter")!;
    expect(parseSection("newsletter", { ...newsletter.data, hidden: true }).ok).toBe(true);
  });

  it("rejects unknown social network tiktok", () => {
    expect(contactSchema.safeParse({ ...defaultContact, social: [{ network: "tiktok", href: "https://tiktok.com" }] }).success).toBe(false);
  });
});

describe("image fields (Final review fix 1)", () => {
  const slide = (image: string) => ({ slides: [{ image, label: "L", heading: "H", ctaLabel: "Go", ctaHref: "/x" }] });

  it.each(["/home/hero.jpg?v=2", "/home/hero.jpg#x", "https://evil.example/x.jpg", "https://bareezehome.com.pk/other/x.jpg", "http://res.cloudinary.com/x.jpg"])(
    "rejects image %s that the storefront's image loader would refuse",
    (image) => {
      const result = parseSection("hero", slide(image));
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toContain("slides.0.image");
    },
  );

  it.each([
    "/home/hero-1.jpg",
    "https://res.cloudinary.com/wleggyxw/image/upload/v1/dec-walls/storefront/a.jpg",
    "https://abc.supabase.co/storage/v1/object/public/a.jpg",
    "https://bareezehome.com.pk/cdn/shop/files/a.jpg",
    "https://pyariwalls.pk/cdn/shop/a.jpg",
    "https://pyariwalls.pk/cdn/shop/files/Islamic_wall_sceneries_set.png?v=1788335623&width=533",
  ])("accepts image %s", (image) => {
    expect(parseSection("hero", slide(image)).ok).toBe(true);
  });

  it("checks tile, showcase banner and video poster images too", () => {
    const tiles = defaultHomePage.blocks.find((b) => b.type === "banner")!.data as { tiles: { image: string }[] };
    expect(parseSection("banner", { ...tiles, tiles: [{ ...tiles.tiles[0]!, image: "/a.jpg?x=1" }] }).ok).toBe(false);
    const showcase = defaultHomePage.blocks.find((b) => b.type === "category_showcase")!.data;
    expect(parseSection("category_showcase", { ...showcase, bannerImage: "https://evil.example/a.jpg" }).ok).toBe(false);
    const video = defaultHomePage.blocks.find((b) => b.type === "video_showcase")!.data;
    expect(parseSection("video_showcase", { ...video, posterSrc: "/p.jpg?v=1" }).ok).toBe(false);
  });
});

describe("missing required fields read plainly", () => {
  it("a missing image, heading and link say what to add", () => {
    const missingImage = parseSection("category_showcase", { heading: "H", categoryTitle: "T", ctaHref: "/x", collectionSlug: "new-in", categoryNav: [] });
    expect(missingImage).toEqual({ ok: false, error: "bannerImage: Add an image." });
    const missingHeading = parseSection("category_showcase", { bannerImage: "/a.jpg", categoryTitle: "T", ctaHref: "/x", collectionSlug: "new-in", categoryNav: [] });
    expect(missingHeading).toEqual({ ok: false, error: "heading: This field is required." });
    const missingLink = parseSection("category_showcase", { bannerImage: "/a.jpg", heading: "H", categoryTitle: "T", collectionSlug: "new-in", categoryNav: [] });
    expect(missingLink).toEqual({ ok: false, error: "ctaHref: Enter a link." });
  });
});
