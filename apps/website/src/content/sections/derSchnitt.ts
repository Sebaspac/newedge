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
  eyebrow: "NEWEDGE, DER SCHNITT",

  /** Überschrift. `{brand}` ist farblich hervorgehoben (Inline-`<span>`). */
  heading: {
    lead: "Derselbe Tag. Mit ",
    brand: "NEWEDGE.",
  },

  /** Einleitungstext unter der Überschrift. */
  intro:
    "Links das Unternehmen ohne NEWEDGE. Rechts dasselbe Unternehmen mit System.",

  /** Linke Spalte (vorher / ohne NEWEDGE). */
  before: {
    label: "Unternehmen ohne NEWEDGE",
    rows: [
      "Informationen liegen verstreut",
      "Aufgaben laufen manuell",
      "KI nur vereinzelt im Einsatz",
      "Prozesse hängen an Personen",
      "Entscheidungen fallen reaktiv",
    ],
  } satisfies SchnittColumn,

  /** Rechte Spalte (nachher / mit NEWEDGE). */
  after: {
    label: "Unternehmen mit NEWEDGE",
    rows: [
      "Cortex als zentrale Ebene",
      "Automatisierte Prozesse",
      "Klare Verantwortlichkeiten",
      "Transparente Daten",
      "KI als tägliches Werkzeug",
      "Technik, die mitwächst",
    ],
  } satisfies SchnittColumn,

  /** Bildunterschrift im Zeichnungs-Stil. */
  caption: "Fig. 02 — Ein Unternehmen, zwei Betriebsarten",

  /** ARIA-/A11y-Beschriftungen. */
  a11y: {
    sectionLabel: "Vorher-Nachher-Vergleich",
    sliderLabel: "Vergleich verschieben",
  },
};
