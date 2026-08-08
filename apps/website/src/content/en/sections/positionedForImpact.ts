/**
 * Section-Text: Positioned for Impact / Wie wir arbeiten
 * --------------------------------------------------------------
 * Gründer-Manifest (Split-Spread): Foto + Zitat + Stats, Founder-Letter-
 * Overlay sowie Award-/Anerkennungs-Logostrip. Bilder als `ImageKey`-Strings
 * über die Image-Registry (`img(key)`). Keine content-gebundenen Icons —
 * die sichtbaren Marker (Emoji, ✕, „NE") sind Text-Leaves und bleiben in
 * der Komponente.
 *
 * Alle Werte sind serialisierbar (CMS-tauglich): nur Strings/Arrays/Objects.
 * Strapi-Mapping: Single Type `positioned-for-impact`.
 * --------------------------------------------------------------
 */
import type { ImageKey } from "@/content/assets";

/** Award-/Partner-Logo im Anerkennungs-Strip (mit Fallback-Alt-Text). */
export interface PartnerLogo {
  src: ImageKey;
  alt: string;
}

/** Kennzahl im Stats-Raster (Großwert + Label). */
export interface Stat {
  value: string;
  label: string;
}

export const positionedForImpact = {
  /** Eyebrow über dem Split-Spread. */
  eyebrow: "How we work",

  /** Gründer-Portrait (paper-stock) inkl. Bildunterschrift. */
  portrait: {
    src: "founders-color" as ImageKey,
    alt: "Sebastian Pachon, founder of NEWEDGE",
    captionName: "Sebastian & Wenjamin",
    captionRole: "NEWEDGE Founders",
  },

  /** Manifest-Zitat (rechts). `cycleWords` durchläuft `AnimatedTextCycle`. */
  quote: {
    line1: "We build systems where",
    line2Prefix: "processes and",
    cycleWords: ["data", "AI", "people", "agents"],
    line3: "listen to each other.",
  },

  /** Fließtext unter dem Zitat. */
  body:
    "Most companies optimize individual areas. We look at the company as one connected system. Lasting competitive advantage only emerges when processes, technology and AI work together.",

  /** Stats-Raster (3 Spalten). */
  stats: [
    { value: "5–150", label: "Employees, sweet spot" },
    { value: "30%", label: "Time back in day-to-day operations" },
    { value: "4x", label: "ROI on systems work" },
  ] as Stat[],

  /** CTA-Button, der das Founder-Letter-Overlay öffnet. */
  letterCta: "Read the founder letter",

  /** Founder-Letter-Overlay (modal). */
  letter: {
    eyebrow: "NEWEDGE, from the founders' desk",
    date: "Munich, June 2026",
    headline: "Why NEWEDGE exists.",
    paragraphs: [
      "We founded NEWEDGE because one contradiction wouldn't let us go: every agency talks about AI. Almost none of them build systems a company actually owns.",
      "We come from projects in the US and the DACH region. We've seen what happens when brand, communication and processes are bought separately: paid for three times over, and nothing talks to each other. Mid-sized companies have no time for that model.",
      "So we build differently. No outside capital, no growth for growth's sake. Every system we deliver ends up belonging to the client: data, processes, knowledge base. If we disappeared tomorrow, it would keep running.",
      "That's our standard. Hold us to it.",
    ],
    signatureName: "Sebastian & Wenjamin",
    signatureRole: "Founders, NEWEDGE",
    closeAria: "Close",
  },

  /** Award-/Anerkennungs-Logostrip (unterhalb, gleiche Section). */
  proof: {
    label: "Awarded & recognized",
    partners: [
      { src: "logo-bmp-2026" as ImageKey, alt: "Bavarian SME Award 2026" },
      { src: "logo-bafa" as ImageKey, alt: "BAFA-eligible funding" },
      { src: "logo-idc" as ImageKey, alt: "Internationally recognized" },
    ] as PartnerLogo[],
  },
};
