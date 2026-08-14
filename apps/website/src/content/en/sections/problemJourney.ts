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
    eyebrow: "NEWEDGE, THE SOLUTION",

    /** Display-Headline mit AnimatedTextCycle. */
    headline: {
      /** Vorangestelltes Wort vor dem Wort-Cycle. */
      lead: "Your",
      /** Durchrotierende Wörter im Cycle. */
      words: ["Processes.", "Data.", "AI.", "Platform.", "Workflows."],
      /** Wort, das abweichend (dunkler) eingefärbt wird. */
      highlightWord: "Processes.",
      /** Zeile nach dem Cycle (nach <br/>). */
      tail: "Designed as a system.",
    },

    /** Statement-Satz (farbiger Teilsatz separat als Leaf). */
    statementLead: "Most companies don't have an AI problem.",
    statementEmphasis: "They don't have a system.",

    /**
     * Erläuternder Mono-Absatz. Als ein zusammenhängender Text gespeichert;
     * im JSX-Quelltext stand er über drei Zeilen mit Einrückung, was beim
     * Rendern zu je einem Leerzeichen kollabiert — hier bereits kollabiert,
     * damit `{body}` byte-identisch rendert.
     */
    body:
      "AI only delivers value once it runs inside a system — not as a standalone tool on the side. We build the structure behind it and run it with you: your own AI department.",

    /** ROI-Rechner-Freebie (violette Stripe-Karte). */
    roi: {
      label: "Free · 2 minutes",
      heading: "ROI calculator",
      description: "Hours, costs, payback. No sales call.",
      linkLabel: "Calculate ROI now",
      linkTo: "/ki-audit",
    },
  },

  /** Rechte Spalte — die Reise als gestapelte Karten. */
  right: {
    heading: "The journey to your AI department",
    /** Die 3 Stationen (Karten-Stack). */
    journey: [
      { index: "01", category: "ANALYSIS", title: "We find the economic levers and prioritize the processes with the highest ROI." },
      { index: "02", category: "IMPLEMENTATION", title: "We build Cortex as the central infrastructure and automate the most important workflows." },
      { index: "03", category: "SCALING", title: "With Embedded AI we take ownership of the ongoing development." },
    ] as JourneyStation[],
  },

  /** Section-Wrapper. */
  ariaLabel: "The solution and the journey to your AI department",
};
