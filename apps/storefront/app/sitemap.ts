import { listProducts, listCollections } from "@dec-walls/domain/catalog";
import { getEnv } from "@dec-walls/config";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getEnv().NEXT_PUBLIC_STOREFRONT_URL;
  const [{ items: products }, collections] = await Promise.all([
    listProducts({ page: 1, pageSize: 100 }),
    listCollections(),
  ]);

  return [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    ...collections.map((c) => ({
      url: `${base}/collections/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${base}/products/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
