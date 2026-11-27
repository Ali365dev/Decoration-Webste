import { describe, expect, it } from "vitest";
import {
  assertVersion,
  parseContactUpdate,
  parseHomeUpdate,
  parseMenuUpdate,
} from "../../apps/storefront/app/api/admin/storefront/_input";
import { defaultContact, defaultHomePage, defaultMenus } from "../../packages/domain/src/cms/defaults";

const existing = defaultHomePage.blocks.map((b) => ({ id: b.id, type: b.type }));
const body = (sections = defaultHomePage.blocks.map((b) => ({ id: b.id, hidden: false, data: b.data }))) => ({
  version: "v1",
  seoTitle: "Dec Walls | Home textiles",
  seoDescription: "Shop bedding.",
  sections,
});

const status = (fn: () => unknown) => {
  try {
    fn();
  } catch (e) {
    return { status: (e as { status?: number }).status, message: (e as Error).message };
  }
  return null;
};

describe("parseHomeUpdate", () => {
  it("accepts a reorder and hide", () => {
    const sections = body().sections.reverse();
    sections[0]!.hidden = true;
    const parsed = parseHomeUpdate(body(sections), existing, "v1");
    expect(parsed.sections.map((s) => s.id)).toEqual(existing.map((e) => e.id).reverse());
    expect(parsed.sections[0]!.hidden).toBe(true);
    expect(parsed.sections[0]!.type).toBe("newsletter");
  });

  it("rejects an added section id", () => {
    const sections = [...body().sections, { id: "new", hidden: false, data: {} }];
    expect(status(() => parseHomeUpdate(body(sections), existing, "v1"))?.status).toBe(400);
  });

  it("rejects a dropped section", () => {
    expect(status(() => parseHomeUpdate(body(body().sections.slice(1)), existing, "v1"))?.status).toBe(400);
  });

  it("rejects a duplicated section", () => {
    const s = body().sections;
    s[1] = s[0]!;
    expect(status(() => parseHomeUpdate(body(s), existing, "v1"))?.status).toBe(400);
  });

  it("rejects bad hero data with the field path in the message", () => {
    const s = body().sections;
    s[0] = { ...s[0]!, data: { slides: [{ image: "/a.jpg", label: "L", heading: "", ctaLabel: "Go", ctaHref: "/x" }] } };
    const err = status(() => parseHomeUpdate(body(s), existing, "v1"));
    expect(err?.status).toBe(400);
    expect(err?.message).toContain("slides.0.heading");
  });

  it("requires a version", () => {
    expect(status(() => parseHomeUpdate({ ...body(), version: undefined }, existing, "v1"))?.status).toBe(400);
  });
});

describe("parseMenuUpdate", () => {
  const link = (label: string, children: unknown[] = []) => ({ label, href: "/x", children });

  it("accepts the default main menu", () => {
    expect(parseMenuUpdate("main", { version: "v", name: "Main menu", items: defaultMenus.main.items }).items.length).toBe(defaultMenus.main.items.length);
  });

  it("rejects a 4-level main menu", () => {
    const items = [link("A", [link("B", [link("C", [link("D")])])])];
    expect(status(() => parseMenuUpdate("main", { version: "v", name: "Main", items }))?.status).toBe(400);
  });

  it("rejects a javascript: link", () => {
    const items = [{ label: "A", href: "javascript:alert(1)", children: [] }];
    expect(status(() => parseMenuUpdate("footer-information", { version: "v", name: "Information", items }))?.message).toContain("href");
  });
});

describe("parseContactUpdate", () => {
  it("accepts the defaults", () => {
    expect(parseContactUpdate({ version: "v", ...defaultContact }).phone).toBe("+92 300 0606662");
  });

  it("rejects a bad email", () => {
    expect(status(() => parseContactUpdate({ version: "v", ...defaultContact, email: "nope" }))?.status).toBe(400);
  });
});

describe("assertVersion", () => {
  it("passes when versions match", () => {
    expect(status(() => assertVersion("abc", "abc"))).toBeNull();
  });

  it("stale version is a conflict", () => {
    const err = status(() => assertVersion("new", "old"));
    expect(err).toEqual({ status: 409, message: "Someone else saved changes. Reload to see them." });
  });
});

describe("Final review fixes 2 and 5", () => {
  it("a stale save whose section ids changed is a conflict, not a 400", () => {
    const newIds = existing.map((e, i) => ({ id: `db-${i}`, type: e.type }));
    expect(status(() => parseHomeUpdate(body(), newIds, "current-version"))).toEqual({
      status: 409,
      message: "Someone else saved changes. Reload to see them.",
    });
  });

  it("a section of unknown type passes through unchanged", () => {
    const withUnknown = [...existing, { id: "x", type: "carousel" }];
    const sections = [...body().sections, { id: "x", hidden: false, data: { anything: [1, 2] } }];
    const parsed = parseHomeUpdate(body(sections), withUnknown, "v1");
    expect(parsed.sections.at(-1)).toEqual({ id: "x", type: "carousel", hidden: false, isNew: false, data: { anything: [1, 2] } });
  });
});

describe("adding and removing category showcases", () => {
  const showcase = defaultHomePage.blocks.find((b) => b.type === "category_showcase")!;
  const showcaseIds = existing.filter((e) => e.type === "category_showcase").map((e) => e.id);

  it("accepts a new category showcase", () => {
    const sections = [...body().sections, { id: "new-1", type: "category_showcase", hidden: false, data: showcase.data }];
    const parsed = parseHomeUpdate(body(sections), existing, "v1");
    expect(parsed.sections.at(-1)).toMatchObject({ id: "new-1", type: "category_showcase", isNew: true });
    expect(parsed.sections.filter((s) => s.isNew)).toHaveLength(1);
    expect(parsed.removedIds).toEqual([]);
  });

  it("rejects a new section of any other type", () => {
    const hero = defaultHomePage.blocks.find((b) => b.type === "hero")!;
    const sections = [...body().sections, { id: "new-1", type: "hero", hidden: false, data: hero.data }];
    expect(status(() => parseHomeUpdate(body(sections), existing, "v1"))?.status).toBe(400);
  });

  it("checks a new showcase's content like any other", () => {
    const sections = [...body().sections, { id: "new-1", type: "category_showcase", hidden: false, data: { ...showcase.data, heading: "" } }];
    const err = status(() => parseHomeUpdate(body(sections), existing, "v1"));
    expect(err?.status).toBe(400);
    expect(err?.message).toContain("heading");
  });

  it("accepts removing a category showcase", () => {
    const sections = body().sections.filter((s) => s.id !== showcaseIds[1]);
    const parsed = parseHomeUpdate(body(sections), existing, "v1");
    expect(parsed.removedIds).toEqual([showcaseIds[1]]);
    expect(parsed.sections).toHaveLength(existing.length - 1);
  });

  it("refuses removing any other section", () => {
    const sections = body().sections.filter((s) => s.id !== existing.find((e) => e.type === "newsletter")!.id);
    expect(status(() => parseHomeUpdate(body(sections), existing, "v1"))?.status).toBe(400);
  });

  it("allows at most 8 category showcases", () => {
    const extra = Array.from({ length: 6 }, (_, i) => ({ id: `new-${i}`, type: "category_showcase", hidden: false, data: showcase.data }));
    const err = status(() => parseHomeUpdate(body([...body().sections, ...extra]), existing, "v1"));
    expect(err?.status).toBe(400);
    expect(err?.message).toContain("8");
  });
});
