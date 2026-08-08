/**
 * Section-Text: Video-Showcase (Startseite, Rebrush 2026-07)
 * --------------------------------------------------------------
 * Gradient-Karte mit dem Erklärvideo (Komponente `VideoShowcaseSection`).
 * Das Video selbst (YouTube-ID + Titel) lebt weiter in `sections/hero.ts`
 * (`hero.video`) und wird dort CMS-geschattet — hier liegt nur das
 * Section-Chrome. Serialisierbar (nur Strings) — CMS-tauglich.
 * Noch NICHT als Strapi-Feld angelegt (neuer Top-Level-Key wäre im
 * Home-Single-Type zu ergänzen; bis dahin greift der statische Fallback).
 * --------------------------------------------------------------
 */

export const videoShowcase = {
  heading: "NEWEDGE in Aktion.",
  sub: "Wie aus einzelnen KI-Tools eine funktionierende KI-Abteilung wird — kompakt erklärt im Video.",
  /** Primärer CTA → /ki-audit. */
  ctaPrimary: { label: "KI-Potenzial berechnen", to: "/ki-audit" },
  /** Sekundärer CTA → öffnet Kontakt-Dialog. */
  ctaSecondary: { label: "Kostenlose Analyse" },
} as const;
