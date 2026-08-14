/**
 * Section-Text: Testimonials-Abschnitt (Singleton)
 * --------------------------------------------------------------
 * Überschrift & Labels des wiederverwendeten Testimonials-Abschnitts.
 * Die Einträge selbst liegen in `collections/testimonials`.
 * Strapi-Mapping: Teil eines „Sections"/„UI-Strings"-Single-Types.
 * --------------------------------------------------------------
 */

export interface TestimonialsSectionContent {
  /** Kleine Eyebrow-Zeile über der Headline. */
  eyebrow: string;
  /** Headline-Teil vor dem hervorgehobenen Wort. */
  headlineLead: string;
  /** Violett hervorgehobenes Wort in der Headline. */
  headlineHighlight: string;
  /** Headline-Teil nach dem hervorgehobenen Wort. */
  headlineTail: string;
  /** aria-label „zurück". */
  prevLabel: string;
  /** aria-label „weiter". */
  nextLabel: string;
}

export const testimonialsSection: TestimonialsSectionContent = {
  eyebrow: "Testimonials",
  headlineLead: "What our",
  headlineHighlight: "clients",
  headlineTail: "say",
  prevLabel: "Previous testimonial",
  nextLabel: "Next testimonial",
};
