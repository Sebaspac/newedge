import { useEffect, useState } from "react";
import { withCmsParams } from "@/utils/cmsPreview";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Startseiten-Inhalte live aus dem CMS (Strapi Single-Type „Home") laden.
 * --------------------------------------------------------------
 * - Quelle: `VITE_STRAPI_URL`/api/home (Controller liefert deep-populated).
 * - Ein Fetch, modulweit gecacht → alle Home-Sektionen teilen sich den Request.
 * - Rück-Mapping der Strapi-Form in die Content-Form der Website:
 *     • Component-`id` (Strapi-intern) entfernen
 *     • `[{text}]`            → `string[]`   (shared.bullet)
 *     • `fieldId/fieldType/defaultLabel` → `id/type/default` (reservierte Namen)
 *     • `clients{heading,logos}` → `clientLogosHeading` + `clientLogos`
 * - Sektionen nutzen ihn als Overlay über ihrem statischen Fallback:
 *     `const c = useHomeContent().hero ?? heroStatic;`
 *   Ohne CMS/bei Fehler bleibt der statische Content-Layer aktiv.
 * --------------------------------------------------------------
 */
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL as string | undefined;

/** Strapi → Content-Form (rekursiv). Auch von useCms/usePainPoints genutzt. */
export function fromStrapi(v: unknown): any {
  if (Array.isArray(v)) {
    // reine Text-Listen (shared.bullet) zurück zu string[]
    const isTextList = v.length > 0 && v.every(
      (x) => x && typeof x === "object" && "text" in (x as any) &&
        Object.keys(x as any).filter((k) => k !== "id" && k !== "text").length === 0,
    );
    if (isTextList) return (v as any[]).map((x) => x.text);
    return (v as unknown[]).map(fromStrapi);
  }
  if (v && typeof v === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      // Strapi-interne IDs/Metadaten verwerfen (Components: nur `id`; populatete
      // Relationen bringen zusätzlich Document-Service-Felder mit).
      if (k === "id" || k === "documentId" || k === "createdAt" || k === "updatedAt" || k === "publishedAt" || k === "locale") continue;
      const key = k === "fieldId" ? "id" : k === "fieldType" ? "type" : k === "defaultLabel" ? "default" : k;
      out[key] = fromStrapi(val);
    }
    // Bild-Uploads: `<name>Media` (CMS-Upload) gewinnt über den eingebauten
    // Bild-Key/-Pfad in `<name>`; ohne Upload bleibt der eingebaute Wert.
    for (const key of Object.keys(out)) {
      if (!key.endsWith("Media")) continue;
      const base = key.slice(0, -"Media".length);
      const url = (out[key] as { url?: string } | null)?.url;
      if (url && base in out) {
        out[base] = url.startsWith("http") ? url : `${STRAPI_URL ?? ""}${url}`;
      }
      delete out[key]; // Form bleibt identisch zum statischen Content-Layer
    }
    return out;
  }
  return v;
}

export interface HomeContent {
  seo?: any; loadingLogo?: string; loadingAlt?: string; contact?: any; toast?: any;
  hero?: any; clientLogos?: any[]; clientLogosHeading?: any;
  impactCounter?: any; problemJourney?: any; tickerScroll?: any; cortex?: any;
  positionedForImpact?: any; horizontalScroll?: any; derSchnitt?: any;
  embeddedAI?: any; testimonialsSection?: any; threeStepsCTA?: any;
}

function mapHome(raw: any): HomeContent {
  const d = fromStrapi(raw) as any;
  const { clients, ...rest } = d;
  return {
    ...rest,
    clientLogosHeading: clients?.heading,
    clientLogos: clients?.logos,
  };
}

const caches: Record<string, HomeContent | null> = {};
const inflights: Record<string, Promise<HomeContent | null> | null> = {};
function load(api: string): Promise<HomeContent | null> {
  if (caches[api]) return Promise.resolve(caches[api]);
  if (!STRAPI_URL) return Promise.resolve(null);
  if (!inflights[api]) {
    inflights[api] = fetch(withCmsParams(`${STRAPI_URL}/api/${api}`))
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((json) => (json?.data ? (caches[api] = mapHome(json.data)) : null))
      .catch(() => null);
  }
  return inflights[api]!;
}

/** Home-Inhalte aus dem CMS (locale-fähig: `home` / `home-en`); leeres Objekt bis geladen. */
export function useHomeContent(): HomeContent {
  const { language } = useLanguage();
  const api = language === "en" ? "home-en" : "home";
  const [data, setData] = useState<HomeContent | null>(caches[api] ?? null);
  useEffect(() => {
    let alive = true;
    load(api).then((d) => {
      if (alive && d) setData(d);
    });
    return () => {
      alive = false;
    };
  }, [api]);
  return data ?? {};
}

/** Eine Home-Sektion mit sprachrichtigem statischem Fallback (Prod = statisch). */
export function useHomeSection<T>(key: keyof HomeContent, deStatic: T, enStatic: unknown): T {
  const { language } = useLanguage();
  const cms = useHomeContent();
  // EN/DE strukturgleich → EN als `unknown` annehmen, auf DE-Form casten.
  return (cms[key] as T | undefined) ?? ((language === "en" ? enStatic : deStatic) as T);
}
