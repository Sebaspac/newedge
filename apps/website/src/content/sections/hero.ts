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
  greeting: "Hey, wir sind NEWEDGE",

  headline: {
    line1: "Wir bauen die KI-Abteilung",
    line2: "für den Mittelstand.",
  } as HeroHeadline,

  /** Lead-Subline (em-dashes = U+2014). */
  subline:
    "Wir bauen Ihre eigene KI-Fähigkeit auf: von der Analyse bis zum laufenden Betrieb. Kein weiteres Tool — eine Abteilung, die Arbeit übernimmt.",

  /** Primärer CTA → /ki-audit. */
  primaryCta: { label: "KI-Potenzial berechnen" } as HeroCta,
  /** Sekundärer CTA → öffnet Kontakt-Dialog. */
  secondaryCta: { label: "Kostenlose Analyse" } as HeroCta,

  badges: [
    { label: "50+ Unternehmen" },
    { label: "BAFA-förderfähig" },
    { label: "Bayer. Mittelstandspreis 2026" },
  ] as HeroBadge[],

  video: {
    youtubeId: "4TU1CdVskP8",
    title: "NEWEDGE Brand — Erklärvideo",
  } as HeroVideo,

  /**
   * Founder-Badge unten rechts auf der Video-Canvas (Rebrush-Chrome 2026-07).
   * Bewusst NICHT CMS-geschattet — die Komponente liest diese Felder direkt
   * aus dem statischen Modul (der Strapi-Hero kennt sie noch nicht).
   */
  founderBadge: {
    title: "Realtalk von Sebastian",
    subtitle: "Co-Founder NEWEDGE",
    to: "/kontakt",
    image: "team-sebastian",
    imageAlt: "Sebastian Pachon, Co-Founder NEWEDGE",
  },
};
