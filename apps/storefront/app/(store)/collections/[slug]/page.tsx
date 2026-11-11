import { CollectionView } from "@/components/collection/collection-view";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getCollectionProducts, listCollections } from "@dec-walls/domain/catalog";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collections = await listCollections();
  const collection = collections.find((item) => item.slug === slug);
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
  const collection = collections.find((item) => item.slug === slug);
  if (!collection) notFound();
  const products = await getCollectionProducts(slug);

  return (
    <div className="pb-20">
      <section className="collection-banner" aria-label={`${collection.name} collection`}>
        <div className="collection-banner-content">
          <h1>{collection.name}</h1>
          <nav aria-label="Breadcrumb" className="collection-breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>{collection.name}</span>
          </nav>
        </div>
      </section>

      <section className="container-page collection-content" aria-label={`${collection.name} products`}>
        {collection.description ? (
          <p className="sr-only">{collection.description}</p>
        ) : null}
        <CollectionView products={products} collectionSlug={slug} />
      </section>
    </div>
  );
}
