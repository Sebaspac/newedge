/**
 * Section-Text: Embedded AI ("Ein externer Head of AI")
 * --------------------------------------------------------------
 * Statement-Block + „Wir übernehmen"-Liste (Komponente `EmbeddedAI`);
 * links davon ein Bild-Duo (Registry-Keys). Inline-Markup (das
 * hervorgehobene „Head of AI.") bleibt in der Komponente; hier liegen
 * nur die Text-Leaves + Bild-Referenzen.
 * Strapi-Mapping: Single Type `embedded-ai` (bzw. Teil von „home").
 * --------------------------------------------------------------
 */

import type { ImageKey } from "../assets";

export interface EmbeddedAIContent {
  /** Aria-Label der Section. */
  ariaLabel: string;
  /** Eyebrow oben links. */
  eyebrow: string;
  heading: {
    /** Text vor dem hervorgehobenen Teil. */
    lead: string;
    /** Hervorgehobener (eingefärbter) Teil. */
    highlight: string;
  };
  /** Statement-Absätze (Reihenfolge = Render-Reihenfolge). */
  paragraphs: string[];
  /** Label über der Übernahme-Liste. */
  uebernahmeLabel: string;
  /** Listeneinträge „Wir übernehmen". */
  uebernahme: string[];
  /** Bild-Duo links neben dem Text (Registry-Keys + Alt-Texte). */
  images: { src: ImageKey; alt: string }[];
}

export const embeddedAI: EmbeddedAIContent = {
  ariaLabel: "Embedded AI, ein externer Head of AI",
  eyebrow: "Embedded AI — KI, fest verankert",
  heading: {
    lead: "Ein externer ",
    highlight: "Head of AI.",
  },
  paragraphs: [
    "Die meisten Unternehmen brauchen keinen KI-Chef in Vollzeit. Sie brauchen jemanden, der Verantwortung übernimmt.",
    "Wir liefern nicht nur Projekte. Wir sorgen dafür, dass Ihre KI-Abteilung langfristig wächst.",
  ],
  uebernahmeLabel: "Wir übernehmen",
  uebernahme: [
    "Prioritäten setzen",
    "Klare Regeln & Sicherheit",
    "Fahrplan für die nächsten Schritte",
    "Ihr Team KI-fit machen",
    "Neue Potenziale erkennen",
    "Laufende Verbesserung",
  ],
  images: [
    { src: "team-sebastian-2", alt: "Sebastian — Co-Founder von NEWEDGE" },
    { src: "team-wenjamin-2", alt: "Wenjamin — Co-Founder von NEWEDGE" },
  ],
};
