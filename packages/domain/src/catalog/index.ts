import { homeProducts } from "../seed/products";
import type {
  CategoryDto,
  CollectionDto,
  Paginated,
  ProductDto,
} from "@dec-walls/types";
import type { PaginationInput } from "@dec-walls/validation";
import { mainNav } from "../cms/navigation";

function categoriesFromNav(): CategoryDto[] {
  const categories = new Map<string, CategoryDto>();
  const addItems = (items: typeof mainNav, parentId: string | null) => {
    for (const item of items) {
      if (item.id === "home") continue;
      if (!categories.has(item.id)) {
        categories.set(item.id, {
          id: `c-${item.id}`,
          slug: item.id,
          name: item.label,
          parentId: parentId ? `c-${parentId}` : null,
        });
      }
      addItems(item.children, item.id);
    }
  };
  addItems(mainNav, null);
  return [...categories.values()];
}

const seedCategories = categoriesFromNav();

function titleCase(label: string) {
  return label.toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function collectionsFromNav(): CollectionDto[] {
  const collections = new Map<string, CollectionDto>();
  const addItems = (items: typeof mainNav) => {
    for (const item of items) {
      const slug = item.href.match(/^\/collections\/([^/]+)$/)?.[1];
      if (slug && !collections.has(slug)) {
        const name = titleCase(item.label);
        const description =
          slug === "new-in"
            ? "Shop the latest arrivals in bedding, home decor, and more."
            : slug === "sale"
              ? "Shop marked down home textiles and decor at Dec Walls."
              : `Shop ${name} online at Dec Walls. Explore home textiles and decor with delivery across Pakistan.`;
        collections.set(slug, {
          id: `col-${slug}`,
          slug,
          name,
          description,
        });
      }
      addItems(item.children);
    }
  };
  addItems(mainNav);
  for (const [slug, name] of [
    ["bath", "Bath"],
    ["dining", "Dining"],
    ["living", "Living"],
    ["coverlets", "Coverlets"],
  ]) {
    if (!collections.has(slug)) {
      collections.set(slug, {
        id: `col-${slug}`,
        slug,
        name,
        description: `Shop ${name.toLowerCase()} online at Dec Walls. Explore home textiles and decor with delivery across Pakistan.`,
      });
    }
  }
  return [...collections.values()];
}

const seedCollections = collectionsFromNav();

export async function listProducts(
  input: PaginationInput = { page: 1, pageSize: 24 },
): Promise<Paginated<ProductDto>> {
  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 24;
  let items = homeProducts.filter((p) => p.status === "published");
  if (input.q) {
    const q = input.q.toLowerCase();
    items = items.filter((p) => p.name.toLowerCase().includes(q));
  }
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    total: items.length,
  };
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductDto | null> {
  return homeProducts.find((p) => p.slug === slug) ?? null;
}

export async function listCategories(): Promise<CategoryDto[]> {
  return seedCategories;
}

export async function listCollections(): Promise<CollectionDto[]> {
  return seedCollections;
}

export async function getCollectionProducts(
  slug: string,
): Promise<ProductDto[]> {
  if (slug === "sale") {
    return homeProducts.filter((p) => p.compareAtPrice);
  }
  if (slug === "new-in") {
    return homeProducts.filter((p) => p.label === "NEW IN");
  }
  const categorizedProducts = homeProducts.filter(
    (product) =>
      product.categorySlug === slug || product.collectionSlugs?.includes(slug),
  );
  if (categorizedProducts.length > 0) return categorizedProducts;

  const terms = slug
    .split("-")
    .filter((term) => term.length > 3 && !["premium", "custom"].includes(term));
  const matches = homeProducts.filter((product) => {
    const name = product.name.toLowerCase();
    return terms.some((term) => name.includes(term));
  });
  return matches.length > 0
    ? matches
    : homeProducts.filter((product) => product.status === "published");
}

export async function listAllProductsAdmin(): Promise<ProductDto[]> {
  return homeProducts;
}
