/**
 * Page: Sicherheit, Datenschutz & Betrieb  — Single Type
 * --------------------------------------------------------------
 * Inhalte der Vertrauensseite (`pages/Sicherheit.tsx`): SEO, Hero,
 * Kurzfassung, die inhaltlichen Abschnitte, der Abgrenzungs-Kasten
 * („Was wir nicht behaupten") und die Abschluss-CTA.
 *
 * ZWECK: Die vier Zielbranchen (Versicherungen, Bildung, Förderungen
 * & Entscheidungsinstanzen, Immobilien) stellen vor jedem Projekt
 * dieselben Fragen — wo die Modelle laufen, wo die Daten liegen, wer
 * worauf zugreift, was protokolliert wird. Diese Seite beantwortet sie
 * an einer Stelle, damit die Prüfschleife nicht jedes Mal neu beginnt.
 *
 * BELEGLAGE — bewusst eng: Jede Aussage ist aus dem Repository
 * abgeleitet (`sections/cortex.ts`, `sections/cortexFeatures.ts`,
 * `pages/cortex.ts`, `painPoints.ts`, `pages/impressum.ts`,
 * `apps/lead-api/README-DEPLOY.md`, `apps/lead-api/server.py`,
 * `HANDOVER.md`). Nicht belegt und deshalb NICHT enthalten:
 * Zertifizierungen (ISO 27001, TISAX, BSI-Grundschutz), Verfügbarkeits-
 * oder Reaktionszeiten, Aussagen zu aufsichtsrechtlichen Regimen,
 * Kennzahlen jeder Art. Wer hier ergänzt, ergänzt nur mit Beleg.
 *
 * Reiner Text, serialisierbar (CMS-tauglich): nur Strings/Arrays —
 * kein JSX, keine Funktionen. Keine Bilder.
 * Strapi-Mapping: Single Type `sicherheit`.
 * --------------------------------------------------------------
 */
import type { SEOContent } from "../types";

/**
 * Ein inhaltlicher Abschnitt der Seite.
 * `id` ist der Anker (Sprungmarke der Inhaltsübersicht), `body` sind
 * eigenständige Absätze, `items` eine optionale Aufzählung darunter.
 */
export interface SecuritySection {
  /** Anker-`id` — auch Ziel der Inhaltsübersicht. */
  id: string;
  /** Kurzlabel für die Inhaltsübersicht (kürzer als `heading`). */
  navLabel: string;
  heading: string;
  body: string[];
  items?: string[];
  /** Optionaler Nachsatz unter der Aufzählung. */
  after?: string;
}

export const sicherheit = {
  seo: {
    title: "Sicherheit, Datenschutz & Betrieb | NEWEDGE",
    description:
      "Wo die Modelle laufen, wo Ihre Daten liegen, wer worauf zugreift und was protokolliert wird — die Antworten auf die Fragen vor jedem Projekt.",
    canonical: "/sicherheit",
  } satisfies SEOContent,

  /** Hero-Bereich. */
  hero: {
    eyebrow: "Sicherheit & Datenschutz",
    headline: "Wo Ihre Daten liegen. Und wer sie sieht.",
    subline:
      "Diese Frage kommt in jedem Erstgespräch zuerst — und sie hält Projekte am längsten auf. Hier steht die Antwort an einer Stelle: was gilt, was Sie festlegen und was wir bewusst nicht behaupten.",
  },

  /** Kurzfassung ganz oben — für alle, die nur den Kern brauchen. */
  summary: {
    label: "Kurz gefasst",
    items: [
      "Die Modelle laufen dort, wo Sie es festlegen — auf eigener Hardware, in deutscher Cloud oder in Ihrer bestehenden Umgebung.",
      "Im lokalen Betrieb verlässt kein Datensatz Ihr Haus.",
      "Zugriff richtet sich nach den Rollen und Rechten Ihres Hauses, nicht nach dem Tool.",
      "Entscheidungen bleiben bei Menschen. Jeder Bearbeitungsschritt wird protokolliert.",
      "Zertifizierungen führen wir keine an — was wir zusagen, steht im Vertrag, nicht auf dieser Seite.",
    ],
  },

  /** Label über der Sprungmarken-Leiste. */
  tocLabel: "Auf dieser Seite",

  /** Die inhaltlichen Abschnitte (Reihenfolge = Reihenfolge auf der Seite). */
  sections: [
    {
      id: "modelle",
      navLabel: "Modelle",
      heading: "Wo die Modelle laufen",
      body: [
        "Sie entscheiden, wo gerechnet wird. Wir bauen die komplette Infrastruktur, auf der leistungsfähige KI-Modelle bei Ihnen im Haus laufen — von der Hardware über die Modelle bis zur Rechteverwaltung.",
        "Kommt eigene Hardware nicht in Frage, ist der Betrieb in deutscher Cloud oder in Ihrer bestehenden Infrastruktur möglich. In beiden Fällen bleibt die Umgebung Ihre — und nicht die eines externen Anbieters, dessen Nutzungsbedingungen sich ändern können.",
        "Welches Modell dahinter arbeitet, bleibt austauschbar. Cortex ist die Ebene darüber: Ein Modellwechsel ändert nichts an Ihren Berechtigungen, Protokollen und Abläufen.",
      ],
    },
    {
      id: "daten",
      navLabel: "Daten",
      heading: "Wo die Daten liegen",
      body: [
        "Im lokalen Betrieb verlässt kein Datensatz das Unternehmen. Ihre Unterlagen, Vorgänge und Auswertungen bleiben in Ihrer Umgebung — es entsteht keine Auftragsverarbeitung mit US-Diensten, nur weil Ihre Mitarbeiter mit KI arbeiten.",
        "Das ist der Unterschied zum Zustand, den wir in den meisten Häusern vorfinden: Firmendaten in öffentlichen Assistenten, Einzeltools ohne Kontrolle, gewachsene Schatten-IT und ungeklärte DSGVO-Fragen. Ein Einstiegspunkt für alle ersetzt den Wildwuchs — und macht überhaupt erst prüfbar, was mit welchen Daten passiert.",
      ],
    },
    {
      id: "zugriff",
      navLabel: "Zugriff",
      heading: "Wer worauf zugreift",
      body: [
        "Cortex führt Ihr Unternehmenswissen, Ihre Systeme und Ihre Berechtigungen an einem Ort zusammen. Der Zugriff richtet sich damit nach der Rolle im Haus — nicht danach, wer ein Werkzeug zuerst geöffnet hat.",
        "Sie behalten die Kontrolle über Nutzung, Daten, Prozesse und Automatisierungen: klare Rechte, nachvollziehbare Nutzung, keine Blackbox. Was Ihre Leute im Fachsystem nicht sehen dürfen, bekommen sie auch über die KI-Ebene nicht.",
      ],
    },
    {
      id: "menschliche-pruefung",
      navLabel: "Menschliche Prüfung",
      heading: "Die Entscheidung bleibt bei Ihnen",
      body: [
        "Das System entscheidet nicht an Ihrer Stelle. Es nimmt Vorgänge auf, ordnet sie zu, liest die relevanten Angaben aus, prüft sie gegen Ihre Checklisten und Regeln und bereitet die Entscheidung vor. Getroffen wird sie von der Person, die dafür zuständig ist.",
        "Was eindeutig und vollständig ist, läuft durch. Was fehlt, sich widerspricht, abgelaufen ist oder von Ihren Vorgaben abweicht, wird nicht stillschweigend durchgewunken, sondern vorgelegt — mit dem Hinweis, worauf sich die Einschätzung stützt und wo sie im Vorgang steht.",
        "Auch in der Steuerung gilt dieselbe Grenze: Wir sorgen dafür, dass die Zahlen vollständig, aktuell und bis zum einzelnen Vorgang nachvollziehbar vorliegen. Welche Konsequenz daraus folgt, entscheidet Ihre Leitung.",
      ],
    },
    {
      id: "protokollierung",
      navLabel: "Protokollierung",
      heading: "Protokollierung und Nachvollziehbarkeit",
      body: [
        "Jeder Bearbeitungsschritt wird protokolliert: wer wann auf welcher Grundlage bewertet, geprüft oder entschieden hat. Die Dokumentation entsteht während der Arbeit, nicht kurz vor der Prüfung.",
        "Das zahlt sich in dem Moment aus, in dem jemand nachfragt — ein abgelehnter Antragsteller widerspricht, eine Aufsicht fordert Unterlagen an, eine interne Revision prüft, ein Nachweis wird fällig. Sie müssen den Verlauf dann nicht aus Postfächern und Ordnern rekonstruieren.",
      ],
      items: [
        "Lückenloser Verlauf je Vorgang — wer, wann, auf welcher Grundlage",
        "Kennzahlen bis zum einzelnen Vorgang zurückverfolgbar, statt Zahl ohne Herkunft",
        "Nachweis- und Aufbewahrungspflichten bleiben erfüllbar, ohne dass jemand die Historie nachträglich zusammensucht",
      ],
    },
    {
      id: "loeschung",
      navLabel: "Auskunft & Löschung",
      heading: "Auskunft, Berichtigung, Löschung",
      body: [
        "In Ihrer eigenen Umgebung bestimmen Sie Aufbewahrung und Löschung selbst — es sind Ihre Daten in Ihren Systemen. Wir richten die Abläufe so ein, dass sich ein Vorgang samt Protokoll gezielt finden und behandeln lässt.",
        "Für die Daten, die bei uns anfallen — etwa aus dem Kontaktformular oder dem ROI-Rechner — gelten Ihre Rechte nach der DSGVO:",
      ],
      items: [
        "Auskunft über die zu Ihrer Person gespeicherten Daten",
        "Berichtigung unrichtiger Daten",
        "Löschung Ihrer Daten (Recht auf Vergessenwerden)",
        "Einschränkung der Verarbeitung",
        "Widerspruch gegen die Verarbeitung",
        "Datenübertragbarkeit",
      ],
      after:
        "Eine Anfrage an info@newedgebrand.com genügt. Automatisch gelöscht wird bei uns nichts — angefragte Reports und Anfragen bleiben abgelegt, bis Sie die Löschung verlangen oder wir sie nicht mehr benötigen. Das sagen wir lieber deutlich, als eine Frist zu behaupten, die niemand überwacht.",
    },
    {
      id: "auftragsverarbeitung",
      navLabel: "Auftragsverarbeitung",
      heading: "Auftragsverarbeitung und eingesetzte Dienste",
      body: [
        "Welche Rolle NEWEDGE einnimmt — Verantwortlicher oder Auftragsverarbeiter — hängt am Betriebsmodell und wird vor Projektbeginn schriftlich geklärt, zusammen mit den Systemen, auf die wir dafür überhaupt Zugriff brauchen. Läuft alles in Ihrem Haus, ist der Kreis der Beteiligten entsprechend klein.",
        "Für diese Website selbst nennen wir die eingesetzten Dienste offen:",
      ],
      items: [
        "Cookiebot (Usercentrics A/S, Kopenhagen) — Einwilligungsverwaltung und Nachweis der Einwilligung",
        "Google Tag Manager und Google Analytics (Google Ireland Limited, Dublin) — Reichweitenmessung, IP-Adresse innerhalb der EU bzw. des EWR gekürzt",
        "Meta Pixel — Auswertung von Kampagnen; die Daten sind für uns anonym",
      ],
      after:
        "Statistik- und Marketing-Skripte werden erst aktiv, wenn Sie zugestimmt haben; bis dahin steht der Google Consent Mode auf „denied“. Ihre Auswahl können Sie jederzeit über „Cookie-Einstellungen“ am Seitenende ändern oder widerrufen. Die vollständige Datenschutzerklärung finden Sie im Impressum.",
    },
    {
      id: "website",
      navLabel: "Website & Formulare",
      heading: "Was die Website selbst erhebt",
      body: [
        "Beim Besuch dieser Seite erfasst unser Hostinganbieter automatisch IP-Adresse, Datum und Uhrzeit, Browsertyp und -version, Betriebssystem und Referrer-URL. Diese Daten dienen der technischen Sicherheit, der Fehleranalyse und der Optimierung der Website; eine Zusammenführung mit anderen Datenquellen findet nicht statt.",
        "Kontaktformular und ROI-Rechner nehmen nur an, was für die Bearbeitung nötig ist — beim Kontakt zusätzlich nur mit ausdrücklicher Einwilligung. Die Anfragen liegen auf unserem Server; im CMS sind sie ohne öffentliche Leserechte hinterlegt und damit nur im geschützten Adminbereich sichtbar.",
      ],
      items: [
        "Technische Absicherung der Formulare: Herkunftsprüfung, Begrenzung der Anfragen je Adresse, Prüfung der E-Mail-Adresse und eine unsichtbare Falle gegen automatisierte Einsendungen",
        "Nachfassmails tragen immer einen Abmeldeweg: einen Link mit Einmal-Kennung — damit keine E-Mail-Adresse in einer URL steht —, den Abmelden-Knopf Ihres Mailprogramms, und eine Antwort mit „Abmelden“ genügt ebenfalls",
        "Ein Aufruf des Abmeldelinks zeigt zunächst nur eine Bestätigungsseite; ausgetragen wird erst nach Ihrer Bestätigung, damit automatische Mailscanner niemanden versehentlich abmelden",
        "Abgemeldete Adressen werden vor jeder weiteren Nachfassmail geprüft; angeforderte Mails wie der ROI-Report bleiben davon unberührt",
      ],
    },
    {
      id: "betrieb",
      navLabel: "Betrieb & Sicherungen",
      heading: "Betrieb, Sicherungen und Wiederherstellung",
      body: [
        "Website, CMS und Formulardienst laufen in einem gemeinsamen, abgegrenzten Aufbau, ausgeliefert ausschließlich über verschlüsselte Verbindungen. Der Formulardienst hängt bewusst an keinem anderen Baustein: Fällt das CMS aus, nehmen die Formulare weiter Anfragen an — und umgekehrt.",
        "Gesichert wird einmal täglich, automatisch: Datenbank, Mediendateien und die Formulardaten, mehrere Stände nebeneinander. Der Weg zurück ist Schritt für Schritt dokumentiert und beginnt immer damit, den Ist-Zustand wegzusichern — auch einen kaputten. Ein Wiederherstellungsversuch, der schiefgeht, wäre sonst endgültig.",
        "Änderungen am laufenden Betrieb gehen denselben Weg: erst ein Trockenlauf, dann die Umstellung, danach eine Abnahme, die prüft, ob alles wieder erwartungsgemäß antwortet.",
      ],
    },
  ] satisfies SecuritySection[],

  /** Abgrenzung — was wir bewusst NICHT behaupten. Dunkler Ink-Kasten. */
  grenzen: {
    heading: "Was wir nicht behaupten",
    intro:
      "Der ehrlichere Teil einer Sicherheitsseite ist der, in dem steht, was fehlt. Drei Dinge werden Sie hier nicht finden:",
    items: [
      "Keine Zertifizierungen. Wir führen keine an — weder als Siegel noch als Andeutung. Wenn Ihre Beschaffung eine bestimmte Zertifizierung voraussetzt, sagen Sie es früh, dann klären wir, was das für das Vorhaben bedeutet.",
      "Keine Verfügbarkeits- oder Reaktionszeiten. Was für Ihr Vorhaben gilt, gehört in eine Vereinbarung mit Ihnen und nicht auf eine Webseite, auf der es unverbindlich bliebe.",
      "Keine Einordnung Ihrer aufsichtsrechtlichen Pflichten. Was Ihr Haus erfüllen muss, beurteilen Ihre Rechtsabteilung und Ihr Datenschutzbeauftragter. Unsere Aufgabe ist es, die technischen Nachweise zu liefern, die sie dafür brauchen — nachvollziehbar, prüfbar, vollständig.",
    ],
  },

  /** Abschluss-CTA. */
  cta: {
    heading: "Schicken Sie uns Ihre Prüfliste.",
    body: "Datenschutzbeauftragte, IT-Sicherheit und Einkauf arbeiten mit eigenen Fragebögen. Wir beantworten Ihren entlang des Betriebsmodells, das für Sie in Frage kommt — vor dem ersten Projektschritt, nicht danach.",
    button: "Gespräch buchen",
    to: "/kontakt",
  },

  /** Verweis auf die vollständigen Rechtstexte. */
  legal: {
    label: "Vollständige Datenschutzerklärung",
    to: "/impressum#datenschutz",
  },
} as const;
