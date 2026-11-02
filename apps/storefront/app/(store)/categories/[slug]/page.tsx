import { ProductCard } from "@/components/product/product-card";
import { listCategories, listProducts } from "@dec-walls/domain/catalog";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const categories = await listCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();
  const products = await listProducts({ page: 1, pageSize: 24 });

  return (
    <section className="container-page py-16">
      <h1
        className="mb-10 text-ink"
        style={{
          fontSize: "var(--page-title-size)",
          fontWeight: "var(--heading-font-weight)",
        }}
      >
        {category.name}
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
