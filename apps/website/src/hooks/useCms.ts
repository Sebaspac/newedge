import { useEffect, useState } from "react";
import { fromStrapi } from "@/hooks/useHomeContent";
import { withCmsParams } from "@/utils/cmsPreview";

/**
 * Generischer Single-Type-Hook: Inhalt live aus dem CMS (Strapi) laden.
 * --------------------------------------------------------------
 * - `useCms("about", aboutStatic)` → CMS-Inhalt von `/api/about` oder Fallback.
 * - Deep-populated durch die generierten Controller (ein Request pro Type).
 * - Modulweiter Cache pro api-Id → mehrere Komponenten teilen sich den Fetch
 *   (z. B. nav/footer auf jeder Seite).
 * - Mapping wie useHomeContent (fromStrapi): Component-`id` weg, {text}[]→string[],
 *   fieldId/fieldType/defaultLabel → id/type/default.
 * - Ohne VITE_STRAPI_URL oder bei Fehler: statischer Content-Layer.
 * --------------------------------------------------------------
 */
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL as string | undefined;

const cache = new Map<string, unknown>();
const inflight = new Map<string, Promise<unknown | null>>();

function load(api: string): Promise<unknown | null> {
  if (cache.has(api)) return Promise.resolve(cache.get(api));
  if (!STRAPI_URL) return Promise.resolve(null);
  if (!inflight.has(api)) {
    inflight.set(
      api,
      fetch(withCmsParams(`${STRAPI_URL}/api/${api}`))
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
        .then((json) => {
          if (!json?.data) return null;
          const mapped = fromStrapi(json.data);
          cache.set(api, mapped);
          return mapped;
        })
        .catch(() => null),
    );
  }
  return inflight.get(api)!;
}

/** CMS-Inhalt für einen Single-Type; bis (oder falls) nichts geladen ist: Fallback. */
export function useCms<T>(api: string, fallback: T): T {
  const [data, setData] = useState<T | null>((cache.get(api) as T) ?? null);
  useEffect(() => {
    let alive = true;
    load(api).then((d) => {
      if (alive && d) setData(d as T);
    });
    return () => {
      alive = false;
    };
  }, [api]);
  return data ?? fallback;
}
