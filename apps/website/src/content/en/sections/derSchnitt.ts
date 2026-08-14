/**
 * Section-Text: Der Schnitt (Vorher-Nachher-Vergleich)
 * --------------------------------------------------------------
 * Vergleichs-Modul auf der Startseite: links das Unternehmen ohne
 * NEWEDGE (kurze graue Balken), rechts dasselbe Unternehmen mit System
 * (voll ladende Verlaufs-Balken) — Komponente `DerSchnitt`.
 *
 * Reiner Text-Content (keine Bilder, keine content-gebundenen Icons —
 * die × ✓ ↔ Glyphen sind dekorative Inline-Zeichen der Komponente).
 * Serialisierbar (CMS-tauglich): nur Strings/Arrays.
 * Strapi-Mapping: Single Type `der-schnitt`.
 * --------------------------------------------------------------
 */

/** Eine Spalte des Vergleichs: Label + Zeilen. */
export interface SchnittColumn {
  /** Kicker-Label über der Liste. */
  label: string;
  /** Listeneinträge (eine Betriebsart). */
  rows: string[];
}

export const derSchnitt = {
  /** Eyebrow / Kicker über der Überschrift. */
  eyebrow: "NEWEDGE, THE EDGE",

  /** Überschrift. `{brand}` ist farblich hervorgehoben (Inline-`<span>`). */
  heading: {
    lead: "The same day. With ",
    brand: "NEWEDGE.",
  },

  /** Einleitungstext unter der Überschrift. */
  intro:
    "On the left, the company without NEWEDGE. On the right, the same company with a system.",

  /** Linke Spalte (vorher / ohne NEWEDGE). */
  before: {
    label: "Company without NEWEDGE",
    rows: [
      "Information sits scattered",
      "Tasks are handled manually",
      "AI is used in isolated pockets",
      "Processes depend on individuals",
      "Decisions are made reactively",
    ],
  } satisfies SchnittColumn,

  /** Rechte Spalte (nachher / mit NEWEDGE). */
  after: {
    label: "Company with NEWEDGE",
    rows: [
      "Cortex as the central layer",
      "Automated processes",
      "Clear ownership",
      "Transparent data",
      "AI as a daily tool",
      "Technology that grows with you",
    ],
  } satisfies SchnittColumn,

  /** Bildunterschrift im Zeichnungs-Stil. */
  caption: "Fig. 02 — One company, two ways of operating",

  /** ARIA-/A11y-Beschriftungen. */
  a11y: {
    sectionLabel: "Before-and-after comparison",
    sliderLabel: "Move the comparison",
  },
};
