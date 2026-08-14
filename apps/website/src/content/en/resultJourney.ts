import type { ResultJourneyContent } from "@/content/resultJourney";
import {
  Icon24Hours,
  IconAdjustments,
  IconAlertTriangle,
  IconBellRinging,
  IconBook2,
  IconBuildingCommunity,
  IconCalendarCheck,
  IconCertificate,
  IconCircleCheck,
  IconClockCheck,
  IconCoin,
  IconCoins,
  IconDatabase,
  IconFileAlert,
  IconFileCheck,
  IconFileImport,
  IconFlag,
  IconGauge,
  IconHistory,
  IconInbox,
  IconLanguage,
  IconLayoutDashboard,
  IconMailOff,
  IconMessageCheck,
  IconMoodSmile,
  IconRadar,
  IconRepeatOff,
  IconScale,
  IconShieldCheck,
  IconStack2,
  IconStopwatch,
  IconTool,
  IconTrendingDown,
  IconUserCheck,
  IconUsersGroup,
} from "@tabler/icons-react";

/* ──────────────────────────────────────────────────────────────
   RESULT MODULE — EN mirror of src/content/resultJourney.ts
   --------------------------------------------------------------
   Same structure, same slug keys, same `plannedImage` values.
   `plannedImage` is a registry key for assets.ts, NOT copy — it is
   carried over unchanged so both locales resolve the same artwork.
   Translated: `title`, `imageAlt`, `imageNote`, every step `text`.

   Every station is an outcome from the customer's own working day
   (their applications, cases, submissions) — never a step of the
   NEWEDGE onboarding and never a feature description.

   Slug coverage: all eight routable slugs — the four blueprints and
   the four industries. `versicherungen`, `bildung` and `immobilien`
   were added in both locales in 2026-08; before that the module did
   not render at all on those three pages.
   The German file additionally carries `health-care`,
   `handel-supply-chain` and `professional-services`; those three were
   retired in 2026-08, are no longer registered in the slug map (they
   now 404) and carry unsourced figures — they are deliberately not
   mirrored here.
────────────────────────────────────────────────────────────── */

export const resultJourneys: Record<string, ResultJourneyContent> = {
  /* ── Blueprint — Decisions & Case Review ── */
  "entscheidungen-fallpruefung": {
    showcase: {
      plannedImage: "pain-point-auswahlverfahren-result",
      imageAlt:
        "An orderly selection process: every application structured and comparable instead of inbox chaos",
      imageNote:
        "Split visual: on the left an overflowing inbox and a stack of PDFs (chaos, many formats), on the right the same content as a clear process chain with station points on a single line — no people, pure system view.",
    },
    title: "What your day-to-day looks like with NEWEDGE",
    steps: [
      { icon: IconInbox, text: "No application slips through — however many come in, every one is seen." },
      { icon: IconScale, text: "Your panel compares substance, not formatting." },
      { icon: IconUsersGroup, text: "Your committee assesses instead of coordinating — the scheduling juggle falls away." },
      { icon: IconAlertTriangle, text: "Disagreement between reviewers surfaces before it turns into a dispute." },
      { icon: IconFileCheck, text: "If an applicant appeals, your reasoning is already on record." },
      { icon: IconTrendingDown, text: "A process that had to be administered becomes one that runs — your team only steers it." },
    ],
  },

  /* ── Blueprint — Documents & Processes ── */
  "dokumente-prozesse": {
    showcase: {
      plannedImage: "pain-point-compliance-result",
      imageAlt:
        "Paperwork under control: one calm overview of every case instead of document stacks in the inbox",
      imageNote:
        "Split visual: on the left the starting chaos (document stacks in mixed formats, an overflowing inbox, a phone handset), on the right a single calm overview of reviewed cases.",
    },
    title: "What your day-to-day looks like with NEWEDGE",
    steps: [
      { icon: IconLanguage, text: "Documents arrive in every format and over every channel — they get sorted all the same." },
      { icon: IconFileAlert, text: "A missing attachment surfaces before the case goes into processing." },
      { icon: IconShieldCheck, text: "Your requirements change? You won't notice — every case is checked against the current version." },
      { icon: IconCoins, text: "Rework never starts in the first place: gaps show up on intake, not after the decision." },
      { icon: IconLayoutDashboard, text: "Case handling, the specialist department and management look at the same status for the first time." },
    ],
  },

  /* ── Blueprint — Steering & Reporting ── */
  "steuerung-reporting": {
    showcase: {
      plannedImage: "pain-point-kpi-dashboard-result",
      imageAlt:
        "One glance instead of hunting for numbers: the current status of every case in a single view",
      imageNote:
        "Before and after in one image: on the left spreadsheets and stacks of reports date-stamped “last week”, on the right a single view showing the current processing status.",
    },
    title: "What your day-to-day looks like with NEWEDGE",
    steps: [
      { icon: IconGauge, text: "One glance is enough to know where your cases stand." },
      { icon: IconDatabase, text: "Management, the department and controlling stop arguing over whose number is right — there is only one." },
      { icon: IconBellRinging, text: "A critical deviation comes to you instead of you going looking for it." },
      { icon: IconStopwatch, text: "The report is no longer put together by hand — it is ready when you need it." },
      { icon: IconRadar, text: "A backlog or a deadline about to slip surfaces while something can still be done about it." },
    ],
  },

  /* ── Blueprint — Service & Case Handling ── */
  "service-fallbearbeitung": {
    showcase: {
      plannedImage: "pain-point-ki-kundensupport-result",
      imageAlt:
        "Service that runs by itself: routine inquiries answered right away, your team free for the tricky cases",
      imageNote:
        "Split-screen illustration: on the left an overflowing inquiry inbox with a growing queue, on the right a calm funnel — routine inquiries pass straight through, only individual cases are handed on to a person.",
    },
    title: "What your day-to-day looks like with NEWEDGE",
    steps: [
      { icon: IconCoin, text: "Routine inquiries no longer tie up the working time they cost you today." },
      { icon: Icon24Hours, text: "Whoever gets in touch gets an answer around the clock — not once your team is back at their desks." },
      { icon: IconUserCheck, text: "On tricky cases nobody has to repeat themselves — your colleague has the whole history straight away." },
      { icon: IconRepeatOff, text: "Requests that keep coming back become visible — and can be dealt with at the cause." },
      { icon: IconMoodSmile, text: "Your customers notice the difference first in the waiting time — your team in the cases that finally get the time they need." },
    ],
  },

  /* ── Industry — Grants & Decision-Making Bodies ── */
  "foerderungen-entscheidungsinstanzen": {
    showcase: {
      plannedImage: "pain-point-entscheidungsinstanzen-result",
      imageAlt:
        "Committee work without the administrative ballast: structured assessment instead of email chaos",
      imageNote:
        "Editorial image: a calm, real scene at the scoring cockpit or from a committee session — people working with the scoring interface in concentration (criteria matrix visible in the background), no stock illustration.",
    },
    title: "What your day-to-day looks like with NEWEDGE",
    steps: [
      { icon: IconStack2, text: "A large stack of submissions feels like a handful — each one in the same format right away." },
      { icon: IconAdjustments, text: "Your own assessment criteria stay exactly the same, just without the extra effort." },
      { icon: IconMailOff, text: "Your committee assesses instead of chasing emails." },
      { icon: IconScale, text: "A reviewer scoring too harshly or too generously stands out before it becomes a problem." },
      { icon: IconCertificate, text: "If the court of audit comes asking, the reasoning is already documented — compliant with VgV/UVgO." },
      { icon: IconCircleCheck, text: "Weeks of coordination turn into a result nobody contests — without the administrative ballast of before." },
    ],
  },

  /* ── Industry — Insurance ── */
  versicherungen: {
    showcase: {
      plannedImage: "pain-point-versicherungen-result",
      imageAlt:
        "Claims handling without the hunt: one prepared case file instead of scattered notifications and evidence",
      imageNote:
        "Split visual: on the left a claim notification with scattered attachments and a long email thread, on the right the same matter as a tidy case file with completeness status, a coverage note and flagged irregularities — system view, no people.",
    },
    title: "What your day-to-day looks like with NEWEDGE",
    steps: [
      { icon: IconFileImport, text: "A claim reaches you by email, web form or phone note — it is taken in the same way regardless." },
      { icon: IconFileCheck, text: "The missing piece of evidence has already been requested before your case handler first opens the file." },
      { icon: IconBook2, text: "The coverage question is pre-checked — with the passage in your policy wording, not from memory." },
      { icon: IconAlertTriangle, text: "A prior claim or an inconsistency in the details surfaces instead of slipping through." },
      { icon: IconMessageCheck, text: "Brokers and customers no longer have to ask where things stand — they can see it." },
      { icon: IconGauge, text: "Cases that first had to be pieced together become cases your organisation only has to decide." },
    ],
  },

  /* ── Industry — Education ── */
  bildung: {
    showcase: {
      plannedImage: "pain-point-bildung-result",
      imageAlt:
        "Admissions without stack work: checked, comparable applications instead of PDF folders in the inbox",
      imageNote:
        "Split visual: on the left a stack of PDF applications, transcript scans and email attachments, on the right an orderly application overview with a completeness status per document and flagged special cases — pure system view.",
    },
    title: "What your day-to-day looks like with NEWEDGE",
    steps: [
      { icon: IconStack2, text: "A stack of applications reaches your committee as if it were one — each in the same format." },
      { icon: IconFileCheck, text: "A missing transcript surfaces before the review, not halfway through it." },
      { icon: IconScale, text: "Every application is measured against the same criteria — no matter who picks it up." },
      { icon: IconFlag, text: "Special cases reach your committee flagged instead of passing through unnoticed." },
      { icon: IconMessageCheck, text: "Questions about deadlines, documents and case status never reach your student services — they are already answered." },
      { icon: IconHistory, text: "If an admission is questioned later, every review step can be shown — without digging through the inbox." },
    ],
  },

  /* ── Industry — Real Estate ── */
  immobilien: {
    showcase: {
      plannedImage: "pain-point-immobilien-result",
      imageAlt:
        "Property management without sorting work: structured property files instead of unsorted lease and receipt stacks",
      imageNote:
        "Split visual: on the left an unsorted stack of leases, receipts, photos and printed emails, on the right a structured property file per unit with a deadline track and flagged irregularities.",
    },
    title: "What your day-to-day looks like with NEWEDGE",
    steps: [
      { icon: IconBuildingCommunity, text: "Every document sits with the right property and the right unit — nobody re-sorts anything." },
      { icon: IconFileAlert, text: "A missing document or a discrepancy against your records is flagged before you open the case." },
      { icon: IconCalendarCheck, text: "Deadlines run along with the case instead of hanging in a calendar and in individual colleagues' heads." },
      { icon: IconTool, text: "The trade contractor gets the job with everything they need — the round of follow-up questions falls away." },
      { icon: IconClockCheck, text: "A tenant's request is taken in and filed even when nobody is at the office." },
      { icon: IconLayoutDashboard, text: "Lists pieced together from several sources become a portfolio status you simply look at." },
    ],
  },
};
