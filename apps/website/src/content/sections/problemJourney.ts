/**
 * Section-Text: ProblemJourney („NEWEDGE, DIE LÖSUNG")
 * --------------------------------------------------------------
 * Linke Spalte (Masthead + ROI-Rechner-Freebie) und rechte Spalte
 * (die Reise zur KI-Abteilung als gestapelte Karten). Reiner Inhalt:
 * nur Strings/Arrays — kein JSX, keine Funktionen (serialisierbar,
 * CMS-tauglich). Inline-Markup (z. B. farbige <span>, <br/>) bleibt
 * in der Komponente; hier liegen nur die Text-Leaves.
 *
 * Strapi-Mapping: Single Type `problem-journey` (Home-Komponente).
 * --------------------------------------------------------------
 */

/** Eine Station der Reise (vertikale Leistungs-Liste / Kartenstapel). */
export interface JourneyStation {
  index: string;
  category: string;
  title: string;
}

export const problemJourney = {
  /** Linke Spalte — Masthead. */
  left: {
    eyebrow: "NEWEDGE, DIE LÖSUNG",

    /** Display-Headline mit AnimatedTextCycle. */
    headline: {
      /** Vorangestelltes Wort vor dem Wort-Cycle. */
      lead: "Ihre",
      /** Durchrotierende Wörter im Cycle. */
      words: ["Prozesse.", "Daten.", "KI.", "Plattform.", "Abläufe."],
      /** Wort, das abweichend (dunkler) eingefärbt wird. */
      highlightWord: "Prozesse.",
      /** Zeile nach dem Cycle (nach <br/>). */
      tail: "Als System gedacht.",
    },

    /** Statement-Satz (farbiger Teilsatz separat als Leaf). */
    statementLead: "Die meisten Unternehmen haben kein KI-Problem.",
    statementEmphasis: "Sie haben kein System.",

    /**
     * Erläuternder Mono-Absatz. Als ein zusammenhängender Text gespeichert;
     * im JSX-Quelltext stand er über drei Zeilen mit Einrückung, was beim
     * Rendern zu je einem Leerzeichen kollabiert — hier bereits kollabiert,
     * damit `{body}` byte-identisch rendert.
     */
    body:
      "KI entfaltet ihren Wert erst, wenn sie im System läuft — nicht als einzelnes Tool nebenher. Wir bauen die Struktur dahinter und betreiben sie mit Ihnen: Ihre eigene KI-Abteilung.",

    /** ROI-Rechner-Freebie (violette Stripe-Karte). */
    roi: {
      label: "Kostenlos · 2 Minuten",
      heading: "ROI-Rechner",
      description: "Stunden, Kosten, Amortisation. Ohne Verkaufsgespräch.",
      linkLabel: "ROI jetzt berechnen",
      linkTo: "/ki-audit",
    },
  },

  /** Rechte Spalte — die Reise als gestapelte Karten. */
  right: {
    heading: "Die Reise zur KI-Abteilung",
    /** Die 3 Stationen (Karten-Stack). */
    journey: [
      { index: "01", category: "ANALYSE", title: "Wir finden die wirtschaftlichen Hebel und priorisieren die Prozesse mit dem größten ROI." },
      { index: "02", category: "UMSETZUNG", title: "Wir bauen Cortex als zentrale Infrastruktur und automatisieren die wichtigsten Abläufe." },
      { index: "03", category: "SKALIERUNG", title: "Mit Embedded AI übernehmen wir Verantwortung für die kontinuierliche Weiterentwicklung." },
    ] as JourneyStation[],
  },

  /** Section-Wrapper. */
  ariaLabel: "Die Lösung und die Reise zur KI-Abteilung",
};
