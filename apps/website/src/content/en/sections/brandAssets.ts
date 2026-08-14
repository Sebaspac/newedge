/**
 * Section: Brand assets  — single type (EN mirror)
 * --------------------------------------------------------------
 * Global brand images not tied to a single page: loading logo and
 * the photo inside the floating consultation button. Same shape as
 * the DE file; only strings differ.
 * Strapi mapping: single type `brand-assets-en`.
 * --------------------------------------------------------------
 */
import type { ImageKey } from "../../assets";

export const brandAssets = {
  /** Logo on the loading screen (black background → white variant).
      Same asset as the homepage loader (`home.loadingLogo`). */
  loadingLogo: {
    src: "newedge-logo-white" as ImageKey,
    alt: "NEWEDGE",
  },
  /** Photo inside the floating "free consultation" button. */
  consultAvatar: {
    src: "team-sebastian" as ImageKey,
    alt: "Sebastian Pachon — NEWEDGE",
  },
} as const;
