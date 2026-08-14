import type { ImageKey } from "./assets";
import type { Icon } from "@tabler/icons-react";
import {
  Icon24Hours,
  IconAdjustments,
  IconAlertTriangle,
  IconBellRinging,
  IconBolt,
  IconBook2,
  IconBuildingCommunity,
  IconCalendarCheck,
  IconCalendarPlus,
  IconCalendarStats,
  IconCertificate,
  IconChartBar,
  IconCircleCheck,
  IconClockCheck,
  IconCoin,
  IconCoins,
  IconDatabase,
  IconFileAlert,
  IconFileCheck,
  IconFileImport,
  IconFileInvoice,
  IconFlag,
  IconGauge,
  IconHistory,
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
  IconTool,
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
  "entscheidungen-fallpruefung": {
    showcase: {
      plannedImage: "pain-point-auswahlverfahren-result",
      imageAlt: "Geordnetes Auswahlverfahren: alle Bewerbungen strukturiert und vergleichbar statt Posteingang-Chaos",
      imageNote:
        "Split-Visual: links überfülltes Postfach/PDF-Stapel (Chaos, viele Formate), rechts derselbe Inhalt als klare Prozesskette mit Stationspunkten auf einer Linie — keine Menschen, reine Systemansicht.",
    },
    title: "So sieht Ihr Alltag mit NEWEDGE aus",
    steps: [
      { icon: IconInbox, text: "Keine Bewerbung geht unter — egal wie viele eingehen, jede wird gesehen." },
      { icon: IconScale, text: "Ihre Jury vergleicht Substanz, nicht Formatierung." },
      { icon: IconUsersGroup, text: "Ihr Gremium bewertet, statt zu koordinieren — die Terminjonglage fällt weg." },
      { icon: IconAlertTriangle, text: "Uneinigkeit zwischen Juroren fällt auf, bevor sie zum Streitfall wird." },
      { icon: IconFileCheck, text: "Legt ein Bewerber Einspruch ein, haben Sie die Begründung längst fertig." },
      { icon: IconTrendingDown, text: "Aus einem Verfahren, das verwaltet werden muss, wird eines, das läuft — Ihr Team steuert es nur noch." },
    ],
  },

  /* ── Pain Point — Dokumente & Prozesse ── */
  "dokumente-prozesse": {
    showcase: {
      plannedImage: "pain-point-compliance-result",
      imageAlt: "Unterlagen im Griff: ein ruhiger Überblick über alle Vorgänge statt Dokumentenstapel im Posteingang",
      imageNote:
        "Split-Visual: links Ausgangschaos (Dokumentenstapel in unterschiedlichen Formaten, überfülltes Postfach, Telefonhörer), rechts eine einzige ruhige Übersicht mit geprüften Vorgängen.",
    },
    title: "So sieht Ihr Alltag mit NEWEDGE aus",
    steps: [
      { icon: IconLanguage, text: "Unterlagen kommen in jedem Format und über jeden Kanal — sortiert werden sie trotzdem." },
      { icon: IconFileAlert, text: "Eine fehlende Anlage fällt auf, bevor der Vorgang in die Bearbeitung geht." },
      { icon: IconShieldCheck, text: "Ihre Vorgaben ändern sich? Merken Sie nichts davon — jeder Vorgang wird gegen den aktuellen Stand geprüft." },
      { icon: IconCoins, text: "Nacharbeit entsteht gar nicht erst: Lücken zeigen sich beim Eingang, nicht nach der Entscheidung." },
      { icon: IconLayoutDashboard, text: "Sachbearbeitung, Fachabteilung und Leitung schauen zum ersten Mal auf denselben Stand." },
    ],
  },

  /* ── Pain Point — Steuerung & Reporting ── */
  "steuerung-reporting": {
    showcase: {
      plannedImage: "pain-point-kpi-dashboard-result",
      imageAlt: "Ein Blick statt Zahlensuche: der aktuelle Stand aller Vorgänge in einer Sicht",
      imageNote:
        "Vorher/Nachher in einem Bild: links Tabellen und Report-Stapel mit Datumsstempel „letzte Woche“, rechts eine einzige Sicht mit dem aktuellen Bearbeitungsstand.",
    },
    title: "So sieht Ihr Alltag mit NEWEDGE aus",
    steps: [
      { icon: IconGauge, text: "Ein Blick genügt, um zu wissen, wie die Vorgänge stehen." },
      { icon: IconDatabase, text: "Leitung, Fachbereich und Controlling streiten nicht mehr, wessen Zahl stimmt — es gibt nur noch eine." },
      { icon: IconBellRinging, text: "Eine kritische Abweichung meldet sich bei Ihnen, statt dass Sie danach suchen." },
      { icon: IconStopwatch, text: "Der Bericht entsteht nicht mehr in Handarbeit — er liegt vor, wenn Sie ihn brauchen." },
      { icon: IconRadar, text: "Ein Bearbeitungsstau oder eine kippende Frist fällt auf, solange sich noch etwas daran ändern lässt." },
    ],
  },

  /* ── Pain Point — KI-Kundensupport ── */
  "service-fallbearbeitung": {
    showcase: {
      plannedImage: "pain-point-ki-kundensupport-result",
      imageAlt: "Service, der von selbst läuft: Routineanfragen sofort beantwortet, Ihr Team frei für die kniffligen Fälle",
      imageNote:
        "Split-Screen-Illustration: links ein überfülltes Anfragen-Postfach mit wachsender Warteschlange, rechts ein ruhiger Funnel — Routineanfragen laufen sofort durch, nur einzelne Fälle gehen an einen Menschen weiter.",
    },
    title: "So sieht Ihr Alltag mit NEWEDGE aus",
    steps: [
      { icon: IconCoin, text: "Routineanfragen binden nicht mehr die Arbeitszeit, die sie heute kosten." },
      { icon: Icon24Hours, text: "Wer sich meldet, bekommt rund um die Uhr eine Antwort — nicht erst, wenn Ihr Team wieder besetzt ist." },
      { icon: IconUserCheck, text: "Bei kniffligen Fällen wartet niemand auf eine Wiederholung — Ihr Mitarbeiter kennt den ganzen Verlauf sofort." },
      { icon: IconRepeatOff, text: "Anliegen, die immer wieder auftauchen, werden sichtbar — und lassen sich an der Ursache abstellen." },
      { icon: IconMoodSmile, text: "Ihre Kunden merken den Unterschied zuerst an der Wartezeit — Ihr Team an den Fällen, die endlich Zeit bekommen." },
    ],
  },

  /* ── Industrie — Entscheidungsinstanzen ── */
  "foerderungen-entscheidungsinstanzen": {
    showcase: {
      plannedImage: "pain-point-entscheidungsinstanzen-result",
      imageAlt: "Gremienarbeit ohne Verwaltungsballast: strukturierte Bewertung statt E-Mail-Chaos",
      imageNote:
        "Editorial-Bild: ruhige, reale Szene am Bewertungs-Cockpit oder aus einer Gremiensitzung — Menschen arbeiten konzentriert mit der Scoring-Oberfläche (Kriterien-Matrix im Hintergrund sichtbar), keine Stock-Illustration.",
    },
    title: "So sieht Ihr Alltag mit NEWEDGE aus",
    steps: [
      { icon: IconStack2, text: "Ein großer Stapel Einreichungen fühlt sich an wie eine Handvoll — jede sofort im gleichen Format." },
      { icon: IconAdjustments, text: "Ihre eigenen Bewertungskriterien bleiben exakt dieselben, nur ohne Mehraufwand." },
      { icon: IconMailOff, text: "Ihr Gremium bewertet, statt E-Mails hinterherzujagen." },
      { icon: IconScale, text: "Ein zu strenger oder zu milder Juror fällt auf, bevor er zum Problem wird." },
      { icon: IconCertificate, text: "Fragt der Rechnungshof nach, ist die Begründung längst dokumentiert — VgV/UVgO-konform." },
      { icon: IconCircleCheck, text: "Aus wochenlanger Koordination wird ein Ergebnis, dem niemand widerspricht — ohne den Verwaltungsballast von früher." },
    ],
  },

  /* ── Industrie — Versicherungen ── */
  versicherungen: {
    showcase: {
      plannedImage: "pain-point-versicherungen-result",
      imageAlt:
        "Schadenbearbeitung ohne Sucharbeit: eine vorbereitete Fallakte statt verstreuter Meldungen und Nachweise",
      imageNote:
        "Split-Visual: links eine Schadenmeldung mit verstreuten Anhängen und langem Mail-Verlauf, rechts dieselbe Sache als aufgeräumte Fallakte mit Vollständigkeitsstatus, Deckungshinweis und markierten Auffälligkeiten — Systemansicht, keine Menschen.",
    },
    title: "So sieht Ihr Alltag mit NEWEDGE aus",
    steps: [
      { icon: IconFileImport, text: "Eine Schadenmeldung erreicht Sie per Mail, Formular oder Telefonnotiz — aufgenommen wird sie trotzdem immer gleich." },
      { icon: IconFileCheck, text: "Der fehlende Nachweis ist angefordert, bevor Ihr Sachbearbeiter den Fall zum ersten Mal öffnet." },
      { icon: IconBook2, text: "Die Deckungsfrage ist vorgeprüft — mit der Fundstelle im Bedingungswerk statt aus dem Gedächtnis." },
      { icon: IconAlertTriangle, text: "Ein Vorschaden oder eine Unstimmigkeit in den Angaben fällt auf, statt durchzurutschen." },
      { icon: IconMessageCheck, text: "Makler und Kunden müssen den Stand nicht mehr erfragen — sie sehen ihn." },
      { icon: IconGauge, text: "Aus Fällen, die erst zusammengetragen werden müssen, werden Fälle, die Ihr Haus nur noch entscheidet." },
    ],
  },

  /* ── Industrie — Bildung ── */
  bildung: {
    showcase: {
      plannedImage: "pain-point-bildung-result",
      imageAlt:
        "Zulassung ohne Stapelarbeit: geprüfte, vergleichbare Bewerbungen statt PDF-Mappen im Postfach",
      imageNote:
        "Split-Visual: links ein Stapel aus PDF-Bewerbungen, Zeugniskopien und Mail-Anhängen, rechts eine geordnete Bewerbungsübersicht mit Vollständigkeits-Status je Nachweis und markierten Sonderfällen — reine Systemansicht.",
    },
    title: "So sieht Ihr Alltag mit NEWEDGE aus",
    steps: [
      { icon: IconStack2, text: "Ein Stapel Bewerbungen liegt vor Ihrer Kommission wie eine einzige — jede im selben Format." },
      { icon: IconFileCheck, text: "Ein fehlendes Zeugnis fällt vor der Sichtung auf, nicht mittendrin." },
      { icon: IconScale, text: "Jede Bewerbung wird an denselben Kriterien gemessen — unabhängig davon, wer sie in die Hand nimmt." },
      { icon: IconFlag, text: "Sonderfälle liegen markiert vor Ihrer Kommission, statt unbemerkt mitzulaufen." },
      { icon: IconMessageCheck, text: "Fragen nach Fristen, Unterlagen und Bearbeitungsstand erreichen Ihren Studierendenservice gar nicht erst — sie sind längst beantwortet." },
      { icon: IconHistory, text: "Wird eine Zulassung später hinterfragt, lässt sich jeder Prüfschritt zeigen — ohne Suche im Postfach." },
    ],
  },

  /* ── Industrie — Immobilien ── */
  immobilien: {
    showcase: {
      plannedImage: "pain-point-immobilien-result",
      imageAlt:
        "Verwaltung ohne Sortierarbeit: strukturierte Objektakten statt ungeordneter Miet- und Belegstapel",
      imageNote:
        "Split-Visual: links ein ungeordneter Stapel aus Mietverträgen, Belegen, Fotos und E-Mail-Ausdrucken, rechts eine strukturierte Objektakte je Einheit mit Fristenlinie und gekennzeichneten Auffälligkeiten.",
    },
    title: "So sieht Ihr Alltag mit NEWEDGE aus",
    steps: [
      { icon: IconBuildingCommunity, text: "Jedes Dokument liegt am richtigen Objekt und an der richtigen Einheit — niemand sortiert mehr nach." },
      { icon: IconFileAlert, text: "Ein fehlender Nachweis oder eine Abweichung zum Bestand ist gekennzeichnet, bevor Sie den Vorgang öffnen." },
      { icon: IconCalendarCheck, text: "Fristen laufen mit, statt im Kalender und im Gedächtnis einzelner Kollegen zu hängen." },
      { icon: IconTool, text: "Der Handwerksbetrieb bekommt den Auftrag mit allem, was er braucht — die Rückfragerunde entfällt." },
      { icon: IconClockCheck, text: "Ein Mieteranliegen ist aufgenommen und eingeordnet, auch wenn gerade niemand im Büro sitzt." },
      { icon: IconLayoutDashboard, text: "Aus Listen, die aus mehreren Quellen zusammengetragen werden, wird ein Portfolio-Stand, den Sie einfach ansehen." },
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
