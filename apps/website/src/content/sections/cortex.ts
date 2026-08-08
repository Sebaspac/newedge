/**
 * Section-Text: Lokale KI-Infrastruktur (Home)
 * --------------------------------------------------------------
 * „Ihre KI. Ihre Server. Ihre Daten." — Hub-Diagramm mit
 * Feature-Liste (Komponente `CortexSection`).
 *
 * Inhaltlicher Fokus (Planänderung 2026-07-28): Das Modul erklärt
 * nicht mehr nur Cortex als Produkt, sondern die LOKALE INFRASTRUKTUR
 * als Ganzes — alles, was es braucht, damit KI-Modelle im eigenen Haus
 * laufen. Was darauf aufsetzt, zeigt das Folge-Modul (`builtOnTop`).
 * Produkt-Treppe: Phase 2 (Cortex / sicherer Einstiegspunkt).
 *
 * Reiner Text — Layout-Koordinaten, Farben und SVG-Geometrie
 * bleiben in der Komponente. Alle Felder sind serialisierbar
 * (CMS-tauglich): nur Strings/Arrays — kein JSX, keine Funktionen.
 * Strapi-Mapping: Single Type `cortex` (bzw. Teil der Home-Page).
 * --------------------------------------------------------------
 */

/** Beschrifteter Knoten im Hub-Diagramm (Label = Inhalt, Position = Layout). */
export interface CortexSpoke {
  label: string;
}

export const cortex = {
  /** Section-`aria-label`. */
  ariaLabel: "Lokale KI-Infrastruktur — Ihre KI läuft im eigenen Haus",

  eyebrow: "Lokale Infrastruktur",
  heading: "Ihre KI. Ihre Server. Ihre Daten.",
  subtitle:
    "Wir bauen die komplette Infrastruktur, auf der leistungsfähige KI-Modelle bei Ihnen im Haus laufen — DSGVO-konform, ohne dass ein Datensatz das Unternehmen verlässt.",

  /** Linke Mini-Spalte: Status quo. */
  today: {
    label: "Heute existieren oft",
    items: [
      "Firmendaten in ChatGPT & Copilot",
      "Einzeltools ohne Kontrolle",
      "Wildwuchs an Tools (Schatten-IT)",
      "Ungeklärte DSGVO-Fragen",
    ],
  },

  /** Rechte Mini-Spalte: Zielzustand (= Titel der Feature-Liste). */
  results: {
    label: "Das Ergebnis",
    items: [
      "Ihre Daten verlassen das Haus nicht",
      "Rechtssicher statt Grauzone",
      "Ein Zugang für alle Mitarbeiter",
      "Das Fundament für alles Weitere",
    ],
  },

  /** Erklärungs-Absatz unter dem Divider. */
  body:
    "Von der Hardware über die Modelle bis zur Rechteverwaltung: Wir stellen alles bereit, damit Ihr Unternehmen KI produktiv nutzt — und die Kontrolle über Daten, Zugriffe und Kosten behält.",

  /** Text-Button (scrollt zur CTA-Section). */
  cta: "Infrastruktur kennenlernen →",

  /** Hub-Diagramm. */
  diagram: {
    /** SVG-`aria-label`. */
    ariaLabel:
      "Die lokale Infrastruktur verbindet Menschen, Daten, Prozesse, KI-Assistenten und Kontrolle",
    /** Beschriftungen der äußeren Knoten (Reihenfolge = Layout-Reihenfolge). */
    spokes: [
      { label: "MENSCHEN" },
      { label: "DATEN" },
      { label: "PROZESSE" },
      { label: "KI-ASSISTENTEN" },
      { label: "KONTROLLE" },
    ] as CortexSpoke[],
    /** Zentraler Knoten — zweizeilig, liest sich als ein Begriff. */
    centerLabel: "ZENTRALE",
    centerSublabel: "INFRASTRUKTUR",
  },
};
