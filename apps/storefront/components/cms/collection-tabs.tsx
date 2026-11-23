"use client";

import type { ProductDto } from "@dec-walls/types";
import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";

type Tab = { label: string; collectionSlug: string };

/** Fade-out time for the outgoing grid; keep in sync with .collection-tabs-grid in globals.css. */
const OUT_MS = 320;
const GAP = 20;
const AUTO_SCROLL_MS = 3500;

/**
 * Pill tabs that swap the product grid in place: the current grid fades out,
 * then the new products fade up one after another. The grid itself is a
 * horizontally scrollable row that auto-advances left to right and reveals
 * nav arrows on hover.
 */
export function CollectionTabs({
  tabs,
  productsBySlug,
}: {
  tabs: Tab[];
  productsBySlug: Record<string, ProductDto[]>;
}) {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(0);
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const select = (index: number) => {
    if (index === active) return;
    setActive(index);
    window.clearTimeout(timer.current);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(index);
      return;
    }
    setPhase("out");
    timer.current = window.setTimeout(() => {
      setShown(index);
      setPhase("in");
    }, OUT_MS);
  };

  const products = productsBySlug[tabs[shown]?.collectionSlug ?? ""] ?? [];

  const viewportRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(290);
  const step = cardWidth + GAP;
  const [offset, setOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);
  const [hovered, setHovered] = useState(false);
  // Suppresses the track's horizontal transition only for the silent reset
  // that happens when switching tabs, so the fade transition isn't muddied
  // by a left-right slide.
  const [snapReset, setSnapReset] = useState(false);

  useEffect(() => {
    function recalc() {
      setCardWidth(window.innerWidth < 640 ? 170 : 290);
    }
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, []);

  useEffect(() => {
    function recalcOffset() {
      const vw = viewportRef.current?.clientWidth ?? 0;
      const totalW = products.length * step - GAP;
      setMaxOffset(Math.max(0, totalW - vw));
    }
    recalcOffset();
    window.addEventListener("resize", recalcOffset);
    return () => window.removeEventListener("resize", recalcOffset);
  }, [products.length, step]);

  // Reset scroll position whenever the visible tab's products change, without
  // animating the reset itself (that's a silent snap, not a user-driven scroll).
  useEffect(() => {
    setSnapReset(true);
    setOffset(0);
    const id = requestAnimationFrame(() => setSnapReset(false));
    return () => cancelAnimationFrame(id);
  }, [shown]);

  // Auto-advance left to right, pausing on hover and looping back to the start.
  useEffect(() => {
    if (hovered || maxOffset <= 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setOffset((prev) => (prev >= maxOffset ? 0 : Math.min(prev + step, maxOffset)));
    }, AUTO_SCROLL_MS);
    return () => window.clearInterval(id);
  }, [hovered, maxOffset, step]);

  function advance() {
    setOffset((prev) => Math.min(prev + step, maxOffset));
  }

  function retreat() {
    setOffset((prev) => Math.max(prev - step, 0));
  }

  // Touch swipe: the row is transform-driven (not natively scrollable), so map a
  // horizontal swipe to one step. Vertical drags fall through to page scroll.
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    if (t) touchStart.current = { x: t.clientX, y: t.clientY };
    setHovered(true); // pause auto-advance while the user is interacting
  }
  function onTouchEnd(e: React.TouchEvent) {
    const start = touchStart.current;
    const t = e.changedTouches[0];
    touchStart.current = null;
    setHovered(false);
    if (!start || !t) return;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) advance();
    else retreat();
  }

  return (
    <section className="bg-paper py-12 md:py-16">
      <div className="container-page">
        <div
          role="tablist"
          aria-label="Shop by room"
          className="mb-8 flex flex-wrap justify-center gap-2 md:mb-10 md:gap-3"
        >
          {tabs.map((tab, index) => {
            const isActive = index === active;
            const isSale = tab.label === "SALE";
            return (
              <button
                key={tab.label}
                type="button"
                role="tab"
                id={`collection-tab-${index}`}
                aria-selected={isActive}
                aria-controls="collection-tabs-panel"
                onClick={() => select(index)}
                className={`collection-tab rounded-pill px-6 py-2.5 text-xs font-medium uppercase tracking-wide md:px-7 md:py-3 ${
                  isSale ? "text-[#f05e2d]" : "text-ink"
                } ${isActive ? "is-active" : ""}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          ref={viewportRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchCancel={() => setHovered(false)}
          className="group/carousel relative touch-pan-y overflow-hidden"
        >
          <div
            id="collection-tabs-panel"
            role="tabpanel"
            aria-labelledby={`collection-tab-${active}`}
            aria-busy={phase === "out"}
            className={`collection-tabs-grid ${phase === "out" ? "is-out" : ""}`}
          >
            <div
              className="flex gap-5"
              style={{
                transform: `translateX(-${offset}px)`,
                transition: snapReset
                  ? "none"
                  : "transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                willChange: "transform",
              }}
            >
              {products.map((product, index) => (
                <div
                  // Re-key per tab so each switch replays the entrance animation.
                  key={`${shown}-${product.id}`}
                  className={`shrink-0 ${phase === "in" ? "collection-tabs-item" : ""}`}
                  style={{ width: cardWidth }}
                  onAnimationEnd={(e) => {
                    if (e.target === e.currentTarget && index === 0) {
                      setPhase("idle");
                    }
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          {offset > 0 && (
            <button
              type="button"
              onClick={retreat}
              aria-label="Previous products"
              style={{ top: cardWidth / 2, transform: "translateY(-50%)" }}
              className="absolute left-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper opacity-0 shadow-md transition-all duration-200 group-hover/carousel:opacity-100 [@media(hover:none)]:opacity-100 hover:border-ink hover:bg-ink hover:text-white"
            >
              <ChevronRight size={18} strokeWidth={2} className="rotate-180" />
            </button>
          )}

          {offset < maxOffset && (
            <button
              type="button"
              onClick={advance}
              aria-label="Next products"
              style={{ top: cardWidth / 2, transform: "translateY(-50%)" }}
              className="absolute right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper opacity-0 shadow-md transition-all duration-200 group-hover/carousel:opacity-100 [@media(hover:none)]:opacity-100 hover:border-ink hover:bg-ink hover:text-white"
            >
              <ChevronRight size={18} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
