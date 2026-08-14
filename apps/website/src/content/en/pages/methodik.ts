/**
 * Page: Methodik  — Single Type
 * --------------------------------------------------------------
 * Inhalte der Methodik-Seite (`pages/Methodik.tsx`): Hero, Manifest,
 * die drei Phasen, das Ziel und der CTA-Block.
 * Das animierte „NEWEDGE System" ist eine eigene Section-Komponente.
 * Alle Felder sind serialisierbar (CMS-tauglich): nur Strings/Arrays/
 * Objects — kein JSX, keine Funktionen.
 * Strapi-Mapping: Single Type `methodik`.
 * --------------------------------------------------------------
 */
import type { SEOContent } from "@/content/types";

/** Eine Entwicklungsstufe der KI-Abteilung. */
export interface Stufe {
  index: string;
  title: string;
  frage: string;
  intro: string[];
  listLabel?: string;
  list?: string[];
  outro?: string;
  ergebnis: string[];
}

/** Ein Feld des Kontakt-Formulars (Sheet). */
export interface ContactField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
}

export const methodik = {
  seo: {
    title: "AI Adoption for Mid-Sized Companies: 3 Phases | NEWEDGE",
    description:
      "Adopting AI in a mid-sized company works in three phases: Analysis (where does AI pay off?), Implementation and Scaling — until AI becomes a lasting capability.",
    canonical: "/en/methodik",
  } satisfies SEOContent,

  /** HERO. */
  hero: {
    /** Headline, zweizeilig (Zeilenumbruch via <br/>). */
    headlineLine1: "We build the AI department",
    headlineLine2: "for mid-sized companies.",
    subline:
      "Not another AI tool — an operational capacity that takes over work: your own AI department, rented instead of built. The way there: three phases.",
    ctaLabel: "Request a free AI analysis",
    ctaHref: "/kontakt",
  },

  /** MANIFEST — Warum eine Methodik. */
  manifest: {
    lead: "Most companies don't fail because of technology. They fail because AI is introduced in isolation.",
    body: [
      "Tools get bought, individual automations get built. Without ownership, structure and a shared foundation, the impact stays small.",
      "That's why we don't build new custom software for every company: we standardize recurring business functions — decisions and case review, documents and processes, steering and reporting, service and case handling — and configure them for your professional context. On the same infrastructure, whatever industry you come from. Every AI transformation runs in three fixed phases — so scattered parts become a department that's yours.",
    ],
  },

  /** ENTWICKLUNGSSTUFEN — Die Methodik. */
  stufenSection: {
    eyebrow: "The methodology",
    headingLine1: "The three phases",
    headingLine2: "of an AI department.",
    /** Ergebnis-Block-Überschrift je Stufe. */
    ergebnisLabel: "Outcome",
  },

  stufen: [
    {
      index: "01",
      title: "Analysis",
      frage: "Where does AI really pay off?",
      intro: [
        "You know where AI has the greatest leverage in your company — and in what order implementation pays off. Before a single euro is spent.",
        "To get there, we look at your day-to-day business, surface untapped potential and translate every lever into a clear plan — what comes first, what comes next.",
      ],
      listLabel: "We analyze & assess",
      list: ["Processes", "Data flows", "Knowledge structures", "Decision paths", "Recurring tasks", "Economics"],
      ergebnis: ["Potential analysis: what actually pays off", "Prioritized areas of action", "Cost-benefit calculation per initiative", "A clear plan for implementation"],
    },
    {
      index: "02",
      title: "Implementation",
      frage: "The analysis turns into a running system.",
      intro: [
        "Now the foundation takes shape: Cortex — the one place where employees, data, processes and AI assistants come together. Controlled, secure, transparent.",
        "On top of it, we build the digital systems and automate the workflows that add the most value — following the priorities from the analysis.",
      ],
      listLabel: "We build & automate",
      list: ["Cortex as the foundation", "Customer portals & platforms", "Web applications", "Document processing", "Customer service", "Reports & administration"],
      ergebnis: ["Central control & transparency", "Digital products that grow with you", "Less busywork day to day", "More breathing room in daily operations"],
    },
    {
      index: "03",
      title: "Scaling",
      frage: "No hiring. No onboarding. No risk.",
      intro: [
        "You get a fully operational AI department — without hiring or training anyone yourself. One point of contact on your side coordinates, backed by our team with five times the capacity.",
        "Everything we build belongs to you: transparent, controllable and expandable at any time. With Embedded AI — our ongoing support — we keep developing your AI department over time.",
      ],
      listLabel: "What we take on",
      list: ["Strategic prioritization", "Ongoing system maintenance", "Spotting potential & further development", "Clear rules & data sovereignty", "Training & empowering your team", "Expanding the technical foundation"],
      outro: "You get the firepower of a whole team for the cost of a single hire — permanently at your side.",
      ergebnis: ["5× capacity for the cost of one hire", "No new hires, no onboarding", "Long-term independence & data sovereignty", "Ongoing further development"],
    },
  ] as Stufe[],

  /** DAS ZIEL. */
  ziel: {
    eyebrow: "The goal",
    headingLine1: "The AI department as",
    headingLine2: "a company capability.",
    intro: "The end result isn't a single tool, but an organization that puts AI to productive use permanently. A company that:",
    punkte: [
      "Makes knowledge usable faster",
      "Continuously improves processes",
      "Increases productivity",
      "Drives automation systematically",
      "Can integrate digital workers over the long term",
    ],
    closing: "Individual projects turn into a lasting company capability. That's the AI department.",
  },

  /** CTA-Block. */
  cta: {
    eyebrow: "Ready for phase 01?",
    headingLine1: "Talk to us",
    headingLine2: "directly.",
    phoneHref: "tel:+4917660431467",
    phoneLabel: "+49 176 60 431 467",
  },

  /** Kontakt-Formular (Sheet). */
  contact: {
    title: "Discuss a project",
    description: "Tell us about your project — we'll get back to you shortly.",
    fields: [
      { id: "name",     label: "Name *",     type: "text",  placeholder: "Your name",          required: true },
      { id: "email",    label: "Email *",   type: "email", placeholder: "your@email.com",    required: true },
      { id: "position", label: "Position *", type: "text",  placeholder: "Your position",     required: true },
      { id: "firma",    label: "Company *",    type: "text",  placeholder: "Your company",   required: true },
      { id: "telefon",  label: "Phone",    type: "tel",   placeholder: "Your phone number", required: false },
    ] as ContactField[],
    message: {
      label: "Message *",
      placeholder: "Tell us about your project...",
    },
    submit: "Send message",
  },

  /** Toast-Meldungen des Kontaktformulars. */
  toast: {
    validationTitle: "Please check your details",
    successTitle: "Message sent",
    successBody: "We'll be in touch soon.",
    errorTitle: "Error",
    errorFallback: "That didn't work — please try again.",
  },
} as const;
