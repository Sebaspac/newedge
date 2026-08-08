/**
 * Collection: Testimonials  (Strapi „Custom Post")
 * --------------------------------------------------------------
 * Editierbar UND um neue Einträge erweiterbar.
 * Strapi-Mapping: Collection Type `testimonial`.
 * --------------------------------------------------------------
 */

export interface Testimonial {
  /** Zitat-Text der Kundin/des Kunden. */
  text: string;
  /** Name der Person. */
  name: string;
  /** Rolle & Branche, z. B. „CEO, Automobilzulieferer". */
  role: string;
}

export const testimonials: Testimonial[] = [
  {
    text: "NEWEDGE completely rethought our internal processes. The AI workflows save us an enormous amount of time in our project work.",
    name: "Kathrin Mertens",
    role: "Managing Director, Event Logistics",
  },
  {
    text: "NEWEDGE's automation solutions boosted our efficiency massively. The central dashboard in particular finally gives us a clear view of our KPIs.",
    name: "Emre Yılmaz",
    role: "CEO, Automotive Supplier",
  },
  {
    text: "The implementation went remarkably smoothly. The team quickly understood our requirements and prepared the handover so our team could keep working without any frustration.",
    name: "Anna Kowalski",
    role: "Head of Marketing, E-Commerce",
  },
  {
    text: "A clear brand strategy, a professional website and end-to-end support. NEWEDGE took our external communication to a new level.",
    name: "Rocio Morales",
    role: "Managing Director & Coach",
  },
  {
    text: "With NEWEDGE we started small. Now entire campaigns run on autopilot. The team thinks like an extension of our own.",
    name: "Stefan Neuhaus",
    role: "Managing Director, IT Services",
  },
  {
    text: "Thanks to NEWEDGE we were able to get a working system up and running quickly, even without technical know-how.",
    name: "Priya Sharma",
    role: "Brand Manager, Food & Beverage",
  },
  {
    text: "Thanks to NEWEDGE we improved our online presence and measurably increased conversions.",
    name: "Aleksandar Kovačević",
    role: "E-Commerce Lead, Fashion Retail",
  },
  {
    text: "A real tech partner, not the usual agency talk. The team doesn't just think along – it delivers measurable results.",
    name: "Carolin Bruns",
    role: "COO, Tech Startup",
  },
];
