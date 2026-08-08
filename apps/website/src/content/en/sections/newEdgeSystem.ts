/**
 * Section-Text: Das NEWEDGE System (Methodik)
 * --------------------------------------------------------------
 * Animiertes System-Diagramm „Dieselben Bausteine. Jede
 * Transformation." — eine Reihe aus drei Phasen-Karten mit
 * Chevron-Konnektoren (Komponente `NewEdgeSystemAnimated`).
 *
 * NUR Text-Labels liegen hier (Eyebrow, Headline, Subline, je Karte
 * Index/Titel/Sub, Footer-Zeilen). Sämtliche Geometrie, Farben,
 * SVG-Pfade, Animations-Timings und das Ikonografie-Artwork der
 * Karten bleiben in der Komponente — das ist Layout, kein Inhalt.
 * Es gibt keine Bilder und keine content-gebundenen Icons.
 *
 * Alle Felder sind serialisierbar (CMS-tauglich): nur
 * Strings/Arrays — kein JSX, keine Funktionen.
 * Strapi-Mapping: Single Type `newedge-system` (bzw. Teil von „methodik").
 * --------------------------------------------------------------
 */

/** Eine Ebenen-Karte: Text-Labels (Index/Titel/Sub = Inhalt; Akzent + Icon-Artwork = Layout). */
export interface NewEdgeSystemCard {
  /** Laufende Nummer als Label, z. B. „01". */
  index: string;
  /** Karten-Titel, z. B. „Cortex". */
  title: string;
  /** Karten-Unterzeile, z. B. „bildet die Infrastruktur.". */
  sub: string;
}

export interface NewEdgeSystemContent {
  /** Eyebrow oben (neben der Linie). */
  eyebrow: string;
  /** Headline-Zeilen (durch `<br />` getrennt gerendert). */
  headingLines: string[];
  /** Subline unter der Headline. */
  subline: string;
  /** Ebenen-Karten (Reihenfolge = Render-/Layout-Reihenfolge). */
  cards: NewEdgeSystemCard[];
  /** Footer-Zeilen unter dem Divider. */
  footer: {
    /** Linke Zeile. */
    left: string;
    /** Rechte Zeile. */
    right: string;
  };
}

export const newEdgeSystem: NewEdgeSystemContent = {
  eyebrow: "The NEWEDGE System",
  headingLines: ["Three phases.", "One AI department."],
  subline:
    "Every AI transformation follows the same path: analysis, implementation, scaling — until AI becomes a lasting capability of your company.",
  cards: [
    { index: "01", title: "Analysis", sub: "finds the levers." },
    { index: "02", title: "Implementation", sub: "builds the system." },
    { index: "03", title: "Scaling", sub: "takes ownership." },
  ],
  footer: {
    left: "Left-to-right transformation flow",
    right: "The NEWEDGE System · NEWEDGE",
  },
};
