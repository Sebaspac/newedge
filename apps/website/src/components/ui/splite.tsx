import { Suspense, lazy, Component, ReactNode, useState, useEffect } from 'react'

// Error Boundary for Spline failures
class SplineErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('Spline scene failed to load:', error.message);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface SplineSceneProps {
  scene: string
  className?: string
}

// Inner component that handles the actual Spline loading
function SplineInner({ scene, className }: SplineSceneProps) {
  const [SplineComponent, setSplineComponent] = useState<React.ComponentType<any> | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    import('@splinetool/react-spline')
      .then((module) => {
        if (mounted) {
          setSplineComponent(() => module.default);
        }
      })
      .catch((error) => {
        console.warn('Failed to load Spline:', error);
        if (mounted) {
          setLoadError(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-primary/20 mx-auto flex items-center justify-center">
            <span className="text-2xl">🎨</span>
          </div>
          <p className="text-sm text-neutral-400">3D Scene</p>
        </div>
      </div>
    );
  }

  if (!SplineComponent) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }

  return <SplineComponent scene={scene} className={className} />;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const fallbackUI = (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-primary/20 mx-auto flex items-center justify-center">
          <span className="text-2xl">🎨</span>
        </div>
        <p className="text-sm text-neutral-400">3D Scene</p>
      </div>
    </div>
  );

  return (
    <SplineErrorBoundary fallback={fallbackUI}>
      <SplineInner scene={scene} className={className} />
    </SplineErrorBoundary>
  );
}
