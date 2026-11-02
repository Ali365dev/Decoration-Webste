import { ProductCard } from "@/components/product/product-card";
import { listProducts } from "@dec-walls/domain/catalog";
import { getSearchProvider } from "@dec-walls/integrations/search";

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const catalog = await listProducts({ page: 1, pageSize: 100, q });
  const search = getSearchProvider();
  await search.indexProducts(catalog.items);
  const results = q ? await search.searchProducts(q) : catalog.items;

  return (
    <section className="container-page py-16">
      <h1
        className="mb-8 text-ink"
        style={{
          fontSize: "var(--page-title-size)",
          fontWeight: "var(--heading-font-weight)",
        }}
      >
        {q ? `Search: ${q}` : "Search"}
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
