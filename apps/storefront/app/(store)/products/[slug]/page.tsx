import { buildPageMetadata, productJsonLd, breadcrumbJsonLd } from "@/lib/seo/metadata";
import { getProductBySlug } from "@dec-walls/domain/catalog";
import { Button } from "@dec-walls/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return buildPageMetadata({
    title: product.name,
    description: product.description,
    path: `/products/${slug}`,
    imageUrl: product.primaryImageUrl,
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const jsonLd = productJsonLd({
    name: product.name,
    description: product.description,
    slug: product.slug,
    price: product.price,
    imageUrl: product.primaryImageUrl,
  });
  const crumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: product.name, path: `/products/${product.slug}` },
  ]);

  return (
    <section className="container-page grid gap-10 py-16 lg:grid-cols-2">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      <div
        className="aspect-[3/4] rounded-[var(--radius-media)] bg-line-soft bg-cover bg-center"
        style={{
          backgroundImage: product.primaryImageUrl
            ? `url(${product.primaryImageUrl})`
            : undefined,
        }}
      />
      <div>
        <p className="text-sm text-body">
          <Link href="/">Home</Link> / {product.name}
        </p>
        <h1
          className="mt-4 text-ink"
          style={{
            fontSize: "var(--page-title-size)",
            fontWeight: "var(--heading-font-weight)",
          }}
        >
          {product.name}
        </h1>
        <p className="mt-4 text-lg text-body">
          {new Intl.NumberFormat("en-PK", {
            style: "currency",
            currency: product.price.currency,
            maximumFractionDigits: 0,
          }).format(product.price.amount)}
        </p>
        {product.description ? (
          <p className="mt-6 max-w-xl text-base leading-7 text-body">
            {product.description}
          </p>
        ) : null}
        <div className="mt-10 flex flex-wrap gap-3">
          <Button variant="primary">Add to bag</Button>
          <Button variant="secondary">Add to wishlist</Button>
        </div>
      </div>
    </section>
  );
}
