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
  ariaLabel: "Maschinenraum: Ereignisse aus laufenden Systemen",

  events: [
    { minsAgo: 4, text: "REPORT GENERIERT · BERATUNG, MÜNCHEN", href: "/industrien/professional-services" },
    { minsAgo: 11, text: "124 DOKUMENTE KLASSIFIZIERT · GROSSHANDEL", href: "/industrien/handel-supply-chain" },
    { minsAgo: 19, text: "SENDUNGSSTATUS AKTUALISIERT · EXPORT, 23 LÄNDER", href: "/loesungen/compliance" },
    { minsAgo: 27, text: "KUNDENANFRAGE BEANTWORTET · AGENT, 0,8s", href: "/loesungen/ki-kundensupport" },
    { minsAgo: 38, text: "ONBOARDING-FLOW AUSGELÖST · KANZLEI", href: "/industrien/professional-services" },
    { minsAgo: 52, text: "SANKTIONSLISTEN-CHECK BESTANDEN · 14 SENDUNGEN", href: "/loesungen/compliance" },
    { minsAgo: 64, text: "KPI-DASHBOARD SYNCHRONISIERT · ECHTZEIT", href: "/loesungen/kpi-dashboard" },
    { minsAgo: 75, text: "BESTELLUNGEN VERARBEITET · 400/TAG IM SOLL", href: "/industrien/handel-supply-chain" },
  ] as TickerEvent[],
};
