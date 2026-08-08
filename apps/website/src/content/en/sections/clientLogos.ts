/**
 * Section: Client Logos (Logo-Cloud)
 * --------------------------------------------------------------
 * Kundenlogos für die Logo-Cloud (Startseite) und den Pain-Point-
 * Hero-Ticker. Bilder per stabilem `ImageKey` → über die Registry
 * austauschbar. Überschrift inline.
 * Strapi-Mapping: Single Type `clientLogos` (Media-Repeatable).
 * --------------------------------------------------------------
 */
import type { ImageKey } from "@/content/assets";

export interface ClientLogo {
  src: ImageKey;
  alt: string;
  /** Optionale Sonderhöhe in px (Default 56 in der Logo-Cloud). */
  height?: number;
}

/** Überschrift über der Logo-Cloud (`lead` + violett hervorgehobenes `highlight`). */
export const clientLogosHeading = {
  lead: "Trusted by",
  highlight: "50+ companies",
};

export const clientLogos: ClientLogo[] = [
  { src: "logo-sadie-kessler", alt: "Sadie Kessler" },
  { src: "logo-circle-photo", alt: "The Circle Photo Studio" },
  { src: "logo-hyde-official", alt: "Hyde Official" },
  { src: "logo-albanova-consulting", alt: "AlbaNova Consulting" },
  { src: "logo-darius-company", alt: "Darius Company" },
  { src: "logo-muse-studio", alt: "Muse Music Studio" },
  { src: "logo-bmp-2026", alt: "Bavarian Mittelstand Award 2026", height: 48 },
  { src: "logo-dr-aaron-loeb", alt: "Dr Aaron Loeb" },
  { src: "logo-club-cli", alt: "Club Cli" },
  { src: "logo-pure-design", alt: "Pure Design Studio" },
  { src: "logo-becoming-you", alt: "Becoming You" },
  { src: "logo-seabreeze", alt: "Seabreeze Beach Club" },
  { src: "logo-elite-aesthetic", alt: "Elite Aesthetic" },
];
