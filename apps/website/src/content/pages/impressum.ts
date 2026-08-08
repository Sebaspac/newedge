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
import type { SEOContent } from "../types";

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
    title: "Impressum | NEWEDGE",
    description: "Impressum und rechtliche Angaben der NEWEDGE GbR, München.",
    canonical: "/impressum",
  } satisfies SEOContent,

  /** Seitenkopf. Titel zweizeilig (durch <br /> getrennt). */
  page: {
    titleLine1: "Impressum &",
    titleLine2: "Datenschutz",
    stand: "Stand: Januar 2026",
  },

  /** ═══════════════ IMPRESSUM ═══════════════ */
  impressumSection: {
    /** H2-Überschrift des Impressum-Teils. */
    title: "Impressum",

    /** Angaben gemäß § 5 TMG (Box mit E-Mail-Link). */
    angaben: {
      heading: "Angaben gemäß § 5 TMG",
      company: "NEWEDGE Brand – Creative Tech Agentur",
      owner: "Inhaber: Wenjamin Zabezhanskiy",
      country: "Deutschland",
      /** Label vor dem E-Mail-Link. */
      emailLabel: "E-Mail:",
      email: {
        label: "info@newedgebrand.com",
        href: "mailto:info@newedgebrand.com",
      } satisfies LegalLink,
    },

    /** Geltungsbereich (Intro + Liste mit Link). */
    geltungsbereich: {
      heading: "Geltungsbereich",
      intro: "Dieses Impressum gilt ebenfalls für folgende Online-Präsenzen:",
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
        heading: "Haftungsbeschränkung",
        body: [
          "Die Inhalte dieser Webseite wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernimmt der Anbieter jedoch keine Gewähr.",
          "Als Diensteanbieter ist der Anbieter dieser Seiten gemäß § 7 Abs. 1 TMG für eigene Inhalte nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG ist der Anbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.",
          "Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden diese Inhalte umgehend entfernt.",
        ],
      },
      {
        heading: "Externe Links",
        body: [
          "Diese Webseite enthält Verknüpfungen zu externen Webseiten Dritter („externe Links\"). Auf deren Inhalte hat der Anbieter keinen Einfluss und übernimmt hierfür keine Gewähr. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich.",
          "Zum Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar. Bei Bekanntwerden von Rechtsverletzungen werden solche Links umgehend entfernt.",
        ],
      },
      {
        heading: "Urheberrecht / Leistungsschutzrecht",
        body: [
          "Die auf dieser Webseite veröffentlichten Inhalte und Werke unterliegen dem deutschen Urheberrecht. Jede Art der Vervielfältigung, Bearbeitung, Verbreitung oder Verwertung außerhalb der Grenzen des Urheberrechts bedarf der vorherigen schriftlichen Zustimmung des jeweiligen Rechteinhabers.",
          "Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.",
          "Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir solche Inhalte umgehend entfernt.",
        ],
      },
    ] satisfies LegalSection[],
  },

  /** ═══════════════ DATENSCHUTZ ═══════════════ */
  datenschutzSection: {
    /** H2-Überschrift des Datenschutz-Teils. */
    title: "Datenschutzerklärung",

    /** 1. Verantwortlicher Anbieter (Intro + Box mit Adresse + E-Mail-Link). */
    verantwortlicher: {
      heading: "1. Verantwortlicher Anbieter",
      intro:
        "Verantwortlich für die Verarbeitung personenbezogener Daten im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:",
      /** Adresszeilen der Box (je eine eigene Zeile). */
      address: [
        "NEWEDGE Brand",
        "Inhaber: Wenjamin Zabezhanskiy",
        "\n",
        "München",
        "Deutschland",
      ],
      emailLabel: "E-Mail:",
      email: {
        label: "info@newedgebrand.com",
        href: "mailto:info@newedgebrand.com",
      } satisfies LegalLink,
    },

    /** 2. Erhebung und Verarbeitung personenbezogener Daten. */
    erhebung: {
      heading: "2. Erhebung und Verarbeitung personenbezogener Daten",
      body: [
        "Wir verarbeiten personenbezogene Daten nur, wenn dies zur Bereitstellung unserer Website, zur Kommunikation oder zur Durchführung unserer Leistungen erforderlich ist.",
        "Eine Weitergabe Ihrer Daten an Dritte erfolgt ausschließlich im Rahmen gesetzlicher Bestimmungen oder aufgrund Ihrer ausdrücklichen Einwilligung.",
      ],
    } satisfies LegalSection,

    /** 3. Server-Logfiles (Intro + Liste + zwei abschließende Absätze). */
    serverLogfiles: {
      heading: "3. Server-Logfiles",
      intro:
        "Beim Besuch unserer Website werden automatisch folgende Daten durch unseren Hostinganbieter erfasst:",
      items: [
        "IP-Adresse",
        "Datum und Uhrzeit des Zugriffs",
        "Browsertyp und -version",
        "Betriebssystem",
        "Referrer-URL",
      ],
      after1:
        "Diese Daten dienen ausschließlich der technischen Sicherheit, Optimierung der Website und Fehleranalyse.",
      after2: "Eine Zusammenführung mit anderen Datenquellen findet nicht statt.",
    },

    /** 4. Kontaktaufnahme. */
    kontaktaufnahme: {
      heading: "4. Kontaktaufnahme",
      body: [
        "Wenn Sie uns per E-Mail oder über ein Kontaktformular kontaktieren, speichern wir Ihre Angaben zur Bearbeitung Ihrer Anfrage sowie für etwaige Rückfragen.",
        "Diese Daten geben wir nicht ohne Ihre Einwilligung an Dritte weiter.",
      ],
    } satisfies LegalSection,

    /** 5. Meta (Facebook) Pixel (Absätze inkl. Link + Widerspruchs-Box). */
    metaPixel: {
      heading: "5. Verwendung des Meta (Facebook) Pixels",
      /** Absätze vor dem Datenschutz-Link. */
      body: [
        "Wir nutzen auf unserer Website das Meta Pixel, um das Verhalten von Nutzer:innen nach dem Klick auf eine Werbeanzeige auf Facebook oder Instagram nachvollziehen zu können.",
        "Dies dient der Analyse und Optimierung unserer Kampagnen.",
        "Die erhobenen Daten sind für uns anonym.",
        "Meta kann diese Daten jedoch mit Ihrem Meta-Profil verknüpfen, sofern Sie eingeloggt sind.",
      ],
      /** Letzter Absatz: Vorlauftext vor dem Inline-Link. */
      moreInfoLabel: "Weitere Informationen hierzu finden Sie in den Datenschutzbestimmungen von Meta:",
      moreInfoLink: {
        label: "facebook.com/about/privacy",
        href: "https://www.facebook.com/about/privacy",
      } satisfies LegalLink,
      box: {
        title: "Widerspruchsmöglichkeit",
        body: "Sie können der Erfassung durch das Meta Pixel jederzeit widersprechen – z. B. über die Cookie-Einstellungen auf unserer Website oder direkt bei Meta.",
      },
    },

    /** 6. Google Tag Manager (Absätze + Box mit Liste + abschließender Absatz mit Link). */
    googleTagManager: {
      heading: "6. Verwendung des Google Tag Managers",
      body: [
        "Wir setzen auf unserer Website den Google Tag Manager ein.",
        "Der Google Tag Manager ist ein Dienst der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland.",
        "Der Tag Manager ermöglicht uns, Website-Tags zentral zu verwalten.",
      ],
      box: {
        title: "Das Tool selbst:",
        items: [
          "Speichert keine personenbezogenen Daten",
          "Setzt keine Cookies",
          "Dient lediglich der Einbindung anderer Tracking-Tools (z. B. Google Analytics, Meta Pixel)",
        ],
      },
      moreInfoLabel: "Weitere Informationen finden Sie in der Datenschutzerklärung von Google:",
      moreInfoLink: {
        label: "policies.google.com/privacy",
        href: "https://policies.google.com/privacy",
      } satisfies LegalLink,
    },

    /** 7. Google Analytics (Intro + Zweck + Daten-Liste + IP-Box + Link). */
    googleAnalytics: {
      heading: "7. Einsatz von Google Analytics",
      intro: [
        "Wir nutzen Google Analytics, einen Webanalysedienst der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland.",
      ],
      purpose: {
        title: "Zweck der Verarbeitung:",
        body: [
          "Google Analytics verwendet Cookies, um die Nutzung unserer Website auszuwerten und Berichte über die Websiteaktivitäten zu erstellen.",
          "Dadurch können wir unsere Website und Marketingmaßnahmen optimieren.",
        ],
      },
      data: {
        title: "Verarbeitete Daten:",
        items: [
          "IP-Adresse (anonymisiert)",
          "Browsertyp und -version",
          "Verwendetes Endgerät und Betriebssystem",
          "Referrer-URL",
          "Zeitpunkt und Dauer des Besuchs",
          "Interaktionen auf der Website",
        ],
      },
      box: {
        title: "IP-Anonymisierung",
        body: "Wir haben Google Analytics so konfiguriert, dass Ihre IP-Adresse innerhalb der EU oder des EWR gekürzt wird, bevor sie an Google weitergeleitet wird.",
      },
      moreInfoLabel: "Weitere Informationen finden Sie hier:",
      moreInfoLink: {
        label: "support.google.com/analytics",
        href: "https://support.google.com/analytics/answer/6004245",
      } satisfies LegalLink,
    },

    /** 8. Cookies (Intro + Arten-Liste mit Hervorhebungen + Kontroll-Box). */
    cookies: {
      heading: "8. Cookies",
      intro:
        "Unsere Website verwendet Cookies, um grundlegende Funktionen bereitzustellen und Ihre Nutzererfahrung zu verbessern.",
      types: {
        title: "Arten von Cookies:",
        /** Jeder Eintrag: hervorgehobener `term` + nachfolgender `rest`-Text. */
        items: [
          { term: "Essenzielle Cookies", rest: " — notwendig für den Betrieb der Website" },
          { term: "Statistik-Cookies", rest: " — zur Analyse durch Google Analytics" },
          { term: "Marketing-Cookies", rest: " — für Meta Pixel und Google Ads" },
        ],
      },
      box: {
        title: "Ihre Kontrolle",
        body: "Über das Cookiebot-Banner können Sie individuell festlegen, welche Cookies Sie zulassen möchten — und Ihre Auswahl jederzeit über den Link „Cookie-Einstellungen“ am Seitenende ändern oder widerrufen.",
      },
    },

    /** 9. Ihre Rechte (Intro + Rechte-Liste + Abschluss mit E-Mail-Link). */
    rechte: {
      heading: "9. Ihre Rechte als betroffene Person",
      intro: "Gemäß DSGVO haben Sie jederzeit folgende Rechte:",
      items: [
        "Auskunft über die zu Ihrer Person gespeicherten Daten",
        "Berichtigung unrichtiger Daten",
        "Löschung Ihrer Daten (Recht auf Vergessenwerden)",
        "Einschränkung der Verarbeitung",
        "Widerspruch gegen die Verarbeitung",
        "Datenübertragbarkeit",
      ],
      contactLabel: "Bitte richten Sie Ihre Anfrage an:",
      email: {
        label: "info@newedgebrand.com",
        href: "mailto:info@newedgebrand.com",
      } satisfies LegalLink,
    },

    /** 10. Datensicherheit. */
    datensicherheit: {
      heading: "10. Datensicherheit",
      body: [
        "Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre Daten gegen Manipulation, Verlust oder unbefugten Zugriff zu schützen.",
        "Unsere Sicherheitsmaßnahmen werden regelmäßig überprüft und verbessert.",
      ],
    } satisfies LegalSection,

    /** 11. Änderungen dieser Datenschutzerklärung. */
    aenderungen: {
      heading: "11. Änderungen dieser Datenschutzerklärung",
      body: [
        "Wir behalten uns vor, diese Datenschutzerklärung anzupassen, sofern Änderungen an unserer Website oder rechtliche Vorgaben dies erforderlich machen.",
        "Die jeweils aktuelle Version finden Sie jederzeit auf dieser Seite.",
      ],
    } satisfies LegalSection,

    /** 12. Cookie-Consent & Tracking-Opt-in (Intro + Box mit Liste). */
    cookieConsent: {
      heading: "12. Cookie-Consent & Tracking-Opt-in",
      intro:
        "Da wir Meta Pixel, Google Tag Manager und Google Analytics verwenden, setzen wir ein Cookie-Banner mit Opt-in-Funktion ein. Dafür nutzen wir Cookiebot, einen Dienst der Usercentrics A/S, Havnegade 39, 1058 Kopenhagen, Dänemark. Cookiebot speichert Ihre Einwilligung und protokolliert sie als Nachweis; dazu wird ein Cookie mit einer zufälligen Kennung gesetzt. Ihre Einwilligung ist die Rechtsgrundlage (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG).",
      box: {
        items: [
          "Tracking-Skripte werden erst aktiv, wenn Sie zugestimmt haben",
          "Opt-in vor Tracking → DSGVO-konform",
          "Google Consent Mode steht bis zur Einwilligung auf „denied“",
          "Link zur Datenschutzerklärung",
          "Widerruf jederzeit möglich — mit Wirkung für die Zukunft",
        ],
      },
    },
  },
} as const;
