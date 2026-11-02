import type { Metadata } from "next";
import { getEnv } from "@dec-walls/config";

export function buildPageMetadata(input: {
  title: string;
  description?: string | null;
  path?: string;
  imageUrl?: string | null;
}): Metadata {
  const base = getEnv().NEXT_PUBLIC_STOREFRONT_URL;
  const url = new URL(input.path ?? "/", base).toString();
  return {
    title: input.title,
    description: input.description ?? undefined,
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description: input.description ?? undefined,
      url,
      images: input.imageUrl ? [{ url: input.imageUrl }] : undefined,
      type: "website",
      siteName: "Dec Walls",
    },
  };
}

export function productJsonLd(product: {
  name: string;
  description?: string | null;
  slug: string;
  price: { amount: number; currency: string };
  imageUrl?: string | null;
}) {
  const base = getEnv().NEXT_PUBLIC_STOREFRONT_URL;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.imageUrl,
    url: `${base}/products/${product.slug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: product.price.currency,
      price: product.price.amount,
      availability: "https://schema.org/InStock",
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  const base = getEnv().NEXT_PUBLIC_STOREFRONT_URL;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${base}${item.path}`,
    })),
  };
}
