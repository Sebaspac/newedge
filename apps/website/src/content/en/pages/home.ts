/**
 * Page: Home (Index)  — Single Type
 * --------------------------------------------------------------
 * Inhalte der Startseite, die direkt in `pages/Index.tsx` liegen.
 * Die großen Abschnitte (Hero, Cortex, …) sind eigene Section-
 * Komponenten mit eigenen Content-Modulen.
 * Strapi-Mapping: Single Type `home`.
 * --------------------------------------------------------------
 */
import type { SEOContent } from "@/content/types";

interface ContactField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
}

export const home = {
  seo: {
    title: "AI Department for Mid-Sized Companies | NEWEDGE Munich",
    description:
      "NEWEDGE is the AI department for mid-sized companies: from a free analysis through Cortex to ongoing automations. GDPR-compliant, often eligible for funding.",
    canonical: "/en",
  } satisfies SEOContent,

  /** Loading logo (image key or CMS upload URL) + alt text. */
  loadingLogo: "newedge-logo-white",
  loadingAlt: "NEWEDGE",

  /** Kontakt-Formular (Sheet). */
  contact: {
    /** Titel je nach Absender-Typ. */
    titles: {
      kmu: "Enquiry from a company (SME)",
      agentur: "Enquiry from an agency partner",
      default: "Discuss a project",
    },
    description: "Tell us about your project — we'll get back to you shortly.",
    fields: [
      { id: "name", label: "Name *", type: "text", placeholder: "Your name", required: true },
      { id: "email", label: "Email *", type: "email", placeholder: "your@email.com", required: true },
      { id: "position", label: "Position *", type: "text", placeholder: "Your position", required: true },
      { id: "firma", label: "Company *", type: "text", placeholder: "Your company", required: true },
      { id: "telefon", label: "Phone", type: "tel", placeholder: "Your phone number", required: false },
    ] as ContactField[],
    message: {
      label: "Message *",
      placeholder: "Tell us about your project...",
      defaultKmu: "I'm interested in automation solutions with NEWEDGE.",
      defaultAgentur: "We'd like to become a NEWEDGE partner and automate projects together.",
    },
    submit: "Send message",
  },

  /** Toast-Meldungen des Kontaktformulars. */
  toast: {
    validationTitle: "Please check your details",
    validationFallback: "Please check your details",
    successTitle: "Enquiry received",
    successBody: "Thank you for your enquiry! We'll get back to you shortly.",
    errorTitle: "Error",
    errorFallback: "There was a problem sending your message. Please try again.",
  },
} as const;
