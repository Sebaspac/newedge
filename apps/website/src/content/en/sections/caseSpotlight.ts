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

  location: "Bavaria, Germany",
  /** Headline in drei Teilen — der Mittelteil wird akzentfarben gerendert. */
  headlinePrefix: "How the ",
  headlineClient: "Bavarian SME Award",
  headlineSuffix: " went from 400 Excel applications to automated jury evaluation",

  ctaLabel: "Read the case",

  /** Testimonial (Referenz-Layout wie dapta.ai): Zitat + Autor unten links,
      CTA unten rechts. Zitat verbatim aus dem Pain-Point-Testimonial;
      Autor case-konsistent (Badge + Headline nennen „Bayerischer
      Mittelstandspreis"). Kein Personenfoto (anonymisiert) → Monogramm. */
  quote:
    "What used to mean three months of coordination now runs automatically with NEWEDGE — and the quality of our decisions has measurably improved.",
  authorName: "Project lead",
  authorRole: "Bavarian SME Award",
  authorInitials: "BMP",

  image: {
    src: "bmp-award-case",
    alt: "NEWEDGE at the Bayerischer Mittelstandspreis",
  },
} as const;
