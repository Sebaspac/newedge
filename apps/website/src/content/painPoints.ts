/**
 * Pain Point Content Store
 * --------------------------------------------------------------
 * Zentrale Inhalte für alle Pain-Point-Seiten.
 * Struktur 1:1 wie aktuelle Auswahlverfahren-Seite.
 * Bilder/Icons: bestehende Platzhalter werden weiterverwendet,
 * pro Slug-Sektion ist eine `imageNote` hinterlegt — beschreibt
 * was später inhaltlich an dieser Stelle stehen soll.
 * --------------------------------------------------------------
 */
import { miniCasesBySlug } from "./collections/miniCases";
import type { ImageKey } from "./assets";

export interface CompareRow {
  /** Kriterium */ k: string;
  /** NEWEDGE */ ne: string;
  /** Alternative */ alt: string;
}

export interface FeatureBlock {
  h2: string;
  /** Optionaler beschreibender Untertitel direkt unter h2 */
  h3?: string;
  sub: string;
  bullets: string[];
  /** Beschreibung des geplanten Bildes — Placeholder bleibt erhalten */
  imageNote: string;
  imageAlt: string;
  /** Seiteneigenes Bild, falls vorhanden — sonst Fallback auf die geteilte Chrome-Grafik. */
  image?: ImageKey;
}

export interface FeatureCard {
  title: string;
  desc: string;
  /** Beschreibung des geplanten Icons */
  iconNote: string;
  /** Seiteneigenes Icon, falls vorhanden — sonst Fallback auf die generischen Chrome-Icons. */
  icon?: ImageKey;
}

/** Eine ROI-/Erfolgs-Kennzahl eines Mini-Cases */
export interface MiniCaseMetric {
  /** z.B. "70 %", "3 Wochen", "4×" */
  value: string;
  /** z.B. "weniger Aufwand pro Zyklus" */
  label: string;
}

/**
 * Mini-Case zu einer Phase (= Feature 01/02/03).
 * Illustratives Beispiel-Szenario — KEINE echten Kundendaten.
 * Wird auf einer eigenen Detailseite ausgespielt:
 *   /loesungen/:slug/case/:id  bzw.  /industrien/:slug/case/:id
 */
export interface MiniCase {
  /** URL-Segment, z.B. "bmp-award" → .../case/bmp-award */
  id: string;
  /** Case-Nummer, z.B. "Case 01" */
  phaseLabel: string;
  /** Status-Tag, z.B. "Reales Projekt · BMP" oder "Beispielhafter Anwendungsfall". */
  badge?: string;
  /** Disclaimer-Text im Szenario-Band (je nach Case-Typ). */
  disclaimer?: string;
  /** Kurztitel — Übersichts-Card + Detailseite */
  title: string;
  /** 1-Satz-Teaser für die Übersichts-Card */
  teaser: string;
  /** Kurzbeschreibung des fiktiven Beispiel-Setups, z.B. "Regionaler Mittelstandspreis, ~180 Einreichungen/Jahr" */
  scenario: string;
  /** Ausgangslage / Problem vor NEWEDGE */
  situation: string;
  /** Was in dieser Phase konkret gemacht wird — Schritte */
  approach: string[];
  /** Ergebnis / Erfolg (Fließtext) */
  result: string;
  /** ROI-/Erfolgs-Kennzahlen (2–4) */
  metrics: MiniCaseMetric[];
  /** Optionales Zitat */
  quote?: { text: string; author: string };
  /** Optionales eigenes Hero-Bild (Registry-Key). Fehlt es, leitet die Detailseite
      das Bild aus dem zugehörigen Anwendungsfeld ab (Feature-/Hero-Bild). */
  image?: { src: ImageKey; alt: string };
  /** Eyebrow-Tags (2–4 kurze Branchen-/Kontext-Namen, z. B. "Schulen", "Awards"). */
  industries?: string[];
}

export interface IntegrationLogo {
  id: string;
  /** Anzeigename / Alt-Text */
  label: string;
  /** Pfad unter /public, z.B. /integrations/sap.svg */
  src: string;
  /** Optionale Größen-Override-Klasse (Default: h-8 w-auto). Z.B. enge Wortmarken kleiner setzen. */
  className?: string;
}

/* ──────────────────────────────────────────────────────────────
   Integrations-Logo-Registry
   Dateien liegen unter public/integrations/ (NewEdge_Logos_Paket).
   Pro Seite wird unten eine passende Auswahl referenziert.
────────────────────────────────────────────────────────────── */
const LOGO = {
  calendly: { id: "calendly", label: "Calendly", src: "/integrations/calendly.svg", className: "h-7 w-auto" },
  datev: { id: "datev", label: "DATEV", src: "/integrations/datev.webp", className: "h-6 w-auto" },
  docusign: { id: "docusign", label: "DocuSign", src: "/integrations/docusign.svg", className: "h-7 w-auto" },
  freshdesk: { id: "freshdesk", label: "Freshdesk", src: "/integrations/freshdesk.webp", className: "h-7 w-auto" },
  googleAds: { id: "google-ads", label: "Google Ads", src: "/integrations/google_ads.svg", className: "h-6 w-auto" },
  googleAnalytics: { id: "google-analytics", label: "Google Analytics", src: "/integrations/google_analytics.svg", className: "h-6 w-auto" },
  googleWorkspace: { id: "google-workspace", label: "Google Workspace", src: "/integrations/google_workspace.webp", className: "h-6 w-auto" },
  hubspot: { id: "hubspot", label: "HubSpot", src: "/integrations/hubspot.svg", className: "h-7 w-auto" },
  instagram: { id: "instagram", label: "Instagram", src: "/integrations/instagram.svg", className: "h-6 w-auto" },
  intercom: { id: "intercom", label: "Intercom", src: "/integrations/intercom.webp", className: "h-6 w-auto" },
  lexoffice: { id: "lexoffice", label: "lexoffice", src: "/integrations/lexoffice.svg", className: "h-7 w-auto" },
  make: { id: "make", label: "Make", src: "/integrations/make_integromat.svg", className: "h-6 w-auto" },
  outlook: { id: "outlook", label: "Microsoft Outlook", src: "/integrations/microsoft_outlook.webp", className: "h-6 w-auto" },
  sharepoint: { id: "sharepoint", label: "Microsoft SharePoint", src: "/integrations/microsoft_sharepoint.webp", className: "h-6 w-auto" },
  teams: { id: "teams", label: "Microsoft Teams", src: "/integrations/microsoft_teams.webp", className: "h-6 w-auto" },
  notion: { id: "notion", label: "Notion", src: "/integrations/notion.webp", className: "h-6 w-auto" },
  personio: { id: "personio", label: "Personio", src: "/integrations/personio.svg", className: "h-7 w-auto" },
  salesforce: { id: "salesforce", label: "Salesforce", src: "/integrations/salesforce.svg", className: "h-7 w-auto" },
  sap: { id: "sap", label: "SAP", src: "/integrations/sap.svg", className: "h-7 w-auto" },
  shopify: { id: "shopify", label: "Shopify", src: "/integrations/shopify.svg", className: "h-6 w-auto" },
  stripe: { id: "stripe", label: "Stripe", src: "/integrations/stripe.svg", className: "h-7 w-auto" },
  woocommerce: { id: "woocommerce", label: "WooCommerce", src: "/integrations/woocommerce.webp", className: "h-6 w-auto" },
  zapier: { id: "zapier", label: "Zapier", src: "/integrations/zapier.svg", className: "h-7 w-auto" },
  zendesk: { id: "zendesk", label: "Zendesk", src: "/integrations/zendesk.svg", className: "h-7 w-auto" },
  zoom: { id: "zoom", label: "Zoom", src: "/integrations/zoom.svg", className: "h-7 w-auto" },
} as const satisfies Record<string, IntegrationLogo>;

export interface PainPointContent {
  slug: string;
  seo: {
    title: string;
    description: string;
    canonical: string;
  };
  hero: {
    overlabel: string;
    h1Line1: string;
    h1Line2Highlighted: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    imageNote: string;
    imageAlt: string;
    /** Seiteneigenes Hero-Bild, falls vorhanden — sonst Fallback auf die geteilte Chrome-Grafik. */
    image?: ImageKey;
  };
  trustBar: {
    headline: string;
    sub: string;
    logos: string[];
  };
  definition: {
    title: string;
    body: string;
  };
  feature1: FeatureBlock;
  feature2: FeatureBlock;
  feature3: FeatureBlock;
  integrations: {
    h2: string;
    h3?: string;
    sub: string;
    /** Logo-Auswahl für diese Seite (public/integrations/) */
    logos?: IntegrationLogo[];
  };
  compare: {
    h2: string;
    h3?: string;
    altLabel: string; // "Manuell", "Klassische Agentur", etc.
    rows: CompareRow[];
  };
  featureCards: {
    h2: string;
    h3?: string;
    cards: FeatureCard[];
  };
  testimonialHero: {
    quote: string;
    author: string;
  };
  faq: { q: string; a: string }[];
  /** Mini-Cases pro Phase (Feature 01/02/03) — illustrative Beispiel-Szenarien. Optional: nur gesetzte Seiten zeigen die Übersicht. */
  miniCases?: MiniCase[];
  /** Optionales HowTo-Schema (JSON-LD) – wird automatisch in <head> injiziert wenn gesetzt */
  howTo?: {
    name: string;
    description: string;
    /** ISO 8601 Duration, z.B. "P14D" */
    totalTime: string;
    steps: { name: string; text: string }[];
  };
  closingCta: {
    h2Line1: string;
    h2Line2Highlighted: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
}

/* ──────────────────────────────────────────────────────────────
   PAIN POINT A — Auswahlverfahren
────────────────────────────────────────────────────────────── */
const auswahlverfahren: PainPointContent = {
  slug: "auswahlverfahren",
  seo: {
    title: "Auswahlverfahren automatisieren mit KI | NEWEDGE München",
    description:
      "NEWEDGE automatisiert Ihr Auswahlverfahren — Einreichung, Jury-Bewertung und revisionssichere Dokumentation. Weniger Aufwand pro Zyklus, live in 2–4 Wochen.",
    canonical: "/loesungen/auswahlverfahren",
  },
  hero: {
    overlabel: "KI-AUTOMATISIERUNG FÜR AWARDS & AUSWAHLVERFAHREN",
    h1Line1: "Ihr Auswahlverfahren —",
    h1Line2Highlighted: "ohne den Verwaltungsmarathon.",
    sub:
      "So automatisieren wir Entscheidungen und Fallprüfung. Ein Auswahlzyklus verschlingt Wochen an Arbeit — Einreichungen sichten, Juroren koordinieren, alles dokumentieren. NEWEDGE automatisiert den kompletten Ablauf bis zur revisionssicheren Entscheidung. Sie urteilen, das System macht den Rest.",
    ctaPrimary: "Demo buchen",
    ctaSecondary: "Case: BMP Award ansehen",
    imageNote:
      "Dashboard-Mockup: Links unstrukturierte PDF-Stapel, rechts strukturiertes Scoring-Dashboard mit Balken, Kategorien, Jury-Scores. Transition-Animation. Lila-Akzente.",
    imageAlt:
      "Vorher: unstrukturierte PDF-Bewerbungen — Nachher: strukturiertes KI-Scoring-Dashboard",
  },
  trustBar: {
    headline: "Vertraut von führenden Organisationen in Deutschland",
    sub: "Reale Ergebnisse aus Auswahlprozessen wie Ihrem",
    logos: ["BMP Award", "Stiftung", "Förderinstitut", "Verband", "IHK", "Accelerator", "Forschungsinstitut"],
  },
  definition: {
    title: "Was ist automatisierte Auswahlverfahren-Software?",
    body:
      "Ein Auswahlverfahren bindet Wochen, in denen niemand entscheidet, sondern alle verwalten: Einreichungen sichten, Jury koordinieren, Begründungen dokumentieren. Automatisierte Auswahlverfahren-Software übernimmt genau diese drei Schritte — Ihr Gremium urteilt statt sortiert. Das spart in jedem Zyklus Aufwand und liefert Entscheidungen, die jeder Prüfung standhalten.",
  },
  feature1: {
    h2: "Nie wieder PDF-Stapel sortieren.",
    h3: "Jede Einreichung kommt strukturiert rein — egal in welchem Format",
    sub:
      "Bewerbungen landen als PDF, Word-Datei und Mail-Anhang bei Ihnen — und jemand verbringt Tage damit, sie vergleichbar zu machen. NEWEDGE erfasst jede Einreichung automatisch, prüft die Vollständigkeit und legt sie als vergleichbares Datenblatt ab. Vom ersten Tag an.",
    bullets: [
      "Automatische Vollständigkeitsprüfung — fehlende Unterlagen fallen sofort auf",
      "Geführtes Einreichungsformular — Bewerber liefern direkt die richtigen Daten",
      "Alles an einem Ort — kein Suchen mehr in Postfächern und Ordnern",
    ],
    imageNote: "Animiertes Mockup: PDFs → KI-Erfassung → strukturiertes Formular.",
    imageAlt: "KI-gestützte Erfassung: PDFs werden in strukturierte Bewerbungs-Datenblätter überführt",
    image: "pain-point-auswahlverfahren-feature1",
  },
  feature2: {
    h2: "Schluss mit dem Juroren-Hinterhertelefonieren.",
    h3: "Die Jury bewertet — die Koordination läuft von selbst",
    sub:
      "12 Juroren, 4 Wochen, ein Postfach voller Rückfragen — so sieht Jury-Koordination heute aus. NEWEDGE übernimmt Briefings, Erinnerungen und das Zusammenführen der Bewertungen: bis zu 80 % weniger Aufwand. Jeder bewertet online im eigenen Tempo. Sie sehen in Echtzeit, wer fertig ist und wo Urteile auseinandergehen.",
    bullets: [
      "Automatische Erinnerungen — keine verpassten Deadlines mehr",
      "Einheitliches Punktesystem — vergleichbare Bewertungen statt Bauchgefühl",
      "Abweichungen sofort sichtbar — wo Juroren uneins sind, wissen Sie es zuerst",
    ],
    imageNote: "Jury-Interface Mockup mit Scoring und Konflikt-Badge.",
    imageAlt: "Jury-Interface mit Score-System und automatischer Konflikt-Erkennung",
    image: "pain-point-auswahlverfahren-feature2",
  },
  feature3: {
    h2: "Jede Entscheidung ist begründet — automatisch.",
    h3: "Revisionssichere Dokumentation, ohne dass jemand sie schreiben muss",
    sub:
      "Ein abgelehnter Bewerber fragt nach. Der Vorstand will die Auswahl nachvollziehen. Dann zählt nur eins: Können Sie lückenlos zeigen, wie entschieden wurde? Mit NEWEDGE ist die Antwort schon fertig — jeder Score, jeder Kommentar, jede Entscheidung automatisch dokumentiert.",
    bullets: [
      "Lückenloser Audit-Trail — wer hat wann auf welcher Grundlage bewertet",
      "Begründung auf Knopfdruck — für jeden Bewerber, jede Entscheidung",
      "Wissen bleibt erhalten — der nächste Zyklus startet nicht bei null",
    ],
    imageNote: "Visual: Audit-Trail-Timeline einer Entscheidung mit Scores, Kommentaren und Zeitstempeln.",
    imageAlt: "Revisionssichere Entscheidungsdokumentation mit lückenlosem Audit-Trail",
    image: "pain-point-auswahlverfahren-feature3",
  },
  integrations: {
    h2: "Verbindet sich mit den Tools, die Sie bereits nutzen",
    h3: "Welche Tools lassen sich in Ihr Auswahlverfahren integrieren?",
    sub: "Kein neues System, das alles ersetzt. NEWEDGE integriert sich in Ihre bestehende Infrastruktur.",
    logos: [LOGO.docusign, LOGO.teams, LOGO.outlook, LOGO.sharepoint, LOGO.googleWorkspace, LOGO.notion, LOGO.calendly, LOGO.zoom, LOGO.zapier],
  },
  compare: {
    h2: "NEWEDGE vs. manueller Auswahlprozess",
    h3: "KI-gestützter Auswahlprozess vs. klassisches Bewerbungsmanagement — der direkte Vergleich",
    altLabel: "Manuell",
    rows: [
      { k: "Bewerbungseingang", ne: "Strukturiert & automatisch", alt: "PDFs, Mails, verschiedene Formate" },
      { k: "Jury-Koordination", ne: "Vollautomatisiert", alt: "Endlose E-Mail-Threads" },
      { k: "Vergleichbarkeit", ne: "Einheitliches Kategoriensystem", alt: "Keine einheitliche Basis" },
      { k: "Entscheidungsdoku", ne: "Revisionssicher & automatisch", alt: "Existiert kaum" },
      { k: "Wissen nach Zyklus", ne: "Bleibt dauerhaft erhalten", alt: "Geht jedes Jahr verloren" },
      { k: "Analysen", ne: "Automatisch generiert", alt: "Nicht vorhanden" },
      { k: "Aufwand pro Zyklus", ne: "Planbar & gleichbleibend", alt: "Wochen manuelle Arbeit" },
    ],
  },
  featureCards: {
    h2: "Sie urteilen. Den Rest übernimmt das System.",
    h3: "Was NEWEDGE in Ihrem Auswahlverfahren konkret übernimmt",
    cards: [
      {
        title: "Automatische Einreichungserfassung",
        desc: "Jede Bewerbung wird automatisch erfasst, auf Vollständigkeit geprüft und als vergleichbares Datenblatt für die Jury aufbereitet.",
        iconNote: "Animation: Dokumente → strukturierte Daten",
        icon: "ppa-icon-form",
      },
      {
        title: "Selbstlaufende Jury-Koordination",
        desc: "Briefings, Erinnerungen, Deadlines — alles automatisch. Ihre Juroren bewerten, statt Mails zu beantworten.",
        iconNote: "Animation: Automatische Briefings erscheinen",
        icon: "ppa-icon-bell",
      },
      {
        title: "Revisionssichere Dokumentation",
        desc: "Jede Bewertung und Entscheidung wird automatisch protokolliert — nachvollziehbar für Vorstand, Bewerber und Prüfer.",
        iconNote: "Animation: Audit-Trail / Schloss",
        icon: "ppa-icon-db",
      },
    ],
  },
  testimonialHero: {
    quote:
      "Was früher drei Monate Aufwand bedeutete, läuft mit NEWEDGE jetzt automatisch — und die Qualität unserer Entscheidungen ist nachweislich besser geworden.",
    author: "BMP Award — Projektleitung",
  },
  faq: [
    {
      q: "Wie lange dauert die Implementierung eines KI-gestützten Auswahlverfahrens?",
      a: "In der Regel 2–4 Wochen bis zum ersten produktiven Bewerbungszyklus. Datenmigration und Team-Training sind inklusive.",
    },
    {
      q: "Können wir unser bestehendes Bewertungssystem in die Software übernehmen?",
      a: "Ja. NEWEDGE baut auf Ihren bestehenden Kriterien auf und macht sie im System direkt anwendbar. Sie behalten die volle Kontrolle über die Bewertungslogik.",
    },
    {
      q: "Wie funktioniert Jury-Anonymität bei digitalen Auswahlverfahren?",
      a: "Jury-Bewertungen können vollständig anonymisiert werden. Einzelne Scores sind nur für definierte Rollen sichtbar — die Aggregation für alle.",
    },
    {
      q: "Wo werden Bewerberdaten nach dem Auswahlzyklus gespeichert?",
      a: "Alle Daten verbleiben in Ihrer Infrastruktur. NEWEDGE kann lokal oder in Ihrer Cloud gehostet werden — volle Datensouveränität garantiert.",
    },
  ],
  closingCta: {
    h2Line1: "Ihr nächster Award-Zyklus",
    h2Line2Highlighted: "läuft fast von selbst.",
    sub: "Buchen Sie eine Demo — wir zeigen Ihnen an Ihrem echten Verfahren, was sich ab Tag eins automatisieren lässt.",
    ctaPrimary: "Demo buchen",
    ctaSecondary: "Case: BMP Award ansehen",
  },
};


/* ──────────────────────────────────────────────────────────────
   PAIN POINT C — Dokumente & Prozesse (Document Operations)
   Konfiguration: Import / Export. "Compliance" ist hier Anwendungsfall,
   keine eigene Kategorie — nicht als Oberbegriff der Seite verwenden.
────────────────────────────────────────────────────────────── */
const compliance: PainPointContent = {
  slug: "compliance",
  seo: {
    title: "Außenhandel & Compliance automatisieren mit KI | NEWEDGE",
    description:
      "NEWEDGE automatisiert Ihre Außenhandelsdokumente, Sendungstracking und Compliance-Prüfung gegen EU-, UN- und OFAC-Sanktionslisten — bevor die Ware rollt.",
    canonical: "/loesungen/compliance",
  },
  hero: {
    overlabel: "DOKUMENTE & PROZESSE · KONFIGURIERT FÜR IMPORT / EXPORT",
    h1Line1: "Außenhandel ohne",
    h1Line2Highlighted: "Dokumentenchaos.",
    sub:
      "So automatisieren wir Dokumente und Prozesse. Dokumente in fünf Sprachen, Spediteur per Mail, Zollagent per Telefon, Compliance in Excel. NEWEDGE automatisiert Ihre gesamte Außenhandelsdokumentation — von der Erfassung bis zur revisionssicheren Compliance-Prüfung.",
    ctaPrimary: "KI-Audit anfragen",
    ctaSecondary: "Demo ansehen",
    imageNote: "Dokument-Flow: Verschiedene Handels- und Zolldokumente → KI-Engine → strukturierter Sendungsstatus.",
    imageAlt: "KI automatisiert Handelsdokumente, Sendungstracking und Compliance-Prüfung",
    image: "pain-point-compliance-hero",
  },
  trustBar: {
    headline: "Vertraut von Importeuren und Exporteuren in der DACH-Region",
    sub: "Reale Ergebnisse aus Außenhandelsprozessen wie Ihrem",
    logos: ["Importeur", "Exporteur", "Spedition", "Großhandel", "Industrie", "Handel", "Logistik"],
  },
  definition: {
    title: "Was ist KI-gestützte Außenhandelsautomatisierung?",
    body:
      "Dokumente und Prozesse folgen in jedem Unternehmen demselben Muster: erfassen, prüfen, dokumentieren. NEWEDGE standardisiert diese Funktion einmal und konfiguriert sie für den fachlichen Kontext des Kunden — auf dieser Seite für Import und Export. Denn Außenhandel im Mittelstand läuft fragmentiert: Dokumente in fünf Sprachen, Spediteur per Mail, Zollagent per Telefon, Compliance in Excel. Dazu erdrückt Sie eine Flut an Regulierungen — von CBAM über das Lieferkettengesetz bis zu ständig wechselnden Sanktionsvorschriften. Und Fehler sind teuer: Verstöße gegen das Außenwirtschaftsgesetz kosten bis zu 500.000€ Bußgeld pro Vorfall — mit der AWG-Novelle 2026 drohen Verbandsgeldbußen bis zu 40 Mio.€. KI-gestützte Außenhandelsautomatisierung erfasst jedes Dokument, hält jeden Sendungsstatus zentral nach und prüft Compliance automatisch — bevor die Ware rollt.",
  },
  feature1: {
    h2: "Kein Dokument geht mehr unter — egal in welcher Sprache.",
    h3: "Von der Handelsrechnung bis zum Ursprungszeugnis — mehrsprachig, automatisch, in Sekunden verarbeitet.",
    sub:
      "Handelsrechnung auf Englisch, Packliste auf Chinesisch, Zollanmeldung auf Deutsch. NEWEDGE erfasst jedes Dokument automatisch, ordnet es der richtigen Sendung zu und prüft auf Vollständigkeit und Widersprüche. Unstimmigkeiten eskaliert das System sofort — nicht erst, wenn der Container am Hafen steht.",
    bullets: [
      "Automatische Erfassung aller Handels- und Zolldokumente",
      "Sprachunabhängige Erkennung und Zuordnung",
      "Sofort-Eskalation bei Lücken, Fehlern oder Widersprüchen",
    ],
    imageNote: "Scan-Animation: Mehrsprachige Dokumente → KI-Extraktion → strukturierte Sendungszuordnung.",
    imageAlt: "KI-gestützte Dokumentenerfassung: mehrsprachig, alle Formate, automatisch",
    image: "pain-point-compliance-feature1",
  },
  feature2: {
    h2: "Ein Dashboard statt zehn Excel-Tabellen.",
    h3: "Spediteur, Zoll, Lager, Lieferant — alle auf demselben Stand, ohne Hinterhertelefonieren.",
    sub:
      "Wo steht die Sendung? Hat der Spediteur die Dokumente? Ist die Zollanmeldung durch? Wer diese Fragen heute klären will, telefoniert, mailt und scrollt durch Tabellen. NEWEDGE zentralisiert den gesamten Sendungsstatus — Spediteur, Zollagent, Lager, Lieferant — in einem Echtzeit-Dashboard. Alle Beteiligten sehen denselben Stand, automatisch aktualisiert.",
    bullets: [
      "Echtzeit-Sendungstracking über alle Beteiligten",
      "Automatische Statusupdates an Spediteur, Zoll & internes Team",
      "Eine Plattform statt fragmentierter Kommunikation",
    ],
    imageNote: "Dashboard-Mockup: Sendungsstatus aller Beteiligten in einer Echtzeit-Ansicht.",
    imageAlt: "Echtzeit-Sendungs-Dashboard: alle Beteiligten, ein Status, automatisch aktualisiert",
    image: "pain-point-compliance-feature2",
  },
  feature3: {
    h2: "Compliance gesichert. Zollkosten gesenkt.",
    h3: "Sanktionslisten, Dual-Use, Präferenzen — geprüft und optimiert, bevor die Ware rollt.",
    sub:
      "Sanktionslisten ändern sich monatlich. Dual-Use-Verordnungen variieren je Zielland. Übersehene Präferenzabkommen kosten bares Geld. NEWEDGE prüft jeden Vorgang automatisch gegen EU-, UN- und OFAC-Listen, klassifiziert Dual-Use-Güter und erkennt anwendbare Freihandelsabkommen. Das schützt vor Verstößen — bis zu 500.000€ Bußgeld, bei schweren Embargoverstößen bis zu 15 Jahre Freiheitsstrafe — und findet zugleich die günstigste legale Tarifierung.",
    bullets: [
      "Echtzeit-Prüfung gegen Sanktionslisten, Embargos & Dual-Use",
      "Automatische Präferenzprüfung und Zollkostenoptimierung",
      "Revisionssichere Dokumentation für Betriebsprüfung & BAFA",
    ],
    imageNote: "Compliance-Check: Vorgang → automatische Prüfung → Freigabe oder Eskalation.",
    imageAlt: "Automatische Compliance-Prüfung gegen Sanktionslisten mit Zollkostenoptimierung",
    image: "pain-point-compliance-feature3",
  },
  integrations: {
    h2: "Verbindet sich mit den Tools, die Sie bereits nutzen",
    h3: "SAP, ATLAS, Oracle, Dynamics, BEX, Descartes, CargoWise — direkt angebunden.",
    sub: "SAP, ATLAS, Oracle, Microsoft Dynamics, BEX, Descartes, CargoWise — NEWEDGE integriert sich in Ihre bestehende Zoll-, ERP- und Logistikinfrastruktur. Kein Systemwechsel, kein Parallelbetrieb: Das System dockt an und prüft im Hintergrund, ohne Ihren Ablauf zu verändern.",
    logos: [LOGO.sap, LOGO.datev, LOGO.docusign, LOGO.outlook, LOGO.sharepoint, LOGO.lexoffice, LOGO.salesforce, LOGO.zapier, LOGO.make],
  },
  compare: {
    h2: "NEWEDGE vs. manueller Außenhandelsprozess",
    h3: "Wo manuelle Prozesse Zeit, Geld und Rechtssicherheit kosten — und was KI konkret übernimmt.",
    altLabel: "Manuell",
    rows: [
      { k: "Dokumentenerfassung",    ne: "Automatisch, alle Sprachen & Formate", alt: "Manuell, fehleranfällig" },
      { k: "Sendungstransparenz",    ne: "Echtzeit-Dashboard, alle Beteiligten",  alt: "Telefon, Mail, Excel" },
      { k: "Compliance-Prüfung",     ne: "Echtzeit gegen EU, UN, OFAC",          alt: "Stichproben, oft veraltet" },
      { k: "Zollkostenoptimierung",  ne: "Präferenzen automatisch erkannt",       alt: "Häufig übersehen" },
      { k: "Audit-Trail",            ne: "Vollständig, revisionssicher",          alt: "Fragmentiert, lückenhaft" },
      { k: "Risiko bei Verstoß",     ne: "Minimiert",                             alt: "Bis zu 500.000€ Bußgeld (AWG)" },
    ],
  },
  featureCards: {
    h2: "Erfasst, synchronisiert, abgesichert — ohne Ihr Zutun.",
    h3: "Drei Bausteine desselben Systems — einzeln aktivierbar oder zusammen.",
    cards: [
      {
        title: "Dokumenten-Automatisierung",
        desc: "Alle Formate, alle Sprachen — automatisch erfasst, zugeordnet, validiert. Bevor die Ware das Lager verlässt.",
        iconNote: "Animation: Mehrsprachige Dokumente werden gescannt und zugeordnet",
        icon: "ppc-icon-scan",
      },
      {
        title: "Echtzeit-Transparenz",
        desc: "Spediteur, Zoll, Lager, Lieferant — ein Dashboard, ein Status, automatisch synchronisiert.",
        iconNote: "Animation: Sendungsstatus aller Beteiligten in Echtzeit",
        icon: "ppc-icon-globe",
      },
      {
        title: "Compliance & Kostenoptimierung",
        desc: "Sanktionen geprüft. Dual-Use klassifiziert. Präferenzen genutzt. Absicherung und Ersparnis in einem.",
        iconNote: "Animation: Compliance-Check mit Präferenzprüfung",
        icon: "ppc-icon-shield",
      },
    ],
  },
  testimonialHero: {
    quote:
      "Wir exportieren in 23 Länder — früher war jede Sendung ein Blindflug. Seit NEWEDGE sehen wir in Echtzeit, wo jedes Dokument steht, die Compliance läuft automatisch und wir sparen im Schnitt 14% Zollkosten durch Präferenzen, die wir vorher übersehen haben.",
    author: "Maschinenbau DACH — Head of Export & Logistics",
  },
  faq: [
    {
      q: "Welche Sanktionslisten und Regularien prüft das System automatisch?",
      a: "Das System prüft in Echtzeit gegen EU-, UN- und OFAC-Sanktionslisten, klassifiziert Dual-Use-Güter gemäß EG-Dual-Use-Verordnung und erkennt anwendbare Freihandelsabkommen für die Präferenzprüfung — automatisch bei jedem Vorgang.",
    },
    {
      q: "Wie hoch sind die Risiken bei manuellen Compliance-Prozessen?",
      a: "Verstöße gegen das Außenwirtschaftsgesetz (AWG) können Bußgelder bis zu 500.000€ pro Vorfall nach sich ziehen. Mit der AWG-Novelle 2026 drohen Verbandsgeldbußen bis zu 40 Mio.€. Bei schwerwiegenden Embargoverstößen sind nach §17/18 AWG sogar Freiheitsstrafen bis zu 15 Jahren möglich.",
    },
    {
      q: "Kann das System in unsere bestehende ERP- und Zollsoftware integriert werden?",
      a: "Ja. NEWEDGE verfügt über vorkonfigurierte Konnektoren für SAP, ATLAS, Oracle, Microsoft Dynamics, BEX, Descartes und CargoWise. Kein Systemwechsel, kein Parallelbetrieb — das System dockt an und läuft im Hintergrund.",
    },
    {
      q: "Wie lange dauert die Implementierung?",
      a: "Typisch 4–6 Wochen: Woche 1–2 Systemanbindung und Dokumenten-Training, Woche 3–4 Pilotbetrieb mit realen Sendungen, Woche 5–6 Go-live. Der gesamte Prozess läuft ohne Unterbrechung des laufenden Betriebs.",
    },
    {
      q: "Werden Änderungen in Sanktionslisten und Zolltarifen automatisch berücksichtigt?",
      a: "Ja. Das System wird kontinuierlich aktualisiert — Änderungen fließen automatisch in alle laufenden Prüfprozesse ein. Ihr Team muss nichts manuell nachpflegen.",
    },
  ],
  closingCta: {
    h2Line1: "Jeder Verstoß, den Sie nicht verhindern,",
    h2Line2Highlighted: "kostet mehr als NEWEDGE für ein ganzes Jahr.",
    sub: "In einem kostenlosen KI-Audit zeigen wir, wo Ihre Außenhandelsprozesse Zeit und Rechtssicherheit verlieren.",
    ctaPrimary: "KI-Audit anfragen",
    ctaSecondary: "Demo ansehen",
  },
};

/* ──────────────────────────────────────────────────────────────
   PAIN POINT D — KPI Dashboard
────────────────────────────────────────────────────────────── */
const kpiDashboard: PainPointContent = {
  slug: "kpi-dashboard",
  seo: {
    title: "KPI-Dashboard in Echtzeit für den Mittelstand | NEWEDGE",
    description:
      "Alle Kennzahlen in einem Echtzeit-Cockpit: ERP, CRM und Finance verbunden — ohne IT-Projekt. Rollenspezifische Ansichten und Alerts, live in unter einer Woche.",
    canonical: "/loesungen/kpi-dashboard",
  },
  hero: {
    overlabel: "FÜR MITTELSTAND-GESCHÄFTSFÜHRER",
    h1Line1: "Ihr Dashboard zeigt Ihnen, was gestern war.",
    h1Line2Highlighted: "Nicht was gerade passiert.",
    sub:
      "So automatisieren wir Steuerung und Reporting. Entscheidungen auf Zahlen von letzter Woche zu treffen, kostet Sie Reaktionszeit, die Sie nicht haben. NEWEDGE verbindet ERP, CRM und Finance zu einem Echtzeit-Cockpit — individuell konfiguriert, live in unter einer Woche. Kein neues System. Keine IT-Projekte.",
    ctaPrimary: "20 Minuten Call — kostenlos buchen",
    ctaSecondary: "Beispiel-Dashboard ansehen",
    imageNote:
      "Vollständiges Dashboard-Mockup: Umsatz-Chart, Pipeline-KPIs, Finance-Übersicht und Alert-Feed. Lila Akzente, Echtzeit-Puls-Animation.",
    imageAlt: "Echtzeit-KPI-Dashboard: ERP, CRM und Finance in einem zentralen Cockpit",
    image: "pain-point-kpi-dashboard-hero",
  },
  trustBar: {
    headline: "Vertraut von Mittelständlern und Konzernen im DACH-Raum",
    sub: "Reale Ergebnisse aus Reporting-Prozessen wie Ihrem",
    logos: ["Mittelstand", "Industrie", "Konzern", "Handel", "Dienstleister", "Beratung", "Produktion"],
  },
  definition: {
    title: "Was ist ein KPI-Dashboard?",
    body:
      "Ein KPI-Dashboard zeigt alle geschäftskritischen Kennzahlen in einer zentralen Ansicht — aggregiert aus ERP, CRM und Finance-Tool, aktualisiert in Echtzeit, ohne manuelle Eingabe. Mittelständler mit 20–500 Mitarbeitern treffen damit Entscheidungen auf aktueller Datenbasis statt im wöchentlichen Reporting-Meeting. Der Hebel ist messbar: Führungskräfte im Mittelstand verbringen im Schnitt 4,5 Stunden pro Woche mit manuellem Reporting. Mit einem Echtzeit-Dashboard erkennen Sie kritische Abweichungen Tage früher — nicht erst im nächsten Wochenmeeting.",
  },
  feature1: {
    h2: "Wer hat Ihnen gesagt, dass diese KPIs wichtig sind?",
    h3: "Angepasste KPIs statt generischer Templates",
    sub:
      "Generische Templates zeigen, was technisch möglich ist — nicht, was Ihr Unternehmen steuert. NEWEDGE definiert mit Ihrer Führungsebene die Kennzahlen, die für Betrieb, Wachstum und Steuerung tatsächlich zählen. Jede Rolle — GF, Teamleitung, Controlling — sieht genau das, was sie braucht.",
    bullets: [
      "KPIs für Betrieb und Wachstum — individuell konfiguriert, kein generisches Template",
      "Alle relevanten Datenquellen verbunden — kein manueller Import, kein CSV-Export",
      "Rollenspezifische Ansichten für GF, Management und Controlling",
      "Neue KPIs messbar machen: eingesparte Stunden, automatisierte Prozesse, Fehlerquoten",
    ],
    imageNote: "Dashboard-Mockup mit individuellen KPI-Kategorien und rollenspezifischen Ansichten.",
    imageAlt: "Individuell konfiguriertes KPI-Dashboard mit rollenspezifischen Ansichten",
    image: "pain-point-kpi-dashboard-feature1",
  },
  feature2: {
    h2: "Sie erfahren es immer eine Woche zu spät.",
    h3: "Echtzeit-Daten: KPI-Abweichungen erkennen, bevor sie Geld kosten",
    sub:
      "Bei manuellem Reporting vergehen zwischen Abweichung und Entdeckung im Schnitt 3–7 Tage. Ein Echtzeit-KPI-Dashboard schließt dieses Fenster auf Minuten: Sobald neue Daten vorliegen, aktualisiert sich das Dashboard automatisch — und meldet Abweichungen sofort per Alert.",
    bullets: [
      "Automatische Datenaktualisierung — keine manuelle Eingabe, kein Verzug",
      "Visualisierungen nach Ebene — strategisch für GF, operativ für Teams",
      "Schwellenwert-Alerts direkt an die zuständige Person — per E-Mail, Slack oder Teams",
      "Eine Datenbasis für alle Abteilungen — keine parallelen Wahrheiten mehr",
    ],
    imageNote: "Alert-Feed und Schwellenwert-Konfiguration im Dashboard-Mockup.",
    imageAlt: "Echtzeit-Alerts bei KPI-Abweichungen — sofort per E-Mail, Slack oder Teams",
    image: "pain-point-kpi-dashboard-feature2",
  },
  feature3: {
    h2: "Messen reicht nicht. Was jetzt?",
    h3: "KI-gestützte KPI-Analyse: nicht nur messen, sondern verbessern",
    sub:
      "Ist-Werte allein ändern nichts. Das NEWEDGE KPI-Dashboard erkennt Muster, macht aus Kennzahlen priorisierte Maßnahmen — und misst automatisch, ob sie wirken.",
    bullets: [
      "KI-Empfehlungen für konkrete Verbesserungsmaßnahmen — mit Priorität",
      "Automatisches Wirksamkeits-Tracking: Maßnahme gestartet — Effekt gemessen",
      "Integration in bestehende Workflows — kein Systemwechsel nötig",
      "Regelmäßige Review-Termine mit dokumentierten nächsten Schritten",
    ],
    imageNote: "KI-Empfehlungen-Panel mit priorisierten Maßnahmen und Wirksamkeits-Tracking.",
    imageAlt: "KI-gestützte Analyse: priorisierte Handlungsempfehlungen aus KPI-Daten",
    image: "pain-point-kpi-dashboard-feature3",
  },
  integrations: {
    h2: "Sie wechseln kein einziges System.",
    h3: "Welche Systeme lassen sich an ein KPI-Dashboard anbinden?",
    sub:
      "NEWEDGE verbindet sich per API mit über 200 Systemen — ERP, CRM, Finance, Cloud und Shop-Plattformen. Kein Systemwechsel, keine Datenmigration, keine Doppelpflege. Ihr System nicht dabei? REST API und Webhooks binden jede strukturierte Datenquelle an.",
    logos: [LOGO.sap, LOGO.salesforce, LOGO.hubspot, LOGO.googleAnalytics, LOGO.datev, LOGO.shopify, LOGO.stripe, LOGO.zapier, LOGO.make],
  },
  compare: {
    h2: "Wie lange machen Sie das noch mit Excel?",
    h3: "KPI-Dashboard vs. manuelles Reporting — der direkte Vergleich",
    altLabel: "Manuelles Reporting",
    rows: [
      { k: "Datenaktualität",              ne: "Echtzeit",                       alt: "3–7 Tage alt" },
      { k: "Aufwand pro Woche",            ne: "< 30 Minuten",                   alt: "4–6 Stunden" },
      { k: "Frühwarnung bei Abweichungen", ne: "Sofort per Alert",               alt: "Nächste Woche" },
      { k: "Konsistenz der Datenbasis",    ne: "Eine Quelle für alle",           alt: "Unterschiedlich je Team" },
      { k: "Aufwand bei Wachstum",         ne: "Bleibt konstant",                alt: "Wächst mit der Unternehmensgröße" },
      { k: "Rollenspezifische Ansichten",  ne: "Automatisch konfiguriert",       alt: "Manuell aufgebaut" },
      { k: "KI-Empfehlungen",              ne: "Automatisch, mit Priorität",     alt: "Nicht vorhanden" },
      { k: "Setup-Aufwand",                ne: "Einmalig, < 1 Woche",            alt: "Laufend" },
    ],
  },
  featureCards: {
    h2: "Was sich tatsächlich ändert — nach Woche eins.",
    h3: "Was bringt ein Echtzeit-KPI-Dashboard konkret?",
    cards: [
      {
        title: "Keine veralteten Zahlen mehr",
        desc: "Alle KPIs aktualisieren sich automatisch, sobald neue Daten vorliegen. Kein Zusammenkopieren, kein Warten auf den Wochenbericht.",
        iconNote: "Icon: Echtzeit-Puls / Live-Indikator",
      },
      {
        title: "Frühwarnung statt Überraschungen",
        desc: "Sie definieren Schwellenwerte — das Dashboard meldet sich von selbst. Mit automatischen Warnungen reagieren Sie deutlich schneller, wenn eine Kennzahl aus dem Ruder läuft.",
        iconNote: "Icon: Alert-Glocke / Frühwarnsystem",
      },
      {
        title: "Jede Rolle sieht, was sie braucht",
        desc: "Rollenbasierte Ansichten zeigen jedem Nutzer genau die Kennzahlen, die er für Entscheidungen braucht — nicht mehr.",
        iconNote: "Icon: Nutzerrollen / Personas",
      },
      {
        title: "KI zeigt, was sich lohnt zu ändern",
        desc: "Das System erkennt Muster in Ihren Daten — saisonale Anomalien, Kostenausreißer, Effizienzlücken — und gibt Empfehlungen mit Priorität aus.",
        iconNote: "Icon: KI-Glühbirne / Empfehlungen",
      },
      {
        title: "Setup in unter einer Woche",
        desc: "NEWEDGE übernimmt die gesamte Konfiguration — von der API-Anbindung bis zur rollenspezifischen Ansicht. Die Team-Einführung dauert 60 Minuten. Standard-Setups sind in 3–5 Werktagen live.",
        iconNote: "Icon: Kalender / Schnell-Setup",
      },
      {
        title: "Eine Datenbasis für alle",
        desc: "Finance hat andere Zahlen als Vertrieb? Damit ist Schluss. Alle Abteilungen greifen auf dieselbe, automatisch synchronisierte Datenquelle zu. Diskussionen über Datenqualität entfallen.",
        iconNote: "Icon: Vereinte Datenbank / Single Source of Truth",
      },
    ],
  },
  testimonialHero: {
    quote:
      "Wir haben montags immer 90 Minuten damit verbracht, Zahlen zusammenzutragen. Jetzt schaue ich morgens kurz ins Dashboard — und weiß mehr als vorher nach dem halben Vormittag.",
    author: "Geschäftsführer — Mittelstandsunternehmen, Deutschland",
  },
  faq: [
    {
      q: "Was ist der Unterschied zwischen einem KPI-Dashboard und Power BI oder Tableau?",
      a: "Power BI und Tableau sind allgemeine BI-Tools und brauchen technisches Know-how für Aufbau und Pflege. Das NEWEDGE KPI-Dashboard kommt fertig konfiguriert, zugeschnitten und laufend betreut — ohne BI-Expertise, ohne IT-Projekt, ohne Lizenzkosten pro Nutzer.",
    },
    {
      q: "Welche Systeme können an ein KPI-Dashboard angebunden werden?",
      a: "Ein professionelles KPI-Dashboard verbindet sich per API mit ERP-Systemen (SAP, Navision, Lexware), CRM-Systemen (Salesforce, HubSpot, Pipedrive), Finance-Tools (DATEV, Agenda), Cloud-Diensten (Microsoft 365, Google Workspace) und Shop-Systemen (Shopify, Shopware). NEWEDGE unterstützt über 200 Systeme ohne Datenmigration.",
    },
    {
      q: "Wie lange dauert die Einrichtung eines KPI-Dashboards?",
      a: "Standard-Konfigurationen mit zwei bis drei Datenquellen sind in 3–5 Werktagen live. Setups mit Custom-KPIs und mehreren Standorten dauern 2–4 Wochen. Fester Ansprechpartner während des gesamten Setups.",
    },
    {
      q: "Kann jede Rolle eigene KPI-Ansichten bekommen?",
      a: "Ja — rollenbasierte Ansichten sind Standard ohne Aufpreis. Geschäftsführung sieht strategische KPIs, Teamleitungen operative Zahlen, Controlling alle Rohdaten mit Drill-Downs. Zugriffsrechte werden granular pro Nutzer vergeben.",
    },
    {
      q: "Was kostet ein Echtzeit-KPI-Dashboard?",
      a: "Die Kosten hängen von Datenquellen, Nutzerzahl und Konfigurationsumfang ab. Nach dem kostenlosen Setup-Gespräch gibt es ein individuelles Angebot — ohne versteckte Lizenzkosten pro Nutzer.",
    },
    {
      q: "Wer betreut das Dashboard nach dem Go-live?",
      a: "NEWEDGE übernimmt laufende Wartung, Updates und Anpassungen. Ein fester Ansprechpartner — kein Ticket-System.",
    },
    {
      q: "Wie unterscheidet sich ein KPI-Dashboard für den Mittelstand von Konzern-BI-Lösungen?",
      a: "Konzern-BI-Lösungen wie SAP Analytics Cloud oder Microsoft Fabric sind auf große IT-Abteilungen ausgelegt. Das NEWEDGE KPI-Dashboard ist für den Mittelstand: Setup unter einer Woche, fixer Monatsbetrag, kein eigenes BI-Team nötig.",
    },
  ],
  closingCta: {
    h2Line1: "30 Minuten. Dann wissen Sie,",
    h2Line2Highlighted: "ob es passt.",
    sub: "Kein Vertrag. Kein IT-Projekt. Setup inklusive laufender Betreuung.",
    ctaPrimary: "Demo buchen",
    ctaSecondary: "Beispiel-Dashboard ansehen",
  },
};

/* ──────────────────────────────────────────────────────────────
   PAIN POINT E — KI-Kundensupport
────────────────────────────────────────────────────────────── */
const kiKundensupport: PainPointContent = {
  slug: "ki-kundensupport",
  seo: {
    title: "KI-Kundensupport: 80% gelöst in Sekunden | NEWEDGE München",
    description:
      "Der KI-Agent löst 80% aller Support-Anfragen in unter 30 Sekunden — Kosten je Anfrage von 12€ auf unter 1€. Komplexe Fälle mit vollem Kontext weitergeleitet.",
    canonical: "/loesungen/ki-kundensupport",
  },
  hero: {
    overlabel: "KI-AUTOMATISIERUNG FÜR KUNDENSUPPORT",
    h1Line1: "80% der Anfragen gelöst.",
    h1Line2Highlighted: "Sofort. Automatisch.",
    sub:
      "So automatisieren wir Service und Fallbearbeitung. Support skaliert nicht mit Ihrem Wachstum — Personal auch nicht. NEWEDGE baut Ihren kompletten Support-Funnel: KI löst 80% aller Anfragen in unter 30 Sekunden, der Rest landet mit vollem Kontext beim richtigen Menschen. Die Kosten pro Anfrage sinken von 12€ auf unter 1€. Rund um die Uhr, in Ihrer Markenstimme.",
    ctaPrimary: "Support-Audit anfragen",
    ctaSecondary: "KI-Agenten testen",
    imageNote:
      "Chat-Interface: Anfrage → KI antwortet (2 Sek) → 'Gelöst' | komplexe Anfrage → Routing mit Kontext-Badge.",
    imageAlt: "KI-Support-Agent löst Anfragen in unter 30 Sekunden mit intelligentem Routing",
    image: "pain-point-kundensupport-hero",
  },
  trustBar: {
    headline: "Vertraut von Support-Teams in DACH",
    sub: "Reale Ergebnisse aus Support-Funnels wie Ihrem",
    logos: ["E-Commerce", "SaaS", "Service", "Plattform", "Hersteller", "Marketplace", "Dienstleister"],
  },
  definition: {
    title: "Was ist ein KI-gestützter Kundensupport-Funnel?",
    body:
      "Ein KI-gestützter Kundensupport-Funnel löst einfache Anfragen automatisch (bis zu 80% aller Tickets) und leitet komplexe Fälle mit vollständigem Kontext an menschliche Agenten weiter. Die Kosten pro Support-Anfrage sinken damit von durchschnittlich 12€ auf unter 1€ — bei gleichzeitig höherer Kundenzufriedenheit.",
  },
  feature1: {
    h2: "80% gelöst. Sofort. Ohne menschliche Intervention.",
    h3: "KI-Support-Agent: Standard-Anfragen automatisch lösen, rund um die Uhr",
    sub:
      "Bestellstatus, Rücksendungen, FAQ, Standard-Reklamationen — das sind 80% aller Anfragen. NEWEDGE löst sie automatisch, in unter 30 Sekunden, in Ihrer Markenstimme. Ihr Team bekommt nur noch die 20%, die wirklich menschliche Expertise brauchen.",
    bullets: [
      "Antwortzeit unter 30 Sekunden — rund um die Uhr",
      "Trainiert auf Ihre Markensprache und Wissensbasis",
      "Lernt kontinuierlich aus jeder Interaktion",
    ],
    imageNote: "Chat-Mockup: Anfrage → KI-Antwort in 2 Sekunden → 'Gelöst'.",
    imageAlt: "KI-Support-Agent beantwortet Standard-Anfragen in Sekunden",
    image: "pain-point-kundensupport-feature1",
  },
  feature2: {
    h2: "Komplexe Fälle — mit vollem Kontext weitergeleitet.",
    h3: "Intelligentes Routing: der Mensch übernimmt — vollständig informiert",
    sub:
      "Wenn der KI-Agent übergibt, liefert er dem Agenten den kompletten Gesprächsverlauf, die Kundenhistorie und eine Einschätzung der Dringlichkeit. Keine Wiederholungen für den Kunden. Kein Informationsverlust. Unzufriedene Kunden werden automatisch priorisiert.",
    bullets: [
      "Intelligentes Routing — zum richtigen Agenten",
      "Vollständiger Kontext — keine Wiederholungen",
      "Sentiment-Erkennung — unzufriedene Kunden werden priorisiert",
    ],
    imageNote: "Übergabe vom KI-Agent an menschlichen Agenten mit Kontext-Badge.",
    imageAlt: "Intelligentes Routing komplexer Fälle mit vollständigem Gesprächskontext",
    image: "pain-point-kundensupport-feature2",
  },
  feature3: {
    h2: "Support als Produktintelligenz.",
    h3: "Jede Anfrage ist ein Signal: Support-Daten als strategische Ressource",
    sub:
      "Jede Support-Anfrage ist ein Signal. NEWEDGE analysiert automatisch, welche Probleme sich häufen — und was das über Ihr Produkt aussagt. Unternehmen, die Support-Daten systematisch auswerten, reduzieren wiederkehrende Fehler um durchschnittlich 40% innerhalb eines Quartals.",
    bullets: [
      "Automatische Trend-Analyse — welche Probleme häufen sich",
      "Direkte Produkt-Insights aus Support-Daten",
      "Automatisiertes Kundenzufriedenheits-Tracking",
    ],
    imageNote: "Heatmap der häufigsten Probleme + CSAT-Trendline.",
    imageAlt: "Support-Daten als Produkt-Intelligence mit Trend-Analyse und CSAT-Tracking",
    image: "pain-point-kundensupport-feature3",
  },
  integrations: {
    h2: "Verbindet sich mit Ihrer Support-Software",
    h3: "Welche Support-Software lässt sich mit dem KI-Agenten verbinden?",
    sub: "Native Integrationen für Zendesk, Freshdesk, Intercom — sowie API-Anbindung für weitere Systeme.",
    logos: [LOGO.zendesk, LOGO.intercom, LOGO.freshdesk, LOGO.hubspot, LOGO.salesforce, LOGO.teams, LOGO.outlook, LOGO.instagram, LOGO.zapier],
  },
  compare: {
    h2: "NEWEDGE KI-Support vs. klassisches Support-Team",
    h3: "KI-Support vs. klassisches Team — der Kostenvergleich",
    altLabel: "Klassisch",
    rows: [
      { k: "Verfügbarkeit", ne: "24/7", alt: "Bürozeiten" },
      { k: "Reaktionszeit", ne: "Unter 30 Sekunden", alt: "Stunden bis Tage" },
      { k: "Kapazität", ne: "Unbegrenzt", alt: "Begrenzt durch Team-Größe" },
      { k: "Konsistenz", ne: "Immer gleiche Qualität", alt: "Abhängig von Agent + Tagesform" },
      { k: "Kosten pro Ticket", ne: "Unter 1€", alt: "Ø 12€" },
      { k: "Produkt-Insights", ne: "Automatisch generiert", alt: "Manuell, selten ausgewertet" },
    ],
  },
  featureCards: {
    h2: "Gelöst, weitergeleitet, ausgewertet — automatisch.",
    h3: "Was ein KI-Kundensupport-Funnel in Ihrem Betrieb leistet",
    cards: [
      {
        title: "KI Support-Agent",
        desc: "Löst 80% aller Anfragen. Sofort. In Ihrer Sprache.",
        iconNote: "Animation: KI antwortet sofort",
        icon: "ppe-icon-speed",
      },
      {
        title: "Intelligentes Routing",
        desc: "Komplexe Fälle mit vollem Kontext an den richtigen Menschen.",
        iconNote: "Animation: Chat → Agent mit Kontext-Badge",
        icon: "ppe-icon-route",
      },
      {
        title: "Support Intelligence",
        desc: "Ihr Support wird zur Produktforschung.",
        iconNote: "Animation: Häufigste Probleme als Heatmap",
        icon: "ppe-icon-analytics",
      },
    ],
  },
  testimonialHero: {
    quote:
      "Wir haben unsere Ticket-Kosten um 87% reduziert und die CSAT-Werte sind gleichzeitig gestiegen. Der KI-Agent klingt wie unser Team — nur eben rund um die Uhr verfügbar.",
    author: "DACH E-Commerce — Head of Customer Service",
  },
  faq: [
    {
      q: "In welchen Sprachen kann der KI-Support-Agent konfiguriert werden?",
      a: "Deutsch, Englisch und alle weiteren gängigen Sprachen — je nach Ihrer Kundenbasis konfigurierbar. Multilingual im selben Interface.",
    },
    {
      q: "Wie wird der KI-Agent auf unsere Produkte und Markenstimme trainiert?",
      a: "Wir trainieren auf Ihre Wissensbasis, FAQs, Tonalität und bisherige Support-Gespräche. Onboarding: 2–3 Wochen bis zum produktiven Einsatz.",
    },
    {
      q: "Was passiert wenn der KI-Kundensupport-Agent eine Anfrage nicht lösen kann?",
      a: "Automatische Übergabe mit vollständigem Gesprächskontext und Priorisierung an Ihr Team. Der Kunde muss sein Anliegen nicht wiederholen.",
    },
    {
      q: "In welche Support-Software kann der KI-Agent integriert werden?",
      a: "Native Integrationen für Zendesk, Freshdesk, HubSpot Service Hub, Intercom — sowie API-Anbindung für weitere Systeme.",
    },
  ],
  closingCta: {
    h2Line1: "Ihr nächster Kunde",
    h2Line2Highlighted: "bekommt eine Antwort in 30 Sekunden.",
    sub: "Rund um die Uhr. In Ihrer Stimme.",
    ctaPrimary: "KI-Agenten testen",
    ctaSecondary: "Support-Audit anfragen",
  },
};

/* ──────────────────────────────────────────────────────────────
   INDUSTRIE 1 — Entscheidungsinstanzen
────────────────────────────────────────────────────────────── */
const entscheidungsinstanzen: PainPointContent = {
  slug: "entscheidungsinstanzen",
  seo: {
    title: "Bewertungssoftware für Jurys, Förder- & Vergabestellen | NEWEDGE",
    description:
      "Revisionssichere Antrags-, Auswahl- und Vergabeverfahren für Förder- und Vergabestellen, Jurys und Hochschulen — DSGVO-konform, VgV/UVgO-tauglich, lokal hostbar.",
    canonical: "/industrien/entscheidungsinstanzen",
  },
  hero: {
    overlabel: "FÜR FÖRDERSTELLEN · AWARDS · HOCHSCHULEN · VERGABESTELLEN",
    h1Line1: "Sie entscheiden über andere.",
    h1Line2Highlighted: "Wer entscheidet für Sie?",
    sub:
      "So verändert eine KI-Abteilung Förder- und Entscheidungsverfahren. Hunderte Anträge und Einreichungen, ein Gremium mit begrenzter Zeit, Richtlinien und Kriterien, die jeder anders auslegt — und am Ende eine Entscheidung, die Sie verteidigen müssen. NEWEDGE gibt Förderstellen, Awards, Hochschulen und Vergabestellen dieselbe Entscheidungsfunktion, konfiguriert für ihr Regelwerk: strukturiert, fair, revisionssicher.",
    ctaPrimary: "Demo buchen",
    ctaSecondary: "Case: BMP Award ansehen",
    imageNote:
      "Visual: Stapel unstrukturierter Einreichungen → strukturiertes Gremien-Cockpit mit Scoring, Audit-Trail und Vergleichbarkeit.",
    imageAlt: "Vorher: Einreichungs-Chaos — Nachher: strukturiertes Entscheidungs-Cockpit",
    image: "pain-point-entscheidungsinstanzen-hero",
  },
  trustBar: {
    headline: "Vertraut von Entscheidungsinstanzen in Deutschland",
    sub: "Awards, Hochschulen, Förderinstitutionen, Vergabestellen, Verbände",
    logos: ["BMP Award", "Hochschule", "Förderinstitution", "Vergabestelle", "Verband"],
  },
  definition: {
    title: "Was ist eine KI-gestützte Bewertungssoftware für Gremien?",
    body:
      "Eine KI-gestützte Bewertungssoftware erfasst Anträge und Einreichungen automatisch, führt das Gremium durch einen einheitlichen Prüf- und Bewertungsprozess und dokumentiert jede Entscheidung revisionssicher. Förderstellen, Vergabestellen, Hochschulen und Award-Organisationen senken so den Aufwand pro Verfahren — und können jede Entscheidung lückenlos begründen, von der ersten Bewertung bis zum Bescheid.",
  },
  feature1: {
    h2: "Gleiche Maßstäbe für jede Einreichung.",
    h3: "Schluss mit „das legt jeder Prüfer anders aus“",
    sub:
      "Zwölf Bewerter, zwölf Maßstäbe — der eine streng, der andere großzügig, jeder nach Bauchgefühl. NEWEDGE legt für alle dieselbe Bewertungslogik fest: gleiche Kriterien, gleiche Gewichtung, gleiche Skala. Das Ergebnis ist vergleichbar, nachvollziehbar — und für jeden Bewerber fair.",
    bullets: [
      "Einheitliche Kriterien & Gewichtung — für alle Einreichungen identisch",
      "Abweichungen sichtbar — wo Juroren stark differieren, fällt es sofort auf",
      "Anonymisierung optional — Bewertung ohne Namen, Herkunft oder Institution",
    ],
    imageNote: "Visual: dieselbe Kriterien-Matrix über mehrere Einreichungen, einheitliche Skala.",
    imageAlt: "Einheitliche Bewertungsmatrix für alle Einreichungen eines Verfahrens",
    image: "pain-point-entscheidungsinstanzen-feature1",
  },
  feature2: {
    h2: "Ihr Gremium bewertet. Den Rest übernehmen wir.",
    h3: "Ihre Experten sollen urteilen — nicht Termine jonglieren",
    sub:
      "Ihre Gutachter und Juroren sind Fachleute, keine Projektmanager. Trotzdem geht ihre Zeit dafür drauf, Unterlagen zu suchen, Fristen nachzuhalten und Bewertungen zusammenzutragen. NEWEDGE erledigt das automatisch — Ihre Experten tun, wofür Sie sie geholt haben: fachlich urteilen.",
    bullets: [
      "Automatische Briefings & Fristen-Erinnerungen für alle Beteiligten",
      "Jedes Mitglied bewertet online, ortsunabhängig, im eigenen Tempo",
      "Alle Bewertungen automatisch zusammengeführt — kein manueller Excel-Merge",
    ],
    imageNote: "Visual: Bewertungsinterface mit individuellen Scores + automatischer Aggregation.",
    imageAlt: "Bewertungsinterface mit Aggregation und Konflikt-Erkennung",
    image: "pain-point-entscheidungsinstanzen-feature2",
  },
  feature3: {
    h2: "Jede Entscheidung hält jeder Prüfung stand.",
    h3: "Revisionssicher dokumentiert — automatisch, vom ersten Tag an",
    sub:
      "Ein abgelehnter Bewerber legt Widerspruch ein. Eine Aufsichtsbehörde fragt nach. Der Rechnungshof prüft. In diesem Moment zählt nur eins: Können Sie lückenlos zeigen, wie und warum entschieden wurde? Mit NEWEDGE ist die Dokumentation schon fertig — jeder Score, jeder Kommentar, jeder Schritt nachvollziehbar gespeichert.",
    bullets: [
      "Vollständiger Audit-Trail — wer, wann, auf welcher Grundlage",
      "VgV- und UVgO-konforme Vergabedokumentation",
      "Begründungen auf Knopfdruck — für Widerspruch, Aufsicht und interne Kontrolle",
    ],
    imageNote: "Visual: Audit-Trail-Timeline einer Entscheidung mit allen Schritten und Bewertungen.",
    imageAlt: "Revisionssichere Entscheidungsdokumentation mit Audit-Trail",
    image: "pain-point-entscheidungsinstanzen-feature3",
  },
  integrations: {
    h2: "Verbindet sich mit den Systemen, die Sie bereits nutzen.",
    h3: "Welche Systeme lassen sich in Entscheidungsverfahren integrieren?",
    sub: "Kein System, das alles ersetzt. NEWEDGE integriert sich in Ihre bestehende Infrastruktur.",
    logos: [LOGO.docusign, LOGO.teams, LOGO.outlook, LOGO.sharepoint, LOGO.googleWorkspace, LOGO.notion, LOGO.calendly, LOGO.zoom, LOGO.personio],
  },
  compare: {
    h2: "NEWEDGE vs. manueller Entscheidungsprozess",
    h3: "Strukturierte Entscheidungsinfrastruktur vs. manueller Prozess — der direkte Vergleich",
    altLabel: "Manuell",
    rows: [
      { k: "Antrags- & Einreichungserfassung", ne: "Strukturiert, automatisch, einheitlich", alt: "PDFs, Mails, verschiedene Formate" },
      { k: "Gremien-Koordination", ne: "Vollautomatisiert", alt: "Endlose E-Mail-Threads" },
      { k: "Bewertungsstandard", ne: "Einheitlich für alle Beteiligten", alt: "Jede Person interpretiert anders" },
      { k: "Entscheidungsdokumentation", ne: "Revisionssicher, automatisch", alt: "Kaum vorhanden oder lückenhaft" },
      { k: "Wissen nach dem Zyklus", ne: "Bleibt dauerhaft erhalten", alt: "Geht jedes Mal verloren" },
      { k: "Widerspruchsfähigkeit", ne: "Vollständiger Audit-Trail", alt: "Schwer rekonstruierbar" },
      { k: "Aufwand pro Verfahren", ne: "Planbar, gleichbleibend", alt: "Wochen manuelle Koordination" },
    ],
  },
  featureCards: {
    h2: "Ihr Gremium urteilt. Den Rest übernehmen wir.",
    h3: "Was NEWEDGE für Ihr Gremium konkret übernimmt",
    cards: [
      {
        title: "Einheitliche Bewertung",
        desc: "Jede Einreichung wird nach denselben Kriterien bewertet — vergleichbar, anonymisierbar und für jeden Bewerber fair.",
        iconNote: "Icon: Dokumente → strukturiertes Datenblatt",
        icon: "i1-icon-erfassung",
      },
      {
        title: "Selbstlaufende Gremien-Koordination",
        desc: "Briefings, Fristen und Bewertungsrunden laufen automatisch. Ihr Gremium urteilt, statt zu verwalten.",
        iconNote: "Icon: Kalender + Personen-Netzwerk",
        icon: "i1-icon-aggreg",
      },
      {
        title: "Revisionssichere Dokumentation",
        desc: "Jeder Schritt ist nachvollziehbar gespeichert — VgV/UVgO-konform und bereit für Widerspruch, Aufsicht und Rechnungshof.",
        iconNote: "Icon: Audit-Trail / Schloss",
        icon: "i1-icon-audit",
      },
    ],
  },
  testimonialHero: {
    quote:
      "Was früher drei Monate Koordination bedeutete, läuft mit NEWEDGE jetzt automatisch — und die Qualität unserer Entscheidungen ist nachweislich besser geworden.",
    author: "Projektleitung — Best Migration Practice Award",
  },
  faq: [
    {
      q: "Wie lange dauert die Einrichtung eines KI-Bewertungssystems?",
      a: "In der Regel 1–2 Wochen — inklusive Import bestehender Kriterienkataloge, Konfiguration der Gewichtungen und Testphase mit echten Bewerbungsunterlagen. Pilotprojekte starten meist innerhalb von 14 Tagen produktiv.",
    },
    {
      q: "Können wir unsere bestehenden Bewertungskriterien übernehmen?",
      a: "Ja. Das System übernimmt vorhandene Kriterienkataloge und Gewichtungsmatrizen vollständig. Sie definieren die Logik — der KI-Agent wendet sie konsistent auf alle Einreichungen an, ohne eigene Interpretationsspielräume. Dasselbe gilt für Förderrichtlinien und Schwellenwerte: Sie definieren das Regelwerk, das System wendet es auf jeden Antrag gleich an.",
    },
    {
      q: "Ist die Bewertung für Bewerber anonym?",
      a: "Anonymisierung ist konfigurierbar. Namen, Institutionen und persönliche Merkmale werden vor der Auswertung maskiert. Das reduziert unbewusste Verzerrungen und stärkt die Akzeptanz der Ergebnisse.",
    },
    {
      q: "Ist das System DSGVO-konform und lokal hostbar?",
      a: "Ja. Das System ist vollständig DSGVO-konform und kann auf lokaler Infrastruktur oder in einer deutschen Private Cloud betrieben werden. Keine Daten verlassen Ihre Umgebung. Für öffentliche Einrichtungen stehen BSI-konforme Betriebsmodelle zur Verfügung.",
    },
    {
      q: "Eignet sich das System auch für staatliche Vergabeverfahren?",
      a: "Ja. Das System unterstützt strukturierte Vergabeprozesse nach VgV und UVgO. Alle Bewertungsschritte werden lückenlos dokumentiert und sind revisionssicher nachvollziehbar — eine Anforderung, die bei öffentlichen Ausschreibungen zwingend gilt.",
    },
  ],
  howTo: {
    name: "KI-Bewertungssystem für Entscheidungsinstanzen einrichten",
    description:
      "In drei Schritten zu einem strukturierten, nachvollziehbaren Auswahlprozess — für Jurys, Hochschulen und Vergabestellen.",
    totalTime: "P14D",
    steps: [
      {
        name: "Kriterien- und Richtlinienkatalog importieren",
        text: "Bestehende Bewertungsmatrizen und Gewichtungslogiken werden direkt übernommen. Keine Neuentwicklung notwendig.",
      },
      {
        name: "Pilotlauf mit Testdaten",
        text: "Der KI-Agent bewertet eine Auswahl historischer Einreichungen. Ergebnisse werden mit manuellen Bewertungen abgeglichen und kalibriert.",
      },
      {
        name: "Produktiver Betrieb & Auditlog",
        text: "Alle Bewertungen laufen dokumentiert durch das System. Jurymitglieder und Gremien erhalten strukturierte Reports, keine Black-Box-Entscheidungen.",
      },
    ],
  },
  closingCta: {
    h2Line1: "Ihre Verantwortung ist groß.",
    h2Line2Highlighted: "Ihr Verwaltungsaufwand muss es nicht sein.",
    sub: "Buchen Sie eine Demo — wir zeigen Ihnen an Ihrem eigenen Verfahren, was sich automatisieren lässt.",
    ctaPrimary: "Demo buchen",
    ctaSecondary: "Case: BMP Award ansehen",
  },
};

/* ──────────────────────────────────────────────────────────────
   INDUSTRIE 2 — Health Care
────────────────────────────────────────────────────────────── */
const localDigitalCommerce: PainPointContent = {
  slug: "health-care",
  seo: {
    title: "Praxismanagement automatisieren für Arztpraxen | NEWEDGE",
    description:
      "NEWEDGE automatisiert Terminplanung und Abrechnung Ihrer Praxis: No-Shows um 25–30% senken, Abrechnungsfehler unter 2%, EHR-Integration in 1–2 Werktagen.",
    canonical: "/industrien/health-care",
  },
  hero: {
    overlabel: "FÜR ARZTPRAXEN · MVZ · THERAPEUTEN",
    h1Line1: "Praxismanagement automatisieren —",
    h1Line2Highlighted: "Terminplanung und Abrechnung auf Autopilot",
    sub:
      "Dieselben standardisierten Funktionen wie in jeder anderen Branche — konfiguriert für den Praxisalltag. Ihre Praxis wächst — aber verpasste Termine und fehlerhafte Abrechnung kosten Sie jeden Monat Umsatz. NEWEDGE automatisiert Terminplanung und Abrechnung vollständig, damit Sie sich auf die Patientenversorgung konzentrieren.",
    ctaPrimary: "Kostenlosen Praxis-Check buchen",
    ctaSecondary: "Demo ansehen",
    imageNote: "Visual: Praxis-Dashboard mit Terminplanung, No-Show-Rate und Abrechnungsstatus.",
    imageAlt: "Automatisiertes Praxismanagement: Terminplanung und Abrechnung in einem Cockpit",
    image: "pain-point-health-care-hero",
  },
  trustBar: {
    headline: "Vertraut von Arztpraxen, MVZ und Therapeuten im DACH-Raum",
    sub: "Arztpraxen, MVZ, Facharztpraxen, Therapeuten",
    logos: ["Arztpraxis", "MVZ", "Facharzt", "Therapeut", "Praxisgemeinschaft"],
  },
  definition: {
    title: "Was ist automatisiertes Praxismanagement für Gesundheitsdienstleister?",
    body:
      "Automatisiertes Praxismanagement ist die regelbasierte Steuerung von Terminplanung, Patientenkommunikation und Abrechnung durch KI-gestützte Systeme — ohne manuelle Eingriffe. Es verbindet bestehende EHR/EMR-Systeme mit automatisierten Erinnerungsabläufen und GKV/PKV-konformer Codierung, reduziert No-Shows um 25–30 % und senkt die Abrechnungsfehlerquote auf unter 2 %.",
  },
  feature1: {
    h2: "Leere Stühle kosten Geld. Jeden Tag.",
    h3: "Terminplanung in Arztpraxen automatisieren — No-Shows systematisch senken",
    sub:
      "Verpasste Termine und kurzfristige Absagen kosten Praxen mit drei oder mehr Behandlern im Schnitt 2.000–4.000 € pro Monat. NEWEDGE reduziert No-Shows um 25–30 % und zeigt Auslastung und Optimierungspotenziale in Echtzeit. Konfiguriert pro Behandler und Leistungsart, per API in Ihr bestehendes EHR/EMR eingebunden.",
    bullets: [
      "Automatische Terminerinnerungen per SMS, E-Mail und Sprachnachricht",
      "Echtzeit-Termintracking und Auslastungsauswertung",
      "Individuelle Planungsvorlagen pro Behandler und Leistungsart",
      "API-Integration in bestehende EHR/EMR-Systeme",
    ],
    imageNote: "Visual: Terminkalender mit automatischen Erinnerungen und No-Show-Rate.",
    imageAlt: "Automatisiertes Terminplanungssystem für Arztpraxen mit No-Show-Reduktion",
    image: "pain-point-health-care-feature1",
  },
  feature2: {
    h2: "Abrechnungsfehler merkt man meistens erst am Jahresende.",
    h3: "Abrechnung in Arztpraxen automatisieren — GKV/PKV-konform, unter 2 % Fehlerquote",
    sub:
      "Krankenkassen-Abrechnungscodes sind komplex, jeder manuelle Schritt erhöht das Fehlerrisiko — und senkt den ausgezahlten Erstattungsbetrag. NEWEDGE automatisiert die Abrechnung von der Leistungserbringung bis zur Zahlung: regelbasiert, konform, ohne Nacharbeit.",
    bullets: [
      "Automatische Codierung und Abrechnung nach Terminart und -dauer",
      "Echtzeit-Leistungsabgleich und Vorab-Autorisierung",
      "Individuelle Abrechnungsregeln pro Kostenträger und Tarif",
      "Vollständiges Reporting zum Abrechnungsstatus und Umsatzzyklus",
    ],
    imageNote: "Visual: Abrechnungs-Dashboard mit Fehlerquote und Abrechnungsstatus.",
    imageAlt: "Automatisierter Abrechnungsprozess mit GKV/PKV-konformer Codierung",
    image: "pain-point-health-care-feature2",
  },
  feature3: {
    h2: "Keine Praxis ist wie die andere. Ihre auch nicht.",
    h3: "Praxismanagement individuell konfigurieren — für Arztpraxis, MVZ und Therapeuten",
    sub:
      "Jede Praxis hat ihren eigenen Mix aus Leistungen, Terminarten und Überweisungsprozessen. Deshalb bauen wir nichts neu, sondern konfigurieren dasselbe System für Ihren fachlichen Kontext: integriert in bestehende Abläufe, wächst mit Ihrer Praxis, ohne Systemwechsel.",
    bullets: [
      "Individuelle Terminarten und -dauern (Einzeltermine, Behandlungen, Erstgespräche, Folgetermine)",
      "Überweisungsmanagement intern und extern, inkl. Kooperation mit anderen Praxen",
      "Konfigurierbar für Ihren Leistungsmix und Ihre Fachrichtungen",
      "Skalierbar bei Praxiswachstum und veränderten Anforderungen",
    ],
    imageNote: "Visual: Konfigurationsübersicht mit Terminarten, Behandlern und Leistungsarten.",
    imageAlt: "Individuell konfiguriertes Praxismanagement für verschiedene Fachrichtungen",
    image: "pain-point-health-care-feature3",
  },
  integrations: {
    h2: "Sie wechseln kein einziges System.",
    h3: "Mit welchen Praxissoftware- und Abrechnungssystemen funktioniert automatisiertes Praxismanagement?",
    sub:
      "NEWEDGE integriert sich per API in gängige EHR/EMR-Systeme, Abrechnungsplattformen und Kommunikationstools — ohne Datenmigration, ohne IT-Projekt, ohne Doppelpflege.",
    logos: [LOGO.calendly, LOGO.outlook, LOGO.googleWorkspace, LOGO.docusign, LOGO.zoom, LOGO.datev, LOGO.personio, LOGO.notion, LOGO.zapier],
  },
  compare: {
    h2: "Wie lange machen Sie das noch per Hand?",
    h3: "Automatisiertes Praxismanagement vs. manueller Betrieb — der direkte Vergleich",
    altLabel: "Manueller Betrieb",
    rows: [
      { k: "No-Show-Rate", ne: "Unter 5 %", alt: "12–18 %" },
      { k: "Abrechnungsfehlerquote", ne: "Unter 2 %", alt: "8–15 %" },
      { k: "Verwaltungsaufwand/Woche", ne: "Unter 45 Minuten", alt: "6–8 Stunden" },
      { k: "Terminerinnerungen", ne: "Automatisch per SMS, E-Mail, Sprache", alt: "Manuell oder nicht vorhanden" },
      { k: "Reaktionszeit bei Absagen", ne: "Sofort — Slot automatisch neu vergeben", alt: "Nächster Arbeitstag" },
      { k: "Abrechnungsstatus", ne: "Echtzeit-Übersicht", alt: "Wöchentlich geprüft" },
      { k: "Compliance-Sicherheit", ne: "Regelbasiert sichergestellt", alt: "Manuell geprüft" },
      { k: "Setup-Aufwand", ne: "Einmalig, unter einer Woche", alt: "Laufend" },
    ],
  },
  featureCards: {
    h2: "Was sich tatsächlich ändert — nach Woche eins.",
    h3: "Was bringt automatisiertes Praxismanagement für Arztpraxen konkret?",
    cards: [
      {
        title: "No-Shows kündigen sich an — Sie reagieren, bevor sie passieren",
        desc: "Das System erinnert Patienten automatisch per SMS, E-Mail oder Sprachnachricht. Absagen gehen früher ein, der Slot wird automatisch neu vergeben. No-Show-Raten sinken um 25–30 % — ohne manuellen Eingriff. (MGMA, 2024)",
        iconNote: "Icon: Kalender + automatische Erinnerung",
      },
      {
        title: "Abrechnung ohne Nacharbeit",
        desc: "Jede erbrachte Leistung wird automatisch dem richtigen Abrechnungscode zugeordnet — nach Terminart, Behandler und Kostenträger. Keine vergessenen Positionen, keine falschen Codes. Fehlerquote unter 2 %. (AMA, 2023)",
        iconNote: "Icon: Abrechnung + Häkchen",
      },
      {
        title: "Jede Rolle sieht, was sie braucht",
        desc: "Praxisleitung sieht Auslastung und Umsatz. Rezeption sieht Tagesplan und offene Slots. Abrechnung sieht Status aller eingereichten Leistungen. Rollenbasierte Ansichten — konfiguriert beim Setup.",
        iconNote: "Icon: Nutzerrollen / Personas",
      },
      {
        title: "Einzelpraxis oder MVZ — gleiche Lösung, andere Konfiguration",
        desc: "Einzelpraxis, MVZ, Facharztpraxis mit mehreren Standorten — NEWEDGE konfiguriert sich entsprechend. Überweisungen, Kooperationen, externe Behandler: alles abgebildet, alles automatisiert.",
        iconNote: "Icon: Praxis-Netzwerk",
      },
      {
        title: "Setup in unter einer Woche — ohne IT-Projekt",
        desc: "NEWEDGE übernimmt die gesamte Konfiguration — von der EHR-Anbindung bis zur rollenspezifischen Ansicht. Team-Einführung: 60 Minuten. Standard-Setups sind in 3–5 Werktagen live.",
        iconNote: "Icon: Kalender / Schnell-Setup",
      },
      {
        title: "Terminbuchung läuft — auch außerhalb der Sprechzeiten",
        desc: "Online-Buchung, automatische Bestätigung, Erinnerung, Nachfass bei Absage. Der gesamte Terminzyklus läuft ohne manuellen Eingriff — auch außerhalb der Sprechzeiten.",
        iconNote: "Icon: Uhr / 24-7",
      },
    ],
  },
  testimonialHero: {
    quote:
      "Wir haben jeden Morgen 45 Minuten damit verbracht, Absagen nachzuverfolgen und Slots neu zu vergeben. Seit der Einführung läuft das automatisch — unsere No-Show-Rate ist von 14 % auf unter 4 % gefallen.",
    author: "Praxisleitung — Arztpraxis, München",
  },
  faq: [
    {
      q: "Was ist automatisiertes Praxismanagement — und was ist es nicht?",
      a: "Automatisiertes Praxismanagement ersetzt manuelle Schritte in Terminplanung und Abrechnung durch regelbasierte, KI-gestützte Prozesse. Kein neues Praxisverwaltungssystem — sondern eine Automatisierung, die sich in Ihr bestehendes EHR/EMR einfügt.",
    },
    {
      q: "Funktioniert das mit unserem bestehenden Praxisverwaltungssystem?",
      a: "Ja. NEWEDGE bindet sich per API in gängige Systeme ein — Medistar, Tomedo, Turbomed, CGM ALBIS und weitere. Keine Datenmigration, kein Systemwechsel. Standardintegrationen sind in 1–2 Werktagen live.",
    },
    {
      q: "Wie lange dauert die Einrichtung des automatisierten Praxismanagements?",
      a: "Standard-Setups mit Terminplanung und Abrechnungsautomatisierung: 3–5 Werktage. Team-Einführung: 60 Minuten. Setups mit mehreren Standorten oder individuellen Abrechnungsregeln: 2–3 Wochen.",
    },
    {
      q: "Was kostet automatisiertes Praxismanagement?",
      a: "Die Kosten richten sich nach Praxisgröße, Behandleranzahl und Systemanbindungen. Nach dem kostenlosen Praxis-Check gibt es ein individuelles Angebot — keine Lizenzkosten pro Nutzer.",
    },
    {
      q: "Ist automatisiertes Praxismanagement DSGVO-konform?",
      a: "Ja. Patientendaten werden ausschließlich auf deutschen Servern verarbeitet und nicht an Dritte weitergegeben. Auftragsverarbeitungsvertrag auf Anfrage.",
    },
    {
      q: "Wer betreut das System nach dem Go-live?",
      a: "NEWEDGE. Fester Ansprechpartner, laufende Wartung, Updates und Anpassungen inklusive. Kein Ticket-System.",
    },
  ],
  howTo: {
    name: "Praxismanagement automatisieren: Einrichtung in 3 Schritten",
    description:
      "So richtet NEWEDGE automatisiertes Praxismanagement für Arztpraxen ein — von der EHR-Anbindung bis zum Go-live in unter einer Woche.",
    totalTime: "P5D",
    steps: [
      {
        name: "Praxis-Check: Systeme und Prozesse analysieren",
        text: "Kostenloser 20-Minuten-Call: Bestandsaufnahme von EHR/EMR-Systemen, Terminplanung und Abrechnung. Ergebnis: klares Bild des Ist-Zustands, No-Show-Quellen und Fehlerpotenziale — mit sofortigem Feedback.",
      },
      {
        name: "Konfiguration und API-Integration",
        text: "NEWEDGE konfiguriert Terminerinnerungsregeln, Abrechnungscodierung nach GKV/PKV-Vorgaben und rollenbasierte Ansichten für Praxisleitung, Rezeption und Abrechnung. API-Anbindung an das bestehende EHR/EMR-System: 1–2 Werktage.",
      },
      {
        name: "Go-live und Team-Einführung",
        text: "60-minütige Einführung für das Praxisteam. System geht live. Standard-Setups sind 3–5 Werktage nach dem Erstgespräch vollständig aktiv — ohne weiteren IT-Aufwand.",
      },
    ],
  },
  closingCta: {
    h2Line1: "20 Minuten. Dann wissen Sie,",
    h2Line2Highlighted: "was Ihr Backoffice Sie kostet.",
    sub: "Wir analysieren Ihre aktuelle Terminplanungs- und Abrechnungssituation und zeigen, was sofort umsetzbar ist.",
    ctaPrimary: "Kostenlosen Praxis-Check buchen",
    ctaSecondary: "Demo ansehen",
  },
};

/* ──────────────────────────────────────────────────────────────
   INDUSTRIE 3 — Handel & Supply Chain
────────────────────────────────────────────────────────────── */
const handelSupplyChain: PainPointContent = {
  slug: "handel-supply-chain",
  seo: {
    title: "Handel & Supply Chain automatisieren mit KI | NEWEDGE",
    description:
      "NEWEDGE automatisiert Bestellverarbeitung, Lieferanten-Scoring und Wareneingangsprüfung — von Mail, EDI oder Portal direkt ins ERP, ohne Medienbrüche.",
    canonical: "/industrien/handel-supply-chain",
  },
  hero: {
    overlabel: "FÜR HANDEL, EINKAUF & SUPPLY CHAIN",
    h1Line1: "Supply Chain ohne",
    h1Line2Highlighted: "Medienbrüche.",
    sub:
      "Dieselben standardisierten Funktionen wie in jeder anderen Branche — konfiguriert für Einkauf und Lieferkette. Bestellungen per Mail, Lieferantenbewertung in Excel, Wareneingang mit Klemmbrett. NEWEDGE automatisiert Ihre gesamte Supply Chain — von der Order bis zur Wareneingangsprüfung, datengetrieben und in Echtzeit.",
    ctaPrimary: "KI-Audit anfragen",
    ctaSecondary: "Demo ansehen",
    imageNote: "Visual: Bestelleingang → KI-Verarbeitung → ERP-Übergabe und Lieferanten-Scoring.",
    imageAlt: "KI automatisiert Bestellverarbeitung, Lieferantenbewertung und Wareneingang",
    image: "pain-point-handel-supply-chain-hero",
  },
  trustBar: {
    headline: "Vertraut von mittelständischen Handels- und Logistikunternehmen in DACH",
    sub: "Großhandel, Einkauf, Logistik, D2C",
    logos: ["Großhandel", "Einkauf", "Logistik", "Handel", "D2C"],
  },
  definition: {
    title: "Wie KI die Wertschöpfungskette im Handel absichert",
    body:
      "Im Handel entscheiden Geschwindigkeit, Genauigkeit und Transparenz über die Marge. Trotzdem sehen die meisten Mittelständler im Lieferantenmanagement und in der Bestellabwicklung den größten Digitalisierungsbedarf — viele haben noch gar keine digitalen Prozesse dafür. Und gestörte Lieferketten treiben die Kosten. KI-Automatisierung schließt diese Lücke: Bestellprozesse, Lieferantenkommunikation und Wareneingangsprüfung laufen datengetrieben — in Echtzeit, ohne Medienbrüche.",
  },
  feature1: {
    h2: "Bestellungen verarbeitet, bevor jemand die Mail öffnet.",
    h3: "Mail, Portal, EDI oder PDF — jede Order erfasst, extrahiert, übergeben. Ohne Tippfehler.",
    sub:
      "Bestellungen kommen per Mail, Portal, EDI oder PDF. NEWEDGE erfasst jede Order automatisch, extrahiert Artikelnummern, Mengen, Liefertermine und Konditionen — und spielt sie direkt ins ERP. Keine manuelle Eingabe, keine Tippfehler, keine vergessene Bestellung.",
    bullets: [
      "Automatische Erfassung aller Bestellformate",
      "Datenextraktion und ERP-Übergabe in Echtzeit",
      "Sofort-Eskalation bei Abweichungen oder fehlenden Daten",
    ],
    imageNote: "Visual: Bestelleingang per Mail/EDI → KI-Extraktion → ERP-Übergabe.",
    imageAlt: "Automatische Bestellverarbeitung: alle Formate, direkt ins ERP",
    image: "pain-point-handel-supply-chain-feature1",
  },
  feature2: {
    h2: "Lieferanten bewerten. Automatisch. Objektiv.",
    h3: "Alle Lieferantendaten aus Wareneingang, Qualität und Reklamationen — ein laufendes, objektives Scoring.",
    sub:
      "Welcher Lieferant liefert zuverlässig? Wer hat steigende Reklamationsquoten? Die meisten Mittelständler sehen im Lieferantenmanagement den größten Digitalisierungsbedarf — nur ein Bruchteil nutzt eine digitale Plattform dafür. NEWEDGE aggregiert Wareneingang, Qualitätsprüfung und Reklamationen zu einem laufenden Scoring. Sie entscheiden auf Daten statt Bauchgefühl.",
    bullets: [
      "Automatisches Lieferanten-Scoring aus Echtzeitdaten",
      "Frühwarnung bei Qualitäts- oder Lieferproblemen",
      "Datenbasierte Grundlage für Verhandlungen & Freigaben",
    ],
    imageNote: "Visual: Lieferanten-Scorecard mit Echtzeit-Daten aus Wareneingang und Reklamationen.",
    imageAlt: "Automatisches Lieferanten-Scoring aus Echtzeitdaten",
    image: "pain-point-handel-supply-chain-feature2",
  },
  feature3: {
    h2: "Wareneingang prüfen — ohne Klemmbrett.",
    h3: "Bestellung, Lieferschein, Wareneingang automatisch abgeglichen — jede Abweichung sofort erkannt.",
    sub:
      "Lieferschein stimmt nicht mit Bestellung überein. Menge weicht ab. Charge fehlt. Im manuellen Prozess merkt das jemand — oder eben nicht. NEWEDGE gleicht Bestellung, Lieferschein und Wareneingang automatisch ab und eskaliert Abweichungen sofort an die richtige Person. Die meisten Unternehmen sehen die schnelle Integration neuer Lieferanten als Wachstumstreiber — das geht nur digital.",
    bullets: [
      "Automatischer Abgleich: Bestellung vs. Lieferschein vs. Wareneingang",
      "Sofort-Eskalation bei Mengen-, Qualitäts- oder Chargenabweichungen",
      "Vollständige Dokumentation für Audits und Reklamationen",
    ],
    imageNote: "Visual: Drei-Wege-Abgleich Bestellung / Lieferschein / Wareneingang mit Abweichungs-Alert.",
    imageAlt: "Automatische Wareneingangsprüfung mit Drei-Wege-Abgleich",
    image: "pain-point-handel-supply-chain-feature3",
  },
  integrations: {
    h2: "Verbindet sich mit den Tools, die Sie bereits nutzen",
    h3: "SAP, Dynamics, Oracle, Shopify, WooCommerce, EDI — egal ob Großhandel oder D2C.",
    sub: "SAP, Microsoft Dynamics, Oracle, Shopify, WooCommerce, EDI-Systeme — NEWEDGE integriert sich in Ihre bestehende Handels- und Logistik-Infrastruktur. Großhandel oder D2C: Das System dockt an und arbeitet im Hintergrund. Kein Systemwechsel, kein Parallelbetrieb.",
    logos: [LOGO.sap, LOGO.shopify, LOGO.woocommerce, LOGO.stripe, LOGO.salesforce, LOGO.datev, LOGO.outlook, LOGO.zapier, LOGO.make],
  },
  compare: {
    h2: "NEWEDGE vs. manueller Handelsprozess",
    h3: "Wo manuelle Prozesse im Einkauf täglich Stunden und Marge kosten — und was KI direkt übernimmt.",
    altLabel: "Manuell",
    rows: [
      { k: "Bestellverarbeitung",    ne: "Automatisch, in Sekunden",          alt: "Manuell, fehleranfällig" },
      { k: "Lieferantenbewertung",   ne: "Echtzeit-Scoring, datenbasiert",    alt: "Bauchgefühl, Excel-Listen" },
      { k: "Wareneingangsprüfung",   ne: "Automatischer Abgleich",            alt: "Stichproben, Klemmbrett" },
      { k: "Datenqualität",          ne: "Durchgängig validiert",             alt: "Medienbrüche, Tippfehler" },
      { k: "Transparenz",            ne: "Echtzeit-Dashboard",                alt: "Nachfragen, Rückrufe" },
      { k: "Digitale Plattform",     ne: "Vollintegriert",                    alt: "Bei den wenigsten Betrieben" },
    ],
  },
  featureCards: {
    h2: "Bestellt, geprüft, gesteuert — ohne Medienbruch.",
    h3: "Drei Bausteine desselben Systems — einzeln aktivierbar oder zusammen.",
    cards: [
      {
        title: "Order-Automatisierung",
        desc: "Jede Bestellung erfasst, validiert, übergeben — egal ob Mail, EDI oder Portal. Ohne Medienbruch.",
        iconNote: "Icon: Bestelleingang → automatische Verarbeitung",
      },
      {
        title: "Lieferanten-Intelligence",
        desc: "Scoring, Frühwarnung, Benchmarks — datenbasiert statt Bauchgefühl. Für bessere Entscheidungen im Einkauf.",
        iconNote: "Icon: Lieferanten-Scorecard mit Echtzeitdaten",
      },
      {
        title: "Wareneingangs-Prüfung",
        desc: "Jede Lieferung abgeglichen. Jede Abweichung erkannt. Jede Dokumentation audit-ready.",
        iconNote: "Icon: Drei-Wege-Abgleich mit Eskalations-Alert",
      },
    ],
  },
  testimonialHero: {
    quote:
      "Wir verarbeiten 400 Bestellungen am Tag. Früher waren drei Leute nur mit Dateneingabe beschäftigt. Mit NEWEDGE läuft das vollautomatisch — und die Fehlerquote ist von 6% auf unter 0,5% gesunken.",
    author: "Großhandel DACH — Leiter Einkauf & Logistik",
  },
  faq: [
    {
      q: "Welche Bestellformate kann das System verarbeiten?",
      a: "E-Mail mit PDF-Anhang, EDI-Nachrichten (EDIFACT, X12), Lieferantenportale und direkte ERP-Transfers. Das System extrahiert Artikelnummern, Mengen, Liefertermine und Konditionen automatisch — unabhängig vom Format.",
    },
    {
      q: "Was passiert bei fehlerhaften oder abweichenden Bestellungen?",
      a: "Unvollständige oder abweichende Orders werden automatisch markiert, kategorisiert und mit allen relevanten Details an die zuständige Person eskaliert — kein Datenverlust, kein stiller Fehler.",
    },
    {
      q: "Wie wird das Lieferanten-Scoring berechnet?",
      a: "Der Score aggregiert Liefertreue, Reklamationsquote, Qualitätsabweichungen und Preiskonformität aus Echtzeit-Daten. Genau hier sehen die meisten Mittelständler den größten Digitalisierungsbedarf — NEWEDGE schließt diese Lücke.",
    },
    {
      q: "Kann das System mit Shopify oder WooCommerce für D2C-Händler verbunden werden?",
      a: "Ja. Neben klassischen ERP-Systemen (SAP, Microsoft Dynamics, Oracle) sind native Integrationen für Shopify, WooCommerce und EDI-Systeme verfügbar. Egal ob Großhandel oder D2C.",
    },
    {
      q: "Wie lange dauert die Einführung?",
      a: "Typisch 3–5 Wochen: Systemanbindung, Format-Training mit Ihren realen Bestelldaten, Pilotbetrieb und Go-live. Das System lernt Ihre Formate und Ausnahmen automatisch.",
    },
  ],
  closingCta: {
    h2Line1: "Jede Bestellung, die manuell landet,",
    h2Line2Highlighted: "kostet Ihr Team Zeit, die Sie nicht haben.",
    sub: "Im kostenlosen KI-Audit zeigen wir, wo Ihre Supply Chain Prozesse Zeit und Marge verlieren.",
    ctaPrimary: "KI-Audit anfragen",
    ctaSecondary: "Demo ansehen",
  },
};

/* ──────────────────────────────────────────────────────────────
   INDUSTRIE 4 — Professional Services
────────────────────────────────────────────────────────────── */
const professionalServices: PainPointContent = {
  slug: "professional-services",
  seo: {
    title: "KI für Berater, Kanzleien und Steuerberater | NEWEDGE",
    description:
      "NEWEDGE automatisiert Recherche, Reports und Mandantenkommunikation für Kanzleien und Berater — deutlich schneller, ohne Systemwechsel, live in 5 Werktagen.",
    canonical: "/industrien/professional-services",
  },
  hero: {
    overlabel: "KI-AUTOMATISIERUNG FÜR BERATER, KANZLEIEN & STEUERBERATER",
    h1Line1: "Ihre Expertise ist Ihr Geschäft.",
    h1Line2Highlighted: "35–40 % Ihrer Zeit zahlt kein Mandat.",
    sub:
      "Dieselben standardisierten Funktionen wie in jeder anderen Branche — konfiguriert für Mandats- und Beratungsarbeit. 35–40 % Ihrer Arbeitszeit fließt in Aufgaben, für die kein Mandat zahlt: Recherche, Reports, Rückfragen, Dokumentenvorbereitung. NEWEDGE automatisiert genau diese Aufgaben — Sie konzentrieren sich auf das, wofür Mandanten bezahlen.",
    ctaPrimary: "Kostenlosen Professional-Services-Check buchen",
    ctaSecondary: "Demo ansehen",
    imageNote: "Visual: KI-Agent übernimmt Recherche, Mandantenkommunikation und Reports — Berater fokussiert auf Mandatsarbeit.",
    imageAlt: "KI-Automatisierung für Berater, Kanzleien und Steuerberater: Recherche, Kommunikation und Reports",
    image: "pain-point-professional-services-hero",
  },
  trustBar: {
    headline: "Vertraut von Beratungs- und Professional-Services-Unternehmen in DACH",
    sub: "Unternehmensberatungen, Coaches, Anwaltskanzleien, Consultants",
    logos: ["Beratung", "Coaching", "Kanzlei", "Consulting", "Advisory"],
  },
  definition: {
    title: "Was ist KI-Automatisierung für Professional Services?",
    body:
      "KI-Agenten übernehmen wiederkehrende, regelbasierte Aufgaben: Recherche, Dokumentenanalyse, Mandantenkommunikation, Report-Erstellung, Compliance-Monitoring. Wissensarbeiter verbringen fast zwei Stunden täglich mit dem Suchen und Zusammentragen von Informationen — über ein Fünftel ihrer Arbeitszeit. Kanzleien und Beratungen mit KI-Automatisierung senken ihren Verwaltungsaufwand um rund ein Drittel — bei einer 5-köpfigen Beratung fast zwei volle Arbeitstage pro Woche.",
  },
  feature1: {
    h2: "Ihr beratet — aber wer bereitet vor?",
    h3: "Datenanalyse und Recherche für Berater, Anwälte und Steuerberater automatisieren",
    sub:
      "Vor jeder Beratung, jedem Schriftsatz, jedem Jahresabschluss steht Recherche. Der KI-Agent durchsucht Datenbanken, analysiert Dokumente und bereitet strukturierte Zusammenfassungen vor — bevor Sie morgens am Schreibtisch sitzen.",
    bullets: [
      "Automatische Datensammlung aus mehreren Quellen: Fachdatenbanken, Mandantenunterlagen, öffentliche Register",
      "KI-gestützte Mustererkennung und Relevanzfilterung",
      "Konfigurierbare Dashboards für mandantenspezifische Insights",
      "Direkte Integration in bestehende Dokumentenmanagement-Systeme",
    ],
    imageNote: "Visual: KI-Agent analysiert Dokumente und liefert strukturierte Ergebnisse",
    imageAlt: "KI-gestützte Recherche und Datenanalyse für Professional Services",
    image: "pain-point-professional-services-feature1",
  },
  feature2: {
    h2: "Mandanten warten nicht gerne.",
    h3: "Mandantenkommunikation für Kanzleien und Berater automatisieren",
    sub:
      "Statusanfragen, Rückfragen zu Dokumenten, Terminkoordination — immer dieselben Prozesse, immer manuell. KI-Agenten übernehmen Standardkommunikation, kategorisieren Anfragen und antworten sofort — in Ihrer Tonalität.",
    bullets: [
      "KI-gestützte Beantwortung häufiger Mandantenanfragen, rund um die Uhr",
      "Automatische E-Mail-Kategorisierung und Priorisierung nach Dringlichkeit",
      "Personalisierte E-Mail- und Dokumentenvorlagen",
      "Integration in CRM und bestehende Kommunikationsplattformen",
    ],
    imageNote: "Visual: Automatisierte Mandantenkommunikation",
    imageAlt: "KI-gestützte Mandantenkommunikation für Kanzleien",
    image: "pain-point-professional-services-feature2",
  },
  feature3: {
    h2: "Reports schreiben kann auch die KI.",
    h3: "Report-Erstellung und Compliance für Professional Services automatisieren",
    sub:
      "Report-Erstellung ist regel- und templatebasiert — genau das, was KI besonders gut kann. Der KI-Agent sammelt Daten, befüllt Templates und generiert fertige Reports: von der Statusmitteilung bis zum Jahresbericht.",
    bullets: [
      "Automatische Report-Generierung auf Basis konfigurierbarer Templates",
      "KI-gestützte Datenextraktion und -konsolidierung aus mehreren Quellen",
      "Echtzeit-Monitoring regulatorischer Anforderungen und Fristen",
      "Automatische Compliance-Checks und Alerts bei potenziellen Problemen",
    ],
    imageNote: "Visual: Automatisierte Report-Erstellung",
    imageAlt: "KI-gestützte Report-Erstellung für Professional Services",
    image: "pain-point-professional-services-feature3",
  },
  integrations: {
    h2: "Sie wechseln kein einziges System.",
    h3: "KI-Integrationen für Professional Services",
    sub:
      "NEWEDGE integriert sich per API in gängige CRM-, Dokumentenmanagement- und Fachsoftware-Systeme — Salesforce, HubSpot, DATEV, RA-MICRO, SharePoint, Microsoft 365, LexOffice und weitere. Keine Datenmigration. Keine neuen Logins.",
    logos: [LOGO.salesforce, LOGO.hubspot, LOGO.datev, LOGO.lexoffice, LOGO.sharepoint, LOGO.teams, LOGO.outlook, LOGO.docusign, LOGO.notion],
  },
  compare: {
    h2: "40 % Ihrer Arbeitszeit. Für Aufgaben, für die kein Mandat zahlt.",
    h3: "KI-Automatisierung vs. manueller Betrieb im Professional Services Vergleich",
    altLabel: "Manueller Betrieb",
    rows: [
      { k: "Recherche- und Analysezeit",            ne: "Deutlich reduziert durch KI-Vorbereitung",      alt: "2–4 Stunden pro Mandat manuell" },
      { k: "Report-Erstellungszeit",                ne: "Automatisch, in Minuten",                       alt: "3–6 Stunden pro Report" },
      { k: "Reaktionszeit auf Mandantenanfragen",   ne: "Sofort, 24/7",                                  alt: "Nächster Werktag" },
      { k: "Compliance-Monitoring",                 ne: "Echtzeit, automatisch",                         alt: "Manuell, fehleranfällig" },
      { k: "Onboarding neuer Mandanten",            ne: "Strukturiert, automatisiert",                   alt: "2–4 Stunden pro Mandat" },
      { k: "Dokumentenvorbereitung",                ne: "KI-gestützt, in Minuten",                       alt: "Stundenlange manuelle Arbeit" },
      { k: "Kapazität pro Berater",                 ne: "Bis zu 40 % mehr abrechnungsfähige Stunden",   alt: "Durch Admin gedeckelt" },
      { k: "Setup-Aufwand",                         ne: "Integration in bestehende Systeme, kein Wechsel", alt: "Neue Tools = neue Schulungen" },
    ],
  },
  featureCards: {
    h2: "Was sich tatsächlich ändert — nach Woche eins.",
    h3: "Konkrete Ergebnisse durch KI-Automatisierung im Professional Services Betrieb",
    cards: [
      {
        title: "Recherche in Minuten statt Stunden",
        desc: "KI-Agenten durchsuchen Datenbanken, analysieren Dokumente und liefern strukturierte Ergebnisse — bevor Sie die erste Frage stellen.",
        iconNote: "Icon: Lupe + KI",
      },
      {
        title: "Mandantenkommunikation ohne Reaktionsverzug",
        desc: "Standardanfragen werden sofort beantwortet, E-Mails kategorisiert, Termine koordiniert — in Ihrer Tonalität, rund um die Uhr.",
        iconNote: "Icon: Chat mit Haken",
        icon: "i4-icon-followup",
      },
      {
        title: "Reports auf Basis aktueller Daten — nicht in Tagen",
        desc: "Automatische Datenkonsolidierung, Template-Befüllung und Qualitätsprüfung — Reports in Minuten statt in Stunden.",
        iconNote: "Icon: Dokument + Blitz",
        icon: "i4-icon-report",
      },
    ],
  },
  testimonialHero: {
    quote:
      "Wir haben jeden Montag zwei Stunden damit verbracht, Reports zusammenzustellen und Mandantenanfragen zu sortieren. Seit NEWEDGE läuft das automatisch — wir bekommen die fertige Zusammenfassung, und das Team arbeitet an dem, wofür wir tatsächlich bezahlt werden.",
    author: "Berater — Professional Services DACH",
  },
  howTo: {
    name: "KI-Automatisierung für Professional Services: Einrichtung in 3 Schritten",
    description:
      "So integriert NEWEDGE KI-Automatisierung in Ihren Professional Services Betrieb — ohne Systemwechsel, in 5 Werktagen.",
    totalTime: "P5D",
    steps: [
      {
        name: "Schritt 1: Prozessanalyse und Priorisierung",
        text: "Wir analysieren Ihre wiederkehrenden Aufgaben und finden die größten Zeitfresser — Recherche, Kommunikation oder Reporting. Ergebnis: eine priorisierte Automatisierungsliste mit Zeitersparnis-Schätzung.",
      },
      {
        name: "Schritt 2: Integration und Konfiguration",
        text: "NEWEDGE verbindet sich per API mit Ihren bestehenden Systemen — DATEV, RA-MICRO, Salesforce, Microsoft 365, SharePoint. KI-Agenten werden auf Ihre Wissensbasis, Templates und Tonalität konfiguriert. Kein Systemwechsel, keine Datenmigration.",
      },
      {
        name: "Schritt 3: Go-live und laufende Optimierung",
        text: "Nach 5 Werktagen läuft das System produktiv. Sie sehen, welche Aufgaben automatisch laufen und wie viele Stunden Sie sparen. Die KI-Agenten lernen aus Feedback weiter.",
      },
    ],
  },
  faq: [
    {
      q: "Für welche Professional Services Unternehmen ist NEWEDGE geeignet?",
      a: "Beratungsunternehmen (Management, Strategie, Finanzen), Coaches, Anwaltskanzleien, Architektur- und Stadtplanungsbüros, Steuerberater, Wirtschaftsprüfer, HR-Consultants und Recruiter — überall, wo wiederkehrende, regelbasierte Aufgaben Zeit fressen.",
    },
    {
      q: "Wie viel Zeit spare ich tatsächlich ein?",
      a: "Kanzleien und Beratungen reduzieren ihren Verwaltungsaufwand durch KI-Automatisierung um rund ein Drittel. Bei einer 5-köpfigen Beratung entspricht das fast zwei vollständigen Arbeitstagen pro Woche.",
    },
    {
      q: "Muss ich meine bestehenden Systeme wechseln?",
      a: "Nein. NEWEDGE integriert sich per API in Ihre bestehende Infrastruktur — DATEV, RA-MICRO, Salesforce, HubSpot, Microsoft 365, SharePoint, LexOffice und weitere. Keine Datenmigration, keine neuen Logins.",
    },
    {
      q: "Wie lange dauert die Implementierung?",
      a: "Typisch 5 Werktage: Tag 1–2 Prozessanalyse und Systemanbindung, Tag 3–4 Konfiguration der KI-Agenten auf Ihre Wissensbasis und Templates, Tag 5 Go-live und Übergabe.",
    },
    {
      q: "Wie stellt NEWEDGE DSGVO-Konformität sicher?",
      a: "NEWEDGE kann vollständig in Ihrer privaten Cloud oder on-premise betrieben werden. Keine Mandantendaten verlassen Ihre Infrastruktur. Alle Datenverarbeitungen sind DSGVO-konform dokumentiert.",
    },
    {
      q: "Merken Mandanten, dass ein KI-Agent antwortet?",
      a: "Das entscheiden Sie. NEWEDGE kommuniziert transparent als KI-Assistent oder tritt vollständig unter Ihrem Markenauftritt auf.",
    },
    {
      q: "Kann NEWEDGE auch mandantenspezifische Reports generieren?",
      a: "Ja. KI-Agenten werden auf Ihre spezifischen Report-Templates, Datenquellen und Formatierungsstandards konfiguriert. Reports werden automatisch mit aktuellen Daten befüllt und zur finalen Freigabe vorgelegt.",
    },
    {
      q: "Was kostet NEWEDGE für Professional Services?",
      a: "Die Investition hängt von Teamgröße und Automatisierungstiefe ab. Buchen Sie einen kostenlosen Professional-Services-Check — wir analysieren Ihren konkreten Zeitverlust und zeigen, ab wann sich die Investition rechnet.",
    },
  ],
  closingCta: {
    h2Line1: "20 Minuten.",
    h2Line2Highlighted: "Dann wissen Sie, was Ihre KI Ihnen sparen kann.",
    sub: "Wir analysieren Ihre wiederkehrenden Aufgaben und zeigen, was sofort automatisierbar ist.",
    ctaPrimary: "Kostenlosen Professional-Services-Check buchen",
    ctaSecondary: "Demo ansehen",
  },
};

// Mini-Cases (Custom Posts) — zentral gepflegt in collections/miniCases.ts,
// hier pro Anwendungsfeld zugewiesen (Map-Key = primärer Slug).
// Auswahlverfahren & Entscheidungsinstanzen zeigen bewusst dieselben 3 Cases
// (identische Zielgruppe/Thematik: Jury-/Gremiumsentscheidungen) — eine Quelle,
// zwei Anwendungsfeld-Seiten.
auswahlverfahren.miniCases = miniCasesBySlug["entscheidungsinstanzen"];
compliance.miniCases = miniCasesBySlug["compliance"];
kpiDashboard.miniCases = miniCasesBySlug["kpi-dashboard"];
kiKundensupport.miniCases = miniCasesBySlug["ki-kundensupport"];
entscheidungsinstanzen.miniCases = miniCasesBySlug["entscheidungsinstanzen"];
localDigitalCommerce.miniCases = miniCasesBySlug["health-care"];
handelSupplyChain.miniCases = miniCasesBySlug["handel-supply-chain"];
professionalServices.miniCases = miniCasesBySlug["professional-services"];

export const painPoints: Record<string, PainPointContent> = {
  // Pain Point A
  auswahlverfahren: auswahlverfahren,
  "auswahlverfahren-automatisieren": auswahlverfahren,

  // Pain Point B (Kundengewinnung entfernt)

  // Pain Point C
  compliance: compliance,
  "compliance-automatisierung": compliance,
  "import-export": compliance,
  "import-export-compliance": compliance,

  // Pain Point D
  "kpi-dashboard": kpiDashboard,
  "kpi-dashboard-echtzeit": kpiDashboard,
  reporting: kpiDashboard,

  // Pain Point E
  "ki-kundensupport": kiKundensupport,
  kundensupport: kiKundensupport,
  support: kiKundensupport,

  // Industrien
  entscheidungsinstanzen: entscheidungsinstanzen,
  "local-digital-commerce": localDigitalCommerce,
  "health-care": localDigitalCommerce,
  "handel-supply-chain": handelSupplyChain,
  "professional-services": professionalServices,
};

export const DEFAULT_PAIN_POINT: PainPointContent = auswahlverfahren;
