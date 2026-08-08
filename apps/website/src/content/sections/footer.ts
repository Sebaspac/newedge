/**
 * Section-Text: Footer (Singleton, global)
 * --------------------------------------------------------------
 * Navigation, Kontaktdaten und Rechtliches im Footer (jede Seite).
 * Strapi-Mapping: Single Type `footer` (bzw. Teil von „globals").
 * --------------------------------------------------------------
 */
import type { ImageKey } from "../assets";

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
    homeAriaLabel: "NEWEDGE – zur Startseite",
  },
  /** Standort-Zeile rechts (mit geschützten Leerzeichen). */
  meta: "München\u00A0·\u00A0BAFA-förderfähig",

  columns: {
    unternehmen: {
      label: "Unternehmen",
      links: [
        { label: "Methodik", to: "/methodik" },
        // Über uns vorerst deaktiviert — Content bleibt im CMS, nur der Link ist raus
        // Karriere vorerst deaktiviert — Content bleibt im CMS, nur der Link ist raus
      ] as NavLink[],
    },
    ressourcen: {
      label: "Ressourcen",
      links: [
        { label: "ROI-Rechner", to: "/roi-rechner" },
        { label: "KI Glossar", to: "/ki-glossar" },
        { label: "KI Audit", to: "/ki-audit" },
      ] as NavLink[],
    },
    kontakt: {
      label: "Kontakt",
      items: [
        { label: "info@newedgebrand.com", href: "mailto:info@newedgebrand.com" },
        { label: "+49 176 60 431 467", href: "tel:+4917660431467" },
        { label: "Am Moosfeld 13, 81829 München", href: "https://maps.google.com/?q=Am+Moosfeld+13,+81829+M%C3%BCnchen", external: true },
      ] as ContactItem[],
    },
  },

  /**
   * Rebrush-Chrome (2026-07): neue Footer-Komposition nach Referenz-Layout.
   * Bewusst NICHT CMS-geschattet — die Komponente liest diese Felder direkt
   * aus dem statischen Modul (der Strapi-Footer kennt sie noch nicht).
   */
  rebrush: {
    backTop: "Zu weit gescrollt? Zurück nach oben",
    headingLine1: "Gefällt Ihnen,",
    headingLine2: "was Sie sehen?",
    ctaLabel: "KI-Analyse starten",
    ctaTo: "/kontakt",
    giantText: "Innovating since 2026",
  },

  /** `{year}` wird zur Laufzeit ersetzt. */
  copyrightTemplate: "© {year}\u00A0NEWEDGE. Alle Rechte vorbehalten.",

  legalLinks: [
    { label: "Impressum", to: "/impressum" },
    { label: "Datenschutz", to: "/impressum#datenschutz" },
  ] as NavLink[],

  /** Öffnet das Cookiebot-Banner erneut (Widerruf der Einwilligung). */
  cookieSettingsLabel: "Cookie-Einstellungen",
};
