/**
 * Section-Text: Statement + Kennzahlen (Startseite, 2. Section, Rebrush 2026-07)
 * --------------------------------------------------------------
 * Noramble-Referenz-Layout: zentriertes Statement, Absatz, zwei
 * Pill-CTAs, darunter drei riesige, versetzt gestaffelte Kennzahlen
 * (Komponente `StatementStatsSection`). Die Kennzahlen selbst kommen
 * weiter aus `sections/impactCounter.ts` (CMS-geschattet) — hier liegt
 * nur das Section-Chrome. Statement + Absatz sind verbatim aus der
 * früheren Hero-Subline übernommen (die im Shape-Hero entfallen ist).
 * Noch NICHT als Strapi-Feld angelegt (statischer Fallback greift).
 * --------------------------------------------------------------
 */

export const statementStats = {
  /** Riesige Headline, die das Team-Bild überlappt (Referenz: „We're Noramble"). */
  title: "We are NEWEDGE",
  /** Team-/Gründerfoto unter der Headline (Registry-Key + Alt-Text). */
  image: {
    src: "founders-color",
    alt: "Sebastian & Wenjamin — the founders of NEWEDGE",
  },

  statement: "Not another tool — a department that takes over work.",
  paragraph:
    "Behind NEWEDGE stand Sebastian & Wenjamin — and a team that doesn't hand over projects, but builds your own AI capability. Step by step, until AI is no longer a siloed tool for you, but a department.",
  /** Primärer CTA → öffnet Kontakt-Dialog. */
  ctaPrimary: { label: "Free analysis" },
  /** Sekundärer CTA → /about. */
  // ctaSecondary: { label: "About NEWEDGE", to: "/about" },  ← Über uns vorerst ausgeblendet
} as const;
