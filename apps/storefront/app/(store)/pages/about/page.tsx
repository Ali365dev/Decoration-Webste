import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/pages/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { ABOUT } from "@/lib/site-content";

export const metadata: Metadata = buildPageMetadata({
  title: "About us",
  description: ABOUT.lead,
  path: "/pages/about",
  imageUrl: ABOUT.image,
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={ABOUT.eyebrow}
        title={ABOUT.title}
        intro={ABOUT.lead}
        image={ABOUT.image}
        imageAlt="Folded Dec Walls textiles in natural light"
      />

      {/* Story */}
      <section className="bg-paper pb-16 md:pb-20">
        <div className="container-page">
          <div className="max-w-[680px] space-y-5">
            {ABOUT.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-[length:var(--base-font-size)] leading-[1.85] text-body">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-canvas py-16 md:py-24">
        <div className="container-page">
          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {ABOUT.values.map((value, index) => (
              <Reveal key={value.title} as="div" delayMs={index * 80}>
                <p className="text-[13px] font-mono text-grey">0{index + 1}</p>
                <h2 className="mt-4 text-[20px] font-medium leading-snug text-ink">
                  {value.title}
                </h2>
                <p className="mt-3 text-[15px] leading-[1.8] text-body">{value.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats + image */}
      <section className="bg-paper py-16 md:py-24">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-canvas">
            <Image
              src="/home/support.jpg"
              alt="Inside the Dec Walls workshop"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2
              className="text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-[1.2] text-ink"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Small workshop, long habits
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-[1.85] text-body">
              We have grown, but the way we work has not. The same people who choose the cloth still check
              the finished pieces, and that is what keeps the quality steady from one batch to the next.
            </p>

            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-line-soft pt-8">
              {ABOUT.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-[28px] font-medium tabular-nums text-ink">{stat.figure}</dt>
                  <dd className="mt-1 text-[12px] leading-snug text-body">{stat.label}</dd>
                </div>
              ))}
            </dl>

            <Link
              href="/collections/new-in"
              className="mt-10 inline-block rounded-pill border border-line bg-paper px-9 py-3 text-[12px] font-medium uppercase tracking-wide text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
            >
              Shop the collection
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
