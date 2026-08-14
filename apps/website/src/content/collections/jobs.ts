/**
 * Collection: Jobs / Offene Positionen
 * --------------------------------------------------------------
 * Editierbar UND um neue Einträge erweiterbar (neben Testimonials die
 * einzige „anlegbare" Collection).
 * Strapi-Mapping: Collection Type `job`.
 * --------------------------------------------------------------
 */

export interface JobSection {
  /** Abschnitts-Überschrift, z. B. „Deine Aufgaben". */
  label: string;
  /** Stichpunkte des Abschnitts. */
  items: string[];
}

export interface Job {
  /** Stabile ID (Accordion-Item). */
  id: string;
  /** Stellentitel inkl. (m/w/d). */
  title: string;
  /** Kurz-Tags (Ort, Umfang, Start) — inkl. Emoji-Präfix. */
  tags: string[];
  /** Vorausgefüllter Bewerbungs-Mailto-Link. */
  mailto: string;
  /** Inhaltliche Abschnitte (Aufgaben, Profil, Benefits …). */
  sections: JobSection[];
}

export const jobs: Job[] = [
  {
    id: "item-1",
    title: "Praktikum Marketing & Projektmanagement (m/w/d)",
    tags: ["📍 Remote/München", "💼 Vollzeit, 3–6 Monate", "🚀 Start jederzeit"],
    mailto: "mailto:info@newedgebrand.com?subject=Bewerbung: Praktikum Marketing & Projektmanagement",
    sections: [
      {
        label: "Deine Aufgaben",
        items: [
          "Content & SEO: Keyword-Recherche, Redaktionsplanung, Wettbewerbs-/Benchmark-Analysen, Auswertung von Statistiken & Echtzeit-Daten",
          "Social Media: Planung & Vorbereitung von LinkedIn-/Instagram-Posts, Community-Management, einfache Reportings",
          "Projektmanagement: Mitarbeit in Kick-offs & Workshops, Koordination von Timings/Assets über Studio & Lab hinweg, Quality Assurance (QA)",
          "KPI-Tracking: Monitoring von Traffic, Leads, Conversion-Rates & Social Engagement; Monats-Reports (z. B. Google Analytics/Looker)",
          "KI-Beratung & Audit-Support: Unterstützung bei KI-Readiness-Checks, Recherche zu Automatisierungs- und KI-Tools",
        ],
      },
      {
        label: "Dein Profil",
        items: [
          "Eingeschriebene:r Student:in in Marketing, Medien, WiWi o. ä.; idealerweise Pflichtpraktikum möglich",
          "Erste Erfahrung im Marketing/PM von Vorteil, aber kein Muss",
          "Ausgeprägtes Interesse an Branding, KI-Tools & digitaler Strategie; strukturierte & zuverlässige Arbeitsweise",
          "Sehr gute Deutsch- und Englischkenntnisse; Teamspirit",
        ],
      },
      {
        label: "Wir bieten",
        items: [
          "Onboarding & Mentoring: strukturiertes digitales Onboarding, persönliches Mentoring",
          "Weiterbildung: interne Sessions, Sprachkurse, regelmäßige Coachings",
          "Flexibilität: Remote-first, flexible Arbeitszeiten; Büro im Münchner Kreativviertel nach Absprache",
          "Team-Spirit: After-Work-Formate & Team-Events; sportliche Angebote nach Verfügbarkeit",
          "Einblick in beide Units: Mitarbeit an Projekten aus Studio (Marke & Strategie) und Lab (Web & Automation)",
        ],
      },
    ],
  },
  {
    id: "item-2",
    title: "Vertrieb & Business Development (m/w/d)",
    tags: ["📍 Remote/München", "💼 Vollzeit (unbefristet) oder Freelance", "🚀 Start asap"],
    mailto: "mailto:info@newedgebrand.com?subject=Bewerbung: Vertrieb & Business Development",
    sections: [
      {
        label: "Mission",
        items: [
          "Gewinne neue B2B-Kunden im DACH-Raum und baue langfristige Geschäftsbeziehungen auf — rund um Marke, Technologie und KI.",
        ],
      },
      {
        label: "Deine Aufgaben",
        items: [
          "Neukundenakquise & Outreach: Identifikation und Ansprache potenzieller Kunden (B2B) über LinkedIn, E-Mail, Telefon und Events",
          "Beratung & Bedarfsanalyse: Erstgespräche führen, Anforderungen verstehen, die passende Konfiguration unserer KI-Abteilung positionieren",
          "Angebotserstellung & Pitches: Erstellung von Angeboten, Präsentationen und Pitch-Decks in enger Abstimmung mit dem Team",
          "Pipeline-Management: Pflege und Steuerung der Sales-Pipeline im CRM; Forecasting & Reporting",
          "Partnerschaften & Netzwerk: Aufbau strategischer Partnerschaften; Teilnahme an Branchen-Events und Meetups",
        ],
      },
      {
        label: "Dein Profil",
        items: [
          "≥2 Jahre Erfahrung im B2B-Vertrieb, idealerweise im Agentur-, SaaS- oder Tech-Umfeld",
          "Starke Kommunikations- und Verhandlungsfähigkeiten; sicheres Auftreten in Kundengesprächen",
          "Verständnis für digitale Produkte, Branding oder KI-Lösungen — kein tiefes Tech-Wissen nötig",
          "Eigeninitiative, Abschlussstärke und CRM-Erfahrung (z. B. HubSpot, Pipedrive)",
          "Sehr gutes Deutsch (C2) und gutes Englisch; DACH-Netzwerk von Vorteil",
        ],
      },
      {
        label: "Wir bieten",
        items: [
          "Remote-first & Flex-Time: flexible Arbeitszeiten, remote/hybrid möglich",
          "Attraktive Vergütung: Fixum + leistungsbasierte Provision; faire Konditionen für Freelancer",
          "Modernes Umfeld: innovatives Produkt-Portfolio, kurze Entscheidungswege, direkter Draht zur Geschäftsführung",
          "Weiterbildung: Sales-Trainings, KI-Updates und Zugang zu modernen Tools & Stacks",
          "Wachstumspotenzial: Mitgestaltung der Vertriebsstrategie in einer wachsenden Agentur",
        ],
      },
    ],
  },
  {
    id: "item-3",
    title: "Praktikum Vertrieb & Business Development (m/w/d)",
    tags: ["📍 Remote/München", "💼 Vollzeit, 3–6 Monate", "🚀 Start jederzeit"],
    mailto: "mailto:info@newedgebrand.com?subject=Bewerbung: Praktikum Vertrieb & Business Development",
    sections: [
      {
        label: "Deine Aufgaben",
        items: [
          "Lead-Recherche & Prospecting: Identifikation potenzieller B2B-Kunden, Recherche zu Branchen, Unternehmen und Ansprechpartnern",
          "Outreach-Unterstützung: Vorbereitung von E-Mail-Sequenzen, LinkedIn-Nachrichten und Gesprächsleitfäden",
          "CRM-Pflege: Kontaktdaten anlegen, Pipeline-Updates, einfache Reportings und Auswertungen",
          "Pitch-Vorbereitung: Mitarbeit an Präsentationen, Angeboten und Case-Study-Aufbereitungen für Studio & Lab",
          "Markt- & Wettbewerbsanalysen: Trends im Agentur-/KI-Markt beobachten, Insights aufbereiten",
        ],
      },
      {
        label: "Dein Profil",
        items: [
          "Eingeschriebene:r Student:in in BWL, Marketing, Kommunikation o. ä.; idealerweise Pflichtpraktikum möglich",
          "Interesse an Vertrieb, Kundenbeziehungen und digitalen Geschäftsmodellen",
          "Kommunikationsstärke, Eigeninitiative und strukturierte Arbeitsweise",
          "Sehr gutes Deutsch (C1+) und gutes Englisch; erste CRM-Erfahrung von Vorteil",
        ],
      },
      {
        label: "Wir bieten",
        items: [
          "Onboarding & Mentoring: strukturiertes Onboarding, persönliche Betreuung durch erfahrene Vertriebler:innen",
          "Praxisnahe Einblicke: echte Kundenprojekte, Sales-Calls und Pitch-Situationen von Anfang an",
          "Flexibilität: Remote-first, flexible Arbeitszeiten; Büro in München nach Absprache",
          "Team-Spirit: After-Work-Formate, Team-Events und offene Feedback-Kultur",
          "Karriereperspektive: bei guter Leistung Übernahme in eine Festanstellung möglich",
        ],
      },
    ],
  },
  {
    id: "item-4",
    title: "Werkstudent:in – DevOps & Full-Stack (m/w/d)",
    tags: ["📍 Remote/München", "💼 12–20 h/Woche", "🚀 Start flexibel"],
    mailto: "mailto:info@newedgebrand.com?subject=Bewerbung: Werkstudent:in DevOps & Full-Stack",
    sections: [
      {
        label: "Deine Aufgaben",
        items: [
          "CI/CD & Containers: Unterstützung beim Aufbau/Pflege von Pipelines; Container-Builds; Dev/Test-Environments",
          "Full-Stack-Entwicklung: kleinere Features in internen Tools & Kunden-Dashboards (Frontend: Next.js/React; Backend: Node/TypeScript), API-Integrationen",
          "Datenbanken & Integrationen: Postgres; Arbeit mit REST, SQL, ETL",
          "Automationen & Skripte: n8n-Workflows, Skripte (TypeScript)",
          "QA & Dokumentation: Tests, Doku, saubere Deliverables",
        ],
      },
      {
        label: "Dein Profil",
        items: [
          "Eingeschriebene:r Student:in (Wirtschafts-)Informatik o. ä.; idealerweise ab dem 3. Semester",
          "Erste Programmiererfahrung mit JavaScript/TypeScript; Interesse an Full-Stack & Software-Architektur",
          "Gute Git-Kenntnisse; Basiswissen Cloud & Docker; sehr gutes Deutsch (C1); eigenständig & strukturiert; Neugier für KI/Automation",
          "Nice-to-have: Prisma, Tailwind, Postgres, Auth/OAuth, Vektor-DBs",
        ],
      },
      {
        label: "Wir bieten",
        items: [
          "Mentoring & Feedback: enge Betreuung durch erfahrene Entwickler:innen, regelmäßige 1:1s",
          "Praxisrelevante Projekte: echte Kunden-/Produkt-Use-Cases mit gesellschaftlichem Impact",
          "Flexibilität: Remote-Optionen, flexible Arbeitszeiten; studiumskompatibel",
          "Team-Spirit: kleines, unterstützendes Team; strukturierte Einarbeitung & klare Roadmaps",
          "Lab-Zugang: Einblicke in produktive KI-Stacks & moderne Toolchains",
        ],
      },
    ],
  },
];
