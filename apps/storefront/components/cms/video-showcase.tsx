"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export type VideoShowcaseProps = {
  videoSrc: string;
  videoSrcMobile?: string;
  posterSrc: string;
  heading?: string;
  description?: string;
  cta?: { label: string; href: string };
};

export function VideoShowcase({
  videoSrc,
  videoSrcMobile,
  posterSrc,
  heading = "Give Your Walls a Story.",
  description = "Discover thoughtfully curated wall art that transforms ordinary spaces into extraordinary homes.",
  cta = { label: "Read More", href: "/pages/about" },
}: VideoShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setIsMobile(window.innerWidth < 768);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* Autoplay when scrolled into view, pause when out */
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setTextVisible(true);
          if (!reducedMotion) {
            video.play().then(() => setPlaying(true)).catch(() => {});
          }
        } else {
          video.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [reducedMotion]);

  /* Subtle scroll-driven scale */
  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    function onScroll() {
      if (!section || !video) return;
      const { top, height } = section.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -top / height));
      video.style.transform = `scale(${1 + progress * 0.05})`;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reducedMotion]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  const activeSrc = isMobile && videoSrcMobile ? videoSrcMobile : videoSrc;

  return (
    <section
      ref={sectionRef}
      aria-label="Wall art video showcase"
      className="relative w-full overflow-hidden bg-[#1c1a17]"
      style={{ height: "clamp(500px, 75vh, 900px)" }}
    >
      {/* Poster fallback */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={posterSrc}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
        style={{
          opacity: videoLoaded ? 0 : 1,
          transition: "opacity 1400ms ease",
        }}
      />

      {/* Video */}
      <video
        ref={videoRef}
        src={activeSrc}
        poster={posterSrc}
        muted
        loop
        playsInline
        preload="auto"
        onCanPlayThrough={() => setVideoLoaded(true)}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
        style={{
          opacity: videoLoaded ? 1 : 0,
          transition: "opacity 1400ms ease",
          transformOrigin: "center center",
        }}
      />

      {/* Gradient — heavier on left + bottom, editorial feel */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: [
            "linear-gradient(to right, rgba(10,9,8,0.72) 0%, rgba(10,9,8,0.28) 55%, rgba(10,9,8,0.0) 100%)",
            "linear-gradient(to top, rgba(10,9,8,0.60) 0%, rgba(10,9,8,0.0) 50%)",
          ].join(", "),
        }}
      />

      {/* Text — bottom-left */}
      <div
        className="absolute bottom-0 left-0 max-w-lg px-10 pb-14 md:px-16 md:pb-16"
        style={{
          opacity: textVisible ? 1 : 0,
          transform: textVisible ? "none" : "translateY(20px)",
          transition: reducedMotion
            ? "none"
            : "opacity 900ms cubic-bezier(0.22,1,0.36,1) 200ms, transform 900ms cubic-bezier(0.22,1,0.36,1) 200ms",
        }}
      >
        {/* Heading — large italic serif */}
        <h2
          className="mb-4 font-serif text-[clamp(2rem,4.5vw,3.6rem)] font-normal italic leading-[1.08] text-white"
          style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
        >
          {heading}
        </h2>

        {/* Description */}
        <p className="mb-6 max-w-sm text-[clamp(0.8rem,1.3vw,0.95rem)] font-normal leading-relaxed text-white/80">
          {description}
        </p>

        {/* CTA — underline style */}
        <Link
          href={cta.href}
          className="inline-block border-b border-white/70 pb-[2px] text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-all duration-200 hover:border-white hover:text-white/90"
        >
          {cta.label}
        </Link>
      </div>

      {/* Play / Pause */}
      <button
        type="button"
        onClick={togglePlay}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute bottom-6 right-6 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/25 text-white backdrop-blur-sm transition-all duration-200 hover:border-white/70 hover:bg-black/45"
      >
        {playing
          ? <Pause size={13} strokeWidth={2} />
          : <Play size={13} strokeWidth={2} />}
      </button>
    </section>
  );
}
