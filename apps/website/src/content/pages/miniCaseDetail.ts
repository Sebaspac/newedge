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
    titleSuffix: " — Mini-Case | NEWEDGE",
  },

  /** Sichtbarer „Beispiel"-Hinweis im Hero (Pflicht: Cases sind illustrativ). */
  exampleBadge: "Illustrativer Beispiel-Case",

  /** Zurück-Link (Hero). Suffix je nach Kontext (Phasen vs. Übersicht). */
  backLink: {
    /** Vorlauf inkl. abschließendem Leerzeichen (verhaltenserhaltend). */
    prefix: "Zurück zu ",
    /** Wenn `content.hero.overlabel` gesetzt ist. */
    toPhases: "den Cases",
    /** Sonst. */
    toOverview: "der Übersicht",
  },

  /** Sektions-Labels (Eyebrow-Style). */
  labels: {
    situation: "Ausgangslage",
    approach: "Was wir konkret machen",
    /** Rendert als `Ergebnis & ROI` (JSX-Entity `&amp;`). */
    result: "Ergebnis & ROI",
  },

  /** Fallback, wenn der angefragte Case nicht existiert. */
  notFound: {
    message: "Dieser Case ist nicht verfügbar.",
    backLabel: "Zurück zur Übersicht",
  },
} as const;
