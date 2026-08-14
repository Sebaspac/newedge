/**
 * Collection: Mini-Cases — Custom Post (anlegbar)
 * --------------------------------------------------------------
 * Alle Mini-Case-Studies der Anwendungsfeld-Seiten (Industrien & Pain
 * Points), gruppiert nach Seiten-Slug. Quelle: Redaktionsdokument
 * „Mini Case Studies — Industrien & Pain Points" (27 Cases).
 *
 * Zwei Case-Typen (Badge bleibt bewusst sichtbar auf der Website):
 * - „Reales Projekt · <Kunde>": basiert auf einem echten NEWEDGE-Projekt.
 *   WICHTIG: Beschreibungen/Zahlen vor Veröffentlichung mit dem Kunden
 *   abstimmen (siehe Redaktionsdokument).
 * - „Beispielhafter Anwendungsfall": plausible Demo-Geschichte, kein
 *   realer Kunde — wird ausgetauscht, sobald echte Referenzen vorliegen.
 *
 * `unassignedMiniCases` (Kundengewinnung & Funnel) haben noch keine
 * eigene Anwendungsfeld-Seite — sie werden nur ins CMS geseedet und
 * erscheinen erst, wenn eine passende Seite existiert.
 *
 * Strapi-Mapping: Collection `mini-case` (Relation auf `pain-point`).
 * --------------------------------------------------------------
 */
import type { MiniCase } from "@/content/painPoints";

const REAL_DISCLAIMER =
  "Based on a real NEWEDGE client project; individual automation details have been added for illustration.";
const BEISPIEL_BADGE = "Illustrative use case";
const BEISPIEL_DISCLAIMER =
  "This is an illustrative example scenario for demonstration — not real client data.";

export const miniCasesBySlug: Record<string, MiniCase[]> = {
  /* ── A1 · Entscheidungsinstanzen ─────────────────────────── */
  entscheidungsinstanzen: [
    {
      id: "bmp-award",
      industries: ["Awards", "Jury"],
      phaseLabel: "Case 01",
      badge: "Real project · Bayerischer Mittelstandspreis",
      disclaimer: REAL_DISCLAIMER,
      title: "BMP Award — From 275 applications in Excel to an automated jury pipeline",
      teaser:
        "No manual pre-sorting: hundreds of applications are captured, structured and presented to the jury, decision-ready.",
      scenario:
        "Real project: Bayerischer Mittelstandspreis (Bavarian SME Award) · hundreds of applications per year · several jury categories.",
      situation:
        "Applications arrived through various channels and were prepared manually in Excel: reviewing, assigning, emailing scoring sheets back and forth. That took weeks and was hard to trace.",
      approach: [
        "Applications are captured, structured and assigned to the right jury category automatically.",
        "AI scoring builds an evaluation profile and summary for each application.",
        "Jurors work directly from a decision-ready basis instead of raw data.",
        "Every scoring decision is documented in an audit-proof way.",
      ],
      result:
        "60 % higher jury efficiency, no more manual preparation — every decision documented in an audit-proof trail.",
      metrics: [
        { value: "Gone", label: "manual pre-sorting in Excel" },
        { value: "60 %", label: "higher jury efficiency" },
        { value: "100 %", label: "audit trail for every decision" },
      ],
      image: { src: "bmp-award-case", alt: "NEWEDGE at the Bayerischer Mittelstandspreis" },
    },
    {
      id: "hochschul-zulassung",
      industries: ["Higher Education", "Admissions Offices", "Master's Programs"],
      phaseLabel: "Case 02",
      badge: BEISPIEL_BADGE,
      disclaimer: BEISPIEL_DISCLAIMER,
      title: "University — Admissions process for master's applications automated",
      teaser:
        "The formal pre-check runs automatically — admission decisions go out noticeably earlier.",
      scenario:
        "Example scenario: private university · high application volume per semester · formal pre-check by the admissions team.",
      situation:
        "Every application was checked manually — grades, language certificates, motivation and recommendation letters. The formal review tied up much of the team's capacity before the academic pre-selection even began.",
      approach: [
        "Documents are captured automatically, checked for completeness and compared against the admission criteria.",
        "Incomplete applications receive immediate feedback with a specific note.",
        "Complete applications move into academic review, prioritized by suitability score.",
      ],
      result:
        "Admission decisions go out noticeably earlier. The formal review runs almost fully automatically — missing documents surface immediately instead of late in the process.",
      metrics: [
        { value: "Automatic", label: "formal pre-check instead of manual review" },
        { value: "Earlier", label: "admission decisions sent" },
        { value: "Complete", label: "documents checked before academic review" },
      ],
      image: { src: "hochschul-zulassung-case", alt: "University — Admissions process for master's applications automated" },
    },
    {
      id: "foerderbank-antragspruefung",
      industries: ["Development Banks", "Economic Development", "Public Sector"],
      phaseLabel: "Case 03",
      badge: BEISPIEL_BADGE,
      disclaimer: BEISPIEL_DISCLAIMER,
      title: "Development bank — Application review for regional economic funding automated",
      teaser:
        "The formal review runs automatically — the approval committee meets monthly instead of quarterly.",
      scenario:
        "Example scenario: regional development bank · complex rulebook of funding guidelines, thresholds and industry exclusions · rising application volume.",
      situation:
        "Case handlers checked every application manually against funding guidelines, thresholds and industry exclusions. The formal review ate up the time for the actual assessment — a growing bottleneck as volume rose.",
      approach: [
        "Applications are automatically checked against the current funding rulebook.",
        "Missing documentation is flagged immediately.",
        "The approval committee automatically receives a prioritized decision brief with all key figures.",
      ],
      result:
        "The formal review is no longer a bottleneck: the committee meets monthly instead of quarterly, and deviations in the criteria check surface automatically instead of being overlooked.",
      metrics: [
        { value: "Automatic", label: "check against the funding rulebook" },
        { value: "Monthly", label: "committee meetings instead of quarterly" },
        { value: "Complete", label: "documentation checked per application" },
      ],
      image: { src: "foerderbank-antragspruefung-case", alt: "Development bank — Application review for regional economic funding automated" },
    },
  ],

  /* ── A2 · Health Care ────────────────────────────────────── */
  "health-care": [
    {
      id: "gyn-praxis-muenchen",
      industries: ["Gynecology", "Medical Practices", "Healthcare"],
      phaseLabel: "Case 01",
      badge: "Real project · Gynecology Practice Munich",
      disclaimer: REAL_DISCLAIMER,
      title: "Gynecology Practice Munich — Digital presence with an automated booking path",
      teaser:
        "How a gynecology practice went from a phone bottleneck to a seamless online booking path.",
      scenario:
        "Real project: gynecology practice in Munich · website relaunch with automated Doctolib integration.",
      situation:
        "An outdated website with no clear path to an appointment: patients had to call — often during consultation hours. The result: missed calls and unnecessary admin work. The service offering was fragmented into short, hard-to-find sections.",
      approach: [
        "Migrated the entire web presence to a maintainable WordPress structure.",
        "Organized the service offering into seven clear categories with their own subpages.",
        "Connected appointment booking directly and automatically to Doctolib.",
        "Automatic notice when time slots are fully booked, so no patient hits a dead end.",
      ],
      result:
        "Patients book online around the clock instead of by phone. Admin calls drop noticeably, and the offering is clearly structured and easy to find.",
      metrics: [
        { value: "24/7", label: "booking path without a phone detour" },
        { value: "7", label: "structured service pages instead of short texts" },
        { value: "Noticeably", label: "fewer admin calls at the practice" },
      ],
      image: { src: "gyn-praxis-muenchen-case", alt: "Gynecology Practice Munich — Digital presence with an automated booking path" },
    },
    {
      id: "therapiezentrum-onboarding",
      industries: ["Therapy Centers", "Healthcare"],
      phaseLabel: "Case 02",
      badge: BEISPIEL_BADGE,
      disclaimer: BEISPIEL_DISCLAIMER,
      title: "Therapy center — First inquiries handled automatically around the clock",
      teaser:
        "How a therapy center cut response time from 18 hours to under 5 minutes — and closed 35 % more first consultations.",
      scenario:
        "Example scenario: therapy center with several treatment areas · first inquiries previously only by phone during opening hours.",
      situation:
        "Prospective patients called outside opening hours or gave up after several attempts. Which inquiry belonged to which treatment area, the administration did not know.",
      approach: [
        "Automated WhatsApp onboarding takes first inquiries around the clock.",
        "Inquiries are automatically assigned to the right treatment area.",
        "Available capacity is checked and concrete appointment suggestions are sent directly — with no manual intervention from the team.",
      ],
      result:
        "First inquiries are answered in minutes instead of hours, around the clock — 35 % more first consultations closed.",
      metrics: [
        { value: "+35 %", label: "first consultations closed" },
        { value: "<5 min.", label: "response time instead of 18 hours" },
        { value: "Automatic", label: "assignment to the treatment area" },
      ],
      image: { src: "therapiezentrum-onboarding-case", alt: "Therapy center — First inquiries handled automatically around the clock" },
    },
    {
      id: "praxisverbund-kapazitaeten",
      industries: ["Specialist Practices", "Practice Networks", "Scheduling"],
      phaseLabel: "Case 03",
      badge: BEISPIEL_BADGE,
      disclaimer: BEISPIEL_DISCLAIMER,
      title: "Specialist practice network — Cross-location capacity management automated",
      teaser:
        "How a practice network spots bottlenecks a week ahead instead of on the day itself.",
      scenario:
        "Example scenario: network of several specialist practices · decentralized appointment lists per location.",
      situation:
        "Each location kept its own lists — a central overview of utilization, waiting times and no-show rates was missing. Bottlenecks went unnoticed even though neighboring locations had free capacity.",
      approach: [
        "An automated real-time dashboard brings all locations together.",
        "Utilization patterns are detected automatically.",
        "When bottlenecks loom, alternative free appointments at nearby locations are suggested automatically.",
      ],
      result:
        "The network manages capacity across locations for the first time: fewer no-shows, better utilization, bottlenecks visible a week in advance.",
      metrics: [
        { value: "−22 %", label: "no-show rate" },
        { value: "+15 %", label: "appointment utilization across locations" },
        { value: "1 week", label: "lead time in detecting bottlenecks" },
      ],
      image: { src: "praxisverbund-kapazitaeten-case", alt: "Specialist practice network — Cross-location capacity management automated" },
    },
  ],

  /* ── A3 · Handel & Supply Chain ──────────────────────────── */
  "handel-supply-chain": [
    {
      id: "grosshandel-bestelleingabe",
      industries: ["Wholesale", "B2B Sales", "DACH"],
      phaseLabel: "Case 01",
      badge: BEISPIEL_BADGE,
      disclaimer: BEISPIEL_DISCLAIMER,
      title: "Wholesale DACH — Three full-time order-entry roles replaced by automation",
      teaser:
        "How a wholesaler processes 400 orders a day in under 30 seconds per order.",
      scenario:
        "Example scenario: wholesaler in the DACH region · ~400 orders daily via email, customer portal and EDI interfaces.",
      situation:
        "Three employees did nothing but capture order data and transfer it manually into the ERP system. At peak times: delays and typos that had to be corrected at great effort.",
      approach: [
        "Every incoming order is captured automatically, regardless of format.",
        "Item numbers and quantities are extracted, checked against stock and passed straight into the ERP.",
        "Discrepancies or unclear details are flagged automatically and escalated to the responsible employee.",
      ],
      result:
        "Order processing runs virtually without manual entry — faster, nearly error-free. Two of the three employees moved into customer service.",
      metrics: [
        { value: "<30 sec.", label: "per order instead of 12 minutes" },
        { value: "<0.5 %", label: "error rate instead of 6 %" },
        { value: "2 of 3", label: "employees moved into customer service" },
      ],
      image: { src: "grosshandel-bestelleingabe-case", alt: "Wholesale DACH — Three full-time order-entry roles replaced by automation" },
    },
    {
      id: "maschinenbau-sendungstransparenz",
      industries: ["Machinery", "Export", "Logistics", "Customs"],
      phaseLabel: "Case 02",
      badge: BEISPIEL_BADGE,
      disclaimer: BEISPIEL_DISCLAIMER,
      title: "Machinery exporter — Shipment transparency across 23 countries automated",
      teaser:
        "How an exporter bundles shipment status, customs documents and compliance in one real-time dashboard.",
      scenario:
        "Example scenario: mid-sized machinery manufacturer · exports to 23 countries · communication with freight forwarders and customs agents.",
      situation:
        "Status checks ran over phone and email, often with several parties at once — delays were frequently noticed only once the container was already stuck at the destination port.",
      approach: [
        "A central real-time dashboard automatically brings together document status, shipment tracking and compliance checks.",
        "Sanctions lists and preferential trade agreements are automatically checked against the current shipment for every export.",
        "The check happens before the goods leave the warehouse.",
      ],
      result:
        "Since rollout: not a single shipment delayed by missing documents. Phone status checks have nearly disappeared, and automatically detected preferential agreements cut customs costs.",
      metrics: [
        { value: "0", label: "shipments delayed by missing documents" },
        { value: "~14 %", label: "customs costs saved via preferential agreements" },
        { value: "~0", label: "status checks by phone" },
      ],
      image: { src: "maschinenbau-sendungstransparenz-case", alt: "Machinery exporter — Shipment transparency across 23 countries automated" },
    },
    {
      id: "fachhaendler-fruehwarnsystem",
      industries: ["Specialty Retail", "Procurement", "Supply Chain"],
      phaseLabel: "Case 03",
      badge: BEISPIEL_BADGE,
      disclaimer: BEISPIEL_DISCLAIMER,
      title: "Specialist retailer — A supplier early-warning system instead of gut feeling",
      teaser:
        "How a specialist retailer with 80 suppliers spots quality problems three weeks earlier.",
      scenario:
        "Example scenario: specialist retailer with ~80 active suppliers · supplier assessment previously informal, based on experience.",
      situation:
        "Quality problems often only surfaced once several faulty deliveries had arrived. Negotiations ran on the experience of individual buyers — a structured data basis did not exist.",
      approach: [
        "An automated supplier score continuously combines incoming-goods inspection, on-time delivery and complaints.",
        "Conspicuous patterns automatically trigger an early warning to the responsible buyer.",
        "A data-based negotiation basis is ready for every supplier conversation.",
      ],
      result:
        "Purchasing spots quality decline three weeks earlier and negotiates on a data basis for the first time — the complaint rate of top suppliers drops measurably.",
      metrics: [
        { value: "3 weeks", label: "earlier warning of quality decline" },
        { value: "−19 %", label: "complaint rate for top-10 suppliers" },
        { value: "For the first time", label: "data-based negotiation basis" },
      ],
      image: { src: "fachhaendler-fruehwarnsystem-case", alt: "Specialist retailer — A supplier early-warning system instead of gut feeling" },
    },
  ],

  /* ── A4 · Professional Services ──────────────────────────── */
  "professional-services": [
    {
      id: "aeskon-prozesslandkarte",
      industries: ["Industrial Consulting", "Grant Funding", "Technology Firms"],
      phaseLabel: "Case 01",
      badge: "Real project · AESKON GmbH",
      disclaimer: REAL_DISCLAIMER,
      title: "Industrial consulting — Process map and BAFA roadmap documented automatically",
      teaser:
        "How a consulting and technology business set up its digitalization to be eligible for BAFA funding.",
      scenario:
        "Real project: AESKON GmbH · BAFA-funded digitalization · process documentation as the foundation.",
      situation:
        "The business wanted to drive its digitalization forward in a BAFA-eligible way — but its workflows existed only in the heads of individual employees. Without structured documentation: no funding application, no plannable implementation.",
      approach: [
        "Created complete process diagrams with automation potential clearly marked.",
        "Developed a detailed specification document as the technical basis.",
        "Facilitated an architecture workshop: automation steps for frontend, AI components and backend prioritized.",
      ],
      result:
        "The BAFA funding application went out on time and complete — with a process map documented for the first time and a prioritized implementation plan for the next automation steps.",
      metrics: [
        { value: "On time", label: "BAFA application fully prepared" },
        { value: "For the first time", label: "complete process map documented" },
        { value: "Prioritized", label: "implementation plan for the next steps" },
      ],
      image: { src: "aeskon-prozesslandkarte-case", alt: "Industrial consulting — Process map and BAFA roadmap documented automatically" },
    },
    {
      id: "steuerkanzlei-mandantenkommunikation",
      industries: ["Tax Firms", "Tax Season"],
      phaseLabel: "Case 02",
      badge: BEISPIEL_BADGE,
      disclaimer: BEISPIEL_DISCLAIMER,
      title: "Tax advisory firm — Client communication automated during peak season",
      teaser:
        "How a firm with 600 clients answers 40 % of standard inquiries automatically.",
      scenario:
        "Example scenario: tax firm with ~600 clients · recurring standard questions during tax season.",
      situation:
        "Questions about deadlines, required documents and processing status tied up so much capacity that complex mandates stalled and advisors piled up overtime.",
      approach: [
        "An AI-powered first-contact assistant automatically recognizes standard inquiries and answers them directly.",
        "The individual processing status is checked automatically against the firm's system.",
        "Only genuinely complex or individual cases are forwarded to the advisors.",
      ],
      result:
        "Advisors are back to working on mandates instead of the inbox — with significantly less overtime during peak season.",
      metrics: [
        { value: "−40 %", label: "standard inquiries in the advisor inbox" },
        { value: "3 min.", label: "response time instead of 6 hours" },
        { value: "Noticeably", label: "less overtime during peak season" },
      ],
      image: { src: "steuerkanzlei-mandantenkommunikation-case", alt: "Tax advisory firm — Client communication automated during peak season" },
    },
    {
      id: "personalberatung-screening",
      industries: ["Recruiting", "High-Volume Recruiting"],
      phaseLabel: "Case 03",
      badge: BEISPIEL_BADGE,
      disclaimer: BEISPIEL_DISCLAIMER,
      title: "Recruitment consultancy — Candidate screening for 200 applicants per role automated",
      teaser:
        "How a recruitment consultancy cut time-to-shortlist from 9 days to 3.",
      scenario:
        "Example scenario: recruitment consultancy · ~200 applications per advertised role · manual comparison against the client profile.",
      situation:
        "Recruiters compared every application manually against the client's requirements profile before the first conversations started — often a full working week per role.",
      approach: [
        "Incoming applications are automatically compared against the defined requirements profile.",
        "Relevant experience and qualifications are extracted.",
        "A structured, comparable summary is created for the recruiter for each candidate.",
      ],
      result:
        "The shortlist is ready after 3 days instead of 9. Recruiters spend their time in conversation instead of review — client satisfaction with shortlist quality rises noticeably.",
      metrics: [
        { value: "3 days", label: "time-to-shortlist instead of 9" },
        { value: "More time", label: "for conversations instead of review" },
        { value: "Noticeably", label: "higher satisfaction with shortlist quality" },
      ],
      image: { src: "personalberatung-screening-case", alt: "Recruitment consultancy — Candidate screening for 200 applicants per role automated" },
    },
  ],

  /* ── B1 · Auswahlverfahren & Awards ──────────────────────── */
  auswahlverfahren: [
    {
      id: "bmp-jury-pipeline",
      industries: ["Associations", "Awards", "Jury"],
      phaseLabel: "Case 01",
      badge: "Real project · Bayerischer Mittelstandspreis",
      disclaimer: REAL_DISCLAIMER,
      title: "BMP — Application evaluation for a Bavaria-wide award automated",
      teaser:
        "How one of Bavaria's best-known SME awards makes its jury work 60 % more efficient.",
      scenario:
        "Real project: Bayerischer Mittelstandspreis · applications across several channels · multiple jury categories.",
      situation:
        "Applications were prepared for the jury entirely by hand, and scoring sheets went back and forth between jurors by email. A central overview of the processing status was missing.",
      approach: [
        "Applications are captured and structured automatically.",
        "An AI-powered system builds an evaluation summary for each application.",
        "The jury works from a comparable score overview across all categories.",
      ],
      result:
        "The entire selection process is digitized: 60 % more efficient, audit-proof, every scoring decision traceable.",
      metrics: [
        { value: "60 %", label: "higher jury efficiency" },
        { value: "Gone", label: "manual preparation of scoring sheets" },
        { value: "100 %", label: "traceable audit trail" },
      ],
    },
    {
      id: "innovationspreis-bias",
      industries: ["Innovation Awards", "Juries", "Competitions"],
      phaseLabel: "Case 02",
      badge: BEISPIEL_BADGE,
      disclaimer: BEISPIEL_DISCLAIMER,
      title: "Innovation award — Scoring bias uncovered through automated analysis",
      teaser:
        "How a committee made systematic scoring patterns visible and cut the spread between jurors by 35 %.",
      scenario:
        "Example scenario: innovation award committee · recurring scoring patterns across several jury rounds.",
      situation:
        "Certain categories and submission types systematically scored better or worse — this was never recorded or questioned. A manual analysis across several years was not practical.",
      approach: [
        "Automated bias analysis continuously evaluates all scores.",
        "Deviation patterns between individual jurors are made visible.",
        "A guidance report is provided automatically before each jury session.",
      ],
      result:
        "The scoring spread between jurors drops by 35 % — the committee discusses on a data basis for the first time, and the shortlist emerges more objectively.",
      metrics: [
        { value: "−35 %", label: "scoring spread between jurors" },
        { value: "More objective", label: "and more transparent shortlisting" },
        { value: "For the first time", label: "data-based basis for committee discussion" },
      ],
    },
    {
      id: "gruenderwettbewerb-vorsortierung",
      industries: ["Startup Competitions", "Economic Development", "Jury"],
      phaseLabel: "Case 03",
      badge: BEISPIEL_BADGE,
      disclaimer: BEISPIEL_DISCLAIMER,
      title: "Startup competition — Pre-sorting of 600 applications automated",
      teaser:
        "How a small organizing team delivers the first shortlist after 3 days instead of 12.",
      scenario:
        "Example scenario: regional startup competition · ~600 applications per year · small organizing team.",
      situation:
        "More applications came in than the team could review manually. Time went into formal checking instead of content assessment.",
      approach: [
        "Submitted proposals are automatically checked against the entry criteria.",
        "Missing mandatory information is flagged immediately.",
        "A list prioritized by suitability is created for the first jury review.",
      ],
      result:
        "The first shortlist is ready after 3 days instead of 12. The organizing team assesses content instead of formalities — the jury starts with a clean, prioritized field of applicants.",
      metrics: [
        { value: "−65 %", label: "review time for the organizing team" },
        { value: "0", label: "formally invalid applications in the jury round" },
        { value: "3 days", label: "to the first shortlist instead of 12" },
      ],
    },
  ],

  /* ── B3 · Import / Export & Compliance ───────────────────── */
  compliance: [
    {
      id: "maschinenbau-dokumente",
      industries: ["Machinery", "Exporters", "Customs"],
      phaseLabel: "Case 01",
      badge: BEISPIEL_BADGE,
      disclaimer: BEISPIEL_DISCLAIMER,
      title: "Machinery exporter — Document chaos across 23 countries cleared automatically",
      teaser:
        "How trade documents in five languages are automatically recognized, assigned and checked.",
      scenario:
        "Example scenario: exporter with shipments to 23 countries · trade documents in five languages · communication via email, phone and Teams.",
      situation:
        "Every shipment was pieced together by hand: freight forwarder by email, customs agent by phone, internal approvals via Teams. Inconsistencies often only surfaced once the container was at the destination port.",
      approach: [
        "Incoming documents are recognized automatically, regardless of language and format.",
        "Documents are assigned to the right shipment and checked for completeness.",
        "Missing or contradictory details are escalated immediately, before the goods leave the warehouse.",
      ],
      result:
        "The document situation is complete and transparent per shipment at all times — no more delays from missing paperwork.",
      metrics: [
        { value: "<60 sec.", label: "document assignment instead of 45 minutes" },
        { value: "0", label: "shipments delayed by missing documents" },
        { value: "100 %", label: "automated status overview for all parties" },
      ],
      image: { src: "maschinenbau-dokumente-case", alt: "Machinery exporter — Document chaos across 23 countries cleared automatically" },
    },
    {
      id: "aeskon-bafa-compliance",
      industries: ["Industrial Consulting", "Grants", "Compliance"],
      phaseLabel: "Case 02",
      badge: "Real project · AESKON GmbH (BAFA compliance)",
      disclaimer: REAL_DISCLAIMER,
      title: "Industrial consulting — Funding eligibility secured through automated process control",
      teaser:
        "How a consulting firm secures the BAFA-compliant order of every application step.",
      scenario:
        "Real project: AESKON GmbH · BAFA funding procedure · strict requirements on the order of application and contract.",
      situation:
        "Funding application and consulting contract had to follow exactly the order prescribed by BAFA. A contract signed too early would have jeopardized the entire funding eligibility — in the worst case with legal consequences.",
      approach: [
        "A structured, documented workflow logs every step of the application in a traceable way.",
        "An automatic check blocks every action before the required official approval.",
        "The next phase is only unlocked after approval.",
      ],
      result:
        "The funding application went out on time, complete and compliant — without a single procedural error.",
      metrics: [
        { value: "0", label: "procedural errors in the entire application phase" },
        { value: "On time", label: "and submitted in compliance" },
        { value: "Complete", label: "documentation for any audits" },
      ],
      image: { src: "aeskon-bafa-compliance-case", alt: "Industrial consulting — Funding eligibility secured through automated process control" },
    },
    {
      id: "grosshaendler-zollpraeferenzen",
      industries: ["Wholesale", "Customs", "Foreign Trade"],
      phaseLabel: "Case 03",
      badge: BEISPIEL_BADGE,
      disclaimer: BEISPIEL_DISCLAIMER,
      title: "Wholesaler — Customs preferences used systematically and automatically for the first time",
      teaser:
        "How a wholesaler saves around 14 % in customs costs through automatically detected free-trade agreements.",
      scenario:
        "Example scenario: wholesaler with high import volume · preferential origins previously checked only on a sample basis.",
      situation:
        "On many imports, more customs duty was paid than necessary because preferential origins were not consistently documented and used. At that shipment volume, a manual check was not feasible.",
      approach: [
        "For each shipment, it is automatically detected which free-trade agreements apply.",
        "The matching preference proofs are generated automatically.",
        "All proofs are filed in an audit-proof way.",
      ],
      result:
        "Around 14 % lower customs costs: no preference case is overlooked anymore, and the documentation withstands any tax audit.",
      metrics: [
        { value: "~14 %", label: "customs-cost savings via free-trade agreements" },
        { value: "100 %", label: "audit-proof documentation" },
        { value: "0", label: "overlooked preference cases since rollout" },
      ],
      image: { src: "grosshaendler-zollpraeferenzen-case", alt: "Wholesaler — Customs preferences used systematically and automatically for the first time" },
    },
  ],

  /* ── B4 · KPI-Transparenz & Reporting ────────────────────── */
  "kpi-dashboard": [
    {
      id: "mehrstandort-dashboard",
      industries: ["Specialist Clinics", "Multi-Site Practices"],
      phaseLabel: "Case 01",
      badge: BEISPIEL_BADGE,
      disclaimer: BEISPIEL_DISCLAIMER,
      title: "Multi-location practice — Automated real-time dashboard for all locations",
      teaser:
        "How a practice network automatically spots bottlenecks a week in advance.",
      scenario:
        "Example scenario: network of several specialist practices · location data previously merged manually only once a week.",
      situation:
        "No central view of utilization, waiting times and no-show rates. Bottlenecks only surfaced once patients had to be turned away — even though neighboring locations had free capacity.",
      approach: [
        "An automated real-time dashboard continuously merges all location data.",
        "Utilization patterns are detected automatically.",
        "When bottlenecks loom, matching alternative appointments at nearby locations are suggested automatically.",
      ],
      result:
        "Real-time control instead of a weekly review: fewer no-shows, better utilization, early bottleneck warnings.",
      metrics: [
        { value: "−22 %", label: "no-show rate" },
        { value: "+15 %", label: "appointment utilization across locations" },
        { value: "1 week", label: "lead time in detecting bottlenecks" },
      ],
      image: { src: "mehrstandort-dashboard-case", alt: "Multi-location practice — Automated real-time dashboard for all locations" },
    },
    {
      id: "vertrieb-pipeline-reporting",
      industries: ["Sales Teams", "CRM Pipelines", "B2B Sales"],
      phaseLabel: "Case 02",
      badge: BEISPIEL_BADGE,
      disclaimer: BEISPIEL_DISCLAIMER,
      title: "Sales team — Pipeline reporting automated without manual Excel upkeep",
      teaser:
        "How a sales team saves 5 hours of reporting per week and decides on up-to-date numbers.",
      scenario:
        "Example scenario: sales team · pipeline data previously kept manually in Excel · weekly management reporting.",
      situation:
        "By the time the report was finished, the numbers were already out of date — decisions were regularly based on data a week old.",
      approach: [
        "CRM data connected directly to automated real-time reporting.",
        "Pipeline status, forecast and conversion rates are updated continuously.",
        "The management dashboard is created automatically — with no manual Excel upkeep.",
      ],
      result:
        "Management decides on up-to-date instead of week-old numbers — the team saves 5 hours of reporting per week.",
      metrics: [
        { value: "−5 hrs.", label: "reporting effort per week" },
        { value: "Up to date", label: "numbers instead of week-old reports" },
        { value: "Noticeably", label: "higher forecast accuracy" },
      ],
      image: { src: "vertrieb-pipeline-reporting-case", alt: "Sales team — Pipeline reporting automated without manual Excel upkeep" },
    },
    {
      id: "logistik-lieferanten-kpi",
      industries: ["Logistics", "Procurement", "Supplier Management"],
      phaseLabel: "Case 03",
      badge: BEISPIEL_BADGE,
      disclaimer: BEISPIEL_DISCLAIMER,
      title: "Logistics provider — Supplier KPIs automated instead of buried in the quarterly report",
      teaser:
        "How a logistics provider spots delivery problems three weeks earlier than in the quarterly review.",
      scenario:
        "Example scenario: logistics provider · supplier assessment previously in the quarterly review.",
      situation:
        "Quality problems with suppliers only surfaced in the quarterly review — by then several defective deliveries had already gone through. Short-term corrective action was barely possible.",
      approach: [
        "Automated KPI scoring continuously evaluates on-time delivery, quality data and complaints.",
        "Conspicuous patterns automatically trigger an early warning to the responsible buyer.",
        "No more waiting for the next reporting cycle.",
      ],
      result:
        "Purchasing steers continuously instead of quarterly — with significantly fewer escalations in day-to-day business.",
      metrics: [
        { value: "3 weeks", label: "earlier warning of delivery problems" },
        { value: "For the first time", label: "data-based negotiation basis" },
        { value: "Significantly", label: "fewer escalations in day-to-day business" },
      ],
      image: { src: "logistik-lieferanten-kpi-case", alt: "Logistics provider — Supplier KPIs automated instead of buried in the quarterly report" },
    },
  ],

  /* ── B5 · Kundensupport mit KI ───────────────────────────── */
  "ki-kundensupport": [
    {
      id: "eos-therapiezentrum",
      industries: ["Therapy Centers", "Physiotherapy", "Healthcare"],
      phaseLabel: "Case 01",
      badge: "Real project · EOS Therapiezentrum",
      disclaimer: REAL_DISCLAIMER,
      title: "Therapy center — First inquiries answered automatically around the clock",
      teaser:
        "How the EOS Therapiezentrum cut response time from 18 hours to under 5 minutes.",
      scenario:
        "Real project: EOS Therapiezentrum · first inquiries previously only by phone during opening hours.",
      situation:
        "Many prospective patients called outside opening hours, reached no one and dropped off — without the center ever finding out.",
      approach: [
        "Automated WhatsApp onboarding takes first inquiries around the clock.",
        "Inquiries are automatically assigned to the right treatment area.",
        "Available capacity is checked and concrete appointment suggestions are made directly — with no manual intervention from the team.",
      ],
      result:
        "Response time under 5 minutes instead of 18 hours. Reachability is independent of opening hours for the first time — with significantly more first consultations closed.",
      metrics: [
        { value: "<5 min.", label: "response time instead of 18 hours" },
        { value: "24/7", label: "reachability independent of opening hours" },
        { value: "Significantly", label: "more first consultations closed" },
      ],
      image: { src: "eos-therapiezentrum-case", alt: "Therapy center — First inquiries answered automatically around the clock" },
    },
    {
      id: "onlinehaendler-support",
      industries: ["Online Retail", "Customer Service", "Returns"],
      phaseLabel: "Case 02",
      badge: BEISPIEL_BADGE,
      disclaimer: BEISPIEL_DISCLAIMER,
      title: "Online retailer — 55 % of all support inquiries resolved fully automatically",
      teaser:
        "How an online retailer cut response time from 6 hours to 2 minutes.",
      scenario:
        "Example scenario: online retailer · several hundred support inquiries daily about shipping status, returns and product questions.",
      situation:
        "The support team could barely keep up even with extra temporary staff — response times of several hours translated directly into worse reviews.",
      approach: [
        "An AI-powered support assistant automatically classifies incoming inquiries.",
        "Shipping status and order data are pulled directly from the system.",
        "Standard cases are resolved autonomously — only individual or complex matters go to staff.",
      ],
      result:
        "55 % of all inquiries resolve without human involvement — the team focuses on complex individual cases instead of routine questions.",
      metrics: [
        { value: "55 %", label: "of all inquiries resolved fully automatically" },
        { value: "2 min.", label: "response time instead of 6 hours" },
        { value: "Focus", label: "on complex individual cases instead of routine" },
      ],
      image: { src: "onlinehaendler-support-case", alt: "Online retailer — 55 % of all support inquiries resolved fully automatically" },
    },
    {
      id: "steuerkanzlei-fristen",
      industries: ["Tax Firms", "Tax Season"],
      phaseLabel: "Case 03",
      badge: BEISPIEL_BADGE,
      disclaimer: BEISPIEL_DISCLAIMER,
      title: "Tax advisory firm — Deadline questions answered automatically during peak season",
      teaser:
        "How a firm keeps 40 % of standard inquiries out of the advisor inbox.",
      scenario:
        "Example scenario: tax firm · recurring questions about deadlines, documents and processing status during tax season.",
      situation:
        "Standard inquiries tied up so much of the advisors' capacity that complex mandates stalled and processing times rose overall.",
      approach: [
        "An automated assistant answers standard questions directly.",
        "The individual processing status is checked automatically against the firm's system.",
        "Only individual or technically complex cases go to the advisors.",
      ],
      result:
        "Advisors work on mandates instead of inboxes — with noticeably less overtime during peak season.",
      metrics: [
        { value: "−40 %", label: "standard inquiries in the advisor inbox" },
        { value: "3 min.", label: "response time instead of 6 hours" },
        { value: "Noticeably", label: "less overtime during peak season" },
      ],
      image: { src: "steuerkanzlei-fristen-case", alt: "Tax advisory firm — Deadline questions answered automatically during peak season" },
    },
  ],
};

/**
 * B2 · Kundengewinnung & Funnel — noch OHNE eigene Anwendungsfeld-Seite.
 * Werden nur ins CMS geseedet (ohne pain-point-Relation) und erscheinen
 * erst auf der Website, wenn eine passende Seite existiert.
 */
export const unassignedMiniCases: MiniCase[] = [
  {
    id: "340-consultancy-funnel",
      industries: ["Consultancies", "B2B Sales"],
    phaseLabel: "Case 01",
    badge: "Real project · 340 Consultancy",
    disclaimer: REAL_DISCLAIMER,
    title: "340 Consultancy — Website funnel rebuilt with automated lead handover",
    teaser:
      "How a consulting agency went from an info-only site to a clear funnel from first contact to qualified inquiry.",
    scenario:
      "Real project: 340 Consultancy · website relaunch with structured lead guidance.",
    situation:
      "The website had no clear customer journey: visitors found relevant information but no path to the contact form. Incoming inquiries had to be sorted manually by topic and urgency.",
    approach: [
      "Ran a structured workshop process to realign the site.",
      "Rebuilt the sitemap and page structure with clear lead guidance.",
      "Set up automated initial sorting: every inquiry goes straight to the right contact person.",
    ],
    result:
      "From first contact to qualified inquiry, a clear, automated funnel now leads the way — with a significantly shorter response time.",
    metrics: [
      { value: "End-to-end", label: "automated funnel through to qualified inquiry" },
      { value: "59", label: "prioritized feedback points for the developer handover" },
      { value: "Significantly", label: "shorter response time to new inquiries" },
    ],
    image: { src: "340-consultancy-funnel-case", alt: "340 Consultancy — Website funnel rebuilt with automated lead handover" },
  },
  {
    id: "b2b-lead-qualifizierung",
      industries: ["B2B Services", "Sales", "Inbound Inquiries"],
    phaseLabel: "Case 02",
    badge: BEISPIEL_BADGE,
    disclaimer: BEISPIEL_DISCLAIMER,
    title: "B2B service provider — Lead qualification automated before sales",
    teaser:
      "How a B2B service provider raised its qualified-lead rate from 18 % to 47 %.",
    scenario:
      "Example scenario: B2B service provider · steady inquiries via the contact form · first conversations often with unsuitable leads.",
    situation:
      "The sales team spent most of its time on first conversations that turned out to be unsuitable — wrong budget, wrong timeframe, no real need.",
    approach: [
      "Automated pre-qualification built directly into the inquiry process.",
      "Inquiries are automatically assessed by budget, timeframe and need before they land in the sales inbox.",
      "Qualified leads automatically receive appointment suggestions.",
    ],
    result:
      "Sales now speaks almost exclusively with suitable prospects — and needs a third less time per closed deal.",
    metrics: [
      { value: "47 %", label: "qualified-lead rate instead of 18 %" },
      { value: "−33 %", label: "sales time per closed deal" },
      { value: "More time", label: "for genuinely promising conversations" },
    ],
    image: { src: "b2b-lead-qualifizierung-case", alt: "B2B service provider — Lead qualification automated before sales" },
  },
  {
    id: "handwerk-funnel",
      industries: ["Trades", "Local Business", "B2C"],
    phaseLabel: "Case 03",
    badge: BEISPIEL_BADGE,
    disclaimer: BEISPIEL_DISCLAIMER,
    title: "Regional trades business — Inquiries doubled through an automated funnel",
    teaser:
      "How a trades business doubled its website inquiries within three months.",
    scenario:
      "Example scenario: regional trades business · steady website traffic, but hardly any inquiries.",
    situation:
      "The site explained the offering in detail but did not lead to action: requesting a quote meant several clicks and a long form.",
    approach: [
      "Rebuilt the entire funnel: clearly structured service pages with consistent calls to action.",
      "An automated short form replaces the long inquiry form.",
      "Inquiries are immediately sorted by trade and urgency and automatically routed to the right employee.",
    ],
    result:
      "Twice as many inquiries at the same traffic — and the office saves the manual sorting work every day.",
    metrics: [
      { value: "2×", label: "inquiries via the website in three months" },
      { value: "−28 %", label: "bounce rate on the homepage" },
      { value: "Daily", label: "manual sorting work saved in the office" },
    ],
    image: { src: "handwerk-funnel-case", alt: "Regional trades business — Inquiries doubled through an automated funnel" },
  },
];
