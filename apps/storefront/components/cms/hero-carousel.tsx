"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

type HeroCarouselProps = {
  images: string[];
  titleLine1: string;
  titleLine2: string;
  ctaHref: string;
};

export function HeroCarousel({
  images,
  titleLine1,
  titleLine2,
  ctaHref,
}: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideCount = images.length;

  useEffect(() => {
    if (slideCount < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [slideCount]);

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + slideCount) % slideCount);
  };
  const showNext = () => {
    setActiveIndex((current) => (current + 1) % slideCount);
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="group relative min-h-[70vh] w-full overflow-hidden bg-ink md:min-h-[82vh]"
    >
      {images.map((image, index) => (
        <Image
          key={image}
          src={image}
          alt=""
          fill
          priority={index === 0}
          sizes="100vw"
          aria-hidden="true"
          className={`absolute inset-0 object-cover transition-opacity duration-700 ease-in-out ${index === activeIndex ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
        <p className="hero-line hero-line-1 text-[length:var(--navigation-font-size)] font-medium uppercase leading-[20.8px] tracking-[0.28em]">
          {titleLine1}
        </p>
        <h1
          className="hero-line hero-line-2 mt-[var(--space-6)] text-[72px] leading-none text-[#c45c5c] md:text-[104px]"
          style={{ fontFamily: "var(--font-script), cursive" }}
        >
          {titleLine2}
        </h1>
        <Link
          href={ctaHref}
          className="hero-line hero-line-3 mt-8 inline-block rounded-pill border border-white bg-white px-[55px] py-[13.6px] text-xs font-medium uppercase tracking-wide text-ink transition-all duration-[0.4s] hover:bg-transparent hover:text-white"
        >
          Shop now
        </Link>
      </div>

      {slideCount > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous featured image"
            onClick={showPrevious}
            className="absolute left-4 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white/80 text-ink opacity-100 shadow-sm transition hover:bg-white md:left-8 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
          >
            <ArrowLeft size={19} strokeWidth={1.6} />
          </button>
          <button
            type="button"
            aria-label="Next featured image"
            onClick={showNext}
            className="absolute right-4 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white/80 text-ink opacity-100 shadow-sm transition hover:bg-white md:right-8 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
          >
            <ArrowRight size={19} strokeWidth={1.6} />
          </button>
          <div className="absolute inset-x-0 bottom-5 z-10 flex justify-center gap-2">
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                aria-label={`Show featured image ${index + 1}`}
                aria-current={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                className={`size-2.5 rounded-full border border-white transition-colors ${index === activeIndex ? "bg-white" : "bg-white/35 hover:bg-white/70"}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
