import { listCollections } from "@dec-walls/domain/catalog";
import { notFound, permanentRedirect } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const collections = await listCollections();
  const collection = collections.find((item) => item.slug === slug);
  if (!collection) notFound();
  permanentRedirect(`/collections/${collection.slug}`);
}
