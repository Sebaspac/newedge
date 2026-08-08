/**
 * Page: Contact (Kontakt) — Single Type
 * --------------------------------------------------------------
 * Eigene Kontaktseite (Rebrush 2026-07, Referenz-Layout: Video links,
 * Formular rechts, ein einziger Schritt — kein Multi-Step-Wizard).
 * Formularfelder/-labels kommen weiter aus `contactFormModal` (geteilt
 * mit dem Dialog auf anderen Seiten); hier liegt nur das Seiten-Chrome.
 * `hero` + `video` sind noch NICHT als Strapi-Felder angelegt (statischer
 * Fallback greift immer — bewusst NICHT über `useCms` geladen, damit ein
 * unvollständiger CMS-Eintrag diese Felder nicht überschreibt).
 * Strapi-Mapping: Single Type `contact` (nur `seo` ist live CMS-fähig).
 * --------------------------------------------------------------
 */
import type { SEOContent } from "../types";

export const contact = {
  seo: {
    title: "Kontakt & kostenloses KI-Erstgespräch | NEWEDGE München",
    description:
      "Kontaktieren Sie NEWEDGE, die KI-Abteilung für den Mittelstand: kostenloses, unverbindliches KI-Erstgespräch in München — Antwort in einem Werktag.",
    canonical: "/kontakt",
  } satisfies SEOContent,

  hero: {
    headline: "Lassen Sie uns sprechen.",
    sub: "Erzählen Sie uns von Ihrem Unternehmen — wir melden uns innerhalb eines Werktags mit den nächsten Schritten.",
  },

  /** Portrait-Video links (Poster + Play, echtes Video folgt separat). */
  video: {
    /** Medien-Slot: wird im CMS unter „Bild austauschen" → contact-reel
        befüllt. Solange kein Video hochgeladen ist, zeigt die Seite das
        Standbild (poster) mit Play-Badge. */
    src: "contact-reel",
    poster: "team-sebastian",
    posterAlt: "Sebastian Pachon, Gründer & Geschäftsführer NEWEDGE",
    caption: "Kurzer Realtalk von Sebastian, Co-Founder.",
  },
} as const;
