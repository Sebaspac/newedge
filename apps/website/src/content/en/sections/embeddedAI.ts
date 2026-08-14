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

import type { ImageKey } from "../../assets";

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
  ariaLabel: "Embedded AI, an external Head of AI",
  eyebrow: "Embedded AI — AI, firmly in place",
  heading: {
    lead: "An external ",
    highlight: "Head of AI.",
  },
  paragraphs: [
    "Most companies don't need a full-time AI lead. They need someone who takes ownership.",
    "We don't just deliver projects. We make sure your AI department keeps growing over the long term.",
  ],
  uebernahmeLabel: "We take care of",
  uebernahme: [
    "Setting priorities",
    "Clear rules & safeguards",
    "A clear plan for your next steps",
    "Getting your team AI-ready",
    "Spotting new opportunities",
    "Ongoing improvement",
  ],
  images: [
    { src: "team-sebastian-2", alt: "Sebastian — co-founder of NEWEDGE" },
    { src: "team-wenjamin-2", alt: "Wenjamin — co-founder of NEWEDGE" },
  ],
};
