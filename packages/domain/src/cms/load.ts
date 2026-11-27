import { and, asc, eq } from "drizzle-orm";
import type { CmsBlockDto, CmsBlockType, CmsPageDto, NavItemDto } from "@dec-walls/types";
import { getDb } from "@dec-walls/db/client";
import { contentBlocks, navigationItems, navigationMenus, pageSections, pages } from "@dec-walls/db/schema";
import { contactSchema, menuSchema, parseSection, type MenuKey } from "@dec-walls/validation/cms";
import { defaultContact, defaultHomePage, defaultMenus, type SiteContact } from "./defaults";
import { rowsToNavTree } from "./rows";

export const HOME_SLUG = "home";
export const CONTACT_KEY = "site.contact";

type PageRow = { id: string; slug: string; title: string; seoTitle: string | null; seoDescription: string | null };
type SectionRow = { id: string; type: string; sortOrder: number; data: Record<string, unknown> };

/** The home page from its stored rows: hidden sections and sections with bad data are left out. */
export function buildHomePage(page: PageRow, sections: SectionRow[]): CmsPageDto {
  const blocks: CmsBlockDto[] = [];
  for (const section of [...sections].sort((a, b) => a.sortOrder - b.sortOrder)) {
    if (section.data?.hidden === true) continue;
    const parsed = parseSection(section.type, section.data);
    if (!parsed.ok) {
      console.error(`[cms] skipped home section ${section.id} (${section.type}): ${parsed.error}`);
      continue;
    }
    blocks.push({ id: section.id, type: section.type as CmsBlockType, sortOrder: section.sortOrder, data: parsed.data });
  }
  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    status: "published", // only published pages are read
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    blocks,
  };
}

async function fallback<T>(what: string, fallbackValue: T, read: () => Promise<T | null>): Promise<T> {
  if (!getDb()) return fallbackValue;
  try {
    return (await read()) ?? fallbackValue;
  } catch (error) {
    console.error(`[cms] reading ${what} failed, showing default content`, error);
    return fallbackValue;
  }
}

export function loadHomePage(): Promise<CmsPageDto> {
  return fallback("home page", defaultHomePage, async () => {
    const db = getDb()!;
    const [page] = await db
      .select({ id: pages.id, slug: pages.slug, title: pages.title, seoTitle: pages.seoTitle, seoDescription: pages.seoDescription })
      .from(pages)
      .where(and(eq(pages.slug, HOME_SLUG), eq(pages.status, "published")));
    if (!page) return null;
    const sections = await db
      .select({ id: pageSections.id, type: pageSections.type, sortOrder: pageSections.sortOrder, data: pageSections.data })
      .from(pageSections)
      .where(eq(pageSections.pageId, page.id))
      .orderBy(asc(pageSections.sortOrder));
    return buildHomePage(page, sections);
  });
}

/** A stored menu (name + nested items), or null when that menu was never saved. */
export async function readMenu(key: MenuKey): Promise<{ name: string; items: NavItemDto[] } | null> {
  const db = getDb();
  if (!db) return null;
  const [menu] = await db.select({ id: navigationMenus.id, name: navigationMenus.name }).from(navigationMenus).where(eq(navigationMenus.key, key));
  if (!menu) return null;
  const rows = await db
    .select({ id: navigationItems.id, parentId: navigationItems.parentId, label: navigationItems.label, href: navigationItems.href, sortOrder: navigationItems.sortOrder })
    .from(navigationItems)
    .where(eq(navigationItems.menuId, menu.id));
  const items = rowsToNavTree(rows);
  if (!menuSchema(key).safeParse(items).success) {
    console.error(`[cms] menu "${key}" has invalid items, showing default menu`);
    return null;
  }
  return { name: menu.name, items };
}

export function loadMenu(key: MenuKey): Promise<{ name: string; items: NavItemDto[] }> {
  return fallback(`menu ${key}`, defaultMenus[key], () => readMenu(key));
}

export async function readContact(): Promise<SiteContact | null> {
  const db = getDb();
  if (!db) return null;
  const [block] = await db
    .select({ data: contentBlocks.data })
    .from(contentBlocks)
    .where(and(eq(contentBlocks.key, CONTACT_KEY), eq(contentBlocks.status, "published")));
  if (!block) return null;
  const parsed = contactSchema.safeParse(block.data);
  if (!parsed.success) {
    console.error("[cms] contact details are invalid, showing default contact details");
    return null;
  }
  return parsed.data;
}

export function loadContact(): Promise<SiteContact> {
  return fallback("contact details", defaultContact, readContact);
}
