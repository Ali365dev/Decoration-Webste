import { useEffect, useLayoutEffect } from "react";

/**
 * useLayoutEffect on the client, useEffect on the server (to avoid the SSR
 * warning). GSAP/ScrollTrigger setup must run in a layout effect so its
 * cleanup fires in React's mutation phase — before React removes the DOM on
 * unmount. A passive useEffect cleanup runs too late: React has already tried
 * to removeChild a node GSAP's pin-spacer reparented, throwing NotFoundError.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
