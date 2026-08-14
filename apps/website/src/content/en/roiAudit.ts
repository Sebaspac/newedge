// EN mirror of src/content/roiAudit.ts — identical export names, structure and
// numbers; only descriptive German strings are translated. ids, NR_TO_PAIN,
// ROI_APPS (product names) and all numeric values stay byte-identical and are
// re-exported from the DE source where they carry no translatable copy.

import type { PainId, RoiBranche, RoiIndustry } from "@/content/roiAudit";

export type { RoiUseCase, RoiIndustry, RoiBranche, PainId } from "@/content/roiAudit";

/** Use-case nr → painpoint field (persona) — language-independent, re-exported 1:1. */
export { NR_TO_PAIN, ROI_APPS } from "@/content/roiAudit";

/** Entry offer — realistic starting investment instead of a flat rate. */
export const ROI_ENTRY = { label: "AI Audit", price: 3200, note: "Eligible for government funding (BAFA)" };

/** Painpoint fields = "the members of your AI department" — a memorable name per function. */
export const PAINFIELDS: { id: PainId; name: string; sub: string }[] = [
  { id: "tueroeffner", name: "The Door Opener", sub: "Sales & acquisition" },
  { id: "verstaerker", name: "The Amplifier", sub: "Marketing & reach" },
  { id: "kassenwart", name: "The Treasurer", sub: "Invoicing & incoming payments" },
  { id: "maschinenraum", name: "The Engine Room", sub: "Operations & scheduling" },
  { id: "cockpit", name: "The Cockpit", sub: "Numbers & reports" },
  { id: "concierge", name: "The Concierge", sub: "Support & service" },
  { id: "waechter", name: "The Guardian", sub: "Regulations & legal" },
  { id: "schiedsrichter", name: "The Referee", sub: "Awards & selection processes" },
];

/**
 * Picker helper inside the calculator: industry clusters that bundle the data
 * sets below. NOT a product taxonomy — the blueprints live in `sections/nav.ts`;
 * this only maps the user to the right benchmark data.
 */
export const BRANCHES: RoiBranche[] = [
  { id: "handel", cool: "The Flow of Goods", label: "Trade & Supply Chain", sub: "Trade · Import/export · Logistics · Skilled trades", industryIds: ["import-export", "handwerk"] },
  { id: "professional", cool: "The Think Tank", label: "Law Firms & Consulting", sub: "Law firms · Consulting · Architecture · Brokers", industryIds: ["anwaelte", "architektur", "immobilien"] },
  { id: "health", cool: "The Practice", label: "Health Care", sub: "Practices · Medical centers · Therapists", industryIds: ["praxen"] },
  { id: "instanzen", cool: "The Jury", label: "Grants & Decision-Making Bodies", sub: "Grant bodies · Awards · Committees · Procurement · Universities", industryIds: ["entscheidungsinstanzen"] },
];

export const ROI_INDUSTRIES: RoiIndustry[] = [
  {
    id: "handwerk",
    label: "Skilled Trades",
    benchmark: { roiMin: 23413, roiMax: 104267, hoursWeek: 4.8, topProzess: "Quote generation" },
    useCases: [
      { nr: 31, prozess: "Quote generation (auto)", was: "Quotes generated automatically from standard rates, material costs and labor time data — in under 5 min instead of 60", tools: "Pipedrive, Make.com, Handwerkercockpit, Softerra", roiMin: 52000, roiMax: 312000, hours: 7.5, potential: 9, effort: 8, score: 8.4, quickWin: true },
      { nr: 32, prozess: "Job scheduling & route optimization", was: "Automatic scheduling with route optimization — your technician drives the most efficient route, no criss-crossing", tools: "Google Maps API, Soluvia, Routeapp, Zapier", roiMin: 28600, roiMax: 54600, hours: 6.5, potential: 8, effort: 7, score: 7.4, quickWin: false },
      { nr: 33, prozess: "Invoicing & dunning", was: "Invoice generated automatically on job completion, digital delivery, 3-stage dunning workflow", tools: "Wave, Lexoffice, Zapier, Stripe, Winworker", roiMin: 36000, roiMax: 96000, hours: 5, potential: 8, effort: 8, score: 7.3, quickWin: false },
      { nr: 34, prozess: "Customer communication & updates", was: "Automatic SMS updates: order confirmation, arrival time, completion with photo documentation", tools: "Twilio, WhatsApp Business API, Jobber, Touchline App", roiMin: 0, roiMax: 5000, hours: 2.5, potential: 6, effort: 8, score: 5.8, quickWin: false },
      { nr: 35, prozess: "Materials & inventory", was: "Automatic tracking of material usage per job; reordering when stock falls below the threshold", tools: "Zapier + Google Sheets, Tradify, Handwerkercockpit", roiMin: 7680, roiMax: 14400, hours: 4, potential: 7, effort: 8, score: 6.6, quickWin: false },
      { nr: 36, prozess: "Maintenance reminders & inspections", was: "Automatic customer notifications for due maintenance (heating, electrics etc.) + digital checklists", tools: "Make.com, Twilio, Housecall Pro, Jobber", roiMin: 7200, roiMax: 21600, hours: 3, potential: 7, effort: 8, score: 6.6, quickWin: false },
    ],
  },
  {
    id: "immobilien",
    label: "Real Estate & Brokers",
    benchmark: { roiMin: 11200, roiMax: 29867, hoursWeek: 4.5, topProzess: "Lead qualification" },
    useCases: [
      { nr: 7, prozess: "Lead qualification", was: "Automatic capture and scoring of purchase inquiries from website, email, ImmobilienScout — high leads go to brokers, low leads into a nurture sequence", tools: "Make.com, ChatGPT, Pipedrive CRM, Zapier", roiMin: 24000, roiMax: 96000, hours: 9, potential: 9, effort: 8, score: 9.2, quickWin: true },
      { nr: 8, prozess: "Exposé generation", was: "AI creates SEO-optimized exposés and multi-platform listings (ImmobilienScout24, Immowelt, ImmoNet) from a single central input", tools: "ChatGPT API, Make.com, Listing-APIs", roiMin: 18000, roiMax: 30000, hours: 2.5, potential: 8, effort: 9, score: 8.2, quickWin: true },
      { nr: 9, prozess: "Tenant screening", was: "Automatic credit check, employment verification and risk scoring of prospective tenants", tools: "Make.com, Klippa, Creditreform API, Zapier", roiMin: 8000, roiMax: 15000, hours: 6, potential: 9, effort: 7, score: 7.8, quickWin: true },
      { nr: 10, prozess: "Lease generation", was: "Smart template creates GDPR-compliant, pre-filled leases with automatic eSignature routing", tools: "DocuSign, Adobe Sign, Make.com, ChatGPT", roiMin: 4800, roiMax: 7200, hours: 1.75, potential: 7, effort: 9, score: 7.1, quickWin: false },
      { nr: 11, prozess: "Service charge statements", was: "Automatic monthly statements for heating, water, electricity with tenant delivery and accounting integration", tools: "Lexoffice, Zapier, Make.com, DATEV-Integration", roiMin: 2400, roiMax: 6000, hours: 3.5, potential: 6, effort: 9, score: 6.4, quickWin: false },
      { nr: 12, prozess: "Automated valuation (AVM)", was: "AI estimates market prices for sale/rent from comparables and macro trends", tools: "ImmobilienScout API, ChatGPT, Make.com", roiMin: 10000, roiMax: 30000, hours: 4, potential: 7, effort: 7, score: 6.3, quickWin: false },
    ],
  },
  {
    id: "architektur",
    label: "Architecture & Planning",
    benchmark: { roiMin: 13667, roiMax: 33333, hoursWeek: 4, topProzess: "HOAI fee calculation" },
    useCases: [
      { nr: 13, prozess: "Inquiry management & CRM", was: "Automatic capture of incoming inquiries (web, email, phone) and routing to the responsible architect in your CRM", tools: "HubSpot CRM, Make.com, n8n, Zapier", roiMin: 32000, roiMax: 100000, hours: 3.5, potential: 8, effort: 8, score: 7.7, quickWin: true },
      { nr: 14, prozess: "HOAI fee calculation", was: "Automated fee calculation across HOAI service phases — from project parameters (m², building class, complexity)", tools: "HOAI-Pro, Make.com + ChatGPT, Projekt PRO", roiMin: 12000, roiMax: 24000, hours: 6, potential: 9, effort: 7, score: 7.8, quickWin: true },
      { nr: 15, prozess: "Time tracking → billing", was: "Automatic mapping of hours to HOAI service phases and monthly invoicing at the push of a button", tools: "ZEP, sevdesk, Make.com, Zapier", roiMin: 8000, roiMax: 20000, hours: 6.5, potential: 8, effort: 8, score: 7.7, quickWin: true },
      { nr: 16, prozess: "Document/drawing management", was: "Central DMS with automatic version control, client sharing portal and comment tracking", tools: "OneDrive/SharePoint, Trimble Connect, Nextcloud, n8n", roiMin: 3000, roiMax: 6000, hours: 2.5, potential: 6, effort: 9, score: 6.4, quickWin: false },
      { nr: 17, prozess: "Meeting minutes (AI)", was: "AI transcription of all project calls and meetings with automatic task extraction and project documentation", tools: "Fireflies.ai, Otter.ai + ChatGPT, Slack, Notion", roiMin: 6000, roiMax: 10000, hours: 1.5, potential: 7, effort: 9, score: 6.5, quickWin: false },
      { nr: 18, prozess: "Invoicing & dunning", was: "Automatic invoicing from project data with an automated 3-stage dunning process", tools: "sevdesk, FastBill, Make.com, Stripe", roiMin: 15000, roiMax: 40000, hours: 2.5, potential: 8, effort: 8, score: 7, quickWin: false },
    ],
  },
  {
    id: "anwaelte",
    label: "Lawyers & Consultants",
    benchmark: { roiMin: 11000, roiMax: 61000, hoursWeek: 5, topProzess: "Client acquisition" },
    useCases: [
      { nr: 21, prozess: "Client acquisition (auto)", was: "Website inquiries → pre-qualification via questionnaire → practice-area routing → automatic first response in under 2 hrs", tools: "HubSpot CRM, Typeform, Make.com, ChatGPT API", roiMin: 25000, roiMax: 200000, hours: 1.5, potential: 9, effort: 8, score: 7.8, quickWin: true },
      { nr: 22, prozess: "Contract analysis (AI)", was: "AI analyzes incoming contracts for risks, deviations from standard templates and critical clauses", tools: "BEAMON AI, LawGeex, Claude API, Make.com", roiMin: 15000, roiMax: 35000, hours: 10, potential: 9, effort: 6, score: 8.2, quickWin: false },
      { nr: 19, prozess: "Deadline management", was: "AI extracts deadlines from contracts and documents automatically — reminders 4 wks, 2 wks, 1 wk, 3 days ahead", tools: "AnNoText, BEAMON AI, n8n + Claude API", roiMin: 10000, roiMax: 100000, hours: 3.5, potential: 10, effort: 6, score: 7.6, quickWin: false },
      { nr: 23, prozess: "Time tracking → billing", was: "Automatic time tracking per mandate with monthly invoicing and a 3-stage dunning process", tools: "TimO, FastBill, Lexware, n8n + Stripe", roiMin: 8000, roiMax: 15000, hours: 2.5, potential: 8, effort: 8, score: 7, quickWin: false },
      { nr: 24, prozess: "Reporting & proofs of work", was: "AI generates report copy and proofs of work from time entries, file notes and project data", tools: "Claude/ChatGPT API, Make.com, n8n, DocuSign", roiMin: 5000, roiMax: 10000, hours: 15, potential: 7, effort: 8, score: 7.2, quickWin: false },
      { nr: 20, prozess: "Document classification", was: "Automatic sorting and routing of incoming mail, emails and documents into the right file via OCR + AI", tools: "Klippa OCR, ABBYY, n8n, Make.com", roiMin: 3000, roiMax: 6000, hours: 1.5, potential: 7, effort: 8, score: 6.2, quickWin: false },
    ],
  },
  {
    id: "praxen",
    label: "Practices & Health Care",
    benchmark: { roiMin: 6367, roiMax: 15400, hoursWeek: 4.8, topProzess: "Appointment booking & reminders" },
    useCases: [
      { nr: 26, prozess: "Digital patient intake", was: "Patients fill in medical history & insurance data digitally before the appointment — imported straight into the patient system", tools: "JotForm, Typeform, Make.com, Zapier", roiMin: 10400, roiMax: 15600, hours: 8, potential: 8, effort: 9, score: 8.6, quickWin: true },
      { nr: 25, prozess: "Appointment booking & reminders", was: "Online booking 24/7 with automatic SMS/email reminders 24h before the appointment incl. cancellation link", tools: "Calendly, SimplyBook.me, Doctolib, Twilio", roiMin: 7800, roiMax: 15600, hours: 6.5, potential: 9, effort: 9, score: 8.3, quickWin: true },
      { nr: 27, prozess: "Automated billing", was: "Invoices created and sent automatically after each appointment; dunning workflow on late payment", tools: "HubSpot, Zapier, Medico, Stripe", roiMin: 10400, roiMax: 23400, hours: 4, potential: 8, effort: 8, score: 7.3, quickWin: false },
      { nr: 28, prozess: "Patient follow-up (AI)", was: "Automatic aftercare SMS following treatment: medication reminders, follow-up appointment invitations, checklists", tools: "Twilio, WhatsApp Business API, Doctolib, Make.com", roiMin: 0, roiMax: 5000, hours: 5, potential: 7, effort: 8, score: 6.5, quickWin: false },
      { nr: 30, prozess: "Resource & room planning", was: "AI optimizes time slots, room allocation and staff shifts based on demand data", tools: "PowerBI, Python/ML, Google Cloud API, Zapier", roiMin: 5200, roiMax: 15600, hours: 2.5, potential: 7, effort: 7, score: 6.3, quickWin: false },
      { nr: 29, prozess: "Consumables inventory", was: "Automatic reordering of consumables (syringes, dressings) when stock falls below thresholds", tools: "Zapier + Google Sheets, Medigate, ERP-Integration", roiMin: 3000, roiMax: 9600, hours: 2.5, potential: 6, effort: 8, score: 6.2, quickWin: false },
    ],
  },
  {
    id: "import-export",
    label: "Import & Export",
    benchmark: { roiMin: 16333, roiMax: 190833, hoursWeek: 6.3, topProzess: "Compliance screening" },
    useCases: [
      { nr: 6, prozess: "Supply chain AI agent", was: "Autonomous agent: finds alternative suppliers, negotiates rates, notifies customers about disruptions — 24/7", tools: "n8n + Claude/ChatGPT, Make.com, Alibaba-API", roiMin: 20000, roiMax: 80000, hours: 10, potential: 9, effort: 5, score: 8, quickWin: false },
      { nr: 2, prozess: "Export documentation (auto)", was: "Automatic creation of commercial invoices, packing lists and shipping documents straight from ERP data", tools: "Make.com, Zapier, ChatGPT API, PDF-APIs", roiMin: 6000, roiMax: 12000, hours: 5, potential: 8, effort: 9, score: 7.9, quickWin: true },
      { nr: 3, prozess: "Compliance screening", was: "Automatic real-time screening of all transaction partners against sanctions lists (OFAC, EAR)", tools: "n8n, ComplyAdvantage API, Make.com", roiMin: 50000, roiMax: 1000000, hours: 3.5, potential: 10, effort: 7, score: 7.8, quickWin: true },
      { nr: 1, prozess: "HS code classification", was: "AI analyzes product data and assigns the correct customs codes automatically — no more manual lookups", tools: "Claude/ChatGPT API, n8n, Clearit, Zonos", roiMin: 4000, roiMax: 8000, hours: 7, potential: 8, effort: 8, score: 7.6, quickWin: true },
      { nr: 4, prozess: "Supplier communication", was: "Proactive, automated updates to suppliers on orders, payments, shipping status — multilingual via AI", tools: "Make.com, ChatGPT API, Slack, Zapier", roiMin: 10000, roiMax: 25000, hours: 7, potential: 7, effort: 8, score: 7.6, quickWin: true },
      { nr: 5, prozess: "Customs duty calculation", was: "Automatic calculation of duty rates, preferential tariffs and taxes per product and target market", tools: "Zapier, Zonos API, ChatGPT, n8n", roiMin: 8000, roiMax: 20000, hours: 4.5, potential: 7, effort: 7, score: 7, quickWin: false },
    ],
  },
  {
    id: "fitness",
    label: "Fitness, Spa & Wellness",
    benchmark: { roiMin: 7428, roiMax: 22880, hoursWeek: 3.5, topProzess: "Class planning & capacity" },
    useCases: [
      { nr: 37, prozess: "Membership & billing", was: "Automatic monthly SEPA direct debit, payment reminders on arrears, automated cancellation management", tools: "Stripe, Mindbody, Zen Planner, Make.com", roiMin: 7200, roiMax: 14400, hours: 5, potential: 8, effort: 8, score: 7.3, quickWin: false },
      { nr: 38, prozess: "No-show reduction (auto)", was: "SMS/email reminder 24h before class + automatic cancellation link + waitlist assignment on cancellations", tools: "Calendly + Twilio, Mindbody, Make.com, Acuity", roiMin: 3640, roiMax: 7280, hours: 3, potential: 7, effort: 9, score: 6.8, quickWin: false },
      { nr: 39, prozess: "Class planning & capacity", was: "Data-driven schedule optimization — demand by time of day, trainer availability, seasonal patterns", tools: "Google Calendar API, Gymdesk, Fittr, Make.com", roiMin: 16128, roiMax: 70000, hours: 4, potential: 7, effort: 7, score: 6.3, quickWin: false },
      { nr: 40, prozess: "Marketing & win-back", was: "Automated email sequences for prospects, renewal campaigns, win-back for cancelled members", tools: "Klaviyo, HubSpot, Mindbody Marketing, Make.com", roiMin: 10400, roiMax: 26000, hours: 4, potential: 8, effort: 6, score: 6.5, quickWin: false },
      { nr: 42, prozess: "Feedback & review management", was: "Automatic post-class surveys + triggered Google review requests for happy customers", tools: "Google Reviews API, Typeform, Make.com, Trustpilot", roiMin: 5200, roiMax: 10400, hours: 2.5, potential: 7, effort: 8, score: 6.6, quickWin: false },
      { nr: 41, prozess: "Trainer certificates & HR", was: "Automatic tracking of trainer licenses with expiry reminders, training workflows, commission billing", tools: "Airtable + Zapier, Notion, Zen Planner, Google Sheets", roiMin: 2500, roiMax: 7500, hours: 2.5, potential: 6, effort: 8, score: 5.8, quickWin: false },
    ],
  },
  {
    id: "entscheidungsinstanzen",
    label: "Decision-Making Bodies",
    estimated: true,
    benchmark: { roiMin: 6750, roiMax: 33250, hoursWeek: 5.25, topProzess: "AI pre-assessment of submissions" },
    useCases: [
      { nr: 43, prozess: "AI pre-assessment of submissions", was: "AI reviews and pre-scores incoming applications/submissions — the committee only decides the shortlist", tools: "n8n + Claude API, Airtable, Make.com", roiMin: 10000, roiMax: 60000, hours: 8, potential: 9, effort: 6, score: 8, quickWin: true },
      { nr: 44, prozess: "Submission & jury workflow", was: "Automatic intake, completeness check and assignment to the responsible jurors", tools: "Typeform, Make.com, Airtable", roiMin: 8000, roiMax: 40000, hours: 6, potential: 8, effort: 7, score: 7.8, quickWin: true },
      { nr: 45, prozess: "Communication with submitters", was: "Automatic status updates, queries and results notifications across all phases", tools: "Make.com, Twilio, ChatGPT API", roiMin: 5000, roiMax: 18000, hours: 4, potential: 7, effort: 8, score: 7, quickWin: false },
      { nr: 46, prozess: "Audit-proof evaluation records", was: "Complete, traceable documentation of every evaluation step for compliance and appeal-proofing", tools: "Notion, DocuSign, n8n", roiMin: 4000, roiMax: 15000, hours: 3, potential: 7, effort: 8, score: 7, quickWin: false },
    ],
  },
];
