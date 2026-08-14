/**
 * Section-Text: Navigation (Singleton, global)
 * --------------------------------------------------------------
 * Desktop-Mega-Menu + Mobile-Menu (Komponente `MobileNavigation`).
 * Icons als Name-Strings → über die Icon-Registry austauschbar.
 * Strapi-Mapping: Single Type `navigation`.
 * --------------------------------------------------------------
 */
import type { ImageKey } from "@/content/assets";
import type { IconName } from "@/content/icons";

export type CategoryFilter = "all" | "studio" | "lab";

export interface FilterButton {
  key: CategoryFilter;
  label: string;
}

/** Menüeintrag mit Icon (Anwendungsfelder). */
export interface NavMenuItem {
  to: string;
  label: string;
  icon: IconName;
}

/** Einfacher Menü-Link ohne Icon. */
export interface NavLinkItem {
  to: string;
  label: string;
}

export const nav = {
  logo: { src: "newedge-wordmark" as ImageKey, alt: "NEWEDGE" },

  filterButtons: [{ key: "all", label: "All" }] as FilterButton[],

  megaMenu: {
    trigger: "Solutions",
    painPointsHeading: "By challenge",
    industrienHeading: "By industry",
    featuredHeading: "Success Story",
  },

  /**
   * "By challenge" = the four reusable Operations Blueprints. They are the
   * product; industries are only configurations of them.
   *
   * External (shown here)      Internal / investor wording
   * ─────────────────────────  ───────────────────────────
   * Decisions & Case Review    Decision Operations
   * Documents & Processes      Document Operations
   * Steering & Reporting       Management Intelligence
   * Service & Case Handling    Service Operations
   *
   * Since 2026-08 the slugs mirror the visible label (the site was not live
   * yet, so there were no rankings to protect). The old slugs remain as
   * aliases in the `painPoints` map so links already shared keep working —
   * but only the new path is linked and listed in sitemap.xml.
   */
  painPoints: [
    { to: "/loesungen/entscheidungen-fallpruefung", label: "Decisions & Case Review", icon: "Award" },
    { to: "/loesungen/dokumente-prozesse", label: "Documents & Processes", icon: "FileCheck" },
    { to: "/loesungen/steuerung-reporting", label: "Steering & Reporting", icon: "BarChart3" },
    { to: "/loesungen/service-fallbearbeitung", label: "Service & Case Handling", icon: "Headphones" },
  ] as NavMenuItem[],

  /**
   * "By industry" = vertical profiles, NOT separate products. Each one is a
   * configuration of the same four blueprints above.
   *
   * An unknown slug does NOT 404 — it falls back to `defaultPainPoint` — so no
   * invented slugs here. Routes are language-independent and stay in German.
   */
  industrien: [
    { to: "/industrien/versicherungen", label: "Insurance", icon: "Shield" },
    { to: "/industrien/bildung", label: "Education", icon: "BookOpen" },
    { to: "/industrien/foerderungen-entscheidungsinstanzen", label: "Grants & Decision-Making Bodies", icon: "Trophy" },
    { to: "/industrien/immobilien", label: "Real Estate", icon: "Building2" },
  ] as NavMenuItem[],

  featured: {
    to: "/loesungen/entscheidungen-fallpruefung",
    image: { src: "team-sebastian" as ImageKey, alt: "NEWEDGE Team" },
    title: "BMP Award — Decisions & Case Review in action",
    desc: "275 applications per selection cycle — structured, reviewed and brought together so the jury can follow every step.",
    cta: "View case →",
  },

  /** Top level — answers "What does NEWEDGE actually offer?". */
  angebot: { to: "/methodik", label: "Your AI Department" } as NavLinkItem,


  /** Desktop-CTA-Button + Kontakt-Link. */
  cta: { label: "Intro call", calendly: "/kontakt" },

  mobile: {
    toggleAria: "Toggle menu",
    contactButton: "Get in touch",
  },
};
