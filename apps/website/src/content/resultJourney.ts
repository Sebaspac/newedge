import type { ImageKey } from "./assets";
import type { Icon } from "@tabler/icons-react";
import {
  Icon24Hours,
  IconAdjustments,
  IconAlertTriangle,
  IconBellRinging,
  IconBolt,
  IconCalendarCheck,
  IconCalendarPlus,
  IconCalendarStats,
  IconCertificate,
  IconChartBar,
  IconCircleCheck,
  IconCoin,
  IconCoins,
  IconDatabase,
  IconFileAlert,
  IconFileCheck,
  IconFileInvoice,
  IconGauge,
  IconInbox,
  IconKeyboardOff,
  IconLanguage,
  IconLayoutDashboard,
  IconMailOff,
  IconMessageCheck,
  IconMoodSmile,
  IconPackageImport,
  IconPackageOff,
  IconPhoneOff,
  IconRadar,
  IconReceipt,
  IconRepeatOff,
  IconReport,
  IconScale,
  IconSearch,
  IconShieldCheck,
  IconStack2,
  IconStopwatch,
  IconTrendingDown,
  IconTruckDelivery,
  IconUserCheck,
  IconUsersGroup,
} from "@tabler/icons-react";

/* ──────────────────────────────────────────────────────────────
   ERGEBNIS-MODUL — Anwendungsfelder & Industrien
   --------------------------------------------------------------
   Neues Modul auf allen Pain-Point-/Industrie-Seiten, Position:
   Hero → [Ergebnis-Bild] → Definition → [Ergebnis-Stationen] → Feature 1.

   Jede Station ist ein Ergebnis aus dem Geschäftsalltag des Kunden
   (seine Bewerbungen, Patienten, Mandanten, Bestellungen) — nie ein
   Schritt aus dem NEWEDGE-Onboarding und keine Feature-Beschreibung.
   Pro Station ein Tabler-Icon (tabler-icons.io), gerendert im neuen
   Board-Stil: schwarzes Badge, Lime-Icon, Nummer als Lime-Punkt.

   Bewusst als eigene statische Map (Lookup über kanonischen Slug in
   der Page) statt als Feld in PainPointContent: CMS-Rows aus Strapi
   ersetzen das Content-Objekt komplett — dort angehängte Felder
   verschwänden, sobald das lokale CMS erreichbar ist.

   Bilder folgen: `image` bleibt leer, bis das Motiv erstellt und in
   src/content/assets.ts unter `plannedImage` registriert ist. Bis
   dahin zeigt die Definition-Sektion im rechten Drittel den
   NEWEDGE-Charakter (Text links). (EN-Mirror folgt mit den Bildern.)
────────────────────────────────────────────────────────────── */

export interface ResultJourneyStep {
  icon: Icon;
  text: string;
}

export interface ResultJourneyContent {
  showcase: {
    /** Geplanter Registry-Key für assets.ts — Bild wird von Hand erstellt und nachgetragen */
    plannedImage: string;
    /** Sobald gesetzt, ersetzt das echte Bild den Platzhalter */
    image?: ImageKey;
    imageAlt: string;
    /** Motiv-Beschreibung / Art-Direction für die Bild-Erstellung */
    imageNote: string;
  };
  title: string;
  /** 4–6 Ergebnis-Stationen aus Kundensicht — Desktop horizontal, Mobile vertikal */
  steps: ResultJourneyStep[];
}

export const resultJourneys: Record<string, ResultJourneyContent> = {
  /* ── Pain Point — Auswahlverfahren ── */
  auswahlverfahren: {
    showcase: {
      plannedImage: "pain-point-auswahlverfahren-result",
      imageAlt: "Geordnetes Auswahlverfahren: alle Bewerbungen strukturiert und vergleichbar statt Posteingang-Chaos",
      imageNote:
        "Split-Visual: links überfülltes Postfach/PDF-Stapel (Chaos, viele Formate), rechts derselbe Inhalt als klare Prozesskette mit Stationspunkten auf einer Linie — keine Menschen, reine Systemansicht.",
    },
    title: "So sieht Ihr Alltag mit NEWEDGE aus",
    steps: [
      { icon: IconInbox, text: "Keine Bewerbung geht unter — ob 50 oder 500, jede wird gesehen." },
      { icon: IconScale, text: "Ihre Jury vergleicht Substanz, nicht Formatierung." },
      { icon: IconUsersGroup, text: "Ihr Gremium bewertet, statt zu koordinieren — 80% weniger Zeit für Terminjonglage." },
      { icon: IconAlertTriangle, text: "Uneinigkeit zwischen Juroren fällt auf, bevor sie zum Streitfall wird." },
      { icon: IconFileCheck, text: "Legt ein Bewerber Einspruch ein, haben Sie die Begründung längst fertig." },
      { icon: IconTrendingDown, text: "Aus drei Monaten Verwaltung wird ein Verfahren, das läuft — Ihr Team steuert es nur noch." },
    ],
  },

  /* ── Pain Point — Außenhandels-/Zoll-Compliance ── */
  compliance: {
    showcase: {
      plannedImage: "pain-point-compliance-result",
      imageAlt: "Außenhandel im Griff: ein ruhiges Sendungs-Dashboard statt Dokumentenstapel in fünf Sprachen",
      imageNote:
        "Split-Visual: links Ausgangschaos (Dokumentenstapel in verschiedenen Sprachen, Excel, Telefonhörer), rechts ein einziges ruhiges Dashboard mit grünem Sendungsstatus.",
    },
    title: "So sieht Ihr Alltag mit NEWEDGE aus",
    steps: [
      { icon: IconLanguage, text: "Dokumente in fünf Sprachen sind nie mehr das Problem." },
      { icon: IconFileAlert, text: "Eine fehlende Unterlage fällt auf, bevor die Ware am Hafen feststeckt." },
      { icon: IconShieldCheck, text: "Sanktionsliste geändert? Merken Sie nichts davon — jede Sendung ist automatisch geprüft." },
      { icon: IconCoins, text: "Sie zahlen im Schnitt 14% weniger Zoll, weil kein Abkommen mehr übersehen wird." },
      { icon: IconLayoutDashboard, text: "Spediteur, Zoll, Lager und Lieferant schauen zum ersten Mal auf denselben Stand." },
    ],
  },

  /* ── Pain Point — KPI-Dashboard ── */
  "kpi-dashboard": {
    showcase: {
      plannedImage: "pain-point-kpi-dashboard-result",
      imageAlt: "Ein Blick statt Zahlensuche: Live-Dashboard mit den Kennzahlen des Unternehmens in Echtzeit",
      imageNote:
        "Vorher/Nachher in einem Bild: links Excel-Tabellen und Report-Stapel mit Datumsstempel „letzte Woche“, rechts das Live-Dashboard mit Echtzeit-Puls-Indikator.",
    },
    title: "So sieht Ihr Alltag mit NEWEDGE aus",
    steps: [
      { icon: IconGauge, text: "Morgens reichen 30 Sekunden, um zu wissen, wie das Geschäft steht." },
      { icon: IconDatabase, text: "Vertrieb, Finance und Geschäftsführung streiten nicht mehr, wessen Zahl stimmt — es gibt nur noch eine." },
      { icon: IconBellRinging, text: "Eine kritische Abweichung meldet sich bei Ihnen, statt dass Sie danach suchen." },
      { icon: IconStopwatch, text: "Aus 4–6 Stunden Reporting pro Woche werden unter 30 Minuten." },
      { icon: IconRadar, text: "Sie erkennen ein Problem im Schnitt 3 Tage früher, als es bisher aufgefallen wäre." },
    ],
  },

  /* ── Pain Point — KI-Kundensupport ── */
  "ki-kundensupport": {
    showcase: {
      plannedImage: "pain-point-ki-kundensupport-result",
      imageAlt: "Support, der von selbst läuft: 80% der Anfragen sofort gelöst, unter 1€ pro Ticket",
      imageNote:
        "Split-Screen-Illustration: links überfülltes Ticket-Postfach mit Preisschild „Ø 12€“, rechts der Funnel, der auf drei große Ziffern zuläuft — 80% / <30 Sek. / <1€.",
    },
    title: "So sieht Ihr Alltag mit NEWEDGE aus",
    steps: [
      { icon: IconCoin, text: "Heute kostet jedes Ticket im Schnitt 12€, und Kunden warten Tage auf eine Antwort." },
      { icon: Icon24Hours, text: "Ihre Kunden bekommen rund um die Uhr in 30 Sekunden eine Antwort — 80% aller Anfragen sofort gelöst." },
      { icon: IconUserCheck, text: "Bei kniffligen Fällen wartet niemand auf eine Wiederholung — Ihr Mitarbeiter kennt den ganzen Verlauf sofort." },
      { icon: IconRepeatOff, text: "Wiederkehrende Probleme sinken um 40% pro Quartal, ohne dass jemand extra danach sucht." },
      { icon: IconMoodSmile, text: "Am Ende zahlen Sie unter 1€ pro Anfrage, und Ihre Kunden sind spürbar zufriedener." },
    ],
  },

  /* ── Industrie — Entscheidungsinstanzen ── */
  entscheidungsinstanzen: {
    showcase: {
      plannedImage: "pain-point-entscheidungsinstanzen-result",
      imageAlt: "Gremienarbeit ohne Verwaltungsballast: strukturierte Bewertung statt E-Mail-Chaos",
      imageNote:
        "Editorial-Bild: ruhige, reale Szene am Bewertungs-Cockpit oder aus einer Gremiensitzung — Menschen arbeiten konzentriert mit der Scoring-Oberfläche (Kriterien-Matrix im Hintergrund sichtbar), keine Stock-Illustration.",
    },
    title: "So sieht Ihr Alltag mit NEWEDGE aus",
    steps: [
      { icon: IconStack2, text: "Hunderte Einreichungen fühlen sich an wie eine Handvoll — jede sofort im gleichen Format." },
      { icon: IconAdjustments, text: "Ihre eigenen Bewertungskriterien bleiben exakt dieselben, nur ohne Mehraufwand." },
      { icon: IconMailOff, text: "Ihr Gremium bewertet, statt E-Mails hinterherzujagen." },
      { icon: IconScale, text: "Ein zu strenger oder zu milder Juror fällt auf, bevor er zum Problem wird." },
      { icon: IconCertificate, text: "Fragt der Rechnungshof nach, ist die Begründung längst dokumentiert — VgV/UVgO-konform." },
      { icon: IconCircleCheck, text: "Aus wochenlanger Koordination wird ein Ergebnis, dem niemand widerspricht — ohne den Verwaltungsballast von früher." },
    ],
  },

  /* ── Industrie — Health Care (Arztpraxen/MVZ) ── */
  "health-care": {
    showcase: {
      plannedImage: "pain-point-health-care-result",
      imageAlt: "Praxisalltag ohne Verwaltungsstress: voller Kalender, ruhige Rezeption, saubere Abrechnung",
      imageNote:
        "Split-Bild: links Ist-Zustand (überladener Empfangstresen, klingelndes Telefon, Papierstapel), rechts das Praxis-Dashboard mit ruhiger, grüner No-Show-Anzeige — kein Stockfoto-Arzt-Klischee.",
    },
    title: "So sieht Ihr Alltag mit NEWEDGE aus",
    steps: [
      { icon: IconPhoneOff, text: "Ihre Rezeption beantwortet keine Terminfragen mehr am Telefon — die laufen von selbst." },
      { icon: IconCalendarCheck, text: "Ein abgesagter Termin ist sofort neu vergeben, statt als Lücke im Kalender zu bleiben." },
      { icon: IconFileInvoice, text: "Jede Leistung ist korrekt codiert, bevor sie zur Abrechnung geht." },
      { icon: IconStopwatch, text: "Aus 6–8 Stunden Verwaltung pro Woche werden unter 45 Minuten." },
      { icon: IconCalendarStats, text: "Nach der ersten Woche sehen Sie es im Kalender: No-Shows unter 5%, Abrechnungsfehler unter 2%." },
    ],
  },

  /* ── Industrie — Handel & Supply Chain ── */
  "handel-supply-chain": {
    showcase: {
      plannedImage: "pain-point-handel-supply-chain-result",
      imageAlt: "Bestellungen ohne Abtippen: vom Posteingang direkt ins ERP, Wareneingang automatisch abgeglichen",
      imageNote:
        "Split-Moment in einem Bild: links Ausgangschaos aus Mail-Postfach, Excel-Liste und Klemmbrett am Wareneingang, rechts aufgeräumtes Dashboard mit Bestellstatus, Lieferanten-Score und Wareneingangs-Ampel.",
    },
    title: "So sieht Ihr Alltag mit NEWEDGE aus",
    steps: [
      { icon: IconPackageImport, text: "Egal wie die Bestellung reinkommt — Mail, EDI, Portal, PDF — sie geht nie unter." },
      { icon: IconKeyboardOff, text: "Niemand tippt mehr Artikelnummern oder Mengen ab." },
      { icon: IconBolt, text: "Ihr ERP zeigt die Order in Echtzeit, bevor überhaupt jemand danach fragen könnte." },
      { icon: IconChartBar, text: "Sie wissen genau, auf welchen Lieferanten Sie sich verlassen können — objektiv, nicht nach Bauchgefühl." },
      { icon: IconPackageOff, text: "Eine falsche Lieferung fällt sofort auf, nicht erst drei Wochen später im Lager." },
      { icon: IconTruckDelivery, text: "Aus drei Vollzeitstellen für Dateneingabe wird ein System, das 400 Bestellungen am Tag mit unter 0,5% Fehlern verarbeitet." },
    ],
  },

  /* ── Industrie — Professional Services (Berater/Kanzleien/Steuerberater) ── */
  "professional-services": {
    showcase: {
      plannedImage: "pain-point-professional-services-result",
      imageAlt: "Mehr Mandatsarbeit, weniger Verwaltung: Recherche und Reports laufen im Hintergrund",
      imageNote:
        "Split-Visual: links Berater am überladenen Schreibtisch (Papierstapel, Rückfragen-Mails), rechts derselbe Berater im Mandantengespräch, im Hintergrund läuft ein schlankes Dashboard.",
    },
    title: "So sieht Ihr Alltag mit NEWEDGE aus",
    steps: [
      { icon: IconSearch, text: "Recherche, die früher Stunden band, ist jetzt in Minuten erledigt." },
      { icon: IconReport, text: "Reports entstehen automatisch — niemand bleibt abends dafür länger im Büro." },
      { icon: IconMessageCheck, text: "Mandantenanfragen sind sofort beantwortet, nicht erst am nächsten Tag." },
      { icon: IconReceipt, text: "Die 35–40% Ihrer Zeit, für die bisher kein Mandant bezahlt hat, wird zu abrechenbarer Arbeit." },
      { icon: IconCalendarPlus, text: "Bei einer 5-köpfigen Kanzlei sind das fast zwei Arbeitstage pro Woche zurück für Mandate — nicht für Verwaltung." },
    ],
  },
};
