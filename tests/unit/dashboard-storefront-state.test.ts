import { describe, expect, it } from "vitest";
import { applyUpdate, fieldSetter, safely, updateSectionById } from "../../apps/dashboard/src/views/settings/storefront/state.js";

describe("editor updates (Final review fix 4)", () => {
  it("a late update from a slow upload keeps edits made meanwhile", () => {
    let state: Record<string, unknown> = { image: "/old.jpg", heading: "Old" };
    const onChange = (update: unknown) => {
      state = applyUpdate(state, update);
    };
    const setImage = fieldSetter(onChange, "image"); // captured when the upload started
    fieldSetter(onChange, "heading")("New"); // edited during the upload
    setImage("https://res.cloudinary.com/x.jpg"); // upload finishes
    expect(state).toEqual({ image: "https://res.cloudinary.com/x.jpg", heading: "New" });
  });

  it("updates nested list items without losing sibling edits", () => {
    let state: Record<string, unknown> = { slides: [{ a: 1, b: 1 }] };
    const onChange = (update: unknown) => {
      state = applyUpdate(state, update);
    };
    const setSlides = fieldSetter(onChange, "slides");
    setSlides((prev: { a: number; b: number }[]) => prev.map((s) => ({ ...s, b: 2 })));
    setSlides((prev: { a: number; b: number }[]) => prev.map((s) => ({ ...s, a: 3 })));
    expect(state).toEqual({ slides: [{ a: 3, b: 2 }] });
  });

  it("updates a section by id even after the sections were reordered", () => {
    const working = { sections: [{ id: "b", data: { n: 2 } }, { id: "a", data: { n: 1 } }] };
    const next = updateSectionById(working, "a", { data: (d: { n: number }) => ({ ...d, n: 9 }) });
    expect(next.sections).toEqual([{ id: "b", data: { n: 2 } }, { id: "a", data: { n: 9 } }]);
  });
});

describe("safely (Final review fix 5)", () => {
  it("returns the fallback when malformed stored data throws", () => {
    expect(safely(() => (null as unknown as string[]).map((x) => x), "fallback")).toBe("fallback");
    expect(safely(() => "ok", "fallback")).toBe("ok");
  });
});

describe("adding and removing category showcases in the editor", () => {
  const working = {
    sections: [
      { id: "h", type: "hero", hidden: false, data: {} },
      { id: "s1", type: "category_showcase", hidden: false, data: {} },
      { id: "s2", type: "category_showcase", hidden: false, data: {} },
      { id: "g", type: "product_grid", hidden: false, data: {} },
    ],
  };

  it("adds a new showcase right after the last one, with starting content", async () => {
    const { addShowcase } = await import("../../apps/dashboard/src/views/settings/storefront/state.js");
    const next = addShowcase(working, "new-1");
    expect(next.sections.map((s: { id: string }) => s.id)).toEqual(["h", "s1", "s2", "new-1", "g"]);
    expect(next.sections[3]).toMatchObject({
      id: "new-1",
      type: "category_showcase",
      hidden: false,
      isNew: true,
      data: { collectionSlug: "new-in", ctaHref: "/collections/new-in", ctaLabel: "Shop Now", categoryNav: [] },
    });
  });

  it("adds after the last section when there is no showcase", async () => {
    const { addShowcase } = await import("../../apps/dashboard/src/views/settings/storefront/state.js");
    const next = addShowcase({ sections: [working.sections[0]] }, "new-1");
    expect(next.sections.map((s: { id: string }) => s.id)).toEqual(["h", "new-1"]);
  });

  it("removes a section by id", async () => {
    const { removeSection } = await import("../../apps/dashboard/src/views/settings/storefront/state.js");
    expect(removeSection(working, "s1").sections.map((s: { id: string }) => s.id)).toEqual(["h", "s2", "g"]);
  });
});

describe("menu links from a collection", () => {
  it("fills link and name, in capitals for menu items and columns", async () => {
    const { collectionToLink } = await import("../../apps/dashboard/src/views/settings/storefront/state.js");
    const bedding = { slug: "bedding", name: "Bedding & Bath" };
    expect(collectionToLink(bedding, 0)).toEqual({ label: "BEDDING & BATH", href: "/collections/bedding" });
    expect(collectionToLink(bedding, 1)).toEqual({ label: "BEDDING & BATH", href: "/collections/bedding" });
    expect(collectionToLink(bedding, 2)).toEqual({ label: "Bedding & Bath", href: "/collections/bedding" });
  });

  it("names the special new-in and sale lists plainly", async () => {
    const { collectionToLink } = await import("../../apps/dashboard/src/views/settings/storefront/state.js");
    expect(collectionToLink({ slug: "new-in", name: "New in (products labelled NEW IN)" }, 0)).toEqual({ label: "NEW IN", href: "/collections/new-in" });
    expect(collectionToLink({ slug: "sale", name: "Sale (products with a sale price)" }, 2)).toEqual({ label: "Sale", href: "/collections/sale" });
  });
});
