import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/pages/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { BLOG_POSTS } from "@/lib/site-content";

export const metadata: Metadata = buildPageMetadata({
  title: "Journal",
  description: "Guides and notes on dressing a home — bedding, bath, table and the care that keeps textiles good.",
  path: "/blogs",
});

export default function BlogsPage() {
  const [lead, ...rest] = BLOG_POSTS;

  return (
    <>
      <PageHero
        eyebrow="Journal"
        title="Notes on a well-dressed home"
        intro="Short, useful guides on choosing, styling and caring for the textiles that make a house feel lived in."
      />

      <section className="bg-paper pb-20 md:pb-28">
        <div className="container-page">
          {/* Lead post */}
          {lead ? (
            <Reveal as="article" className="group">
              <Link href={`/blogs/${lead.slug}`} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
                <div className="relative aspect-[16/11] overflow-hidden rounded-[16px] bg-canvas">
                  <Image
                    src={lead.image}
                    alt={lead.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[0.5s] ease-[ease] group-hover:scale-[1.03]"
                    priority
                  />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f05e2d]">
                    {lead.category}
                  </p>
                  <h2
                    className="mt-4 text-[clamp(1.6rem,3vw,2.25rem)] font-medium leading-[1.2] text-ink transition-colors group-hover:text-[#f05e2d]"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    {lead.title}
                  </h2>
                  <p className="mt-4 max-w-md text-[15px] leading-[1.8] text-body">{lead.excerpt}</p>
                  <p className="mt-5 font-mono text-[12px] text-grey">
                    {lead.date} · {lead.readMinutes} min read
                  </p>
                </div>
              </Link>
            </Reveal>
          ) : null}

          {/* Rest */}
          <div className="mt-16 grid gap-x-8 gap-y-12 border-t border-line-soft pt-16 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, index) => (
              <Reveal key={post.slug} as="article" delayMs={(index % 3) * 70} className="group">
                <Link href={`/blogs/${post.slug}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-canvas">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[0.5s] ease-[ease] group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f05e2d]">
                    {post.category}
                  </p>
                  <h3 className="mt-2 text-[18px] font-medium leading-snug text-ink transition-colors group-hover:text-[#f05e2d]">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.7] text-body">{post.excerpt}</p>
                  <p className="mt-4 font-mono text-[12px] text-grey">
                    {post.date} · {post.readMinutes} min read
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
