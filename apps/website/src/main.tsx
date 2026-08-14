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

/**
 * Vorgerenderten SEO-Textkörper entfernen, sobald die App übernimmt.
 *
 * `scripts/prerender-seo.mjs` schreibt in jede gebaute Seite einen
 * `#seo-prerender`-Block mit echtem Markup (H1, Absätze, Überschriften, Links).
 * Er existiert nur für Crawler, die kein JavaScript ausführen — KI-Assistenten,
 * Vorschau-Dienste. Ohne ihn liefern alle Seiten eine leere Hülle aus.
 *
 * Er MUSS hier verschwinden. Der Block liegt per `left:-9999px` außerhalb des
 * Bildschirms; bliebe er im DOM, sähe Google (das JavaScript ausführt) den
 * sichtbaren Text UND dieselbe Kopie versteckt daneben — genau das wertet
 * Google als verborgenen Text. Vor dem ersten Rendern entfernt, sieht jeder
 * Client nur eine Fassung: ohne JS die vorgerenderte, mit JS die echte.
 */
document.getElementById('seo-prerender')?.remove();

createRoot(rootElement).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);

// Initialize performance optimizations in background
initializePerformanceOptimizations();
