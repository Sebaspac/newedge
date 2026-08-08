/**
 * Section-Text: Case-Spotlight (Startseite, Rebrush 2026-07)
 * --------------------------------------------------------------
 * Großes Kunden-Case-Feature im Referenz-Layout (Komponente
 * `CaseSpotlightSection`): Standort, Headline mit akzentfarbenem
 * Kundennamen, Ergebnis-Absatz, Metrik-Chips, CTA zur Case-Seite.
 * Die Case-Daten (Metriken, Badge) kommen verbatim aus
 * `collections/miniCases.ts` (realer Case „bmp-award") — hier liegt
 * nur das Section-Chrome + die Headline-Formulierung.
 * Noch NICHT als Strapi-Feld angelegt (statischer Fallback greift).
 * --------------------------------------------------------------
 */

export const caseSpotlight = {
  /** Slug + Case-ID zum Nachschlagen in `miniCasesBySlug` + für den Link. */
  painPointSlug: "entscheidungsinstanzen",
  caseId: "bmp-award",
  /** Detailseiten-Link (Route: /industrien/:slug/case/:caseId). */
  href: "/industrien/entscheidungsinstanzen/case/bmp-award",

  location: "Bayern, Deutschland",
  /** Headline in drei Teilen — der Mittelteil wird akzentfarben gerendert. */
  headlinePrefix: "Wie der ",
  headlineClient: "Bayerische Mittelstandspreis",
  headlineSuffix: " von 400 Excel-Bewerbungen zur automatischen Jury-Auswertung kam",

  ctaLabel: "Case lesen",

  /** Testimonial (Referenz-Layout wie dapta.ai): Zitat + Autor unten links,
      CTA unten rechts. Zitat verbatim aus dem Pain-Point-Testimonial;
      Autor case-konsistent (Badge + Headline nennen „Bayerischer
      Mittelstandspreis"). Kein Personenfoto (anonymisiert) → Monogramm. */
  quote:
    "Was früher drei Monate Koordination bedeutete, läuft mit NEWEDGE jetzt automatisch — und die Qualität unserer Entscheidungen ist nachweislich besser geworden.",
  authorName: "Projektleitung",
  authorRole: "Bayerischer Mittelstandspreis",
  authorInitials: "BMP",

  image: {
    src: "bmp-award-case",
    alt: "NEWEDGE beim Bayerischen Mittelstandspreis",
  },
} as const;
