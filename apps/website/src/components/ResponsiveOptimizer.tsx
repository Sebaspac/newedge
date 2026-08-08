import { useEffect, useState } from 'react';
import { throttle } from '@/utils/performanceOptimizations';

interface ResponsiveOptimizerProps {
  children: React.ReactNode;
}

export const ResponsiveOptimizer: React.FC<ResponsiveOptimizerProps> = ({ children }) => {
  const [viewportSize, setViewportSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    const updateViewportSize = throttle(() => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      
      // Update CSS custom properties for responsive design
      const root = document.documentElement;
      root.style.setProperty('--viewport-width', `${window.innerWidth}px`);
      root.style.setProperty('--viewport-height', `${window.innerHeight}px`);
      
      // Optimize based on screen size
      if (window.innerWidth < 768) {
        root.style.setProperty('--container-padding', '1rem');
        root.style.setProperty('--text-scale', '0.9');
        root.style.setProperty('--animation-scale', '0.8');
      } else if (window.innerWidth < 1024) {
        root.style.setProperty('--container-padding', '1.5rem');
        root.style.setProperty('--text-scale', '1');
        root.style.setProperty('--animation-scale', '0.9');
      } else {
        root.style.setProperty('--container-padding', '2rem');
        root.style.setProperty('--text-scale', '1');
        root.style.setProperty('--animation-scale', '1');
      }
    }, 100);

    // Initial call
    updateViewportSize();

    // Add event listener
    window.addEventListener('resize', updateViewportSize);
    
    // Optimize for orientation changes on mobile
    window.addEventListener('orientationchange', () => {
      setTimeout(updateViewportSize, 100);
    });

    return () => {
      window.removeEventListener('resize', updateViewportSize);
      window.removeEventListener('orientationchange', updateViewportSize);
    };
  }, []);

  useEffect(() => {
    // Set viewport meta tag programmatically for better control
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.setAttribute('name', 'viewport');
      document.head.appendChild(viewportMeta);
    }
    
    // Optimize viewport settings for different screen sizes
    const viewportContent = viewportSize.width < 768 
      ? 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes'
      : 'width=device-width, initial-scale=1.0';
      
    viewportMeta.setAttribute('content', viewportContent);
  }, [viewportSize]);

  return <>{children}</>;
};