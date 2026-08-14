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
  slug: "entscheidungen-fallpruefung",
  seo: {
    title: "Entscheidungen & Fallprüfung mit KI | NEWEDGE München",
    description:
      "NEWEDGE strukturiert Anträge, Einreichungen und Fallprüfungen — Aufnahme, Bewertung nach Ihren Kriterien und revisionssichere Dokumentation jeder Entscheidung.",
    canonical: "/loesungen/entscheidungen-fallpruefung",
  },
  hero: {
    overlabel: "KI-AUTOMATISIERUNG FÜR AWARDS & AUSWAHLVERFAHREN",
    h1Line1: "Ihr Auswahlverfahren —",
    h1Line2Highlighted: "ohne den Verwaltungsmarathon.",
    sub:
      "So automatisieren wir Entscheidungen und Fallprüfung. Fälle kommen geprüft und entscheidungsreif zu Ihnen — Sie treffen nur noch das Urteil.",
    ctaPrimary: "Demo buchen",
    ctaSecondary: "Case: BMP Award ansehen",
    imageNote:
      "Dashboard-Mockup: Links unstrukturierte PDF-Stapel, rechts strukturiertes Scoring-Dashboard mit Balken, Kategorien, Jury-Scores. Transition-Animation. Lila-Akzente.",
    imageAlt:
      "Vorher: unstrukturierte PDF-Bewerbungen — Nachher: strukturiertes KI-Scoring-Dashboard",
  },
  trustBar: {
    headline: "Führende Organisationen in Deutschland vertrauen uns.",
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
      "Ein Gremium, ein enger Zeitplan, ein Postfach voller Rückfragen — so sieht Bewertungskoordination heute aus. NEWEDGE übernimmt Briefings, Erinnerungen und das Zusammenführen der Bewertungen. Jeder bewertet online im eigenen Tempo. Sie sehen in Echtzeit, wer fertig ist und wo Urteile auseinandergehen.",
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
      "Was früher aufwendige Handarbeit bedeutete, läuft mit NEWEDGE jetzt automatisch — und die Qualität unserer Entscheidungen ist spürbar besser geworden.",
    author: "BMP Award — Projektleitung",
  },
  faq: [
    {
      q: "Wie lange dauert die Implementierung eines KI-gestützten Auswahlverfahrens?",
      a: "Wir starten mit einem klar abgegrenzten Verfahren und gehen damit produktiv, bevor wir erweitern. Den Zeitrahmen legen wir nach Sichtung Ihrer Kriterien und Datenlage gemeinsam fest. Datenmigration und Team-Training sind inklusive.",
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
   Blueprint-Seite: dieselbe standardisierte Funktion (erfassen,
   klassifizieren, extrahieren, auf Vollständigkeit und Regeln prüfen,
   abgleichen, Abweichungen eskalieren), konfiguriert für Versicherungen,
   Bildung, Förderungen und Immobilien.
   "Compliance" ist hier nur konkreter Anwendungsfall (Prüfung gegen
   interne Regeln, Nachweispflichten, Aufbewahrung) — nie Oberkategorie
   oder Seitenthema.
   KEINE Zahlen: keine Prozentwerte, Zeitersparnisse, Fall- oder
   Kostenangaben — dafür existieren keine Messwerte.
────────────────────────────────────────────────────────────── */
const compliance: PainPointContent = {
  slug: "dokumente-prozesse",
  seo: {
    title: "Dokumente & Prozesse automatisieren mit KI | NEWEDGE",
    description:
      "NEWEDGE erfasst, prüft und ordnet Ihre Unterlagen zu: Schadennachweise, Bewerbungsunterlagen, Verwendungsnachweise, Mietunterlagen. Jetzt Demo buchen.",
    canonical: "/loesungen/dokumente-prozesse",
  },
  hero: {
    overlabel: "DOKUMENTE & PROZESSE · KONFIGURIERT FÜR IHREN FACHKONTEXT",
    h1Line1: "Der Stapel ist geprüft,",
    h1Line2Highlighted: "bevor Sie ihn öffnen.",
    sub:
      "So automatisieren wir Dokumente und Prozesse. Unterlagen kommen an, wie sie kommen — auf Ihrem Tisch landet nur noch, was wirklich nicht zusammenpasst.",
    ctaPrimary: "KI-Audit anfragen",
    ctaSecondary: "Demo ansehen",
    imageNote: "Dokument-Flow: gemischter Posteingang aus Nachweisen, Anträgen und Belegen → Prüfung → geordnete Akte mit Vollständigkeitsstatus.",
    imageAlt: "KI erfasst Nachweise, Anträge und Belege, prüft sie und ordnet sie dem richtigen Vorgang zu",
    image: "pain-point-compliance-hero",
  },
  trustBar: {
    headline: "Für Häuser, bei denen jeden Tag Unterlagen eingehen",
    sub: "Dieselben Bausteine — in Versicherung, Bildung, Förderung und Immobilien",
    logos: ["Versicherer", "Makler", "Hochschulen", "Bildungsträger", "Fördergeber", "Stiftungen", "Hausverwaltung"],
  },
  definition: {
    title: "Was heißt KI-gestützte Dokumenten- und Prozessautomatisierung?",
    body:
      "Dokumente und Prozesse folgen in jedem Haus demselben Muster: Unterlagen kommen an, müssen zugeordnet, gelesen, geprüft und dokumentiert werden. NEWEDGE standardisiert diese Funktion einmal und konfiguriert sie für den fachlichen Kontext — für Schadennachweise und Policenunterlagen genauso wie für Bewerbungsdossiers, Förderanträge samt Anlagen oder Mietunterlagen. Das System nimmt jede Unterlage auf, erkennt, worum es sich handelt, liest die relevanten Angaben aus, prüft sie gegen Ihre Checklisten, internen Regeln und Nachweispflichten und gleicht sie mit Ihren bestehenden Daten ab. Was vollständig und stimmig ist, läuft durch. Was fehlt, sich widerspricht oder von Ihren Vorgaben abweicht, kommt mit Hinweis zu der Person, die es entscheiden muss. Jeder Schritt bleibt protokolliert — damit Nachweis- und Aufbewahrungspflichten erfüllbar bleiben, ohne dass später jemand den Verlauf rekonstruiert.",
  },
  feature1: {
    h2: "Jede Unterlage landet im richtigen Vorgang.",
    h3: "Erfassen, erkennen und zuordnen — ob Scan, Foto, Formular oder Mailanhang.",
    sub:
      "Ein Nachweis zum Schadenfall, ein Zeugnis zur Bewerbung, eine Anlage zum Förderantrag, ein Beleg zur Nebenkostenabrechnung — alles trifft über verschiedene Wege ein und selten mit sprechendem Betreff. NEWEDGE erfasst jede Unterlage, erkennt anhand des Inhalts, worum es sich handelt, liest die relevanten Angaben aus und ordnet sie dem richtigen Fall, Antrag oder Objekt zu.",
    bullets: [
      "Unterlagen sind zugeordnet und ausgelesen, bevor jemand den Posteingang durchsieht",
      "Dateiname und Format spielen keine Rolle — erkannt wird der Inhalt",
      "Nachträge landen am bestehenden Vorgang, statt eine zweite Akte zu erzeugen",
    ],
    imageNote: "Scan-Animation: gemischter Posteingang aus Foto, Scan und Sammel-PDF → jede Unterlage der richtigen Akte zugeordnet.",
    imageAlt: "Eingehende Nachweise und Anträge werden automatisch erkannt und dem richtigen Vorgang zugeordnet",
    image: "pain-point-compliance-feature1",
  },
  feature2: {
    h2: "Was fehlt, fällt beim Eingang auf.",
    h3: "Vollständigkeit, Regelprüfung und Datenabgleich — im jeweiligen Fachkontext konfiguriert.",
    sub:
      "Fehlt im Bewerbungsdossier der Sprachnachweis, beim Verwendungsnachweis eine Anlage, beim Schadenfall die Rechnung, beim Mietvertrag das Übergabeprotokoll? NEWEDGE prüft jede Unterlage gegen Ihre Checklisten und internen Regeln und gleicht die ausgelesenen Angaben mit dem ab, was bei Ihnen bereits hinterlegt ist. Fehlendes wird angefordert und nachverfolgt, statt mitten in der Bearbeitung liegen zu bleiben.",
    bullets: [
      "Fehlende Nachweise sind angefordert, bevor der Vorgang in die Bearbeitung geht",
      "Ihre Prüfregeln greifen bei jedem Vorgang gleich — auch bei hohem Andrang",
      "Angaben werden gegen Ihre Daten geprüft statt abgetippt",
    ],
    imageNote: "Prüf-Ansicht: Unterlage → Checkliste mit Vollständigkeitsstatus, markierter Lücke und automatischer Nachforderung.",
    imageAlt: "Automatische Vollständigkeits- und Regelprüfung mit Nachforderung fehlender Nachweise",
    image: "pain-point-compliance-feature2",
  },
  feature3: {
    h2: "Abweichungen kommen zu Ihnen — mit Fundstelle.",
    h3: "Eskalation und lückenlose Nachweisführung statt stiller Übernahme.",
    sub:
      "Zwei Angaben widersprechen sich, ein Beleg passt nicht zur Abrechnungsperiode, ein Nachweis ist abgelaufen, eine Frist läuft. Solche Fälle übernimmt das System nicht stillschweigend, sondern legt sie der zuständigen Person vor — mit Hinweis darauf, worauf sich die Einschätzung stützt. Jeder Bearbeitungsschritt bleibt protokolliert, sodass sich später nachvollziehen lässt, wer wann auf welcher Grundlage entschieden hat.",
    bullets: [
      "Widersprüche und abgelaufene Nachweise sind markiert statt übersehen",
      "Prüfung gegen Ihre internen Vorgaben und Nachweispflichten bei jedem Vorgang",
      "Protokoll und Aufbewahrung entstehen nebenbei, nicht erst kurz vor der Prüfung",
    ],
    imageNote: "Prüf-Check: Vorgang → Prüfung gegen Regeln → Freigabe oder markierte Abweichung mit Protokolleintrag.",
    imageAlt: "Abweichungen werden mit Fundstelle eskaliert und jeder Bearbeitungsschritt protokolliert",
    image: "pain-point-compliance-feature3",
  },
  integrations: {
    h2: "Verbindet sich mit den Tools, die Sie bereits nutzen",
    h3: "Postfach, Dokumentenablage, Signatur, Fachanwendung — angebunden statt ersetzt.",
    sub: "NEWEDGE ersetzt keine Ihrer Fachanwendungen. Die Bausteine docken an das an, womit Ihre Teams heute arbeiten — Postfach, Dokumentenablage, Signatur sowie Bestands- und Verwaltungssysteme — und übernehmen die Schritte dazwischen. Kein Systemwechsel, kein Parallelbetrieb: Ihre Daten bleiben dort, wo sie liegen.",
    logos: [LOGO.outlook, LOGO.sharepoint, LOGO.teams, LOGO.googleWorkspace, LOGO.docusign, LOGO.datev, LOGO.salesforce, LOGO.zapier, LOGO.make],
  },
  compare: {
    h2: "NEWEDGE vs. manuelle Dokumentenbearbeitung",
    h3: "Dieselben Bausteine, konfiguriert für Ihren Fachkontext — im direkten Vergleich.",
    altLabel: "Heute, manuell",
    rows: [
      { k: "Unterlagen erfassen",     ne: "Automatisch, aus jedem Kanal und Format", alt: "Öffnen, sichten, ablegen" },
      { k: "Zuordnung zum Vorgang",   ne: "Aus dem Inhalt erkannt",                  alt: "Suchen, wohin es gehört" },
      { k: "Vollständigkeitsprüfung", ne: "Beim Eingang, mit Nachforderung",         alt: "Fällt spät auf, kostet Nachfassen" },
      { k: "Prüfung gegen Ihre Regeln", ne: "Bei jedem Vorgang gleich",              alt: "Abhängig von Person und Tagesform" },
      { k: "Datenabgleich",           ne: "Abgeglichen, Abweichung gemeldet",        alt: "Abtippen aus Dokumenten" },
      { k: "Nachweis & Aufbewahrung", ne: "Jeder Schritt protokolliert",             alt: "Verteilt über Postfächer und Ordner" },
    ],
  },
  featureCards: {
    h2: "Erfasst, geprüft, abgeglichen — bevor jemand nachfassen muss.",
    h3: "Drei Bausteine desselben Systems — einzeln aktivierbar oder zusammen.",
    cards: [
      {
        title: "Erfassung & Zuordnung",
        desc: "Jede Unterlage wird aufgenommen, erkannt, ausgelesen und dem richtigen Fall, Antrag oder Objekt zugeordnet — unabhängig von Kanal und Format.",
        iconNote: "Animation: gemischte Unterlagen werden gescannt und der richtigen Akte zugeordnet",
        icon: "ppc-icon-scan",
      },
      {
        title: "Vollständigkeit & Regelprüfung",
        desc: "Fehlende Nachweise fallen beim Eingang auf und werden angefordert. Ihre Prüfregeln greifen bei jedem Vorgang gleich.",
        iconNote: "Animation: Checkliste mit Vollständigkeitsstatus und markierter Lücke",
        icon: "ppc-icon-alert",
      },
      {
        title: "Abgleich & Nachweisführung",
        desc: "Angaben werden gegen Ihre Daten geprüft, Abweichungen gemeldet, jeder Schritt protokolliert — für Nachweispflichten und Aufbewahrung.",
        iconNote: "Animation: Datenabgleich mit markierter Abweichung und Protokolleintrag",
        icon: "ppc-icon-shield",
      },
    ],
  },
  /**
   * Kein Kundenzitat: für dieses Anwendungsfeld existiert keine belegte
   * Referenzaussage. Bewusst als Haltungsaussage von NEWEDGE formuliert,
   * ohne Zahl.
   */
  testimonialHero: {
    quote:
      "Unterlagen sehen in Versicherung, Bildung, Förderung und Immobilien unterschiedlich aus — die Arbeit dahinter ist dieselbe. Wir übernehmen das Erfassen, Prüfen und Abgleichen. Was auffällt, entscheidet weiterhin Ihr Team.",
    author: "NEWEDGE — Arbeitsprinzip",
  },
  faq: [
    {
      q: "Welche Unterlagen kann das System verarbeiten?",
      a: "Alles, was bei Ihnen üblicherweise eingeht: Schadennachweise, Policen- und Antragsunterlagen, Nachträge, Bewerbungsdossiers, Zeugnisse und Anerkennungen, Förderanträge samt Anlagen, Verwendungsnachweise, Mietverträge, Nebenkostenbelege und Übergabeprotokolle — als Scan, Foto, PDF, Formular oder Mailanhang. Maßgeblich ist der Inhalt, nicht das Format.",
    },
    {
      q: "Bauen Sie für jede Branche eine eigene Software?",
      a: "Nein. Es sind dieselben standardisierten Funktionen — erfassen, klassifizieren, auslesen, auf Vollständigkeit und Regeln prüfen, abgleichen, Abweichungen eskalieren. Für Ihr Haus werden sie auf Ihre Unterlagenarten, Checklisten und Prüfregeln konfiguriert. Kein Individualprojekt von null, sondern derselbe Baustein in Ihrem fachlichen Kontext.",
    },
    {
      q: "Was passiert, wenn eine Unterlage unklar oder widersprüchlich ist?",
      a: "Sie wird nicht durchgewinkt. Das System markiert die Stelle, benennt, woran es hängt, und legt den Vorgang der zuständigen Person vor. Wie mit der Abweichung umgegangen wird, entscheidet weiterhin Ihr Team.",
    },
    {
      q: "Lässt sich das an unsere bestehenden Systeme anbinden?",
      a: "Ja. NEWEDGE ersetzt keine Fachanwendung und verlangt keinen Systemwechsel. Postfach, Dokumentenablage, Signatur sowie Ihre Bestands- und Verwaltungssysteme werden angebunden; das System arbeitet im Hintergrund und schreibt geprüfte Daten dorthin zurück, wo Ihre Teams sie erwarten.",
    },
    {
      q: "Wie gehen Sie mit personenbezogenen Daten, Nachweispflichten und Aufbewahrung um?",
      a: "Die Verarbeitung erfolgt DSGVO-konform, mit Rollen- und Zugriffsrechten und auf Wunsch in deutscher Cloud oder in Ihrer eigenen Infrastruktur. Jeder Bearbeitungsschritt wird protokolliert — damit Auskunfts-, Nachweis- und Aufbewahrungspflichten erfüllbar bleiben, ohne dass jemand den Verlauf im Nachhinein zusammensucht.",
    },
  ],
  closingCta: {
    h2Line1: "Die Unterlagen sortieren wir.",
    h2Line2Highlighted: "Sie sehen sich an, was auffällt.",
    sub: "In einem kostenlosen KI-Audit sehen wir uns an, welcher Dokumentenweg bei Ihnen zuerst Sinn ergibt.",
    ctaPrimary: "KI-Audit anfragen",
    ctaSecondary: "Demo ansehen",
  },
};

/* ──────────────────────────────────────────────────────────────
   PAIN POINT D — Steuerung & Reporting
   Blueprint, KEIN branchenspezifisches Produkt: dieselbe standardisierte
   Funktion, konfiguriert für die Steuerungsgrößen der jeweiligen Branche
   (Versicherungen, Bildung, Förderungen, Immobilien).
   KEINE Zahlen, keine Zeitersparnis, keine Fall-, Kunden- oder
   Durchlaufzahlen, keine Preise — dafür existieren keine belegten Werte.
   Keine Handels-, Vertriebs- oder Warenwirtschaftskontexte: Quellsysteme
   werden generisch benannt (Fachsysteme, Bestandsführung, Aktenverwaltung).
────────────────────────────────────────────────────────────── */
const kpiDashboard: PainPointContent = {
  slug: "steuerung-reporting",
  seo: {
    title: "Steuerung & Reporting mit KI: Zahlen an einem Ort | NEWEDGE",
    description:
      "Bearbeitungsstand, Fristen, Auslastung und Bestand in einer Sicht — ohne neues Kernsystem. Demo buchen und Ihre eigenen Zahlen sehen.",
    canonical: "/loesungen/steuerung-reporting",
  },
  hero: {
    overlabel: "STEUERUNG & REPORTING · KONFIGURIERT FÜR IHREN FACHBEREICH",
    h1Line1: "Ihr Bericht zeigt, was letzte Woche war.",
    h1Line2Highlighted: "Nicht, wo die Vorgänge heute stehen.",
    sub:
      "So automatisieren wir Steuerung und Reporting. Ihre Kennzahlen laufend an einem Ort — Abweichungen sehen Sie, sobald sie entstehen.",
    ctaPrimary: "Demo buchen",
    ctaSecondary: "Beispiele ansehen",
    imageNote:
      "Steuerungs-Cockpit: Bearbeitungsstand offener Vorgänge, Fristenübersicht, Auslastung und Bestandsentwicklung nebeneinander, dazu ein Hinweisfeld für Abweichungen. Lila Akzente.",
    imageAlt:
      "Steuerungs-Cockpit mit Bearbeitungsstand, Fristen, Auslastung und Bestand in einer Sicht",
    image: "pain-point-kpi-dashboard-hero",
  },
  trustBar: {
    headline: "Gebaut für Häuser, die laufend Vorgänge steuern",
    sub: "Versicherungen, Bildung, Förder- und Vergabestellen, Immobilienverwaltung",
    logos: ["Versicherer", "Makler", "Hochschule", "Bildungsträger", "Förderstelle", "Vergabestelle", "Hausverwaltung"],
  },
  definition: {
    title: "Was ist KI-gestützte Steuerung und Reporting?",
    body:
      "Steuerung und Reporting folgen in jedem Haus demselben Muster: Daten aus verschiedenen Quellen konsolidieren, Kennzahlen überwachen, Abweichungen erkennen, Entscheidungen der Leitung vorbereiten. NEWEDGE standardisiert diese Funktion einmal und konfiguriert sie auf Ihre Steuerungsgrößen — in der Versicherung auf Bearbeitungsstand, Schadenquote, Bestand und Servicelevel, in der Bildung auf Bewerberzahlen, Auslastung, Bearbeitungsstand und Fristen, in Förderverfahren auf Verfahrensstand, Antragsvolumen, Fristen und Gremienlast, in der Immobilienverwaltung auf Leerstand, Instandhaltungsfälle, offene Forderungen und Portfolio. Keine Sonderlösung je Branche, sondern dieselbe Funktion mit anderem fachlichem Zuschnitt.",
  },
  feature1: {
    h2: "Eine Zahl, auf die sich alle berufen können.",
    h3: "Daten aus Ihren Fachsystemen laufend zusammengeführt",
    sub:
      "Der Bearbeitungsstand steht in der Aktenverwaltung, die Fristen im Postfach, die Auslastung in einer Tabelle — und jeder Bereich rechnet ein bisschen anders. NEWEDGE führt die Werte aus Ihren bestehenden Quellen laufend zusammen und legt sie einheitlich aus. Was Sie sehen, stammt aus denselben Daten, mit denen Ihre Teams ohnehin arbeiten.",
    bullets: [
      "Bestandsführung, Aktenverwaltung, Ablage und Postfach laufen in einer Sicht zusammen",
      "Kein Abtippen, kein Export von Hand — die Werte bewegen sich mit dem Vorgang",
      "Eine gemeinsame Definition je Kennzahl statt zwei Bereiche mit zwei Zahlen",
      "Jede Kennzahl ist bis zum einzelnen Vorgang zurückverfolgbar",
    ],
    imageNote:
      "Visual: mehrere Fachsysteme laufen in eine gemeinsame Kennzahlensicht; je Wert bleibt die Herkunft sichtbar.",
    imageAlt: "Kennzahlen aus mehreren Fachsystemen in einer gemeinsamen Sicht zusammengeführt",
    image: "pain-point-kpi-dashboard-feature1",
  },
  feature2: {
    h2: "Sie erfahren von der Abweichung, bevor sie eskaliert.",
    h3: "Ihre Steuerungsgrößen laufend überwacht — mit Hinweis an die zuständige Rolle",
    sub:
      "Ein Bearbeitungsstau in der Leistungsprüfung, eine Zulassungsfrist, die zu kippen droht, ein Antragsjahrgang, der die Gremien überlastet, ein Objekt mit wachsendem Leerstand: Solche Entwicklungen stehen früh in den Zahlen — nur sieht sie niemand, solange der Bericht erst zum Monatsende entsteht. NEWEDGE überwacht Ihre Steuerungsgrößen laufend und meldet Auffälligkeiten dorthin, wo sie bearbeitet werden.",
    bullets: [
      "Schwellen legen Sie fest — das System meldet sich, statt gefragt werden zu müssen",
      "Der Hinweis geht an die zuständige Rolle, nicht in einen Sammelverteiler",
      "Fristen und liegengebliebene Vorgänge fallen auf, solange Zeit zum Gegensteuern bleibt",
      "Ansichten je Rolle: die Leitung sieht die Gesamtlage, das Team seine offenen Fälle",
    ],
    imageNote:
      "Visual: Kennzahl überschreitet eine hinterlegte Schwelle; der Hinweis geht mit Vorgangsbezug an die zuständige Rolle.",
    imageAlt: "Hinweis bei Abweichungen: Schwellenwerte, Fristen und liegengebliebene Vorgänge im Blick",
    image: "pain-point-kpi-dashboard-feature2",
  },
  feature3: {
    h2: "Messen reicht nicht. Was jetzt?",
    h3: "Entscheidungen vorbereitet — mit Herkunft statt nur mit Kurve",
    sub:
      "Eine Kennzahl, die kippt, sagt noch nicht, was zu tun ist. NEWEDGE ordnet die Entwicklung ein: welche Vorgänge dahinterstehen, in welchem Bereich, seit wann — und stellt die Grundlage zusammen, auf der Ihre Leitung entscheidet. Die Entscheidung selbst bleibt bei Ihnen.",
    bullets: [
      "Jede Auffälligkeit kommt mit Herkunft: welcher Bereich, welche Vorgänge, seit wann",
      "Wiederkehrende Muster werden benannt, statt jedes Mal neu hergeleitet zu werden",
      "Vorlagen für Leitung, Vorstand oder Gremium entstehen aus derselben Datengrundlage",
      "Was sich nach einer Maßnahme verändert, ist an denselben Kennzahlen ablesbar",
    ],
    imageNote:
      "Visual: Kennzahlenverlauf mit aufgeklappter Herkunft — betroffener Bereich, dahinterliegende Vorgänge, Zeitraum — als Vorlage für die Leitungsrunde.",
    imageAlt: "Aus Kennzahlen wird eine Entscheidungsvorlage mit nachvollziehbarer Herkunft",
    image: "pain-point-kpi-dashboard-feature3",
  },
  integrations: {
    h2: "Sie wechseln kein einziges System.",
    h3: "Welche Quellen lassen sich für Steuerung und Reporting anbinden?",
    sub:
      "NEWEDGE ersetzt weder Ihre Bestandsführung noch Ihre Aktenverwaltung. Die Funktion legt sich über die Systeme, mit denen Ihre Teams heute arbeiten, und liest die Werte dort aus, wo sie ohnehin entstehen — ohne Datenmigration und ohne zweite Oberfläche, die jemand pflegen muss. Fachsysteme ohne Schnittstelle binden wir über Ihre bestehenden Ablagen, Formulare und Exporte an.",
    logos: [LOGO.outlook, LOGO.teams, LOGO.sharepoint, LOGO.googleWorkspace, LOGO.datev, LOGO.lexoffice, LOGO.docusign, LOGO.notion, LOGO.zapier],
  },
  compare: {
    h2: "Wie lange stellen Sie Ihre Zahlen noch von Hand zusammen?",
    h3: "Steuerung & Reporting vs. Bericht aus der Tabelle — der direkte Vergleich",
    altLabel: "Heute, manuell",
    rows: [
      { k: "Datenstand",                   ne: "Laufend aktuell",                    alt: "Stand des letzten Berichts" },
      { k: "Zusammenführen der Quellen",   ne: "Automatisch",                        alt: "Von Hand, Tabelle für Tabelle" },
      { k: "Abweichungen",                 ne: "Gemeldet, sobald sie entstehen",     alt: "Fallen im nächsten Bericht auf" },
      { k: "Fristen im Blick",             ne: "Laufend überwacht",                  alt: "Kalender und Gedächtnis" },
      { k: "Datengrundlage",               ne: "Eine Definition für alle Bereiche",  alt: "Je Bereich eine eigene Zahl" },
      { k: "Sicht je Rolle",               ne: "Leitung, Fachbereich, Controlling",  alt: "Ein Bericht für alle" },
      { k: "Nachvollziehbarkeit",          ne: "Bis zum einzelnen Vorgang",          alt: "Zahl ohne Herkunft" },
      { k: "Mehr Vorgänge",                ne: "Derselbe Ablauf",                    alt: "Mehr Handarbeit" },
    ],
  },
  featureCards: {
    h2: "Was sich tatsächlich ändert — ab dem ersten Bericht.",
    h3: "Dieselbe standardisierte Funktion, konfiguriert für Ihre Steuerungsgrößen",
    cards: [
      {
        title: "Bearbeitungsstand auf einen Blick",
        desc: "Wie viele Vorgänge offen sind, wie lange sie liegen und wo es hakt, steht an einer Stelle — in der Leistungsprüfung genauso wie in der Zulassung oder in der Objektverwaltung.",
        iconNote: "Icon: Kennzahlenverlauf / Bearbeitungsstand",
      },
      {
        title: "Abweichungen melden sich selbst",
        desc: "Sie hinterlegen die Schwelle, das System meldet sich — bei Bearbeitungsstau, bei ungewöhnlichem Antragsvolumen, bei steigenden offenen Forderungen.",
        iconNote: "Icon: Hinweisglocke / Frühwarnung",
      },
      {
        title: "Jede Rolle sieht, was sie braucht",
        desc: "Leitung, Fachbereich und Controlling arbeiten auf derselben Datengrundlage in unterschiedlichem Zuschnitt — nicht mehr, als für die jeweilige Entscheidung nötig ist.",
        iconNote: "Icon: Nutzerrollen / Personas",
      },
      {
        title: "Zahlen mit Herkunft",
        desc: "Zu jeder Auffälligkeit gehört, woher sie kommt: welcher Bereich, welche Vorgänge, seit wann. Ihre Leitung entscheidet auf einer Grundlage, die sie prüfen kann.",
        iconNote: "Icon: Einordnung / Herleitung",
      },
      {
        title: "Fristen laufen nicht mehr davon",
        desc: "Laufende Fristen in Antrags-, Zulassungs- und Vertragsvorgängen werden überwacht und rechtzeitig gemeldet, statt im nächsten Turnus aufzufallen.",
        iconNote: "Icon: Kalender mit Fristprüfung",
      },
      {
        title: "Eine Datengrundlage für alle Bereiche",
        desc: "Bestand, Auslastung, Verfahrensstand und offene Forderungen kommen aus derselben Quelle. Die Diskussion darüber, wessen Zahl stimmt, entfällt.",
        iconNote: "Icon: Gemeinsame Datenbasis / Single Source of Truth",
      },
    ],
  },
  /**
   * Kein Kundenzitat: für diese Funktion existiert kein freigegebenes
   * Referenzprojekt und kein belegter Messwert. Bewusst als Haltungsaussage
   * von NEWEDGE formuliert, ohne Zahl.
   */
  testimonialHero: {
    quote:
      "Steuerung ist keine Software-Frage. Wir sorgen dafür, dass die Zahlen vollständig, aktuell und bis zum Vorgang nachvollziehbar vorliegen — welche Konsequenz daraus folgt, entscheidet Ihre Leitung.",
    author: "NEWEDGE — Arbeitsprinzip",
  },
  faq: [
    {
      q: "Ist das ein weiteres BI-Tool wie Power BI oder Tableau?",
      a: "Nein. Klassische BI-Werkzeuge liefern die Oberfläche — Aufbau, Definitionen und Pflege müssen Sie stellen. NEWEDGE liefert die Funktion konfiguriert: Quellen angebunden, Kennzahlen nach Ihren Definitionen ausgelegt, Hinweise an die zuständigen Rollen. Ohne eigenes BI-Team und ohne IT-Projekt.",
    },
    {
      q: "Welche Quellen lassen sich für Steuerung und Reporting anbinden?",
      a: "Ihre Bestandsführung, Aktenverwaltung, Ablagen, Formulare und Postfächer — also die Systeme, in denen die Vorgänge ohnehin entstehen. Fachsysteme mit Schnittstelle werden direkt angebunden, für die übrigen arbeiten wir über die Wege, die Sie heute schon nutzen. Ihre Daten bleiben, wo sie liegen.",
    },
    {
      q: "Können wir unsere eigenen Kennzahlen definieren?",
      a: "Ja. Welche Größen Sie steuern und wie sie berechnet werden, geben Sie vor — Bearbeitungsstand, Schadenquote, Auslastung, Verfahrensstand, Leerstand oder was in Ihrem Haus sonst zählt. NEWEDGE bildet Ihre Definition ab, statt eine eigene mitzubringen.",
    },
    {
      q: "Kann jede Rolle eine eigene Ansicht bekommen?",
      a: "Ja, rollenbasierte Ansichten sind Standard. Die Leitung sieht die Gesamtlage, der Fachbereich seine offenen Vorgänge, das Controlling die Herleitung bis zum Einzelfall. Wer welche Daten sieht, legen Sie fest.",
    },
    {
      q: "Trifft das System Entscheidungen über Fälle oder Verfahren?",
      a: "Nein. Es konsolidiert Daten, überwacht Kennzahlen, erkennt Abweichungen und bereitet Entscheidungen vor. Was daraus folgt — Priorisierung, Ressourcen, Verfahrensschritte — entscheidet Ihr Haus, und die Grundlage ist dabei nachvollziehbar dokumentiert.",
    },
    {
      q: "Bauen Sie für jede Branche eine eigene Lösung?",
      a: "Nein. Steuerung & Reporting ist eine von vier standardisierten Funktionen, die auf derselben Infrastruktur laufen. Für Versicherer wird sie auf Bearbeitungsstand, Schadenquote, Bestand und Servicelevel konfiguriert, für Hochschulen auf Bewerberzahlen, Auslastung und Fristen, für Förderstellen auf Verfahrensstand, Antragsvolumen und Gremienlast, für die Immobilienverwaltung auf Leerstand, Instandhaltungsfälle und offene Forderungen. Konfiguriert, nicht neu gebaut.",
    },
    {
      q: "Wer betreut die Steuerungssicht nach dem Start?",
      a: "NEWEDGE übernimmt Betrieb, Anpassungen und neue Kennzahlen, wenn sich Ihre Steuerung ändert. Sie haben einen festen Ansprechpartner statt einer anonymen Support-Warteschlange.",
    },
  ],
  closingCta: {
    h2Line1: "Ein Blick auf Ihre Lage —",
    h2Line2Highlighted: "statt drei Tabellen und einer Rückfrage.",
    sub: "Wir gehen Ihre Steuerungsgrößen durch und zeigen, was davon zusammenlaufen kann.",
    ctaPrimary: "Demo buchen",
    ctaSecondary: "Gespräch vereinbaren",
  },
};

/* ──────────────────────────────────────────────────────────────
   PAIN POINT E — Service & Fallbearbeitung
────────────────────────────────────────────────────────────── */
const kiKundensupport: PainPointContent = {
  slug: "service-fallbearbeitung",
  seo: {
    title: "Service & Fallbearbeitung automatisieren mit KI | NEWEDGE",
    description:
      "NEWEDGE nimmt wiederkehrende Anfragen auf, beantwortet sie im Fachkontext und übergibt komplexe Fälle mit vollständigem Kontext an Ihr Team. Rund um die Uhr.",
    canonical: "/loesungen/service-fallbearbeitung",
  },
  hero: {
    overlabel: "SERVICE & FALLBEARBEITUNG · KONFIGURIERT FÜR IHREN FACHKONTEXT",
    h1Line1: "Die immer gleiche Anfrage",
    h1Line2Highlighted: "landet nicht mehr auf Ihrem Tisch.",
    sub:
      "So automatisieren wir Service und Fallbearbeitung. Wiederkehrende Anfragen werden aus Ihrem geprüften Wissen beantwortet — unklare Fälle gehen mit Kontext an Ihr Team.",
    ctaPrimary: "Demo buchen",
    ctaSecondary: "Gespräch vereinbaren",
    imageNote:
      "Eingang über Telefon, Mail und Portal → Anliegen erkannt und dem Vorgang zugeordnet → beantwortet oder mit vollständigem Kontext an die zuständige Person übergeben.",
    imageAlt: "Anfragen werden aufgenommen, im Fachkontext beantwortet oder mit vollständigem Kontext übergeben",
    image: "pain-point-kundensupport-hero",
  },
  trustBar: {
    headline: "Für Häuser, bei denen jeden Tag dieselben Fragen ankommen",
    sub: "Dieselben Bausteine — in Versicherung, Bildung, Förderung und Immobilien",
    logos: ["Versicherer", "Makler", "Hochschulen", "Bildungsträger", "Fördergeber", "Stiftungen", "Hausverwaltung"],
  },
  definition: {
    title: "Was ist automatisierte Service- und Fallbearbeitung?",
    body:
      "Automatisierte Service- und Fallbearbeitung nimmt wiederkehrende Anfragen über alle Eingangswege auf, ordnet sie dem richtigen Vorgang zu und beantwortet oder bearbeitet sie aus dem geprüften Wissensstand Ihres Hauses. Alles, was eine fachliche Entscheidung braucht, geht mit vollständigem Kontext an die zuständige Person. Es ist eine von vier standardisierten Funktionen auf derselben Infrastruktur — konfiguriert für Ihren Fachkontext, nicht als eigenständiges Support-Produkt gebaut.",
  },
  feature1: {
    h2: "Wiederkehrende Anfragen — beantwortet, ohne dass jemand nachschlagen muss.",
    h3: "Anliegen aufnehmen und im Fachkontext beantworten, rund um die Uhr",
    sub:
      "Der Makler fragt nach dem Schadenstand, der Studierende nach der Frist für seine Unterlagen, der Antragsteller nach dem nächsten Verfahrensschritt, der Mieter meldet einen tropfenden Heizkörper. NEWEDGE nimmt das Anliegen auf, ordnet es dem laufenden Vorgang zu und antwortet aus Ihrem geprüften Wissensstand — in Ihrer Tonalität, auch abends und am Wochenende.",
    bullets: [
      "Ein Eingang für Telefon, Mail und Portal",
      "Antwort aus Ihrem freigegebenen Wissensstand, nicht aus freier Erfindung",
      "Auskunft zum Stand des Vorgangs statt Verweis auf die Sachbearbeitung",
    ],
    imageNote: "Anfrage läuft ein → Anliegen erkannt und dem Vorgang zugeordnet → Antwort geht raus.",
    imageAlt: "Wiederkehrende Anliegen werden aufgenommen und im Fachkontext beantwortet",
    image: "pain-point-kundensupport-feature1",
  },
  feature2: {
    h2: "Komplexe Fälle — übergeben, nicht weitergereicht.",
    h3: "Routing an die zuständige Stelle, mit vollständigem Kontext",
    sub:
      "Sobald ein Anliegen eine fachliche Entscheidung verlangt, geht es an die zuständige Person — mit dem bisherigen Verlauf, dem Stand des Vorgangs und den bereits vorliegenden Unterlagen. Niemand muss sein Anliegen ein zweites Mal schildern, und niemand beginnt die Recherche von vorn. Dringliche Fälle werden erkannt und vorgezogen.",
    bullets: [
      "Zuordnung an die fachlich zuständige Stelle",
      "Vollständiger Verlauf und Vorgangsstand liegen bei",
      "Dringlichkeit wird erkannt und in der Reihenfolge berücksichtigt",
    ],
    imageNote: "Übergabe an die zuständige Person mit Kontext-Badge am Vorgang.",
    imageAlt: "Übergabe komplexer Fälle an die zuständige Stelle mit vollständigem Vorgangskontext",
    image: "pain-point-kundensupport-feature2",
  },
  feature3: {
    h2: "Was oft gefragt wird, sehen Sie — bevor daraus ein Rückstau wird.",
    h3: "Anliegen als Signal: wiederkehrende Themen werden sichtbar",
    sub:
      "Wenn sich Rückfragen zu einer Frist, einem Formular oder einem Verfahrensschritt häufen, liegt das selten an den Fragenden. NEWEDGE zeigt, welche Anliegen wiederkehren und an welcher Stelle Ihres Ablaufs sie entstehen — damit Sie die Ursache abstellen, statt dauerhaft dieselbe Antwort zu geben.",
    bullets: [
      "Wiederkehrende Anliegen werden gebündelt sichtbar",
      "Erkennbar, an welcher Stelle im Ablauf Rückfragen entstehen",
      "Grundlage für Formulare und Hinweise, die weniger Rückfragen erzeugen",
    ],
    imageNote: "Wiederkehrende Anliegen nach Thema gebündelt, mit Bezug zum Verfahrensschritt.",
    imageAlt: "Wiederkehrende Anliegen gebündelt nach Thema und Stelle im Ablauf",
    image: "pain-point-kundensupport-feature3",
  },
  integrations: {
    h2: "Verbindet sich mit Ihren Systemen",
    h3: "Welche Systeme lassen sich für Service und Fallbearbeitung anbinden?",
    sub: "Anbindung an Postfach, Kalender, Bestands- und Verwaltungssysteme sowie an gängige Servicesoftware — nativ oder über Schnittstelle.",
    logos: [LOGO.outlook, LOGO.teams, LOGO.googleWorkspace, LOGO.salesforce, LOGO.hubspot, LOGO.sharepoint, LOGO.zendesk, LOGO.freshdesk, LOGO.zapier],
  },
  compare: {
    h2: "Service & Fallbearbeitung mit NEWEDGE — und ohne",
    h3: "Was sich in der täglichen Bearbeitung ändert",
    altLabel: "Heute üblich",
    rows: [
      { k: "Erreichbarkeit", ne: "Auch außerhalb der Bürozeiten", alt: "Nur zu Sprechzeiten" },
      { k: "Erste Reaktion", ne: "Unmittelbar nach Eingang", alt: "Sobald jemand dazu kommt" },
      { k: "Auskunft zum Stand", ne: "Direkt aus dem Vorgang", alt: "Rückruf nach Recherche" },
      { k: "Spitzenlast", ne: "Wird mit aufgenommen", alt: "Rückstau und Wartezeit" },
      { k: "Übergabe an Menschen", ne: "Mit vollständigem Kontext", alt: "Anliegen wird neu geschildert" },
      { k: "Antwortqualität", ne: "Überall derselbe Wissensstand", alt: "Je nach Person und Tagesform" },
    ],
  },
  featureCards: {
    h2: "Aufgenommen, beantwortet, übergeben — im richtigen Fachkontext.",
    h3: "Was Service & Fallbearbeitung in Ihrem Haus leistet",
    cards: [
      {
        title: "Anliegen aufnehmen",
        desc: "Telefon, Mail und Portal laufen an einer Stelle zusammen.",
        iconNote: "Animation: Anfragen laufen aus drei Kanälen zusammen",
        icon: "ppe-icon-speed",
      },
      {
        title: "Übergabe mit Kontext",
        desc: "Komplexe Fälle gehen vollständig informiert an Ihr Team.",
        iconNote: "Animation: Vorgang wandert mit Kontext-Badge zur zuständigen Person",
        icon: "ppe-icon-route",
      },
      {
        title: "Wiederkehrende Themen",
        desc: "Sie sehen, welche Rückfragen sich häufen — und woher sie kommen.",
        iconNote: "Animation: Anliegen bündeln sich nach Thema",
        icon: "ppe-icon-analytics",
      },
    ],
  },
  testimonialHero: {
    quote:
      "Ein Service-Agent darf keine eigene Wahrheit erfinden. Er antwortet aus Ihrem geprüften Wissensstand, nennt den Stand des Vorgangs — und übergibt an einen Menschen, sobald der Fall nicht eindeutig ist. Mit vollständigem Kontext, damit niemand seine Frage ein zweites Mal stellen muss.",
    author: "NEWEDGE — Arbeitsprinzip",
  },
  faq: [
    {
      q: "Was passiert, wenn das System eine Antwort nicht sicher weiß?",
      a: "Dann antwortet es nicht. Grundlage sind ausschließlich Ihr freigegebener Wissensstand und der Stand des Vorgangs. Fehlt die Grundlage oder verlangt der Fall eine fachliche Entscheidung, geht er mit vollständigem Kontext an Ihr Team, statt geraten zu werden.",
    },
    {
      q: "Bauen Sie für jede Branche eine eigene Lösung?",
      a: "Nein. Service & Fallbearbeitung ist eine von vier standardisierten Funktionen, die auf derselben Infrastruktur laufen. Für Versicherer wird sie auf Makler- und Kundenanfragen zu Vertrag, Beitrag und Schadenstand konfiguriert, für Hochschulen und Bildungsträger auf den Studierendenservice mit Fristen, Unterlagen und Status, für Förderstellen auf Rückfragen von Antragstellern zu Verfahren und Nachweisen, für die Immobilienverwaltung auf Mieteranliegen, Instandhaltungsmeldungen und die Weiterleitung ans Handwerk. Konfiguriert, nicht neu gebaut.",
    },
    {
      q: "Woher weiß das System, was in unserem Haus gilt?",
      a: "Aus Ihrem eigenen Material: Regelwerk, Merkblätter, Fristen, Standardantworten und bisheriger Schriftverkehr. Was dort nicht hinterlegt ist, wird nicht beantwortet, sondern übergeben.",
    },
    {
      q: "In welchen Sprachen kann geantwortet werden?",
      a: "Deutsch, Englisch und weitere gängige Sprachen — je nachdem, wer sich bei Ihnen meldet. Mehrsprachig über denselben Eingang.",
    },
    {
      q: "Wer betreut die Service-Funktion nach dem Start?",
      a: "NEWEDGE übernimmt Betrieb und Anpassungen, wenn sich Fristen, Formulare oder Zuständigkeiten ändern. Sie haben dafür einen festen Ansprechpartner.",
    },
  ],
  closingCta: {
    h2Line1: "Die nächste Rückfrage",
    h2Line2Highlighted: "ist schon beantwortet.",
    sub: "Wir gehen Ihre häufigsten Anliegen durch und zeigen, welche davon ohne Ihr Team laufen können.",
    ctaPrimary: "Demo buchen",
    ctaSecondary: "Gespräch vereinbaren",
  },
};

/* ──────────────────────────────────────────────────────────────
   INDUSTRIE 1 — Entscheidungsinstanzen
────────────────────────────────────────────────────────────── */
const entscheidungsinstanzen: PainPointContent = {
  slug: "foerderungen-entscheidungsinstanzen",
  seo: {
    title: "Bewertungssoftware für Förder- und Vergabestellen | NEWEDGE",
    description:
      "Revisionssichere Antrags-, Auswahl- und Vergabeverfahren für Förderstellen, Jurys und Hochschulen — DSGVO-konform, VgV/UVgO-tauglich. Jetzt Demo buchen.",
    canonical: "/industrien/foerderungen-entscheidungsinstanzen",
  },
  hero: {
    overlabel: "FÜR FÖRDERSTELLEN · AWARDS · HOCHSCHULEN · VERGABESTELLEN",
    h1Line1: "Sie entscheiden über andere.",
    h1Line2Highlighted: "Wer entscheidet für Sie?",
    sub:
      "So verändert eine KI-Abteilung Förder- und Entscheidungsverfahren. Sie entscheiden nach Ihrem eigenen Regelwerk — strukturiert, fair und revisionssicher.",
    ctaPrimary: "Demo buchen",
    ctaSecondary: "Case: BMP Award ansehen",
    imageNote:
      "Visual: Stapel unstrukturierter Einreichungen → strukturiertes Gremien-Cockpit mit Scoring, Audit-Trail und Vergleichbarkeit.",
    imageAlt: "Vorher: Einreichungs-Chaos — Nachher: strukturiertes Entscheidungs-Cockpit",
    image: "pain-point-entscheidungsinstanzen-hero",
  },
  trustBar: {
    headline: "Entscheidungsinstanzen in Deutschland vertrauen uns.",
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
      "Was früher aufwendige Koordination von Hand bedeutete, läuft mit NEWEDGE jetzt automatisch — und die Qualität unserer Entscheidungen ist spürbar besser geworden.",
    author: "BMP Award — Projektleitung",
  },
  faq: [
    {
      q: "Wie lange dauert die Einrichtung eines KI-Bewertungssystems?",
      a: "Der Ablauf ist immer derselbe: Import Ihrer bestehenden Kriterienkataloge, Konfiguration der Gewichtungen, Testphase mit echten Bewerbungsunterlagen, dann der produktive Start. Wie lange das dauert, hängt vom Umfang des Regelwerks ab — den Zeitplan legen wir vorab gemeinsam fest.",
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
  // howTo: bewusst weggelassen — `totalTime` ("P14D") war eine unbelegte
  // Zeitangabe und wurde als JSON-LD ausgespielt. Gleiche Handhabung wie bei
  // Versicherungen, Bildung und Immobilien.
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
    headline: "Arztpraxen, MVZ und Therapeuten im DACH-Raum vertrauen uns.",
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
    headline: "Mittelständische Handels- und Logistikunternehmen in DACH vertrauen uns.",
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
    headline: "Beratungs- und Professional-Services-Unternehmen in DACH vertrauen uns.",
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

/* ──────────────────────────────────────────────────────────────
   INDUSTRIE 5 — Versicherungen
   Vertical Profile, KEIN eigenes Produkt: dieselben vier Blueprints,
   konfiguriert für Schaden, Vertrag, Service und Steuerung.
   KEINE Zahlen, keine Zeitersparnis, keine Kundenzahlen, keine
   Durchlaufzeiten — für diese Branche existieren keine Messwerte.
   Keine Aussagen zu VAG, BaFin oder Zulassungsfragen.
────────────────────────────────────────────────────────────── */
const versicherungen: PainPointContent = {
  slug: "versicherungen",
  seo: {
    title: "KI in der Versicherung: Schadenmeldung & Deckung | NEWEDGE",
    description:
      "Schadenmeldung erfasst, Deckungsprüfung vorbereitet, Bestandsführung abgeglichen: Der Leistungsfall kommt entscheidungsreif an. Jetzt Demo buchen.",
    canonical: "/industrien/versicherungen",
  },
  hero: {
    overlabel: "FÜR VERSICHERER · MAKLER · ASSEKURADEURE",
    h1Line1: "Die Entscheidung bleibt bei Ihnen.",
    h1Line2Highlighted: "Die Vorarbeit nicht.",
    sub:
      "So verändert eine KI-Abteilung Versicherungen. Schadenfälle kommen geprüft und entscheidungsreif bei Ihnen an – jeder Schritt nachvollziehbar dokumentiert.",
    ctaPrimary: "Demo buchen",
    ctaSecondary: "Gespräch vereinbaren",
    imageNote:
      "Visual: Schadenmeldung mit verstreuten Anhängen und Mail-Verlauf → aufgeräumte Fallakte mit Vollständigkeitsstatus, Deckungshinweis und markierten Auffälligkeiten.",
    imageAlt: "Vorher: unvollständige Schadenmeldung — Nachher: entscheidungsreife Fallakte",
    image: "pain-point-versicherungen-hero",
    // image: bewusst weggelassen — es existiert noch kein passender ImageKey in assets.ts.
  },
  trustBar: {
    headline: "Für Versicherer, Makler und Assekuradeure im deutschsprachigen Raum",
    sub: "Schaden, Leistung, Betrieb, Vertrieb, Makler- und Kundenservice",
    logos: ["Versicherer", "Makler", "Assekuradeur", "Schadenabteilung", "Vertragsservice"],
  },
  definition: {
    title: "Was heißt KI-Abteilung für ein Versicherungsunternehmen?",
    body:
      "Eine KI-Abteilung ist kein neues Kernsystem, sondern eine Schicht über dem, was Sie bereits nutzen. Sie nimmt Schadenmeldungen, Anträge und Anfragen auf, prüft Unterlagen auf Vollständigkeit, gleicht sie gegen Ihr Bedingungswerk und Ihre Bestandsführung ab und legt eine vollständige Vorgangsakte vor. Welche Vorgänge Ihre eigenen Regeln so eindeutig abdecken, dass sie für Dunkelverarbeitung in Frage kommen, legen Sie fest; jeder Leistungsfall mit Ermessensspielraum geht an Ihre Sachbearbeitung. Bewertet, freigegeben und reguliert wird weiterhin in Ihrem Haus — nur ohne die Sucharbeit davor.",
  },
  /* FEATURE 01 — Entscheidungen & Fallprüfung, konfiguriert für Schaden und Leistung */
  feature1: {
    image: "pain-point-versicherungen-feature1",
    h2: "Der Fall liegt entscheidungsreif auf dem Tisch.",
    h3: "Entscheidungen & Fallprüfung, konfiguriert für Schaden und Leistung",
    sub:
      "Bis ein Leistungsfall entschieden werden kann, geht die meiste Zeit für Nachfassen drauf: Welcher Nachweis fehlt, was sagen die Bedingungen, gab es Vorschäden? NEWEDGE übernimmt diese Vorarbeit — Schadenmeldung aufnehmen, Unterlagen anfordern und prüfen, Deckungsprüfung gegen das Bedingungswerk vorbereiten, Auffälligkeiten kennzeichnen. Ihr Sachbearbeiter bekommt eine fertige Vorgangsakte statt Rohmaterial. Entschieden und reguliert wird weiterhin bei Ihnen.",
    bullets: [
      "Die Vorgangsakte ist vollständig, bevor jemand sie öffnet — fehlende Nachweise sind bereits angefordert",
      "Deckungsprüfung vorbereitet gegen Ihr Bedingungswerk — mit Fundstelle statt aus dem Gedächtnis",
      "Auffälligkeiten sind markiert statt übersehen — auch Vorschäden und Unstimmigkeiten in den Angaben",
    ],
    imageNote:
      "Visual: Fallakte Schaden mit Vollständigkeits-Check, Deckungshinweis samt Fundstelle im Bedingungswerk und markierten Auffälligkeiten.",
    imageAlt: "Vorbereitete Schadenakte mit Vollständigkeitsprüfung und Deckungshinweis",
    // image: bewusst weggelassen → Fallback "painpoint-a-section3".
  },
  /* FEATURE 02 — Dokumente & Prozesse, konfiguriert für Vertragsunterlagen */
  feature2: {
    image: "pain-point-versicherungen-feature2",
    h2: "Antrag, Nachtrag, Kündigung — sortiert statt gestapelt.",
    h3: "Dokumente & Prozesse, konfiguriert für Policen und Vertragsunterlagen",
    sub:
      "Anträge kommen als PDF, Nachweise als Foto, Kündigungen per Mail — und am Ende muss alles sauber im Bestand stehen. NEWEDGE erfasst die Unterlagen, erkennt, worum es geht, liest die relevanten Daten aus, prüft auf Vollständigkeit und gleicht sie mit Ihrer Bestandsführung ab. Was nicht zusammenpasst, kommt mit Hinweis zu Ihnen statt ungeprüft ins System.",
    bullets: [
      "Eingehende Unterlagen sind zugeordnet und ausgelesen, bevor jemand sie anfasst",
      "Fehlende Angaben fallen beim Eingang auf, nicht erst mitten in der Bearbeitung",
      "Abweichungen zum Bestand werden gemeldet statt stillschweigend übernommen",
    ],
    imageNote:
      "Visual: gemischter Posteingang aus Antrag, Nachtrag und Nachweisfoto → geordnete Vertragsakte mit Vollständigkeitsstatus und markierter Abweichung zum Bestand.",
    imageAlt: "Vertragsunterlagen automatisch erfasst, geprüft und mit dem Bestand abgeglichen",
    // image: bewusst weggelassen → Fallback "painpoint-a-feature2".
  },
  /* FEATURE 03 — Service & Fallbearbeitung, konfiguriert für Makler- und Kundenanfragen */
  feature3: {
    image: "pain-point-versicherungen-feature3",
    h2: "Makler und Kunden bekommen schneller Antwort.",
    h3: "Service & Fallbearbeitung, konfiguriert für Vertrags- und Schadenanfragen",
    sub:
      "Ein großer Teil der Anfragen wiederholt sich: Stand des Schadens, Beitragsänderung, fehlender Nachweis, geänderte Adresse. NEWEDGE nimmt sie auf, versteht das Anliegen und beantwortet es im Rahmen Ihrer Vorgaben oder bereitet es vor. Was fachlich entschieden werden muss, geht mit vollständigem Kontext an die zuständige Person.",
    bullets: [
      "Wiederkehrende Vertrags- und Schadenanfragen sind beantwortet, ohne Warteschlange",
      "Komplexe Fälle landen bei der richtigen Person — mit Vertrag, Verlauf und Unterlagen",
      "Der Bearbeitungsstand ist einsehbar, statt telefonisch erfragt werden zu müssen",
    ],
    imageNote:
      "Visual: Anfragen aus Mail, Maklerportal und Telefon → eine Ansicht mit Anliegen, Vertragsbezug, Antwortentwurf und klarer Übergabe an die Fachabteilung.",
    imageAlt: "Makler- und Kundenanfragen gebündelt mit Vertragsbezug und Antwortentwurf",
    // image: bewusst weggelassen → Fallback "painpoint-a-feature3".
  },
  integrations: {
    h2: "Verbindet sich mit den Systemen, die Sie bereits nutzen.",
    h3: "Welche Systeme lassen sich in Schaden- und Vertragsprozesse einbinden?",
    sub:
      "Kein System, das Ihre Bestandsführung ersetzt. NEWEDGE legt sich über die Werkzeuge, mit denen Ihre Teams heute arbeiten, und übernimmt die Schritte dazwischen.",
    logos: [
      LOGO.outlook,
      LOGO.teams,
      LOGO.sharepoint,
      LOGO.googleWorkspace,
      LOGO.docusign,
      LOGO.salesforce,
      LOGO.zendesk,
      LOGO.zapier,
      LOGO.make,
    ],
  },
  compare: {
    h2: "NEWEDGE vs. manuelle Schaden- und Vertragsbearbeitung",
    h3: "Dieselben Bausteine, konfiguriert für Versicherung — im direkten Vergleich",
    altLabel: "Heute, manuell",
    rows: [
      { k: "Schadenmeldung erfassen", ne: "Strukturiert, aus jedem Kanal", alt: "Mail, PDF, Telefonnotiz" },
      { k: "Unterlagen nachfordern", ne: "Automatisch, mit Nachverfolgung", alt: "Manuelles Nachfassen" },
      { k: "Deckungsprüfung", ne: "Vorgeprüft, mit Fundstelle", alt: "Nachlesen im Bedingungswerk" },
      { k: "Bestandsführung", ne: "Abgeglichen, Abweichung gemeldet", alt: "Abtippen aus Dokumenten" },
      { k: "Makler- und Kundenanfragen", ne: "Beantwortet oder vorbereitet", alt: "Rückruf, wenn Zeit ist" },
      { k: "Steuerung & Reporting", ne: "Bestand und Stau in einer Sicht", alt: "Mehrere Systeme, mehrere Zahlen" },
      { k: "Entscheidung & Freigabe", ne: "Bleibt bei Ihrem Sachbearbeiter", alt: "Bleibt bei Ihrem Sachbearbeiter" },
    ],
  },
  featureCards: {
    h2: "Sie entscheiden. Den Fall stellen wir zusammen.",
    h3: "Was NEWEDGE in Schaden, Vertrag und Service konkret übernimmt",
    cards: [
      {
        title: "Entscheidungsreife Fälle",
        desc: "Meldung, Unterlagen, Deckungsfrage und Auffälligkeiten sind geprüft und zusammengestellt, bevor Ihr Sachbearbeiter den Fall öffnet.",
        iconNote: "Icon: Fallakte mit Häkchen und Warnmarkierung",
        // icon: bewusst weggelassen — wird von der Komponente ohnehin ignoriert.
      },
      {
        title: "Unterlagen ohne Handarbeit",
        desc: "Anträge, Nachträge und Nachweise werden erfasst, geprüft und mit dem Bestand abgeglichen. Abweichungen kommen mit Hinweis zu Ihnen.",
        iconNote: "Icon: Dokumentenstapel → strukturiertes Datenblatt",
      },
      {
        title: "Steuerung an einem Ort",
        desc: "Bestand, offene Fälle, Bearbeitungsstau und Servicelevel laufen in einer Sicht zusammen, statt in mehreren Systemen zu liegen.",
        iconNote: "Icon: Dashboard mit Kennzahlkacheln",
      },
    ],
  },
  /**
   * Kein Kundenzitat: für diese Branche existiert kein Referenzprojekt.
   * Bewusst als Haltungsaussage von NEWEDGE formuliert, ohne Zahl.
   */
  testimonialHero: {
    quote:
      "Für Versicherungen gilt dasselbe wie überall: Wir übernehmen die wiederkehrende Prüfung und Vorbereitung, nicht das Urteil. Ob ein Anspruch anerkannt wird, entscheidet Ihr Haus — wir sorgen dafür, dass die Grundlage vollständig und nachvollziehbar vorliegt.",
    author: "NEWEDGE — Arbeitsprinzip",
  },
  faq: [
    {
      q: "Entscheidet die KI über Schaden- und Leistungsfälle?",
      a: "Nein. NEWEDGE nimmt die Schadenmeldung auf, prüft die Unterlagen auf Vollständigkeit, bereitet die Deckungsprüfung gegen Ihr Bedingungswerk vor und kennzeichnet Auffälligkeiten. Anerkennung, Ablehnung und Regulierungshöhe entscheidet Ihr Sachbearbeiter — auf einer Grundlage, die vollständig vor ihm liegt.",
    },
    {
      q: "Bauen Sie für Versicherungen eine eigene Software?",
      a: "Nein. Es sind dieselben standardisierten Funktionen wie in jeder anderen Branche: Entscheidungen & Fallprüfung, Dokumente & Prozesse, Steuerung & Reporting sowie Service & Fallbearbeitung. Für Ihr Haus werden sie auf Ihre Sparten, Bedingungswerke und Abläufe konfiguriert — kein Individualprojekt von null.",
    },
    {
      q: "Müssen wir unser Bestandssystem wechseln?",
      a: "Nein. NEWEDGE ersetzt kein Kernsystem. Die Bausteine docken an das an, womit Sie heute arbeiten — Postfach, Dokumentenablage, Ticketsystem, Bestandsführung — und übernehmen die Schritte dazwischen. Ihre Daten bleiben dort, wo sie liegen.",
    },
    {
      q: "Woher weiß das System, was in unseren Bedingungen steht?",
      a: "Sie hinterlegen Bedingungswerke, Klauseln und interne Prüfregeln. NEWEDGE arbeitet ausschließlich damit und verweist bei jeder Vorprüfung auf die Stelle, aus der die Einschätzung stammt. Was nicht eindeutig abgedeckt ist, wird als offener Punkt an Ihre Fachabteilung übergeben statt entschieden.",
    },
    {
      q: "Wie gehen Sie mit personenbezogenen Daten und Nachweisen um?",
      a: "Die Verarbeitung erfolgt DSGVO-konform, mit Rollen- und Zugriffsrechten und auf Wunsch in deutscher Cloud oder in Ihrer eigenen Infrastruktur. Jeder Bearbeitungsschritt wird protokolliert, damit Auskunfts-, Nachweis- und Aufbewahrungspflichten erfüllbar bleiben.",
    },
    {
      q: "Womit fangen Versicherer und Makler typischerweise an?",
      a: "Mit einem klar abgegrenzten Ausschnitt — etwa einer Sparte in der Schadenregulierung oder dem Posteingang für Vertragsunterlagen. Dort lässt sich das Ergebnis direkt gegen Ihre bisherige Bearbeitung halten, und es zeigt sich, welche Vorgänge Ihre Regeln vollständig abdecken und damit für Dunkelverarbeitung infrage kommen — bevor weitere Sparten, Prozesse oder der Service dazukommen.",
    },
  ],
  // howTo: bewusst weggelassen — `totalTime` wäre eine unbelegte Zeitangabe.
  // miniCases: nicht zuweisen (SHOW_MINI_CASES = false, keine Fälle in dieser Branche).
  closingCta: {
    h2Line1: "Die Prüfung übernehmen wir.",
    h2Line2Highlighted: "Die Entscheidung bleibt bei Ihnen.",
    sub: "Ein Gespräch darüber, welcher Ausschnitt bei Ihnen zuerst Sinn ergibt.",
    ctaPrimary: "Demo buchen",
    ctaSecondary: "Gespräch vereinbaren",
  },
};

/* ──────────────────────────────────────────────────────────────
   INDUSTRIE 6 — Bildung
   Vertical Profile, KEIN eigenes Produkt: dieselben vier Blueprints,
   konfiguriert für Zulassung, Nachweise und Studierendenservice.
   KEINE Zahlen, keine Zeitersparnis, keine Fallzahlen, keine
   Durchlaufzeiten — für diese Branche existieren keine Messwerte.
   Zulassungs- und Prüfungsentscheidungen bleiben beim Gremium.
────────────────────────────────────────────────────────────── */
const bildung: PainPointContent = {
  slug: "bildung",
  seo: {
    title: "Zulassung & Immatrikulation: KI für Hochschulen | NEWEDGE",
    description:
      "Bewerbermanagement, Zulassungsverfahren und Studierendensekretariat für Hochschulen und Bildungsträger — geprüft und dokumentiert. Jetzt Demo buchen.",
    canonical: "/industrien/bildung",
  },
  hero: {
    overlabel: "FÜR HOCHSCHULEN · AKADEMIEN · BILDUNGSTRÄGER · SCHULEN",
    h1Line1: "Zulassung entscheidet Ihre Kommission.",
    h1Line2Highlighted: "Die Vorarbeit übernehmen wir.",
    sub:
      "So verändert eine KI-Abteilung den Bildungsbetrieb. Vollständige Bewerbungen, klare Zulassungsentscheidungen — und Ihr Studierendenservice hat Zeit für echte Anliegen.",
    ctaPrimary: "Demo buchen",
    ctaSecondary: "Gespräch vereinbaren",
    imageNote:
      "Visual: Stapel aus PDF-Bewerbungen, Zeugniskopien und Mail-Anhängen → geordnete Bewerbungsübersicht mit Vollständigkeits-Status und markierten Sonderfällen.",
    imageAlt:
      "Vorher: Bewerbungsunterlagen als Stapel — Nachher: geprüfte Bewerbungsübersicht für die Kommission",
    image: "pain-point-bildung-hero",
    // image: bewusst weggelassen — es existiert noch kein Motiv in assets.ts.
  },
  trustBar: {
    headline: "Gebaut für Zulassung, Nachweise und Studierendenservice",
    sub: "Hochschulen, Akademien, Bildungsträger, Schulträger, Weiterbildung",
    logos: ["Hochschule", "Akademie", "Bildungsträger", "Schulträger", "Weiterbildung"],
  },
  definition: {
    title: "Was ist eine KI-Abteilung für Hochschulen und Bildungsträger?",
    body:
      "Eine gemietete Abteilung statt neuer Fachsoftware: NEWEDGE betreibt vier standardisierte Bausteine — Entscheidungen & Fallprüfung, Dokumente & Prozesse, Steuerung & Reporting, Service & Fallbearbeitung — und konfiguriert sie für Ihren Kontext. In der Bildung heißt das: Bewerbermanagement und Zulassungsverfahren laufen vorbereitet, Nachweise werden auf Vollständigkeit geprüft und an Ihren Zulassungskriterien gespiegelt, das Studierendensekretariat wird von wiederkehrenden Fragen entlastet. Die Zulassung entscheidet Ihre Kommission.",
  },
  /* FEATURE 01 — Entscheidungen & Fallprüfung */
  feature1: {
    image: "pain-point-bildung-feature1",
    h2: "Jede Bewerbung nach denselben Maßstäben.",
    h3: "Entscheidungen & Fallprüfung, konfiguriert für Zulassungsverfahren",
    sub:
      "Bewerbungen treffen in unterschiedlichen Formaten ein, Nachweise fehlen, und die Kommission sichtet Mappe für Mappe. NEWEDGE übernimmt das Bewerbermanagement bis zur Sichtung: Bewerbungen aufnehmen, geforderte Nachweise prüfen, Ihre Zulassungskriterien anwenden, Sonderfälle kennzeichnen. Die Kommission bekommt eine vorbereitete Vorlage statt eines Stapels — und entscheidet.",
    bullets: [
      "Vollständigkeitsprüfung vor der Sichtung — fehlende Nachweise fallen sofort auf",
      "Ihre Zulassungskriterien einheitlich angewendet — auf jede Bewerbung gleich",
      "Sonderfälle und Ausnahmen gekennzeichnet — die Kommission entscheidet sie bewusst",
    ],
    imageNote:
      "Visual: Bewerbungsliste mit Vollständigkeits-Ampel je Nachweis, rechts eine Entscheidungsvorlage für die Zulassungskommission.",
    imageAlt: "Bewerbungsübersicht mit geprüften Nachweisen und markierten Sonderfällen",
    // image: bewusst weggelassen → Fallback "painpoint-a-section3".
  },
  /* FEATURE 02 — Dokumente & Prozesse */
  feature2: {
    image: "pain-point-bildung-feature2",
    h2: "Verwaltungsfälle ohne Nachfassschleifen.",
    h3: "Dokumente & Prozesse, konfiguriert für Immatrikulation, Beurlaubung und Anerkennung",
    sub:
      "Immatrikulation, Beurlaubung, Anerkennung von Leistungen, Bescheinigungen: Jeder Fall bringt eigene Unterlagen mit, und jede Lücke kostet eine weitere E-Mail. NEWEDGE erfasst die Dokumente, ordnet sie dem Fall zu, prüft sie auf Vollständigkeit und gleicht die Daten mit Ihren Systemen ab. Abweichungen gehen an die zuständige Person — mit Kontext.",
    bullets: [
      "Unterlagen sind sortiert und dem Fall zugeordnet, bevor jemand sie anfasst",
      "Fehlende Angaben fallen früh auf statt beim dritten Nachfassen",
      "Abweichungen landen bei der zuständigen Person — mit dem vollständigen Vorgang",
    ],
    imageNote:
      "Visual: Eingangskorb aus Anträgen und Bescheinigungen → Fallakte mit zugeordneten Dokumenten, Prüfstatus und einer markierten Abweichung.",
    imageAlt: "Verwaltungsfall mit zugeordneten Unterlagen und Prüfstatus je Dokument",
    // image: bewusst weggelassen → Fallback "painpoint-a-feature2".
  },
  /* FEATURE 03 — Service & Fallbearbeitung */
  feature3: {
    image: "pain-point-bildung-feature3",
    h2: "Wiederkehrende Fragen binden Ihr Team nicht mehr.",
    h3: "Service & Fallbearbeitung, konfiguriert für den Studierendenservice",
    sub:
      "Fristen, Unterlagen, Bearbeitungsstand — vor jeder Bewerbungsphase kommen im Studierendensekretariat dieselben Fragen an, über Mail, Telefon und Formular. NEWEDGE nimmt sie auf, beantwortet das Wiederkehrende mit dem Stand aus Ihren Systemen und leitet alles andere an die richtige Stelle. Beratungsfälle erreichen Ihr Team mit vollständigem Kontext.",
    bullets: [
      "Standardauskünfte zu Fristen, Unterlagen und Status laufen ohne Ihr Zutun",
      "Anfragen erreichen die zuständige Stelle statt den allgemeinen Posteingang",
      "Beratung bleibt bei Menschen — mit dem vollständigen Vorgang im Rücken",
    ],
    imageNote:
      "Visual: Anfragen aus Mail, Formular und Telefon laufen in einen Kanal, daneben beantwortete Standardfälle und ein an die Fachstelle übergebener Beratungsfall.",
    imageAlt: "Studierendenanfragen gebündelt, beantwortet und an die zuständige Stelle übergeben",
    // image: bewusst weggelassen → Fallback "painpoint-a-feature3".
  },
  integrations: {
    h2: "Verbindet sich mit den Systemen, die Sie bereits nutzen.",
    h3: "Welche Systeme lassen sich in Zulassung und Studierendenverwaltung integrieren?",
    sub:
      "Kein System, das Ihr Campus-Management ersetzt. NEWEDGE setzt auf die Infrastruktur auf, die bei Ihnen läuft — E-Mail, Ablage, Formulare, Kalender.",
    logos: [
      LOGO.outlook,
      LOGO.teams,
      LOGO.sharepoint,
      LOGO.googleWorkspace,
      LOGO.docusign,
      LOGO.notion,
      LOGO.zoom,
      LOGO.calendly,
      LOGO.zapier,
    ],
  },
  compare: {
    h2: "NEWEDGE vs. Zulassung und Verwaltung von Hand",
    h3: "Derselbe Ablauf, einmal vorbereitet und einmal nicht",
    altLabel: "Heute, manuell",
    rows: [
      { k: "Bewerbungseingang", ne: "Strukturiert erfasst", alt: "PDFs im Postfach" },
      { k: "Nachweisprüfung", ne: "Vor der Sichtung", alt: "Beim Durchblättern" },
      { k: "Zulassungskriterien", ne: "Einheitlich angewendet", alt: "Je nach Prüfer" },
      { k: "Sonderfälle", ne: "Markiert und begründet", alt: "Fallen spät auf" },
      { k: "Studierendenanfragen", ne: "Beantwortet oder weitergeleitet", alt: "Sammelpostfach" },
      { k: "Bearbeitungsstand", ne: "Jederzeit abrufbar", alt: "Nachfragen im Team" },
      { k: "Nachvollziehbarkeit", ne: "Dokumentiert", alt: "Verteilt auf Mails" },
    ],
  },
  featureCards: {
    h2: "Ihre Kommission entscheidet. Wir bereiten vor.",
    h3: "Was NEWEDGE im Bildungsbetrieb übernimmt",
    cards: [
      {
        title: "Zahlen ohne Sammelmail",
        desc: "Bewerberzahlen, Auslastung und Bearbeitungsstand laufen zusammen — die Hochschulleitung sieht den Stand ohne Sammelmail.",
        iconNote: "Icon: Kennzahlen-Übersicht / Diagramm",
      },
      {
        title: "Datenschutz von Anfang an",
        desc: "Bewerberdaten bleiben in Ihrer Umgebung. DSGVO-konform ausgelegt, auf Wunsch lokal gehostet, Zugriffe sind geregelt.",
        iconNote: "Icon: Schloss / Datenschutz",
      },
      {
        title: "Nachvollziehbar dokumentiert",
        desc: "Jeder Prüfschritt ist festgehalten — wer was wann geprüft hat, lässt sich später ohne Suche im Postfach zeigen.",
        iconNote: "Icon: Prüfprotokoll / Historie",
      },
    ],
  },
  /**
   * Kein Kundenzitat — für diese Branche gibt es keine Referenz und keine
   * Messwerte. Haltungsaussage im eigenen Namen.
   */
  testimonialHero: {
    quote:
      "Eine Zulassung ist keine Software-Entscheidung. Wir sorgen dafür, dass jede Bewerbung vollständig, geprüft und vergleichbar vor der Kommission liegt — die Entscheidung selbst bleibt dort, wo sie hingehört.",
    author: "NEWEDGE — Arbeitsprinzip",
  },
  faq: [
    {
      q: "Entscheidet die KI über Zulassungen?",
      a: "Nein. Das System nimmt Bewerbungen auf, prüft Nachweise auf Vollständigkeit und wendet Ihre Kriterien an. Die Zulassungsentscheidung trifft Ihre Kommission — auf einer vorbereiteten, nachvollziehbaren Grundlage.",
    },
    {
      q: "Müssen wir unser Campus-Management-System ersetzen?",
      a: "Nein. NEWEDGE setzt auf Ihre bestehende Infrastruktur auf und arbeitet über die Wege, die Sie ohnehin nutzen: E-Mail, Ablage, Formulare. Was heute in Ihren Systemen steht, bleibt dort.",
    },
    {
      q: "Was passiert mit den Bewerberdaten?",
      a: "Sie bleiben in Ihrer Umgebung. Die Verarbeitung ist DSGVO-konform ausgelegt, auf Wunsch lässt sich das System lokal hosten, und wer auf welche Unterlagen zugreifen darf, legen Sie fest.",
    },
    {
      q: "Ist das eine Speziallösung für Hochschulen?",
      a: "Nein. Es sind dieselben vier standardisierten Funktionen, die wir in jeder Branche betreiben: Entscheidungen & Fallprüfung, Dokumente & Prozesse, Steuerung & Reporting, Service & Fallbearbeitung. Für Sie werden sie auf Zulassung, Nachweise und Studierendenservice konfiguriert — nicht neu gebaut.",
    },
    {
      q: "Funktioniert das auch außerhalb der Bewerbungsphase?",
      a: "Ja. Immatrikulation, Beurlaubung, Anerkennung von Leistungen, die Unterlagen der Prüfungsverwaltung und Bescheinigungen folgen demselben Ablauf: Unterlagen erfassen, prüfen, abgleichen, Abweichungen an die zuständige Person geben.",
    },
    {
      q: "Wie gehen Sie mit unseren Ordnungen und Vorgaben um?",
      a: "Die Regeln setzen Sie. NEWEDGE bildet ab, was Sie vorgeben, und dokumentiert jeden Prüfschritt. Rechtliche Bewertungen, Auslegungsfragen und Ausnahmen bleiben bei Ihren Fachstellen und Gremien.",
    },
  ],
  // howTo: bewusst weggelassen — jede totalTime-Angabe wäre eine unbelegte Zeitaussage.
  // miniCases: bewusst weggelassen — für diese Branche existieren keine Fälle.
  closingCta: {
    h2Line1: "Bewerbungen vorbereitet.",
    h2Line2Highlighted: "Entscheidung bei Ihnen.",
    sub: "Wir zeigen an Ihrem Zulassungsablauf, was die vier Bausteine konkret übernehmen.",
    ctaPrimary: "Demo buchen",
    ctaSecondary: "Gespräch vereinbaren",
  },
};

/* ──────────────────────────────────────────────────────────────
   INDUSTRIE 7 — Immobilien
   Vertical Profile, KEIN eigenes Produkt: dieselben vier Blueprints,
   konfiguriert für Objekt-, Miet- und Instandhaltungsvorgänge.
   KEINE Zahlen, keine Zeitersparnis, keine Kundenzahlen, keine
   Durchlaufzeiten — für diese Branche existieren keine Messwerte.
   KEINE Rechtsaussagen (Miet-, WEG-, Betriebskostenrecht) — es wird
   beschrieben, was vorbereitet wird, nicht was rechtlich gilt.
────────────────────────────────────────────────────────────── */
const immobilien: PainPointContent = {
  slug: "immobilien",
  seo: {
    title: "Hausverwaltung: Mieterwechsel & Instandhaltung | NEWEDGE",
    description:
      "Objektakte sortiert, Vorgangsbearbeitung von Mieterwechsel bis Instandhaltungsmeldung entscheidungsreif, Bestand im Blick. Jetzt Demo buchen.",
    canonical: "/industrien/immobilien",
  },
  hero: {
    overlabel: "FÜR HAUSVERWALTUNGEN · BESTANDSHALTER · ASSET-MANAGEMENT",
    h1Line1: "Verwalten heißt nicht sortieren.",
    h1Line2Highlighted: "Ihre Unterlagen ordnen sich vorher.",
    sub:
      "So verändert eine KI-Abteilung Immobilien. Miet- und Objektvorgänge landen sortiert, geprüft und nachvollziehbar dokumentiert bei Ihnen.",
    ctaPrimary: "Demo buchen",
    ctaSecondary: "Gespräch vereinbaren",
    imageNote:
      "Visual: links ungeordneter Stapel aus Mietverträgen, Belegen, Fotos und E-Mail-Ausdrucken → rechts eine strukturierte Objektakte, je Einheit sortiert, mit gekennzeichneten Auffälligkeiten.",
    imageAlt:
      "Vorher: unsortierte Objekt- und Mietunterlagen — Nachher: strukturierte Objektakte je Einheit",
    image: "pain-point-immobilien-hero",
    // image: bewusst weggelassen — es existiert noch kein passender ImageKey in assets.ts.
  },
  trustBar: {
    headline: "Gebaut für Hausverwaltung und Bestandshaltung",
    sub: "Hausverwaltungen, Bestandshalter, Asset- und Property-Management",
    logos: [
      "Hausverwaltung",
      "Bestandshalter",
      "Asset-Management",
      "Property-Management",
      "Genossenschaft",
    ],
  },
  definition: {
    title: "Was ist eine KI-Abteilung für die Immobilienverwaltung?",
    body:
      "Eine gemeinsame Infrastruktur, auf der vier standardisierte Funktionen laufen: Entscheidungen & Fallprüfung, Dokumente & Prozesse, Steuerung & Reporting, Service & Fallbearbeitung. Für Immobilien sind dieselben Funktionen auf die Vorgangsbearbeitung in Bestandsverwaltung, Mietverhältnis und Instandhaltung konfiguriert: Unterlagen landen in der Objektakte und werden abgeglichen, Fristen und Auffälligkeiten gekennzeichnet, Instandhaltungsmeldungen aufgenommen und weitergeleitet. Die Entscheidung trifft weiterhin Ihre Verwaltung.",
  },
  /* FEATURE 01 — Dokumente & Prozesse */
  feature1: {
    image: "pain-point-immobilien-feature1",
    h2: "Unterlagen sind sortiert, bevor jemand sucht.",
    h3: "Dokumente & Prozesse — konfiguriert für Objekt- und Mietunterlagen",
    sub:
      "Mietverträge, Belege für die Nebenkostenabrechnung, Nachweise und Übergabeprotokolle kommen aus jeder Richtung und in jedem Format. NEWEDGE erfasst sie, ordnet sie der Objektakte und der Einheit zu, liest die relevanten Angaben aus und gleicht sie mit Ihrer Bestandsverwaltung ab. Was fehlt oder abweicht, ist gekennzeichnet, bevor Sie den Vorgang öffnen.",
    bullets: [
      "Jedes Dokument liegt in der richtigen Objektakte und an der richtigen Einheit — ohne Nachsortieren",
      "Angaben aus Verträgen und Belegen sind ausgelesen und mit Ihrer Bestandsverwaltung abgeglichen",
      "Fehlende Nachweise und Abweichungen sind markiert, bevor der Vorgang weiterläuft",
    ],
    imageNote:
      "Visual: Dokumenteneingang aus Post, Mail und Scan läuft in eine Objektakte; ausgelesene Felder werden sichtbar mit dem Bestand abgeglichen.",
    imageAlt:
      "Erfassung und Abgleich von Miet- und Objektunterlagen in einer strukturierten Objektakte",
    // image: bewusst weggelassen → Fallback "painpoint-a-section3".
  },
  /* FEATURE 02 — Entscheidungen & Fallprüfung */
  feature2: {
    image: "pain-point-immobilien-feature2",
    h2: "Der Vorgang liegt entscheidungsreif auf dem Tisch.",
    h3: "Entscheidungen & Fallprüfung — konfiguriert für Mieterwechsel, Kautionen und Vertragsanpassungen",
    sub:
      "Mieterwechsel, Kautionen, Mieterhöhungen, Vertragsanpassungen: jeder Vorgang braucht dieselben Unterlagen, dieselben Fristen, dieselben Prüfschritte — und jedes Mal trägt sie jemand neu zusammen. NEWEDGE prüft Vollständigkeit und Fristen anhand Ihrer eigenen Vorgaben und legt den Vorgang mit allem Nötigen vor. Entschieden und freigegeben wird von Ihrem Team.",
    bullets: [
      "Vollständigkeit und Fristen sind geprüft, bevor der Vorgang bei Ihnen landet",
      "Auffälligkeiten und Ausnahmen sind gekennzeichnet statt übersehen",
      "Jeder Prüfschritt ist nachvollziehbar dokumentiert — auch Monate später",
    ],
    imageNote:
      "Visual: Vorgangskarte „Mieterwechsel“ mit Checkliste aus Unterlagen und Fristen, offene Punkte hervorgehoben, Freigabefeld beim Menschen.",
    imageAlt:
      "Entscheidungsreif vorbereiteter Immobilienvorgang mit geprüften Unterlagen und Fristen",
    // image: bewusst weggelassen → Fallback "painpoint-a-feature2".
  },
  /* FEATURE 03 — Service & Fallbearbeitung */
  feature3: {
    image: "pain-point-immobilien-feature3",
    h2: "Meldungen laufen weiter, auch ohne Rückruf.",
    h3: "Service & Fallbearbeitung — konfiguriert für Mieterkommunikation und Instandhaltung",
    sub:
      "Ein tropfender Hahn, eine Frage zur Nebenkostenabrechnung, ein Termin für die Übergabe — die Anliegen sind wiederkehrend, der Weg dorthin ist jedes Mal manuell. NEWEDGE nimmt Instandhaltungsmeldungen und Mieteranliegen auf, ordnet sie Objektakte und Einheit zu, beantwortet Wiederkehrendes und leitet den Rest an den Handwerksbetrieb oder Ihre Verwaltung weiter — mit Rückmeldung an den Mieter.",
    bullets: [
      "Mieteranliegen sind aufgenommen und eingeordnet, auch außerhalb der Sprechzeiten",
      "Handwerksaufträge gehen mit vollständigem Kontext raus statt mit Rückfragen",
      "Der Stand eines Falls ist jederzeit einsehbar — für Mieter und für Ihr Team",
    ],
    imageNote:
      "Visual: eingehende Schadensmeldung wird eingeordnet, an Handwerk geroutet und der Stand an den Mieter zurückgemeldet — als durchgehende Linie statt Telefonkette.",
    imageAlt:
      "Aufnahme, Einordnung und Weiterleitung von Mieter- und Instandhaltungsmeldungen",
    // image: bewusst weggelassen → Fallback "painpoint-a-feature3".
  },
  integrations: {
    h2: "Verbindet sich mit den Systemen, die Sie bereits nutzen.",
    h3: "Welche Systeme lassen sich in der Immobilienverwaltung anbinden?",
    sub:
      "Kein System, das alles ersetzt. NEWEDGE arbeitet mit Ihrer bestehenden Verwaltungs-, Buchhaltungs- und Kommunikationslandschaft — ohne Datenmigration und ohne zusätzliche Oberfläche, die Ihr Team pflegen muss.",
    logos: [
      LOGO.outlook,
      LOGO.teams,
      LOGO.sharepoint,
      LOGO.googleWorkspace,
      LOGO.datev,
      LOGO.lexoffice,
      LOGO.docusign,
      LOGO.notion,
      LOGO.zapier,
    ],
  },
  compare: {
    h2: "NEWEDGE vs. Objektverwaltung von Hand",
    h3: "Was sich in der täglichen Vorgangsbearbeitung unterscheidet",
    altLabel: "Heute, manuell",
    rows: [
      { k: "Eingang von Unterlagen", ne: "Erfasst und dem Objekt zugeordnet", alt: "Mail, Post, Ordner" },
      { k: "Prüfung auf Vollständigkeit", ne: "Vor der Vorlage, nach Ihren Vorgaben", alt: "Beim Öffnen des Vorgangs" },
      { k: "Fristen im Blick", ne: "Laufend überwacht", alt: "Kalender und Gedächtnis" },
      { k: "Mieteranliegen", ne: "Aufgenommen und eingeordnet", alt: "Rückrufliste" },
      { k: "Instandhaltungsmeldungen", ne: "Mit Kontext weitergeleitet", alt: "Telefonat und Rückfragen" },
      { k: "Portfolio-Überblick", ne: "An einem Ort, laufend aktuell", alt: "Listen aus mehreren Quellen" },
      { k: "Nachvollziehbarkeit", ne: "Jeder Schritt dokumentiert", alt: "Verstreut über Postfächer" },
    ],
  },
  featureCards: {
    h2: "Sie entscheiden. Alles davor bereiten wir vor.",
    h3: "Was NEWEDGE in der Immobilienverwaltung übernimmt",
    cards: [
      {
        title: "Portfolio an einem Ort",
        desc: "Leerstand, Instandhaltungskosten, offene Forderungen und Bearbeitungsstand liegen zusammen — statt in getrennten Listen.",
        iconNote: "Icon: Gebäudereihe mit Kennzahlenpanel",
      },
      {
        title: "Vorgänge ohne Nachfassen",
        desc: "Mieterwechsel, Kaution, Anpassung: jeder Vorgang läuft denselben Weg — geprüft, dokumentiert, mit sichtbarem Stand.",
        iconNote: "Icon: Vorgangskarte mit Fortschrittslinie",
      },
      {
        title: "Nachvollziehbar dokumentiert",
        desc: "Wer was wann eingereicht, geprüft und vorgelegt hat, steht am Vorgang — auch wenn jemand anderes ihn übernimmt.",
        iconNote: "Icon: Audit-Trail / Zeitleiste",
      },
    ],
  },
  /**
   * Kein Kundenzitat — für diese Branche existiert kein Referenzprojekt und
   * kein Messwert. Produktprinzip im eigenen Namen.
   */
  testimonialHero: {
    quote:
      "Wir bauen für Immobilien keine Sonderlösung. Es sind dieselben vier Funktionen wie in jeder anderen Branche — konfiguriert für Objekt-, Miet- und Instandhaltungsvorgänge. Was entschieden wird, entscheidet Ihre Verwaltung.",
    author: "NEWEDGE — Arbeitsprinzip",
  },
  faq: [
    {
      q: "Ersetzt NEWEDGE unsere Verwaltungssoftware?",
      a: "Nein. NEWEDGE liegt neben Ihren bestehenden Systemen und arbeitet mit den Daten, die dort ohnehin entstehen. Ihre Verwaltungs-, Buchhaltungs- und Kommunikationssoftware bleibt, wo sie ist — es kommt keine weitere Oberfläche dazu, die Ihr Team pflegen muss.",
    },
    {
      q: "Trifft die KI Entscheidungen über Mietverhältnisse?",
      a: "Nein. Vorgänge werden aufbereitet, auf Vollständigkeit und Fristen geprüft und mit gekennzeichneten Auffälligkeiten vorgelegt. Die Entscheidung trifft Ihre Verwaltung — und sie ist am Vorgang nachvollziehbar dokumentiert.",
    },
    {
      q: "Gibt NEWEDGE rechtliche Auskünfte an Mieter?",
      a: "Nein. Rechtliche Bewertungen bleiben bei Ihnen und Ihren Beratern. NEWEDGE nimmt Anliegen auf, ordnet sie ein, beantwortet Wiederkehrendes wie Zuständigkeit und Bearbeitungsstand und übergibt alles Weitere mit vollständigem Kontext an Ihr Team.",
    },
    {
      q: "Was passiert mit Mieter- und Objektdaten?",
      a: "Die Verarbeitung ist DSGVO-konform ausgelegt und dokumentiert. NEWEDGE lässt sich in Ihrer eigenen Infrastruktur oder in einer europäischen Umgebung betreiben — Sie legen fest, welche Daten das System sieht und welche nicht.",
    },
    {
      q: "Wir arbeiten viel mit Papier und Scans. Geht das trotzdem?",
      a: "Ja. Eingescannte Dokumente, Fotos aus der Wohnungsübergabe und E-Mail-Anhänge werden genauso erfasst wie digitale Dateien: dem Objekt und der Einheit zugeordnet, ausgelesen und mit Ihrem Bestand abgeglichen.",
    },
    {
      q: "Bekommen wir für Immobilien eine eigene Software gebaut?",
      a: "Nein — und das ist der Punkt. Es sind dieselben standardisierten Funktionen wie in jeder anderen Branche, konfiguriert für Ihren fachlichen Kontext. Sie finanzieren also kein Individualprojekt, um Objekt- und Mietvorgänge geordnet zu bekommen.",
    },
  ],
  // howTo: bewusst weggelassen — jede totalTime-Angabe wäre eine unbelegte Zeitaussage.
  // miniCases: bewusst weggelassen — für diese Branche existieren keine Fälle.
  closingCta: {
    h2Line1: "Ein Vorgang.",
    h2Line2Highlighted: "Einmal zeigen statt lange erklären.",
    sub: "Wir gehen einen typischen Mieterwechsel durch und zeigen, was davon vorbereitet bei Ihnen ankommt.",
    ctaPrimary: "Demo buchen",
    ctaSecondary: "Gespräch vereinbaren",
  },
};

// Mini-Cases (Custom Posts) — zentral gepflegt in collections/miniCases.ts,
// hier pro Anwendungsfeld zugewiesen (Map-Key = primärer Slug).
// Auswahlverfahren & Entscheidungsinstanzen zeigen bewusst dieselben 3 Cases
// (identische Zielgruppe/Thematik: Jury-/Gremiumsentscheidungen) — eine Quelle,
// zwei Anwendungsfeld-Seiten.
auswahlverfahren.miniCases = miniCasesBySlug["entscheidungsinstanzen"];
// compliance (Dokumente & Prozesse): keine Zuordnung — die vorhandenen Fälle
// stammen aus einem anderen Fachkontext (Zoll, Spedition, Container).
// kpiDashboard (Steuerung & Reporting): keine Zuordnung — die vorhandenen Fälle
// stammen aus einem anderen Fachkontext (CRM/Vertrieb, Logistikdienstleister).
// kiKundensupport (Service & Fallbearbeitung): keine Zuordnung — die vorhandenen
// Fälle stammen aus abgekündigten Fachkontexten (Therapiezentrum, Online-Handel
// mit Versandstatus/Retouren, Steuerkanzlei) und tragen unbelegte Zahlen.
// Die Gruppe bleibt in collections/miniCases.ts erhalten.
entscheidungsinstanzen.miniCases = miniCasesBySlug["entscheidungsinstanzen"];
localDigitalCommerce.miniCases = miniCasesBySlug["health-care"];
handelSupplyChain.miniCases = miniCasesBySlug["handel-supply-chain"];
professionalServices.miniCases = miniCasesBySlug["professional-services"];

/**
 * Slug → Inhalt. Der ERSTE Key je Block ist der kanonische Slug (identisch mit
 * `slug`/`seo.canonical` des Eintrags), alle weiteren sind Aliasse: alte oder
 * verkürzte Pfade, die auf denselben Eintrag zeigen, damit bereits geteilte
 * Links nicht ins Leere laufen. Aliasse tauchen bewusst NICHT in der
 * sitemap.xml oder in SLUGS/INDUSTRY_SLUGS des Prerenders auf und `canonical`
 * zeigt immer auf den kanonischen Pfad — sonst entstünde Duplicate Content.
 */
export const painPoints: Record<string, PainPointContent> = {
  // Pain Point A — Entscheidungen & Fallprüfung (vormals „auswahlverfahren")
  "entscheidungen-fallpruefung": auswahlverfahren,
  auswahlverfahren: auswahlverfahren,
  "auswahlverfahren-automatisieren": auswahlverfahren,

  // Pain Point B (Kundengewinnung entfernt)

  // Pain Point C — Dokumente & Prozesse (vormals „compliance")
  "dokumente-prozesse": compliance,
  compliance: compliance,
  "compliance-automatisierung": compliance,
  "import-export": compliance,
  "import-export-compliance": compliance,

  // Pain Point D — Steuerung & Reporting (vormals „kpi-dashboard")
  "steuerung-reporting": kpiDashboard,
  "kpi-dashboard": kpiDashboard,
  "kpi-dashboard-echtzeit": kpiDashboard,
  reporting: kpiDashboard,

  // Pain Point E — Service & Fallbearbeitung (vormals „ki-kundensupport")
  "service-fallbearbeitung": kiKundensupport,
  "ki-kundensupport": kiKundensupport,
  kundensupport: kiKundensupport,
  support: kiKundensupport,

  // Industrien
  "foerderungen-entscheidungsinstanzen": entscheidungsinstanzen,
  entscheidungsinstanzen: entscheidungsinstanzen,
  versicherungen: versicherungen,
  versicherung: versicherungen,
  bildung: bildung,
  hochschulen: bildung,
  immobilien: immobilien,
  hausverwaltung: immobilien,
  // Abgekuendigt (2026-08): health-care, handel-supply-chain,
  // professional-services und local-digital-commerce sind bewusst NICHT mehr
  // registriert. Ihre Eintraege bleiben oben im Code stehen, sind aber ueber
  // keine URL mehr erreichbar — sie tragen unbelegte Kennzahlen aus der alten
  // Positionierung. Unbekannte Slugs liefern jetzt 404 statt der Default-Seite.

};

export const DEFAULT_PAIN_POINT: PainPointContent = auswahlverfahren;
