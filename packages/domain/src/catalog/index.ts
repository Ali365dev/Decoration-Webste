import { homeProducts } from "../seed/products";
import type {
  CategoryDto,
  CollectionDto,
  Paginated,
  ProductDto,
} from "@dec-walls/types";
import type { PaginationInput } from "@dec-walls/validation";

const seedCategories: CategoryDto[] = [
  { id: "c-bedding", slug: "bedding", name: "Bedding", parentId: null },
  { id: "c-bath", slug: "bath", name: "Bath", parentId: null },
  { id: "c-dining", slug: "dining", name: "Dining", parentId: null },
  { id: "c-living", slug: "living", name: "Living", parentId: null },
  { id: "c-coverlets", slug: "coverlets", name: "Coverlets", parentId: null },
  {
    id: "c-accessories",
    slug: "accessories",
    name: "Accessories",
    parentId: null,
  },
];

const seedCollections: CollectionDto[] = [
  {
    id: "col-new-in",
    slug: "new-in",
    name: "New In",
    description: "Latest arrivals",
  },
  {
    id: "col-sale",
    slug: "sale",
    name: "Sale",
    description: "Marked down pieces",
  },
];

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
  return homeProducts.filter((p) => p.label === "NEW IN" || slug === "new-in");
}

export async function listAllProductsAdmin(): Promise<ProductDto[]> {
  return homeProducts;
}
