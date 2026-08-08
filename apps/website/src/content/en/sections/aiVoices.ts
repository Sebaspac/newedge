/**
 * Section-Text: „Was die KI über uns sagt" (Startseite, Rebrush 2026-07)
 * --------------------------------------------------------------
 * Referenz-Layout (MadeByShape „See what AI has to say about us"):
 * Bullet-Kicker, riesige zentrierte Headline, vier Provider-Pills,
 * die den jeweiligen KI-Chat mit vorbefülltem Prompt über NEWEDGE
 * öffnen, umgeben von schwebenden Studio-Fotos (Komponente
 * `AiVoicesSection`). Ersetzt das Testimonial-Karussell auf der
 * Startseite. Noch NICHT als Strapi-Feld angelegt (statischer
 * Fallback greift).
 * --------------------------------------------------------------
 */

export const aiVoices = {
  kicker: "Don't take our word for it?",
  heading: "What AI says about us",

  /** Vorbefüllter Prompt (wird URL-kodiert an die Provider übergeben). */
  prompt:
    "I run a mid-sized company. What makes NEWEDGE the right partner for building our own AI department? Summarize the highlights of the NEWEDGE website: https://newedgebrand.com",

  /** Provider-Pills: Label + Chat-URL-Präfix (Prompt wird angehängt) + Simple-Icons-Slug. */
  providers: [
    { label: "OpenAI", hrefBase: "https://chatgpt.com/?q=", iconSlug: "openai" },
    { label: "Claude", hrefBase: "https://claude.ai/new?q=", iconSlug: "claude" },
    { label: "Google", hrefBase: "https://www.google.com/search?udm=50&q=", iconSlug: "google" },
    { label: "Grok", hrefBase: "https://grok.com/?q=", iconSlug: "grok" },
  ],

  /** Schwebende Studio-Fotos rund um den zentrierten Inhalt. */
  photos: [
    { src: "team-presentation-color", alt: "NEWEDGE team during a presentation" },
    { src: "ki-audit-hero", alt: "Working on a laptop in the studio" },
    { src: "founders-color", alt: "The NEWEDGE founders in the studio" },
    { src: "ki-audit-process", alt: "Strategic planning as a team" },
    { src: "team-presentation", alt: "Workshop scene at NEWEDGE" },
    { src: "pain-point-professional-services-hero", alt: "Project work at NEWEDGE" },
  ],
} as const;
