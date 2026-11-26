import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { BLOG_POSTS } from "@/lib/site-content";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((item) => item.slug === slug);
  if (!post) return { title: "Journal" };
  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blogs/${post.slug}`,
    imageUrl: post.image,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((item) => item.slug === slug);
  if (!post) notFound();

  const more = BLOG_POSTS.filter((item) => item.slug !== slug).slice(0, 2);

  return (
    <article className="bg-paper">
      <div className="container-page py-14 md:py-20">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-wide text-body transition-colors hover:text-ink"
        >
          <ArrowLeft size={15} strokeWidth={1.75} />
          Journal
        </Link>

        <header className="mx-auto mt-8 max-w-[720px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f05e2d]">
            {post.category}
          </p>
          <h1
            className="mt-4 text-[clamp(2rem,4.5vw,3rem)] font-medium leading-[1.14] text-ink"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            {post.title}
          </h1>
          <p className="mt-5 font-mono text-[12px] text-grey">
            {post.date} · {post.readMinutes} min read
          </p>
        </header>

        <div className="relative mx-auto mt-10 aspect-[16/9] max-w-[960px] overflow-hidden rounded-[18px] bg-canvas">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 960px"
            className="object-cover"
            priority
          />
        </div>

        <div className="mx-auto mt-12 max-w-[680px] space-y-6">
          <p className="text-[18px] font-medium leading-[1.6] text-ink">{post.excerpt}</p>
          {post.body.map((paragraph, index) => (
            <p key={index} className="text-[length:var(--base-font-size)] leading-[1.85] text-body">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* More */}
      <section className="border-t border-line-soft bg-paper py-16 md:py-20">
        <div className="container-page">
          <h2 className="mb-8 text-[13px] font-semibold uppercase tracking-[0.16em] text-grey">
            Keep reading
          </h2>
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {more.map((item) => (
              <Link key={item.slug} href={`/blogs/${item.slug}`} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[14px] bg-canvas">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[0.5s] ease-[ease] group-hover:scale-[1.03]"
                  />
                </div>
                <h3 className="mt-4 text-[17px] font-medium leading-snug text-ink transition-colors group-hover:text-[#f05e2d]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[14px] leading-[1.7] text-body">{item.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
