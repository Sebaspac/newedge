/**
 * Page: Pain Point / Industrie-Landingpage  — Single Type (Seiten-Rahmen)
 * --------------------------------------------------------------
 * Statische, seiteneigene Texte des Landingpage-Templates
 * (`pages/PainPointAuswahlverfahren.tsx`): Section-Labels, fixe
 * Überschriften, der Datensouveränitäts-Block, Mini-Case-Rahmen,
 * FAQ-Rahmen und der CTA-Block.
 *
 * WICHTIG — Abgrenzung: Der DYNAMISCHE, slug-abhängige Inhalt
 * (Hero, Features, Vergleichszeilen, FAQ-Einträge, Mini-Cases …)
 * kommt unverändert aus `@/content/painPoints` (`painPoints` /
 * `DEFAULT_PAIN_POINT`) und wird hier NICHT dupliziert. Dieses Modul
 * enthält ausschließlich die Seiten-Literale, die im Template fest
 * verdrahtet sind.
 *
 * Bilder werden per stabilem `ImageKey` referenziert (→ `img(key)`).
 * Dekorative Inline-Glyphen (✓ ✗ „ ↗, lucide Plus/Check/ArrowRight)
 * bleiben im Markup. Alle Werte sind serialisierbar (CMS-tauglich).
 * Strapi-Mapping: Single Type `pain-point-page` (Template-Rahmen).
 * --------------------------------------------------------------
 */
import type { ImageKey } from "@/content/assets";

export const painPointPage = {
  /** Bild-Bindings des Templates (Registry-Keys). */
  images: {
    /** Hero — Vorher/Nachher-Visual (dunkel). */
    hero: "painpoint-a-vorher-nachher",
    /** Feature 01 + erstes Mini-Case-Bild. */
    feature1: "painpoint-a-section3",
    /** Feature 02 + zweites Mini-Case-Bild. */
    feature2: "painpoint-a-feature2",
    /** Feature 03 + drittes Mini-Case-Bild. */
    feature3: "painpoint-a-feature3",
    /** Default-Karten-Icons (Bildplatzhalter, zyklisch). */
    cardIconAnalyse: "painpoint-a-icon-analyse",
    cardIconKoordination: "painpoint-a-icon-koordination",
    cardIconInsights: "painpoint-a-icon-insights",
  } satisfies Record<string, ImageKey>,

  /** Externer Logo-Streifen — nicht in der Bild-Registry (Pfad-String). */
  integrationsLogosSrc: "/uploads/integrations-logos.png",

  /** Fixe Section-Labels (Eyebrows) des Templates. */
  labels: {
    definition: "Definition",
    feature01: "Feature 01",
    feature02: "Feature 02",
    feature03: "Feature 03",
    integrationen: "Integrations",
    vergleich: "Comparison",
    kernfunktionen: "Core features",
    datensouveraenitaet: "Data sovereignty",
    casesProPhase: "Cases from practice",
    faq: "FAQ",
  },

  /** Vergleichstabelle — fixe Spaltenköpfe (slug-unabhängig). */
  compare: {
    headCriterion: "Criterion",
    headNewEdge: "NEWEDGE",
  },

  /** Datensouveränitäts-Block (statisch). */
  datensouveraenitaet: {
    heading: "No data ever leaves your house.",
    body:
      "Every system can run locally or in your private cloud. Your documents never train anyone else's models. What we build belongs to you: data, processes, knowledge base.",
    facts: [
      "GDPR-compliant by design, DPA included",
      "Hosting on-premises, private cloud or EU data center",
      "No use of your data for third-party training",
      "Audit-proof trail for every action",
    ],
    /** Beschriftungen des SVG-Schemas. */
    schema: {
      ariaLabel: "Diagram: data stays inside your infrastructure",
      infrastruktur: "YOUR INFRASTRUCTURE",
      ihreDaten: "YOUR DATA",
      kiAgent: "AI AGENT",
      extern: "× EXTERNAL",
    },
  },

  /** Mini-Cases — fixer Rahmen (Einträge selbst kommen aus painPoints). */
  miniCases: {
    headline: "Here's what that looks like in practice.",
    sub: "Three cases from this solution area — from real projects to example scenarios.",
    cta: "View case",
  },

  /** FAQ — fixe Begleittexte (Fragen/Antworten kommen aus painPoints). */
  faq: {
    /** Überschrift in zwei Zeilen (durch <br /> getrennt). */
    headingLine1: "Got questions?",
    headingLine2: "We've got answers.",
    cta: "Get in touch",
    ctaHref: "/kontakt",
  },

  /** Abschluss-CTA (dunkel). */
  cta: {
    eyebrow: "Ready to get started?",
    /** Überschrift in zwei Zeilen (durch <br /> getrennt). */
    headingLine1: "Talk to us",
    headingLine2: "directly.",
    phone: {
      label: "+49 176 60 431 467",
      href: "tel:+4917660431467",
    },
  },
} as const;
