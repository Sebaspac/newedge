import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsMobile } from "./use-mobile";

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes Lenis smooth scrolling on the document.
 * Disabled on mobile and when prefers-reduced-motion is set.
 *
 * Keeps GSAP ScrollTrigger in sync with Lenis' virtual scroll position so
 * scroll-driven animations (e.g. the Methodik card stack) run smoothly instead
 * of fighting Lenis. On mobile / reduced-motion, Lenis is off and ScrollTrigger
 * falls back to native scroll, which works on its own.
 */
export const useLenis = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || isMobile) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
    };
  }, [isMobile]);
};
