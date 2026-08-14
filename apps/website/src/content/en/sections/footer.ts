/**
 * Section-Text: Footer (Singleton, global)
 * --------------------------------------------------------------
 * Navigation, Kontaktdaten und Rechtliches im Footer (jede Seite).
 * Strapi-Mapping: Single Type `footer` (bzw. Teil von „globals").
 * --------------------------------------------------------------
 */
import type { ImageKey } from "@/content/assets";

export interface NavLink {
  label: string;
  to: string;
}

export interface ContactItem {
  label: string;
  href: string;
  /** true → in neuem Tab öffnen (target=_blank, rel=noopener). */
  external?: boolean;
}

export const footer = {
  logo: {
    src: "new-edge-logo-horizontal" as ImageKey,
    alt: "NEWEDGE",
    homeAriaLabel: "NEWEDGE – to the homepage",
  },
  /** Standort-Zeile rechts (mit geschützten Leerzeichen). */
  meta: "Munich · BAFA-eligible",

  columns: {
    unternehmen: {
      label: "Company",
      links: [
        { label: "Methodology", to: "/methodik" },
        { label: "Security & Privacy", to: "/sicherheit" },
        // About temporarily disabled — content stays in the CMS, only the link is gone
        // Careers temporarily disabled — content stays in the CMS, only the link is removed
      ] as NavLink[],
    },
    ressourcen: {
      label: "Resources",
      links: [
        { label: "ROI Calculator", to: "/roi-rechner" },
        { label: "AI Glossary", to: "/ki-glossar" },
        { label: "AI Audit", to: "/ki-audit" },
      ] as NavLink[],
    },
    kontakt: {
      label: "Contact",
      items: [
        { label: "info@newedgebrand.com", href: "mailto:info@newedgebrand.com" },
        { label: "+49 176 60 431 467", href: "tel:+4917660431467" },
        { label: "Am Moosfeld 13, 81829 Munich", href: "https://maps.google.com/?q=Am+Moosfeld+13,+81829+M%C3%BCnchen", external: true },
      ] as ContactItem[],
    },
  },

  /**
   * Rebrush-Chrome (2026-07): neue Footer-Komposition nach Referenz-Layout.
   * Bewusst NICHT CMS-geschattet — die Komponente liest diese Felder direkt
   * aus dem statischen Modul (der Strapi-Footer kennt sie noch nicht).
   */
  rebrush: {
    backTop: "Scrolled too far? Back to top",
    /** Kurzform für Mobile (unter lg) — dort ist für `backTop` kein Platz. */
    backTopShort: "Back to top",
    headingLine1: "Like",
    headingLine2: "what you see?",
    ctaLabel: "Start your AI analysis",
    ctaTo: "/kontakt",
    giantText: "Innovating since 2026",
  },

  /** `{year}` wird zur Laufzeit ersetzt. */
  copyrightTemplate: "© {year} NEWEDGE. All rights reserved.",

  legalLinks: [
    { label: "Legal Notice", to: "/impressum" },
    { label: "Privacy", to: "/impressum#datenschutz" },
  ] as NavLink[],

  /** Reopens the Cookiebot banner (withdrawal of consent). */
  cookieSettingsLabel: "Cookie settings",
};
