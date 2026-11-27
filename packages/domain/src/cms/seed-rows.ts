import { randomUUID } from "node:crypto";
import { MENU_KEYS, type MenuKey } from "@dec-walls/validation/cms";
import { defaultContact, defaultHomePage, defaultMenus } from "./defaults";
import { CONTACT_KEY, HOME_SLUG } from "./load";
import { navTreeToRows } from "./rows";

export type CmsSeedPlan = {
  pages: { id: string; slug: string; title: string; status: "published"; seoTitle: string | null; seoDescription: string | null }[];
  sections: { id: string; pageId: string; type: string; sortOrder: number; data: Record<string, unknown> }[];
  menus: { id: string; key: MenuKey; name: string }[];
  items: { id: string; menuId: string; parentId: string | null; label: string; href: string; sortOrder: number }[];
  blocks: { key: string; type: string; status: "published"; data: Record<string, unknown> }[];
};

/** The rows that copy today's content into the CMS tables, for only the parts not stored yet. */
export function planCmsSeed(existing: { homePage: boolean; menus: MenuKey[]; contact: boolean }): CmsSeedPlan {
  const plan: CmsSeedPlan = { pages: [], sections: [], menus: [], items: [], blocks: [] };

  if (!existing.homePage) {
    const pageId = randomUUID();
    plan.pages.push({
      id: pageId,
      slug: HOME_SLUG,
      title: defaultHomePage.title,
      status: "published",
      seoTitle: defaultHomePage.seoTitle,
      seoDescription: defaultHomePage.seoDescription,
    });
    for (const block of defaultHomePage.blocks) {
      plan.sections.push({ id: randomUUID(), pageId, type: block.type, sortOrder: block.sortOrder, data: block.data });
    }
  }

  for (const key of MENU_KEYS) {
    if (existing.menus.includes(key)) continue;
    const menuId = randomUUID();
    plan.menus.push({ id: menuId, key, name: defaultMenus[key].name });
    plan.items.push(...navTreeToRows(menuId, defaultMenus[key].items, randomUUID));
  }

  if (!existing.contact) {
    plan.blocks.push({ key: CONTACT_KEY, type: "site_contact", status: "published", data: defaultContact });
  }

  return plan;
}
