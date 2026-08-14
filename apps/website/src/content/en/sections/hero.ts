/**
 * Section-Text: Hero (Startseite, oberer Abschnitt)
 * --------------------------------------------------------------
 * Headline, Subline, CTAs, Social-Proof-Badges und das eingebettete
 * YouTube-Erklärvideo der Startseite (Komponente `HeroSection`).
 *
 * Die drei Badge-Icons sind dekoratives Inline-SVG in der Komponente
 * (kein Registry-Icon) und bleiben daher dort; hier liegen nur die
 * Text-Leafs. Serialisierbar (nur Strings) — CMS-tauglich.
 * Strapi-Mapping: Single Type `hero` (bzw. Teil von „home").
 * --------------------------------------------------------------
 */

/** Zwei-zeilige Headline (zwei farblich getrennte Spans). */
export interface HeroHeadline {
  /** Erste Zeile (hell). */
  line1: string;
  /** Zweite Zeile (violett akzentuiert). */
  line2: string;
}

/** Beschrifteter CTA-Button/-Link. */
export interface HeroCta {
  label: string;
}

/** Social-Proof-Badge mit Text (Icon ist Inline-SVG in der Komponente). */
export interface HeroBadge {
  label: string;
}

/** Eingebettetes YouTube-Video. */
export interface HeroVideo {
  /** YouTube-Video-ID (für den Embed-URL). */
  youtubeId: string;
  /** `title`-Attribut des `<iframe>` (Barrierefreiheit). */
  title: string;
}

export const hero = {
  /** Skip-Link (Barrierefreiheit, oben links). */
  skipLink: "Skip to main content",

  /** Kleines Begrüßungs-Pill über der Headline (Referenz-Layout). */
  greeting: "Hey, we're NEWEDGE",

  headline: {
    line1: "We build the AI department",
    line2: "for mid-sized companies.",
  } as HeroHeadline,

  /** Lead-Subline (em-dashes = U+2014). */
  subline:
    "We build your own AI capability: from analysis to ongoing operations. Not another tool — a department that takes over work.",

  /** Primärer CTA → /ki-audit. */
  primaryCta: { label: "Calculate your AI potential" } as HeroCta,
  /** Sekundärer CTA → öffnet Kontakt-Dialog. */
  secondaryCta: { label: "Free analysis" } as HeroCta,

  badges: [
    { label: "50+ companies" },
    { label: "BAFA-eligible funding" },
    { label: "Bavarian SME Award 2026" },
  ] as HeroBadge[],

  video: {
    youtubeId: "4TU1CdVskP8",
    title: "NEWEDGE Brand — Explainer video",
  } as HeroVideo,

  /**
   * Founder-Badge unten rechts auf der Video-Canvas (Rebrush-Chrome 2026-07).
   * Bewusst NICHT CMS-geschattet — die Komponente liest diese Felder direkt
   * aus dem statischen Modul (der Strapi-Hero kennt sie noch nicht).
   */
  founderBadge: {
    title: "Real talk from Sebastian",
    subtitle: "Co-Founder NEWEDGE",
    to: "/kontakt",
    image: "team-sebastian",
    imageAlt: "Sebastian Pachon, Co-Founder NEWEDGE",
  },
};
