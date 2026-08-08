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
import type { ImageKey } from "../assets";

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
  eyebrow: "Wie wir arbeiten",

  /** Gründer-Portrait (paper-stock) inkl. Bildunterschrift. */
  portrait: {
    src: "founders-color" as ImageKey,
    alt: "Sebastian Pachon, Gründer von NEWEDGE",
    captionName: "Sebastian & Wenjamin",
    captionRole: "NEWEDGE Founders",
  },

  /** Manifest-Zitat (rechts). `cycleWords` durchläuft `AnimatedTextCycle`. */
  quote: {
    line1: "Wir bauen Systeme, in denen",
    line2Prefix: "Prozesse und",
    cycleWords: ["Daten", "KI", "Menschen", "Agenten"],
    line3: "aufeinander hören.",
  },

  /** Fließtext unter dem Zitat. */
  body:
    "Die meisten Unternehmen optimieren einzelne Bereiche. Wir betrachten das Unternehmen als System. Erst wenn Prozesse, Technik und KI zusammenspielen, entsteht ein Vorsprung, der bleibt.",

  /** Stats-Raster (3 Spalten). */
  stats: [
    { value: "5–150", label: "Mitarbeitende — Unternehmen wie Ihres" },
    { value: "30%", label: "Zeit zurück im Tagesgeschäft" },
    { value: "4x", label: "zahlt sich Ihre Investition aus" },
  ] as Stat[],

  /** CTA-Button, der das Founder-Letter-Overlay öffnet. */
  letterCta: "Founder Letter lesen",

  /** Founder-Letter-Overlay (modal). */
  letter: {
    eyebrow: "NEWEDGE, vom Gründerschreibtisch",
    date: "München, im Juni 2026",
    headline: "Warum es NEWEDGE gibt.",
    paragraphs: [
      "Wir haben NEWEDGE gegründet, weil uns ein Widerspruch nicht losgelassen hat: Jede Agentur redet über KI. Fast keine baut damit Systeme, die ein Unternehmen wirklich besitzt.",
      "In Projekten in den USA und im DACH-Raum haben wir gesehen, was passiert, wenn Marke, Kommunikation und Prozesse getrennt eingekauft werden: dreimal bezahlt, nichts spricht miteinander. Der Mittelstand hat keine Zeit für dieses Modell.",
      "Deshalb bauen wir anders. Ohne Fremdkapital, ohne Wachstum um des Wachstums willen. Jedes System, das wir liefern, gehört am Ende dem Kunden: Daten, Prozesse, Wissensbasis. Wenn wir morgen verschwinden, läuft es weiter.",
      "Das ist unser Maßstab. Daran dürfen Sie uns messen.",
    ],
    signatureName: "Sebastian & Wenjamin",
    signatureRole: "Gründer, NEWEDGE",
    closeAria: "Schließen",
  },

  /** Award-/Anerkennungs-Logostrip (unterhalb, gleiche Section). */
  proof: {
    label: "Ausgezeichnet & anerkannt",
    partners: [
      { src: "logo-bmp-2026" as ImageKey, alt: "Bayerischer Mittelstandspreis 2026" },
      { src: "logo-bafa" as ImageKey, alt: "BAFA förderfähig" },
      { src: "logo-idc" as ImageKey, alt: "International anerkannt" },
    ] as PartnerLogo[],
  },
};
