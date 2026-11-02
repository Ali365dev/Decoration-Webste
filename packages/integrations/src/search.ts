import type { ProductDto } from "@dec-walls/types";
import { getEnv } from "@dec-walls/config";

export interface SearchProvider {
  indexProducts(products: ProductDto[]): Promise<void>;
  searchProducts(query: string): Promise<ProductDto[]>;
}

class NoopSearchProvider implements SearchProvider {
  private products: ProductDto[] = [];

  async indexProducts(products: ProductDto[]): Promise<void> {
    this.products = products;
  }

  async searchProducts(query: string): Promise<ProductDto[]> {
    const q = query.toLowerCase();
    return this.products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q),
    );
  }
}

const singleton = new NoopSearchProvider();

export function getSearchProvider(): SearchProvider {
  const provider = getEnv().SEARCH_PROVIDER;
  if (provider === "meilisearch") {
    return singleton;
  }
  return singleton;
}
