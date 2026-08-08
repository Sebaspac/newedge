import { useEffect, useRef, useState, useCallback } from 'react';

interface ScrollFadeOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Custom hook for scroll-based fade-in animations
 * Uses IntersectionObserver for performance
 */
export const useScrollFadeIn = (options: ScrollFadeOptions = {}) => {
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px', once = true } = options;
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(element);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref: elementRef, isVisible };
};

/**
 * Hook that returns animation classes based on visibility
 */
export const useScrollFadeInClasses = (options: ScrollFadeOptions = {}) => {
  const { ref, isVisible } = useScrollFadeIn(options);

  const animationClasses = isVisible
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-8';

  return { ref, isVisible, animationClasses };
};

/**
 * Multiple elements fade-in with stagger effect
 */
export const useStaggeredFadeIn = (itemCount: number, options: ScrollFadeOptions = {}) => {
  const { ref, isVisible } = useScrollFadeIn(options);

  const getItemDelay = useCallback(
    (index: number) => ({
      transitionDelay: isVisible ? `${index * 100}ms` : '0ms',
    }),
    [isVisible]
  );

  const getItemClasses = useCallback(
    (index: number) =>
      `transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`,
    [isVisible]
  );

  return { containerRef: ref, isVisible, getItemDelay, getItemClasses };
};

export default useScrollFadeIn;
