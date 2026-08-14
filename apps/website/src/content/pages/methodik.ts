/**
 * Page: Methodik  — Single Type
 * --------------------------------------------------------------
 * Inhalte der Methodik-Seite (`pages/Methodik.tsx`): Hero, Manifest,
 * die drei Phasen, das Ziel und der CTA-Block.
 * Das animierte „NEWEDGE System" ist eine eigene Section-Komponente.
 * Alle Felder sind serialisierbar (CMS-tauglich): nur Strings/Arrays/
 * Objects — kein JSX, keine Funktionen.
 * Strapi-Mapping: Single Type `methodik`.
 * --------------------------------------------------------------
 */
import type { SEOContent } from "../types";

/** Eine Entwicklungsstufe der KI-Abteilung. */
export interface Stufe {
  index: string;
  title: string;
  frage: string;
  intro: string[];
  listLabel?: string;
  list?: string[];
  outro?: string;
  ergebnis: string[];
}

/** Ein Feld des Kontakt-Formulars (Sheet). */
export interface ContactField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
}

export const methodik = {
  seo: {
    title: "KI-Einführung im Mittelstand: 3 Phasen | NEWEDGE",
    description:
      "KI im Mittelstand einführen gelingt in drei Phasen: Analyse (wo lohnt sich KI?), Umsetzung und Skalierung — bis KI zur dauerhaften Fähigkeit im Unternehmen wird.",
    canonical: "/methodik",
  } satisfies SEOContent,

  /** HERO. */
  hero: {
    /** Headline, zweizeilig (Zeilenumbruch via <br/>). */
    headlineLine1: "Wir bauen die KI-Abteilung",
    headlineLine2: "für den Mittelstand.",
    subline:
      "Nicht noch ein KI-Tool — eine operative Kapazität, die Arbeit übernimmt: Ihre eigene KI-Abteilung, die Sie mieten statt aufbauen. Der Weg dorthin: drei Phasen.",
    ctaLabel: "Kostenlose KI-Analyse anfragen",
    ctaHref: "/kontakt",
  },

  /** MANIFEST — Warum eine Methodik. */
  manifest: {
    lead: "Die meisten Unternehmen scheitern nicht an Technologie. Sie scheitern daran, dass KI isoliert eingeführt wird.",
    body: [
      "Tools werden gekauft, einzelne Automatisierungen umgesetzt. Ohne Verantwortung, Struktur und ein gemeinsames Fundament bleibt der Effekt klein.",
      "Deshalb bauen wir nicht für jedes Unternehmen neue Individualsoftware: Wir standardisieren wiederkehrende Unternehmensfunktionen — Entscheidungen und Fallprüfung, Dokumente und Prozesse, Steuerung und Reporting, Service und Fallbearbeitung — und konfigurieren sie für Ihren fachlichen Kontext. Auf derselben Infrastruktur, egal aus welcher Branche Sie kommen. Jede KI-Transformation läuft dabei in drei festen Phasen — damit aus Einzelteilen eine Abteilung wird, die Ihnen gehört.",
    ],
  },

  /** ENTWICKLUNGSSTUFEN — Die Methodik. */
  stufenSection: {
    eyebrow: "Die Methodik",
    headingLine1: "Die drei Phasen",
    headingLine2: "einer KI-Abteilung.",
    /** Ergebnis-Block-Überschrift je Stufe. */
    ergebnisLabel: "Ergebnis",
  },

  stufen: [
    {
      index: "01",
      title: "Analyse",
      frage: "Wo lohnt sich KI wirklich?",
      intro: [
        "Sie wissen, wo KI in Ihrem Unternehmen den größten Hebel hat — und in welcher Reihenfolge sich die Umsetzung lohnt. Bevor ein Euro fließt.",
        "Dafür schauen wir auf Ihr Tagesgeschäft, machen ungenutzte Potenziale sichtbar und übersetzen jeden Hebel in einen klaren Fahrplan — was zuerst, was danach.",
      ],
      listLabel: "Wir analysieren & bewerten",
      list: ["Prozesse", "Datenflüsse", "Wissensstrukturen", "Entscheidungswege", "Wiederkehrende Aufgaben", "Wirtschaftlichkeit"],
      ergebnis: ["Potenzialanalyse: was sich rechnet", "Priorisierte Handlungsfelder", "Kosten-Nutzen-Rechnung pro Vorhaben", "Klarer Fahrplan für die Umsetzung"],
    },
    {
      index: "02",
      title: "Umsetzung",
      frage: "Aus der Analyse wird ein laufendes System.",
      intro: [
        "Jetzt entsteht das Fundament: Cortex — der eine Ort, an dem Mitarbeiter, Daten, Prozesse und KI-Assistenten zusammenlaufen. Kontrolliert, sicher, transparent.",
        "Darauf bauen wir die digitalen Systeme und automatisieren die Abläufe mit dem größten Mehrwert — nach den Prioritäten aus der Analyse.",
      ],
      listLabel: "Wir bauen & automatisieren",
      list: ["Cortex als Fundament", "Kundenportale & Plattformen", "Web-Anwendungen", "Dokumentenverarbeitung", "Kundenservice", "Auswertungen & Verwaltung"],
      ergebnis: ["Zentrale Steuerung & Transparenz", "Digitale Produkte, die mitwachsen", "Weniger Handarbeit im Alltag", "Mehr Luft im Tagesgeschäft"],
    },
    {
      index: "03",
      title: "Skalierung",
      frage: "Kein Einstellen. Kein Einarbeiten. Kein Risiko.",
      intro: [
        "Sie bekommen eine voll arbeitsfähige KI-Abteilung — ohne selbst einzustellen oder einzuarbeiten. Eine Ansprechperson bei Ihnen koordiniert, dahinter steht unser Team mit fünffacher Kapazität.",
        "Alles, was wir aufbauen, gehört Ihnen: nachvollziehbar, kontrollierbar und jederzeit erweiterbar. Mit Embedded AI — unserer laufenden Betreuung — entwickeln wir Ihre KI-Abteilung kontinuierlich weiter.",
      ],
      listLabel: "Was wir übernehmen",
      list: ["Strategische Priorisierung", "Laufende Systempflege", "Potenzialerkennung & Weiterentwicklung", "Klare Regeln & Datenhoheit", "Schulung & Befähigung Ihres Teams", "Ausbau der technischen Basis"],
      outro: "Sie erhalten die Schlagkraft eines ganzen Teams zum Preis einer einzigen Stelle — dauerhaft an Ihrer Seite.",
      ergebnis: ["5× Kapazität zum Preis einer Stelle", "Keine Neueinstellungen, keine Einarbeitung", "Langfristige Unabhängigkeit & Datenhoheit", "Laufende Weiterentwicklung"],
    },
  ] as Stufe[],

  /** DAS ZIEL. */
  ziel: {
    eyebrow: "Das Ziel",
    headingLine1: "Die KI-Abteilung als",
    headingLine2: "Unternehmensfähigkeit.",
    intro: "Am Ende steht kein einzelnes Tool, sondern eine Organisation, die KI dauerhaft produktiv einsetzt. Ein Unternehmen, das:",
    punkte: [
      "Wissen schneller nutzbar macht",
      "Prozesse kontinuierlich verbessert",
      "Produktivität steigert",
      "Automatisierung systematisch vorantreibt",
      "langfristig digitale Arbeitskräfte integrieren kann",
    ],
    closing: "Aus einzelnen Projekten wird eine dauerhafte Unternehmensfähigkeit. Das ist die KI-Abteilung.",
  },

  /** CTA-Block. */
  cta: {
    eyebrow: "Bereit für Phase 01?",
    headingLine1: "Sprechen Sie",
    headingLine2: "direkt mit uns.",
    phoneHref: "tel:+4917660431467",
    phoneLabel: "+49 176 60 431 467",
  },

  /** Kontakt-Formular (Sheet). */
  contact: {
    title: "Projekt besprechen",
    description: "Erzählen Sie uns von Ihrem Projekt — wir melden uns zeitnah.",
    fields: [
      { id: "name",     label: "Name *",     type: "text",  placeholder: "Ihr Name",          required: true },
      { id: "email",    label: "E-Mail *",   type: "email", placeholder: "ihre@email.com",    required: true },
      { id: "position", label: "Position *", type: "text",  placeholder: "Ihre Position",     required: true },
      { id: "firma",    label: "Firma *",    type: "text",  placeholder: "Ihr Unternehmen",   required: true },
      { id: "telefon",  label: "Telefon",    type: "tel",   placeholder: "Ihre Telefonnummer", required: false },
    ] as ContactField[],
    message: {
      label: "Nachricht *",
      placeholder: "Erzählen Sie uns von Ihrem Projekt...",
    },
    submit: "Nachricht senden",
  },

  /** Toast-Meldungen des Kontaktformulars. */
  toast: {
    validationTitle: "Bitte prüfen Sie Ihre Angaben",
    successTitle: "Nachricht gesendet",
    successBody: "Wir melden uns bald.",
    errorTitle: "Fehler",
    errorFallback: "Das hat nicht geklappt — bitte versuchen Sie es noch einmal.",
  },
} as const;
