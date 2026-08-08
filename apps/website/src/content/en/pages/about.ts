/**
 * Page: About (Über uns)  — Single Type
 * --------------------------------------------------------------
 * Inhalte der „Über uns"-Seite (`pages/About.tsx`): Hero, Team,
 * Werkbank-Manifest, CTA und Kontakt-Sheet. Bilder werden per
 * stabilem `ImageKey` referenziert (→ `img(key)`), Icons sind hier
 * keine — die Glyphen ▸/↗ sind dekorative Schriftzeichen im Markup.
 * Strapi-Mapping: Single Type `about`.
 * --------------------------------------------------------------
 */
import type { SEOContent } from "@/content/types";
import type { ImageKey } from "@/content/assets";

/** Ein Teammitglied (Foto-Karte mit Hover-Swap). */
interface TeamMember {
  name: string;
  role: string;
  /** Basisbild-Key (Registry). */
  img: ImageKey;
  /** Hover-Bild-Key (Registry). */
  imgHover: ImageKey;
  /** object-position des Basisbilds. */
  imgPos: string;
  /** object-position des Hover-Bilds. */
  imgHoverPos: string;
  /** Initialen-Fallback (nur falls kein Bild). */
  initials?: string;
  facts: string[];
  linkedin: string;
}

/** Eine Zeile des Werkbank-Manifests. */
interface ManifestRow {
  k: string;
  v: string;
}

/** Kontakt-Formularfeld (Sheet). */
interface ContactField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
}

export const about = {
  seo: {
    title: "About: Founders & AI Team | NEWEDGE Munich",
    description:
      "NEWEDGE is the AI department for mid-sized companies in Munich — a founding team in strategy, tech and operations, proven with AI across DACH and the US.",
    canonical: "/en/about",
  } satisfies SEOContent,

  /** Hero-Bereich (Aurora). */
  hero: {
    headline: "The AI department for mid-sized companies.",
    subline:
      "Behind it stands a team that has made AI productive across the DACH region and in the US. Technical depth and business sense in one place — so AI turns into a result in your company, not a project.",
    cta: {
      label: "Book an intro call",
      href: "/kontakt",
    },
  },

  /** Team-Karten. */
  team: [
    {
      name: "Sebastian Pachon",
      role: "CEO & Founder",
      img: "team-sebastian-1",
      imgHover: "team-sebastian-2",
      imgPos: "center top",
      imgHoverPos: "center 38%",
      facts: [
        "Strategy, brand & AI systems",
        "7+ years of B2B consulting & digital projects",
        "AI projects delivered across the DACH region & the US",
      ],
      linkedin: "https://www.linkedin.com/in/sebastian-pachón-a7504b24b",
    },
    {
      name: "Ivan Jovanovic",
      role: "CTO",
      img: "team-ivan",
      imgHover: "team-ivan-2",
      imgPos: "center top",
      imgHoverPos: "center 38%",
      initials: "IJ",
      facts: [
        "Builds the AI systems behind our client projects",
        "Connects AI securely to your company knowledge",
        "At home in the cloud and on your own servers",
      ],
      linkedin: "https://www.linkedin.com/in/ivan-jovanovic-51b319187/",
    },
    {
      name: "Wenjamin Zabezhanskiy",
      role: "COO",
      img: "team-wenjamin-1",
      imgHover: "team-wenjamin-2",
      imgPos: "center 20%",
      imgHoverPos: "center 38%",
      initials: "WZ",
      facts: [
        "Operations, process design & scaling",
        "Brings new systems into existing processes",
        "Steers projects across all departments",
      ],
      linkedin: "https://www.linkedin.com/in/wenjamin-zabezhanskiy-7138b7231/",
    },
  ] as TeamMember[],

  /** Werkbank — System-Manifest. */
  werkbank: {
    eyebrow: "NEWEDGE, the workbench",
    heading: "What we build with.",
    intro:
      "No black box. This is the workbench behind the systems running in production at our clients. You can see at any time what we build with.",
    manifest: [
      { k: "MODELS", v: "Claude, GPT and open-source models. The right one for each task, never just one on principle." },
      { k: "INFRASTRUCTURE", v: "EU data centers, private cloud or your own servers in-house. You decide where your data lives." },
      { k: "IN-HOUSE BUILD", v: "Our own toolkit for AI assistants plus a cockpit that makes every result visible. Built for mid-sized companies, in use at clients." },
      { k: "INTEGRATIONS", v: "DATEV, SAP, HubSpot, Shopify, ATLAS — and anything with an interface." },
      { k: "WAY OF WORKING", v: "Analysis, pilot with real data, going into operation, handover. Typically 4 to 6 weeks." },
    ] as ManifestRow[],
    /** YouTube-Erklärvideo (dokumentiertes Artefakt). */
    video: {
      youtubeId: "4TU1CdVskP8",
      title: "NEWEDGE Brand — explainer video",
    },
  },

  /** CTA-Abschnitt (dunkel). */
  cta: {
    eyebrow: "Ready to get started?",
    /** Überschrift in zwei Zeilen (durch <br /> getrennt). */
    headingLine1: "Talk to us",
    headingLine2: "directly.",
    phone: {
      label: "+49 176 60 431 467",
      href: "tel:+4917660431467",
    },
  },

  /** Kontakt-Sheet (rechts). */
  contact: {
    title: "Discuss a project",
    description: "Tell us about your project — we'll get back to you soon.",
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
    toast: {
      validationTitle: "Please check your details",
      successTitle: "Message sent",
      successBody: "We'll be in touch soon.",
      errorTitle: "Error",
      errorFallback: "Please try again.",
    },
  },
} as const;
