import { describe, expect, it } from "vitest";
import type { NavItemDto } from "@dec-walls/types";
import { planCmsSeed } from "../../packages/domain/src/cms/seed-rows";
import { defaultContact, defaultHomePage, defaultMenus } from "../../packages/domain/src/cms/defaults";

const count = (items: NavItemDto[]): number => items.reduce((n, i) => n + 1 + count(i.children), 0);
const allItems = count(defaultMenus.main.items) + 5 + 5;

describe("planCmsSeed", () => {
  it("plans everything when empty", () => {
    const plan = planCmsSeed({ homePage: false, menus: [], contact: false });
    expect(plan.pages).toHaveLength(1);
    expect(plan.pages[0]).toMatchObject({ slug: "home", status: "published", seoTitle: defaultHomePage.seoTitle });
    expect(plan.sections).toHaveLength(12);
    expect(plan.sections.every((s) => s.pageId === plan.pages[0]!.id)).toBe(true);
    expect(plan.sections.map((s) => s.sortOrder)).toEqual([10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]);
    expect(plan.menus.map((m) => m.key)).toEqual(["main", "footer-information", "footer-customer-service"]);
    expect(plan.items).toHaveLength(allItems);
    expect(plan.blocks).toEqual([{ key: "site.contact", type: "site_contact", status: "published", data: defaultContact }]);
  });

  it("plans nothing when all exist", () => {
    const plan = planCmsSeed({ homePage: true, menus: ["main", "footer-information", "footer-customer-service"], contact: true });
    expect(plan).toEqual({ pages: [], sections: [], menus: [], items: [], blocks: [] });
  });

  it("plans only the missing footer menu", () => {
    const plan = planCmsSeed({ homePage: true, menus: ["main", "footer-information"], contact: true });
    expect(plan.menus.map((m) => m.key)).toEqual(["footer-customer-service"]);
    expect(plan.items).toHaveLength(5);
    expect(plan.items.every((i) => i.menuId === plan.menus[0]!.id)).toBe(true);
  });

  it("gives every row a uuid id and links children to their parent", () => {
    const plan = planCmsSeed({ homePage: false, menus: [], contact: false });
    const uuid = /^[0-9a-f-]{36}$/;
    expect([...plan.pages, ...plan.sections, ...plan.menus, ...plan.items].every((r) => uuid.test(r.id))).toBe(true);
    const ids = new Set(plan.items.map((i) => i.id));
    expect(plan.items.every((i) => i.parentId === null || ids.has(i.parentId))).toBe(true);
  });
});
