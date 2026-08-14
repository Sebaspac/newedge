/**
 * Section-Text: TickerScroll (zwei laufende Marquee-Bänder)
 * --------------------------------------------------------------
 * Zwei horizontal scrollende Bänder (Komponente `TickerScrollSection`):
 * Band 1 ein Serif-Satz (scrollt links), Band 2 eine Mono-Hashtag-Zeile
 * (scrollt rechts). Nur der reine Lauftext ist Inhalt — Farben, Schrift,
 * Scroll-Richtung und Geschwindigkeit bleiben bewusst in der Komponente
 * (kein Inhalt). Texte verbatim inkl. trennender „ ·"-Marker am Zeilenende.
 * Strapi-Mapping: Single Type `ticker-scroll` (zwei Text-Felder).
 * --------------------------------------------------------------
 */

export const tickerScroll = {
  /** Band 1 — Serif-Satz, scrollt nach links. */
  sentence: "Wir bauen Ihre KI-Abteilung — von der ersten Analyse bis zum laufenden Betrieb ·",

  /** Band 2 — Mono-Hashtag-Zeile, scrollt nach rechts. */
  hashtags: "#KIAbteilung · #Mittelstand · #NEWEDGE · #Datenhoheit · #Cortex · #Automatisierung · #förderfähig · #firmeneigen ·",
} satisfies TickerScroll;

/** Inhalt der beiden Marquee-Bänder (reine Lauftexte). */
export interface TickerScroll {
  sentence: string;
  hashtags: string;
}
