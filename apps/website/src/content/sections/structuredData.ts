/**
 * Section-Daten: Structured Data / SEO JSON-LD (Singleton, global)
 * --------------------------------------------------------------
 * Reine Daten-Literale für die schema.org-JSON-LD-Schemas, die die
 * Komponente `StructuredData` in `<script type="application/ld+json">`
 * einbettet (Organization, WebSite, FAQPage + Service-Schemas je Route).
 *
 * Hier liegt NUR der Inhalt (Name, Beschreibung, Adresse, Kontakt,
 * Service-Texte, FAQ-Q&As, Preise …). Die Schema-Assembly samt
 * struktureller schema.org-Schlüssel (`@context`, `@type`, `@id`),
 * Geo-Koordinaten und die Routen-Auswahllogik bleiben in der Komponente.
 *
 * Routen-Keys (z. B. "/ki-audit") sind Logik (Auswahl per `currentPath`)
 * und bleiben erhalten; ihre Textwerte (name/description) sind Inhalt.
 *
 * Alle Werte sind serialisierbar (CMS-tauglich): nur Strings/Numbers/
 * Arrays/Objects — kein JSX, keine Funktionen. Strapi-Mapping:
 * Single Type `structured-data`.
 * --------------------------------------------------------------
 */

/** Ein Service-Eintrag im OfferCatalog (Name + Beschreibung). */
export interface OfferServiceText {
  name: string;
  description: string;
}

/** Ein OfferCatalog-Block mit Titel und enthaltenen Services. */
export interface OfferCatalogText {
  name: string;
  services: OfferServiceText[];
}

/** Eine FAQ-Frage samt Antwort (FAQPage). */
export interface FaqEntry {
  question: string;
  answer: string;
}

/** Textdaten eines routen-spezifischen Service-Schemas. */
export interface ServiceSchemaText {
  name: string;
  description: string;
  serviceType: string;
  category: string[];
  offer: {
    priceCurrency: string;
    price: string;
    description: string;
  };
}

export const structuredData = {
  /** Organization / LocalBusiness / ProfessionalService. */
  organization: {
    name: "NEWEDGE Brand",
    alternateName: "NEWEDGE",
    url: "https://newedgebrand.com",
    logo: "https://newedgebrand.com/logo.png",
    description:
      "NEWEDGE baut die KI-Abteilung für den Mittelstand – von der ersten Analyse über den sicheren KI-Einstiegspunkt Cortex bis zum laufenden Betrieb von Automatisierungen. Aus München, für den DACH-Raum.",
    foundingLocation: "München, Deutschland",
    knowsAbout: [
      "Künstliche Intelligenz im Mittelstand",
      "KI-Abteilung",
      "KI-Readiness und ROI-Analyse",
      "KI-Automatisierung",
      "Prozessautomatisierung",
      "Large Language Models",
      "RAG-Systeme",
      "Custom AI Agents",
      "Datenhoheit und DSGVO-konforme KI",
      "Förderfähige KI-Beratung",
    ],
    address: {
      addressLocality: "München",
      addressRegion: "Bayern",
      addressCountry: "DE",
    },
    areaServed: [
      { type: "City", name: "München" },
      { type: "State", name: "Bayern" },
      { type: "Country", name: "Deutschland" },
    ],
    email: "info@newedgebrand.com",
    sameAs: ["https://www.linkedin.com/company/new-edge-brand/"],
    offerCatalogName: "Leistungen",
    /** Verschachtelte OfferCatalogs (KI-Abteilung aufbauen / betreiben) mit Services. */
    offerCatalogs: [
      {
        name: "KI-Abteilung aufbauen",
        services: [
          {
            name: "KI-Readiness & ROI-Analyse",
            description: "Kostenlose Analyse, die zeigt, wo sich KI in Ihrem Unternehmen zuerst lohnt – mit Aufwand-Nutzen-Schätzung und Förderhinweis.",
          },
          {
            name: "Cortex – sicherer KI-Einstiegspunkt",
            description: "Die gemeinsame Betriebsebene für KI: ein zentraler, DSGVO-konformer Zugang für Ihre Mitarbeiter – mit Unternehmenswissen, Berechtigungen, Integrationen und nachvollziehbarem Betrieb.",
          },
          {
            name: "KI-Audit",
            description: "Tiefen-Audit der größten Hebel: die drei Prozesse mit dem höchsten KI-Nutzen, priorisiert und mit klarem Fahrplan. Oft förderfähig.",
          },
        ],
      },
      {
        name: "KI betreiben & skalieren",
        services: [
          {
            name: "Prozessautomatisierung",
            description: "Wir automatisieren die Abläufe, die Ihr Wachstum bremsen – von der Angebotserstellung bis zum Kundensupport.",
          },
          {
            name: "Embedded AI & digitale Arbeitskräfte",
            description: "Wir verankern KI dauerhaft in Ihren Prozessen und übernehmen Verantwortung für den laufenden Betrieb.",
          },
          {
            name: "RAG-Systeme & Wissensmanagement",
            description: "Ihr Firmenwissen wird durchsuchbar und für KI nutzbar – sicher im eigenen Haus.",
          },
        ],
      },
    ] as OfferCatalogText[],
  },

  /** WebSite (nur Homepage). */
  website: {
    url: "https://newedgebrand.com",
    name: "NEWEDGE – Die KI-Abteilung für den Mittelstand",
    description:
      "NEWEDGE baut die KI-Abteilung für den Mittelstand: von der kostenlosen KI-Analyse über den sicheren Einstiegspunkt Cortex bis zu laufenden Automatisierungen. Aus München.",
    inLanguage: "de-DE",
  },

  /** FAQPage (nur Homepage). */
  faq: [
    {
      question: "Was ist NEWEDGE?",
      answer: "NEWEDGE baut die KI-Abteilung für den Mittelstand. Wir helfen Unternehmen mit 5–150 Mitarbeitenden, KI produktiv einzusetzen – von der ersten kostenlosen Analyse über den sicheren Einstiegspunkt Cortex bis zum laufenden Betrieb von Automatisierungen. Aus München.",
    },
    {
      question: "Was kostet eine Website bei NEWEDGE Brand?",
      answer: "Website-Projekte starten ab €2.240. Umfang und Preis werden individuell auf die Anforderungen des Unternehmens zugeschnitten.",
    },
    {
      question: "Ist die KI-Beratung von NEWEDGE Brand förderfähig?",
      answer: "Ja, unsere KI-Beratungsleistungen sind über das BAFA-Förderprogramm förderfähig.",
    },
    {
      question: "Was ist ein KI-Audit?",
      answer: "Beim KI-Audit finden wir die Prozesse in Ihrem Unternehmen, bei denen sich KI zuerst lohnt, schätzen Aufwand und Nutzen und liefern einen klaren Fahrplan mit den größten Hebeln. Der Einstieg ist oft förderfähig.",
    },
    {
      question: "Welche KI-Technologien setzt NEWEDGE Brand ein?",
      answer: "Wir arbeiten mit Large Language Models (LLMs), RAG-Systemen (Retrieval Augmented Generation), Custom AI Agents, Automatisierungs-Frameworks und modernen Web-Technologien wie React und TypeScript.",
    },
  ] as FaqEntry[],

  /**
   * Routen-spezifische Service-Schemas (Textdaten je Pfad).
   * Routen-Keys sind Logik (Auswahl per `currentPath`); Werte sind Inhalt.
   */
  serviceSchemas: {
    "/ki-audit": {
      name: "KI-Audit für den Mittelstand",
      description: "Strukturierter KI-Audit: Wir finden die Prozesse mit dem größten KI-Nutzen, schätzen Aufwand und Nutzen und liefern einen klaren Fahrplan. Oft förderfähig (BAFA) ab 448 €.",
      serviceType: "ProfessionalService",
      category: ["KI-Audit", "KI-Beratung", "Prozessanalyse", "KI-Readiness"],
      offer: {
        priceCurrency: "EUR",
        price: "448",
        description: "Ab 448 € mit BAFA-Förderung (bis 80 % förderfähig)",
      },
    },
    "/cortex": {
      name: "Cortex – sicherer KI-Einstiegspunkt für den Mittelstand",
      description: "Cortex ist die gemeinsame Betriebsebene für KI in Ihrem Unternehmen: ein zentraler, DSGVO-konformer Einstiegspunkt für alle Mitarbeiter, der Unternehmenswissen, Berechtigungen, Integrationen und Automatisierungen zusammenführt – mit voller Kontrolle über Nutzung und Daten.",
      serviceType: "ProfessionalService",
      category: ["KI-Plattform", "KI-Infrastruktur", "DSGVO-konforme KI", "Datenhoheit"],
      offer: {
        priceCurrency: "EUR",
        price: "0",
        description: "Einrichtung kostenlos, danach monatlicher Betrieb",
      },
    },
  } as Record<string, ServiceSchemaText>,
} as const;
