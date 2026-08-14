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
    text: "NEWEDGE hat unsere internen Abläufe komplett neu gedacht. Mit den KI-Workflows sparen wir im Projektgeschäft enorm viel Zeit.",
    name: "Kathrin Mertens",
    role: "Geschäftsführerin, Eventlogistik",
  },
  {
    text: "Die Automatisierungen von NEWEDGE haben unsere Effizienz massiv gesteigert. Das zentrale Dashboard gibt uns endlich einen klaren Blick auf unsere KPIs.",
    name: "Emre Yılmaz",
    role: "CEO, Automobilzulieferer",
  },
  {
    text: "Die Implementierung lief erstaunlich reibungslos. Das Team hat schnell verstanden, was wir brauchen — und die Übergabe so vorbereitet, dass wir ohne Frust weiterarbeiten konnten.",
    name: "Anna Kowalski",
    role: "Head of Marketing, E-Commerce",
  },
  {
    text: "Klare Markenstrategie, professionelle Website und durchgängige Begleitung. NEWEDGE hat unsere Außenkommunikation auf ein neues Niveau gehoben.",
    name: "Rocio Morales",
    role: "Geschäftsführerin & Coach",
  },
  {
    text: "Mit NEWEDGE haben wir zuerst klein gestartet. Inzwischen laufen komplette Kampagnen automatisiert. Das Team denkt wie ein verlängerter Arm unseres eigenen Teams.",
    name: "Stefan Neuhaus",
    role: "Geschäftsführer, IT-Dienstleistungen",
  },
  {
    text: "Dank NEWEDGE konnten wir auch ohne technisches Verständnis schnell ein funktionierendes System umsetzen.",
    name: "Priya Sharma",
    role: "Brand Managerin, Food & Beverage",
  },
  {
    text: "Durch NEWEDGE konnten wir unseren Online-Auftritt verbessern und die Conversion messbar steigern.",
    name: "Aleksandar Kovačević",
    role: "E-Commerce Lead, Fashion Retail",
  },
  {
    text: "Ein echter Tech-Partner, kein klassisches Agentur-Blabla. Das Team denkt nicht nur mit, sondern liefert messbare Ergebnisse.",
    name: "Carolin Bruns",
    role: "COO, Tech-Startup",
  },
];
