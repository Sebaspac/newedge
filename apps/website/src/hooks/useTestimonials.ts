import { useEffect, useState } from "react";
import { testimonials as fallback, type Testimonial } from "@/content";
import { withCmsParams } from "@/utils/cmsPreview";

/**
 * Testimonials live aus dem CMS (Strapi) laden.
 * --------------------------------------------------------------
 * - Quelle: `VITE_STRAPI_URL` (z. B. http://localhost:1337). Ist sie nicht
 *   gesetzt, bleibt es beim statischen Content-Layer (Build funktioniert ohne CMS).
 * - Bei Netzwerk-/HTTP-Fehler ODER leerer Antwort: Fallback auf die statischen
 *   Testimonials → die Seite zeigt nie „nichts".
 * - Mapping toleriert Strapi 5 (flach) und v4 (`attributes`).
 * --------------------------------------------------------------
 */
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL as string | undefined;

export function useTestimonials(): Testimonial[] {
  const [items, setItems] = useState<Testimonial[]>(fallback);

  useEffect(() => {
    if (!STRAPI_URL) return;
    const controller = new AbortController();

    fetch(withCmsParams(`${STRAPI_URL}/api/testimonials?pagination[pageSize]=100`), {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((json) => {
        const rows: unknown[] = Array.isArray(json?.data) ? json.data : [];
        const mapped = rows
          .map((row) => {
            const r = row as Record<string, unknown>;
            const a = (r.attributes as Record<string, unknown>) ?? r; // Strapi 5 flach / v4 attributes
            return { text: a.text, name: a.name, role: a.role } as Testimonial;
          })
          .filter((t) => t.text && t.name && t.role);
        if (mapped.length) setItems(mapped);
      })
      .catch(() => {
        /* still: statischer Fallback bleibt aktiv */
      });

    return () => controller.abort();
  }, []);

  return items;
}
