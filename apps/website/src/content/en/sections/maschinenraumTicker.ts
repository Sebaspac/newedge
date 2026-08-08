/**
 * Section-Text: Maschinenraum-Ticker (Singleton, global)
 * --------------------------------------------------------------
 * Status-/Aktivitätsleiste im globalen Footer (auf jeder Seite).
 * Anonymisierte Ereignistypen aus den laufenden Kundensystemen.
 * Minuten-Offsets (`minsAgo`) werden zur Laufzeit zur aktuellen
 * Uhrzeit aufgelöst, damit die Leiste wie ein lebendes Logbuch liest.
 * `href` sind bereits korrekte interne Links.
 * Strapi-Mapping: Single Type `maschinenraum-ticker`.
 * --------------------------------------------------------------
 */

/** Einzelnes Ticker-Ereignis. */
export interface TickerEvent {
  /** Minuten in der Vergangenheit (→ Uhrzeit zur Laufzeit aufgelöst). */
  minsAgo: number;
  text: string;
  /** Interner Ziel-Pfad, z. B. "/loesungen/compliance". */
  href: string;
}

export const maschinenraumTicker = {
  ariaLabel: "Engine room: events from live systems",

  events: [
    { minsAgo: 4, text: "REPORT GENERATED · CONSULTING, MUNICH", href: "/industrien/professional-services" },
    { minsAgo: 11, text: "124 DOCUMENTS CLASSIFIED · WHOLESALE", href: "/industrien/handel-supply-chain" },
    { minsAgo: 19, text: "SHIPMENT STATUS UPDATED · EXPORT, 23 COUNTRIES", href: "/loesungen/compliance" },
    { minsAgo: 27, text: "CUSTOMER INQUIRY ANSWERED · AGENT, 0.8s", href: "/loesungen/ki-kundensupport" },
    { minsAgo: 38, text: "ONBOARDING FLOW TRIGGERED · LAW FIRM", href: "/industrien/professional-services" },
    { minsAgo: 52, text: "SANCTIONS LIST CHECK PASSED · 14 SHIPMENTS", href: "/loesungen/compliance" },
    { minsAgo: 64, text: "KPI DASHBOARD SYNCED · REAL TIME", href: "/loesungen/kpi-dashboard" },
    { minsAgo: 75, text: "ORDERS PROCESSED · 400/DAY ON TARGET", href: "/industrien/handel-supply-chain" },
  ] as TickerEvent[],
};
