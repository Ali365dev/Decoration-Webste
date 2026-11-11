import { ProductExperience } from "@/components/product/product-experience";
import { buildPageMetadata, breadcrumbJsonLd, productJsonLd } from "@/lib/seo/metadata";
import { getCollectionProducts, getProductBySlug } from "@dec-walls/domain/catalog";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import productStyles from "@/components/product/product-detail.module.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return buildPageMetadata({ title: product.name, description: product.description, path: `/products/${slug}`, imageUrl: product.primaryImageUrl });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const recommendedProducts = await getCollectionProducts("new-in");

  const productSchema = productJsonLd({ name: product.name, description: product.description, slug: product.slug, price: product.price, imageUrl: product.primaryImageUrl });
  const breadcrumbSchema = breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: product.name, path: `/products/${product.slug}` }]);

  return (
    <main className={`container-page product-page ${productStyles.page}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ProductExperience
        product={product}
        collectionSlug={product.slug === "capp-169-qf-rp" ? "bedding" : "new-in"}
        recommendedProducts={recommendedProducts}
      />
    </main>
  );
}
