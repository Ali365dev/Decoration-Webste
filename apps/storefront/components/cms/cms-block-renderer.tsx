import type { CmsBlockDto, ProductDto } from "@dec-walls/types";
import Image from "next/image";
import Link from "next/link";
import { Award, BadgeCheck, ShieldCheck, Star, Truck, type LucideIcon } from "lucide-react";
import { AnnouncementTicker } from "@/components/layout/announcement-ticker";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/motion/reveal";
import { resolveProductGridBlock } from "@dec-walls/domain/cms";
import { HeroCarousel, type HeroSlide } from "@/components/cms/hero-carousel";
import { CategoryShowcase } from "@/components/cms/category-showcase";
import { CategoryScrollGallery } from "@/components/cms/category-scroll-gallery";
import { VideoShowcase } from "@/components/cms/video-showcase";
import { CollectionTabs } from "@/components/cms/collection-tabs";
import { NewsletterSignup } from "@/components/cms/newsletter-signup";

type Review = { name: string; location?: string; rating: number; quote: string };

type Tile = { label: string; href: string; image: string; badge?: string; ctaLabel?: string };

/**
 * Centered eyebrow + heading, then a row of category cards that pins and
 * pans horizontally as the page scrolls (desktop/tablet) — see
 * CategoryScrollGallery for the ScrollTrigger mechanics.
 */
function CategorySection({ tiles }: { tiles: Tile[] }) {
  return (
    <section className="bg-paper">
      <CategoryScrollGallery
        eyebrow="Explore Our Collections"
        tiles={tiles}
      />
    </section>
  );
}

type TrustBadgeItem = { icon: string; label: string };

const TRUST_BADGE_ICONS: Record<string, LucideIcon> = {
  truck: Truck,
  "shield-check": ShieldCheck,
  award: Award,
  "badge-check": BadgeCheck,
};

function TrustBadges({ items }: { items: TrustBadgeItem[] }) {
  return (
    <section className="bg-paper px-4 py-10 sm:px-6 md:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1410px] grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {items.map((item) => {
          const Icon = TRUST_BADGE_ICONS[item.icon] ?? ShieldCheck;
          return (
            <Reveal
              key={item.label}
              as="div"
              className="flex flex-col items-center gap-3 rounded-xl bg-canvas px-6 py-10 text-center"
            >
              <Icon size={24} strokeWidth={1.75} className="text-[#f05e2d]" />
              <span className="whitespace-nowrap text-sm font-medium text-ink">{item.label}</span>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function CustomerReviews({
  eyebrow,
  heading,
  subtitle,
  reviews,
}: {
  eyebrow?: string;
  heading: string;
  subtitle?: string;
  reviews: Review[];
}) {
  return (
    <section className="bg-canvas px-4 py-16 sm:px-6 md:px-8 md:py-20 lg:px-12">
      <div className="mx-auto max-w-[1410px]">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-14">
          {eyebrow ? (
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#f05e2d]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-[length:var(--page-title-size)] font-medium leading-[1.3] tracking-[var(--heading-letter-spacing)] text-ink">
            {heading}
          </h2>
          {subtitle ? (
            <p className="mx-auto mt-3 text-[length:var(--base-font-size)] leading-[28px] text-body">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <Reveal
              key={review.name}
              as="div"
              delayMs={Math.min(index, 5) * 70}
              className="flex h-full flex-col rounded-lg border border-line-soft bg-paper p-6 shadow-[0_1px_2px_rgba(17,17,17,0.04)]"
            >
              <div className="mb-3 flex gap-1 text-[#f05e2d]">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    size={15}
                    strokeWidth={1.5}
                    fill={starIndex < review.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <p className="flex-1 text-[14px] leading-[24px] text-body">
                &ldquo;{review.quote}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-line-soft pt-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-[12px] font-semibold uppercase text-white">
                  {review.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.04em] text-ink">
                    {review.name}
                  </p>
                  {review.location ? (
                    <p className="text-[12px] text-body">{review.location}</p>
                  ) : null}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

async function ProductGrid({
  title,
  subtitle,
  collectionSlug,
}: {
  title: string;
  subtitle?: string;
  collectionSlug: string;
}) {
  const products = await resolveProductGridBlock(collectionSlug);
  return (
    <Reveal as="section" className="bg-paper px-[var(--space-15)] py-[60px] md:px-[var(--full-width-padding)]">
      <div className="mb-[var(--space-30)] text-center">
        <h2 className="text-[length:var(--page-title-size)] font-medium leading-[1.3] tracking-[var(--heading-letter-spacing)] text-ink">
          {title}
        </h2>
        {subtitle ? (
          <p className="mx-auto mt-[var(--space-10)] max-w-xl text-[length:var(--base-font-size)] leading-[28px] text-body">
            {subtitle}
          </p>
        ) : null}
      </div>
      <div className="mx-auto grid max-w-[1410px] grid-cols-2 gap-x-[var(--space-15)] gap-y-[var(--space-30)] md:grid-cols-4 md:gap-x-[var(--space-30)]">
        {products.slice(0, 8).map((product: ProductDto, index) => (
          <Reveal key={product.id} delayMs={index * 70}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link
          href={`/collections/${collectionSlug}`}
          className="inline-block rounded-pill border border-line bg-paper px-[55px] py-[13.6px] text-xs font-medium uppercase tracking-wide text-ink transition-all duration-[0.4s] hover:border-ink hover:bg-ink hover:text-white"
        >
          View all
        </Link>
      </div>
    </Reveal>
  );
}

export async function CmsBlockRenderer({ block }: { block: CmsBlockDto }) {
  switch (block.type) {
    case "announcement": {
      const msgs =
        (block.data.messages as string[] | undefined) ??
        (block.data.text ? [String(block.data.text)] : []);
      return msgs.length > 0 ? <AnnouncementTicker messages={msgs} /> : null;
    }
    case "hero": {
      // Slides are validated when they're saved and again when they're read (see @dec-walls/validation/cms).
      const heroSlides = (block.data.slides as HeroSlide[] | undefined) ?? [];
      if (!heroSlides.length) return null;
      return <HeroCarousel slides={heroSlides} />;
    }
    case "banner": {
      const tiles = (block.data.tiles as Tile[]) ?? [];
      return <CategorySection tiles={tiles} />;
    }
    case "collection_tabs": {
      const tabs =
        (block.data.tabs as { label: string; collectionSlug: string }[]) ?? [];
      // Pre-fetch every tab so switching is instant on the client.
      const sets = await Promise.all(
        tabs.map((tab) => resolveProductGridBlock(tab.collectionSlug)),
      );
      const productsBySlug: Record<string, ProductDto[]> = {};
      tabs.forEach((tab, i) => {
        productsBySlug[tab.collectionSlug] = sets[i] ?? [];
      });
      return (
        <Reveal as="div">
          <CollectionTabs tabs={tabs} productsBySlug={productsBySlug} />
        </Reveal>
      );
    }
    case "product_grid":
      return (
        <ProductGrid
          title={String(block.data.title ?? "Products")}
          subtitle={
            block.data.subtitle ? String(block.data.subtitle) : undefined
          }
          collectionSlug={String(block.data.collectionSlug ?? "new-in")}
        />
      );
    case "video":
      return (
        <Reveal as="section" className="relative min-h-[50vh] w-full overflow-hidden bg-ink">
          <Image
            src={String(block.data.posterUrl ?? "/home/video-poster.jpg")}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-90 transition-transform duration-[1.2s] ease-[ease] hover:scale-[1.03]"
          />
        </Reveal>
      );
    case "rich_text":
      return null;
    case "newsletter":
      return (
        <NewsletterSignup
          eyebrow={block.data.eyebrow ? String(block.data.eyebrow) : undefined}
          heading={String(block.data.heading ?? "Join our newsletter")}
          subtitle={block.data.subtitle ? String(block.data.subtitle) : undefined}
          placeholder={block.data.placeholder ? String(block.data.placeholder) : undefined}
          ctaLabel={block.data.ctaLabel ? String(block.data.ctaLabel) : undefined}
        />
      );
    case "customer_reviews":
      return (
        <CustomerReviews
          eyebrow={block.data.eyebrow ? String(block.data.eyebrow) : undefined}
          heading={String(block.data.heading ?? "What Our Customers Say")}
          subtitle={block.data.subtitle ? String(block.data.subtitle) : undefined}
          reviews={(block.data.reviews as Review[]) ?? []}
        />
      );
    case "trust_badges":
      return <TrustBadges items={(block.data.items as TrustBadgeItem[]) ?? []} />;
    case "video_showcase":
      return (
        <VideoShowcase
          videoSrc={String(block.data.videoSrc ?? "/videos/wall-art-showcase.mp4")}
          videoSrcMobile={block.data.videoSrcMobile ? String(block.data.videoSrcMobile) : undefined}
          posterSrc={String(block.data.posterSrc ?? "/home/video-poster.jpg")}
          heading={block.data.heading ? String(block.data.heading) : undefined}
          description={block.data.description ? String(block.data.description) : undefined}
          cta={block.data.cta ? (block.data.cta as { label: string; href: string }) : undefined}
        />
      );
    case "category_showcase": {
      const collectionSlug = String(block.data.collectionSlug ?? "new-in");
      const nav = (block.data.categoryNav as { label: string; href: string }[]) ?? [];
      // Pre-fetch products for every nav category so the client can switch without a network call
      const slugs = Array.from(
        new Set([
          collectionSlug,
          ...nav.map((item) => item.href.split("/").pop() ?? ""),
        ]).values(),
      ).filter(Boolean);
      const allProductSets = await Promise.all(slugs.map((s) => resolveProductGridBlock(s)));
      const productsBySlug: Record<string, ProductDto[]> = {};
      slugs.forEach((s, i) => { productsBySlug[s] = allProductSets[i] ?? []; });
      return (
        <CategoryShowcase
          bannerImage={String(block.data.bannerImage ?? "/home/hero-1.jpg")}
          heading={String(block.data.heading ?? "Collection")}
          ctaHref={String(block.data.ctaHref ?? `/collections/${collectionSlug}`)}
          ctaLabel={block.data.ctaLabel ? String(block.data.ctaLabel) : undefined}
          categoryTitle={String(block.data.categoryTitle ?? block.data.heading ?? "Shop")}
          categoryNav={nav}
          defaultSlug={collectionSlug}
          productsBySlug={productsBySlug}
        />
      );
    }
    default:
      return null;
  }
}
