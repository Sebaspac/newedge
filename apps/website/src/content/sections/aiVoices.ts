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
  kicker: "Glauben Sie uns kein Wort?",
  heading: "Was die KI über uns sagt",

  /** Vorbefüllter Prompt (wird URL-kodiert an die Provider übergeben). */
  prompt:
    "Ich führe ein mittelständisches Unternehmen. Was macht NEWEDGE zum richtigen Partner für den Aufbau einer eigenen KI-Abteilung? Fasse die Highlights der NEWEDGE-Website zusammen: https://newedgebrand.com",

  /** Provider-Pills: Label + Chat-URL-Präfix (Prompt wird angehängt) + Simple-Icons-Slug. */
  providers: [
    { label: "OpenAI", hrefBase: "https://chatgpt.com/?q=", iconSlug: "openai" },
    { label: "Claude", hrefBase: "https://claude.ai/new?q=", iconSlug: "claude" },
    { label: "Google", hrefBase: "https://www.google.com/search?udm=50&q=", iconSlug: "google" },
    { label: "Grok", hrefBase: "https://grok.com/?q=", iconSlug: "grok" },
  ],

  /** Schwebende Studio-Fotos rund um den zentrierten Inhalt. */
  photos: [
    { src: "team-presentation-color", alt: "NEWEDGE Team bei einer Präsentation" },
    { src: "ki-audit-hero", alt: "Arbeit am Laptop im Studio" },
    { src: "founders-color", alt: "Die NEWEDGE-Gründer im Studio" },
    { src: "ki-audit-process", alt: "Strategische Planung im Team" },
    { src: "team-presentation", alt: "Workshop-Situation bei NEWEDGE" },
    { src: "pain-point-professional-services-hero", alt: "Projektarbeit bei NEWEDGE" },
  ],
} as const;
