"use client";

import { useEffect, useRef } from "react";

export function AnnouncementTicker({ messages }: { messages: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      track.classList.toggle("is-offscreen", !entry.isIntersecting);
    });

    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="overflow-hidden bg-[var(--announcement-bar-bg)] text-[var(--announcement-bar-color)]">
      <div
        ref={trackRef}
        className="announcement-ticker flex whitespace-nowrap py-[5px] text-[length:var(--announcement-bar-font-size)] font-medium uppercase leading-[17px] tracking-[0.08em]"
      >
        {[...messages, ...messages].map((message, index) => (
          <span key={`${message}-${index}`} className="mx-8 inline-block">
            {message}
          </span>
        ))}
      </div>
    </div>
  );
}
