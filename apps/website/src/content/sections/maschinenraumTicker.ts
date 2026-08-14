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
  ariaLabel: "Maschinenraum: Ereignisse aus laufenden Systemen",

  events: [
    { minsAgo: 4, text: "SCHADENMELDUNG ERFASST · LEISTUNGSPRÜFUNG", href: "/industrien/versicherungen" },
    { minsAgo: 11, text: "BELEG ZUGEORDNET · NEBENKOSTENABRECHNUNG", href: "/loesungen/dokumente-prozesse" },
    { minsAgo: 19, text: "SPRACHNACHWEIS GEPRÜFT · ZULASSUNG", href: "/industrien/bildung" },
    { minsAgo: 27, text: "RÜCKFRAGE BEANTWORTET · LAUFENDER FALL", href: "/loesungen/service-fallbearbeitung" },
    { minsAgo: 38, text: "BEWERTUNG EINGEGANGEN · AUSWAHLVERFAHREN", href: "/loesungen/entscheidungen-fallpruefung" },
    { minsAgo: 52, text: "FEHLENDE ANLAGE ESKALIERT · FÖRDERANTRAG", href: "/industrien/foerderungen-entscheidungsinstanzen" },
    { minsAgo: 64, text: "BEARBEITUNGSSTAND AKTUALISIERT · FRISTEN", href: "/loesungen/steuerung-reporting" },
    { minsAgo: 75, text: "MIETERANLIEGEN ZUGEWIESEN · INSTANDHALTUNG", href: "/industrien/immobilien" },
  ] as TickerEvent[],
};
