import { Component, type ErrorInfo, type ReactNode } from 'react';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[AppErrorBoundary] Root render failed', error, errorInfo);
  }

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Seite neu laden
          </p>
          <h1 className="text-2xl font-semibold leading-tight sm:text-3xl">
            Die Seite konnte gerade nicht sauber gerendert werden.
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Bitte laden Sie die Seite neu, damit die Anwendung wieder korrekt startet.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Jetzt neu laden
          </button>
        </div>
      </div>
    );
  }
}