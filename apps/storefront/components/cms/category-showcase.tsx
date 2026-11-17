"use client";

import type { ProductDto } from "@dec-walls/types";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";

type CategoryNav = { label: string; href: string };

const GAP = 20;
const CARD_WIDTH = 310;
const STEP = CARD_WIDTH + GAP;

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
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const activeSlug = slugFromHref(categoryNav[activeIndex]?.href ?? "");
  const products = productsBySlug[activeSlug] ?? productsBySlug[defaultSlug] ?? [];

  const viewportRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);
  const [startPad, setStartPad] = useState(0);

  useEffect(() => {
    function recalc() {
      const vw = viewportRef.current?.clientWidth ?? 0;
      const totalW = products.length * STEP - GAP;
      const overflow = totalW - vw;
      setMaxOffset(Math.max(0, overflow));
      setStartPad(overflow <= 0 ? Math.max(0, Math.floor((vw - totalW) / 2)) : 0);
    }
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [products.length]);

  function selectCategory(index: number) {
    setActiveIndex(index);
    setOffset(0);
  }

  function advance() {
    setOffset((prev) => Math.min(prev + STEP, maxOffset));
  }

  return (
    <section className="bg-paper py-10 md:py-14">
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
        <aside className="hidden w-[200px] shrink-0 border-r border-line-soft px-6 py-10 md:block lg:w-[220px]">
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
          <div ref={viewportRef} className="overflow-hidden px-6 pb-10 pt-6">
            <div
              className="flex gap-5"
              style={{
                paddingLeft: startPad,
                transform: `translateX(-${offset}px)`,
                transition: "transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                willChange: "transform",
              }}
            >
              {products.map((product) => (
                <div key={product.id} className="shrink-0" style={{ width: CARD_WIDTH }}>
                  <ProductCard product={product} centered compact />
                </div>
              ))}
            </div>
          </div>

          {/* Left arrow */}
          {offset > 0 && (
            <button
              type="button"
              onClick={() => setOffset((prev) => Math.max(prev - STEP, 0))}
              aria-label="Previous products"
              style={{ top: `calc(1.5rem + ${CARD_WIDTH / 2}px)`, transform: "translateY(-50%)" }}
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
              style={{ top: `calc(1.5rem + ${CARD_WIDTH / 2}px)`, transform: "translateY(-50%)" }}
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
