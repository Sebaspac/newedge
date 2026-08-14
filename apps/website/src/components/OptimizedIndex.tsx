import { Suspense, lazy, useState } from 'react';
import { LoadingScreen } from './LoadingScreen';

// Lazy load the Index page
const Index = lazy(() => import('@/pages/Index'));

/**
 * Optimized Index Page Wrapper
 * Implements lazy loading and shows loading screen during initialization
 */
export const OptimizedIndex = () => {
  const [loadingProgress] = useState(100);

  return (
    <Suspense fallback={<LoadingScreen progress={loadingProgress} />}>
      <Index />
    </Suspense>
  );
};
