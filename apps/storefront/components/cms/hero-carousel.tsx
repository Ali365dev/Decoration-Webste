"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type HeroSlide = {
  image: string;
  heading: string;
  label?: string;
  ctaHref: string;
  ctaLabel?: string;
};

type HeroCarouselProps = {
  slides: HeroSlide[];
};

type Direction = "down" | "up";

/** Must cover the longest transition in globals.css (panel wipe + copy roll-in). */
const TRANSITION_MS = 1150;
/** Trackpad inertia keeps emitting wheel events; a new gesture starts after this gap. */
const WHEEL_QUIET_MS = 120;
/** Accumulated wheel distance (px) needed before a gesture counts as a slide change. */
const WHEEL_THRESHOLD = 15;
const SWIPE_THRESHOLD = 32;

/**
 * Full-page style hero (modelled on fullPage.js): while the hero fills the
 * viewport, one wheel / swipe / key gesture moves exactly one slide. The next
 * panel wipes over the current one and the copy rolls through line masks.
 * Scrolling past the last (or before the first) slide releases to the page.
 */
export function HeroCarousel({ slides }: HeroCarouselProps) {
  const slideCount = slides.length;
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [direction, setDirection] = useState<Direction>("down");
  const [hasMoved, setHasMoved] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const activeRef = useRef(0);
  const lockedRef = useRef(false);
  const lastWheelRef = useRef(0);
  const timerRef = useRef<number | undefined>(undefined);

  const goTo = useCallback(
    (target: number) => {
      const from = activeRef.current;
      if (lockedRef.current || target === from || target < 0 || target >= slideCount) {
        return;
      }
      lockedRef.current = true;
      activeRef.current = target;
      setDirection(target > from ? "down" : "up");
      setLeaving(from);
      setActive(target);
      setHasMoved(true);

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(
        () => {
          setLeaving(null);
          lockedRef.current = false;
        },
        reduce ? 0 : TRANSITION_MS,
      );
    },
    [slideCount],
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || slideCount < 2) return;

    /** True while the hero fills the viewport (accounting for overlay header). */
    const heroInView = () => {
      const r = section.getBoundingClientRect();
      const headerH = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--header-h") || "0",
      );
      // top may be slightly negative due to the negative-margin overlay technique
      return (
        r.top >= -(headerH + 2) && r.top < window.innerHeight * 0.3 && r.bottom >= window.innerHeight - 2
      );
    };

    /** Whether a gesture in this direction belongs to the hero rather than the page. */
    const claims = (dir: Direction) => {
      if (!heroInView()) return false;
      if (lockedRef.current) return true;
      const i = activeRef.current;
      return dir === "down" ? i < slideCount - 1 : i > 0;
    };

    const step = (dir: Direction) => goTo(activeRef.current + (dir === "down" ? 1 : -1));

    // Trackpads stream many small deltas per swipe (starting at 1–3px) followed by
    // momentum, so treat a stream as one gesture: accumulate until it crosses the
    // threshold, step once, then swallow the rest of that stream.
    let accum = 0;
    let consumed = false;
    let lastAbs = 0;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      if (dy === 0) return;
      const dir: Direction = dy > 0 ? "down" : "up";
      if (!claims(dir)) return;
      e.preventDefault();

      const now = performance.now();
      const abs = Math.abs(dy);
      const quiet = now - lastWheelRef.current > WHEEL_QUIET_MS;
      // A sharp rise in delta while momentum is decaying means a fresh swipe.
      const reSwipe = consumed && !lockedRef.current && abs > 20 && abs > lastAbs * 2;
      if (quiet || reSwipe) {
        accum = 0;
        consumed = false;
      }
      lastWheelRef.current = now;
      lastAbs = abs;

      if (lockedRef.current || consumed) return;
      if (accum !== 0 && Math.sign(accum) !== Math.sign(dy)) accum = 0;
      accum += dy;
      if (Math.abs(accum) >= WHEEL_THRESHOLD) {
        consumed = true;
        accum = 0;
        step(dir);
      }
    };

    let touchY: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY === null) return;
      const dy = touchY - (e.touches[0]?.clientY ?? touchY);
      if (Math.abs(dy) < 6) return;
      const dir: Direction = dy > 0 ? "down" : "up";
      if (!claims(dir)) {
        touchY = null;
        return;
      }
      e.preventDefault();
      if (Math.abs(dy) >= SWIPE_THRESHOLD) {
        step(dir);
        touchY = null;
      }
    };
    const onTouchEnd = () => {
      touchY = null;
    };

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, button, a, [contenteditable='true']")) return;
      const down = e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey);
      const up = e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey);
      if (!down && !up) return;
      const dir: Direction = down ? "down" : "up";
      if (!claims(dir)) return;
      e.preventDefault();
      step(dir);
    };

    section.addEventListener("wheel", onWheel, { passive: false });
    section.addEventListener("touchstart", onTouchStart, { passive: true });
    section.addEventListener("touchmove", onTouchMove, { passive: false });
    section.addEventListener("touchend", onTouchEnd);
    window.addEventListener("keydown", onKey);

    return () => {
      section.removeEventListener("wheel", onWheel);
      section.removeEventListener("touchstart", onTouchStart);
      section.removeEventListener("touchmove", onTouchMove);
      section.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timerRef.current);
    };
  }, [goTo, slideCount]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="hero-fp"
      data-dir={direction}
      data-moved={hasMoved || undefined}
    >
      {slides.map((slide, index) => {
        const isActive = index === active;
        const state = isActive ? "is-active" : index === leaving ? "is-leaving" : "";

        return (
          <article
            key={`${slide.image}-${index}`}
            aria-roledescription="slide"
            aria-label={`Slide ${index + 1} of ${slideCount}`}
            aria-hidden={!isActive}
            inert={!isActive}
            className={`hero-fp-slide ${state}`}
          >
            <div className="hero-fp-media" aria-hidden="true">
              <Image
                src={slide.image}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className="hero-fp-image"
              />
            </div>
            <div className="hero-fp-shade" aria-hidden="true" />

            <div className="hero-fp-copy">
              {slide.label && (
                <p className="hero-fp-mask hero-fp-support">
                  <span className="hero-fp-roll">{slide.label}</span>
                </p>
              )}
              {index === 0 ? (
                <h1 className="hero-fp-mask hero-fp-heading">
                  <span className="hero-fp-roll">{slide.heading}</span>
                </h1>
              ) : (
                <h2 className="hero-fp-mask hero-fp-heading">
                  <span className="hero-fp-roll">{slide.heading}</span>
                </h2>
              )}
              <div className="hero-fp-mask hero-fp-cta-mask">
                <Link href={slide.ctaHref} className="hero-fp-roll hero-fp-cta">
                  {slide.ctaLabel ?? "Shop Now"}
                </Link>
              </div>
            </div>
          </article>
        );
      })}

      {/* Fixed chrome — stays put while panels wipe underneath, like the reference */}
      <div className="hero-fp-counter" aria-hidden="true">
        <span className="hero-fp-mask hero-fp-counter-current">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`hero-fp-roll hero-fp-digit ${
                i === active ? "is-active" : i === leaving ? "is-leaving" : ""
              }`}
            >
              {pad(i + 1)}
            </span>
          ))}
        </span>
        <span className="hero-fp-counter-sep" />
        <span>{pad(slideCount)}</span>
      </div>

      {slideCount > 1 && (
        <>
          <div className="hero-fp-pagination" role="group" aria-label="Slides">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === active}
                onClick={() => goTo(i)}
                className={`hero-fp-dot ${i === active ? "is-current" : ""}`}
              />
            ))}
          </div>

          <div className="hero-fp-progress" aria-hidden="true">
            <span
              className="hero-fp-progress-bar"
              style={{ transform: `scaleX(${(active + 1) / slideCount})` }}
            />
          </div>

          <p className="hero-fp-hint" aria-hidden="true">
            Scroll down
          </p>
        </>
      )}
    </section>
  );
}
