import { ProductCard } from "@/components/product/product-card";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getCollectionProducts, listCollections } from "@dec-walls/domain/catalog";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collections = await listCollections();
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) return {};
  return buildPageMetadata({
    title: collection.name,
    description: collection.description,
    path: `/collections/${slug}`,
  });
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const collections = await listCollections();
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) notFound();
  const products = await getCollectionProducts(slug);

  return (
    <section className="container-page py-16">
      <h1
        className="mb-3 text-ink"
        style={{
          fontSize: "var(--page-title-size)",
          fontWeight: "var(--heading-font-weight)",
        }}
      >
        {collection.name}
      </h1>
      {collection.description ? (
        <p className="mb-10 max-w-2xl text-body">{collection.description}</p>
      ) : null}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
