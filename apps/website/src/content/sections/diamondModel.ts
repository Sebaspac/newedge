/**
 * Section-Text: KI-Diamant-Modell (Startseite, direkt nach den Kennzahlen)
 * --------------------------------------------------------------
 * Interaktives 3-Szenen-Modell „Aus Pyramide wird Diamant":
 * klassische Organisationspyramide → KI komprimiert die operative
 * Basis → NEWEDGE stützt den entstehenden Diamanten (Komponente
 * `DiamondModelSection`). Übernommen aus dem eigenständigen
 * „NEWEDGE-KI-Diamant"-Modul, auf CI angepasst (Outfit, Lime #CCFF00,
 * Ink #171717) und in den Content-Layer überführt.
 * Noch NICHT als Strapi-Feld angelegt (statischer Fallback greift).
 * --------------------------------------------------------------
 */

export const diamondModel = {
  ariaLabel: "Vom klassischen Organisationsmodell zum NEWEDGE-Diamanten",

  /** Slim-Topbar im Modul (nur Signal + Steuerelemente rechts). */
  liveTag: "LIVE-MODELL",

  /** Theme-Umschalter (modul-lokal, Standard: dunkel). */
  themeToggleLabel: "Helles Design umschalten",
  themeDark: "DARK",
  themeLight: "LIGHT",

  /** Headline: zwei Zeilen, Akzentwort lime (dunkel) bzw. Ink + Edge-Mark (hell). */
  titleLine1: "Aus Pyramide",
  titleLine2: "wird",
  titleAccent: "Diamant.",

  /** Die drei Szenen der Transformation (steuern Copy, Nav und Grafik). */
  scenes: [
    {
      step: "01",
      eyebrow: "01 / HEUTE",
      title: "Viele Prozesse. Alles per Hand.",
      text: "Ihr Unternehmen hat unzählige Abläufe — aber ohne KI läuft jeder davon manuell. Von allein automatisiert sich hier nichts.",
      metric: "VIELE PROZESSE",
    },
    {
      step: "02",
      eyebrow: "02 / NEWEDGE STARTET",
      title: "Die ersten Prozesse laufen von selbst.",
      text: "NEWEDGE beginnt, Ihre Abläufe zu automatisieren. Die erste spürbare Entlastung: Routine erledigt sich, ohne dass jemand ranmuss.",
      metric: "KI ÜBERNIMMT",
    },
    {
      step: "03",
      eyebrow: "03 / GANZHEITLICH",
      title: "Aus der Pyramide wird ein Diamant.",
      text: "NEWEDGE trägt jetzt die ganze Basis. Ihre Struktur bleibt bestehen — bekommt aber zwei neue Bausteine, die sie tragen und aus der Pyramide einen Diamanten machen.",
      metric: "MEHR WIRKUNG",
    },
  ],

  /** CTA unter der Szenen-Copy. */
  next: "WEITER",
  replay: "NOCHMAL ANSEHEN",

  /** Beschriftungen in der Modell-Grafik. */
  axisTop: "WENIGE ENTSCHEIDUNGEN",
  axisBottomByScene: [
    "ALLES MANUELL",
    "NEWEDGE AUTOMATISIERT",
    "NEWEDGE TRÄGT DIE BASIS",
  ],
  coreLabel: "ORGANISATION",
  humanLabel: "MENSCHLICHE EXPERTISE",
  decisionLabel: "STRATEGIE",
  captionStructure: "STRUKTUR",
  captionShapes: { pyramid: "PYRAMIDE", diamond: "DIAMANT" },

  /** Screenreader-Labels der Steuerelemente. */
  sceneNavLabel: "Szenen der Transformation",
  playLabel: "Animation abspielen",
  pauseLabel: "Animation pausieren",
} as const;
