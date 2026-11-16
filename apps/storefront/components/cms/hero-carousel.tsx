"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const sectionRef = useRef<HTMLElement>(null);
  const exitRef = useRef<HTMLDivElement>(null);
  const slideCount = images.length;

  useEffect(() => {
    const section = sectionRef.current;
    const exit = exitRef.current;
    if (!section || !exit || !("IntersectionObserver" in window)) return;

    const slides = Array.from(
      section.querySelectorAll<HTMLElement>("[data-hero-slide]"),
    );

    const sectionObserver = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      section.classList.toggle("is-offscreen", !entry.isIntersecting);
    });

    const slideObserver = new IntersectionObserver(
      () => {
        const mostVisible = slides
          .map((slide, index) => {
            const bounds = slide.getBoundingClientRect();
            const visibleHeight = Math.max(
              0,
              Math.min(bounds.bottom, window.innerHeight) -
                Math.max(bounds.top, 0),
            );

            return {
              index,
              ratio: visibleHeight / Math.max(bounds.height, 1),
            };
          })
          .sort((first, second) => second.ratio - first.ratio)[0];

        if (mostVisible && mostVisible.ratio > 0.25) {
          setActiveIndex((current) =>
            current === mostVisible.index ? current : mostVisible.index,
          );
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sectionObserver.observe(section);
    slides.forEach((slide) => slideObserver.observe(slide));

    const updateRootSnap = () => {
      const root = document.documentElement;
      const scrollY = window.scrollY;
      const heroStart = section.getBoundingClientRect().top + scrollY;
      const heroExit = exit.getBoundingClientRect().top + scrollY;
      const rootSnapEnabled = root.classList.contains("hero-snap-enabled");
      const enteringHero =
        scrollY + window.innerHeight > heroStart &&
        scrollY <= heroExit - window.innerHeight * 0.55;
      const leavingHero =
        scrollY >= heroExit || scrollY + window.innerHeight <= heroStart;

      if (leavingHero) {
        root.classList.remove("hero-snap-enabled");
      } else if (rootSnapEnabled || enteringHero) {
        root.classList.add("hero-snap-enabled");
      }
    };

    updateRootSnap();
    window.addEventListener("scroll", updateRootSnap, { passive: true });
    window.addEventListener("resize", updateRootSnap);

    return () => {
      sectionObserver.disconnect();
      slideObserver.disconnect();
      window.removeEventListener("scroll", updateRootSnap);
      window.removeEventListener("resize", updateRootSnap);
      section.classList.remove("is-offscreen");
      document.documentElement.classList.remove("hero-snap-enabled");
    };
  }, []);

  const goToSlide = (index: number) => {
    const target = sectionRef.current?.querySelector<HTMLElement>(
      `[data-hero-slide="${index}"]`,
    );
    if (!target) return;

    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  };

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="hero-snap"
    >
      {images.map((image, index) => {
        const isActive = index === activeIndex;

        return (
          <article
            key={`${image}-${index}`}
            data-hero-slide={index}
            aria-label={`Featured collection ${index + 1} of ${slideCount}`}
            aria-hidden={!isActive}
            inert={!isActive}
            className={`hero-snap-slide ${isActive ? "is-active" : ""}`}
          >
            <Image
              src={image}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              aria-hidden="true"
              className="hero-snap-image"
            />
            <div className="hero-snap-shade" aria-hidden="true" />

            <div className="hero-snap-copy">
              {index === 0 ? (
                <h1 className="hero-snap-heading hero-line">
                  {titleLine2}
                </h1>
              ) : (
                <h2 className="hero-snap-heading hero-line">
                  {titleLine2}
                </h2>
              )}
              <p className="hero-snap-support hero-line">{titleLine1}</p>
              <Link href={ctaHref} className="hero-snap-cta hero-line">
                Shop now
              </Link>
            </div>

            {slideCount > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Previous featured image"
                  onClick={() =>
                    goToSlide((index - 1 + slideCount) % slideCount)
                  }
                  className="hero-snap-arrow hero-snap-arrow-previous"
                >
                  <ArrowLeft size={19} strokeWidth={1.6} />
                </button>
                <button
                  type="button"
                  aria-label="Next featured image"
                  onClick={() => goToSlide((index + 1) % slideCount)}
                  className="hero-snap-arrow hero-snap-arrow-next"
                >
                  <ArrowRight size={19} strokeWidth={1.6} />
                </button>
                <div className="hero-snap-pagination" aria-label="Hero slides">
                  {images.map((slideImage, slideIndex) => (
                    <button
                      key={`${slideImage}-${slideIndex}`}
                      type="button"
                      aria-label={`Show featured image ${slideIndex + 1}`}
                      aria-current={slideIndex === activeIndex}
                      onClick={() => goToSlide(slideIndex)}
                      className={`hero-snap-dot ${slideIndex === activeIndex ? "is-current" : ""}`}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </article>
        );
      })}

      <div ref={exitRef} className="hero-snap-exit" aria-hidden="true" />
    </section>
  );
}
