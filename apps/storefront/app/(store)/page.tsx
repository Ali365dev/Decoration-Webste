import { CmsBlockRenderer } from "@/components/cms/cms-block-renderer";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getPublishedPageBySlug } from "@dec-walls/domain/cms";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedPageBySlug("home");
  if (!page) return {};
  return buildPageMetadata({
    title: page.seoTitle ?? page.title,
    description: page.seoDescription,
    path: "/",
  });
}

export default async function HomePage() {
  const page = await getPublishedPageBySlug("home");
  if (!page) notFound();

  return (
    <>
      {page.blocks
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((block) => (
          <CmsBlockRenderer key={block.id} block={block} />
        ))}
    </>
  );
}
