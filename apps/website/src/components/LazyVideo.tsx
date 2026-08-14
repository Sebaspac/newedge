import { useEffect, useRef, useState } from 'react';

interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  /** Aspect ratio for CLS prevention (e.g., "16/9", "4/3") */
  aspectRatio?: string;
  /** Width for intrinsic sizing */
  width?: number;
  /** Height for intrinsic sizing */
  height?: number;
}

export const LazyVideo = ({
  src,
  poster,
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  preload = 'none', // Changed from 'metadata' to 'none' for faster initial load
  aspectRatio = '16/9',
  width = 1920,
  height = 1080,
}: LazyVideoProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsLoaded(true);
          observer.disconnect();
        }
      },
      { 
        rootMargin: '600px', // Restored for better UX - ensures videos load before they're visible
        threshold: 0.1
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      poster={poster}
      preload={preload}
      width={width}
      height={height}
      style={{ aspectRatio }}
    >
      {isLoaded && <source src={src} type="video/mp4" />}
    </video>
  );
};
