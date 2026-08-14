/**
 * Page: NotFound (404)  — Single Type
 * --------------------------------------------------------------
 * Fallback-Seite für unbekannte Routen (`pages/NotFound.tsx`).
 * Der sichtbare Text (Titel, Untertitel, Zurück-Link) wird bewusst
 * über die i18n-Schicht (`LanguageContext`, Keys `notFound.*`) gerendert
 * und bleibt dort — damit der DE/EN-Wechsel erhalten bleibt. Hier liegen
 * nur die statischen SEO-Kopfdaten. Strapi-Mapping: Single Type `not-found`.
 * --------------------------------------------------------------
 */
import type { SEOContent } from "../types";

export const notFound = {
  seo: {
    title: "Seite nicht gefunden | NEWEDGE",
    description: "Die angeforderte Seite wurde nicht gefunden.",
  } satisfies SEOContent,
} as const;
