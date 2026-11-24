"use client";

import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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

/**
 * Duration of the window scroll tween between slides. Kept close to the 900ms
 * CSS panel wipe so a slide feels like one quick snap rather than a long lock;
 * the copy roll-in continues on its own after input is released.
 */
const TRANSITION_MS = 820;
/** Short lock after a snap so leftover trackpad momentum can't over-advance. */
const MOMENTUM_COOLDOWN_MS = 140;

/**
 * Full-page style hero (modelled on fullPage.js): while the hero is pinned,
 * one wheel / swipe / key gesture moves exactly one slide — the browser's own
 * scroll position is the single source of truth (via a real ScrollTrigger
 * pin), so there's no rect-polling heuristic that can drift out of sync.
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
  const animatingRef = useRef(false);
  const goToRef = useRef<(target: number) => void>(() => {});

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || slideCount < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger, Observer, ScrollToPlugin);

    let pinnedST: ScrollTrigger | undefined;

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${(slideCount - 1) * window.innerHeight}`,
        pin: true,
        anticipatePin: 1,
      });
      pinnedST = st;

      const goTo = (target: number) => {
        if (animatingRef.current) return;
        target = gsap.utils.clamp(0, slideCount - 1, target);
        const from = activeRef.current;
        if (target === from) return;

        animatingRef.current = true;
        activeRef.current = target;
        setDirection(target > from ? "down" : "up");
        setLeaving(from);
        setActive(target);
        setHasMoved(true);

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        gsap.to(window, {
          scrollTo: { y: st.start + target * window.innerHeight },
          duration: reduce ? 0 : TRANSITION_MS / 1000,
          ease: "power2.inOut",
          onComplete: () => {
            setLeaving(null);
            // Hold the input lock a beat longer so residual trackpad momentum
            // right after the snap doesn't immediately fire the next slide.
            gsap.delayedCall(reduce ? 0 : MOMENTUM_COOLDOWN_MS / 1000, () => {
              animatingRef.current = false;
            });
          },
        });
      };

      goToRef.current = goTo;

      // Only wheel/touch — "pointer" would also fire on ordinary mouse
      // drags/clicks (e.g. the CTA link), which isn't a scroll gesture.
      Observer.create({
        target: window,
        type: "wheel,touch",
        tolerance: 10,
        preventDefault: false,
        onDown: (self) => {
          if (!st.isActive || activeRef.current >= slideCount - 1) return;
          self.event.preventDefault();
          goTo(activeRef.current + 1);
        },
        onUp: (self) => {
          if (!st.isActive || activeRef.current <= 0) return;
          self.event.preventDefault();
          goTo(activeRef.current - 1);
        },
      });

      const onKey = (e: KeyboardEvent) => {
        if (!st.isActive) return;
        const t = e.target as HTMLElement | null;
        if (t?.closest("input, textarea, select, button, a, [contenteditable='true']")) return;
        const down = e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey);
        const up = e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey);
        if (down && activeRef.current < slideCount - 1) {
          e.preventDefault();
          goTo(activeRef.current + 1);
        } else if (up && activeRef.current > 0) {
          e.preventDefault();
          goTo(activeRef.current - 1);
        }
      };
      window.addEventListener("keydown", onKey);

      return () => window.removeEventListener("keydown", onKey);
    }, section);

    return () => {
      pinnedST?.kill(); // removes pin spacer before ctx.revert touches the DOM
      ctx.revert();
    };
  }, [slideCount]);

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
                onClick={() => goToRef.current(i)}
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
