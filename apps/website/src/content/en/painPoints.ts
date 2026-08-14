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
  slug: "entscheidungen-fallpruefung",
  seo: {
    title: "Decisions & Case Review with AI | NEWEDGE Munich",
    description:
      "NEWEDGE structures applications, submissions and case reviews — intake, scoring against your own criteria and audit-proof documentation of every decision.",
    canonical: "/en/loesungen/entscheidungen-fallpruefung",
  },
  hero: {
    overlabel: "AI AUTOMATION FOR AWARDS & SELECTION PROCESSES",
    h1Line1: "Your selection process —",
    h1Line2Highlighted: "without the administrative marathon.",
    sub:
      "This is how we automate decisions and case review. Cases reach you reviewed and ready for decision — you just make the call.",
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
      "A selection process ties up weeks in which no one is deciding and everyone is administering: reviewing submissions, coordinating the jury, documenting rationales. Automated selection-process software takes over exactly these three steps — your panel judges instead of sorts. That saves effort in every cycle and delivers decisions that hold up to any audit.",
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
    image: "pain-point-auswahlverfahren-feature1",
  },
  feature2: {
    h2: "No more chasing jurors on the phone.",
    h3: "The jury evaluates — coordination runs on its own",
    sub:
      "A panel, a tight schedule, an inbox full of follow-up questions — that's evaluation coordination today. NEWEDGE takes over briefings, reminders and consolidating the evaluations. Everyone scores online at their own pace. You see in real time who's finished and where verdicts diverge.",
    bullets: [
      "Automatic reminders — no more missed deadlines",
      "A single scoring system — comparable evaluations instead of gut feeling",
      "Discrepancies visible instantly — where jurors disagree, you know first",
    ],
    imageNote: "Jury interface mockup with scoring and conflict badge.",
    imageAlt: "Jury interface with a scoring system and automatic conflict detection",
    image: "pain-point-auswahlverfahren-feature2",
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
    image: "pain-point-auswahlverfahren-feature3",
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
      "What used to mean painstaking manual work now runs automatically with NEWEDGE — and the quality of our decisions has noticeably improved.",
    author: "BMP Award — Project lead",
  },
  faq: [
    {
      q: "How long does it take to implement an AI-powered selection process?",
      a: "We start with one clearly scoped process and take it live before expanding. The timeline is agreed together once we have seen your criteria and your data. Data migration and team training are included.",
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
   PAIN POINT C — Documents & Processes (Document Operations)
   Blueprint page: the same standardized function (capture, classify,
   extract, check for completeness and against rules, reconcile,
   escalate discrepancies), configured for insurance, education,
   funding and real estate.
   "Compliance" is only a concrete use case here (checking against
   internal rules, evidence requirements, retention) — never a
   category or the topic of the page.
   NO numbers: no percentages, time savings, case or cost figures —
   there are no measured values for them.
────────────────────────────────────────────────────────────── */
const compliance: PainPointContent = {
  slug: "dokumente-prozesse",
  seo: {
    title: "Automate documents and processes with AI | NEWEDGE",
    description:
      "NEWEDGE captures, checks and files your paperwork: claim evidence, application dossiers, proof of use, tenancy documents. Book a demo and see it run.",
    canonical: "/en/loesungen/dokumente-prozesse",
  },
  hero: {
    overlabel: "DOCUMENTS & PROCESSES · CONFIGURED FOR YOUR FIELD",
    h1Line1: "The paperwork is checked",
    h1Line2Highlighted: "before you open it.",
    sub:
      "This is how we automate documents and processes. Documents arrive however they arrive — the only thing that lands on your desk is whatever doesn't add up.",
    ctaPrimary: "Request an AI Audit",
    ctaSecondary: "Watch the demo",
    imageNote: "Document flow: a mixed inbox of evidence, applications and receipts → check → an ordered file with completeness status.",
    imageAlt: "AI captures evidence, applications and receipts, checks them and assigns them to the right case",
    image: "pain-point-compliance-hero",
  },
  trustBar: {
    headline: "For organizations that receive paperwork every day",
    sub: "The same building blocks — in insurance, education, funding and real estate",
    logos: ["Insurers", "Brokers", "Universities", "Training providers", "Funding bodies", "Foundations", "Property management"],
  },
  definition: {
    title: "What is AI-powered document and process automation?",
    body:
      "Documents and processes follow the same pattern in every organization: paperwork arrives, and it has to be assigned, read, checked and recorded. NEWEDGE standardizes that function once and configures it for the professional context — for claim evidence and policy paperwork just as much as for application dossiers, funding applications with their attachments, or tenancy documents. The system takes in every document, recognizes what it is, extracts the relevant details, checks them against your checklists, internal rules and evidence requirements, and reconciles them with the data you already hold. Whatever is complete and consistent moves on. Whatever is missing, contradictory or outside your rules goes to the person who has to decide, together with a note on what the issue is. Every step stays logged — so evidence and retention obligations can still be met, without anyone having to reconstruct the history afterwards.",
  },
  feature1: {
    h2: "Every document lands in the right case.",
    h3: "Capture, recognize and assign — whether scan, photo, form or email attachment.",
    sub:
      "Evidence for a claim, a transcript for an application, an attachment to a funding request, a receipt for a service-charge statement — it all arrives through different channels and rarely with a meaningful subject line. NEWEDGE captures every document, recognizes from the content what it is, extracts the relevant details and assigns it to the right case, application or property.",
    bullets: [
      "Documents are assigned and their details extracted before anyone works through the inbox",
      "File name and format make no difference — what is recognized is the content",
      "Follow-up documents join the existing case instead of creating a second file",
    ],
    imageNote: "Scan animation: a mixed inbox of photo, scan and combined PDF → every document assigned to the right file.",
    imageAlt: "Incoming evidence and applications are recognized automatically and assigned to the right case",
    image: "pain-point-compliance-feature1",
  },
  feature2: {
    h2: "What is missing shows up on arrival.",
    h3: "Completeness, rule checks and data reconciliation — configured for each professional context.",
    sub:
      "Is the language certificate missing from the application dossier, an attachment from the proof of use, the invoice from the claim, the handover protocol from the tenancy file? NEWEDGE checks every document against your checklists and internal rules and reconciles the extracted details with what you already have on file. Missing items are requested and followed up, instead of stalling halfway through processing.",
    bullets: [
      "Missing evidence is requested before the case goes into processing",
      "Your checks apply the same way to every case — even when volumes are high",
      "Details are checked against your data instead of being retyped",
    ],
    imageNote: "Review view: document → checklist with completeness status, flagged gap and automatic follow-up request.",
    imageAlt: "Automatic completeness and rule checks with follow-up requests for missing evidence",
    image: "pain-point-compliance-feature2",
  },
  feature3: {
    h2: "Discrepancies come to you — with the source.",
    h3: "Escalation and a complete audit trail instead of silent acceptance.",
    sub:
      "Two entries contradict each other, a receipt doesn't match the billing period, a certificate has expired, a deadline is running. The system doesn't wave cases like these through — it puts them in front of the person responsible, with a note on what the assessment is based on. Every processing step stays logged, so it remains clear later who decided what, when and on what grounds.",
    bullets: [
      "Contradictions and expired evidence are flagged instead of overlooked",
      "Checks against your internal rules and evidence requirements on every case",
      "The log and the retention record build up along the way, not just before an audit",
    ],
    imageNote: "Rule check: case → check against rules → approval or flagged discrepancy with log entry.",
    imageAlt: "Discrepancies are escalated with their source and every processing step is logged",
    image: "pain-point-compliance-feature3",
  },
  integrations: {
    h2: "Connects with the tools you already use",
    h3: "Inbox, document storage, e-signature, line-of-business systems — connected, not replaced.",
    sub: "NEWEDGE replaces none of your line-of-business systems. The building blocks connect to what your teams work with today — inbox, document storage, e-signature, and your records and administration systems — and take over the steps in between. No system switch, no parallel operation: your data stays where it is.",
    logos: [LOGO.outlook, LOGO.sharepoint, LOGO.teams, LOGO.googleWorkspace, LOGO.docusign, LOGO.datev, LOGO.salesforce, LOGO.zapier, LOGO.make],
  },
  compare: {
    h2: "NEWEDGE vs. handling documents by hand",
    h3: "The same building blocks, configured for your field — side by side.",
    altLabel: "Manual, today",
    rows: [
      { k: "Capturing documents",       ne: "Automatic, from every channel and format", alt: "Open it, read it, file it" },
      { k: "Assignment to the case",    ne: "Recognized from the content",              alt: "Searching for where it belongs" },
      { k: "Completeness check",        ne: "On arrival, with a follow-up request",     alt: "Noticed late, costs another round of chasing" },
      { k: "Check against your rules",  ne: "The same on every case",                   alt: "Depends on the person and the day" },
      { k: "Data reconciliation",       ne: "Reconciled, discrepancies reported",       alt: "Retyped from the documents" },
      { k: "Evidence & retention",      ne: "Every step logged",                        alt: "Spread across inboxes and folders" },
    ],
  },
  featureCards: {
    h2: "Captured, checked, reconciled — before anyone has to follow up.",
    h3: "Three building blocks of the same system — activate them individually or together.",
    cards: [
      {
        title: "Capture & assignment",
        desc: "Every document is taken in, recognized, extracted and assigned to the right case, application or property — whatever the channel and format.",
        iconNote: "Animation: mixed documents are scanned and assigned to the right file",
        icon: "ppc-icon-scan",
      },
      {
        title: "Completeness & rule checks",
        desc: "Missing evidence shows up on arrival and is requested. Your checks apply the same way to every case.",
        iconNote: "Animation: checklist with completeness status and a flagged gap",
        icon: "ppc-icon-alert",
      },
      {
        title: "Reconciliation & audit trail",
        desc: "Details are checked against your data, discrepancies are reported and every step is logged — for evidence and retention obligations.",
        iconNote: "Animation: data reconciliation with a flagged discrepancy and a log entry",
        icon: "ppc-icon-shield",
      },
    ],
  },
  /**
   * No customer quote: there is no substantiated reference statement for
   * this area of work. Deliberately written as a statement of how NEWEDGE
   * works, without any number.
   */
  testimonialHero: {
    quote:
      "Paperwork looks different in insurance, education, funding and real estate — the work behind it is the same. We take over the capturing, checking and reconciling. Whatever stands out is still decided by your team.",
    author: "NEWEDGE — working principle",
  },
  faq: [
    {
      q: "Which documents can the system handle?",
      a: "Everything that typically reaches you: claim evidence, policy and application paperwork, follow-up documents, application dossiers, transcripts and recognitions of prior learning, funding applications with their attachments, proof of use, tenancy agreements, utility receipts and handover protocols — as a scan, photo, PDF, form or email attachment. What counts is the content, not the format.",
    },
    {
      q: "Do you build separate software for every sector?",
      a: "No. These are the same standardized functions — capture, classify, extract, check for completeness and against rules, reconcile, escalate discrepancies. For your organization they are configured to your document types, checklists and review rules. Not a custom project from scratch, but the same building block in your professional context.",
    },
    {
      q: "What happens when a document is unclear or contradictory?",
      a: "It is not waved through. The system marks the spot, states what the issue is and puts the case in front of the person responsible. How the discrepancy is handled is still your team's decision.",
    },
    {
      q: "Can this be connected to our existing systems?",
      a: "Yes. NEWEDGE replaces no line-of-business system and requires no system switch. Your inbox, document storage, e-signature and your records and administration systems are connected; the system works in the background and writes checked data back to where your teams expect it.",
    },
    {
      q: "How do you handle personal data, evidence requirements and retention?",
      a: "Processing is GDPR-compliant, with roles and access rights, and on request in a German cloud or in your own infrastructure. Every processing step is logged — so that disclosure, evidence and retention obligations can still be met, without anyone piecing the history together afterwards.",
    },
  ],
  closingCta: {
    h2Line1: "We sort the paperwork.",
    h2Line2Highlighted: "You look at what stands out.",
    sub: "In a free AI Audit we look at which document route makes sense to start with in your organization.",
    ctaPrimary: "Request an AI Audit",
    ctaSecondary: "Watch the demo",
  },
};

/* ──────────────────────────────────────────────────────────────
   PAIN POINT D — Steering & Reporting
   A blueprint, NOT a sector-specific product: the same standardized
   function, configured for the steering metrics of each sector
   (insurance, education, funding, real estate).
   NO numbers, no time savings, no case, customer or throughput
   figures, no prices — there are no substantiated values for them.
   No trade, sales or merchandise-management contexts: source systems
   are named generically (line-of-business systems, records
   management, case files).
────────────────────────────────────────────────────────────── */
const kpiDashboard: PainPointContent = {
  slug: "steuerung-reporting",
  seo: {
    title: "Steering & Reporting with AI: metrics in one view | NEWEDGE",
    description:
      "Processing status, deadlines, capacity and portfolio in a single view — without a new core system. Book a demo and see your own numbers.",
    canonical: "/en/loesungen/steuerung-reporting",
  },
  hero: {
    overlabel: "STEERING & REPORTING · CONFIGURED FOR YOUR DEPARTMENT",
    h1Line1: "Your report shows what happened last week.",
    h1Line2Highlighted: "Not where the cases stand today.",
    sub:
      "This is how we automate steering and reporting. Your key figures in one place, continuously — you see deviations the moment they arise.",
    ctaPrimary: "Book a demo",
    ctaSecondary: "See examples",
    imageNote:
      "Steering cockpit: processing status of open cases, deadline overview, capacity and portfolio development side by side, plus an alert panel for deviations. Purple accents.",
    imageAlt:
      "Steering cockpit with processing status, deadlines, capacity and portfolio in one view",
    image: "pain-point-kpi-dashboard-hero",
  },
  trustBar: {
    headline: "Built for organizations that steer cases day in, day out",
    sub: "Insurance, education, funding and contracting authorities, property management",
    logos: ["Insurer", "Broker", "University", "Training provider", "Funding body", "Contracting authority", "Property management"],
  },
  definition: {
    title: "What is AI-powered steering and reporting?",
    body:
      "Steering and reporting follow the same pattern in every organization: consolidate data from different sources, monitor metrics, spot deviations, prepare decisions for the leadership team. NEWEDGE standardizes that function once and configures it for your steering metrics — in insurance for processing status, loss ratio, portfolio and service levels; in education for applicant numbers, capacity, processing status and deadlines; in funding procedures for procedure status, application volume, deadlines and committee workload; in property management for vacancy, maintenance cases, outstanding receivables and portfolio. Not a separate solution per sector, but the same function scoped to a different professional context.",
  },
  feature1: {
    h2: "One number everyone can refer to.",
    h3: "Data from your line-of-business systems brought together continuously",
    sub:
      "The processing status sits in the case files, the deadlines in a mailbox, the capacity figures in a spreadsheet — and every area calculates them a little differently. NEWEDGE brings the figures from your existing sources together continuously and interprets them consistently. What you see comes from the same data your teams work with anyway.",
    bullets: [
      "Records management, case files, document storage and mailbox come together in one view",
      "No retyping, no export by hand — the figures move with the case",
      "One shared definition per metric instead of two areas with two numbers",
      "Every metric can be traced back to the individual case",
    ],
    imageNote:
      "Visual: several line-of-business systems feed into one shared metric view; the origin of each figure stays visible.",
    imageAlt: "Metrics from several line-of-business systems brought together in one shared view",
    image: "pain-point-kpi-dashboard-feature1",
  },
  feature2: {
    h2: "You hear about the deviation before it escalates.",
    h3: "Your steering metrics monitored continuously — with an alert to the role responsible",
    sub:
      "A backlog in claims assessment, an admission deadline about to slip, an intake year that overloads the committees, a property with growing vacancy: developments like these show up in the figures early — but nobody sees them while the report is only written at the end of the month. NEWEDGE monitors your steering metrics continuously and sends anything unusual to where it gets handled.",
    bullets: [
      "You set the thresholds — the system speaks up instead of waiting to be asked",
      "The alert goes to the role responsible, not into a shared distribution list",
      "Deadlines and stalled cases stand out while there is still time to react",
      "Views per role: leadership sees the overall picture, the team its open cases",
    ],
    imageNote:
      "Visual: a metric crosses a defined threshold; the alert goes to the role responsible, with a reference to the case.",
    imageAlt: "Alerts on deviations: thresholds, deadlines and stalled cases in view",
    image: "pain-point-kpi-dashboard-feature2",
  },
  feature3: {
    h2: "Measuring isn't enough. Now what?",
    h3: "Decisions prepared — with the origin, not just a curve",
    sub:
      "A metric that tips doesn't yet tell you what to do. NEWEDGE puts the development in context: which cases sit behind it, in which area, since when — and assembles the basis your leadership team decides on. The decision itself stays with you.",
    bullets: [
      "Every anomaly comes with its origin: which area, which cases, since when",
      "Recurring patterns are named instead of being worked out from scratch each time",
      "Briefings for leadership, the board or a committee come from the same data",
      "What changes after a measure can be read off the same metrics",
    ],
    imageNote:
      "Visual: a metric trend with the origin expanded — the area affected, the cases behind it, the period — as a briefing for the leadership meeting.",
    imageAlt: "Metrics turned into a decision briefing with a traceable origin",
    image: "pain-point-kpi-dashboard-feature3",
  },
  integrations: {
    h2: "You don't switch a single system.",
    h3: "Which sources can be connected for steering and reporting?",
    sub:
      "NEWEDGE replaces neither your records management nor your case files. The function sits on top of the systems your teams work with today and reads the figures where they arise anyway — without data migration and without a second interface for someone to maintain. Line-of-business systems without an interface we connect through the storage, forms and exports you already use.",
    logos: [LOGO.outlook, LOGO.teams, LOGO.sharepoint, LOGO.googleWorkspace, LOGO.datev, LOGO.lexoffice, LOGO.docusign, LOGO.notion, LOGO.zapier],
  },
  compare: {
    h2: "How much longer will you be putting your numbers together by hand?",
    h3: "Steering & Reporting vs. a report from the spreadsheet — the direct comparison",
    altLabel: "Manual, today",
    rows: [
      { k: "Data status",                 ne: "Continuously current",               alt: "As of the last report" },
      { k: "Bringing sources together",   ne: "Automatic",                          alt: "By hand, spreadsheet by spreadsheet" },
      { k: "Deviations",                  ne: "Reported as they arise",             alt: "Noticed in the next report" },
      { k: "Deadlines in view",           ne: "Monitored continuously",             alt: "Calendar and memory" },
      { k: "Data foundation",             ne: "One definition for every area",      alt: "A separate number per area" },
      { k: "View per role",               ne: "Leadership, department, controlling", alt: "One report for everyone" },
      { k: "Traceability",                ne: "Down to the individual case",        alt: "A number with no origin" },
      { k: "More cases",                  ne: "The same process",                   alt: "More work by hand" },
    ],
  },
  featureCards: {
    h2: "What actually changes — from the first report.",
    h3: "The same standardized function, configured for your steering metrics",
    cards: [
      {
        title: "Processing status at a glance",
        desc: "How many cases are open, how long they have been sitting and where things stall is in one place — in claims assessment just as much as in admissions or property management.",
        iconNote: "Icon: metric trend / processing status",
      },
      {
        title: "Deviations report themselves",
        desc: "You set the threshold, the system speaks up — on a processing backlog, on unusual application volume, on rising outstanding receivables.",
        iconNote: "Icon: alert bell / early warning",
      },
      {
        title: "Every role sees what it needs",
        desc: "Leadership, department and controlling work from the same data, each with a view scoped to their own remit — no more than the decision at hand requires.",
        iconNote: "Icon: user roles / personas",
      },
      {
        title: "Numbers with an origin",
        desc: "Every anomaly comes with where it comes from: which area, which cases, since when. Your leadership team decides on a basis it can check.",
        iconNote: "Icon: context / derivation",
      },
      {
        title: "Deadlines stop getting away",
        desc: "Running deadlines in applications, admissions and contracts are monitored and reported in time, instead of surfacing in the next cycle.",
        iconNote: "Icon: calendar with deadline check",
      },
      {
        title: "One data foundation for every area",
        desc: "Portfolio, capacity, procedure status and outstanding receivables come from the same source. The debate about whose number is right falls away.",
        iconNote: "Icon: shared data basis / single source of truth",
      },
    ],
  },
  /**
   * No customer quote: there is no released reference project and no
   * substantiated figure for this function. Deliberately written as a
   * statement of how NEWEDGE works, without any number.
   */
  testimonialHero: {
    quote:
      "Steering is not a software question. We make sure the figures are complete, current and traceable down to the individual case — what follows from them is your leadership team's decision.",
    author: "NEWEDGE — working principle",
  },
  faq: [
    {
      q: "Is this just another BI tool like Power BI or Tableau?",
      a: "No. Classic BI tools give you the interface — the setup, the definitions and the upkeep are on you. NEWEDGE delivers the function configured: sources connected, metrics interpreted according to your definitions, alerts to the roles responsible. Without a BI team of your own and without an IT project.",
    },
    {
      q: "Which sources can be connected for steering and reporting?",
      a: "Your records management, case files, document storage, forms and mailboxes — the systems where the cases arise anyway. Line-of-business systems with an interface are connected directly; for the rest we work through the routes you already use. Your data stays where it is.",
    },
    {
      q: "Can we define our own metrics?",
      a: "Yes. Which figures you steer by and how they are calculated is up to you — processing status, loss ratio, capacity, procedure status, vacancy, or whatever else counts in your organization. NEWEDGE maps your definition instead of bringing its own.",
    },
    {
      q: "Can each role get its own view?",
      a: "Yes, role-based views are standard. Leadership sees the overall picture, the department its open cases, controlling the derivation down to the individual case. Who sees which data is up to you.",
    },
    {
      q: "Does the system decide on cases or procedures?",
      a: "No. It consolidates data, monitors metrics, spots deviations and prepares decisions. What follows from that — priorities, resources, procedural steps — is decided in your organization, and the basis for it stays documented and traceable.",
    },
    {
      q: "Do you build a separate solution for every sector?",
      a: "No. Steering & Reporting is one of four standardized functions running on the same infrastructure. For insurers it is configured for processing status, loss ratio, portfolio and service levels, for universities for applicant numbers, capacity and deadlines, for funding bodies for procedure status, application volume and committee workload, for property management for vacancy, maintenance cases and outstanding receivables. Configured, not rebuilt.",
    },
    {
      q: "Who looks after the steering view once it is live?",
      a: "NEWEDGE handles operation, adjustments and new metrics when your steering changes. You have a dedicated contact instead of an anonymous support queue.",
    },
  ],
  closingCta: {
    h2Line1: "One look at where you stand —",
    h2Line2Highlighted: "instead of three spreadsheets and a follow-up question.",
    sub: "We go through your steering metrics and show what can come together in one place.",
    ctaPrimary: "Book a demo",
    ctaSecondary: "Arrange a call",
  },
};

/* ──────────────────────────────────────────────────────────────
   PAIN POINT E — Service & Case Handling
────────────────────────────────────────────────────────────── */
const kiKundensupport: PainPointContent = {
  slug: "service-fallbearbeitung",
  seo: {
    title: "Service & Case Handling with AI | NEWEDGE Munich",
    description:
      "NEWEDGE takes in recurring inquiries, answers them in their professional context and hands complex cases to your team with full context. Around the clock.",
    canonical: "/en/loesungen/service-fallbearbeitung",
  },
  hero: {
    overlabel: "SERVICE & CASE HANDLING · CONFIGURED FOR YOUR FIELD",
    h1Line1: "The same inquiry, over and over —",
    h1Line2Highlighted: "no longer lands on your desk.",
    sub:
      "This is how we automate service and case handling. Recurring requests are answered from your approved knowledge — unclear cases reach your team with context.",
    ctaPrimary: "Book a demo",
    ctaSecondary: "Arrange a call",
    imageNote:
      "Intake by phone, email and portal → request recognized and matched to the case → answered or handed over with full context.",
    imageAlt: "Inquiries taken in, answered in their professional context or handed over with full context",
    image: "pain-point-kundensupport-hero",
  },
  trustBar: {
    headline: "For organizations that field the same questions every day",
    sub: "The same building blocks — in insurance, education, funding and real estate",
    logos: ["Insurers", "Brokers", "Universities", "Training providers", "Funding bodies", "Foundations", "Property management"],
  },
  definition: {
    title: "What is automated service and case handling?",
    body:
      "Automated service and case handling takes in recurring inquiries across every intake channel, matches them to the right case and answers or handles them from your organization's approved knowledge. Anything that requires a professional judgement goes to the responsible person with full context. It is one of four standardized functions running on the same infrastructure — configured for your field, not built as a standalone support product.",
  },
  feature1: {
    h2: "Recurring inquiries — answered without anyone having to look them up.",
    h3: "Take in requests and answer them in their professional context, around the clock",
    sub:
      "The broker asks about the state of a claim, the student about the deadline for their documents, the applicant about the next procedural step, the tenant reports a leaking radiator. NEWEDGE takes in the request, matches it to the open case and answers from your approved knowledge — in your tone of voice, evenings and weekends included.",
    bullets: [
      "One intake for phone, email and portal",
      "Answers from your approved knowledge, never invented",
      "Tells people where their case stands instead of referring them on",
    ],
    imageNote: "Inquiry arrives → request recognized and matched to the case → answer goes out.",
    imageAlt: "Recurring inquiries taken in and answered in their professional context",
    image: "pain-point-kundensupport-feature1",
  },
  feature2: {
    h2: "Complex cases — handed over, not passed along.",
    h3: "Routing to the responsible desk, with full context",
    sub:
      "As soon as a request calls for a professional judgement, it goes to the responsible person — with the history so far, the state of the case and the documents already on file. Nobody has to describe their concern a second time, and nobody starts the research from scratch. Urgent cases are recognized and moved up.",
    bullets: [
      "Assigned to the desk that is professionally responsible",
      "Full history and case status come with it",
      "Urgency is recognized and reflected in the order of work",
    ],
    imageNote: "Handover to the responsible person with a context badge on the case.",
    imageAlt: "Complex cases handed to the responsible desk with full case context",
    image: "pain-point-kundensupport-feature2",
  },
  feature3: {
    h2: "What gets asked often becomes visible — before it turns into a backlog.",
    h3: "Inquiries as a signal: recurring themes become visible",
    sub:
      "When questions about a deadline, a form or a procedural step start piling up, the people asking are rarely the reason. NEWEDGE shows which inquiries recur and where in your process they originate — so you can remove the cause instead of giving the same answer forever.",
    bullets: [
      "Recurring inquiries become visible as a group",
      "Shows where in the process the questions arise",
      "A basis for forms and notices that trigger fewer questions",
    ],
    imageNote: "Recurring inquiries grouped by theme, linked to the procedural step.",
    imageAlt: "Recurring inquiries grouped by theme and by their point in the process",
    image: "pain-point-kundensupport-feature3",
  },
  integrations: {
    h2: "Connects with your systems",
    h3: "Which systems can be connected for service and case handling?",
    sub: "Connects to your mailbox, calendar, records and administration systems as well as to common service software — natively or via interface.",
    logos: [LOGO.outlook, LOGO.teams, LOGO.googleWorkspace, LOGO.salesforce, LOGO.hubspot, LOGO.sharepoint, LOGO.zendesk, LOGO.freshdesk, LOGO.zapier],
  },
  compare: {
    h2: "Service & Case Handling with NEWEDGE — and without",
    h3: "What changes in day-to-day handling",
    altLabel: "Common today",
    rows: [
      { k: "Availability", ne: "Outside office hours too", alt: "Only during service hours" },
      { k: "First response", ne: "Immediately on arrival", alt: "Whenever someone gets to it" },
      { k: "Status information", ne: "Straight from the case", alt: "Call back after research" },
      { k: "Peak load", ne: "Taken in as well", alt: "Backlog and waiting time" },
      { k: "Handover to people", ne: "With full context", alt: "The concern is described again" },
      { k: "Answer quality", ne: "The same knowledge everywhere", alt: "Depends on the person and the day" },
    ],
  },
  featureCards: {
    h2: "Taken in, answered, handed over — in the right professional context.",
    h3: "What service & case handling delivers in your organization",
    cards: [
      {
        title: "Take in inquiries",
        desc: "Phone, email and portal come together in one place.",
        iconNote: "Animation: inquiries from three channels converge",
        icon: "ppe-icon-speed",
      },
      {
        title: "Handover with context",
        desc: "Complex cases reach your team fully briefed.",
        iconNote: "Animation: case moves to the responsible person with a context badge",
        icon: "ppe-icon-route",
      },
      {
        title: "Recurring themes",
        desc: "You see which questions pile up — and where they come from.",
        iconNote: "Animation: inquiries group themselves by theme",
        icon: "ppe-icon-analytics",
      },
    ],
  },
  testimonialHero: {
    quote:
      "A service agent must never invent a truth of its own. It answers from your approved knowledge, states where the case stands — and hands over to a person the moment the case is not clear-cut. With full context, so nobody has to ask their question twice.",
    author: "NEWEDGE — working principle",
  },
  faq: [
    {
      q: "What happens when the system isn't sure of an answer?",
      a: "Then it doesn't answer. It works solely from your approved knowledge and the state of the case. If that basis is missing, or if the case calls for a professional judgement, it goes to your team with full context rather than being guessed at.",
    },
    {
      q: "Do you build a separate solution for every sector?",
      a: "No. Service & Case Handling is one of four standardized functions running on the same infrastructure. For insurers it is configured for broker and customer inquiries about policies, premiums and claim status, for universities and training providers for student services with deadlines, documents and status, for funding bodies for applicants' questions about procedures and evidence, for property management for tenant concerns, maintenance reports and handover to trades. Configured, not rebuilt.",
    },
    {
      q: "How does the system know what applies in our organization?",
      a: "From your own material: rules, guidance sheets, deadlines, standard replies and previous correspondence. Anything not held there is not answered but handed over.",
    },
    {
      q: "In which languages can it reply?",
      a: "German, English and other common languages — depending on who gets in touch with you. Multilingual through the same intake.",
    },
    {
      q: "Who looks after the service function once it is live?",
      a: "NEWEDGE handles operation and adjustments when deadlines, forms or responsibilities change. You have a dedicated contact for it.",
    },
  ],
  closingCta: {
    h2Line1: "The next follow-up question",
    h2Line2Highlighted: "is already answered.",
    sub: "We go through your most common inquiries and show which of them can run without your team.",
    ctaPrimary: "Book a demo",
    ctaSecondary: "Arrange a call",
  },
};

/* ──────────────────────────────────────────────────────────────
   INDUSTRY 1 — Decision-making bodies
────────────────────────────────────────────────────────────── */
const entscheidungsinstanzen: PainPointContent = {
  slug: "foerderungen-entscheidungsinstanzen",
  seo: {
    title: "Evaluation software: juries, funding & procurement | NEWEDGE",
    description:
      "Audit-proof application, selection and procurement processes for funding bodies, juries and universities — GDPR-compliant, VgV/UVgO-ready. Book a demo.",
    canonical: "/en/industrien/foerderungen-entscheidungsinstanzen",
  },
  hero: {
    overlabel: "FOR FUNDING BODIES · AWARDS · UNIVERSITIES · CONTRACTING AUTHORITIES",
    h1Line1: "You decide about others.",
    h1Line2Highlighted: "Who decides for you?",
    sub:
      "This is how an AI department changes funding and decision processes. You decide according to your own rulebook — structured, fair and audit-proof.",
    ctaPrimary: "Book a demo",
    ctaSecondary: "See the BMP Award case",
    imageNote:
      "Visual: stack of unstructured submissions → structured panel cockpit with scoring, audit trail and comparability.",
    imageAlt: "Before: submission chaos — after: structured decision cockpit",
    image: "pain-point-entscheidungsinstanzen-hero",
  },
  trustBar: {
    headline: "Trusted by decision-making bodies across Germany",
    sub: "Awards, universities, funding institutions, contracting authorities, associations",
    logos: ["BMP Award", "University", "Funding institution", "Contracting authority", "Association"],
  },
  definition: {
    title: "What is AI-powered evaluation software for panels?",
    body:
      "AI-powered evaluation software captures applications and submissions automatically, guides the panel through a consistent review and evaluation process and documents every decision in an audit-proof way. Funding bodies, contracting authorities, universities and award organizations reduce the effort each procedure takes — and can justify every decision without a gap, from the first evaluation to the formal decision notice.",
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
    image: "pain-point-entscheidungsinstanzen-feature1",
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
      "VgV- and UVgO-compliant procurement documentation",
      "Rationale at the push of a button — for objections, oversight and internal review",
    ],
    imageNote: "Visual: audit-trail timeline of a decision with all steps and evaluations.",
    imageAlt: "Audit-proof decision documentation with an audit trail",
    image: "pain-point-entscheidungsinstanzen-feature3",
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
        desc: "Briefings, deadlines and evaluation rounds run automatically. Your panel judges instead of managing the process.",
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
      "What used to mean painstaking manual coordination now runs automatically with NEWEDGE — and the quality of our decisions has noticeably improved.",
    author: "BMP Award — Project lead",
  },
  faq: [
    {
      q: "How long does it take to set up an AI evaluation system?",
      a: "The sequence is always the same: import of your existing criteria catalogs, configuration of the weightings, a test phase with real application documents, then the live start. How long that takes depends on the scope of the rule set — we agree the schedule up front.",
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
      q: "Is the system also suitable for public procurement procedures?",
      a: "Yes. The system supports structured procurement processes under VgV and UVgO. All evaluation steps are documented without gaps and are audit-proof and traceable — a requirement that is mandatory for public tenders.",
    },
  ],
  // howTo: deliberately omitted — `totalTime` ("P14D") was an unevidenced time
  // claim emitted as JSON-LD. Handled the same way as insurance, education and
  // real estate.
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
    image: "pain-point-health-care-feature1",
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
    image: "pain-point-health-care-feature2",
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
    image: "pain-point-health-care-feature3",
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
    image: "pain-point-handel-supply-chain-feature1",
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
    image: "pain-point-handel-supply-chain-feature2",
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
    image: "pain-point-handel-supply-chain-feature3",
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
    image: "pain-point-professional-services-feature1",
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
    image: "pain-point-professional-services-feature3",
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

/* ──────────────────────────────────────────────────────────────
   INDUSTRY 5 — Insurance
   Vertical profile, NOT a product of its own: the same four
   blueprints, configured for claims, policy, service and steering.
   NO figures, no time savings, no customer numbers, no turnaround
   times — there are no measured results for this industry.
   No statements on VAG, BaFin or licensing questions.
────────────────────────────────────────────────────────────── */
const versicherungen: PainPointContent = {
  slug: "versicherungen",
  seo: {
    title: "AI in insurance: claim notification & coverage | NEWEDGE",
    description:
      "Claim notification captured, coverage check prepared, policy records reconciled: the benefit claim arrives ready to decide. Book a demo.",
    canonical: "/en/industrien/versicherungen",
  },
  hero: {
    overlabel: "FOR INSURERS · BROKERS · MANAGING GENERAL AGENTS",
    h1Line1: "The decision stays with you.",
    h1Line2Highlighted: "The groundwork doesn't.",
    sub:
      "This is how an AI department changes insurance. Claims land on your desk checked and decision-ready – every step documented and traceable.",
    ctaPrimary: "Book a demo",
    ctaSecondary: "Book an intro call",
    imageNote:
      "Visual: claim notification with scattered attachments and an email thread → a tidy case file with completeness status, coverage note and flagged irregularities.",
    imageAlt: "Before: an incomplete claim notification — after: a case file ready to decide",
    image: "pain-point-versicherungen-hero",
    // image: deliberately omitted — there is no matching ImageKey in assets.ts yet.
  },
  trustBar: {
    headline: "For insurers, brokers and managing general agents across the German-speaking market",
    sub: "Claims, benefits, operations, distribution, broker and customer service",
    logos: ["Insurer", "Broker", "MGA", "Claims department", "Policy service"],
  },
  definition: {
    title: "What does an AI department mean for an insurance business?",
    body:
      "An AI department is not a new core system but a layer on top of what you already run. It takes in claim notifications, applications and requests, checks documents for completeness, matches them against your policy wordings and your policy administration, and puts a complete case file forward. Which cases your own rules cover clearly enough to qualify for straight-through processing (STP) is for you to define; every benefit claim that calls for judgment goes to your handlers. Assessment, approval and settlement remain yours — only without the digging that used to come first.",
  },
  /* FEATURE 01 — Decisions & Case Review, configured for claims and benefits */
  feature1: {
    image: "pain-point-versicherungen-feature1",
    h2: "The case reaches the desk ready to decide.",
    h3: "Decisions & Case Review, configured for claims and benefits",
    sub:
      "Most of the time before a benefit claim can be decided goes into chasing: which document is missing, what do the terms say, were there earlier losses? NEWEDGE handles that groundwork — taking in the claim notification, requesting and checking documents, preparing the coverage check against your policy wording, flagging anything unusual. Your handler gets a complete case file instead of raw material. The decision and the settlement are still yours.",
    bullets: [
      "The case file is complete before anyone opens it — missing evidence has already been requested",
      "The coverage check is prepared against your policy wording — with the passage cited, not recalled from memory",
      "Anything unusual is flagged rather than missed — including prior damage and inconsistencies in the details given",
    ],
    imageNote:
      "Visual: claims file with a completeness check, a coverage note citing the passage in the policy wording, and flagged irregularities.",
    imageAlt: "Prepared claims file with a completeness check and a coverage note",
    // image: deliberately omitted → falls back to "painpoint-a-section3".
  },
  /* FEATURE 02 — Documents & Processes, configured for policy paperwork */
  feature2: {
    image: "pain-point-versicherungen-feature2",
    h2: "Application, endorsement, cancellation — sorted, not stacked.",
    h3: "Documents & Processes, configured for policies and contract paperwork",
    sub:
      "Applications arrive as PDFs, evidence as photos, cancellations by email — and in the end all of it has to sit cleanly in the policy record. NEWEDGE captures the paperwork, recognizes what each item is about, extracts the relevant details, checks for completeness and reconciles everything with your policy administration. Whatever does not match comes to you with a note instead of going into the system unchecked.",
    bullets: [
      "Incoming paperwork is assigned to the right policy and its details extracted before anyone touches it",
      "Missing information surfaces on arrival, not halfway through processing",
      "Discrepancies against your records are reported instead of quietly carried over",
    ],
    imageNote:
      "Visual: a mixed inbox of application, endorsement and photographed evidence → an ordered policy file with completeness status and a flagged discrepancy against the record.",
    imageAlt: "Policy paperwork captured, checked and reconciled with your records",
    // image: deliberately omitted → falls back to "painpoint-a-feature2".
  },
  /* FEATURE 03 — Service & Case Handling, configured for broker and customer requests */
  feature3: {
    image: "pain-point-versicherungen-feature3",
    h2: "Brokers and customers get an answer sooner.",
    h3: "Service & Case Handling, configured for policy and claims requests",
    sub:
      "A large share of requests repeats itself: where a claim stands, a change in premium, a missing document, a new address. NEWEDGE takes them in, understands what is being asked and answers within the rules you set, or prepares the answer. Anything that calls for professional judgment goes to the right person with the full context.",
    bullets: [
      "Recurring policy and claims requests are answered without a queue",
      "Complex cases reach the right person — with the policy, the history and the documents attached",
      "Where a case stands is visible, instead of something people have to ring up and ask",
    ],
    imageNote:
      "Visual: requests from email, the broker portal and the phone → one view with the request, the policy it relates to, a draft reply and a clean handover to the specialist team.",
    imageAlt: "Broker and customer requests brought together with the related policy and a draft reply",
    // image: deliberately omitted → falls back to "painpoint-a-feature3".
  },
  integrations: {
    h2: "Connects with the systems you already use.",
    h3: "Which systems can be brought into claims and policy processes?",
    sub:
      "Not a system that replaces your policy administration. NEWEDGE sits on top of the tools your teams work with today and takes over the steps in between.",
    logos: [
      LOGO.outlook,
      LOGO.teams,
      LOGO.sharepoint,
      LOGO.googleWorkspace,
      LOGO.docusign,
      LOGO.salesforce,
      LOGO.zendesk,
      LOGO.zapier,
      LOGO.make,
    ],
  },
  compare: {
    h2: "NEWEDGE vs. manual claims and policy handling",
    h3: "The same building blocks, configured for insurance — side by side",
    altLabel: "Today, manual",
    rows: [
      { k: "Capturing a claim notification", ne: "Structured, from every channel", alt: "Email, PDF, phone note" },
      { k: "Requesting missing documents", ne: "Automatic, with follow-up", alt: "Chasing by hand" },
      { k: "Coverage check", ne: "Pre-checked, with the passage cited", alt: "Reading through the policy wording" },
      { k: "Policy administration", ne: "Reconciled, discrepancies reported", alt: "Retyping from documents" },
      { k: "Broker and customer requests", ne: "Answered or prepared", alt: "A call back when there is time" },
      { k: "Steering & Reporting", ne: "Portfolio and backlog in one view", alt: "Several systems, several numbers" },
      { k: "Decision & approval", ne: "Stays with your handler", alt: "Stays with your handler" },
    ],
  },
  featureCards: {
    h2: "You decide. We do the groundwork.",
    h3: "What NEWEDGE takes on in claims, policy and service",
    cards: [
      {
        title: "Cases ready to decide",
        desc: "Notification, documents, the coverage question and anything unusual are checked and brought together before your handler opens the case.",
        iconNote: "Icon: case file with a checkmark and a warning flag",
        // icon: deliberately omitted — the component ignores it anyway.
      },
      {
        title: "Paperwork without manual work",
        desc: "Applications, endorsements and evidence are captured, checked and reconciled with your records. Discrepancies come to you with a note.",
        iconNote: "Icon: stack of documents → structured data sheet",
      },
      {
        title: "Steering in one place",
        desc: "Portfolio, open cases, backlog and service levels come together in a single view instead of sitting in separate systems.",
        iconNote: "Icon: dashboard with metric tiles",
      },
    ],
  },
  /**
   * No customer quote: there is no reference project in this industry.
   * Deliberately phrased as a NEWEDGE working principle, without figures.
   */
  testimonialHero: {
    quote:
      "Insurance is no different from anywhere else: we take on the recurring checking and preparation, not the judgment. Whether a claim is accepted is for your business to decide — we make sure the basis for that decision is complete and can be traced.",
    author: "NEWEDGE — working principle",
  },
  faq: [
    {
      q: "Does the AI decide claims and benefit cases?",
      a: "No. NEWEDGE takes the claim notification in, checks the documents for completeness, prepares the coverage check against your policy wording and flags anything unusual. Acceptance, rejection and the amount to be settled are decided by your handler — on a basis that is already complete in front of them.",
    },
    {
      q: "Do you build separate software for insurance?",
      a: "No. These are the same standardized functions as in every other industry: Decisions & Case Review, Documents & Processes, Steering & Reporting, and Service & Case Handling. For your business they are configured to your lines, policy wordings and workflows — not a bespoke project started from scratch.",
    },
    {
      q: "Do we have to replace our policy administration system?",
      a: "No. NEWEDGE does not replace a core system. The building blocks connect to what you work with today — mailbox, document storage, ticketing, policy administration — and take over the steps in between. Your data stays where it is.",
    },
    {
      q: "How does the system know what our policy wordings say?",
      a: "You provide the wordings, the clauses and your internal review rules. NEWEDGE works from those alone and points to the passage behind every pre-check. Anything not clearly covered is handed to your specialists as an open point rather than being decided.",
    },
    {
      q: "How do you handle personal data and evidence?",
      a: "Processing is GDPR-compliant, with roles and access rights, and on request in a German cloud or inside your own infrastructure. Every processing step is logged, so that disclosure, evidence and retention obligations can still be met.",
    },
    {
      q: "Where do insurers and brokers typically start?",
      a: "With a clearly bounded slice — a single line of business in claims handling, say, or the inbox for policy paperwork. There you can hold the result directly against the way you work today, and you see which cases your rules cover completely and therefore qualify for straight-through processing — before further lines, processes or service follow.",
    },
  ],
  // howTo: deliberately omitted — `totalTime` would be an unevidenced time claim.
  // miniCases: not assigned (SHOW_MINI_CASES = false, no cases in this industry).
  closingCta: {
    h2Line1: "We do the checking.",
    h2Line2Highlighted: "You make the decision.",
    sub: "A conversation about which slice makes sense to start with.",
    ctaPrimary: "Book a demo",
    ctaSecondary: "Book an intro call",
  },
};

/* ──────────────────────────────────────────────────────────────
   INDUSTRY 6 — Education
   Vertical profile, NOT a product of its own: the same four
   blueprints, configured for admissions, supporting documents and
   student services. NO figures, no time savings, no case numbers,
   no turnaround times — there are no measured results here.
   Admission and examination decisions stay with the admissions committee.
────────────────────────────────────────────────────────────── */
const bildung: PainPointContent = {
  slug: "bildung",
  seo: {
    title: "Admissions & enrollment: AI for universities | NEWEDGE",
    description:
      "Applicant management, admissions and student registry for universities, academies and training providers — checked and documented. Book a demo.",
    canonical: "/en/industrien/bildung",
  },
  hero: {
    overlabel: "FOR UNIVERSITIES · ACADEMIES · TRAINING PROVIDERS · SCHOOLS",
    h1Line1: "Your admissions committee decides.",
    h1Line2Highlighted: "We do the groundwork.",
    sub:
      "This is how an AI department changes education. Complete applications, clear admission decisions — and student services with time for what matters.",
    ctaPrimary: "Book a demo",
    ctaSecondary: "Book an intro call",
    imageNote:
      "Visual: a pile of PDF applications, copied certificates and email attachments → an ordered application overview with completeness status and flagged exceptions.",
    imageAlt:
      "Before: application documents in a pile — after: a checked application overview for the admissions committee",
    image: "pain-point-bildung-hero",
    // image: deliberately omitted — no motif exists in assets.ts yet.
  },
  trustBar: {
    headline: "Built for admissions, supporting documents and student services",
    sub: "Universities, academies, training providers, school authorities, continuing education",
    logos: ["University", "Academy", "Training provider", "School authority", "Continuing education"],
  },
  definition: {
    title: "What is an AI department for universities and training providers?",
    body:
      "A department you rent rather than new specialist software: NEWEDGE runs four standardized building blocks — Decisions & Case Review, Documents & Processes, Steering & Reporting, Service & Case Handling — and configures them for your context. In education that means applicant management and the admissions procedure run prepared, supporting documents are checked for completeness and held against your admission criteria, and the student registry is relieved of recurring questions. Admission is decided by your admissions committee.",
  },
  /* FEATURE 01 — Decisions & Case Review */
  feature1: {
    image: "pain-point-bildung-feature1",
    h2: "Every application against the same yardstick.",
    h3: "Decisions & Case Review, configured for admissions",
    sub:
      "Applications arrive in every format, documents are missing, and the committee works through one file after another. NEWEDGE handles applicant management up to the review: taking applications in, checking the required documents, applying your admission criteria, flagging the exceptions. The committee gets a prepared submission instead of a pile — and decides.",
    bullets: [
      "Completeness is checked before the review starts — missing documents stand out straight away",
      "Your admission criteria are applied consistently — the same way to every application",
      "Exceptions and edge cases are flagged — so the committee decides them deliberately",
    ],
    imageNote:
      "Visual: list of applications with a completeness indicator per document, and a prepared submission for the admissions committee on the right.",
    imageAlt: "Application overview with checked documents and flagged exceptions",
    // image: deliberately omitted → falls back to "painpoint-a-section3".
  },
  /* FEATURE 02 — Documents & Processes */
  feature2: {
    image: "pain-point-bildung-feature2",
    h2: "Administrative cases without rounds of chasing.",
    h3: "Documents & Processes, configured for enrollment, leave of absence and credit recognition",
    sub:
      "Enrollment, leave of absence, recognition of prior credit, official certificates: every case brings its own paperwork, and every gap costs another email. NEWEDGE captures the documents, assigns them to the case, checks them for completeness and reconciles the data with your systems. Discrepancies go to the person responsible — with the context attached.",
    bullets: [
      "Documents are sorted and assigned to the case before anyone touches them",
      "Missing information surfaces early, not at the third round of chasing",
      "Discrepancies land with the person responsible — with the whole case behind them",
    ],
    imageNote:
      "Visual: an inbox of applications and certificates → a case file with assigned documents, review status and one flagged discrepancy.",
    imageAlt: "Administrative case with assigned documents and a review status per document",
    // image: deliberately omitted → falls back to "painpoint-a-feature2".
  },
  /* FEATURE 03 — Service & Case Handling */
  feature3: {
    image: "pain-point-bildung-feature3",
    h2: "Recurring questions no longer tie up your team.",
    h3: "Service & Case Handling, configured for student services",
    sub:
      "Deadlines, documents, where an application stands — the same questions reach the student registry before every intake, by email, by phone and through web forms. NEWEDGE takes them in, answers the recurring ones with the current status from your systems and routes everything else to the right place. Cases that need advice reach your team with the full context.",
    bullets: [
      "Standard answers on deadlines, documents and status go out without your involvement",
      "Requests reach the office responsible instead of a general inbox",
      "Advice stays with people — with the whole case behind them",
    ],
    imageNote:
      "Visual: requests from email, web form and phone run into one channel, alongside answered standard cases and one advisory case handed to the specialist office.",
    imageAlt: "Student requests brought together, answered and handed to the office responsible",
    // image: deliberately omitted → falls back to "painpoint-a-feature3".
  },
  integrations: {
    h2: "Connects with the systems you already use.",
    h3: "Which systems can be integrated into admissions and student administration?",
    sub:
      "Not a system that replaces your campus management. NEWEDGE builds on the infrastructure you already run — email, storage, forms, calendars.",
    logos: [
      LOGO.outlook,
      LOGO.teams,
      LOGO.sharepoint,
      LOGO.googleWorkspace,
      LOGO.docusign,
      LOGO.notion,
      LOGO.zoom,
      LOGO.calendly,
      LOGO.zapier,
    ],
  },
  compare: {
    h2: "NEWEDGE vs. admissions and administration by hand",
    h3: "The same process, once prepared and once not",
    altLabel: "Today, manual",
    rows: [
      { k: "Incoming applications", ne: "Captured in a structured form", alt: "PDFs in the inbox" },
      { k: "Document check", ne: "Before the review", alt: "While leafing through" },
      { k: "Admission criteria", ne: "Applied consistently", alt: "Depends on the reviewer" },
      { k: "Exceptions", ne: "Flagged and explained", alt: "Surface late" },
      { k: "Student requests", ne: "Answered or routed", alt: "Shared inbox" },
      { k: "Where a case stands", ne: "Available at any time", alt: "Ask around the team" },
      { k: "Traceability", ne: "Documented", alt: "Spread across emails" },
    ],
  },
  featureCards: {
    h2: "Your admissions committee decides. We prepare.",
    h3: "What NEWEDGE takes on in day-to-day education administration",
    cards: [
      {
        title: "Numbers without the round-robin email",
        desc: "Applicant volume, capacity and case status come together — leadership sees where things stand without a round of emails.",
        iconNote: "Icon: metrics overview / chart",
      },
      {
        title: "Data protection from the start",
        desc: "Applicant data stays in your environment. Designed to be GDPR-compliant, hosted locally on request, with access clearly governed.",
        iconNote: "Icon: lock / data protection",
      },
      {
        title: "Traceably documented",
        desc: "Every review step is recorded — who checked what and when can be shown later without digging through a mailbox.",
        iconNote: "Icon: review log / history",
      },
    ],
  },
  /**
   * No customer quote — there is neither a reference nor a measured result
   * in this industry. Stated as a principle in our own name.
   */
  testimonialHero: {
    quote:
      "An admission is not a software decision. We make sure every application is complete, checked and comparable when it reaches the committee — the decision itself stays where it belongs.",
    author: "NEWEDGE — working principle",
  },
  faq: [
    {
      q: "Does the AI decide on admissions?",
      a: "No. The system takes applications in, checks supporting documents for completeness and applies your criteria. The admission decision is made by your admissions committee — on a prepared basis that can be traced.",
    },
    {
      q: "Do we have to replace our campus management system?",
      a: "No. NEWEDGE builds on your existing infrastructure and works through the channels you already use: email, storage, forms. Whatever sits in your systems today stays there.",
    },
    {
      q: "What happens to applicant data?",
      a: "It stays in your environment. Processing is designed to be GDPR-compliant, the system can be hosted locally on request, and you decide who may access which documents.",
    },
    {
      q: "Is this a special solution for universities?",
      a: "No. These are the same four standardized functions we run in every industry: Decisions & Case Review, Documents & Processes, Steering & Reporting, Service & Case Handling. For you they are configured for admissions, supporting documents and student services — not built anew.",
    },
    {
      q: "Does this work outside the application period as well?",
      a: "Yes. Enrollment, leave of absence, recognition of prior credit, the paperwork of examinations administration and official certificates follow the same pattern: capture the documents, check them, reconcile them, and pass discrepancies to the person responsible.",
    },
    {
      q: "How do you handle our regulations and requirements?",
      a: "You set the rules. NEWEDGE reflects what you specify and documents every review step. Legal assessments, questions of interpretation and exceptions stay with your specialist offices and committees.",
    },
  ],
  // howTo: deliberately omitted — any totalTime would be an unevidenced time claim.
  // miniCases: deliberately omitted — no cases exist in this industry.
  closingCta: {
    h2Line1: "Applications prepared.",
    h2Line2Highlighted: "The decision is yours.",
    sub: "We walk through your own admissions process and show what the four building blocks take on.",
    ctaPrimary: "Book a demo",
    ctaSecondary: "Book an intro call",
  },
};

/* ──────────────────────────────────────────────────────────────
   INDUSTRY 7 — Real Estate
   Vertical profile, NOT a product of its own: the same four
   blueprints, configured for property, tenancy and maintenance cases.
   NO figures, no time savings, no customer numbers, no turnaround
   times — there are no measured results for this industry.
   NO legal statements (tenancy, commonhold, service-charge law) —
   we describe what is prepared, not what the law provides.
────────────────────────────────────────────────────────────── */
const immobilien: PainPointContent = {
  slug: "immobilien",
  seo: {
    title: "Property management: tenant changes & maintenance | NEWEDGE",
    description:
      "Property files sorted, casework from tenant change to maintenance report ready to decide, portfolio in one view. Book a demo.",
    canonical: "/en/industrien/immobilien",
  },
  hero: {
    overlabel: "FOR PROPERTY MANAGERS · PORTFOLIO OWNERS · ASSET MANAGEMENT",
    h1Line1: "Managing property is not sorting paperwork.",
    h1Line2Highlighted: "Your paperwork sorts itself out first.",
    sub:
      "This is how an AI department changes real estate. Tenancy and property cases reach you sorted, checked and documented so every step can be traced.",
    ctaPrimary: "Book a demo",
    ctaSecondary: "Book an intro call",
    imageNote:
      "Visual: on the left an unsorted pile of tenancy agreements, invoices, photos and printed emails → on the right a structured property file, sorted by unit, with flagged irregularities.",
    imageAlt:
      "Before: unsorted property and tenancy paperwork — after: a structured property file per unit",
    image: "pain-point-immobilien-hero",
    // image: deliberately omitted — there is no matching ImageKey in assets.ts yet.
  },
  trustBar: {
    headline: "Built for property management and portfolio holding",
    sub: "Property managers, portfolio owners, asset and property management",
    logos: [
      "Property management",
      "Portfolio owner",
      "Asset management",
      "Managing agent",
      "Housing cooperative",
    ],
  },
  definition: {
    title: "What is an AI department for property management?",
    body:
      "One shared infrastructure running four standardized functions: Decisions & Case Review, Documents & Processes, Steering & Reporting, Service & Case Handling. For real estate those same functions are configured for casework across portfolio administration, tenancies and maintenance: paperwork lands in the property file and is reconciled, deadlines and irregularities are flagged, maintenance reports are taken in and routed on. The decision is still made by your own team.",
  },
  /* FEATURE 01 — Documents & Processes */
  feature1: {
    image: "pain-point-immobilien-feature1",
    h2: "Documents are sorted before anyone goes looking.",
    h3: "Documents & Processes — configured for property and tenancy paperwork",
    sub:
      "Tenancy agreements, invoices for the service-charge statement, supporting documents and handover reports come from every direction and in every format. NEWEDGE captures them, assigns them to the property file and the unit, extracts the relevant details and reconciles them with your portfolio records. Whatever is missing or does not match is flagged before you open the case.",
    bullets: [
      "Every document sits in the right property file and with the right unit — no re-filing",
      "Details from agreements and invoices are extracted and reconciled with your portfolio records",
      "Missing documents and discrepancies are flagged before the case moves on",
    ],
    imageNote:
      "Visual: incoming documents from post, email and scanner run into one property file; extracted fields are visibly reconciled with the record.",
    imageAlt:
      "Tenancy and property paperwork captured and reconciled in a structured property file",
    // image: deliberately omitted → falls back to "painpoint-a-section3".
  },
  /* FEATURE 02 — Decisions & Case Review */
  feature2: {
    image: "pain-point-immobilien-feature2",
    h2: "The case reaches your desk ready to decide.",
    h3: "Decisions & Case Review — configured for tenant changes, deposits and contract amendments",
    sub:
      "A change of tenant, a deposit, a rent increase, a contract amendment: every case needs the same documents, the same deadlines, the same checks — and every time someone gathers them from scratch. NEWEDGE checks completeness and deadlines against your own rules and puts the case forward with everything it needs. Deciding and approving is your team's job.",
    bullets: [
      "Completeness and deadlines are checked before the case reaches you",
      "Irregularities and exceptions are flagged rather than missed",
      "Every check is documented so it can be followed months later",
    ],
    imageNote:
      "Visual: a case card for a change of tenant with a checklist of documents and deadlines, open points highlighted, and the approval field left to a person.",
    imageAlt:
      "A property case prepared for decision, with checked documents and deadlines",
    // image: deliberately omitted → falls back to "painpoint-a-feature2".
  },
  /* FEATURE 03 — Service & Case Handling */
  feature3: {
    image: "pain-point-immobilien-feature3",
    h2: "Reports keep moving, even without a call back.",
    h3: "Service & Case Handling — configured for tenant communication and maintenance",
    sub:
      "A dripping tap, a question about the service-charge statement, an appointment for the handover — the issues recur, but the route to sorting them out is manual every time. NEWEDGE takes maintenance reports and tenant issues in, assigns them to the property file and the unit, answers the recurring ones and passes the rest to a contractor or to your office — with an update back to the tenant.",
    bullets: [
      "Tenant issues are taken in and classified, including outside office hours",
      "Contractor jobs go out with the full context instead of a round of questions",
      "Where a case stands is visible at any time — to tenants and to your team",
    ],
    imageNote:
      "Visual: an incoming damage report is classified, routed to a contractor and the status reported back to the tenant — one continuous line instead of a chain of phone calls.",
    imageAlt:
      "Tenant and maintenance reports taken in, classified and routed on",
    // image: deliberately omitted → falls back to "painpoint-a-feature3".
  },
  integrations: {
    h2: "Connects with the systems you already use.",
    h3: "Which systems can be connected in property management?",
    sub:
      "Not a system that replaces everything. NEWEDGE works with your existing management, accounting and communication landscape — no data migration, and no extra interface for your team to maintain.",
    logos: [
      LOGO.outlook,
      LOGO.teams,
      LOGO.sharepoint,
      LOGO.googleWorkspace,
      LOGO.datev,
      LOGO.lexoffice,
      LOGO.docusign,
      LOGO.notion,
      LOGO.zapier,
    ],
  },
  compare: {
    h2: "NEWEDGE vs. managing properties by hand",
    h3: "What differs in day-to-day casework",
    altLabel: "Today, manual",
    rows: [
      { k: "Incoming documents", ne: "Captured and assigned to the property", alt: "Email, post, folders" },
      { k: "Completeness check", ne: "Before the case is put forward, to your rules", alt: "When the case is opened" },
      { k: "Deadlines", ne: "Monitored continuously", alt: "Calendar and memory" },
      { k: "Tenant issues", ne: "Taken in and classified", alt: "Call-back list" },
      { k: "Maintenance reports", ne: "Passed on with context", alt: "A phone call and follow-up questions" },
      { k: "Portfolio overview", ne: "In one place, continuously current", alt: "Lists from several sources" },
      { k: "Traceability", ne: "Every step documented", alt: "Scattered across mailboxes" },
    ],
  },
  featureCards: {
    h2: "You decide. Everything before that, we prepare.",
    h3: "What NEWEDGE takes on in property management",
    cards: [
      {
        title: "The portfolio in one place",
        desc: "Vacancy, maintenance costs, outstanding receivables and case status sit together instead of in separate lists.",
        iconNote: "Icon: row of buildings with a metrics panel",
      },
      {
        title: "Cases without chasing",
        desc: "Change of tenant, deposit, amendment: every case takes the same route — checked, documented, with its status visible.",
        iconNote: "Icon: case card with a progress line",
      },
      {
        title: "Traceably documented",
        desc: "Who submitted, checked and put forward what, and when, sits with the case — even when somebody else takes it over.",
        iconNote: "Icon: audit trail / timeline",
      },
    ],
  },
  /**
   * No customer quote — there is neither a reference project nor a measured
   * result in this industry. Product principle, stated in our own name.
   */
  testimonialHero: {
    quote:
      "We do not build a special solution for real estate. These are the same four functions as in every other industry — configured for property, tenancy and maintenance cases. What gets decided is decided by your own team.",
    author: "NEWEDGE — working principle",
  },
  faq: [
    {
      q: "Does NEWEDGE replace our property management software?",
      a: "No. NEWEDGE sits alongside your existing systems and works with the data they already produce. Your management, accounting and communication software stays where it is — there is no additional interface for your team to maintain.",
    },
    {
      q: "Does the AI make decisions about tenancies?",
      a: "No. Cases are prepared, checked for completeness and deadlines, and put forward with anything unusual flagged. The decision is made by your own team — and it is documented with the case so it can be followed.",
    },
    {
      q: "Does NEWEDGE give tenants legal advice?",
      a: "No. Legal assessments stay with you and your advisors. NEWEDGE takes issues in, classifies them, answers the recurring ones such as who is responsible and where a case stands, and hands everything else to your team with the full context.",
    },
    {
      q: "What happens to tenant and property data?",
      a: "Processing is designed to be GDPR-compliant and is documented. NEWEDGE can run inside your own infrastructure or in a European environment — you decide which data the system sees and which it does not.",
    },
    {
      q: "We work a lot with paper and scans. Does that still work?",
      a: "Yes. Scanned documents, photos from a handover and email attachments are captured just like digital files: assigned to the property and the unit, extracted and reconciled with your records.",
    },
    {
      q: "Do we get software built specifically for real estate?",
      a: "No — and that is the point. These are the same standardized functions as in every other industry, configured for your professional context. So you are not funding a bespoke project just to get property and tenancy cases in order.",
    },
  ],
  // howTo: deliberately omitted — any totalTime would be an unevidenced time claim.
  // miniCases: deliberately omitted — no cases exist in this industry.
  closingCta: {
    h2Line1: "One case.",
    h2Line2Highlighted: "Shown once instead of explained at length.",
    sub: "We go through a typical change of tenant and show what reaches you already prepared.",
    ctaPrimary: "Book a demo",
    ctaSecondary: "Book an intro call",
  },
};

// Mini-cases (custom posts) — maintained centrally in collections/miniCases.ts,
// assigned here per use case (map key = primary slug).
// Decisions & Case Review and Decision-Making Bodies deliberately show the same
// 3 cases (identical audience and topic: jury/panel decisions) — one source,
// two use-case pages.
auswahlverfahren.miniCases = miniCasesBySlug["entscheidungsinstanzen"];
// compliance (documents & processes): not assigned — the existing cases come
// from a different field (customs, freight forwarding, containers).
// kpiDashboard (steering & reporting): not assigned — the existing cases come
// from a different field (CRM/sales, logistics providers).
// kiKundensupport (service & case handling): not assigned — the existing cases
// come from discontinued fields (therapy center, online retail with shipping
// status/returns, tax firm) and carry unevidenced numbers.
// The group stays in collections/miniCases.ts.
entscheidungsinstanzen.miniCases = miniCasesBySlug["entscheidungsinstanzen"];
localDigitalCommerce.miniCases = miniCasesBySlug["health-care"];
handelSupplyChain.miniCases = miniCasesBySlug["handel-supply-chain"];
professionalServices.miniCases = miniCasesBySlug["professional-services"];

/**
 * Slug → content. The FIRST key of each block is the canonical slug (identical
 * to the entry's `slug`/`seo.canonical`); every further key is an alias — an
 * older or shortened path pointing at the same entry so links already shared
 * do not break. Aliases deliberately do NOT appear in sitemap.xml or in the
 * prerender's SLUGS/INDUSTRY_SLUGS, and `canonical` always points at the
 * canonical path — otherwise we would create duplicate content.
 */
export const painPoints: Record<string, PainPointContent> = {
  // Pain Point A — Decisions & Case Review (formerly "auswahlverfahren")
  "entscheidungen-fallpruefung": auswahlverfahren,
  auswahlverfahren: auswahlverfahren,
  "auswahlverfahren-automatisieren": auswahlverfahren,

  // Pain Point B (Kundengewinnung entfernt)

  // Pain Point C — Documents & Processes (formerly "compliance")
  "dokumente-prozesse": compliance,
  compliance: compliance,
  "compliance-automatisierung": compliance,
  "import-export": compliance,
  "import-export-compliance": compliance,

  // Pain Point D — Steering & Reporting (formerly "kpi-dashboard")
  "steuerung-reporting": kpiDashboard,
  "kpi-dashboard": kpiDashboard,
  "kpi-dashboard-echtzeit": kpiDashboard,
  reporting: kpiDashboard,

  // Pain Point E — Service & Case Handling (formerly "ki-kundensupport")
  "service-fallbearbeitung": kiKundensupport,
  "ki-kundensupport": kiKundensupport,
  kundensupport: kiKundensupport,
  support: kiKundensupport,

  // Industrien
  "foerderungen-entscheidungsinstanzen": entscheidungsinstanzen,
  entscheidungsinstanzen: entscheidungsinstanzen,
  versicherungen: versicherungen,
  versicherung: versicherungen,
  bildung: bildung,
  hochschulen: bildung,
  immobilien: immobilien,
  hausverwaltung: immobilien,
};

export const DEFAULT_PAIN_POINT: PainPointContent = auswahlverfahren;
