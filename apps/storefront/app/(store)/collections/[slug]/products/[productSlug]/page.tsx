import { ProductExperience } from "@/components/product/product-experience";
import { buildPageMetadata, breadcrumbJsonLd, productJsonLd } from "@/lib/seo/metadata";
import { getCollectionProducts, getProductBySlug } from "@dec-walls/domain/catalog";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import productStyles from "@/components/product/product-detail.module.css";

type Props = { params: Promise<{ slug: string; productSlug: string }> };

async function resolveProduct(productSlug: string) {
  return getProductBySlug(productSlug === "fpbs-199" ? "silk-plain-bed-sheet-set" : productSlug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, productSlug } = await params;
  const product = await resolveProduct(productSlug);
  if (!product) return {};
  return buildPageMetadata({
    title: product.name,
    description: product.description,
    path: `/collections/${slug}/products/${productSlug}`,
    imageUrl: product.primaryImageUrl,
  });
}

export default async function CollectionProductPage({ params }: Props) {
  const { slug, productSlug } = await params;
  const product = await resolveProduct(productSlug);
  if (!product) notFound();
  const recommendedProducts = await getCollectionProducts("new-in");

  const productSchema = productJsonLd({ name: product.name, description: product.description, slug: product.slug, price: product.price, imageUrl: product.primaryImageUrl });
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: slug.replaceAll("-", " "), path: `/collections/${slug}` },
    { name: product.name, path: `/collections/${slug}/products/${productSlug}` },
  ]);

  return (
    <main className={`container-page product-page ${productStyles.page}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ProductExperience product={product} collectionSlug={slug} recommendedProducts={recommendedProducts} />
    </main>
  );
}
