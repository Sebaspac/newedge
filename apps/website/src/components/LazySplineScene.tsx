import { useState, useEffect, useRef } from 'react';
import { SplineScene } from './ui/splite';
import { shouldDisableHeavyPreviewEffects } from '@/utils/runtimeEnvironment';

interface LazySplineSceneProps {
  scene: string;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}

/**
 * Lazy-loaded Spline Scene Component
 * - Delays loading by 1.5s or until first scroll/touch for better FCP
 * - On mobile (<768px), shows a static gradient instead of heavy 3D scene
 * - Shows a lightweight placeholder during loading
 */
export const LazySplineScene = ({
  scene,
  className = '',
  threshold = 0.25,
  rootMargin = '50px'
}: LazySplineSceneProps) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const disableHeavyEffects = shouldDisableHeavyPreviewEffects();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (disableHeavyEffects) return;

    // Check if mobile for potential styling differences
    const checkMobile = () => window.innerWidth < 768;
    setIsMobile(checkMobile());

    let timeoutId: ReturnType<typeof setTimeout>;
    let hasTriggered = false;

    const triggerLoad = () => {
      if (hasTriggered) return;
      hasTriggered = true;
      setShouldLoad(true);
      cleanup();
    };

    // Delay load by 1.5s to prioritize critical content (slightly longer on mobile)
    const loadDelay = checkMobile() ? 2000 : 1500;
    timeoutId = setTimeout(triggerLoad, loadDelay);

    // Or load immediately on first user interaction
    const handleInteraction = () => triggerLoad();
    window.addEventListener('scroll', handleInteraction, { once: true, passive: true });
    window.addEventListener('touchstart', handleInteraction, { once: true, passive: true });

    const cleanup = () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };

    return cleanup;
  }, [disableHeavyEffects]);

  // Transparent placeholder for mobile - allows grid to show through
  const GradientPlaceholder = () => (
    <div 
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  );

  // Transparent placeholder during loading - allows grid background to show through
  const LoadingPlaceholder = () => (
    <div 
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  );

  return (
    <div 
      ref={containerRef} 
      className={`relative ${className}`}
      style={{ minHeight: '400px', aspectRatio: '1/1' }}
    >
      {disableHeavyEffects ? (
        <GradientPlaceholder />
      ) : shouldLoad ? (
        <SplineScene scene={scene} className="w-full h-full" />
      ) : (
        <LoadingPlaceholder />
      )}
    </div>
  );
};
