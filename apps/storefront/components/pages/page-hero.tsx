import Image from "next/image";
import Link from "next/link";

/**
 * Slim page header used across the standalone footer pages. An asymmetric
 * split: quiet text on the left, one real product photograph on the right as
 * the single bright moment. The one coral detail is the eyebrow and the short
 * rule beneath the title — the brand accent appears nowhere else here.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  meta,
  image,
  imageAlt,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  meta?: string;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <section className="bg-paper">
      <div className="container-page py-14 md:py-20">
        <nav aria-label="Breadcrumb" className="mb-8 text-[12px] text-body">
          <Link href="/" className="transition-colors hover:text-ink">
            Home
          </Link>
          <span className="px-2 text-line">/</span>
          <span className="text-ink">{title}</span>
        </nav>

        <div
          className={`grid items-center gap-10 ${
            image ? "lg:grid-cols-[1.05fr_0.95fr] lg:gap-16" : ""
          }`}
        >
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f05e2d]">
              {eyebrow}
            </p>
            <h1
              className="mt-4 text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.12] text-ink"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {title}
            </h1>
            <span className="mt-5 block h-px w-14 bg-[#f05e2d]" aria-hidden />
            {intro ? (
              <p className="mt-6 text-[length:var(--base-font-size)] leading-[1.75] text-body">
                {intro}
              </p>
            ) : null}
            {meta ? (
              <p className="mt-6 text-[12px] uppercase tracking-[0.12em] text-grey">
                {meta}
              </p>
            ) : null}
          </div>

          {image ? (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[18px] bg-canvas lg:aspect-[5/6]">
              <Image
                src={image}
                alt={imageAlt ?? ""}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
                priority
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
