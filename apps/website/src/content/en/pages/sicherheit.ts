/**
 * Page: Security, Data Protection & Operations  — Single Type
 * --------------------------------------------------------------
 * EN-Spiegel von `content/pages/sicherheit.ts` — strukturgleich,
 * nur die Literale unterscheiden sich (Anforderung von `useLocalized`).
 * Die `id`-Werte der Abschnitte bleiben identisch zur deutschen
 * Fassung: Sie sind Anker, keine Übersetzungstexte.
 *
 * BELEGLAGE — wie in der DE-Fassung bewusst eng. Nicht enthalten und
 * nicht zu ergänzen: Zertifizierungen (ISO 27001, TISAX, BSI), Verfüg-
 * barkeits- oder Reaktionszeiten, Aussagen zu aufsichtsrechtlichen
 * Regimen, Kennzahlen jeder Art.
 * Strapi-Mapping: Single Type `sicherheit-en`.
 * --------------------------------------------------------------
 */
import type { SEOContent } from "@/content/types";

/** Siehe DE-Fassung — identische Struktur. */
export interface SecuritySection {
  id: string;
  navLabel: string;
  heading: string;
  body: string[];
  items?: string[];
  after?: string;
}

export const sicherheit = {
  seo: {
    title: "Security, Data Protection & Operations | NEWEDGE",
    description:
      "Where the models run, where your data sits, who can access what and what gets logged — the answers to the questions that come up before every project.",
    canonical: "/en/sicherheit",
  } satisfies SEOContent,

  hero: {
    eyebrow: "Security & data protection",
    headline: "Where your data sits. And who can see it.",
    subline:
      "This is the first question in every initial conversation — and the one that holds projects up longest. Here is the answer in one place: what applies, what you decide, and what we deliberately do not claim.",
  },

  summary: {
    label: "In brief",
    items: [
      "The models run wherever you decide — on your own hardware, in a German cloud, or in your existing environment.",
      "In a local setup, no record leaves your organisation.",
      "Access follows the roles and permissions of your organisation, not the tool.",
      "Decisions stay with people. Every processing step is logged.",
      "We claim no certifications — what we commit to belongs in a contract, not on this page.",
    ],
  },

  tocLabel: "On this page",

  sections: [
    {
      id: "modelle",
      navLabel: "Models",
      heading: "Where the models run",
      body: [
        "You decide where the computing happens. We build the full infrastructure that lets capable AI models run inside your organisation — from the hardware through the models to permission management.",
        "If your own hardware is not an option, operation in a German cloud or within your existing infrastructure is possible. In both cases the environment stays yours — not that of an external provider whose terms of use can change.",
        "Which model works underneath remains interchangeable. Cortex is the layer above it: switching models changes nothing about your permissions, logs and workflows.",
      ],
    },
    {
      id: "daten",
      navLabel: "Data",
      heading: "Where the data sits",
      body: [
        "In a local setup, no record leaves the company. Your documents, cases and analyses stay in your environment — no processing agreement with US services comes into being simply because your staff work with AI.",
        "That is the difference from the situation we find in most organisations: company data in public assistants, isolated tools without oversight, shadow IT that grew over time, and unresolved GDPR questions. One entry point for everyone replaces the sprawl — and makes it possible to review what happens with which data in the first place.",
      ],
    },
    {
      id: "zugriff",
      navLabel: "Access",
      heading: "Who can access what",
      body: [
        "Cortex brings your organisational knowledge, your systems and your permissions together in one place. Access therefore follows the role someone holds — not who opened a tool first.",
        "You keep control over usage, data, processes and automations: clear permissions, traceable usage, no black box. What your people are not allowed to see in the specialist system, they do not get through the AI layer either.",
      ],
    },
    {
      id: "menschliche-pruefung",
      navLabel: "Human review",
      heading: "The decision stays with you",
      body: [
        "The system does not decide in your place. It takes cases in, classifies them, extracts the relevant details, checks them against your checklists and rules, and prepares the decision. The decision itself is made by the person responsible for it.",
        "What is clear and complete moves through. What is missing, contradictory, expired or at odds with your requirements is not waved through quietly but put in front of someone — with a note on what the assessment rests on and where it sits in the case.",
        "The same boundary applies to steering: we make sure the figures are complete, current and traceable down to the individual case. What follows from them is decided by your leadership.",
      ],
    },
    {
      id: "protokollierung",
      navLabel: "Logging",
      heading: "Logging and traceability",
      body: [
        "Every processing step is logged: who assessed, reviewed or decided what, when, and on what basis. The documentation is created while the work happens, not shortly before an audit.",
        "That pays off the moment someone asks — a rejected applicant appeals, a supervisory body requests records, an internal audit reviews a case, a piece of evidence falls due. You then do not have to reconstruct the history from inboxes and folders.",
      ],
      items: [
        "A complete history per case — who, when, on what basis",
        "Figures traceable down to the individual case, instead of a number without an origin",
        "Evidence and retention obligations stay fulfillable without anyone assembling the history after the fact",
      ],
    },
    {
      id: "loeschung",
      navLabel: "Access & erasure",
      heading: "Information, rectification, erasure",
      body: [
        "In your own environment you set retention and deletion yourself — it is your data in your systems. We set the workflows up so that a case and its log can be found and handled deliberately.",
        "For the data that arises on our side — from the contact form or the ROI calculator, for instance — your rights under the GDPR apply:",
      ],
      items: [
        "Information about the data stored about you",
        "Rectification of inaccurate data",
        "Erasure of your data (right to be forgotten)",
        "Restriction of processing",
        "Objection to processing",
        "Data portability",
      ],
      after:
        "A message to info@newedgebrand.com is enough. Nothing is deleted automatically on our side — requested reports and enquiries stay on file until you ask for erasure or we no longer need them. We would rather state that plainly than claim a retention period nobody monitors.",
    },
    {
      id: "auftragsverarbeitung",
      navLabel: "Processing",
      heading: "Data processing and the services we use",
      body: [
        "Which role NEWEDGE takes — controller or processor — depends on the operating model and is settled in writing before the project starts, together with the systems we actually need access to. If everything runs inside your organisation, the circle of parties involved is correspondingly small.",
        "For this website itself, we name the services we use openly:",
      ],
      items: [
        "Cookiebot (Usercentrics A/S, Copenhagen) — consent management and record of consent",
        "Google Tag Manager and Google Analytics (Google Ireland Limited, Dublin) — reach measurement, IP address truncated within the EU or EEA",
        "Meta Pixel — campaign analysis; the data is anonymous to us",
      ],
      after:
        "Statistics and marketing scripts only become active once you have agreed; until then Google Consent Mode stays on “denied”. You can change or withdraw your choice at any time via “Cookie settings” at the foot of the page. The full privacy policy is part of our legal notice.",
    },
    {
      id: "website",
      navLabel: "Website & forms",
      heading: "What this website collects",
      body: [
        "When you visit this site, our hosting provider automatically records the IP address, date and time, browser type and version, operating system and referrer URL. This data serves technical security, error analysis and optimisation of the website; it is not merged with other data sources.",
        "The contact form and the ROI calculator only accept what is needed to handle your request — for contact enquiries, additionally only with your explicit consent. Enquiries are held on our server; in the CMS they are stored without public read permissions and are therefore only visible in the protected admin area.",
      ],
      items: [
        "Technical safeguards on the forms: origin checks, a limit on requests per address, validation of the email address, and an invisible trap against automated submissions",
        "Follow-up emails always carry a way out: a link with a one-time identifier — so that no email address ever appears in a URL —, the unsubscribe button of your mail client, and a reply saying “unsubscribe” works just as well",
        "Opening the unsubscribe link first shows only a confirmation page; you are removed after you confirm, so that automated mail scanners cannot unsubscribe anyone by accident",
        "Unsubscribed addresses are checked before every further follow-up; requested emails such as the ROI report are unaffected",
      ],
    },
    {
      id: "betrieb",
      navLabel: "Operations & backups",
      heading: "Operations, backups and recovery",
      body: [
        "Website, CMS and form service run in one shared, self-contained setup, delivered exclusively over encrypted connections. The form service deliberately depends on no other building block: if the CMS goes down, the forms keep accepting enquiries — and the other way round.",
        "Backups run once a day, automatically: database, media files and the form data, with several generations kept side by side. The way back is documented step by step and always begins by putting the current state aside — even a broken one. A recovery attempt that goes wrong would otherwise be final.",
        "Changes to the running system take the same route: a dry run first, then the switch, then an acceptance check that verifies everything responds as expected again.",
      ],
    },
  ] satisfies SecuritySection[],

  grenzen: {
    heading: "What we do not claim",
    intro:
      "The more honest part of a security page is the part that says what is missing. Three things you will not find here:",
    items: [
      "No certifications. We claim none — neither as a seal nor by implication. If your procurement requires a particular certification, say so early and we will work out what that means for the project.",
      "No availability or response times. What applies to your project belongs in an agreement with you, not on a web page where it would stay non-binding.",
      "No assessment of your regulatory obligations. What your organisation has to meet is for your legal department and your data protection officer to judge. Our job is to supply the technical evidence they need for it — traceable, verifiable, complete.",
    ],
  },

  cta: {
    heading: "Send us your review checklist.",
    body: "Data protection officers, IT security and procurement each work from their own questionnaires. We answer yours along the operating model that fits you — before the first project step, not after it.",
    button: "Book a call",
    to: "/kontakt",
  },

  legal: {
    label: "Full privacy policy",
    to: "/impressum#datenschutz",
  },
} as const;
