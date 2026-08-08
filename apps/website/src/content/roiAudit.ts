// Datenbasis für das KI-Hebel-Audit — 1:1 aus NewEdge_Analyse Zielgruppe.xlsx
// (Branchen-Matrix = Benchmarks · Automatisierungspotenzial = Use Cases · Scoring-Matrix = Aufwand/Quick-Win).
// Reale ROI-Spannen (€/Jahr), Ø Stunden/Woche, Automatisierungspotenzial (1–10),
// Implementierungsaufwand (1–10, 10 = leicht), Quick-Win-Flag, echter Tool-Stack.

export interface RoiUseCase {
  nr: number;
  prozess: string;
  was: string;
  tools: string;
  roiMin: number;
  roiMax: number;
  hours: number;
  potential: number;
  effort: number;
  score: number;
  quickWin: boolean;
}

export interface RoiIndustry {
  id: string;
  label: string;
  /** true = modellierte Richtwerte (nicht aus dem 40-Case-Datensatz). */
  estimated?: boolean;
  benchmark: { roiMin: number; roiMax: number; hoursWeek: number; topProzess: string };
  useCases: RoiUseCase[];
}

/** Einstiegsangebot (aus „Legende") — realistische Start-Investition statt Pauschale. */
export const ROI_ENTRY = { label: "KI-Audit", price: 3200, note: "staatlich förderfähig (BAFA)" };

/** Painpoint-Felder = „die Mitglieder Ihrer KI-Abteilung" — cooler Name je Funktion. */
export type PainId =
  | "tueroeffner" | "verstaerker" | "kassenwart" | "maschinenraum"
  | "cockpit" | "concierge" | "waechter" | "schiedsrichter";
export const PAINFIELDS: { id: PainId; name: string; sub: string }[] = [
  { id: "tueroeffner", name: "Der Türöffner", sub: "Vertrieb & Akquise" },
  { id: "verstaerker", name: "Der Verstärker", sub: "Marketing & Reichweite" },
  { id: "kassenwart", name: "Der Kassenwart", sub: "Rechnungen & Zahlungseingang" },
  { id: "maschinenraum", name: "Der Maschinenraum", sub: "Betrieb & Disposition" },
  { id: "cockpit", name: "Das Cockpit", sub: "Zahlen & Berichte" },
  { id: "concierge", name: "Der Concierge", sub: "Support & Service" },
  { id: "waechter", name: "Der Wächter", sub: "Vorschriften & Recht" },
  { id: "schiedsrichter", name: "Der Schiedsrichter", sub: "Awards & Auswahlverfahren" },
];
/** Use-Case-Nr → Painpoint-Feld (Persona). */
export const NR_TO_PAIN: Record<number, PainId> = {
  1: "waechter", 2: "maschinenraum", 3: "waechter", 4: "maschinenraum", 5: "kassenwart", 6: "maschinenraum",
  7: "tueroeffner", 8: "verstaerker", 9: "maschinenraum", 10: "waechter", 11: "kassenwart", 12: "maschinenraum",
  13: "tueroeffner", 14: "tueroeffner", 15: "kassenwart", 16: "cockpit", 17: "cockpit", 18: "kassenwart",
  19: "waechter", 20: "cockpit", 21: "tueroeffner", 22: "waechter", 23: "kassenwart", 24: "cockpit",
  25: "concierge", 26: "maschinenraum", 27: "kassenwart", 28: "concierge", 29: "maschinenraum", 30: "maschinenraum",
  31: "tueroeffner", 32: "maschinenraum", 33: "kassenwart", 34: "concierge", 35: "maschinenraum", 36: "concierge",
  37: "kassenwart", 38: "concierge", 39: "maschinenraum", 40: "verstaerker", 41: "maschinenraum", 42: "verstaerker",
  43: "schiedsrichter", 44: "maschinenraum", 45: "concierge", 46: "cockpit",
};

/**
 * Auswahlhilfe im Rechner: Branchen-Cluster, die die Datensätze unten bündeln.
 * KEINE Produkt-Taxonomie — die Blueprints stehen in `sections/nav.ts`; hier
 * geht es nur darum, dem Nutzer die passenden Benchmark-Daten zuzuordnen.
 */
export interface RoiBranche { id: string; cool: string; label: string; sub: string; industryIds: string[] }
export const BRANCHES: RoiBranche[] = [
  { id: "handel", cool: "Der Warenstrom", label: "Handel & Lieferkette", sub: "Handel · Import/Export · Logistik · Handwerk", industryIds: ["import-export", "handwerk"] },
  { id: "professional", cool: "Die Denkfabrik", label: "Kanzleien & Beratung", sub: "Kanzleien · Beratung · Architektur · Makler", industryIds: ["anwaelte", "architektur", "immobilien"] },
  { id: "health", cool: "Die Praxis", label: "Gesundheitswesen", sub: "Praxen · MVZ · Therapeuten", industryIds: ["praxen"] },
  { id: "instanzen", cool: "Die Jury", label: "Förderungen & Entscheidungsinstanzen", sub: "Förderstellen · Awards · Gremien · Vergabe · Hochschulen", industryIds: ["entscheidungsinstanzen"] },
];

export const ROI_INDUSTRIES: RoiIndustry[] = [
  {
    id: "handwerk",
    label: "Handwerk",
    benchmark: { roiMin: 23413, roiMax: 104267, hoursWeek: 4.8, topProzess: "Angebotserstellung" },
    useCases: [
      { nr: 31, prozess: "Angebotserstellung (auto)", was: "Angebote aus Standardtarifen, Materialkosten und Arbeitszeitdaten automatisch generiert — in < 5 Min statt 60 Min", tools: "Pipedrive, Make.com, Handwerkercockpit, Softerra", roiMin: 52000, roiMax: 312000, hours: 7.5, potential: 9, effort: 8, score: 8.4, quickWin: true },
      { nr: 32, prozess: "Einsatzplanung & Routenoptimierung", was: "Automatisches Scheduling mit Routenoptimierung — Monteur fährt die effizienteste Route, kein Kreuz-und-quer", tools: "Google Maps API, Soluvia, Routeapp, Zapier", roiMin: 28600, roiMax: 54600, hours: 6.5, potential: 8, effort: 7, score: 7.4, quickWin: false },
      { nr: 33, prozess: "Rechnungserstellung & Mahnwesen", was: "Automatisch generierte Rechnung nach Auftragsabschluss, digitaler Versand, 3-Stufen-Mahnworkflow", tools: "Wave, Lexoffice, Zapier, Stripe, Winworker", roiMin: 36000, roiMax: 96000, hours: 5, potential: 8, effort: 8, score: 7.3, quickWin: false },
      { nr: 34, prozess: "Kundenkommunikation & Updates", was: "Automatische SMS-Updates: Auftragsbestätigung, Ankunftszeit, Fertigstellung mit Foto-Dokumentation", tools: "Twilio, WhatsApp Business API, Jobber, Touchline App", roiMin: 0, roiMax: 5000, hours: 2.5, potential: 6, effort: 8, score: 5.8, quickWin: false },
      { nr: 35, prozess: "Material- & Lagerbestand", was: "Automatisches Tracking des Materialeinsatzes je Auftrag; Nachbestellung bei Unterschreiten des Schwellenwerts", tools: "Zapier + Google Sheets, Tradify, Handwerkercockpit", roiMin: 7680, roiMax: 14400, hours: 4, potential: 7, effort: 8, score: 6.6, quickWin: false },
      { nr: 36, prozess: "Wartungs-Erinnerungen & Inspektionen", was: "Automatische Kundenbenachrichtigungen für fällige Wartungen (Heizung, Elektrik etc.) + digitale Checklisten", tools: "Make.com, Twilio, Housecall Pro, Jobber", roiMin: 7200, roiMax: 21600, hours: 3, potential: 7, effort: 8, score: 6.6, quickWin: false },
    ],
  },
  {
    id: "immobilien",
    label: "Immobilien & Makler",
    benchmark: { roiMin: 11200, roiMax: 29867, hoursWeek: 4.5, topProzess: "Lead-Qualifizierung" },
    useCases: [
      { nr: 7, prozess: "Lead-Qualifizierung", was: "Automatische Erfassung und Bewertung von Kaufanfragen aus Website, Email, ImmobilienScout — High-Leads zu Maklern, Low-Leads in Nurture-Sequenz", tools: "Make.com, ChatGPT, Pipedrive CRM, Zapier", roiMin: 24000, roiMax: 96000, hours: 9, potential: 9, effort: 8, score: 9.2, quickWin: true },
      { nr: 8, prozess: "Exposé-Generierung", was: "KI erstellt SEO-optimierte Exposés und Multi-Plattform-Listings (ImmobilienScout24, Immowelt, ImmoNet) aus einer zentralen Eingabe", tools: "ChatGPT API, Make.com, Listing-APIs", roiMin: 18000, roiMax: 30000, hours: 2.5, potential: 8, effort: 9, score: 8.2, quickWin: true },
      { nr: 9, prozess: "Mieter-Screening", was: "Automatische Bonitätsprüfung, Beschäftigungsverifikation und Risikobewertung von Mietinteressenten", tools: "Make.com, Klippa, Creditreform API, Zapier", roiMin: 8000, roiMax: 15000, hours: 6, potential: 9, effort: 7, score: 7.8, quickWin: true },
      { nr: 10, prozess: "Mietvertrag-Generierung", was: "Smart-Template erstellt DSGVO-konforme, vorausgefüllte Mietverträge mit automatischer eSignature-Weiterleitung", tools: "DocuSign, Adobe Sign, Make.com, ChatGPT", roiMin: 4800, roiMax: 7200, hours: 1.75, potential: 7, effort: 9, score: 7.1, quickWin: false },
      { nr: 11, prozess: "Nebenkostenabrechnung", was: "Automatische monatliche Abrechnung von Heizung, Wasser, Strom mit Mieter-Versand und Buchführungsintegration", tools: "Lexoffice, Zapier, Make.com, DATEV-Integration", roiMin: 2400, roiMax: 6000, hours: 3.5, potential: 6, effort: 9, score: 6.4, quickWin: false },
      { nr: 12, prozess: "Automatische Bewertung (AVM)", was: "KI schätzt Marktpreise für Kauf/Miete aus Vergleichsdaten und Makrotrends", tools: "ImmobilienScout API, ChatGPT, Make.com", roiMin: 10000, roiMax: 30000, hours: 4, potential: 7, effort: 7, score: 6.3, quickWin: false },
    ],
  },
  {
    id: "architektur",
    label: "Architektur & Planung",
    benchmark: { roiMin: 13667, roiMax: 33333, hoursWeek: 4, topProzess: "HOAI-Angebotskalkulation" },
    useCases: [
      { nr: 13, prozess: "Anfragenverwaltung & CRM", was: "Automatische Erfassung eingehender Anfragen (Web, Email, Tel.) und Routing an zuständigen Architekten im CRM", tools: "HubSpot CRM, Make.com, n8n, Zapier", roiMin: 32000, roiMax: 100000, hours: 3.5, potential: 8, effort: 8, score: 7.7, quickWin: true },
      { nr: 14, prozess: "HOAI-Angebotskalkulation", was: "Automatisierte Honorarberechnung nach HOAI-Leistungsphasen — aus Projektkennwerten (m², Bauwerkszone, Komplexität)", tools: "HOAI-Pro, Make.com + ChatGPT, Projekt PRO", roiMin: 12000, roiMax: 24000, hours: 6, potential: 9, effort: 7, score: 7.8, quickWin: true },
      { nr: 15, prozess: "Zeiterfassung → Abrechnung", was: "Automatische Zuordnung von Zeiten zu HOAI-Leistungsphasen und monatliche Rechnungserstellung per Knopfdruck", tools: "ZEP, sevdesk, Make.com, Zapier", roiMin: 8000, roiMax: 20000, hours: 6.5, potential: 8, effort: 8, score: 7.7, quickWin: true },
      { nr: 16, prozess: "Dokumenten-/Zeichnungsverwaltung", was: "Zentrales DMS mit automatischer Versionskontrolle, Client-Sharing-Portal und Kommentar-Tracking", tools: "OneDrive/SharePoint, Trimble Connect, Nextcloud, n8n", roiMin: 3000, roiMax: 6000, hours: 2.5, potential: 6, effort: 9, score: 6.4, quickWin: false },
      { nr: 17, prozess: "Meeting-Protokollierung (KI)", was: "KI-Transkription aller Projekt-Calls und Meetings mit automatischer Aufgabenextraktion und Projektdokumentation", tools: "Fireflies.ai, Otter.ai + ChatGPT, Slack, Notion", roiMin: 6000, roiMax: 10000, hours: 1.5, potential: 7, effort: 9, score: 6.5, quickWin: false },
      { nr: 18, prozess: "Rechnungsstellung & Mahnwesen", was: "Automatische Rechnungserstellung aus Projektdaten mit automatischem 3-Stufen-Mahnprozess", tools: "sevdesk, FastBill, Make.com, Stripe", roiMin: 15000, roiMax: 40000, hours: 2.5, potential: 8, effort: 8, score: 7, quickWin: false },
    ],
  },
  {
    id: "anwaelte",
    label: "Anwälte & Consultants",
    benchmark: { roiMin: 11000, roiMax: 61000, hoursWeek: 5, topProzess: "Mandantenakquisition" },
    useCases: [
      { nr: 21, prozess: "Mandantenakquisition (Auto)", was: "Website-Anfragen → Vorqualifizierung via Fragebogen → Fachgebiet-Routing → automatische Erst-Antwort < 2h", tools: "HubSpot CRM, Typeform, Make.com, ChatGPT API", roiMin: 25000, roiMax: 200000, hours: 1.5, potential: 9, effort: 8, score: 7.8, quickWin: true },
      { nr: 22, prozess: "Vertragsanalyse (KI)", was: "KI analysiert eingehende Verträge auf Risiken, Abweichungen von Standard-Templates und kritische Klauseln", tools: "BEAMON AI, LawGeex, Claude API, Make.com", roiMin: 15000, roiMax: 35000, hours: 10, potential: 9, effort: 6, score: 8.2, quickWin: false },
      { nr: 19, prozess: "Fristenmanagement", was: "KI extrahiert Fristen aus Verträgen und Dokumenten automatisch — Erinnerungen 4 Wo., 2 Wo., 1 Wo., 3 Tage vorher", tools: "AnNoText, BEAMON AI, n8n + Claude API", roiMin: 10000, roiMax: 100000, hours: 3.5, potential: 10, effort: 6, score: 7.6, quickWin: false },
      { nr: 23, prozess: "Zeiterfassung → Abrechnung", was: "Automatische Zeiterfassung je Mandat mit monatlicher Rechnungserstellung und 3-Stufen-Mahnprozess", tools: "TimO, FastBill, Lexware, n8n + Stripe", roiMin: 8000, roiMax: 15000, hours: 2.5, potential: 8, effort: 8, score: 7, quickWin: false },
      { nr: 24, prozess: "Reporting & Leistungsnachweise", was: "KI generiert Berichtstexte und Leistungsnachweise aus Zeiteinträgen, Aktennotizen und Projektdaten", tools: "Claude/ChatGPT API, Make.com, n8n, DocuSign", roiMin: 5000, roiMax: 10000, hours: 15, potential: 7, effort: 8, score: 7.2, quickWin: false },
      { nr: 20, prozess: "Dokumentenklassifizierung", was: "Automatisches Sortieren und Routen eingehender Post, E-Mails und Dokumente in richtige Akte via OCR + KI", tools: "Klippa OCR, ABBYY, n8n, Make.com", roiMin: 3000, roiMax: 6000, hours: 1.5, potential: 7, effort: 8, score: 6.2, quickWin: false },
    ],
  },
  {
    id: "praxen",
    label: "Praxen & Gesundheit",
    benchmark: { roiMin: 6367, roiMax: 15400, hoursWeek: 4.8, topProzess: "Terminbuchung & Erinnerungen" },
    useCases: [
      { nr: 26, prozess: "Digitale Patientenaufnahme", was: "Patienten füllen Anamnese & Versicherungsdaten digital vor dem Termin aus — Import direkt ins Patientensystem", tools: "JotForm, Typeform, Make.com, Zapier", roiMin: 10400, roiMax: 15600, hours: 8, potential: 8, effort: 9, score: 8.6, quickWin: true },
      { nr: 25, prozess: "Terminbuchung & Erinnerungen", was: "Online-Buchung 24/7 mit automatischen SMS/Email-Erinnerungen 24h vor Termin inkl. Storno-Link", tools: "Calendly, SimplyBook.me, Doctolib, Twilio", roiMin: 7800, roiMax: 15600, hours: 6.5, potential: 9, effort: 9, score: 8.3, quickWin: true },
      { nr: 27, prozess: "Automatische Abrechnung", was: "Rechnungen nach Termin automatisch erstellt und versendet; Mahnworkflow bei Zahlungsverzug", tools: "HubSpot, Zapier, Medico, Stripe", roiMin: 10400, roiMax: 23400, hours: 4, potential: 8, effort: 8, score: 7.3, quickWin: false },
      { nr: 28, prozess: "Patienten-Follow-up (KI)", was: "Automatische Nachsorge-SMS nach Behandlung: Medikamentenerinnerungen, Folgetermin-Einladungen, Checklisten", tools: "Twilio, WhatsApp Business API, Doctolib, Make.com", roiMin: 0, roiMax: 5000, hours: 5, potential: 7, effort: 8, score: 6.5, quickWin: false },
      { nr: 30, prozess: "Ressourcen- & Raumplanung", was: "KI optimiert Zeitslots, Raumbelegung und Personalschichten anhand von Nachfragedaten", tools: "PowerBI, Python/ML, Google Cloud API, Zapier", roiMin: 5200, roiMax: 15600, hours: 2.5, potential: 7, effort: 7, score: 6.3, quickWin: false },
      { nr: 29, prozess: "Bestandsverwaltung Verbrauchsmaterial", was: "Automatisches Nachbestellen von Verbrauchsmaterial (Spritzen, Verbandmittel) bei Unterschreiten von Schwellenwerten", tools: "Zapier + Google Sheets, Medigate, ERP-Integration", roiMin: 3000, roiMax: 9600, hours: 2.5, potential: 6, effort: 8, score: 6.2, quickWin: false },
    ],
  },
  {
    id: "import-export",
    label: "Import & Export",
    benchmark: { roiMin: 16333, roiMax: 190833, hoursWeek: 6.3, topProzess: "Compliance Screening" },
    useCases: [
      { nr: 6, prozess: "Supply Chain AI-Agent", was: "Autonomer Agent: Alternativlieferanten suchen, Raten verhandeln, Kundennotificationen bei Störungen — 24/7", tools: "n8n + Claude/ChatGPT, Make.com, Alibaba-API", roiMin: 20000, roiMax: 80000, hours: 10, potential: 9, effort: 5, score: 8, quickWin: false },
      { nr: 2, prozess: "Exportdokumentation (auto)", was: "Automatische Erstellung von Commercial Invoices, Packlisten und Versanddokumenten direkt aus ERP-Daten", tools: "Make.com, Zapier, ChatGPT API, PDF-APIs", roiMin: 6000, roiMax: 12000, hours: 5, potential: 8, effort: 9, score: 7.9, quickWin: true },
      { nr: 3, prozess: "Compliance Screening", was: "Automatisches Prüfen aller Transaktionspartner gegen Sanktionslisten (OFAC, EAR) in Echtzeit", tools: "n8n, ComplyAdvantage API, Make.com", roiMin: 50000, roiMax: 1000000, hours: 3.5, potential: 10, effort: 7, score: 7.8, quickWin: true },
      { nr: 1, prozess: "HS-Code-Klassifikation", was: "KI analysiert Produktdaten und weist automatisch korrekte Zoll-Codes zu — kein manuelles Nachschlagen mehr", tools: "Claude/ChatGPT API, n8n, Clearit, Zonos", roiMin: 4000, roiMax: 8000, hours: 7, potential: 8, effort: 8, score: 7.6, quickWin: true },
      { nr: 4, prozess: "Lieferanten-Kommunikation", was: "Proaktive, automatisierte Updates an Lieferanten zu Orders, Zahlungen, Versandstatus — mehrsprachig via KI", tools: "Make.com, ChatGPT API, Slack, Zapier", roiMin: 10000, roiMax: 25000, hours: 7, potential: 7, effort: 8, score: 7.6, quickWin: true },
      { nr: 5, prozess: "Zollabgaben-Kalkulation", was: "Automatische Berechnung von Zollsätzen, Präferenzzöllen und Steuern je Produkt und Zielmarkt", tools: "Zapier, Zonos API, ChatGPT, n8n", roiMin: 8000, roiMax: 20000, hours: 4.5, potential: 7, effort: 7, score: 7, quickWin: false },
    ],
  },
  {
    id: "fitness",
    label: "Fitness, Spa & Wellness",
    benchmark: { roiMin: 7428, roiMax: 22880, hoursWeek: 3.5, topProzess: "Kursplanung & Kapazität" },
    useCases: [
      { nr: 37, prozess: "Mitgliedschaft & Abrechnung", was: "Automatische monatliche SEPA-Abbuchung, Zahlungserinnerungen bei Rückstand, automatisches Storno-Management", tools: "Stripe, Mindbody, Zen Planner, Make.com", roiMin: 7200, roiMax: 14400, hours: 5, potential: 8, effort: 8, score: 7.3, quickWin: false },
      { nr: 38, prozess: "No-Show-Reduktion (auto)", was: "SMS/Email-Erinnerung 24h vor Kurs + automatisches Storno-Link + Wartelisten-Zuweisung bei Absagen", tools: "Calendly + Twilio, Mindbody, Make.com, Acuity", roiMin: 3640, roiMax: 7280, hours: 3, potential: 7, effort: 9, score: 6.8, quickWin: false },
      { nr: 39, prozess: "Kursplanung & Kapazität", was: "Datengetriebene Kursplan-Optimierung — Nachfrage je Uhrzeit, Trainer-Verfügbarkeit, saisonale Muster", tools: "Google Calendar API, Gymdesk, Fittr, Make.com", roiMin: 16128, roiMax: 70000, hours: 4, potential: 7, effort: 7, score: 6.3, quickWin: false },
      { nr: 40, prozess: "Marketing & Win-back", was: "Automatisierte E-Mail-Sequenzen für Interessenten, Verlängerungs-Kampagnen, Win-back für gekündigte Mitglieder", tools: "Klaviyo, HubSpot, Mindbody Marketing, Make.com", roiMin: 10400, roiMax: 26000, hours: 4, potential: 8, effort: 6, score: 6.5, quickWin: false },
      { nr: 42, prozess: "Feedback & Bewertungsmanagement", was: "Automatische Umfragen nach Kursen + Trigger für Google-Bewertungsanfragen bei zufriedenen Kunden", tools: "Google Reviews API, Typeform, Make.com, Trustpilot", roiMin: 5200, roiMax: 10400, hours: 2.5, potential: 7, effort: 8, score: 6.6, quickWin: false },
      { nr: 41, prozess: "Trainer-Zertifikate & HR", was: "Automatisches Tracking von Trainer-Lizenzen mit Ablauf-Erinnerungen, Weiterbildungs-Workflows, Provisions-Abrechnung", tools: "Airtable + Zapier, Notion, Zen Planner, Google Sheets", roiMin: 2500, roiMax: 7500, hours: 2.5, potential: 6, effort: 8, score: 5.8, quickWin: false },
    ],
  },
  {
    id: "entscheidungsinstanzen",
    label: "Entscheidungsinstanzen",
    estimated: true,
    benchmark: { roiMin: 6750, roiMax: 33250, hoursWeek: 5.25, topProzess: "KI-Vorbewertung von Einreichungen" },
    useCases: [
      { nr: 43, prozess: "KI-Vorbewertung von Einreichungen", was: "KI sichtet und bewertet eingehende Bewerbungen/Einreichungen vor — das Gremium entscheidet nur noch die Shortlist", tools: "n8n + Claude API, Airtable, Make.com", roiMin: 10000, roiMax: 60000, hours: 8, potential: 9, effort: 6, score: 8, quickWin: true },
      { nr: 44, prozess: "Einreichungs- & Jury-Workflow", was: "Automatische Erfassung, Vollständigkeitsprüfung und Zuweisung an die zuständigen Juror:innen", tools: "Typeform, Make.com, Airtable", roiMin: 8000, roiMax: 40000, hours: 6, potential: 8, effort: 7, score: 7.8, quickWin: true },
      { nr: 45, prozess: "Kommunikation mit Einreichern", was: "Automatische Status-Updates, Rückfragen und Ergebnis-Benachrichtigungen über alle Phasen", tools: "Make.com, Twilio, ChatGPT API", roiMin: 5000, roiMax: 18000, hours: 4, potential: 7, effort: 8, score: 7, quickWin: false },
      { nr: 46, prozess: "Revisionssichere Bewertungs-Doku", was: "Lückenlose, nachvollziehbare Dokumentation aller Bewertungsschritte für Compliance und Einspruchssicherheit", tools: "Notion, DocuSign, n8n", roiMin: 4000, roiMax: 15000, hours: 3, potential: 7, effort: 8, score: 7, quickWin: false },
    ],
  },
];

/**
 * Kuratierte, real in Deutschland je Branche genutzte Business-Apps pro
 * Anwendungsfeld (recherchiert 2026-07, Subagent-Recherche). Konsolidiert:
 * austauschbare Äquivalente je Kategorie auf ~1 reduziert; generische
 * Automatisierung (Zapier/Make/n8n) und generische KI (ChatGPT) bewusst
 * weggelassen — das sind die Konnektoren, nicht die Fach-Apps, die ein Betrieb
 * wirklich nutzt. Reihenfolge = Verbreitung, häufigstes zuerst.
 * Key = BRANCHES.id → PainId → App-Namen (Chips im ROI-Rechner, Step 2).
 */
export const ROI_APPS: Record<string, Partial<Record<PainId, string[]>>> = {
  handel: {
    tueroeffner: ["HubSpot", "Pipedrive", "Salesforce", "CAS genesisWorld", "Zoho CRM", "Dynamics 365"],
    verstaerker: ["Brevo", "CleverReach", "Mailchimp", "Klaviyo", "Meta Business Suite", "Canva"],
    kassenwart: ["DATEV", "Lexware Office", "sevDesk", "SAP", "Klarna", "PayPal"],
    maschinenraum: ["JTL-Wawi", "plentymarkets", "Xentral", "Shopware", "SAP Business One", "CargoWise", "Timocom", "pds"],
    cockpit: ["Power BI", "Qlik Sense", "Tableau", "Google Analytics 4"],
    concierge: ["Zendesk", "Freshdesk", "Zammad", "HubSpot Service Hub", "Microsoft Teams"],
    waechter: ["AEB (ATLAS)", "DAKOSY", "DocuWare", "DATEV DMS", "ecoDMS"],
  },
  professional: {
    tueroeffner: ["onOffice", "Propstack", "FlowFact", "ImmoScout24", "HubSpot", "Salesforce"],
    verstaerker: ["CleverReach", "Mailchimp", "LinkedIn", "Canva"],
    kassenwart: ["DATEV", "RA-MICRO", "Lexware Office", "sevDesk"],
    maschinenraum: ["RA-MICRO", "Advoware", "DATEV Anwalt", "WinMACS", "Allplan", "ORCA AVA", "Projekt Pro"],
    cockpit: ["DATEV", "Power BI", "Excel"],
    concierge: ["DATEV Meine Steuern", "Casavi", "etg24", "Calendly", "beA"],
    waechter: ["beA", "DATEV DMS", "FP Sign", "DocuSign", "ELSTER"],
  },
  health: {
    tueroeffner: ["Doctolib", "jameda", "samedi", "Dr. Flex", "Google Bewertungen"],
    verstaerker: ["Praxis-Website", "Google Ads", "Meta", "jameda"],
    kassenwart: ["PVS Verrechnungsstelle", "BFS health finance", "DZR", "DATEV", "Optica"],
    maschinenraum: ["CGM", "medatixx", "tomedo", "Dampsoft DS-Win", "Solutio CHARLY", "THEORG", "RED Medical"],
    cockpit: ["PVS-Controlling", "DATEV", "KV-Statistik"],
    concierge: ["Doctolib", "RED connect", "arztkonsultation", "aaron.ai", "KIM"],
    waechter: ["medatixx QM", "dios", "Vismed / neoQM", "KIM"],
  },
  instanzen: {
    tueroeffner: ["Deutsches Vergabeportal (DTVP)", "Vergabe24", "Deutsches Ausschreibungsblatt", "service.bund.de", "evergabe.de", "TED / eForms"],
    verstaerker: ["TYPO3", "WordPress", "CleverReach", "LinkedIn", "Canva"],
    kassenwart: ["DATEV", "DATEVkommunal", "Lexware Office", "SAP", "sevDesk"],
    maschinenraum: ["Session / SessionNet", "ALLRIS", "SD.NET", "more Rubin", "Sdui", "Microsoft 365"],
    cockpit: ["Power BI", "Excel", "DATEV", "Tableau"],
    concierge: ["Microsoft Outlook", "Zammad", "Microsoft Teams", "CleverReach"],
    waechter: ["d.velop", "enaio", "nscale", "cosinex VMS", "DocuSign / D-Trust"],
    schiedsrichter: ["Award Force", "OpenWater", "Evalato", "cosinex VMS", "DTVP", "evergabe.de", "DFG elan / easy-Online", "ConfTool / EasyChair"],
  },
};
