/**
 * Page: Careers (Karriere)  — Single Type
 * --------------------------------------------------------------
 * Inhalte der Karriere-Seite (`pages/Careers.tsx`): SEO, Hero,
 * „Über uns"- und „Warum NEWEDGE"-Block, Werte-Karten, Sektion
 * „Offene Positionen" (Kopf), Initiativbewerbungs-CTA und der
 * Kontakt-Block (Wenjamin). Die Stellen selbst liegen separat in
 * `collections/jobs.ts` und werden hier NICHT dupliziert.
 *
 * Bilder werden per stabilem `ImageKey` referenziert (→ `img(key)`).
 * Icons sind hier keine — die Glyphen ▸/↗ sind dekorative
 * Schriftzeichen im Markup. Strapi-Mapping: Single Type `careers`.
 * --------------------------------------------------------------
 */
import type { SEOContent } from "@/content/types";
import type { ImageKey } from "@/content/assets";

/** Eine Werte-/„Was dich erwartet"-Karte. */
interface ValueCard {
  /** Nummern-Label, z. B. "01". */
  label: string;
  title: string;
  desc: string;
}

export const careers = {
  seo: {
    title: "AI Jobs & Careers in the Mittelstand | NEWEDGE Munich",
    description:
      "Work at NEWEDGE, the AI department for mid-sized companies in Munich: roles for designers, developers and AI strategists — speculative applications welcome.",
    canonical: "/en/careers",
  } satisfies SEOContent,

  /** Hero-Bereich (Aurora). */
  hero: {
    headline: "Careers.",
    subline:
      "We're looking for designers, developers and strategists who want to create real impact with brand, technology and AI.",
  },

  /** „Über uns"-Absatz. */
  about: {
    eyebrow: "About us",
    body:
      "NEWEDGE builds the AI department for mid-sized companies. We connect brand, strategy and AI — with clear ownership and measurable results.",
  },

  /** „Warum NEWEDGE"-Block + Werte-Karten. */
  why: {
    eyebrow: "Why NEWEDGE",
    heading: "What to expect.",
    values: [
      {
        label: "01",
        title: "Innovation First",
        desc: "Work with current AI technologies from day one — on real client projects.",
      },
      {
        label: "02",
        title: "Work-Life Balance",
        desc: "Flexible hours, remote options and room for your life outside of work.",
      },
      {
        label: "03",
        title: "Growth",
        desc: "Continuous learning, conference visits and a personal development budget.",
      },
    ] as ValueCard[],
  },

  /** Sektion „Offene Positionen" — nur Kopf; Stellen aus `jobs`. */
  positions: {
    eyebrow: "Positions",
    heading: "Open positions.",
    intro:
      "Send us your application (CV + short cover letter) directly via the button.",
    /** Beschriftung des Bewerben-Buttons je Stelle (mit Glyphe ↗). */
    applyLabel: "Apply now ↗",
  },

  /** Initiativbewerbungs-CTA (dunkel) inkl. Wenjamin-Kreis. */
  cta: {
    eyebrow: "Nothing that fits?",
    heading: "Speculative application.",
    body:
      "Write to Wenjamin Zabezhanskiy directly and tell us what drives you.",
    /** Kontaktperson im Kreis-Button. */
    person: {
      src: "team-wenjamin" as ImageKey,
      alt: "Wenjamin Zabezhanskiy — speculative application",
      mailto: "mailto:wenjamin.z@newedgebrand.com",
    },
    /** Rotierender Text im SVG-Ring (textPath). */
    ringText: "APPLY NOW · APPLY NOW · ",
  },

  /** Kontakt-Link für den Kontakt-Trigger der Mobile-Navigation. */
  calendly: "/kontakt",
} as const;
