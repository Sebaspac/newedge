/**
 * Section-Text: Maschinenraum-Ticker (Singleton, global)
 * --------------------------------------------------------------
 * Status-/Aktivitätsleiste im globalen Footer (auf jeder Seite).
 * Illustrative Ereignistypen aus den vier Branchen (Versicherungen,
 * Bildung, Förderungen, Immobilien) entlang der vier Blueprints —
 * keine echten Kundendaten, keine Mengen-, Zeit- oder Leistungswerte.
 * Minuten-Offsets (`minsAgo`) werden zur Laufzeit zur aktuellen
 * Uhrzeit aufgelöst, damit die Leiste wie ein lebendes Logbuch liest.
 * `href` zeigen nur auf die vier Blueprint- und vier Branchenseiten.
 * Strapi-Mapping: Single Type `maschinenraum-ticker`.
 * --------------------------------------------------------------
 */

/** Einzelnes Ticker-Ereignis. */
export interface TickerEvent {
  /** Minuten in der Vergangenheit (→ Uhrzeit zur Laufzeit aufgelöst). */
  minsAgo: number;
  text: string;
  /** Interner Ziel-Pfad, z. B. "/loesungen/dokumente-prozesse". */
  href: string;
}

export const maschinenraumTicker = {
  ariaLabel: "Engine room: events from live systems",

  events: [
    { minsAgo: 4, text: "NEW CLAIM CAPTURED · CLAIMS ASSESSMENT", href: "/industrien/versicherungen" },
    { minsAgo: 11, text: "RECEIPT MATCHED · SERVICE CHARGE STATEMENT", href: "/loesungen/dokumente-prozesse" },
    { minsAgo: 19, text: "LANGUAGE CERTIFICATE VERIFIED · ADMISSIONS", href: "/industrien/bildung" },
    { minsAgo: 27, text: "FOLLOW-UP QUESTION ANSWERED · OPEN CASE", href: "/loesungen/service-fallbearbeitung" },
    { minsAgo: 38, text: "ASSESSMENT SUBMITTED · SELECTION PROCESS", href: "/loesungen/entscheidungen-fallpruefung" },
    { minsAgo: 52, text: "MISSING ATTACHMENT ESCALATED · GRANT APPLICATION", href: "/industrien/foerderungen-entscheidungsinstanzen" },
    { minsAgo: 64, text: "PROCESSING STATUS UPDATED · DEADLINES", href: "/loesungen/steuerung-reporting" },
    { minsAgo: 75, text: "TENANT REQUEST ASSIGNED · MAINTENANCE", href: "/industrien/immobilien" },
  ] as TickerEvent[],
};
