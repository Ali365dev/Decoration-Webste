// Copies today's storefront content (home page sections, header and footer menus, contact details)
// into the CMS tables, for only the parts that aren't stored yet. Never overwrites, never deletes,
// never touches `banners`. Safe to re-run.
//
// Dry run (read-only):  DATABASE_URL=... npx tsx scripts/db/seed-cms.ts
// Write:                DATABASE_URL=... npx tsx scripts/db/seed-cms.ts --apply
import { inArray, eq } from "drizzle-orm";
import { createDb } from "../../packages/db/src/client";
import { contentBlocks, navigationItems, navigationMenus, pageSections, pages } from "../../packages/db/src/schema";
import { MENU_KEYS, type MenuKey } from "../../packages/validation/src/cms";
import { planCmsSeed } from "../../packages/domain/src/cms/seed-rows";
import { CONTACT_KEY, HOME_SLUG } from "../../packages/domain/src/cms/load";

const apply = process.argv.includes("--apply");
const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const db = createDb(url);

async function main() {
  const [page] = await db.select({ id: pages.id }).from(pages).where(eq(pages.slug, HOME_SLUG));
  const menus = await db.select({ key: navigationMenus.key }).from(navigationMenus).where(inArray(navigationMenus.key, [...MENU_KEYS]));
  const [contact] = await db.select({ id: contentBlocks.id }).from(contentBlocks).where(eq(contentBlocks.key, CONTACT_KEY));

  const plan = planCmsSeed({ homePage: Boolean(page), menus: menus.map((m) => m.key as MenuKey), contact: Boolean(contact) });
  const total = plan.pages.length + plan.sections.length + plan.menus.length + plan.items.length + plan.blocks.length;
  console.log(
    `Plan: ${plan.pages.length} page, ${plan.sections.length} sections, ${plan.menus.length} menus (${plan.menus.map((m) => m.key).join(", ") || "none"}), ${plan.items.length} menu links, ${plan.blocks.length} content block`,
  );
  if (!total) return console.log("Nothing to do: everything is stored already.");
  if (!apply) return console.log("Dry run. Nothing was written. Re-run with --apply to write.");

  await db.transaction(async (tx) => {
    for (const p of plan.pages) {
      const inserted = await tx.insert(pages).values({ ...p, publishedAt: new Date() }).onConflictDoNothing().returning({ id: pages.id });
      const sections = plan.sections.filter((s) => s.pageId === p.id);
      if (inserted.length && sections.length) await tx.insert(pageSections).values(sections);
    }
    for (const m of plan.menus) {
      const inserted = await tx.insert(navigationMenus).values(m).onConflictDoNothing().returning({ id: navigationMenus.id });
      const items = plan.items.filter((i) => i.menuId === m.id);
      if (inserted.length && items.length) await tx.insert(navigationItems).values(items);
    }
    if (plan.blocks.length) await tx.insert(contentBlocks).values(plan.blocks).onConflictDoNothing();
  });
  console.log("Written.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => (db.$client as { end: () => Promise<void> }).end());
