/**
 * Section-Text: Navigation (Singleton, global)
 * --------------------------------------------------------------
 * Desktop-Mega-Menu + Mobile-Menu (Komponente `MobileNavigation`).
 * Icons als Name-Strings → über die Icon-Registry austauschbar.
 * Strapi-Mapping: Single Type `navigation`.
 * --------------------------------------------------------------
 */
import type { ImageKey } from "../assets";
import type { IconName } from "../icons";

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

  filterButtons: [{ key: "all", label: "Alle" }] as FilterButton[],

  megaMenu: {
    trigger: "Lösungen",
    painPointsHeading: "Nach Herausforderung",
    industrienHeading: "Nach Branche",
    featuredHeading: "Success Story",
  },

  /**
   * „Nach Herausforderung" = die vier wiederverwendbaren Operations Blueprints.
   * Sie sind das Produkt; Branchen sind nur Konfigurationen davon.
   *
   * Extern (hier sichtbar)          Intern / Investorensprache
   * ──────────────────────────────  ──────────────────────────
   * Entscheidungen & Fallprüfung    Decision Operations
   * Dokumente & Prozesse            Document Operations
   * Steuerung & Reporting           Management Intelligence
   * Service & Fallbearbeitung       Service Operations
   *
   * Bewusst NICHT „Painpoints" (interner Begriff) und bewusst ohne „mit KI":
   * KI ist das Prinzip aller Blueprints, nicht ein einzelner Anwendungsfall.
   * „Compliance" ist ebenfalls raus — es ist ein Anwendungsfall von Document
   * Operations, keine eigene Kategorie.
   *
   * Die Slugs bleiben unverändert, damit bestehende Links und Rankings halten.
   */
  painPoints: [
    { to: "/loesungen/auswahlverfahren", label: "Entscheidungen & Fallprüfung", icon: "Award" },
    { to: "/loesungen/compliance", label: "Dokumente & Prozesse", icon: "FileCheck" },
    { to: "/loesungen/kpi-dashboard", label: "Steuerung & Reporting", icon: "BarChart3" },
    { to: "/loesungen/ki-kundensupport", label: "Service & Fallbearbeitung", icon: "Headphones" },
  ] as NavMenuItem[],

  /**
   * „Nach Branche" = Vertical Profiles, KEINE eigenen Produkte. Jede Branche ist
   * eine Konfiguration derselben vier Blueprints oben — ein Versicherer kann alle
   * vier gleichzeitig nutzen. Expandiert wird nach Prozessähnlichkeit, nicht mit
   * neuer Individualsoftware je Branche.
   *
   * ACHTUNG bei den Links: Ein unbekannter Slug führt NICHT auf 404, sondern
   * fällt in PainPointAuswahlverfahren.tsx auf `defaultPainPoint` zurück —
   * /industrien/versicherungen würde also die Auswahlverfahren-Seite unter
   * falscher URL ausliefern. Deshalb hier keine erfundenen Slugs.
   *
   * TODO(branchenseiten): Versicherungen, Bildung und Immobilien haben noch
   * keine eigene Seite und zeigen vorläufig auf /kontakt. Sobald die Seiten in
   * painPoints.ts liegen, hier auf /industrien/<slug> umstellen.
   */
  industrien: [
    { to: "/kontakt", label: "Versicherungen", icon: "Shield" }, // TODO: → /industrien/versicherungen
    { to: "/kontakt", label: "Bildung", icon: "BookOpen" }, // TODO: → /industrien/bildung
    { to: "/industrien/entscheidungsinstanzen", label: "Förderungen & Entscheidungsinstanzen", icon: "Trophy" },
    { to: "/kontakt", label: "Immobilien", icon: "Building2" }, // TODO: → /industrien/immobilien
  ] as NavMenuItem[],

  /**
   * Der BMP-Case ist nicht „ein Award-Projekt", sondern der erste reale Proof
   * des Blueprints „Entscheidungen & Fallprüfung". Der Titel nennt bewusst das
   * externe Label — „Decision Operations" ist Investorensprache und gehört
   * nicht auf die Website. Die frühere Aussage „70 % weniger Aufwand" ist
   * entfernt — sie war durch keinen dokumentierten Kunden-KPI belegt
   * (2026-08 auch aus resultJourney.ts und collections/miniCases.ts entfernt).
   */
  featured: {
    to: "/loesungen/auswahlverfahren",
    image: { src: "team-sebastian" as ImageKey, alt: "NEWEDGE Team" },
    title: "BMP Award — Entscheidungen & Fallprüfung im Einsatz",
    desc: "275 Bewerbungen pro Auswahlzyklus — strukturiert geprüft, aufbereitet und für die Jury nachvollziehbar zusammengeführt.",
    cta: "Case ansehen →",
  },

  /**
   * Oberste Ebene, beantwortet „Was bietet NEWEDGE grundsätzlich an?".
   * Führt auf /methodik — dort stehen die drei Phasen einer KI-Abteilung.
   */
  angebot: { to: "/methodik", label: "Ihre KI-Abteilung" } as NavLinkItem,


  /** Desktop-CTA-Button + Kontakt-Link. */
  cta: { label: "Erstgespräch", calendly: "/kontakt" },

  mobile: {
    toggleAria: "Toggle menu",
    contactButton: "Kontakt aufnehmen",
  },
};
