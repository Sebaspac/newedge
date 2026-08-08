/**
 * Page: Impressum & Datenschutz  — Single Type
 * --------------------------------------------------------------
 * Inhalte der Rechtsseite (`pages/Impressum.tsx`): SEO, Seitentitel,
 * sowie die beiden Rechtstexte „Impressum" und „Datenschutzerklärung"
 * mit ihren Unterabschnitten.
 *
 * RECHTSTEXT — VERBATIM. Jeder String ist byte-genau aus der Seite
 * übernommen (Rechtschreibung, Whitespace, Sonderzeichen wie §, „ ",
 * –, —, → sowie E-Mails/URLs/Adresse). Inhalt darf nicht umformuliert
 * werden.
 *
 * Modellierung: Die meisten Abschnitte sind reiner Fließtext und werden
 * als typisierte Heading-/Absatz-/Listen-Arrays (`LegalSection`)
 * gehalten. Abschnitte mit Inline-Markup (Links) behalten ihr JSX in
 * der Komponente; hier liegen nur deren Text-Blätter (Labels) und die
 * Link-Ziele (`href`). Keine Icons/Bilder. Kein JSX, keine Funktionen —
 * serialisierbar (CMS-tauglich).
 * Strapi-Mapping: Single Type `impressum`.
 * --------------------------------------------------------------
 */
import type { SEOContent } from "@/content/types";

/**
 * Ein Rechtsabschnitt: Überschrift + Absätze (reiner Fließtext).
 * Für Abschnitte ohne Inline-Markup; jeder `body`-Eintrag ist ein
 * eigenständiger `<p>`.
 */
export interface LegalSection {
  heading: string;
  body: string[];
}

/** Beschrifteter Link (Text-Blatt + Ziel) für Inline-Markup in der Komponente. */
interface LegalLink {
  label: string;
  href: string;
}

export const impressum = {
  seo: {
    title: "Legal Notice | NEWEDGE",
    description: "Legal notice and legal information of NEWEDGE GbR, Munich.",
    canonical: "/en/impressum",
  } satisfies SEOContent,

  /** Seitenkopf. Titel zweizeilig (durch <br /> getrennt). */
  page: {
    titleLine1: "Legal Notice &",
    titleLine2: "Privacy",
    stand: "As of: January 2026",
  },

  /** ═══════════════ IMPRESSUM ═══════════════ */
  impressumSection: {
    /** H2-Überschrift des Impressum-Teils. */
    title: "Legal Notice",

    /** Angaben gemäß § 5 TMG (Box mit E-Mail-Link). */
    angaben: {
      heading: "Information pursuant to § 5 TMG",
      company: "NEWEDGE Brand – Creative Tech Agency",
      owner: "Owner: Wenjamin Zabezhanskiy",
      country: "Germany",
      /** Label vor dem E-Mail-Link. */
      emailLabel: "Email:",
      email: {
        label: "info@newedgebrand.com",
        href: "mailto:info@newedgebrand.com",
      } satisfies LegalLink,
    },

    /** Geltungsbereich (Intro + Liste mit Link). */
    geltungsbereich: {
      heading: "Scope",
      intro: "This legal notice also applies to the following online presences:",
      links: [
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/company/new-edge-brand/",
        },
      ] satisfies LegalLink[],
    },

    /** Reine Fließtext-Abschnitte des Impressum-Teils. */
    sections: [
      {
        heading: "Limitation of liability",
        body: [
          "The content of this website has been created with the greatest possible care. However, the provider assumes no liability for the accuracy, completeness or timeliness of the content.",
          "As a service provider, the provider of these pages is responsible for its own content in accordance with § 7 para. 1 TMG under the general laws. According to §§ 8 to 10 TMG, however, the provider is not obliged to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.",
          "As soon as such legal violations become known, this content will be removed immediately.",
        ],
      },
      {
        heading: "External links",
        body: [
          "This website contains links to external third-party websites (\"external links\"). The provider has no influence over their content and assumes no liability for it. The respective provider or operator is always responsible for the content of the linked pages.",
          "At the time the links were created, no legal violations were apparent. As soon as any legal violations become known, such links will be removed immediately.",
        ],
      },
      {
        heading: "Copyright / ancillary copyright",
        body: [
          "The content and works published on this website are subject to German copyright law. Any form of reproduction, editing, distribution or use beyond the limits of copyright requires the prior written consent of the respective rights holder.",
          "Downloads and copies of this page are permitted for private, non-commercial use only.",
          "Insofar as the content on this page was not created by the operator, the copyrights of third parties are respected. Should you nevertheless become aware of a copyright infringement, please let us know. As soon as any legal violations become known, we will remove such content immediately.",
        ],
      },
    ] satisfies LegalSection[],
  },

  /** ═══════════════ DATENSCHUTZ ═══════════════ */
  datenschutzSection: {
    /** H2-Überschrift des Datenschutz-Teils. */
    title: "Privacy Policy",

    /** 1. Verantwortlicher Anbieter (Intro + Box mit Adresse + E-Mail-Link). */
    verantwortlicher: {
      heading: "1. Responsible provider",
      intro:
        "Responsible for the processing of personal data within the meaning of the General Data Protection Regulation (GDPR) is:",
      /** Adresszeilen der Box (je eine eigene Zeile). */
      address: [
        "NEWEDGE Brand",
        "Owner: Wenjamin Zabezhanskiy",
        "\n",
        "Munich",
        "Germany",
      ],
      emailLabel: "Email:",
      email: {
        label: "info@newedgebrand.com",
        href: "mailto:info@newedgebrand.com",
      } satisfies LegalLink,
    },

    /** 2. Erhebung und Verarbeitung personenbezogener Daten. */
    erhebung: {
      heading: "2. Collection and processing of personal data",
      body: [
        "We process personal data only when this is necessary to provide our website, to communicate, or to deliver our services.",
        "Your data is passed on to third parties exclusively within the scope of legal provisions or on the basis of your express consent.",
      ],
    } satisfies LegalSection,

    /** 3. Server-Logfiles (Intro + Liste + zwei abschließende Absätze). */
    serverLogfiles: {
      heading: "3. Server log files",
      intro:
        "When you visit our website, the following data is automatically recorded by our hosting provider:",
      items: [
        "IP address",
        "Date and time of access",
        "Browser type and version",
        "Operating system",
        "Referrer URL",
      ],
      after1:
        "This data serves exclusively for technical security, optimization of the website and error analysis.",
      after2: "It is not merged with other data sources.",
    },

    /** 4. Kontaktaufnahme. */
    kontaktaufnahme: {
      heading: "4. Contacting us",
      body: [
        "If you contact us by email or via a contact form, we store your details in order to process your inquiry and for any follow-up questions.",
        "We do not pass this data on to third parties without your consent.",
      ],
    } satisfies LegalSection,

    /** 5. Meta (Facebook) Pixel (Absätze inkl. Link + Widerspruchs-Box). */
    metaPixel: {
      heading: "5. Use of the Meta (Facebook) Pixel",
      /** Absätze vor dem Datenschutz-Link. */
      body: [
        "On our website we use the Meta Pixel to understand how users behave after clicking on an advertisement on Facebook or Instagram.",
        "This serves to analyze and optimize our campaigns.",
        "The data collected is anonymous to us.",
        "However, Meta can link this data to your Meta profile if you are logged in.",
      ],
      /** Letzter Absatz: Vorlauftext vor dem Inline-Link. */
      moreInfoLabel: "You can find more information on this in Meta's privacy policy:",
      moreInfoLink: {
        label: "facebook.com/about/privacy",
        href: "https://www.facebook.com/about/privacy",
      } satisfies LegalLink,
      box: {
        title: "Right to object",
        body: "You can object to the collection by the Meta Pixel at any time – e.g. via the cookie settings on our website or directly with Meta.",
      },
    },

    /** 6. Google Tag Manager (Absätze + Box mit Liste + abschließender Absatz mit Link). */
    googleTagManager: {
      heading: "6. Use of the Google Tag Manager",
      body: [
        "On our website we use the Google Tag Manager.",
        "The Google Tag Manager is a service of Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland.",
        "The Tag Manager allows us to manage website tags centrally.",
      ],
      box: {
        title: "The tool itself:",
        items: [
          "Stores no personal data",
          "Sets no cookies",
          "Serves solely to integrate other tracking tools (e.g. Google Analytics, Meta Pixel)",
        ],
      },
      moreInfoLabel: "You can find more information in Google's privacy policy:",
      moreInfoLink: {
        label: "policies.google.com/privacy",
        href: "https://policies.google.com/privacy",
      } satisfies LegalLink,
    },

    /** 7. Google Analytics (Intro + Zweck + Daten-Liste + IP-Box + Link). */
    googleAnalytics: {
      heading: "7. Use of Google Analytics",
      intro: [
        "We use Google Analytics, a web analytics service provided by Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland.",
      ],
      purpose: {
        title: "Purpose of processing:",
        body: [
          "Google Analytics uses cookies to evaluate the use of our website and to compile reports on website activity.",
          "This allows us to optimize our website and marketing measures.",
        ],
      },
      data: {
        title: "Data processed:",
        items: [
          "IP address (anonymized)",
          "Browser type and version",
          "Device and operating system used",
          "Referrer URL",
          "Time and duration of the visit",
          "Interactions on the website",
        ],
      },
      box: {
        title: "IP anonymization",
        body: "We have configured Google Analytics so that your IP address is truncated within the EU or the EEA before it is forwarded to Google.",
      },
      moreInfoLabel: "You can find more information here:",
      moreInfoLink: {
        label: "support.google.com/analytics",
        href: "https://support.google.com/analytics/answer/6004245",
      } satisfies LegalLink,
    },

    /** 8. Cookies (Intro + Arten-Liste mit Hervorhebungen + Kontroll-Box). */
    cookies: {
      heading: "8. Cookies",
      intro:
        "Our website uses cookies to provide basic functions and to improve your user experience.",
      types: {
        title: "Types of cookies:",
        /** Jeder Eintrag: hervorgehobener `term` + nachfolgender `rest`-Text. */
        items: [
          { term: "Essential cookies", rest: " — necessary for the operation of the website" },
          { term: "Statistics cookies", rest: " — for analysis via Google Analytics" },
          { term: "Marketing cookies", rest: " — for Meta Pixel and Google Ads" },
        ],
      },
      box: {
        title: "Your control",
        body: "Through the Cookiebot banner you can individually decide which cookies you want to allow — and change or withdraw your choice at any time via the “Cookie settings” link in the page footer.",
      },
    },

    /** 9. Ihre Rechte (Intro + Rechte-Liste + Abschluss mit E-Mail-Link). */
    rechte: {
      heading: "9. Your rights as a data subject",
      intro: "Under the GDPR, you have the following rights at any time:",
      items: [
        "Access to the data stored about you",
        "Rectification of inaccurate data",
        "Erasure of your data (right to be forgotten)",
        "Restriction of processing",
        "Objection to processing",
        "Data portability",
      ],
      contactLabel: "Please address your request to:",
      email: {
        label: "info@newedgebrand.com",
        href: "mailto:info@newedgebrand.com",
      } satisfies LegalLink,
    },

    /** 10. Datensicherheit. */
    datensicherheit: {
      heading: "10. Data security",
      body: [
        "We use technical and organizational security measures to protect your data against manipulation, loss or unauthorized access.",
        "Our security measures are reviewed and improved regularly.",
      ],
    } satisfies LegalSection,

    /** 11. Änderungen dieser Datenschutzerklärung. */
    aenderungen: {
      heading: "11. Changes to this privacy policy",
      body: [
        "We reserve the right to adapt this privacy policy if changes to our website or legal requirements make this necessary.",
        "You can always find the current version on this page.",
      ],
    } satisfies LegalSection,

    /** 12. Cookie-Consent & Tracking-Opt-in (Intro + Box mit Liste). */
    cookieConsent: {
      heading: "12. Cookie consent & tracking opt-in",
      intro:
        "Since we use Meta Pixel, Google Tag Manager and Google Analytics, we use a cookie banner with an opt-in function. For this we use Cookiebot, a service of Usercentrics A/S, Havnegade 39, 1058 Copenhagen, Denmark. Cookiebot stores your consent and logs it as evidence; a cookie with a random identifier is set for this purpose. Your consent is the legal basis (Art. 6(1)(a) GDPR, Section 25(1) TDDDG).",
      box: {
        items: [
          "Tracking scripts only become active once you have given your consent",
          "Opt-in before tracking → GDPR-compliant",
          "Google Consent Mode stays on “denied” until consent is given",
          "Link to the privacy policy",
          "Withdrawal possible at any time — with effect for the future",
        ],
      },
    },
  },
} as const;
