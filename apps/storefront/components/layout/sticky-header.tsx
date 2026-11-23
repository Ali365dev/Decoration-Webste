"use client";

import { useEffect, useRef, useState } from "react";
import type { NavItemDto } from "@dec-walls/types";
import { StoreHeader } from "@/components/layout/store-header";

export function StickyHeader({
  navigation,
}: {
  navigation: NavItemDto[];
}) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry) {
        document.documentElement.style.setProperty(
          "--header-h",
          `${Math.round(entry.contentRect.height)}px`,
        );
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // Don't hide until past 80px so it doesn't flicker at the top
      if (y > 80) {
        setHidden(y > lastY.current);
      } else {
        setHidden(false);
      }
      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={wrapRef}
      className="sticky top-0 z-50 transition-transform duration-300 ease-[ease]"
      style={{ transform: hidden ? "translateY(-100%)" : "translateY(0)" }}
    >
      <StoreHeader navigation={navigation} />
    </div>
  );
}
