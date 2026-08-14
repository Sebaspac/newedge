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
    line1: "Three",
    line2: "steps",
    line3: "to success",
  },

  /** Person/Signatur unter der Überschrift. */
  person: {
    name: "With Sebastian Pachon",
    role: "Founder and Managing Director, NEWEDGE",
    phoneLabel: "↗ +49 176 60 431 467",
    phoneHref: "tel:+4917660431467",
  },

  /** Pro Karte gerendertes Label „Schritt {n}" (n = Index + 1). */
  stepLabelPrefix: "Step",

  steps: [
    {
      icon: "💬",
      title: "A no-obligation intro call",
      desc: "In a short call we understand where your company stands — and whether AI even makes sense for you yet. Pick a slot online, no commitment.",
    },
    {
      icon: "🎯",
      title: "AI readiness & ROI analysis",
      desc: "Within a few business days we show you the three processes where AI delivers the most for you — including a rough cost-benefit estimate. Often eligible for government funding.",
    },
    {
      icon: "🚀",
      title: "Your AI department takes shape",
      desc: "Based on the analysis we build your own AI capability step by step — from a secure entry point to running operations. You stay in control.",
    },
  ] as ThreeStepsCTAStep[],
};
