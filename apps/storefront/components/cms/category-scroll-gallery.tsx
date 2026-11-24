"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Tile = { label: string; href: string; image: string; badge?: string; ctaLabel?: string };

// 3 cards + 2 gaps (16px each) = section width on desktop.
// card = (100% - 32px) / 3  →  33.333% - 10.667px
// 6 cards + 5 gaps = 2×section + 16px → GSAP distance = section + 16px,
// which is exactly the offset to the first pixel of card 4. Perfect alignment.
const DESKTOP_CARD = "calc(33.333% - 10.667px)";
const MOBILE_CARD  = "72vw";

export function CategoryScrollGallery({
  eyebrow,
  tiles,
}: {
  eyebrow?: string;
  tiles: Tile[];
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section || !track || tiles.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    let pinnedST: ScrollTrigger | undefined;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const getDistance = () => Math.max(0, track.scrollWidth - section.clientWidth);

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getDistance()}`,
            scrub: true,
            pin: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => setProgress(self.progress),
          },
        });

        pinnedST = tween.scrollTrigger ?? undefined;

        return () => {
          pinnedST?.kill();
          tween.kill();
          pinnedST = undefined;
        };
      });
    }, section);

    return () => {
      pinnedST?.kill(); // removes pin spacer before ctx.revert touches the DOM
      ctx.revert();
    };
  }, [tiles.length]);

  return (
    <div ref={sectionRef} className="lg:flex lg:h-[770px] lg:max-h-[770px] lg:flex-col lg:justify-center">
      {eyebrow ? (
        <div className="px-6 pb-5 pt-10 sm:px-10 md:pt-12">
          <p className="text-[17px] font-bold uppercase tracking-[0.25em] text-ink underline underline-offset-4">{eyebrow}</p>
        </div>
      ) : null}

      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-1 overflow-x-auto scroll-px-6 will-change-transform snap-x snap-mandatory lg:overflow-visible lg:snap-none"
        >
          {/* 200px left spacer — desktop only, keeps first card off the left edge */}
          <div className="hidden shrink-0 lg:block" style={{ width: "200px" }} aria-hidden="true" />


          {tiles.map((tile) => (
            <article
              key={tile.href + tile.label}
              className="group shrink-0 snap-start"
              style={{ width: `min(${MOBILE_CARD}, ${DESKTOP_CARD})` }}
            >
              {/* Image frame — aspect ratio matches reference: padding-bottom 125% */}
              <div className="relative overflow-hidden bg-canvas" style={{ aspectRatio: "3.9/4.6", maxHeight: "570px" }}>
                {/* Full-card link sits behind everything */}
                <Link
                  href={tile.href}
                  aria-label={`Navigate to ${tile.label}`}
                  className="absolute inset-0 z-10"
                />

                <Image
                  src={tile.image}
                  alt={tile.label}
                  fill
                  sizes="(min-width:1024px) 33vw, 75vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />

                {/* Discount badge — top-left */}
                {tile.badge ? (
                  <div className="absolute left-0 top-0 z-20 bg-[#f05e2d] px-3 py-2 text-[1.1rem] font-bold leading-none text-white">
                    {tile.badge}
                  </div>
                ) : null}

                {/* Shopping bag button — bottom-right, with pulse ring */}
                <button
                  type="button"
                  aria-label="View all products"
                  className="absolute bottom-3 right-2 z-20 flex h-9 w-9 items-center justify-center md:bottom-4 md:right-4"
                >
                  {/* Pulse ring */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-full bg-white/80 animate-ping opacity-30"
                  />
                  {/* Circle */}
                  <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-[2px] transition-colors duration-200 hover:bg-white">
                    <ShoppingBag size={15} strokeWidth={1.75} className="opacity-80" />
                  </span>
                </button>
              </div>

              {/* Card footer */}
              <div className="px-1 pb-4 pt-4">
                <h2
                  className="w-full text-[clamp(1.6rem,2.5vw,2.6rem)] font-bold leading-[1.15] tracking-normal text-ink"
                  style={{ fontFamily: "var(--font-playfair, serif)" }}
                >
                  {tile.label}
                </h2>
                <Link
                  href={tile.href}
                  className="mt-1 block text-[13px] font-bold uppercase tracking-[0.04em] text-ink underline underline-offset-2"
                >
                  {tile.ctaLabel ?? "Shop Now"}
                </Link>
              </div>
            </article>
          ))}

          {/* 400px right spacer — desktop only */}
          <div className="hidden shrink-0 lg:block" style={{ width: "400px" }} aria-hidden="true" />
        </div>

      </div>

      {/* Scroll progress bar — outside overflow-hidden so it's never clipped */}
      <div className="hidden lg:block mx-[200px] h-[2px] bg-line-soft" style={{ transform: "translateY(60px)" }}>
        <div
          className="h-full bg-ink"
          style={{ width: `${progress * 100}%`, transition: "none" }}
        />
      </div>
    </div>
  );
}
