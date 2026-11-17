"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Tile = { label: string; href: string; image: string };

export function CategorySlider({ tiles }: { tiles: Tile[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || !("IntersectionObserver" in window)) return;

    const revealObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          revealObserver.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    const pauseObserver = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      track.classList.toggle("is-offscreen", !entry.isIntersecting);
    });

    revealObserver.observe(section);
    pauseObserver.observe(track);

    return () => {
      revealObserver.disconnect();
      pauseObserver.disconnect();
    };
  }, []);

  const doubled = [...tiles, ...tiles];

  return (
    <section
      ref={sectionRef}
      className={`category-slider-section bg-paper overflow-hidden py-[var(--space-30)] md:py-[60px] ${revealed ? "is-revealed" : ""}`}
    >
      <h2 className="category-slider-heading mb-[var(--space-30)] text-center text-[length:var(--btn-font-size)] font-medium uppercase tracking-[0.14em] text-ink">
        Shop by type
      </h2>

      <div ref={trackRef} className="category-slider-track">
        {doubled.map((tile, index) => (
          <Link
            key={`${tile.href}-${index}`}
            href={tile.href}
            className="category-slider-item group"
            aria-hidden={index >= tiles.length ? "true" : undefined}
            tabIndex={index >= tiles.length ? -1 : 0}
          >
            <span className="relative block aspect-square overflow-hidden bg-canvas">
              <Image
                src={tile.image}
                alt={tile.label}
                fill
                sizes="(min-width:1024px) 220px, 160px"
                className="object-cover transition-transform duration-500 ease-[ease] group-hover:scale-[1.07]"
              />
            </span>
            <span className="mt-[var(--space-10)] block text-[length:var(--btn-font-size)] font-medium uppercase tracking-[0.06em] text-ink transition-colors duration-[0.4s] ease-[ease] group-hover:text-[#f05e2d] text-center">
              {tile.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
