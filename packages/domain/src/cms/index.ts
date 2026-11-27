import type {
  CmsPageDto,
  NavItemDto,
  ProductDto,
} from "@dec-walls/types";
import { getDb } from "@dec-walls/db/client";
import { homeProducts } from "../seed/products";
import { getCollectionProducts } from "../catalog";
import { mainNav } from "./navigation";
import { categoryTiles, defaultHomePage, lifestyleTiles, type SiteContact } from "./defaults";
import { HOME_SLUG, loadContact, loadHomePage, loadMenu } from "./load";

export { homeProducts, mainNav, categoryTiles, lifestyleTiles };


export async function getPublishedPageBySlug(
  slug: string,
): Promise<CmsPageDto | null> {
  if (slug === HOME_SLUG || slug === "") return loadHomePage();
  return null;
}

export async function listPagesAdmin(): Promise<CmsPageDto[]> {
  return [defaultHomePage];
}

export async function getMainNavigation(): Promise<NavItemDto[]> {
  return (await loadMenu("main")).items;
}

/**
 * Products for a home page grid or tab. Reads the live catalogue when a database is configured:
 * the collection with this slug ("sale" = products with a compare-at price, "new-in" = products
 * labelled NEW IN). An empty collection falls back to the new-in products, as the seed data did,
 * except "sale", which stays empty rather than showing full-price items under a sale tab.
 */
export async function resolveProductGridBlock(
  collectionSlug: string,
): Promise<ProductDto[]> {
  if (!getDb()) return resolveSeedGrid(collectionSlug);
  try {
    const live = await getCollectionProducts(collectionSlug);
    if (live.length > 0 || collectionSlug === "sale" || collectionSlug === "new-in") return live;
    return await getCollectionProducts("new-in");
  } catch (error) {
    console.error(`[cms] live product grid "${collectionSlug}" failed, using seed data`, error);
    return resolveSeedGrid(collectionSlug);
  }
}

/** The previous seed-only behaviour, used when there is no database. */
function resolveSeedGrid(collectionSlug: string): ProductDto[] {
  if (collectionSlug === "sale") {
    return homeProducts.filter((p) => p.compareAtPrice);
  }
  if (collectionSlug !== "new-in") {
    const tagged = homeProducts.filter((p) => p.collectionSlugs?.includes(collectionSlug));
    if (tagged.length > 0) return tagged;
  }
  return homeProducts.filter((p) => p.label === "NEW IN");
}

export type FooterColumn = { title: string; links: { label: string; href: string }[] };

const toColumn = (menu: { name: string; items: NavItemDto[] }): FooterColumn => ({
  title: menu.name,
  links: menu.items.map(({ label, href }) => ({ label, href })),
});

/** The footer's two link columns, from the dashboard or today's defaults. */
export async function getFooterLinks(): Promise<{ information: FooterColumn; customerService: FooterColumn }> {
  const [information, customerService] = await Promise.all([loadMenu("footer-information"), loadMenu("footer-customer-service")]);
  return { information: toColumn(information), customerService: toColumn(customerService) };
}

/** Address, email, phone and social links shown in the footer. */
export function getSiteContact(): Promise<SiteContact> {
  return loadContact();
}

export type { SiteContact };
