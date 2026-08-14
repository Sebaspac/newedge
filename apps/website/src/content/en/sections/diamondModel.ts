/**
 * Section-Text: KI-Diamant-Modell (Startseite, direkt nach den Kennzahlen)
 * --------------------------------------------------------------
 * Interaktives 3-Szenen-Modell „Aus Pyramide wird Diamant":
 * klassische Organisationspyramide → KI komprimiert die operative
 * Basis → NEWEDGE stützt den entstehenden Diamanten (Komponente
 * `DiamondModelSection`). EN-Spiegel von `sections/diamondModel.ts`.
 * Noch NICHT als Strapi-Feld angelegt (statischer Fallback greift).
 * --------------------------------------------------------------
 */

export const diamondModel = {
  ariaLabel: "From the classic organizational model to the NEWEDGE diamond",

  /** Slim-Topbar im Modul (nur Signal + Steuerelemente rechts). */
  liveTag: "LIVE MODEL",

  /** Theme-Umschalter (modul-lokal, Standard: dunkel). */
  themeToggleLabel: "Toggle light mode",
  themeDark: "DARK",
  themeLight: "LIGHT",

  /** Headline: zwei Zeilen, Akzentwort lime (dunkel) bzw. Ink + Edge-Mark (hell). */
  titleLine1: "From pyramid",
  titleLine2: "to",
  titleAccent: "diamond.",

  /** Die drei Szenen der Transformation (steuern Copy, Nav und Grafik). */
  scenes: [
    {
      step: "01",
      eyebrow: "01 / TODAY",
      title: "Many processes. All by hand.",
      text: "Your company runs countless workflows — but without AI, every one of them is manual. Nothing automates itself here.",
      metric: "MANY PROCESSES",
    },
    {
      step: "02",
      eyebrow: "02 / NEWEDGE STARTS",
      title: "The first processes run on their own.",
      text: "NEWEDGE starts automating your workflows. The first real relief: routine takes care of itself, with no one stepping in.",
      metric: "AI TAKES OVER",
    },
    {
      step: "03",
      eyebrow: "03 / HOLISTIC",
      title: "The pyramid becomes a diamond.",
      text: "NEWEDGE now carries the entire base. Your structure stays intact — but gains two new building blocks that support it and turn the pyramid into a diamond.",
      metric: "MORE IMPACT",
    },
  ],

  /** CTA unter der Szenen-Copy. */
  next: "NEXT",
  replay: "WATCH AGAIN",

  /** Beschriftungen in der Modell-Grafik. */
  axisTop: "FEW DECISIONS",
  axisBottomByScene: [
    "ALL MANUAL",
    "NEWEDGE AUTOMATES",
    "NEWEDGE CARRIES THE BASE",
  ],
  coreLabel: "ORGANIZATION",
  humanLabel: "HUMAN EXPERTISE",
  decisionLabel: "STRATEGY",
  captionStructure: "STRUCTURE",
  captionShapes: { pyramid: "PYRAMID", diamond: "DIAMOND" },

  /** Screenreader-Labels der Steuerelemente. */
  sceneNavLabel: "Scenes of the transformation",
  playLabel: "Play animation",
  pauseLabel: "Pause animation",
} as const;
