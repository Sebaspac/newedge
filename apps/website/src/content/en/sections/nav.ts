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
   * Slugs stay as they are so existing links and rankings hold.
   */
  painPoints: [
    { to: "/loesungen/auswahlverfahren", label: "Decisions & Case Review", icon: "Award" },
    { to: "/loesungen/compliance", label: "Documents & Processes", icon: "FileCheck" },
    { to: "/loesungen/kpi-dashboard", label: "Steering & Reporting", icon: "BarChart3" },
    { to: "/loesungen/ki-kundensupport", label: "Service & Case Handling", icon: "Headphones" },
  ] as NavMenuItem[],

  /**
   * "By industry" = vertical profiles, NOT separate products. Each one is a
   * configuration of the same four blueprints above.
   *
   * TODO(industry pages): Insurance, Education and Real Estate have no page of
   * their own yet and point to /kontakt for now. An unknown slug does NOT 404 —
   * it falls back to `defaultPainPoint` — so no invented slugs here.
   */
  industrien: [
    { to: "/kontakt", label: "Insurance", icon: "Shield" }, // TODO: → /industrien/versicherungen
    { to: "/kontakt", label: "Education", icon: "BookOpen" }, // TODO: → /industrien/bildung
    { to: "/industrien/entscheidungsinstanzen", label: "Grants & Decision-Making Bodies", icon: "Trophy" },
    { to: "/kontakt", label: "Real Estate", icon: "Building2" }, // TODO: → /industrien/immobilien
  ] as NavMenuItem[],

  featured: {
    to: "/loesungen/auswahlverfahren",
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
