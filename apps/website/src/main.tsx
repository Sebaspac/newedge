import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { initializePerformanceOptimizations } from './utils/performanceOptimizations';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root was not found.');
}

// Suppress known HMR error with Spline/Three.js runtime during hot reload
const isIgnorableHotReloadError = (message?: string) => {
  if (!message) return false;

  return [
    'The object can not be found here',
    "Failed to execute 'removeChild' on 'Node'",
    'The node to be removed is not a child of this node',
  ].some((knownMessage) => message.includes(knownMessage));
};

window.addEventListener('error', (e) => {
  if (isIgnorableHotReloadError(e.message)) {
    e.preventDefault();
    console.warn('[HMR] Suppressed known Spline/Three.js removeChild error during hot reload');
  }
});
window.addEventListener('unhandledrejection', (e) => {
  if (isIgnorableHotReloadError(e.reason?.message)) {
    e.preventDefault();
    console.warn('[HMR] Suppressed known Spline/Three.js removeChild error during hot reload');
  }
});

createRoot(rootElement).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);

// Initialize performance optimizations in background
initializePerformanceOptimizations();
