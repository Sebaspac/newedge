/**
 * Geteilte Content-Typen
 * --------------------------------------------------------------
 * Querschnittliche Interfaces, die mehrere Content-Module nutzen.
 * Collection-spezifische Typen (Testimonial, Job) liegen bei ihren
 * Daten in `collections/`. Alle Typen sind serialisierbar (CMS-tauglich):
 * nur Strings/Numbers/Arrays/Objects — kein JSX, keine Funktionen.
 * --------------------------------------------------------------
 */
import type { ImageKey } from "./assets";
import type { IconName } from "./icons";

/** SEO-Kopfdaten einer Seite (→ `SEOHead`). */
export interface SEOContent {
  title: string;
  description: string;
  /** Kanonischer Pfad, z. B. "/" oder "/careers". */
  canonical?: string;
  /** Optionales OG-Bild (Key oder absoluter Pfad). */
  ogImage?: string;
}

/** Call-to-Action / Link mit Beschriftung. */
export interface CTA {
  label: string;
  href: string;
}

/** Referenziertes Bild mit Alt-Text. */
export interface ImageRef {
  src: ImageKey;
  alt: string;
}

/** Karte mit Icon + Titel + Text (Feature-/Service-Karten). */
export interface IconCard {
  icon: IconName;
  title: string;
  description: string;
}
