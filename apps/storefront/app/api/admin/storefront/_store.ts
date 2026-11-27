import { randomUUID } from "node:crypto";
import { and, asc, eq, inArray } from "drizzle-orm";
import type { NavItemDto } from "@dec-walls/types";
import type { Database } from "@dec-walls/db/client";
import { contentBlocks, navigationItems, navigationMenus, pageSections, pages } from "@dec-walls/db/schema";
import type { MenuKey, NavItemInput, SiteContactInput } from "@dec-walls/validation/cms";
import { defaultContact, defaultHomePage, defaultMenus } from "@dec-walls/domain/cms/defaults";
import { CONTACT_KEY, HOME_SLUG } from "@dec-walls/domain/cms/load";
import { contentVersion, navTreeToRows, rowsToNavTree } from "@dec-walls/domain/cms/rows";
import { assertVersion, type HomeUpdate } from "./_input";

type Tx = Parameters<Parameters<Database["transaction"]>[0]>[0];
type Q = Database | Tx;

// ── Home page ───────────────────────────────────────────────────────────────

export type AdminSection = { id: string; type: string; sortOrder: number; hidden: boolean; data: Record<string, unknown> };
export type AdminHome = { seoTitle: string | null; seoDescription: string | null; sections: AdminSection[] };

const splitHidden = (data: Record<string, unknown>) => {
  const { hidden, ...rest } = data ?? {};
  return { hidden: hidden === true, data: rest };
};

/** The home page as the dashboard edits it; today's defaults when nothing is stored yet. */
export async function readHome(q: Q, lock = false): Promise<{ pageId: string | null; home: AdminHome }> {
  const base = q.select({ id: pages.id, seoTitle: pages.seoTitle, seoDescription: pages.seoDescription }).from(pages).where(eq(pages.slug, HOME_SLUG));
  const [page] = lock ? await base.for("update") : await base;
  if (!page) {
    return {
      pageId: null,
      home: {
        seoTitle: defaultHomePage.seoTitle,
        seoDescription: defaultHomePage.seoDescription,
        sections: defaultHomePage.blocks.map((b) => ({ id: b.id, type: b.type, sortOrder: b.sortOrder, ...splitHidden(b.data) })),
      },
    };
  }
  const rows = await q
    .select({ id: pageSections.id, type: pageSections.type, sortOrder: pageSections.sortOrder, data: pageSections.data })
    .from(pageSections)
    .where(eq(pageSections.pageId, page.id))
    .orderBy(asc(pageSections.sortOrder));
  return {
    pageId: page.id,
    home: { seoTitle: page.seoTitle, seoDescription: page.seoDescription, sections: rows.map((r) => ({ ...r, ...splitHidden(r.data) })) },
  };
}

export const homeVersion = (home: AdminHome) => contentVersion(home);

const storedData = (s: { hidden: boolean; data: Record<string, unknown> }) => (s.hidden ? { ...s.data, hidden: true } : s.data);

export async function saveHome(db: Database, update: HomeUpdate): Promise<AdminHome> {
  return db.transaction(async (tx) => {
    const current = await readHome(tx, true);
    assertVersion(homeVersion(current.home), update.version);

    if (!current.pageId) {
      const [page] = await tx
        .insert(pages)
        .values({
          slug: HOME_SLUG,
          title: defaultHomePage.title,
          status: "published",
          seoTitle: update.seoTitle,
          seoDescription: update.seoDescription,
          publishedAt: new Date(),
        })
        .returning({ id: pages.id });
      await tx.insert(pageSections).values(
        update.sections.map((s, i) => ({ pageId: page!.id, type: s.type, sortOrder: (i + 1) * 10, data: storedData(s) })),
      );
    } else {
      await tx.update(pages).set({ seoTitle: update.seoTitle, seoDescription: update.seoDescription, updatedAt: new Date() }).where(eq(pages.id, current.pageId));
      const pageId = current.pageId;
      if (update.removedIds.length) {
        await tx.delete(pageSections).where(and(eq(pageSections.pageId, pageId), inArray(pageSections.id, update.removedIds)));
      }
      for (const [i, s] of update.sections.entries()) {
        const sortOrder = (i + 1) * 10;
        if (s.isNew) await tx.insert(pageSections).values({ pageId, type: s.type, sortOrder, data: storedData(s) });
        else await tx.update(pageSections).set({ sortOrder, data: storedData(s) }).where(eq(pageSections.id, s.id));
      }
    }
    return (await readHome(tx)).home;
  });
}

// ── Menus ───────────────────────────────────────────────────────────────────

export type AdminMenu = { name: string; items: NavItemInput[] };

const plain = (items: NavItemDto[] | NavItemInput[]): NavItemInput[] =>
  items.map((i) => ({ label: i.label, href: i.href, children: plain(i.children ?? []) }));

export async function readMenuAdmin(q: Q, key: MenuKey, lock = false): Promise<AdminMenu> {
  const base = q.select({ id: navigationMenus.id, name: navigationMenus.name }).from(navigationMenus).where(eq(navigationMenus.key, key));
  const [menu] = lock ? await base.for("update") : await base;
  if (!menu) return { name: defaultMenus[key].name, items: plain(defaultMenus[key].items) };
  const rows = await q
    .select({ id: navigationItems.id, parentId: navigationItems.parentId, label: navigationItems.label, href: navigationItems.href, sortOrder: navigationItems.sortOrder })
    .from(navigationItems)
    .where(eq(navigationItems.menuId, menu.id));
  return { name: menu.name, items: plain(rowsToNavTree(rows)) };
}

export const menuVersion = (menu: AdminMenu) => contentVersion(menu);

export async function saveMenu(db: Database, key: MenuKey, update: AdminMenu & { version: string }): Promise<AdminMenu> {
  return db.transaction(async (tx) => {
    assertVersion(menuVersion(await readMenuAdmin(tx, key, true)), update.version);
    const [menu] = await tx
      .insert(navigationMenus)
      .values({ key, name: update.name })
      .onConflictDoUpdate({ target: navigationMenus.key, set: { name: update.name } })
      .returning({ id: navigationMenus.id });
    await tx.delete(navigationItems).where(eq(navigationItems.menuId, menu!.id));
    const rows = navTreeToRows(menu!.id, update.items.map(function toDto(i): NavItemDto {
      return { id: "", label: i.label, href: i.href, children: i.children.map(toDto) };
    }), randomUUID);
    if (rows.length) await tx.insert(navigationItems).values(rows);
    return readMenuAdmin(tx, key);
  });
}

// ── Contact and social ──────────────────────────────────────────────────────

export async function readContactAdmin(q: Q, lock = false): Promise<SiteContactInput> {
  const base = q.select({ data: contentBlocks.data }).from(contentBlocks).where(eq(contentBlocks.key, CONTACT_KEY));
  const [block] = lock ? await base.for("update") : await base;
  return (block?.data as SiteContactInput | undefined) ?? defaultContact;
}

export const contactVersion = (contact: SiteContactInput) => contentVersion(contact);

export async function saveContact(db: Database, update: SiteContactInput & { version: string }): Promise<SiteContactInput> {
  const { version, ...contact } = update;
  return db.transaction(async (tx) => {
    assertVersion(contactVersion(await readContactAdmin(tx, true)), version);
    await tx
      .insert(contentBlocks)
      .values({ key: CONTACT_KEY, type: "site_contact", status: "published", data: contact })
      .onConflictDoUpdate({ target: contentBlocks.key, set: { data: contact, status: "published" } });
    return readContactAdmin(tx);
  });
}
