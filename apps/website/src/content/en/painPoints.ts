/**
 * Pain Point Content Store
 * --------------------------------------------------------------
 * Central content for all pain-point pages.
 * Structure 1:1 with the current selection-process page.
 * Images/icons: existing placeholders are reused;
 * each slug section carries an `imageNote` — describing
 * what should later appear at that spot in terms of content.
 * --------------------------------------------------------------
 */
import { miniCasesBySlug } from "@/content/en/collections/miniCases";
import type { ImageKey } from "@/content/assets";

export interface CompareRow {
  /** Criterion */ k: string;
  /** NEWEDGE */ ne: string;
  /** Alternative */ alt: string;
}

export interface FeatureBlock {
  h2: string;
  /** Optional descriptive subtitle directly beneath h2 */
  h3?: string;
  sub: string;
  bullets: string[];
  /** Description of the planned image — placeholder remains in place */
  imageNote: string;
  imageAlt: string;
  /** Page-specific image, if available — otherwise falls back to the shared chrome graphic. */
  image?: ImageKey;
}

export interface FeatureCard {
  title: string;
  desc: string;
  /** Description of the planned icon */
  iconNote: string;
  /** Page-specific icon, if available — otherwise falls back to the generic chrome icons. */
  icon?: ImageKey;
}

/** A single ROI / success metric of a mini-case */
export interface MiniCaseMetric {
  /** e.g. "70 %", "3 weeks", "4×" */
  value: string;
  /** e.g. "less effort per cycle" */
  label: string;
}

/**
 * Mini-case for a phase (= Feature 01/02/03).
 * Illustrative example scenario — NO real customer data.
 * Rendered on its own detail page:
 *   /loesungen/:slug/case/:id  or  /industrien/:slug/case/:id
 */
export interface MiniCase {
  /** URL segment, e.g. "bmp-award" → .../case/bmp-award */
  id: string;
  /** Case number, e.g. "Case 01" */
  phaseLabel: string;
  /** Status tag, e.g. "Real project · BMP" or "Illustrative use case". */
  badge?: string;
  /** Disclaimer text in the scenario band (depending on case type). */
  disclaimer?: string;
  /** Short title — overview card + detail page */
  title: string;
  /** One-sentence teaser for the overview card */
  teaser: string;
  /** Short description of the fictional example setup, e.g. "Regional mid-market award, ~180 submissions/year" */
  scenario: string;
  /** Starting point / problem before NEWEDGE */
  situation: string;
  /** What is concretely done in this phase — steps */
  approach: string[];
  /** Outcome / success (running text) */
  result: string;
  /** ROI / success metrics (2–4) */
  metrics: MiniCaseMetric[];
  /** Optional quote */
  quote?: { text: string; author: string };
}

export interface IntegrationLogo {
  id: string;
  /** Display name / alt text */
  label: string;
  /** Path under /public, e.g. /integrations/sap.svg */
  src: string;
  /** Optional size override class (default: h-8 w-auto). E.g. set tight wordmarks smaller. */
  className?: string;
}

/* ──────────────────────────────────────────────────────────────
   Integration logo registry
   Files live under public/integrations/ (NewEdge_Logos_Paket).
   A matching selection is referenced per page below.
────────────────────────────────────────────────────────────── */
const LOGO = {
  calendly: { id: "calendly", label: "Calendly", src: "/integrations/calendly.svg" },
  datev: { id: "datev", label: "DATEV", src: "/integrations/datev.webp" },
  docusign: { id: "docusign", label: "DocuSign", src: "/integrations/docusign.svg" },
  freshdesk: { id: "freshdesk", label: "Freshdesk", src: "/integrations/freshdesk.webp" },
  googleAds: { id: "google-ads", label: "Google Ads", src: "/integrations/google_ads.svg" },
  googleAnalytics: { id: "google-analytics", label: "Google Analytics", src: "/integrations/google_analytics.svg" },
  googleWorkspace: { id: "google-workspace", label: "Google Workspace", src: "/integrations/google_workspace.webp" },
  hubspot: { id: "hubspot", label: "HubSpot", src: "/integrations/hubspot.svg" },
  instagram: { id: "instagram", label: "Instagram", src: "/integrations/instagram.svg" },
  intercom: { id: "intercom", label: "Intercom", src: "/integrations/intercom.webp" },
  lexoffice: { id: "lexoffice", label: "lexoffice", src: "/integrations/lexoffice.svg" },
  make: { id: "make", label: "Make", src: "/integrations/make_integromat.svg" },
  outlook: { id: "outlook", label: "Microsoft Outlook", src: "/integrations/microsoft_outlook.webp" },
  sharepoint: { id: "sharepoint", label: "Microsoft SharePoint", src: "/integrations/microsoft_sharepoint.webp" },
  teams: { id: "teams", label: "Microsoft Teams", src: "/integrations/microsoft_teams.webp" },
  notion: { id: "notion", label: "Notion", src: "/integrations/notion.webp" },
  personio: { id: "personio", label: "Personio", src: "/integrations/personio.svg" },
  salesforce: { id: "salesforce", label: "Salesforce", src: "/integrations/salesforce.svg" },
  sap: { id: "sap", label: "SAP", src: "/integrations/sap.svg" },
  shopify: { id: "shopify", label: "Shopify", src: "/integrations/shopify.svg" },
  stripe: { id: "stripe", label: "Stripe", src: "/integrations/stripe.svg" },
  woocommerce: { id: "woocommerce", label: "WooCommerce", src: "/integrations/woocommerce.webp" },
  zapier: { id: "zapier", label: "Zapier", src: "/integrations/zapier.svg" },
  zendesk: { id: "zendesk", label: "Zendesk", src: "/integrations/zendesk.svg" },
  zoom: { id: "zoom", label: "Zoom", src: "/integrations/zoom.svg", className: "h-5 w-auto" },
} as const satisfies Record<string, IntegrationLogo>;

export interface PainPointContent {
  slug: string;
  seo: {
    title: string;
    description: string;
    canonical: string;
  };
  hero: {
    overlabel: string;
    h1Line1: string;
    h1Line2Highlighted: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    imageNote: string;
    imageAlt: string;
    /** Page-specific hero image, if available — otherwise falls back to the shared chrome graphic. */
    image?: ImageKey;
  };
  trustBar: {
    headline: string;
    sub: string;
    logos: string[];
  };
  definition: {
    title: string;
    body: string;
  };
  feature1: FeatureBlock;
  feature2: FeatureBlock;
  feature3: FeatureBlock;
  integrations: {
    h2: string;
    h3?: string;
    sub: string;
    /** Logo selection for this page (public/integrations/) */
    logos?: IntegrationLogo[];
  };
  compare: {
    h2: string;
    h3?: string;
    altLabel: string; // "Manual", "Traditional agency", etc.
    rows: CompareRow[];
  };
  featureCards: {
    h2: string;
    h3?: string;
    cards: FeatureCard[];
  };
  testimonialHero: {
    quote: string;
    author: string;
  };
  faq: { q: string; a: string }[];
  /** Mini-cases per phase (Feature 01/02/03) — illustrative example scenarios. Optional: only pages with this set show the overview. */
  miniCases?: MiniCase[];
  /** Optional HowTo schema (JSON-LD) – automatically injected into <head> when set */
  howTo?: {
    name: string;
    description: string;
    /** ISO 8601 duration, e.g. "P14D" */
    totalTime: string;
    steps: { name: string; text: string }[];
  };
  closingCta: {
    h2Line1: string;
    h2Line2Highlighted: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
}

/* ──────────────────────────────────────────────────────────────
   PAIN POINT A — Selection process
────────────────────────────────────────────────────────────── */
const auswahlverfahren: PainPointContent = {
  slug: "auswahlverfahren",
  seo: {
    title: "Automate your selection process with AI | NEWEDGE Munich",
    description:
      "NEWEDGE automates your award or selection process — intake, jury scoring and audit-proof documentation. Far less admin effort per cycle, live in 2–4 weeks.",
    canonical: "/en/loesungen/auswahlverfahren",
  },
  hero: {
    overlabel: "AI AUTOMATION FOR AWARDS & SELECTION PROCESSES",
    h1Line1: "Your selection process —",
    h1Line2Highlighted: "without the administrative marathon.",
    sub:
      "This is how we automate decisions and case review. A single selection cycle eats up weeks of work — reviewing submissions, coordinating jurors, documenting everything. NEWEDGE automates the entire process right through to the audit-proof decision. You judge, the system handles the rest.",
    ctaPrimary: "Book a demo",
    ctaSecondary: "See the BMP Award case",
    imageNote:
      "Dashboard mockup: unstructured PDF stacks on the left, structured scoring dashboard with bars, categories and jury scores on the right. Transition animation. Purple accents.",
    imageAlt:
      "Before: unstructured PDF applications — after: structured AI scoring dashboard",
  },
  trustBar: {
    headline: "Trusted by leading organizations across Germany",
    sub: "Real results from selection processes like yours",
    logos: ["BMP Award", "Foundation", "Funding institute", "Association", "Chamber of commerce", "Accelerator", "Research institute"],
  },
  definition: {
    title: "What is automated selection-process software?",
    body:
      "A selection process ties up weeks in which no one decides — everyone administrates: reviewing submissions, coordinating the jury, documenting rationales. Automated selection-process software takes over exactly these three steps — your panel judges instead of sorts. That takes the administrative load out of every cycle and delivers decisions that hold up to any audit.",
  },
  feature1: {
    h2: "Never sort through PDF stacks again.",
    h3: "Every submission arrives structured — no matter what format it comes in",
    sub:
      "Applications land on your desk as PDFs, Word files and email attachments — and someone spends days making them comparable. NEWEDGE captures every submission automatically, checks it for completeness and files it as a comparable data sheet. From day one.",
    bullets: [
      "Automatic completeness check — missing documents stand out immediately",
      "Guided submission form — applicants deliver the right data from the start",
      "Everything in one place — no more digging through inboxes and folders",
    ],
    imageNote: "Animated mockup: PDFs → AI capture → structured form.",
    imageAlt: "AI-powered capture: PDFs are turned into structured application data sheets",
  },
  feature2: {
    h2: "No more chasing jurors on the phone.",
    h3: "The jury evaluates — coordination runs on its own",
    sub:
      "12 jurors, 4 weeks, an inbox full of follow-up questions — that's jury coordination today. NEWEDGE takes over briefings, reminders and consolidating the evaluations: up to 80% less effort. Everyone scores online at their own pace. You see in real time who's finished and where verdicts diverge.",
    bullets: [
      "Automatic reminders — no more missed deadlines",
      "A single scoring system — comparable evaluations instead of gut feeling",
      "Discrepancies visible instantly — where jurors disagree, you know first",
    ],
    imageNote: "Jury interface mockup with scoring and conflict badge.",
    imageAlt: "Jury interface with a scoring system and automatic conflict detection",
  },
  feature3: {
    h2: "Every decision is justified — automatically.",
    h3: "Audit-proof documentation, without anyone having to write it",
    sub:
      "A rejected applicant asks why. The board wants to understand the selection. Then only one thing counts: can you show, without a gap, how the decision was made? With NEWEDGE the answer is already there — every score, every comment, every decision documented automatically.",
    bullets: [
      "Gapless audit trail — who evaluated what, when and on what basis",
      "Rationale at the push of a button — for every applicant, every decision",
      "Knowledge is retained — the next cycle doesn't start from zero",
    ],
    imageNote: "Visual: audit-trail timeline of a decision with scores, comments and timestamps.",
    imageAlt: "Audit-proof decision documentation with a gapless audit trail",
  },
  integrations: {
    h2: "Connects with the tools you already use",
    h3: "Which tools can be integrated into your selection process?",
    sub: "Not a new system that replaces everything. NEWEDGE integrates into your existing infrastructure.",
    logos: [LOGO.docusign, LOGO.teams, LOGO.outlook, LOGO.sharepoint, LOGO.googleWorkspace, LOGO.notion, LOGO.calendly, LOGO.zoom, LOGO.zapier],
  },
  compare: {
    h2: "NEWEDGE vs. a manual selection process",
    h3: "AI-powered selection vs. classic application management — the direct comparison",
    altLabel: "Manual",
    rows: [
      { k: "Application intake", ne: "Structured & automatic", alt: "PDFs, emails, mixed formats" },
      { k: "Jury coordination", ne: "Fully automated", alt: "Endless email threads" },
      { k: "Comparability", ne: "One consistent category system", alt: "No common basis" },
      { k: "Decision documentation", ne: "Audit-proof & automatic", alt: "Barely exists" },
      { k: "Knowledge after the cycle", ne: "Retained permanently", alt: "Lost every year" },
      { k: "Analytics", ne: "Generated automatically", alt: "Not available" },
      { k: "Effort per cycle", ne: "Predictable & constant", alt: "Weeks of manual work" },
    ],
  },
  featureCards: {
    h2: "You judge. The system does the rest.",
    h3: "What NEWEDGE concretely takes over in your selection process",
    cards: [
      {
        title: "Automatic submission capture",
        desc: "Every application is captured automatically, checked for completeness and prepared as a comparable data sheet for the jury.",
        iconNote: "Animation: documents → structured data",
        icon: "ppa-icon-form",
      },
      {
        title: "Self-running jury coordination",
        desc: "Briefings, reminders, deadlines — all automatic. Your jurors evaluate instead of answering emails.",
        iconNote: "Animation: automatic briefings appear",
        icon: "ppa-icon-bell",
      },
      {
        title: "Audit-proof documentation",
        desc: "Every evaluation and decision is logged automatically — traceable for the board, applicants and auditors.",
        iconNote: "Animation: audit trail / lock",
        icon: "ppa-icon-db",
      },
    ],
  },
  testimonialHero: {
    quote:
      "What used to mean three months of work now runs automatically with NEWEDGE — and the quality of our decisions has demonstrably improved.",
    author: "BMP Award — Project lead",
  },
  faq: [
    {
      q: "How long does it take to implement an AI-powered selection process?",
      a: "Typically 2–4 weeks to the first live application cycle. Data migration and team training are included.",
    },
    {
      q: "Can we bring our existing scoring system into the software?",
      a: "Yes. NEWEDGE builds on your existing criteria and makes them directly usable in the system. You keep full control over the scoring logic.",
    },
    {
      q: "How does jury anonymity work in digital selection processes?",
      a: "Jury evaluations can be fully anonymized. Individual scores are only visible to defined roles — the aggregate is visible to everyone.",
    },
    {
      q: "Where is applicant data stored after the selection cycle?",
      a: "All data stays in your infrastructure. NEWEDGE can be hosted locally or in your cloud — full data sovereignty guaranteed.",
    },
  ],
  closingCta: {
    h2Line1: "Your next award cycle",
    h2Line2Highlighted: "almost runs itself.",
    sub: "Book a demo — we'll show you, on your own real process, what can be automated from day one.",
    ctaPrimary: "Book a demo",
    ctaSecondary: "See the BMP Award case",
  },
};


/* ──────────────────────────────────────────────────────────────
   PAIN POINT C — Documents & Processes · configured for Import/Export
   (Compliance is a use case of this area, not a category of its own.)
────────────────────────────────────────────────────────────── */
const compliance: PainPointContent = {
  slug: "compliance",
  seo: {
    title: "Automate foreign trade & compliance with AI | NEWEDGE",
    description:
      "NEWEDGE automates your foreign trade documents, shipment tracking and compliance screening against EU, UN and OFAC sanctions lists — before the goods roll.",
    canonical: "/en/loesungen/compliance",
  },
  hero: {
    overlabel: "DOCUMENTS & PROCESSES · CONFIGURED FOR IMPORT / EXPORT",
    h1Line1: "Foreign trade without",
    h1Line2Highlighted: "document chaos.",
    sub:
      "This is how we automate documents and processes — here configured for import and export. Documents in five languages, the freight forwarder by email, the customs agent by phone, compliance in Excel. NEWEDGE automates your entire foreign trade documentation — from capture to audit-proof compliance screening.",
    ctaPrimary: "Request an AI Audit",
    ctaSecondary: "Watch the demo",
    imageNote: "Document flow: various trade and customs documents → AI engine → structured shipment status.",
    imageAlt: "AI automates trade documents, shipment tracking and compliance screening",
    image: "pain-point-compliance-hero",
  },
  trustBar: {
    headline: "Trusted by importers and exporters across the DACH region",
    sub: "Real results from foreign trade processes like yours",
    logos: ["Importer", "Exporter", "Freight forwarder", "Wholesale", "Industry", "Trade", "Logistics"],
  },
  definition: {
    title: "What is AI-powered foreign trade automation?",
    body:
      "Documents & Processes is one of four standardized operating areas that all run on the same NEWEDGE infrastructure — on this page you see it configured for import and export. Foreign trade in mid-sized companies runs fragmented: documents in five languages, the freight forwarder by email, the customs agent by phone, compliance in Excel. On top of that, a flood of regulation is crushing you — from CBAM to the Supply Chain Due Diligence Act to constantly shifting sanctions rules. And mistakes are expensive: violations of the Foreign Trade and Payments Act (AWG) carry fines of up to €500,000 per incident — and with the 2026 AWG amendment, corporate fines of up to €40 million. AI-powered foreign trade automation captures every document, tracks every shipment status centrally and checks compliance automatically — before the goods roll.",
  },
  feature1: {
    h2: "No document slips through anymore — no matter the language.",
    h3: "From commercial invoice to certificate of origin — multilingual, automatic, processed in seconds.",
    sub:
      "Commercial invoice in English, packing list in Chinese, customs declaration in German. NEWEDGE captures every document automatically, assigns it to the right shipment and checks for completeness and contradictions. Inconsistencies are escalated immediately — not once the container is sitting at the port.",
    bullets: [
      "Automatic capture of all trade and customs documents",
      "Language-independent recognition and assignment",
      "Instant escalation on gaps, errors or contradictions",
    ],
    imageNote: "Scan animation: multilingual documents → AI extraction → structured shipment assignment.",
    imageAlt: "AI-powered document capture: multilingual, all formats, automatic",
  },
  feature2: {
    h2: "One dashboard instead of ten Excel sheets.",
    h3: "Freight forwarder, customs, warehouse, supplier — all on the same page, without chasing them by phone.",
    sub:
      "Where is the shipment? Does the freight forwarder have the documents? Has the customs declaration cleared? Anyone trying to answer those questions today is on the phone, in email and scrolling through spreadsheets. NEWEDGE centralizes the entire shipment status — freight forwarder, customs agent, warehouse, supplier — in one real-time dashboard. Everyone involved sees the same status, updated automatically.",
    bullets: [
      "Real-time shipment tracking across everyone involved",
      "Automatic status updates to freight forwarder, customs & internal team",
      "One platform instead of fragmented communication",
    ],
    imageNote: "Dashboard mockup: shipment status of everyone involved in one real-time view.",
    imageAlt: "Real-time shipment dashboard: everyone involved, one status, updated automatically",
  },
  feature3: {
    h2: "Compliance secured. Customs costs cut.",
    h3: "Sanctions lists, dual-use, preferences — checked and optimized before the goods roll.",
    sub:
      "Sanctions lists change monthly. Dual-use regulations vary by destination country. Overlooked preferential agreements cost real money. NEWEDGE checks every transaction automatically against EU, UN and OFAC lists, classifies dual-use goods and detects applicable free trade agreements. That protects against violations — up to €500,000 in fines, up to 15 years in prison for serious embargo breaches — and at the same time finds the cheapest legal tariff classification.",
    bullets: [
      "Real-time screening against sanctions lists, embargoes & dual-use",
      "Automatic preference check and customs cost optimization",
      "Audit-proof documentation for tax audits & BAFA",
    ],
    imageNote: "Compliance check: transaction → automatic screening → approval or escalation.",
    imageAlt: "Automatic compliance screening against sanctions lists with customs cost optimization",
  },
  integrations: {
    h2: "Connects with the tools you already use",
    h3: "SAP, ATLAS, Oracle, Dynamics, BEX, Descartes, CargoWise — directly connected.",
    sub: "SAP, ATLAS, Oracle, Microsoft Dynamics, BEX, Descartes, CargoWise — NEWEDGE integrates into your existing customs, ERP and logistics infrastructure. No system switch, no parallel operation: the system plugs in and checks in the background — without changing your workflow.",
    logos: [LOGO.sap, LOGO.datev, LOGO.docusign, LOGO.outlook, LOGO.sharepoint, LOGO.lexoffice, LOGO.salesforce, LOGO.zapier, LOGO.make],
  },
  compare: {
    h2: "NEWEDGE vs. a manual foreign trade process",
    h3: "Where manual processes cost time, money and legal certainty — and what AI concretely takes over.",
    altLabel: "Manual",
    rows: [
      { k: "Document capture",         ne: "Automatic, all languages & formats", alt: "Manual, error-prone" },
      { k: "Shipment transparency",    ne: "Real-time dashboard, everyone involved", alt: "Phone, email, Excel" },
      { k: "Compliance screening",     ne: "Real-time against EU, UN, OFAC",     alt: "Spot checks, often outdated" },
      { k: "Customs cost optimization", ne: "Preferences detected automatically",  alt: "Frequently overlooked" },
      { k: "Audit trail",              ne: "Complete, audit-proof",              alt: "Fragmented, full of gaps" },
      { k: "Risk on violation",        ne: "Minimized",                          alt: "Up to €500,000 fine (AWG)" },
    ],
  },
  featureCards: {
    h2: "Captured, synchronized, secured — without you lifting a finger.",
    h3: "Three building blocks of the same system — activate them individually or together.",
    cards: [
      {
        title: "Document automation",
        desc: "All formats, all languages — captured, assigned, validated automatically. Before the goods leave the warehouse.",
        iconNote: "Animation: multilingual documents are scanned and assigned",
        icon: "ppc-icon-scan",
      },
      {
        title: "Real-time transparency",
        desc: "Freight forwarder, customs, warehouse, supplier — one dashboard, one status, synchronized automatically.",
        iconNote: "Animation: shipment status of everyone involved in real time",
        icon: "ppc-icon-globe",
      },
      {
        title: "Compliance & cost optimization",
        desc: "Sanctions checked. Dual-use classified. Preferences used. Protection and savings in one.",
        iconNote: "Animation: compliance check with preference screening",
        icon: "ppc-icon-shield",
      },
    ],
  },
  testimonialHero: {
    quote:
      "We export to 23 countries — every shipment used to be flying blind. Since NEWEDGE we see in real time where every document stands, compliance runs automatically, and we save 14% in customs costs on average through preferences we used to overlook.",
    author: "Machinery manufacturer, DACH — Head of Export & Logistics",
  },
  faq: [
    {
      q: "Which sanctions lists and regulations does the system check automatically?",
      a: "The system checks in real time against EU, UN and OFAC sanctions lists, classifies dual-use goods under the EC Dual-Use Regulation and detects applicable free trade agreements for the preference check — automatically for every transaction.",
    },
    {
      q: "How high are the risks with manual compliance processes?",
      a: "Violations of the Foreign Trade and Payments Act (AWG) can carry fines of up to €500,000 per incident. With the 2026 AWG amendment, corporate fines of up to €40 million loom. For serious embargo breaches, sections 17/18 AWG even allow prison sentences of up to 15 years.",
    },
    {
      q: "Can the system be integrated into our existing ERP and customs software?",
      a: "Yes. NEWEDGE comes with preconfigured connectors for SAP, ATLAS, Oracle, Microsoft Dynamics, BEX, Descartes and CargoWise. No system switch, no parallel operation — the system plugs in and runs in the background.",
    },
    {
      q: "How long does implementation take?",
      a: "Typically 4–6 weeks: weeks 1–2 system connection and document training, weeks 3–4 pilot operation with real shipments, weeks 5–6 go-live. The whole process runs without interrupting ongoing operations.",
    },
    {
      q: "Are changes to sanctions lists and customs tariffs taken into account automatically?",
      a: "Yes. The system is continuously updated — changes flow automatically into all running screening processes. Your team doesn't have to maintain anything by hand.",
    },
  ],
  closingCta: {
    h2Line1: "Every violation you don't prevent",
    h2Line2Highlighted: "costs more than NEWEDGE for an entire year.",
    sub: "In a free AI Audit we show you where your foreign trade processes lose time and legal certainty.",
    ctaPrimary: "Request an AI Audit",
    ctaSecondary: "Watch the demo",
  },
};

/* ──────────────────────────────────────────────────────────────
   PAIN POINT D — KPI Dashboard
────────────────────────────────────────────────────────────── */
const kpiDashboard: PainPointContent = {
  slug: "kpi-dashboard",
  seo: {
    title: "Real-time KPI dashboard for mid-sized companies | NEWEDGE",
    description:
      "All your metrics in one real-time cockpit: ERP, CRM and finance connected — without an IT project. Role-specific views and alerts, live in under a week.",
    canonical: "/en/loesungen/kpi-dashboard",
  },
  hero: {
    overlabel: "FOR MID-MARKET MANAGING DIRECTORS",
    h1Line1: "Your dashboard shows you what happened yesterday.",
    h1Line2Highlighted: "Not what's happening right now.",
    sub:
      "This is how we automate steering and reporting. Making decisions on last week's numbers costs you reaction time you don't have. NEWEDGE connects ERP, CRM and finance into a real-time cockpit — configured individually, live in under a week. No new system. No IT projects.",
    ctaPrimary: "Book a 20-minute call — free",
    ctaSecondary: "See an example dashboard",
    imageNote:
      "Full dashboard mockup: revenue chart, pipeline KPIs, finance overview and alert feed. Purple accents, real-time pulse animation.",
    imageAlt: "Real-time KPI dashboard: ERP, CRM and finance in one central cockpit",
    image: "pain-point-kpi-dashboard-hero",
  },
  trustBar: {
    headline: "Trusted by mid-sized companies and enterprises across the DACH region",
    sub: "Real results from reporting processes like yours",
    logos: ["Mid-market", "Industry", "Enterprise", "Trade", "Service provider", "Consulting", "Manufacturing"],
  },
  definition: {
    title: "What is a KPI dashboard?",
    body:
      "A KPI dashboard shows all business-critical metrics in one central view — aggregated from ERP, CRM and finance tools, updated in real time, without manual entry. Mid-sized companies with 20–500 employees use it to make decisions on current data instead of in the weekly reporting meeting. The leverage is measurable: mid-market leaders spend an average of 4.5 hours per week on manual reporting. With a real-time dashboard, you catch critical deviations days earlier — not in next week's meeting.",
  },
  feature1: {
    h2: "Who told you these KPIs are the important ones?",
    h3: "Tailored KPIs instead of generic templates",
    sub:
      "Generic templates show what's technically possible — not what steers your business. NEWEDGE works with your leadership team to define the metrics that actually matter for operations, growth and steering. Every role — management, team leads, controlling — sees exactly what it needs.",
    bullets: [
      "KPIs for operations and growth — configured individually, not a generic template",
      "All relevant data sources connected — no manual import, no CSV export",
      "Role-specific views for management, team leads and controlling",
      "Make new KPIs measurable: hours saved, automated processes, error rates",
    ],
    imageNote: "Dashboard mockup with individual KPI categories and role-specific views.",
    imageAlt: "Individually configured KPI dashboard with role-specific views",
  },
  feature2: {
    h2: "You always find out a week too late.",
    h3: "Real-time data: spot KPI deviations before they cost money",
    sub:
      "With manual reporting, an average of 3–7 days pass between a deviation and its discovery. A real-time KPI dashboard closes that window to minutes: as soon as new data lands, the dashboard updates automatically — and flags deviations instantly via alert.",
    bullets: [
      "Automatic data refresh — no manual entry, no delay",
      "Visualizations by level — strategic for management, operational for teams",
      "Threshold alerts straight to the person responsible — via email, Slack or Teams",
      "One data foundation for every department — no more parallel truths",
    ],
    imageNote: "Alert feed and threshold configuration in the dashboard mockup.",
    imageAlt: "Real-time alerts on KPI deviations — instantly via email, Slack or Teams",
  },
  feature3: {
    h2: "Measuring isn't enough. Now what?",
    h3: "AI-powered KPI analysis: not just measure, but improve",
    sub:
      "Current values alone change nothing. The NEWEDGE KPI dashboard detects patterns, turns metrics into prioritized actions — and automatically measures whether they work.",
    bullets: [
      "AI recommendations for concrete improvement actions — with priority",
      "Automatic effectiveness tracking: action started — effect measured",
      "Integration into existing workflows — no system switch needed",
      "Regular review sessions with documented next steps",
    ],
    imageNote: "AI recommendations panel with prioritized actions and effectiveness tracking.",
    imageAlt: "AI-powered analysis: prioritized action recommendations from KPI data",
  },
  integrations: {
    h2: "You don't switch a single system.",
    h3: "Which systems can be connected to a KPI dashboard?",
    sub:
      "NEWEDGE connects to over 200 systems via API — ERP, CRM, finance, cloud and shop platforms. No system switch, no data migration, no double entry. Your system not on the list? REST API and webhooks connect any structured data source.",
    logos: [LOGO.sap, LOGO.salesforce, LOGO.hubspot, LOGO.googleAnalytics, LOGO.datev, LOGO.shopify, LOGO.stripe, LOGO.zapier, LOGO.make],
  },
  compare: {
    h2: "How much longer are you doing this in Excel?",
    h3: "KPI dashboard vs. manual reporting — the direct comparison",
    altLabel: "Manual reporting",
    rows: [
      { k: "Data freshness",              ne: "Real-time",                      alt: "3–7 days old" },
      { k: "Effort per week",             ne: "< 30 minutes",                   alt: "4–6 hours" },
      { k: "Early warning on deviations", ne: "Instantly via alert",            alt: "Next week" },
      { k: "Consistency of data basis",   ne: "One source for everyone",        alt: "Differs by team" },
      { k: "Effort as you grow",          ne: "Stays constant",                 alt: "Grows with company size" },
      { k: "Role-specific views",         ne: "Configured automatically",       alt: "Built manually" },
      { k: "AI recommendations",          ne: "Automatic, with priority",       alt: "Not available" },
      { k: "Setup effort",                ne: "One-time, < 1 week",             alt: "Ongoing" },
    ],
  },
  featureCards: {
    h2: "What actually changes — after week one.",
    h3: "What does a real-time KPI dashboard concretely deliver?",
    cards: [
      {
        title: "No more outdated numbers",
        desc: "All KPIs update automatically as soon as new data lands. No copy-pasting numbers together, no waiting for the weekly report.",
        iconNote: "Icon: real-time pulse / live indicator",
      },
      {
        title: "Early warning instead of surprises",
        desc: "You define thresholds — the dashboard speaks up on its own. With automated alerts, you react far faster when a metric goes off track.",
        iconNote: "Icon: alert bell / early-warning system",
      },
      {
        title: "Every role sees what it needs",
        desc: "Role-based views show each user exactly the metrics they need for decisions — nothing more.",
        iconNote: "Icon: user roles / personas",
      },
      {
        title: "AI shows what's worth changing",
        desc: "The system detects patterns in your data — seasonal anomalies, cost outliers, efficiency gaps — and delivers recommendations with priority.",
        iconNote: "Icon: AI lightbulb / recommendations",
      },
      {
        title: "Set up in under a week",
        desc: "NEWEDGE handles the entire configuration — from API connection to role-specific view. Team onboarding takes 60 minutes. Standard setups go live in 3–5 business days.",
        iconNote: "Icon: calendar / quick setup",
      },
      {
        title: "One data foundation for everyone",
        desc: "Finance has different numbers than sales? That's over. Every department draws on the same, automatically synchronized data source. No more debates about data quality.",
        iconNote: "Icon: unified database / single source of truth",
      },
    ],
  },
  testimonialHero: {
    quote:
      "We always spent 90 minutes every Monday pulling numbers together. Now I glance at the dashboard in the morning — and know more than I used to after half the morning.",
    author: "Managing director — mid-sized company, Germany",
  },
  faq: [
    {
      q: "What's the difference between a KPI dashboard and Power BI or Tableau?",
      a: "Power BI and Tableau are general BI tools that require technical know-how to configure and maintain. The NEWEDGE KPI dashboard comes fully configured, tailored to the company and continuously supported — without in-house BI expertise, without an IT project, without per-user license fees.",
    },
    {
      q: "Which systems can be connected to a KPI dashboard?",
      a: "A professional KPI dashboard connects via API to ERP systems (SAP, Navision, Lexware), CRM systems (Salesforce, HubSpot, Pipedrive), finance tools (DATEV, Agenda), cloud services (Microsoft 365, Google Workspace) and shop systems (Shopify, Shopware). NEWEDGE supports over 200 systems without data migration.",
    },
    {
      q: "How long does it take to set up a KPI dashboard?",
      a: "Standard configurations with two to three data sources go live in 3–5 business days. Setups with custom KPIs and multiple locations take 2–4 weeks. A dedicated contact throughout the entire setup.",
    },
    {
      q: "Can every role get its own KPI views?",
      a: "Yes — role-based views are standard at no extra charge. Management sees strategic KPIs, team leads operational figures, controlling all raw data with drill-downs. Access rights are assigned granularly per user.",
    },
    {
      q: "What does a real-time KPI dashboard cost?",
      a: "Costs depend on data sources, number of users and configuration scope. After the free setup call you get an individual quote — without hidden per-user license fees.",
    },
    {
      q: "Who supports the dashboard after go-live?",
      a: "NEWEDGE handles ongoing maintenance, updates and adjustments. A dedicated contact — not a ticket system.",
    },
    {
      q: "How does a KPI dashboard for mid-sized companies differ from enterprise BI solutions?",
      a: "Enterprise BI solutions like SAP Analytics Cloud or Microsoft Fabric are built for large IT departments. The NEWEDGE KPI dashboard is for mid-sized companies: setup in under a week, a fixed monthly rate, no dedicated BI team needed.",
    },
  ],
  closingCta: {
    h2Line1: "30 minutes. Then you'll know",
    h2Line2Highlighted: "whether it fits.",
    sub: "No contract. No IT project. Setup including ongoing support.",
    ctaPrimary: "Book a demo",
    ctaSecondary: "See an example dashboard",
  },
};

/* ──────────────────────────────────────────────────────────────
   PAIN POINT E — AI customer support
────────────────────────────────────────────────────────────── */
const kiKundensupport: PainPointContent = {
  slug: "ki-kundensupport",
  seo: {
    title: "AI customer support: 80% solved in seconds | NEWEDGE Munich",
    description:
      "The AI agent solves 80% of all support requests in under 30 seconds — cutting cost per request from €12 to under €1. Complex cases routed with full context.",
    canonical: "/en/loesungen/ki-kundensupport",
  },
  hero: {
    overlabel: "AI AUTOMATION FOR CUSTOMER SUPPORT",
    h1Line1: "80% of requests solved.",
    h1Line2Highlighted: "Instantly. Automatically.",
    sub:
      "This is how we automate service and case handling. Support doesn't scale with your growth — and neither do headcounts. NEWEDGE builds your complete support funnel: AI solves 80% of all requests in under 30 seconds, the rest lands with the right person with full context. Cost per request drops from €12 to under €1. Around the clock, in your brand voice.",
    ctaPrimary: "Request a support audit",
    ctaSecondary: "Test the AI agent",
    imageNote:
      "Chat interface: request → AI answers (2 sec) → 'Solved' | complex request → routing with context badge.",
    imageAlt: "AI support agent solves requests in under 30 seconds with intelligent routing",
    image: "pain-point-kundensupport-hero",
  },
  trustBar: {
    headline: "Trusted by support teams across DACH",
    sub: "Real results from support funnels like yours",
    logos: ["E-commerce", "SaaS", "Service", "Platform", "Manufacturer", "Marketplace", "Service provider"],
  },
  definition: {
    title: "What is an AI-powered customer support funnel?",
    body:
      "An AI-powered customer support funnel solves simple requests automatically (up to 80% of all tickets) and routes complex cases with full context to human agents. Cost per support request drops from an average of €12 to under €1 — with higher customer satisfaction at the same time.",
  },
  feature1: {
    h2: "80% solved. Instantly. Without human intervention.",
    h3: "AI support agent: solve standard requests automatically, around the clock",
    sub:
      "Order status, returns, FAQs, standard complaints — that's 80% of all requests. NEWEDGE solves them automatically, in under 30 seconds, in your brand voice. Your team only gets the 20% that truly need human expertise.",
    bullets: [
      "Response time under 30 seconds — around the clock",
      "Trained on your brand voice and knowledge base",
      "Continuously learns from every interaction",
    ],
    imageNote: "Chat mockup: request → AI answer in 2 seconds → 'Solved'.",
    imageAlt: "AI support agent answers standard requests in seconds",
  },
  feature2: {
    h2: "Complex cases — routed with full context.",
    h3: "Intelligent routing: the human takes over — fully briefed",
    sub:
      "When the AI agent hands off, it gives the agent the complete conversation history, the customer's history and an assessment of urgency. No repetition for the customer. No lost information. Unhappy customers are prioritized automatically.",
    bullets: [
      "Intelligent routing — to the right agent",
      "Full context — no repetition",
      "Sentiment detection — unhappy customers are prioritized",
    ],
    imageNote: "Handoff from AI agent to human agent with context badge.",
    imageAlt: "Intelligent routing of complex cases with full conversation context",
  },
  feature3: {
    h2: "Support as product intelligence.",
    h3: "Every request is a signal: support data as a strategic resource",
    sub:
      "Every support request is a signal. NEWEDGE automatically analyzes which problems are piling up — and what that says about your product. Companies that systematically evaluate support data reduce recurring errors by an average of 40% within a quarter.",
    bullets: [
      "Automatic trend analysis — which problems are piling up",
      "Direct product insights from support data",
      "Automated customer satisfaction tracking",
    ],
    imageNote: "Heatmap of the most common problems + CSAT trend line.",
    imageAlt: "Support data as product intelligence with trend analysis and CSAT tracking",
    image: "pain-point-kundensupport-feature3",
  },
  integrations: {
    h2: "Connects with your support software",
    h3: "Which support software can the AI agent connect to?",
    sub: "Native integrations for Zendesk, Freshdesk, Intercom — plus API connection for other systems.",
    logos: [LOGO.zendesk, LOGO.intercom, LOGO.freshdesk, LOGO.hubspot, LOGO.salesforce, LOGO.teams, LOGO.outlook, LOGO.instagram, LOGO.zapier],
  },
  compare: {
    h2: "NEWEDGE AI support vs. a classic support team",
    h3: "AI support vs. a classic team — the cost comparison",
    altLabel: "Classic",
    rows: [
      { k: "Availability", ne: "24/7", alt: "Office hours" },
      { k: "Response time", ne: "Under 30 seconds", alt: "Hours to days" },
      { k: "Capacity", ne: "Unlimited", alt: "Limited by team size" },
      { k: "Consistency", ne: "Always the same quality", alt: "Depends on agent + daily form" },
      { k: "Cost per ticket", ne: "Under €1", alt: "Avg. €12" },
      { k: "Product insights", ne: "Generated automatically", alt: "Manual, rarely evaluated" },
    ],
  },
  featureCards: {
    h2: "Solved, routed, evaluated — automatically.",
    h3: "What an AI customer support funnel delivers in your operation",
    cards: [
      {
        title: "AI support agent",
        desc: "Solves 80% of all requests. Instantly. In your language.",
        iconNote: "Animation: AI answers instantly",
        icon: "ppe-icon-speed",
      },
      {
        title: "Intelligent routing",
        desc: "Complex cases to the right person with full context.",
        iconNote: "Animation: chat → agent with context badge",
        icon: "ppe-icon-route",
      },
      {
        title: "Support intelligence",
        desc: "Your support becomes product research.",
        iconNote: "Animation: most common problems as a heatmap",
        icon: "ppe-icon-analytics",
      },
    ],
  },
  testimonialHero: {
    quote:
      "We cut our ticket costs by 87% and CSAT scores rose at the same time. The AI agent sounds like our team — just available around the clock.",
    author: "DACH e-commerce — Head of Customer Service",
  },
  faq: [
    {
      q: "In which languages can the AI support agent be configured?",
      a: "German, English and all other common languages — configurable to your customer base. Multilingual within the same interface.",
    },
    {
      q: "How is the AI agent trained on our products and brand voice?",
      a: "We train on your knowledge base, FAQs, tone of voice and previous support conversations. Onboarding: 2–3 weeks to productive use.",
    },
    {
      q: "What happens when the AI customer support agent can't solve a request?",
      a: "Automatic handoff with full conversation context and prioritization to your team. The customer doesn't have to repeat their issue.",
    },
    {
      q: "Which support software can the AI agent be integrated with?",
      a: "Native integrations for Zendesk, Freshdesk, HubSpot Service Hub, Intercom — plus API connection for other systems.",
    },
  ],
  closingCta: {
    h2Line1: "Your next customer",
    h2Line2Highlighted: "gets an answer in 30 seconds.",
    sub: "Around the clock. In your voice.",
    ctaPrimary: "Test the AI agent",
    ctaSecondary: "Request a support audit",
  },
};

/* ──────────────────────────────────────────────────────────────
   INDUSTRY 1 — Decision-making bodies
────────────────────────────────────────────────────────────── */
const entscheidungsinstanzen: PainPointContent = {
  slug: "entscheidungsinstanzen",
  seo: {
    title: "Evaluation software for juries, funding & awarding bodies | NEWEDGE",
    description:
      "Audit-proof application, selection and awarding processes for funding bodies, juries and universities — GDPR-compliant, VgV/UVgO-ready, locally hostable.",
    canonical: "/en/industrien/entscheidungsinstanzen",
  },
  hero: {
    overlabel: "FOR FUNDING BODIES · AWARDS · UNIVERSITIES · AWARDING BODIES",
    h1Line1: "You decide about others.",
    h1Line2Highlighted: "Who decides for you?",
    sub:
      "This is how an AI department changes funding and decision processes. Hundreds of applications and submissions, a panel with limited time, criteria and guidelines that everyone interprets differently — and, in the end, a decision you have to defend. NEWEDGE gives funding institutions, awards, universities and awarding bodies the same decision function, configured for their own rulebook: structured, fair, audit-proof.",
    ctaPrimary: "Book a demo",
    ctaSecondary: "See the BMP Award case",
    imageNote:
      "Visual: stack of unstructured submissions → structured panel cockpit with scoring, audit trail and comparability.",
    imageAlt: "Before: submission chaos — after: structured decision cockpit",
    image: "pain-point-entscheidungsinstanzen-hero",
  },
  trustBar: {
    headline: "Trusted by decision-making bodies across Germany",
    sub: "Awards, universities, funding institutions, awarding bodies, associations",
    logos: ["BMP Award", "University", "Funding institution", "Awarding body", "Association"],
  },
  definition: {
    title: "What is AI-powered evaluation software for panels?",
    body:
      "AI-powered evaluation software captures applications and submissions automatically, guides the panel through a consistent review and evaluation process and documents every decision in an audit-proof way. Funding bodies, awarding bodies, universities and award organizations take the coordination load off their panels — and can justify every decision without a gap, from the first evaluation to the final notice.",
  },
  feature1: {
    h2: "The same standard for every submission.",
    h3: "No more \"every reviewer reads it differently\"",
    sub:
      "Twelve evaluators, twelve standards — one strict, another generous, each going by gut feeling. NEWEDGE sets the same scoring logic for everyone: the same criteria, the same weighting, the same scale. The result is comparable, traceable — and fair to every applicant.",
    bullets: [
      "Consistent criteria & weighting — identical for all submissions",
      "Discrepancies visible — where jurors differ strongly, it stands out immediately",
      "Anonymization optional — evaluation without name, origin or institution",
    ],
    imageNote: "Visual: the same criteria matrix across multiple submissions, one consistent scale.",
    imageAlt: "Consistent evaluation matrix for all submissions in a process",
  },
  feature2: {
    h2: "Your panel evaluates. We handle the rest.",
    h3: "Your experts should judge — not juggle appointments",
    sub:
      "Your reviewers and jurors are experts, not project managers. Yet their time goes into searching for documents, tracking deadlines and consolidating evaluations. NEWEDGE handles all of that automatically — so your experts do exactly what you brought them in for: making expert judgments.",
    bullets: [
      "Automatic briefings & deadline reminders for everyone involved",
      "Every member evaluates online, location-independent, at their own pace",
      "All evaluations consolidated automatically — no manual Excel merge",
    ],
    imageNote: "Visual: evaluation interface with individual scores + automatic aggregation.",
    imageAlt: "Evaluation interface with aggregation and conflict detection",
    image: "pain-point-entscheidungsinstanzen-feature2",
  },
  feature3: {
    h2: "Every decision holds up to any audit.",
    h3: "Documented audit-proof — automatically, from day one",
    sub:
      "A rejected applicant files an objection. A supervisory authority asks. The audit court reviews. In that moment only one thing counts: can you show, without a gap, how and why the decision was made? With NEWEDGE the documentation is already there — every score, every comment, every step stored traceably.",
    bullets: [
      "Complete audit trail — who, when, on what basis",
      "VgV- and UVgO-compliant awarding documentation",
      "Rationale at the push of a button — for objections, oversight and internal review",
    ],
    imageNote: "Visual: audit-trail timeline of a decision with all steps and evaluations.",
    imageAlt: "Audit-proof decision documentation with an audit trail",
  },
  integrations: {
    h2: "Connects with the systems you already use.",
    h3: "Which systems can be integrated into decision processes?",
    sub: "Not a system that replaces everything. NEWEDGE integrates into your existing infrastructure.",
    logos: [LOGO.docusign, LOGO.teams, LOGO.outlook, LOGO.sharepoint, LOGO.googleWorkspace, LOGO.notion, LOGO.calendly, LOGO.zoom, LOGO.personio],
  },
  compare: {
    h2: "NEWEDGE vs. a manual decision process",
    h3: "Structured decision infrastructure vs. a manual process — the direct comparison",
    altLabel: "Manual",
    rows: [
      { k: "Application & submission capture", ne: "Structured, automatic, consistent", alt: "PDFs, emails, mixed formats" },
      { k: "Panel coordination", ne: "Fully automated", alt: "Endless email threads" },
      { k: "Evaluation standard", ne: "Consistent for everyone involved", alt: "Each person interprets differently" },
      { k: "Decision documentation", ne: "Audit-proof, automatic", alt: "Barely present or full of gaps" },
      { k: "Knowledge after the cycle", ne: "Retained permanently", alt: "Lost every time" },
      { k: "Ability to handle objections", ne: "Complete audit trail", alt: "Hard to reconstruct" },
      { k: "Effort per process", ne: "Predictable, constant", alt: "Weeks of manual coordination" },
    ],
  },
  featureCards: {
    h2: "Your panel judges. We handle the rest.",
    h3: "What NEWEDGE concretely takes over for your panel",
    cards: [
      {
        title: "Consistent evaluation",
        desc: "Every submission is evaluated by the same criteria — comparable, anonymizable and fair to every applicant.",
        iconNote: "Icon: documents → structured data sheet",
        icon: "i1-icon-erfassung",
      },
      {
        title: "Self-running panel coordination",
        desc: "Briefings, deadlines and evaluation rounds run automatically. Your panel judges instead of administrating.",
        iconNote: "Icon: calendar + people network",
        icon: "i1-icon-aggreg",
      },
      {
        title: "Audit-proof documentation",
        desc: "Every step is stored traceably — VgV/UVgO-compliant and ready for objections, oversight and the audit court.",
        iconNote: "Icon: audit trail / lock",
        icon: "i1-icon-audit",
      },
    ],
  },
  testimonialHero: {
    quote:
      "What used to mean three months of coordination now runs automatically with NEWEDGE — and the quality of our decisions has demonstrably improved.",
    author: "Project lead — Best Migration Practice Award",
  },
  faq: [
    {
      q: "How long does it take to set up an AI evaluation system?",
      a: "Usually 1–2 weeks — including import of existing criteria catalogs, configuration of the weightings and a test phase with real application documents. Pilot projects usually go live within 14 days.",
    },
    {
      q: "Can we bring over our existing evaluation criteria?",
      a: "Yes. The system adopts existing criteria catalogs and weighting matrices in full. You define the logic — the AI agent applies it consistently to all submissions, without any interpretation of its own. The same holds for funding guidelines and thresholds: you define the rule set, the system applies it to every application in the same way.",
    },
    {
      q: "Is the evaluation anonymous for applicants?",
      a: "Anonymization is configurable. Names, institutions and personal characteristics are masked before evaluation. That reduces unconscious bias and strengthens acceptance of the results.",
    },
    {
      q: "Is the system GDPR-compliant and locally hostable?",
      a: "Yes. The system is fully GDPR-compliant and can run on local infrastructure or in a German private cloud. No data leaves your environment. BSI-compliant operating models are available for public institutions.",
    },
    {
      q: "Is the system also suitable for public awarding procedures?",
      a: "Yes. The system supports structured awarding processes under VgV and UVgO. All evaluation steps are documented without gaps and are audit-proof and traceable — a requirement that is mandatory for public tenders.",
    },
  ],
  howTo: {
    name: "Set up an AI evaluation system for decision-making bodies",
    description:
      "Three steps to a structured, traceable review and selection process — for funding bodies, juries, universities and awarding bodies.",
    totalTime: "P14D",
    steps: [
      {
        name: "Import the criteria and guideline catalog",
        text: "Existing evaluation matrices, funding guidelines and weighting logics are adopted directly. No new development necessary.",
      },
      {
        name: "Pilot run with test data",
        text: "The AI agent evaluates a selection of historical submissions. Results are compared against manual evaluations and calibrated.",
      },
      {
        name: "Productive operation & audit log",
        text: "All evaluations run through the system, documented. Jury members and panels receive structured reports, not black-box decisions.",
      },
    ],
  },
  closingCta: {
    h2Line1: "Your responsibility is great.",
    h2Line2Highlighted: "Your administrative effort doesn't have to be.",
    sub: "Book a demo — we'll show you, on your own process, what can be automated.",
    ctaPrimary: "Book a demo",
    ctaSecondary: "See the BMP Award case",
  },
};

/* ──────────────────────────────────────────────────────────────
   INDUSTRY 2 — Health Care
────────────────────────────────────────────────────────────── */
const localDigitalCommerce: PainPointContent = {
  slug: "health-care",
  seo: {
    title: "Automate practice management for medical practices | NEWEDGE",
    description:
      "NEWEDGE automates your practice's scheduling and billing: cut no-shows by 25–30%, keep billing errors under 2%, EHR integration in 1–2 business days.",
    canonical: "/en/industrien/health-care",
  },
  hero: {
    overlabel: "FOR MEDICAL PRACTICES · MEDICAL CENTERS · THERAPISTS",
    h1Line1: "Automate practice management —",
    h1Line2Highlighted: "scheduling and billing on autopilot",
    sub:
      "The same system as in every other industry, configured for day-to-day practice work. Your practice is growing — but missed appointments and billing errors cost you revenue every month. NEWEDGE fully automates scheduling and billing, so you can focus on patient care.",
    ctaPrimary: "Book a free practice check",
    ctaSecondary: "Watch the demo",
    imageNote: "Visual: practice dashboard with scheduling, no-show rate and billing status.",
    imageAlt: "Automated practice management: scheduling and billing in one cockpit",
    image: "pain-point-health-care-hero",
  },
  trustBar: {
    headline: "Trusted by medical practices, medical centers and therapists across the DACH region",
    sub: "Medical practices, medical centers, specialist practices, therapists",
    logos: ["Medical practice", "Medical center", "Specialist", "Therapist", "Group practice"],
  },
  definition: {
    title: "What is automated practice management for healthcare providers?",
    body:
      "Automated practice management is the rule-based control of scheduling, patient communication and billing through AI-powered systems — without manual intervention. It connects existing EHR/EMR systems with automated reminder flows and statutory/private-insurance-compliant coding, reduces no-shows by 25–30% and cuts the billing error rate to under 2%.",
  },
  feature1: {
    h2: "Empty chairs cost money. Every day.",
    h3: "Automate scheduling in medical practices — reduce no-shows systematically",
    sub:
      "Missed appointments and last-minute cancellations cost practices with three or more providers an average of €2,000–4,000 per month. NEWEDGE reduces no-shows by 25–30% and shows capacity and optimization potential in real time. Configured per provider and service type, connected to your existing EHR/EMR via API.",
    bullets: [
      "Automatic appointment reminders by SMS, email and voice message",
      "Real-time appointment tracking and capacity analytics",
      "Individual scheduling templates per provider and service type",
      "API integration with existing EHR/EMR systems",
    ],
    imageNote: "Visual: appointment calendar with automatic reminders and no-show rate.",
    imageAlt: "Automated scheduling system for medical practices with no-show reduction",
  },
  feature2: {
    h2: "Billing errors usually only surface at year-end.",
    h3: "Automate billing in medical practices — statutory/private-insurance-compliant, under 2% error rate",
    sub:
      "Health insurance billing codes are complex; every manual step raises the risk of error — and lowers the amount actually reimbursed. NEWEDGE automates billing from service delivery to payment: rule-based, compliant, without rework.",
    bullets: [
      "Automatic coding and billing by appointment type and duration",
      "Real-time eligibility check and pre-authorization",
      "Individual billing rules per payer and tariff",
      "Complete reporting on billing status and revenue cycle",
    ],
    imageNote: "Visual: billing dashboard with error rate and billing status.",
    imageAlt: "Automated billing process with statutory/private-insurance-compliant coding",
  },
  feature3: {
    h2: "No practice is like any other. Neither is yours.",
    h3: "Configure practice management individually — for medical practices, medical centers and therapists",
    sub:
      "Every practice has its own mix of services, appointment types and referral processes. So we don't build anything new — we configure the same system for your context: integrated into existing workflows, growing with your practice, without a system switch.",
    bullets: [
      "Individual appointment types and durations (single appointments, treatments, initial consultations, follow-ups)",
      "Referral management internal and external, incl. cooperation with other practices",
      "Configurable for your service mix and your specialties",
      "Scalable as the practice grows and requirements change",
    ],
    imageNote: "Visual: configuration overview with appointment types, providers and service types.",
    imageAlt: "Individually configured practice management for different specialties",
  },
  integrations: {
    h2: "You don't switch a single system.",
    h3: "Which practice software and billing systems does automated practice management work with?",
    sub:
      "NEWEDGE integrates via API with common EHR/EMR systems, billing platforms and communication tools — without data migration, without an IT project, without double entry.",
    logos: [LOGO.calendly, LOGO.outlook, LOGO.googleWorkspace, LOGO.docusign, LOGO.zoom, LOGO.datev, LOGO.personio, LOGO.notion, LOGO.zapier],
  },
  compare: {
    h2: "How much longer are you doing this by hand?",
    h3: "Automated practice management vs. manual operation — the direct comparison",
    altLabel: "Manual operation",
    rows: [
      { k: "No-show rate", ne: "Under 5%", alt: "12–18%" },
      { k: "Billing error rate", ne: "Under 2%", alt: "8–15%" },
      { k: "Admin effort/week", ne: "Under 45 minutes", alt: "6–8 hours" },
      { k: "Appointment reminders", ne: "Automatic by SMS, email, voice", alt: "Manual or non-existent" },
      { k: "Reaction time on cancellations", ne: "Instant — slot reassigned automatically", alt: "Next business day" },
      { k: "Billing status", ne: "Real-time overview", alt: "Checked weekly" },
      { k: "Compliance certainty", ne: "Ensured rule-based", alt: "Checked manually" },
      { k: "Setup effort", ne: "One-time, under a week", alt: "Ongoing" },
    ],
  },
  featureCards: {
    h2: "What actually changes — after week one.",
    h3: "What does automated practice management concretely deliver for medical practices?",
    cards: [
      {
        title: "No-shows announce themselves — you react before they happen",
        desc: "The system reminds patients automatically by SMS, email or voice message. Cancellations come in earlier, the slot is reassigned automatically. No-show rates drop by 25–30% — without manual intervention. (MGMA, 2024)",
        iconNote: "Icon: calendar + automatic reminder",
      },
      {
        title: "Billing without rework",
        desc: "Every service delivered is automatically assigned to the correct billing code — by appointment type, provider and payer. No forgotten items, no wrong codes. Error rate under 2%. (AMA, 2023)",
        iconNote: "Icon: billing + checkmark",
      },
      {
        title: "Every role sees what it needs",
        desc: "Practice management sees capacity and revenue. Reception sees the daily plan and open slots. Billing sees the status of all submitted services. Role-based views — configured at setup.",
        iconNote: "Icon: user roles / personas",
      },
      {
        title: "Single practice or medical center — same solution, different configuration",
        desc: "Single practice, medical center, specialist practice with multiple locations — NEWEDGE configures itself accordingly. Referrals, cooperations, external providers: all mapped, all automated.",
        iconNote: "Icon: practice network",
      },
      {
        title: "Set up in under a week — without an IT project",
        desc: "NEWEDGE handles the entire configuration — from EHR connection to role-specific view. Team onboarding: 60 minutes. Standard setups go live in 3–5 business days.",
        iconNote: "Icon: calendar / quick setup",
      },
      {
        title: "Booking runs — even outside office hours",
        desc: "Online booking, automatic confirmation, reminder, follow-up on cancellation. The entire appointment cycle runs without manual intervention — even outside office hours.",
        iconNote: "Icon: clock / 24-7",
      },
    ],
  },
  testimonialHero: {
    quote:
      "We spent 45 minutes every morning tracking cancellations and reassigning slots. Since we introduced the system, that runs automatically — our no-show rate has dropped from 14% to under 4%.",
    author: "Practice management — medical practice, Munich",
  },
  faq: [
    {
      q: "What is automated practice management — and what is it not?",
      a: "Automated practice management replaces manual steps in scheduling and billing with rule-based, AI-powered processes. Not a new practice management system — but automation that plugs into your existing EHR/EMR.",
    },
    {
      q: "Does this work with our existing practice management system?",
      a: "Yes. NEWEDGE connects via API to common systems — Medistar, Tomedo, Turbomed, CGM ALBIS and others. No data migration, no system switch. Standard integrations go live in 1–2 business days.",
    },
    {
      q: "How long does it take to set up automated practice management?",
      a: "Standard setups with scheduling and billing automation: 3–5 business days. Team onboarding: 60 minutes. Setups with multiple locations or individual billing rules: 2–3 weeks.",
    },
    {
      q: "What does automated practice management cost?",
      a: "Costs depend on practice size, number of providers and system connections. After the free practice check you get an individual quote — no per-user license fees.",
    },
    {
      q: "Is automated practice management GDPR-compliant?",
      a: "Yes. Patient data is processed exclusively on German servers and not passed on to third parties. Data processing agreement on request.",
    },
    {
      q: "Who supports the system after go-live?",
      a: "NEWEDGE. A dedicated contact, ongoing maintenance, updates and adjustments included. No ticket system.",
    },
  ],
  howTo: {
    name: "Automate practice management: setup in 3 steps",
    description:
      "How NEWEDGE sets up automated practice management for medical practices — from EHR connection to go-live in under a week.",
    totalTime: "P5D",
    steps: [
      {
        name: "Practice check: analyze systems and processes",
        text: "Free 20-minute call: inventory of EHR/EMR systems, scheduling and billing. Result: a clear picture of the current state, no-show sources and error potential — with immediate feedback.",
      },
      {
        name: "Configuration and API integration",
        text: "NEWEDGE configures appointment reminder rules, billing coding per statutory/private-insurance requirements and role-based views for practice management, reception and billing. API connection to the existing EHR/EMR system: 1–2 business days.",
      },
      {
        name: "Go-live and team onboarding",
        text: "60-minute onboarding for the practice team. The system goes live. Standard setups are fully active 3–5 business days after the first call — with no further IT effort.",
      },
    ],
  },
  closingCta: {
    h2Line1: "20 minutes. Then you'll know",
    h2Line2Highlighted: "what your back office is costing you.",
    sub: "We analyze your current scheduling and billing situation and show you what's immediately actionable.",
    ctaPrimary: "Book a free practice check",
    ctaSecondary: "Watch the demo",
  },
};

/* ──────────────────────────────────────────────────────────────
   INDUSTRY 3 — Trade & Supply Chain
────────────────────────────────────────────────────────────── */
const handelSupplyChain: PainPointContent = {
  slug: "handel-supply-chain",
  seo: {
    title: "Automate trade & supply chain with AI | NEWEDGE",
    description:
      "NEWEDGE automates order processing, supplier scoring and goods receipt inspection — from email, EDI or portal straight into your ERP, without media breaks.",
    canonical: "/en/industrien/handel-supply-chain",
  },
  hero: {
    overlabel: "FOR TRADE, PROCUREMENT & SUPPLY CHAIN",
    h1Line1: "Supply chain without",
    h1Line2Highlighted: "media breaks.",
    sub:
      "The same system as in every other industry, configured for purchasing and the supply chain. Orders by email, supplier evaluation in Excel, goods receipt on a clipboard. NEWEDGE automates your entire supply chain — from the order to goods receipt inspection, data-driven and in real time.",
    ctaPrimary: "Request an AI Audit",
    ctaSecondary: "Watch the demo",
    imageNote: "Visual: incoming order → AI processing → ERP handover and supplier scoring.",
    imageAlt: "AI automates order processing, supplier evaluation and goods receipt",
    image: "pain-point-handel-supply-chain-hero",
  },
  trustBar: {
    headline: "Trusted by mid-sized trade and logistics companies across DACH",
    sub: "Wholesale, procurement, logistics, D2C",
    logos: ["Wholesale", "Procurement", "Logistics", "Trade", "D2C"],
  },
  definition: {
    title: "How AI secures the value chain in trade",
    body:
      "In trade, speed, accuracy and transparency decide the margin. Yet most mid-sized companies see the greatest need to digitize in supplier management and order fulfillment — many still have no digital processes for it at all. And disrupted supply chains drive up costs. AI automation closes that gap: ordering processes, supplier communication and goods receipt inspection run data-driven — in real time, without media breaks.",
  },
  feature1: {
    h2: "Orders processed before anyone opens the email.",
    h3: "Email, portal, EDI or PDF — every order captured, extracted, handed over. Without typos.",
    sub:
      "Orders arrive by email, portal, EDI or PDF. NEWEDGE captures every order automatically, extracts article numbers, quantities, delivery dates and terms — and pushes them straight into the ERP. No manual entry, no typos, no forgotten order.",
    bullets: [
      "Automatic capture of all order formats",
      "Data extraction and ERP handover in real time",
      "Instant escalation on discrepancies or missing data",
    ],
    imageNote: "Visual: incoming order by email/EDI → AI extraction → ERP handover.",
    imageAlt: "Automatic order processing: all formats, straight into the ERP",
  },
  feature2: {
    h2: "Evaluate suppliers. Automatically. Objectively.",
    h3: "All supplier data from goods receipt, quality and complaints — one ongoing, objective score.",
    sub:
      "Which supplier delivers reliably? Who has rising complaint rates? Most mid-sized companies see the greatest need to digitize in supplier management — only a fraction use a digital platform for it. NEWEDGE aggregates goods receipt, quality inspection and complaints into an ongoing score. You decide on data instead of gut feeling.",
    bullets: [
      "Automatic supplier scoring from real-time data",
      "Early warning on quality or delivery problems",
      "Data-based foundation for negotiations & approvals",
    ],
    imageNote: "Visual: supplier scorecard with real-time data from goods receipt and complaints.",
    imageAlt: "Automatic supplier scoring from real-time data",
  },
  feature3: {
    h2: "Inspect goods receipt — without a clipboard.",
    h3: "Order, delivery note, goods receipt matched automatically — every discrepancy detected instantly.",
    sub:
      "The delivery note doesn't match the order. The quantity is off. The batch is missing. In a manual process someone notices — or doesn't. NEWEDGE matches order, delivery note and goods receipt automatically and escalates discrepancies straight to the right person. Most companies see fast onboarding of new suppliers as a growth driver — that only works digitally.",
    bullets: [
      "Automatic matching: order vs. delivery note vs. goods receipt",
      "Instant escalation on quantity, quality or batch discrepancies",
      "Complete documentation for audits and complaints",
    ],
    imageNote: "Visual: three-way match of order / delivery note / goods receipt with discrepancy alert.",
    imageAlt: "Automatic goods receipt inspection with three-way matching",
  },
  integrations: {
    h2: "Connects with the tools you already use",
    h3: "SAP, Dynamics, Oracle, Shopify, WooCommerce, EDI — whether wholesale or D2C.",
    sub: "SAP, Microsoft Dynamics, Oracle, Shopify, WooCommerce, EDI systems — NEWEDGE integrates into your existing trade and logistics infrastructure. Wholesale or D2C: the system plugs in and works in the background. No system switch, no parallel operation.",
    logos: [LOGO.sap, LOGO.shopify, LOGO.woocommerce, LOGO.stripe, LOGO.salesforce, LOGO.datev, LOGO.outlook, LOGO.zapier, LOGO.make],
  },
  compare: {
    h2: "NEWEDGE vs. a manual trade process",
    h3: "Where manual processes in procurement cost hours and margin every day — and what AI takes over directly.",
    altLabel: "Manual",
    rows: [
      { k: "Order processing",      ne: "Automatic, in seconds",           alt: "Manual, error-prone" },
      { k: "Supplier evaluation",   ne: "Real-time scoring, data-based",    alt: "Gut feeling, Excel lists" },
      { k: "Goods receipt inspection", ne: "Automatic matching",             alt: "Spot checks, clipboard" },
      { k: "Data quality",          ne: "Validated throughout",             alt: "Media breaks, typos" },
      { k: "Transparency",          ne: "Real-time dashboard",              alt: "Follow-up questions, callbacks" },
      { k: "Digital platform",      ne: "Fully integrated",                 alt: "Only a handful of firms" },
    ],
  },
  featureCards: {
    h2: "Ordered, inspected, steered — without a media break.",
    h3: "Three building blocks of the same system — activate them individually or together.",
    cards: [
      {
        title: "Order automation",
        desc: "Every order captured, validated, handed over — whether email, EDI or portal. Without a media break.",
        iconNote: "Icon: incoming order → automatic processing",
      },
      {
        title: "Supplier intelligence",
        desc: "Scoring, early warning, benchmarks — data-based instead of gut feeling. For better decisions in procurement.",
        iconNote: "Icon: supplier scorecard with real-time data",
      },
      {
        title: "Goods receipt inspection",
        desc: "Every delivery matched. Every discrepancy detected. Every piece of documentation audit-ready.",
        iconNote: "Icon: three-way match with escalation alert",
      },
    ],
  },
  testimonialHero: {
    quote:
      "We process 400 orders a day. Three people used to be busy just with data entry. With NEWEDGE that runs fully automatically — and the error rate has dropped from 6% to under 0.5%.",
    author: "Wholesale, DACH — Head of Procurement & Logistics",
  },
  faq: [
    {
      q: "Which order formats can the system process?",
      a: "Email with PDF attachment, EDI messages (EDIFACT, X12), supplier portals and direct ERP transfers. The system extracts article numbers, quantities, delivery dates and terms automatically — regardless of the format.",
    },
    {
      q: "What happens with faulty or deviating orders?",
      a: "Incomplete or deviating orders are automatically flagged, categorized and escalated with all relevant details to the person responsible — no data loss, no silent error.",
    },
    {
      q: "How is the supplier score calculated?",
      a: "The score aggregates delivery reliability, complaint rate, quality deviations and price compliance from real-time data. This is exactly where most mid-sized companies see the greatest need to digitize — NEWEDGE closes that gap.",
    },
    {
      q: "Can the system be connected to Shopify or WooCommerce for D2C retailers?",
      a: "Yes. Alongside classic ERP systems (SAP, Microsoft Dynamics, Oracle), native integrations are available for Shopify, WooCommerce and EDI systems. Whether wholesale or D2C.",
    },
    {
      q: "How long does the rollout take?",
      a: "Typically 3–5 weeks: system connection, format training with your real order data, pilot operation and go-live. The system learns your formats and exceptions automatically.",
    },
  ],
  closingCta: {
    h2Line1: "Every order that lands manually",
    h2Line2Highlighted: "costs your team time you don't have.",
    sub: "In a free AI Audit we show you where your supply chain processes lose time and margin.",
    ctaPrimary: "Request an AI Audit",
    ctaSecondary: "Watch the demo",
  },
};

/* ──────────────────────────────────────────────────────────────
   INDUSTRY 4 — Professional Services
────────────────────────────────────────────────────────────── */
const professionalServices: PainPointContent = {
  slug: "professional-services",
  seo: {
    title: "AI for consultants, law firms and tax advisors | NEWEDGE",
    description:
      "NEWEDGE automates research, reports and client communication for law firms and consultants — noticeably faster, no system switch, live in 5 business days.",
    canonical: "/en/industrien/professional-services",
  },
  hero: {
    overlabel: "AI AUTOMATION FOR CONSULTANTS, LAW FIRMS & TAX ADVISORS",
    h1Line1: "Your expertise is your business.",
    h1Line2Highlighted: "35–40% of your time no client pays for.",
    sub:
      "The same system as in every other industry, configured for client and advisory work. 35–40% of your working time goes into tasks no client pays for: research, reports, follow-up questions, document preparation. NEWEDGE automates exactly these tasks — you focus on what clients actually pay for.",
    ctaPrimary: "Book a free professional services check",
    ctaSecondary: "Watch the demo",
    imageNote: "Visual: AI agent takes over research, client communication and reports — consultant focuses on client work.",
    imageAlt: "AI automation for consultants, law firms and tax advisors: research, communication and reports",
    image: "pain-point-professional-services-hero",
  },
  trustBar: {
    headline: "Trusted by consulting and professional services firms across DACH",
    sub: "Management consultancies, coaches, law firms, consultants",
    logos: ["Consulting", "Coaching", "Law firm", "Consultancy", "Advisory"],
  },
  definition: {
    title: "What is AI automation for professional services?",
    body:
      "AI agents take over recurring, rule-based tasks: research, document analysis, client communication, report creation, compliance monitoring. Knowledge workers spend nearly two hours a day searching for and gathering information — over a fifth of their working time. Law firms and consultancies with AI automation cut their administrative effort by roughly a third — for a five-person consultancy, almost two full working days per week.",
  },
  feature1: {
    h2: "You advise — but who prepares?",
    h3: "Automate data analysis and research for consultants, lawyers and tax advisors",
    sub:
      "Before every consultation, every brief, every annual statement comes research. The AI agent searches databases, analyzes documents and prepares structured summaries — before you even sit down at your desk in the morning.",
    bullets: [
      "Automatic data gathering from multiple sources: specialist databases, client documents, public registers",
      "AI-powered pattern recognition and relevance filtering",
      "Configurable dashboards for client-specific insights",
      "Direct integration into existing document management systems",
    ],
    imageNote: "Visual: AI agent analyzes documents and delivers structured results",
    imageAlt: "AI-powered research and data analysis for professional services",
  },
  feature2: {
    h2: "Clients don't like waiting.",
    h3: "Automate client communication for law firms and consultants",
    sub:
      "Status inquiries, questions about documents, scheduling — always the same processes, always manual. AI agents take over standard communication, categorize requests and reply instantly — in your tone of voice.",
    bullets: [
      "AI-powered answers to frequent client requests, around the clock",
      "Automatic email categorization and prioritization by urgency",
      "Personalized email and document templates",
      "Integration into CRM and existing communication platforms",
    ],
    imageNote: "Visual: automated client communication",
    imageAlt: "AI-powered client communication for law firms",
    image: "pain-point-professional-services-feature2",
  },
  feature3: {
    h2: "AI can write reports too.",
    h3: "Automate report creation and compliance for professional services",
    sub:
      "Report creation is rule- and template-based — exactly what AI is especially good at. The AI agent gathers data, fills templates and generates finished reports: from a status update to an annual report.",
    bullets: [
      "Automatic report generation based on configurable templates",
      "AI-powered data extraction and consolidation from multiple sources",
      "Real-time monitoring of regulatory requirements and deadlines",
      "Automatic compliance checks and alerts on potential issues",
    ],
    imageNote: "Visual: automated report creation",
    imageAlt: "AI-powered report creation for professional services",
  },
  integrations: {
    h2: "You don't switch a single system.",
    h3: "AI integrations for professional services",
    sub:
      "NEWEDGE integrates via API with common CRM, document management and specialist software systems — Salesforce, HubSpot, DATEV, RA-MICRO, SharePoint, Microsoft 365, LexOffice and others. No data migration. No new logins.",
    logos: [LOGO.salesforce, LOGO.hubspot, LOGO.datev, LOGO.lexoffice, LOGO.sharepoint, LOGO.teams, LOGO.outlook, LOGO.docusign, LOGO.notion],
  },
  compare: {
    h2: "40% of your working time. On tasks no client pays for.",
    h3: "AI automation vs. manual operation in the professional services comparison",
    altLabel: "Manual operation",
    rows: [
      { k: "Research and analysis time",         ne: "Sharply reduced through AI preparation",       alt: "2–4 hours per engagement, manual" },
      { k: "Report creation time",               ne: "Automatic, in minutes",                        alt: "3–6 hours per report" },
      { k: "Reaction time on client requests",   ne: "Instant, 24/7",                                alt: "Next business day" },
      { k: "Compliance monitoring",              ne: "Real-time, automatic",                         alt: "Manual, error-prone" },
      { k: "Onboarding new clients",             ne: "Structured, automated",                        alt: "2–4 hours per engagement" },
      { k: "Document preparation",               ne: "AI-powered, in minutes",                       alt: "Hours of manual work" },
      { k: "Capacity per consultant",            ne: "Up to 40% more billable hours",                alt: "Capped by admin" },
      { k: "Setup effort",                       ne: "Integration into existing systems, no switch", alt: "New tools = new training" },
    ],
  },
  featureCards: {
    h2: "What actually changes — after week one.",
    h3: "Concrete results from AI automation in professional services operations",
    cards: [
      {
        title: "Research in minutes instead of hours",
        desc: "AI agents search databases, analyze documents and deliver structured results — before you even ask the first question.",
        iconNote: "Icon: magnifying glass + AI",
      },
      {
        title: "Client communication without reaction delay",
        desc: "Standard requests are answered instantly, emails categorized, appointments coordinated — in your tone of voice, around the clock.",
        iconNote: "Icon: chat with checkmark",
        icon: "i4-icon-followup",
      },
      {
        title: "Reports based on current data — not in days",
        desc: "Automatic data consolidation, template filling and quality check — reports in minutes instead of hours.",
        iconNote: "Icon: document + lightning bolt",
        icon: "i4-icon-report",
      },
    ],
  },
  testimonialHero: {
    quote:
      "We spent two hours every Monday putting together reports and sorting client requests. Since NEWEDGE that runs automatically — we get the finished summary, and the team works on what we're actually paid for.",
    author: "Consultant — professional services, DACH",
  },
  howTo: {
    name: "AI automation for professional services: setup in 3 steps",
    description:
      "How NEWEDGE integrates AI automation into your professional services operation — without a system switch, in 5 business days.",
    totalTime: "P5D",
    steps: [
      {
        name: "Step 1: Process analysis and prioritization",
        text: "We analyze your recurring tasks and find the biggest time sinks — research, communication or reporting. Result: a prioritized automation list with a time-saving estimate.",
      },
      {
        name: "Step 2: Integration and configuration",
        text: "NEWEDGE connects via API to your existing systems — DATEV, RA-MICRO, Salesforce, Microsoft 365, SharePoint. AI agents are configured to your knowledge base, templates and tone of voice. No system switch, no data migration.",
      },
      {
        name: "Step 3: Go-live and ongoing optimization",
        text: "After 5 business days the system runs productively. You see which tasks run automatically and how many hours you save. The AI agents keep learning from feedback.",
      },
    ],
  },
  faq: [
    {
      q: "Which professional services firms is NEWEDGE suitable for?",
      a: "Consultancies (management, strategy, finance), coaches, law firms, architecture and urban planning offices, tax advisors, auditors, HR consultants and recruiters — anywhere recurring, rule-based tasks eat up time.",
    },
    {
      q: "How much time do I actually save?",
      a: "Law firms and consultancies reduce their administrative effort through AI automation by roughly a third. For a five-person consultancy, that's almost two full working days per week.",
    },
    {
      q: "Do I have to switch my existing systems?",
      a: "No. NEWEDGE integrates via API into your existing infrastructure — DATEV, RA-MICRO, Salesforce, HubSpot, Microsoft 365, SharePoint, LexOffice and others. No data migration, no new logins.",
    },
    {
      q: "How long does implementation take?",
      a: "Typically 5 business days: days 1–2 process analysis and system connection, days 3–4 configuration of the AI agents on your knowledge base and templates, day 5 go-live and handover.",
    },
    {
      q: "How does NEWEDGE ensure GDPR compliance?",
      a: "NEWEDGE can run entirely in your private cloud or on-premise. No client data leaves your infrastructure. All data processing is documented in a GDPR-compliant way.",
    },
    {
      q: "Do clients notice that an AI agent is answering?",
      a: "That's up to you. NEWEDGE communicates transparently as an AI assistant or operates entirely under your own brand.",
    },
    {
      q: "Can NEWEDGE also generate client-specific reports?",
      a: "Yes. AI agents are configured to your specific report templates, data sources and formatting standards. Reports are automatically populated with current data and submitted for final approval.",
    },
    {
      q: "What does NEWEDGE cost for professional services?",
      a: "The investment depends on team size and depth of automation. Book a free professional services check — we analyze your specific loss of time and show you when the investment pays off.",
    },
  ],
  closingCta: {
    h2Line1: "20 minutes.",
    h2Line2Highlighted: "Then you'll know what your AI can save you.",
    sub: "We analyze your recurring tasks and show you what's immediately automatable.",
    ctaPrimary: "Book a free professional services check",
    ctaSecondary: "Watch the demo",
  },
};

// Mini-cases (custom posts) — maintained centrally in collections/miniCases.ts,
// assigned here per use case (map key = primary slug).
// Auswahlverfahren & Entscheidungsinstanzen zeigen bewusst dieselben 3 Cases
// (identische Zielgruppe/Thematik: Jury-/Gremiumsentscheidungen) — eine Quelle,
// zwei Anwendungsfeld-Seiten.
auswahlverfahren.miniCases = miniCasesBySlug["entscheidungsinstanzen"];
compliance.miniCases = miniCasesBySlug["compliance"];
kpiDashboard.miniCases = miniCasesBySlug["kpi-dashboard"];
kiKundensupport.miniCases = miniCasesBySlug["ki-kundensupport"];
entscheidungsinstanzen.miniCases = miniCasesBySlug["entscheidungsinstanzen"];
localDigitalCommerce.miniCases = miniCasesBySlug["health-care"];
handelSupplyChain.miniCases = miniCasesBySlug["handel-supply-chain"];
professionalServices.miniCases = miniCasesBySlug["professional-services"];

export const painPoints: Record<string, PainPointContent> = {
  // Pain Point A
  auswahlverfahren: auswahlverfahren,
  "auswahlverfahren-automatisieren": auswahlverfahren,

  // Pain Point B (Kundengewinnung entfernt)

  // Pain Point C
  compliance: compliance,
  "compliance-automatisierung": compliance,
  "import-export": compliance,
  "import-export-compliance": compliance,

  // Pain Point D
  "kpi-dashboard": kpiDashboard,
  "kpi-dashboard-echtzeit": kpiDashboard,
  reporting: kpiDashboard,

  // Pain Point E
  "ki-kundensupport": kiKundensupport,
  kundensupport: kiKundensupport,
  support: kiKundensupport,

  // Industrien
  entscheidungsinstanzen: entscheidungsinstanzen,
  "local-digital-commerce": localDigitalCommerce,
  "health-care": localDigitalCommerce,
  "handel-supply-chain": handelSupplyChain,
  "professional-services": professionalServices,
};

export const DEFAULT_PAIN_POINT: PainPointContent = auswahlverfahren;
