# ROI-Rechner — Konzept für die Ergebnis-Ausgabe

**Status:** Konzept zur Abstimmung. Noch nicht umgesetzt — reine Text-Grundlage für die nächste Design-/Dev-Runde.
**Betrifft:** Nur die Ergebnis-Darstellung (`/roi-rechner`, Schritt „Analyse ansehen" nach den 3 Fragen). Die Eingabeschritte (Branche/Rollen/Reifegrad) und die Rechenlogik selbst sind **nicht** Gegenstand dieses Konzepts — die Zahlen stimmen, es geht nur darum, wie das Ergebnis kommuniziert wird.

---

## 1. Ausgangslage

Wenn ein Nutzer den Rechner durchläuft, bekommt er aktuell eine dunkle Karte mit — in dieser Reihenfolge — folgenden Elementen:

1. Eyebrow „Ihr Kurz-Audit · [Branche]"
2. Headline „Das bekommen Sie zurück." + Subline
3. Umschalter Geld / Zeit / Wachstum
4. Eine große Zahl (z. B. „20 Tsd. €") + Subline + Spanne („konservativ … ambitioniert …")
5. Benchmark-Box: Vergleichssatz + Fortschrittsbalken
6. Tool-Stack-Box (nur wenn Tools angeklickt wurden)
7. „Nach Rolle" — Balkenliste mit Rollennamen + Betrag
8. Regler „Wie vorsichtig rechnen wir?"
9. Zwei Kacheln: Amortisationsdauer + Einstiegspreis
10. Kleingedrucktes (Methodik-Hinweis)

Direkt darunter, in einer zweiten (hellen) Karte:

11. „Ihre KI-Abteilung im Einsatz" — **dieselben Rollen nochmal**, jetzt mit Prozess-Beispiel, Aufwand-Label und Tools
12. PDF-Export + Lead-Formular

Das ist inhaltlich vollständig und korrekt — aber es sind **12 gleichrangige Blöcke ohne Rangfolge**. Der Nutzer muss den ganzen Screen lesen, um selbst zusammenzusetzen, was er eigentlich bekommt.

## 2. Diagnose — warum es nicht auf den ersten Blick verständlich ist

**a) Keine Kernaussage.** Es gibt keinen einzelnen Satz, der Nutzen + Aufwand + Kosten verbindet. Stattdessen: große Zahl hier, Payback-Zeit dort, Preis ganz unten — der Leser muss selbst verknüpfen „X € zurück, kostet ab Y, rechnet sich in Z Monaten".

**b) Zwei Rollenlisten sagen (fast) dasselbe.** Die Balkenliste „Nach Rolle" zeigt nur Name + Betrag — ohne Kontext, was die Rolle tut. Genau dieser Kontext („z. B. Rechnungserstellung & Mahnwesen") steht dann elf Zeilen weiter unten in einer zweiten Liste nochmal, mit demselben Betrag. Zwei Listen für dieselbe Information kosten Scroll-Strecke und wirken redundant, statt dass eine Liste sofort beides zeigt.

**c) Die Rollennamen sind Metaphern ohne Übersetzung an der Stelle, wo sie zuerst auftauchen.** „Der Kassenwart", „Der Maschinenraum", „Der Concierge" sind sprachlich gut (auf Marke, bildhaft) — aber in der ersten Liste stehen sie **ohne** die konkrete Tätigkeit daneben. Ein Geschäftsführer ohne Vorwissen sieht „Der Concierge — 6 Tsd. €" und weiß nicht, wofür er das bekommt, ohne weiterzuscrollen.

**d) Der Benchmark-Satz kann sich wie eine Wiederholung lesen.** „Betriebe in „X" holen typischerweise 20 Tsd. €/Jahr heraus. Ihre Auswahl deckt davon 100 % ab." — wenn die Auswahl bereits 100 % beträgt (wie im Screenshot-Beispiel), steht dieselbe Zahl zweimal auf dem Screen, ohne dass der Zusatznutzen des Satzes (Vergleich zum Branchendurchschnitt) sofort klar wird.

**e) Die Kaufentscheidungs-Frage kommt zu spät.** „Was kostet mich das?" und „Wann rechnet sich das?" sind bei einem ROI-Rechner mit die ersten Fragen im Kopf des Nutzers — stehen aber nach Benchmark, Tools, Rollen-Balken und Regler, also praktisch am Ende der Karte.

**f) Visuell sind alle Blöcke gleich gewichtet.** Jede Box hat dieselbe Hintergrundfarbe, ähnliche Größe, ähnlichen Abstand — es gibt keine visuelle Hierarchie, die zeigt „das hier ist die eine wichtige Zahl, der Rest ist Beleg".

Wichtig: Nichts davon ist inhaltlich falsch. Es ist ein reines **Kommunikations-/Struktur-Problem**, kein Rechen- oder Konzeptionsfehler.

## 3. Leitprinzip fürs neue Konzept

> **Eine Kernaussage zuerst — alles andere ist Beleg.**
> Der Nutzer soll nach 3 Sekunden (ohne zu scrollen) sagen können: „Ich bekomme X zurück, koste mich ab Y, rechnet sich in Z." Alles danach beantwortet nur noch die Anschlussfrage „warum sollte ich das glauben?" (Benchmark, Regler, Methodik) bzw. „was heißt das konkret für mein Team?" (Rollen).

Zusätzlich: **jede Information genau einmal**, an der Stelle, wo sie zuerst gebraucht wird — keine zwei Rollenlisten.

## 4. Vorschlag: neuer Aufbau

### Block 1 — Der Ergebnis-Satz (neu, ganz oben)
Ein einzelner, großer Satz statt getrennter Headline + Zahl + Payback-Kachel:

> „Mit **[N] Rollen** in Ihrer KI-Abteilung sparen Sie **[Betrag] pro Jahr** — ab **[Einstiegspreis]**, nach **[Payback]** wieder drin."

*(Korrektur nach Selbstcheck: „amortisiert" war ein Rückfall in Fachdeutsch — genau das Wort, das an anderer Stelle im Rechner bereits zu „Investition wieder drin nach" vereinfacht wurde. Muss konsistent bleiben.)*

Das ist die eine Aussage, die alles beantwortet: Umfang, Nutzen, Preis, Zeitpunkt der Rentabilität. Der Geld/Zeit/Wachstum-Umschalter bleibt darunter erhalten (guter, bereits verständlicher Mechanismus) und aktualisiert nur den Nutzen-Teil des Satzes.

### Block 2 — Die große Zahl (bleibt, leicht geschärft)
Zahl + Umschalter bleiben wie heute. Subline wird konkreter:
- Alt: „Das sparen Sie pro Jahr — nach Abzug der laufenden Kosten"
- Neu: „Das bleibt Ihnen jedes Jahr übrig — laufende Kosten sind schon abgezogen"

Spanne („konservativ … ambitioniert …") bleibt als kleine Randnotiz.

### Block 3 — Eine Rollen-Liste statt zwei
Die Balkenliste „Nach Rolle" und die spätere Roadmap-Liste werden zu **einer** Liste zusammengeführt, direkt unter der großen Zahl. Jede Zeile zeigt sofort beides:

> **Der Kassenwart** — Rechnungserstellung & Mahnwesen · *Schneller Erfolg*
> ████████████████░░░░  8 Tsd. €/Jahr

Statt: Name + Balken (oben) … [scrollen] … Name + Prozessbeispiel + Tools (unten).

Die ausführlichere Tool-/Prozess-Information (aktuell in der unteren Roadmap-Karte) bleibt als **aufklappbares Detail** pro Zeile erhalten, für alle, die es genauer wissen wollen — muss aber nicht mehr auf den ersten Blick sichtbar sein.

### Block 4 — „Warum diese Zahl?" (konsolidierte Vertrauens-Box)
Benchmark und Regler werden zu einer Box zusammengeführt, da beide dieselbe Funktion haben (Vertrauen in die Zahl schaffen):

- Regler bleibt interaktiv, Beschriftung bleibt („Wie vorsichtig rechnen wir?").
- Benchmark-Satz wird situationsabhängig formuliert, damit er nie wie eine Wiederholung wirkt:
  - Wenn Auswahl < 100 % des Branchen-Potenzials: „Betriebe wie Ihres holen bis zu [volle Zahl]/Jahr aus einer vollen KI-Abteilung heraus — Sie haben aktuell [Z] % davon ausgewählt. Mehr Rollen = mehr Ersparnis."
  - Wenn Auswahl = 100 %: „Sie haben bereits das volle Potenzial für „[Branche]" ausgewählt — mehr geht branchentypisch nicht."

### Block 5 — Tool-Stack-Box
Bleibt unverändert — funktioniert bereits gut („diese Tools binden wir an, statt sie zu ersetzen" ist eine klare, beruhigende Aussage).

### Block 6 — Methodik-Hinweis
Bleibt als Kleingedrucktes am Ende, unverändert in der Funktion.

### Block 7 — Report/PDF + Lead-Formular
Bleibt strukturell wie heute, rutscht aber direkt nach der (jetzt einzigen) Rollen-Liste, da die separate zweite „Roadmap"-Karte entfällt (ihr Inhalt ist in Block 3 aufgegangen).

### Sprachliche Kleinigkeiten
- „ab 3.200 € · Einstieg · staatlich förderfähig (BAFA)" → BAFA ist für Laien ein unbekanntes Kürzel. Vorschlag: „ab 3.200 € · oft bezuschusst über die staatliche BAFA-Förderung" (einmal ausgeschrieben reicht).
- „Realitäts-Regler" als interner Name ist bereits durch „Wie vorsichtig rechnen wir?" ersetzt — das bleibt so, ist verständlich.

## 5. Kurzüberblick: was bleibt, was ändert sich

| Element | Bleibt | Ändert sich |
|---|---|---|
| Geld/Zeit/Wachstum-Umschalter | ✅ Mechanik | Wird Teil des neuen Ergebnis-Satzes |
| Große Zahl | ✅ | Subline geschärft |
| Benchmark | ✅ Aussage | Formulierung situationsabhängig, mit Regler zusammengelegt |
| Regler „Wie vorsichtig rechnen wir?" | ✅ komplett | Nur Position (jetzt in derselben Box wie Benchmark) |
| Tool-Stack-Box | ✅ komplett | — |
| „Nach Rolle"-Liste | Konzept bleibt | Fusioniert mit der unteren Roadmap-Liste zu einer Liste mit Kontext direkt sichtbar |
| Payback + Einstiegspreis | ✅ Inhalt | Wandert in den neuen Ergebnis-Satz ganz oben, zusätzlich weiter als Kacheln sichtbar |
| Methodik-Kleingedrucktes | ✅ | — |
| PDF-Report + Lead-Formular | ✅ komplett | Rutscht direkt unter die (jetzt einzige) Rollen-Liste |

## 6. Offene Fragen für die Abstimmung

1. **Aufklappbare Rollen-Details** (Block 3): reicht ein einfaches Akkordeon pro Zeile, oder soll das Prozessbeispiel + Tools immer sichtbar sein (dann wird jede Zeile höher)?
2. **Ergebnis-Satz bei „Zeit"/„Wachstum"-Lens**: Soll der ganze Satz („…sparen Sie X pro Jahr…") für alle drei Lenses umformuliert werden, oder bleibt der Satz geld-fokussiert und nur die kleine Zahl darunter wechselt?
3. **Benchmark-Formulierung bei 100 %**: Passt der Vorschlag oben, oder gibt es eine noch bessere Formulierung für „Sie haben schon alles ausgewählt"?
4. **Rollen-Metaphern vs. Klartext** *(neu, nach Selbstcheck)*: „Der Kassenwart", „Der Concierge" etc. sind auf Marke, brauchen aber jedes Mal eine Mini-Übersetzung im Kopf des Lesers, bevor die konkrete Tätigkeit danebensteht. Bleiben die Metaphern (mit Tätigkeit direkt daneben, wie in Block 3 vorgeschlagen), oder wird für dieses eine Ergebnis-Modul auf reinen Klartext umgestellt („Rechnungen & Mahnwesen" statt „Der Kassenwart")? Trade-off: Wiedererkennung/Marke vs. Null-Übersetzungsaufwand.
5. **Benchmark-Box entschärfen** *(neu, nach Selbstcheck)*: Der Satz „Betriebe holen X/Jahr, Sie decken Y % davon ab" verlangt vom Leser, einen Euro-Betrag gegen einen Prozentsatz abzuwägen — das ist eher etwas für die genauer interessierte Minderheit, nicht fürs Verstehen auf den ersten Blick. Vorschlag zur Diskussion: Box standardmäßig kleiner/reduziert zeigen (z. B. nur der Balken + ein kurzer Halbsatz), volle Erklärung optional aufklappbar.

---

*Nächster Schritt laut Absprache: Dieses Dokument geht an den Projektentwickler zur Abstimmung. Erst danach folgt die Umsetzung im Code.*
