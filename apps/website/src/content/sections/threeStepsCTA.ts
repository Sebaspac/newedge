/**
 * Section-Text: ThreeStepsCTA (Drei Schritte zum Erfolg)
 * --------------------------------------------------------------
 * Scroll-getriebene CTA-Sektion mit drei Schritt-Karten (Mobile +
 * Desktop teilen denselben Inhalt). Texte verbatim aus der Komponente.
 * Die Schritt-Icons sind Emojis (reiner Text, kein Lucide-Icon aus der
 * Registry) und bleiben daher serialisierbare String-Daten.
 * Strapi-Mapping: Single Type `three-steps-cta` mit Component-Repeater
 * `steps` (icon/title/desc).
 * --------------------------------------------------------------
 */

/** Eine Schritt-Karte. `icon` ist ein Emoji (reiner Text). */
export interface ThreeStepsCTAStep {
  icon: string;
  title: string;
  desc: string;
}

export const threeStepsCTA = {
  /** Überschrift links; `<br/>` zwischen den drei Wörtern in der Komponente. */
  heading: {
    line1: "Drei",
    line2: "Schritte",
    line3: "zum Erfolg",
  },

  /** Person/Signatur unter der Überschrift. */
  person: {
    name: "Mit Sebastian Pachon",
    role: "Gründer und Geschäftsführer NEWEDGE",
    phoneLabel: "↗ +49 176 60 431 467",
    phoneHref: "tel:+4917660431467",
  },

  /** Pro Karte gerendertes Label „Schritt {n}" (n = Index + 1). */
  stepLabelPrefix: "Schritt",

  steps: [
    {
      icon: "💬",
      title: "Unverbindliches Erstgespräch",
      desc: "Ein kurzes Gespräch zeigt, wo Ihr Unternehmen steht — und ob sich KI bei Ihnen schon lohnt. Termin online wählen, ohne Verpflichtung.",
    },
    {
      icon: "🎯",
      title: "KI-Readiness & ROI-Analyse",
      desc: "In wenigen Werktagen zeigen wir Ihnen die drei Prozesse, in denen KI Ihnen am meisten bringt — inklusive Aufwand-Nutzen-Schätzung. Oft staatlich förderfähig.",
    },
    {
      icon: "🚀",
      title: "Ihre KI-Abteilung entsteht",
      desc: "Auf Basis der Analyse bauen wir Ihre eigene KI-Fähigkeit — vom sicheren Einstiegspunkt bis zum laufenden Betrieb. Die Kontrolle bleibt bei Ihnen.",
    },
  ] as ThreeStepsCTAStep[],
};
