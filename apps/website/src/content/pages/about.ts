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
import type { SEOContent } from "../types";
import type { ImageKey } from "../assets";

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
    title: "Über uns: Gründer & KI-Team | NEWEDGE München",
    description:
      "NEWEDGE ist die KI-Abteilung für den Mittelstand aus München — ein Gründerteam aus Strategie, Technik und Operations mit KI-Erfahrung im DACH-Raum und den USA.",
    canonical: "/about",
  } satisfies SEOContent,

  /** Hero-Bereich (Aurora). */
  hero: {
    headline: "Die KI-Abteilung für den Mittelstand.",
    subline:
      "Dahinter steht ein Team, das KI im DACH-Raum und in den USA produktiv gemacht hat. Technische Tiefe und Geschäftsverständnis in einer Hand — damit aus KI bei Ihnen ein Ergebnis wird, kein Projekt.",
    cta: {
      label: "Erstgespräch buchen",
      href: "/kontakt",
    },
  },

  /** Team-Karten. */
  team: [
    {
      name: "Sebastian Pachon",
      role: "CEO & Gründer",
      img: "team-sebastian-1",
      imgHover: "team-sebastian-2",
      imgPos: "center top",
      imgHoverPos: "center 38%",
      facts: [
        "Strategie, Marke & KI-Systeme",
        "7+ Jahre B2B-Beratung & Digitalprojekte",
        "KI-Projekte umgesetzt im DACH-Raum & in den USA",
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
        "Baut die KI-Systeme hinter unseren Kundenprojekten",
        "Verbindet KI sicher mit Ihrem Firmenwissen",
        "Zuhause in Cloud und eigener Server-Welt",
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
        "Operations, Prozessdesign & Skalierung",
        "Bringt neue Systeme in bestehende Abläufe",
        "Steuert Projekte über alle Abteilungen hinweg",
      ],
      linkedin: "https://www.linkedin.com/in/wenjamin-zabezhanskiy-7138b7231/",
    },
  ] as TeamMember[],

  /** Werkbank — System-Manifest. */
  werkbank: {
    eyebrow: "NEWEDGE, die Werkbank",
    heading: "Womit wir bauen.",
    intro:
      "Keine Blackbox. Das ist die Werkbank hinter den Systemen, die bei unseren Kunden produktiv laufen. Sie sehen jederzeit, womit gebaut wird.",
    manifest: [
      { k: "MODELLE", v: "Claude, GPT und Open-Source-Modelle. Je Aufgabe das passende, nie aus Prinzip nur eines." },
      { k: "INFRASTRUKTUR", v: "EU-Rechenzentren, private Cloud oder Ihre eigenen Server im Haus. Sie entscheiden, wo Ihre Daten liegen." },
      { k: "EIGENBAU", v: "Unser eigener Baukasten für KI-Assistenten plus ein Cockpit, das jedes Ergebnis sichtbar macht. Entwickelt für den Mittelstand, im Einsatz bei Kunden." },
      { k: "INTEGRATIONEN", v: "DATEV, SAP, HubSpot, Shopify, ATLAS — und alles, was eine Schnittstelle hat." },
      { k: "ARBEITSWEISE", v: "Analyse, Pilot mit echten Daten, Start im Betrieb, Übergabe. Typisch 4 bis 6 Wochen." },
    ] as ManifestRow[],
    /** YouTube-Erklärvideo (dokumentiertes Artefakt). */
    video: {
      youtubeId: "4TU1CdVskP8",
      title: "NEWEDGE Brand — Erklärvideo",
    },
  },

  /** CTA-Abschnitt (dunkel). */
  cta: {
    eyebrow: "Bereit loszulegen?",
    /** Überschrift in zwei Zeilen (durch <br /> getrennt). */
    headingLine1: "Sprechen Sie",
    headingLine2: "direkt mit uns.",
    phone: {
      label: "+49 176 60 431 467",
      href: "tel:+4917660431467",
    },
  },

  /** Kontakt-Sheet (rechts). */
  contact: {
    title: "Projekt besprechen",
    description: "Erzählen Sie uns von Ihrem Projekt — wir melden uns schnell zurück.",
    fields: [
      { id: "name",     label: "Name *",     type: "text",  placeholder: "Ihr Name",          required: true },
      { id: "email",    label: "E-Mail *",   type: "email", placeholder: "ihre@email.com",    required: true },
      { id: "position", label: "Position *", type: "text",  placeholder: "Ihre Position",     required: true },
      { id: "firma",    label: "Firma *",    type: "text",  placeholder: "Ihr Unternehmen",   required: true },
      { id: "telefon",  label: "Telefon",    type: "tel",   placeholder: "Ihre Telefonnummer", required: false },
    ] as ContactField[],
    message: {
      label: "Nachricht *",
      placeholder: "Erzählen Sie uns von Ihrem Projekt...",
    },
    submit: "Nachricht senden",
    toast: {
      validationTitle: "Bitte Angaben prüfen",
      successTitle: "Nachricht gesendet",
      successBody: "Wir melden uns bald.",
      errorTitle: "Fehler",
      errorFallback: "Bitte erneut versuchen.",
    },
  },
} as const;
