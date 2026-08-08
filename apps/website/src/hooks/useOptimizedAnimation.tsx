import { useMemo } from 'react';
import { useIsMobile } from './use-mobile';

export const useOptimizedAnimation = () => {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const shouldAnimate = !isMobile && !prefersReducedMotion;

  return {
    shouldAnimate,
    // Return empty variants on mobile/reduced-motion for instant rendering
    variants: shouldAnimate ? undefined : {},
    transition: shouldAnimate ? undefined : { duration: 0 },
    // Disable hover animations on mobile
    whileHover: shouldAnimate ? undefined : {},
  };
};
