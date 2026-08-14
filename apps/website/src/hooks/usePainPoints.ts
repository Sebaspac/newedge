import { useEffect, useState } from "react";
import { fromStrapi } from "@/hooks/useHomeContent";
import { withCmsParams } from "@/utils/cmsPreview";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  painPoints as PP_STATIC,
  DEFAULT_PAIN_POINT as DEFAULT_STATIC,
  type PainPointContent,
} from "@/content/painPoints";
import {
  painPoints as PP_STATIC_EN,
  DEFAULT_PAIN_POINT as DEFAULT_STATIC_EN,
} from "@/content/en/painPoints";

/**
 * Anwendungsfelder (Pain Points/Branchen) live aus dem CMS laden — locale-fähig.
 * --------------------------------------------------------------
 * - Quelle: `/api/pain-points` (DE) bzw. `/api/pain-point-ens` (EN), je Collection
 *   deep-populated, published. Beide Sprachen sind getrennte, editierbare Collections.
 * - Baut die gleiche Map wie der statische Content-Layer:
 *   primärer `slug` + alle `aliases` zeigen auf denselben Eintrag.
 * - Ohne CMS/bei Fehler: sprachrichtige statische Map (verhaltenserhaltend).
 * --------------------------------------------------------------
 */
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL as string | undefined;

type PainPointMap = Record<string, PainPointContent>;

const caches: Record<string, PainPointMap | null> = {};
const inflights: Record<string, Promise<PainPointMap | null> | null> = {};

function load(api: string): Promise<PainPointMap | null> {
  if (caches[api]) return Promise.resolve(caches[api]);
  if (!STRAPI_URL) return Promise.resolve(null);
  if (!inflights[api]) {
    inflights[api] = fetch(withCmsParams(`${STRAPI_URL}/api/${api}`))
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((json) => {
        const rows: unknown[] = Array.isArray(json?.data) ? json.data : [];
        if (!rows.length) return null;
        const map: PainPointMap = {};
        for (const raw of rows) {
          const row = fromStrapi(raw) as PainPointContent & { aliases?: string[] };
          if (!row?.slug) continue;
          map[row.slug] = row;
          for (const alias of row.aliases ?? []) map[alias] = row;
        }
        return Object.keys(map).length ? (caches[api] = map) : null;
      })
      .catch(() => null);
  }
  return inflights[api]!;
}

/** Map slug→PainPoint (inkl. Alias-Slugs); Fallback: sprachrichtiger Content-Layer. */
export function usePainPoints(): { map: PainPointMap; defaultPainPoint: PainPointContent } {
  const { language } = useLanguage();
  const api = language === "en" ? "pain-point-ens" : "pain-points";
  const ppStatic: PainPointMap = language === "en" ? PP_STATIC_EN : PP_STATIC;
  const defStatic: PainPointContent = language === "en" ? DEFAULT_STATIC_EN : DEFAULT_STATIC;

  const [map, setMap] = useState<PainPointMap | null>(caches[api] ?? null);
  useEffect(() => {
    let alive = true;
    load(api).then((m) => {
      if (alive && m) setMap(m);
    });
    return () => {
      alive = false;
    };
  }, [api]);

  const effective = (caches[api] ?? map) ?? ppStatic;
  return {
    map: effective,
    defaultPainPoint: effective[defStatic.slug] ?? defStatic,
  };
}
