import { useRef, useEffect } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";

type MagneticReturn<T extends HTMLElement> = {
  ref: React.RefObject<T>;
  x: MotionValue<number>;
  y: MotionValue<number>;
};

/**
 * Magnetic hover: element subtly follows the cursor on hover.
 * Returns spring-smoothed x/y motion values you can apply to a child element.
 *
 * @param strength  Fraction of cursor offset to mirror (0.0–1.0). Default 0.35.
 * @param max       Hard pixel cap so it never overshoots. Default 12.
 */
export function useMagnetic<T extends HTMLElement = HTMLDivElement>(
  strength = 0.35,
  max = 12,
): MagneticReturn<T> {
  const ref = useRef<T>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 200, damping: 22, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 200, damping: 22, mass: 0.5 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
      const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
      rawX.set(Math.max(-max, Math.min(max, dx)));
      rawY.set(Math.max(-max, Math.min(max, dy)));
    };
    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength, max, rawX, rawY]);

  return { ref, x, y };
}

/**
 * Mouse parallax: returns motion values that move OPPOSITE to the cursor,
 * relative to the host element. Use on decorative children (ghost numerals,
 * glow blobs) for a fake-3D depth.
 *
 * @param strength  Pixel range for full corner-to-corner travel. Default 14.
 */
export function useMouseParallax<T extends HTMLElement = HTMLDivElement>(
  strength = 14,
): MagneticReturn<T> {
  const ref = useRef<T>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 120, damping: 18, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 120, damping: 18, mass: 0.6 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const ny = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      // Move opposite to cursor for a "look-into" feel.
      rawX.set(-nx * strength);
      rawY.set(-ny * strength);
    };
    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength, rawX, rawY]);

  return { ref, x, y };
}
