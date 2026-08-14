import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Bei jedem Routen-Wechsel (Menü, Link, Footer) oben landen.
 * Hash-Anker (#cta, #cases …) werden respektiert: dann wird zum Element gescrollt.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Browser-eigene Scroll-Restoration abschalten (Back/Forward sauber halten)
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (hash) {
      // In-Page-Anker: auf das (ggf. lazy gerenderte) Ziel warten, dann ihm kurz folgen,
      // während sich das Layout durch nachladende Bilder noch verschiebt.
      const id = hash.slice(1);
      const start = performance.now();
      let foundAt = 0;
      let raf = 0;
      let aborted = false;
      const stopOnUserScroll = () => { aborted = true; };
      window.addEventListener("wheel", stopOnUserScroll, { passive: true });
      window.addEventListener("touchstart", stopOnUserScroll, { passive: true });
      window.addEventListener("keydown", stopOnUserScroll);

      const tick = (now: number) => {
        if (aborted) return;
        const el = document.getElementById(id);
        if (el) {
          if (!foundAt) foundAt = now;
          el.scrollIntoView({ behavior: "auto", block: "start" });
          if (now - foundAt > 700) return; // Layout stabil → fertig
        } else if (now - start > 2500) {
          return; // Ziel nie aufgetaucht → aufgeben
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      return () => {
        aborted = true;
        cancelAnimationFrame(raf);
        window.removeEventListener("wheel", stopOnUserScroll);
        window.removeEventListener("touchstart", stopOnUserScroll);
        window.removeEventListener("keydown", stopOnUserScroll);
      };
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
