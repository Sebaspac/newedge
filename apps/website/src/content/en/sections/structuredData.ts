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
      "NEWEDGE builds the AI department for mid-sized companies – from the first analysis through Cortex, the secure entry point for AI, to running automations day to day. From Munich, for the DACH region.",
    foundingLocation: "Munich, Germany",
    knowsAbout: [
      "Artificial Intelligence for mid-sized companies",
      "AI department",
      "AI readiness and ROI analysis",
      "AI Automation",
      "Process Automation",
      "Large Language Models",
      "RAG Systems",
      "Custom AI Agents",
      "Data sovereignty and GDPR-compliant AI",
      "AI consulting eligible for government funding",
    ],
    address: {
      addressLocality: "München",
      addressRegion: "Bayern",
      addressCountry: "DE",
    },
    areaServed: [
      { type: "City", name: "Munich" },
      { type: "State", name: "Bavaria" },
      { type: "Country", name: "Germany" },
    ],
    email: "info@newedgebrand.com",
    sameAs: ["https://www.linkedin.com/company/new-edge-brand/"],
    offerCatalogName: "Services",
    /** Verschachtelte OfferCatalogs (KI-Abteilung aufbauen / betreiben) mit Services. */
    offerCatalogs: [
      {
        name: "Build your AI department",
        services: [
          {
            name: "AI Readiness & ROI Analysis",
            description: "A free analysis that shows where AI pays off first in your company – with effort-benefit estimates and a funding note.",
          },
          {
            name: "Cortex – secure AI entry point",
            description: "The shared operating layer for AI: one central, GDPR-compliant access point for your staff – with company knowledge, permissions, integrations and traceable operations.",
          },
          {
            name: "AI Audit",
            description: "A deep audit of your biggest levers: the three processes with the highest AI value, prioritized with a clear plan. Often eligible for funding.",
          },
        ],
      },
      {
        name: "Run & scale AI",
        services: [
          {
            name: "Process Automation",
            description: "We automate the workflows that slow your growth – from quoting to customer support.",
          },
          {
            name: "Embedded AI & digital workers",
            description: "We anchor AI in your processes for the long term and take ownership of running it.",
          },
          {
            name: "RAG Systems & Knowledge Management",
            description: "Your company knowledge becomes searchable and usable for AI – securely, in-house.",
          },
        ],
      },
    ] as OfferCatalogText[],
  },

  /** WebSite (nur Homepage). */
  website: {
    url: "https://newedgebrand.com",
    name: "NEWEDGE – The AI department for mid-sized companies",
    description:
      "NEWEDGE builds the AI department for mid-sized companies: from a free AI analysis through Cortex, the secure entry point, to running automations. From Munich.",
    inLanguage: "en-US",
  },

  /** FAQPage (nur Homepage). */
  faq: [
    {
      question: "What is NEWEDGE?",
      answer: "NEWEDGE builds the AI department for mid-sized companies. We help companies with 5–150 employees put AI to productive use – from the first free analysis through Cortex, the secure entry point, to running automations day to day. From Munich.",
    },
    {
      question: "How much does working with NEWEDGE cost?",
      answer: "We do not quote blanket prices: scope, number of users and starting position determine them. In the free initial conversation we discuss openly what makes sense in your case.",
    },
    {
      question: "Is NEWEDGE Brand's AI consulting eligible for funding?",
      answer: "Yes, our AI consulting services are eligible for funding through the BAFA funding program.",
    },
    {
      question: "What is an AI audit?",
      answer: "In an AI audit we find the processes where AI pays off first, estimate the effort and benefit, and deliver a clear plan of the biggest levers. The entry point is often eligible for funding.",
    },
    {
      question: "Which AI technologies does NEWEDGE Brand use?",
      answer: "We work with Large Language Models (LLMs), RAG systems (Retrieval Augmented Generation), custom AI agents, automation frameworks and modern web technologies such as React and TypeScript.",
    },
  ] as FaqEntry[],

  /**
   * Routen-spezifische Service-Schemas (Textdaten je Pfad).
   * Routen-Keys sind Logik (Auswahl per `currentPath`); Werte sind Inhalt.
   */
  serviceSchemas: {
    "/ki-audit": {
      name: "AI Audit for mid-sized companies",
      description: "Structured AI audit: we find the processes with the highest AI value, estimate effort and benefit, and deliver a clear plan. Eligible for government funding (BAFA).",
      serviceType: "ProfessionalService",
      category: ["AI Audit", "AI Consulting", "Process Analysis", "AI Readiness"],
    },
    "/cortex": {
      name: "Cortex – secure AI entry point for mid-sized companies",
      description: "Cortex is the shared operating layer for AI in your company: one central, GDPR-compliant entry point for all employees that brings together company knowledge, permissions, integrations and automations – with full control over usage and data.",
      serviceType: "ProfessionalService",
      category: ["AI Platform", "AI Infrastructure", "GDPR-compliant AI", "Data Sovereignty"],
    },
  } as Record<string, ServiceSchemaText>,
} as const;
