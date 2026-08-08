/**
 * Section-Text: Team-Support (Startseite, Rebrush 2026-07)
 * --------------------------------------------------------------
 * „Hands-On Support"-Referenz-Layout in NEWEDGE-CI (Komponente
 * `TeamSupportSection`): Kicker, zentrierte Headline mit Akzent,
 * Absatz, dunkle Team-Banner-Pill mit echten Avataren (About-Team),
 * darunter drei Feature-Spalten. Kernbotschaft: ein Ansprechpartner
 * plus die Manpower einer ganzen Agentur für Digitalisierungs- und
 * KI-Projekte. Feature-Icons sind dekorativ und leben in der
 * Komponente. Noch NICHT als Strapi-Feld angelegt (statischer
 * Fallback greift).
 * --------------------------------------------------------------
 */

export const teamSupport = {
  kicker: "Your team",
  headingLead: "One point of contact. ",
  headingHighlight: "A whole team behind them.",
  paragraph:
    "We don't deliver and disappear. You work with one dedicated point of contact — behind them, the full NEWEDGE team: strategy, development, design and automation.",

  banner: {
    avatars: [
      { src: "team-sebastian-1", alt: "Sebastian, NEWEDGE" },
      { src: "team-wenjamin-1", alt: "Wenjamin, NEWEDGE" },
      { src: "team-ivan", alt: "Ivan, NEWEDGE" },
    ],
    textLead: "A team that's ",
    textHighlight: "committed to your success",
  },

  features: [
    {
      title: "One dedicated point of contact",
      desc: "Short paths, clear ownership: you always talk to someone who knows your project.",
    },
    {
      title: "Full team strength",
      desc: "Strategy, design, development and automation from a single team, with no handover losses.",
    },
    {
      title: "Digitalization & AI from one source",
      desc: "From the first analysis to ongoing operations, your project stays with one team.",
    },
  ],
} as const;
