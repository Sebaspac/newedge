/**
 * Section: Brand-Assets  — Single Type
 * --------------------------------------------------------------
 * Globale Marken-Bilder, die nicht zu einer einzelnen Seite gehören:
 * Loading-Logo und das Foto im schwebenden Erstgespräch-Button.
 * Bilder per stabilem `ImageKey` (→ `img(key)`); im CMS kann statt
 * eines Keys auch eine hochgeladene Media-URL (/uploads/…) stehen —
 * `img()` reicht URLs unverändert durch.
 * Strapi-Mapping: Single Type `brand-assets`.
 * --------------------------------------------------------------
 */
import type { ImageKey } from "../assets";

export const brandAssets = {
  /** Logo im Lade-Screen (schwarzer Hintergrund → weiße Variante).
      Identisch zum Loader der Startseite (`home.loadingLogo`). */
  loadingLogo: {
    src: "newedge-logo-white" as ImageKey,
    alt: "NEWEDGE",
  },
  /** Foto im schwebenden „Kostenloses Erstgespräch"-Button. */
  consultAvatar: {
    src: "team-sebastian" as ImageKey,
    alt: "Sebastian Pachon — NEWEDGE",
  },
} as const;
