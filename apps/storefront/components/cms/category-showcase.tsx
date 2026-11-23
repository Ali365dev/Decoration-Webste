"use client";

import type { ProductDto } from "@dec-walls/types";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";

type CategoryNav = { label: string; href: string };

const GAP = 20;
const CARD_WIDTH_DESKTOP = 310;
const CARD_WIDTH_MOBILE = 230;
/** Fade-out time before products swap; matches .collection-tabs-grid in globals.css. */
const SWAP_OUT_MS = 320;

function slugFromHref(href: string) {
  return href.split("/").pop() ?? "";
}

export function CategoryShowcase({
  bannerImage,
  heading,
  ctaHref,
  ctaLabel,
  categoryTitle,
  categoryNav,
  defaultSlug,
  productsBySlug,
}: {
  bannerImage: string;
  heading: string;
  ctaHref: string;
  ctaLabel?: string;
  categoryTitle: string;
  categoryNav: CategoryNav[];
  defaultSlug: string;
  productsBySlug: Record<string, ProductDto[]>;
}) {
  const defaultIndex = Math.max(
    0,
    categoryNav.findIndex((item) => slugFromHref(item.href) === defaultSlug),
  );
  // activeIndex highlights the nav immediately; shownIndex swaps the products
  // after the outgoing row has faded (same switch animation as CollectionTabs).
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [shownIndex, setShownIndex] = useState(defaultIndex);
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const swapTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(swapTimer.current), []);
  const activeSlug = slugFromHref(categoryNav[shownIndex]?.href ?? "");
  const products = productsBySlug[activeSlug] ?? productsBySlug[defaultSlug] ?? [];

  const viewportRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);
  const [startPad, setStartPad] = useState(0);
  // Narrower cards on small screens so the carousel never overflows a phone
  // viewport while still keeping the "peek" of the next card.
  const [cardWidth, setCardWidth] = useState(CARD_WIDTH_DESKTOP);
  const step = cardWidth + GAP;

  useEffect(() => {
    function recalc() {
      const vw = viewportRef.current?.clientWidth ?? 0;
      const width = window.innerWidth < 640 ? CARD_WIDTH_MOBILE : CARD_WIDTH_DESKTOP;
      setCardWidth(width);
      const localStep = width + GAP;
      const totalW = products.length * localStep - GAP;
      const overflow = totalW - vw;
      setMaxOffset(Math.max(0, overflow));
      setStartPad(overflow <= 0 ? Math.max(0, Math.floor((vw - totalW) / 2)) : 0);
    }
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [products.length]);

  function selectCategory(index: number) {
    if (index === activeIndex) return;
    setActiveIndex(index);
    window.clearTimeout(swapTimer.current);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShownIndex(index);
      setOffset(0);
      return;
    }
    setPhase("out");
    swapTimer.current = window.setTimeout(() => {
      setShownIndex(index);
      setOffset(0);
      setPhase("in");
    }, SWAP_OUT_MS);
  }

  function advance() {
    setOffset((prev) => Math.min(prev + step, maxOffset));
  }

  return (
    <section className="bg-paper pb-5 pt-10 md:pt-14">
      {/* Hero Banner */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: "clamp(420px, 68vh, 780px)" }}>
        <Image
          src={bannerImage}
          alt={heading}
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        {/* Dark gradient only at the bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 px-8 pb-10 md:px-14 md:pb-14">
          <h2 className="text-[clamp(2.8rem,7vw,6rem)] font-black uppercase leading-none tracking-[0.02em] text-white">
            {heading}
          </h2>
          <Link
            href={ctaHref}
            className="mt-2 inline-block border-b border-white/80 pb-px text-[10px] font-semibold uppercase tracking-[0.25em] text-white/90 transition-opacity duration-200 hover:opacity-60"
          >
            {ctaLabel ?? "Shop Now"}
          </Link>
        </div>
      </div>

      {/* Category Nav + Products */}
      <div className="relative flex border-t border-line-soft">
        {/* Left sidebar */}
        <aside className="hidden w-[200px] shrink-0 border-r border-line-soft px-6 pb-10 pt-10 md:block lg:w-[220px] lg:pt-[70px]">
          <p className="mb-6 text-center text-[13px] font-bold uppercase tracking-[0.12em] text-ink">
            {categoryTitle}
          </p>
          <nav className="flex flex-col items-center gap-[14px]">
            {categoryNav.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectCategory(index)}
                  className={`text-center text-[10px] uppercase tracking-[0.13em] transition-all duration-200 ${
                    isActive
                      ? "font-semibold text-[#f05e2d]"
                      : "font-medium text-body hover:font-semibold hover:text-[#f05e2d]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Carousel area */}
        <div className="relative min-w-0 flex-1">
          {/* Mobile category switcher: the sidebar nav above is hidden below md,
              so this horizontally scrollable pill row is the only way to pick
              a category on phones/tablets. */}
          <nav
            aria-label={categoryTitle}
            className="flex gap-2 overflow-x-auto px-4 pt-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden"
          >
            {categoryNav.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectCategory(index)}
                  className={`shrink-0 whitespace-nowrap rounded-pill border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.1em] transition-colors duration-200 ${
                    isActive
                      ? "border-[#f05e2d] bg-[#f05e2d] text-white"
                      : "border-line-soft text-body"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div ref={viewportRef} className="overflow-hidden px-6 pb-10 pt-6 mr-4">
            <div
              aria-busy={phase === "out"}
              className={`collection-tabs-grid ${phase === "out" ? "is-out" : ""}`}
            >
            <div
              className="flex gap-5"
              style={{
                paddingLeft: startPad,
                transform: `translateX(-${offset > 0 ? offset + 24 : offset}px)`,
                transition: "transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                willChange: "transform",
              }}
            >
              {products.map((product, index) => (
                <div
                  // Re-key per category so each switch replays the entrance animation.
                  key={`${shownIndex}-${product.id}`}
                  className={`shrink-0 ${phase === "in" ? "collection-tabs-item" : ""}`}
                  style={{ width: cardWidth, animationDelay: `${Math.min(index, 5) * 80}ms` }}
                  onAnimationEnd={(e) => {
                    if (e.target === e.currentTarget && index === Math.min(products.length - 1, 5)) {
                      setPhase("idle");
                    }
                  }}
                >
                  <ProductCard product={product} centered compact />
                </div>
              ))}
            </div>
            </div>
          </div>

          {/* Left arrow */}
          {offset > 0 && (
            <button
              type="button"
              onClick={() => setOffset((prev) => Math.max(prev - step, 0))}
              aria-label="Previous products"
              style={{ top: `calc(1.5rem + ${cardWidth / 2}px)`, transform: "translateY(-50%)" }}
              className="absolute left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper shadow-md transition-all duration-200 hover:border-ink hover:bg-ink hover:text-white"
            >
              <ChevronRight size={18} strokeWidth={2} className="rotate-180" />
            </button>
          )}

          {/* Right arrow */}
          {offset < maxOffset && (
            <button
              type="button"
              onClick={advance}
              aria-label="Next products"
              style={{ top: `calc(1.5rem + ${cardWidth / 2}px)`, transform: "translateY(-50%)" }}
              className="absolute right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper shadow-md transition-all duration-200 hover:border-ink hover:bg-ink hover:text-white"
            >
              <ChevronRight size={18} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
