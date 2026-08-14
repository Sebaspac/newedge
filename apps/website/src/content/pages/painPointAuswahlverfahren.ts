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
import type { ImageKey } from "../assets";

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
    integrationen: "Integrationen",
    vergleich: "Vergleich",
    kernfunktionen: "Kernfunktionen",
    datensouveraenitaet: "Datensouveränität",
    casesProPhase: "Cases aus der Praxis",
    faq: "FAQ",
  },

  /** Vergleichstabelle — fixe Spaltenköpfe (slug-unabhängig). */
  compare: {
    headCriterion: "Kriterium",
    headNewEdge: "NEWEDGE",
  },

  /** Datensouveränitäts-Block (statisch). */
  datensouveraenitaet: {
    heading: "Keine Daten verlassen Ihr Haus.",
    body:
      "Jedes System lässt sich lokal oder in Ihrer privaten Cloud betreiben. Ihre Dokumente trainieren keine fremden Modelle. Was wir bauen, gehört Ihnen: Daten, Prozesse, Wissensbasis.",
    facts: [
      "DSGVO-konform by design, AVV inklusive",
      "Hosting lokal, private Cloud oder EU-Rechenzentrum",
      "Keine Trainingsnutzung Ihrer Daten durch Dritte",
      "Revisionssicherer Audit-Trail für jede Aktion",
    ],
    /** Beschriftungen des SVG-Schemas. */
    schema: {
      ariaLabel: "Schema: Daten bleiben in Ihrer Infrastruktur",
      infrastruktur: "IHRE INFRASTRUKTUR",
      ihreDaten: "IHRE DATEN",
      kiAgent: "KI-AGENT",
      extern: "× EXTERN",
    },
  },

  /** Mini-Cases — fixer Rahmen (Einträge selbst kommen aus painPoints). */
  miniCases: {
    headline: "So sieht das in der Praxis aus.",
    sub: "Drei Cases aus diesem Anwendungsfeld — vom realen Projekt bis zum Beispiel-Szenario.",
    cta: "Case ansehen",
  },

  /** FAQ — fixe Begleittexte (Fragen/Antworten kommen aus painPoints). */
  faq: {
    /** Überschrift in zwei Zeilen (durch <br /> getrennt). */
    headingLine1: "Sie haben Fragen?",
    headingLine2: "Wir haben Antworten.",
    cta: "Kontakt aufnehmen",
    ctaHref: "/kontakt",
  },

  /** Abschluss-CTA (dunkel). */
  cta: {
    eyebrow: "Bereit loszulegen?",
    /** Überschrift in zwei Zeilen (durch <br /> getrennt). */
    headingLine1: "Sprechen Sie",
    headingLine2: "direkt mit uns.",
    phone: {
      label: "+49 176 60 431 467",
      href: "tel:+4917660431467",
    },
  },
  /** Alt-Text des NEWEDGE-Charakters (Platzhalter, solange kein Ergebnis-Motiv registriert ist). */
  characterAlt: "NEWEDGE-Charakter präsentiert die Erklärung",
} as const;
