import { useEffect, useState } from "react";
import { jobs as fallback, type Job } from "@/content";
import { withCmsParams } from "@/utils/cmsPreview";

/**
 * Jobs / offene Positionen live aus dem CMS (Strapi) laden.
 * --------------------------------------------------------------
 * - Quelle: `VITE_STRAPI_URL`. Nicht gesetzt → statischer Content-Layer.
 * - Tiefes `populate`, weil tags/sections/items verschachtelte Components sind.
 * - Strapi-Struktur → `Job`-Form der Website zurückgemappt:
 *     tag{label}                               → string
 *     job-section{label, items: bullet{text}}  → { label, items: string[] }
 * - Bei Netzwerk-/HTTP-Fehler ODER leerer Antwort: Fallback auf die statischen
 *   Jobs → die Seite zeigt nie „nichts".
 * --------------------------------------------------------------
 */
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL as string | undefined;
const QUERY =
  "populate[tags]=true&populate[sections][populate][items]=true&pagination[pageSize]=100";

export function useJobs(): Job[] {
  const [items, setItems] = useState<Job[]>(fallback);

  useEffect(() => {
    if (!STRAPI_URL) return;
    const controller = new AbortController();

    fetch(withCmsParams(`${STRAPI_URL}/api/jobs?${QUERY}`), { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((json) => {
        const rows: unknown[] = Array.isArray(json?.data) ? json.data : [];
        const mapped = rows
          .map((row) => {
            const r = row as Record<string, any>;
            const a = (r.attributes as Record<string, any>) ?? r; // Strapi 5 flach / v4 attributes
            return {
              id: String(r.documentId ?? r.id),
              title: a.title,
              mailto: a.mailto ?? "",
              tags: Array.isArray(a.tags)
                ? a.tags.map((t: any) => t?.label).filter(Boolean)
                : [],
              sections: Array.isArray(a.sections)
                ? a.sections
                    .map((s: any) => ({
                      label: s?.label,
                      items: Array.isArray(s?.items)
                        ? s.items.map((i: any) => i?.text).filter(Boolean)
                        : [],
                    }))
                    .filter((s: any) => s.label)
                : [],
            } as Job;
          })
          .filter((j) => j.title);
        if (mapped.length) setItems(mapped);
      })
      .catch(() => {
        /* statischer Fallback bleibt aktiv */
      });

    return () => controller.abort();
  }, []);

  return items;
}
