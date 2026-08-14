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
  title: "Wir sind NEWEDGE",
  /** Team-/Gründerfoto unter der Headline (Registry-Key + Alt-Text). */
  image: {
    src: "founders-color",
    alt: "Sebastian & Wenjamin — die Gründer von NEWEDGE",
  },

  statement: "Kein weiteres Tool — eine Abteilung, die Arbeit übernimmt.",
  paragraph:
    "Hinter NEWEDGE stehen Sebastian & Wenjamin — und ein Team, das nicht Projekte abliefert, sondern Ihre eigene KI-Fähigkeit aufbaut. Schritt für Schritt, bis KI bei Ihnen keine Insellösung mehr ist, sondern eine Abteilung.",
  /** Primärer CTA → öffnet Kontakt-Dialog. */
  ctaPrimary: { label: "Kostenlose Analyse" },
  /** Sekundärer CTA → /about. */
  // ctaSecondary: { label: "Über NEWEDGE", to: "/about" },  ← Über uns vorerst ausgeblendet
} as const;
