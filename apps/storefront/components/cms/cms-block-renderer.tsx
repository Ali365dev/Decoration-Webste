import type { CmsBlockDto, ProductDto } from "@dec-walls/types";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/motion/reveal";
import { resolveProductGridBlock } from "@dec-walls/domain/cms";
import { HeroCarousel } from "@/components/cms/hero-carousel";

type Tile = { label: string; href: string; image: string };

function ImageGrid({
  tiles,
  variant,
}: {
  tiles: Tile[];
  variant?: string;
}) {
  if (variant === "lifestyle_grid") {
    return (
      <Reveal as="section" className="bg-paper px-[var(--space-15)] py-[var(--space-30)] md:px-[var(--full-width-padding)] md:py-[60px]">
        <h2 className="mb-[var(--space-30)] text-center text-[length:var(--btn-font-size)] font-medium uppercase tracking-[0.14em] text-ink">
          Shop by type
        </h2>
        <div className="mx-auto grid max-w-[1410px] grid-cols-2 gap-[var(--space-15)] sm:grid-cols-3 lg:grid-cols-6 lg:gap-[var(--space-20)]">
          {tiles.map((tile, index) => (
            <Reveal key={tile.href + tile.label} delayMs={index * 70} className="group text-center">
              <Link href={tile.href} className="block">
                <span className="relative block aspect-square overflow-hidden bg-canvas">
                  <Image
                    src={tile.image}
                    alt={tile.label}
                    fill
                    sizes="(min-width:1024px) 16vw, 33vw"
                    className="object-cover transition-transform duration-[0.4s] ease-[ease] group-hover:scale-[1.05]"
                  />
                </span>
                <span className="mt-[var(--space-10)] block text-[length:var(--btn-font-size)] font-medium uppercase tracking-[0.06em] text-ink transition-colors duration-[0.4s] group-hover:text-[#f05e2d]">
                  {tile.label}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Reveal>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-[5px] p-[5px] sm:grid-cols-2 lg:grid-cols-3">
      {tiles.map((tile) => (
        <Link
          key={tile.href + tile.label}
          href={tile.href}
          className="category-tile-enter group relative aspect-[627/731] overflow-hidden bg-canvas"
        >
          <Image
            src={tile.image}
            alt={tile.label}
            fill
            sizes="(min-width:1024px) 33vw, 50vw"
            className="object-cover transition-transform duration-[0.5s] ease-[ease] group-hover:scale-[1.05]"
          />
          <span className="absolute inset-0 bg-black/0 transition-colors duration-[0.4s] ease-[ease] group-hover:bg-black/10" />
          <span className="absolute inset-x-0 bottom-[var(--space-20)] flex translate-y-2 justify-center opacity-95 transition-all duration-[0.4s] ease-[ease] group-hover:translate-y-0 group-hover:opacity-100">
            <span className="rounded-pill border border-line bg-paper px-[var(--space-30)] py-[var(--space-10)] text-[length:var(--btn-font-size)] font-medium uppercase leading-[21px] text-ink transition-colors duration-[0.4s] ease-[ease] group-hover:border-ink group-hover:bg-ink group-hover:text-white">
              {tile.label}
            </span>
          </span>
        </Link>
      ))}
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
        {products.map((product: ProductDto, index) => (
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
    case "announcement":
      // Rendered in store layout above the header (Bareeze / Figma Page 2).
      return null;
    case "hero":
      return (
        <HeroCarousel
          images={[
            String(block.data.imageUrl ?? "/home/hero-1.jpg"),
            String(block.data.imageUrlAlt ?? "/home/hero-2.jpg"),
          ]}
          titleLine1={String(block.data.titleLine1 ?? "NEW")}
          titleLine2={String(block.data.titleLine2 ?? "Arrivals")}
          ctaHref={String(block.data.ctaHref ?? "/collections/new-in")}
        />
      );
    case "banner": {
      const tiles = (block.data.tiles as Tile[]) ?? [];
      return (
        <ImageGrid tiles={tiles} variant={String(block.data.variant ?? "")} />
      );
    }
    case "collection_tabs": {
      const tabs =
        (block.data.tabs as { label: string; collectionSlug: string }[]) ?? [];
      const products = await resolveProductGridBlock(
        tabs[0]?.collectionSlug ?? "new-in",
      );
      return (
        <Reveal as="section" className="bg-canvas py-12 md:py-16">
          <div className="container-page">
            <div className="mb-8 flex flex-wrap justify-center gap-2 md:gap-3">
              {tabs.map((tab) => (
                <Link
                  key={tab.label}
                  href={`/collections/${tab.collectionSlug}`}
                  className="rounded-pill border border-line bg-paper px-7 py-3 text-xs font-medium uppercase tracking-wide text-ink transition-all duration-[0.4s] hover:border-ink hover:bg-ink hover:text-white"
                >
                  {tab.label}
                </Link>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {products.slice(0, 4).map((product, index) => (
                <Reveal key={product.id} delayMs={index * 70}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </div>
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
      if (block.data.variant === "support") {
        return (
          <Reveal as="section" className="border-y border-line-soft bg-paper py-14">
            <div className="container-page grid items-center gap-8 md:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#eee]">
                {block.data.imageUrl ? (
                  <Image
                    src={String(block.data.imageUrl)}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-[0.6s] ease-[ease] hover:scale-[1.04]"
                    sizes="(min-width:768px) 50vw, 100vw"
                  />
                ) : null}
              </div>
              <div>
                <h2 className="text-[28px] font-medium text-ink md:text-[36px]">
                  {String(block.data.title ?? "Support")}
                </h2>
                <p className="mt-3 text-base leading-7 text-body">
                  {String(block.data.body ?? "")}
                </p>
                <p className="mt-4 text-sm font-medium text-ink">
                  Cell # {String(block.data.phone ?? "")}
                </p>
              </div>
            </div>
          </Reveal>
        );
      }
      return null;
    case "newsletter":
      return null;
    default:
      return null;
  }
}
