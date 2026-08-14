/**
 * Page: Mini-Case-Detail  — Single Type
 * --------------------------------------------------------------
 * Eigene Inline-Texte der Mini-Case-Detailseite (`pages/MiniCaseDetail.tsx`):
 * SEO-Titel-Suffix, Beispiel-Badge, Back-Link, Sektions-Labels,
 * „Nicht verfügbar"-Fallback.
 *
 * WICHTIG: Die eigentlichen Case-Daten (Titel, Teaser, Szenario, Metriken,
 * Vorgehen, Ergebnis, Zitat, Phasen-Label) stammen aus `@/content/painPoints`
 * (`MiniCase`) und werden NICHT hier dupliziert — diese Seite rendert sie nur.
 * Dieses Modul enthält ausschließlich die seiteneigenen Literale.
 *
 * Bilder: keine (Hero ist AuroraFlow). Icons: keine content-gebundenen —
 * die Glyphen ArrowLeft/ArrowRight sind dekorative lucide-Imports.
 * Strapi-Mapping: Single Type `mini-case-detail`.
 * --------------------------------------------------------------
 */

export const miniCaseDetail = {
  /** SEO — Titel wird mit `miniCase.title` zusammengesetzt; Description = `miniCase.teaser`. */
  seo: {
    /** Suffix hinter dem Case-Titel: `${title}${titleSuffix}`. */
    titleSuffix: " — Mini Case | NEWEDGE",
  },

  /** Sichtbarer „Beispiel"-Hinweis im Hero (Pflicht: Cases sind illustrativ). */
  exampleBadge: "Illustrative example case",

  /** Zurück-Link (Hero). Suffix je nach Kontext (Phasen vs. Übersicht). */
  backLink: {
    /** Vorlauf inkl. abschließendem Leerzeichen (verhaltenserhaltend). */
    prefix: "Back to ",
    /** Wenn `content.hero.overlabel` gesetzt ist. */
    toPhases: "the cases",
    /** Sonst. */
    toOverview: "the overview",
  },

  /** Sektions-Labels (Eyebrow-Style). */
  labels: {
    situation: "Starting point",
    approach: "What we actually do",
    /** Rendert als `Ergebnis & ROI` (JSX-Entity `&amp;`). */
    result: "Result & ROI",
  },

  /** Fallback, wenn der angefragte Case nicht existiert. */
  notFound: {
    message: "This case is not available.",
    backLabel: "Back to the overview",
  },
} as const;
