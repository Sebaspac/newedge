# SEO- und Sprach-Audit newedgebrand.com

**Stand:** 13. August 2026
**Geprüfter Gegenstand:** Quellcode und gebauter Stand (`apps/website/dist`, 32 vorgerenderte Routen), deutsche und englische Inhaltsdateien, Sitemap, robots.txt.

---

## Vorbemerkung: Was ich selbst nachgeprüft habe

Diesem Bericht liegen fünf Einzelanalysen zugrunde. Ich habe die schwersten Befunde selbst an der Datei bzw. am gebauten HTML nachgemessen, bevor ich sie übernommen habe. **Drei gemeldete Befunde haben sich nicht bestätigt und sind hier gestrichen:**

| Gemeldeter Befund | Ergebnis meiner Nachprüfung |
|---|---|
| „`<html lang="de">` auch auf allen englischen Seiten" (als kritisch gemeldet) | **Falsch.** Gemessen über alle 32 Dateien: 16× `lang="de"`, 16× `lang="en"`, korrekt zugeordnet. Ist bereits behoben. |
| „Kein `hreflang` im ausgelieferten HTML" (als hoch gemeldet) | **Falsch.** Jede Seite trägt drei korrekte `<link rel="alternate">`-Tags (de / en / x-default). Ist bereits behoben. |
| „`og:locale` fehlt auf allen Seiten" | **Falsch.** Vorhanden und korrekt: `de_DE` auf den deutschen, `en_US` auf den englischen Seiten, jeweils mit Gegensprache als `alternate`. |

Der Rest wurde bestätigt. **Eine Angabe habe ich korrigiert:** BAFA ist nicht „genau zweimal" erwähnt, sondern an rund einem Dutzend Stellen (Hero, Footer, Mini-Cases, KI-Audit) — der eigentliche Punkt bleibt trotzdem gültig: Es gibt keine eigene Seite dazu.

**Grenzen dieses Berichts, offen benannt:**
- Es waren **keine SEO-Werkzeuge** angebunden (kein Ahrefs, kein Semrush, keine Search Console). Sämtliche Angaben zu Suchvolumen und Wettbewerbsdichte in Kapitel 5 sind **Einschätzungen**, keine Messwerte. Sie beruhen darauf, wie dicht der jeweilige Suchraum in der normalen Websuche von Anbietern bespielt wird — das ist ein Indiz, kein Beleg.
- Es wurden **keine Ladezeiten und keine Core Web Vitals** gemessen. Die Aussagen zu Bildern sind reine Dateigrößen aus dem Build.
- Zahlen aus Wettbewerber-Websites (Preisspannen, Automatisierungsquoten) sind **unverifizierte Fremdangaben** und taugen nicht als Zielwert.
- Ein Live-Abruf der Domain schlug mit einem TLS-Fehler fehl. Alle Aussagen zum ausgelieferten HTML stützen sich auf den lokalen `dist`-Ordner.

---

## 1. Kurzfassung

Die inhaltliche und redaktionelle Substanz der Website ist überdurchschnittlich: 32 Routen mit durchweg einmaligen Titeln und Beschreibungen, eine fehlerfreie Sitemap mit vollständiger Sprachverknüpfung, eine saubere Positionierungslogik (ein Cortex → vier Blueprints → vier Branchen) und mit `llms.txt` sogar eine gut gepflegte Datei speziell für KI-Suchmaschinen. **Das ist die größte Stärke — und genau sie kommt derzeit nicht an.**

Die drei wichtigsten Baustellen: **Erstens** wird beim Bauen der Seiten nur der unsichtbare Kopfbereich (Titel, Beschreibung) mit Inhalt gefüllt, der sichtbare Textkörper bleibt leer — gemessen über alle 32 Seiten: null Überschriften, null Links, null Bilder, null Fließtext. Suchmaschinen und KI-Assistenten, die kein JavaScript ausführen, sehen auf jeder Seite eine leere Hülle. **Zweitens** ist die englische Fassung inhaltlich weitgehend korrekt, sprachlich aber an rund zwei Dutzend Stellen erkennbar eine Wort-für-Wort-Übersetzung — plus ein komplettes Modul, das auf allen englischen Seiten auf Deutsch erscheint. **Drittens** fehlen die Fachbegriffe, mit denen die Zielbranchen tatsächlich suchen; „Dunkelverarbeitung", der Standardbegriff des Versicherungsmarkts, kommt auf der gesamten Website kein einziges Mal vor.

**Gesamteinschätzung: Nacharbeit nötig, mit einem kritischen Einzelpunkt.** Das Fundament ist solide gebaut und in den letzten Wochen erkennbar verbessert worden (Sprachauszeichnung und hreflang wurden bereits repariert). Der leere Textkörper ist aber ein Alles-oder-nichts-Problem: Solange er besteht, wirkt keine einzige inhaltliche Maßnahme.

---

## 2. Sprache Deutsch / Englisch

**Die kurze Antwort: Ja, die englische Fassung ist sinngemäß richtig.** Es gibt keine erfundenen Zahlen, keine falschen Produktversprechen, keine fehlenden Absätze. Struktur, Anzahl der FAQ, Vergleichszeilen und Aufzählungen stimmen zwischen beiden Sprachen praktisch überall überein. Die Anrede ist sauber getrennt (Deutsch durchgehend Sie-Form, Englisch durchgehend „you"). Es gibt keine deutschen Textreste in den sichtbaren englischen Texten.

**Aber:** An vier Stellen sagt Englisch etwas anderes als Deutsch, und ein ganzes Modul erscheint auf den englischen Seiten auf Deutsch. Dazu kommt eine größere Zahl unidiomatischer Formulierungen — kein Sinnfehler, aber für einen englischen Muttersprachler sofort als Übersetzung erkennbar. Bei einer Marke, die sich als Anbieter für anspruchsvolle Institutionen positioniert, ist das ein Glaubwürdigkeitsproblem.

### 2.1 Echte Sinnabweichungen und Ausfälle

| Datei | Deutsch sagt | Englisch sagt | Warum das ein Problem ist |
|---|---|---|---|
| `src/content/resultJourney.ts` (kein englisches Gegenstück) | Komplettes Modul „So sieht Ihr Alltag mit NEWEDGE aus" mit 4–6 Stationen | *Nichts* — die deutsche Datei wird fest importiert | **Schwerster Sprachfund.** Auf allen acht englischen Blueprint- und Branchenseiten steht ein ganzes Modul mitten im englischen Layout auf Deutsch. Bestätigt: `en/resultJourney.ts` existiert nicht, `PainPointAuswahlverfahren.tsx:20` importiert die deutsche Datei fest. |
| `en/painPoints.ts:1599` (Versicherungen) | „Auffälligkeiten sind markiert … auch **Vorschäden und Unstimmigkeiten in den Angaben**" | „…flagged rather than missed — **the assessment still happens in your team**" | Die konkrete Fachleistung (Vorschäden-Erkennung) verschwindet und wird durch einen Satz ersetzt, der im selben Absatz schon zweimal steht. Der englische Leser erfährt die Kernfähigkeit nicht. |
| `en/painPoints.ts:389, 502` | „damit Nachweis- und Aufbewahrungspflichten **erfüllbar bleiben**" | „…remain **easy to meet**" | Englisch verspricht mehr als Deutsch — nicht Erfüllbarkeit, sondern Leichtigkeit. Ausgerechnet bei regulatorischen Pflichten ein Haftungsrisiko im Marketingversprechen. |
| `en/painPoints.ts:231` | „Das **spart** in jedem Zyklus Aufwand" | „That **takes the administrative load out of** every cycle" | Englisch behauptet Beseitigung, Deutsch nur Reduktion. Steht im Definitionsabsatz — genau dem Absatz, den Google und KI-Assistenten als Antwort zitieren. |
| `en/sections/positionedForImpact.ts:54,56` | „5–150 Mitarbeitende — **Unternehmen wie Ihres**"; „4x — **zahlt sich Ihre Investition aus**" | „Employees, **sweet spot**"; „**4x ROI on systems work**" | Aus einer Kundenaussage wird Agenturjargon und eine nackte Kennzahlbehauptung. Zusätzlich widerspricht es der eigenen englischen Fassung derselben Zahlen in `en/sections/impactCounter.ts`. |
| `en/painPoints.ts:894` (Förderungen) | „…senken so den **Aufwand pro Verfahren**" / „bis zum **Bescheid**" | „…take the **coordination load off their panels**" / „to the **final notice**" | Zwei Abweichungen in einem Satz. „Final notice" heißt im Englischen die letzte Mahnung vor der Vollstreckung — nicht der Förderbescheid. |
| `en/sections/hero.ts:54` | „bleibt sie zu oft Insellösung oder **Risiko**" | „…a siloed tool or a **liability**" | „Liability" ist im Geschäftsenglisch bilanziell/juristisch aufgeladen (Haftung, Verbindlichkeit). Härter als gemeint, und es steht in der Hero-Zeile der Startseite. |

### 2.2 Sprachliche Fehler, die auffallen

| Datei | Stelle | Problem |
|---|---|---|
| `en/sections/horizontalScroll.ts:61` | „We use AI as **a**" + rotierende Wörter „engine", „advantage" | **Sichtbarer Grammatikfehler.** Die Animation erzeugt auf der Seite „as a engine" und „as a advantage". Bestätigt am Quellcode. |
| `en/painPoints.ts` (5 Stellen) | „**reads out** the relevant details" | „To read out" heißt im Englischen *vorlesen*, nicht Daten auslesen. Betrifft die Kernaussage des Blueprints „Dokumente & Prozesse", inklusive Hero und Definition. Beweis, dass es ein Fehler ist: Zeile 408 derselben Datei nutzt bereits korrekt „extracted". |
| `en/painPoints.ts:371` | H1: „**The stack** is checked before you open it." | Bei einem KI-Anbieter liest „stack" zuerst als Technologie-Stack, nicht als Papierstapel. Die eigene Seite nutzt 130 Zeilen weiter korrekt „the paperwork". |
| `en/painPoints.ts:231` | „everyone **administrates**" | Kein gebräuchliches Englisch, im ersten Satz des Definitionsabsatzes. |
| `en/painPoints.ts:555, 640` | „a different professional **cut**" (aus „Zuschnitt") | Ergibt im Englischen keinen Sinn — und es ist ausgerechnet der Satz, der die ganze Blueprint-Logik erklärt. |
| `en/painPoints.ts:673` | „Classic BI tools deliver **the surface**" (aus „Oberfläche") | Die Kernabgrenzung gegen Power BI und Tableau, also ein verkaufsrelevanter Satz, ist unverständlich. |
| `en/painPoints.ts:868 ff.` | „**awarding body**" für Vergabestelle | Fachlich falsch. Im englischen Vergaberecht heißt das *contracting authority*; „awarding body" ist im Englischen eine Zertifizierungsstelle im Bildungswesen. Betrifft Titel, Beschreibung, Trustbar und FAQ der Förderungsseite. |
| `en/painPoints.ts:1949` | H1 Immobilien: „Your documents **order themselves** first." | Wörtliche Übernahme der deutschen Reflexivkonstruktion; „order" wird primär als *bestellen* gelesen. |
| `en/collections/jobs.ts` (4×) | mailto-Betreff: „Bewerbung: Praktikum Marketing…" | Wer sich über die **englische** Karriereseite bewirbt, bekommt einen deutschen Betreff ins Mailprogramm. |
| `en/collections/miniCases.ts` | 23 von 24 Bildreferenzen fehlen | Die englischen Fallbeispiele zeigen andere (generische) Bilder als die deutschen und verlieren alle kuratierten Bildbeschreibungen. |
| `en/painPoints.ts` | 21 von 43 Bildreferenzen fehlen | Bestätigt gemessen: Deutsch 43 `image:`-Einträge, Englisch 22. Gleiche Route, sichtbar anderer Seiteneindruck. |

### 2.3 Auf der deutschen Seite

Die deutsche Fassung ist weitgehend sauber. Drei Punkte:

- `painPoints.ts:229, 902`: **„Vertraut von führenden Organisationen"** ist selbst eine Rückübersetzung aus dem Englischen („Trusted by…"). Im Deutschen kein gültiges Muster — „vertraut" heißt *bekannt*, nicht *wird vertraut*. Steht direkt unter dem Hero. Besser: „Führende Organisationen in Deutschland vertrauen uns."
- `sections/newEdgeSystem.ts:59`: englischer Reststring `"Left-to-right transformation flow"` in der deutschen Datei, sichtbar auf `/methodik`.
- `painPoints.ts:294`: die Slang-Abkürzung „Entscheidungsdoku" in einer sonst durchgehend förmlichen Vergleichstabelle.

### 2.4 Uneinheitliche Begriffe (beide Sprachen)

„Mittelstand" wird im Englischen in sechs Varianten übersetzt (*mid-sized companies*, *Midsize Companies*, *the Mittelstand*, *German Mittelstand*, *SME*…), „förderfähig" in fünf, der Bayerische Mittelstandspreis hat drei englische Namen. Die vier Blueprint-Namen stehen in der Navigation groß („Steering & Reporting"), auf den Seiten klein („Steering & reporting"). Dazu mischen sich britisches und amerikanisches Englisch („enquiry" neben „organization"). Einzeln je harmlos, in Summe wirkt es unlektoriert.

---

## 3. Technischer SEO-Befund

| Prüfpunkt | Status | Details |
|---|---|---|
| **Ausgelieferter Seiteninhalt** | **Durchgefallen** | Der Bauvorgang füllt nur den Kopfbereich. Gemessen über alle 32 Dateien: `<div id="root"><!--app-html--></div>` — 0 Überschriften, 0 Links, 0 Bilder, 0 Fließtext. Selbst nachgemessen und bestätigt. |
| Seitentitel | Warnung | Alle 32 vorhanden, alle einmalig (0 Duplikate) — sehr gut. 5–6 Titel über 60 Zeichen und werden in Google gekürzt (längster: „Steuerung & Reporting mit KI: alle Kennzahlen an einem Ort \| NEWEDGE", 68 Zeichen — der Markenname fällt weg). |
| Meta-Beschreibungen | Warnung | Alle 32 vorhanden, alle einmalig. Rund 15 über 160 Zeichen und werden abgeschnitten. Fast keine enthält eine Handlungsaufforderung. |
| Canonical (Kanonische URL) | **Bestanden** | 32/32 korrekt und absolut, auch alle englischen Seiten zeigen korrekt auf sich selbst. |
| Sprachauszeichnung `html lang` | **Bestanden** | 16× `de`, 16× `en`, korrekt zugeordnet. *(Als Fehler gemeldet — Nachprüfung ergab: bereits behoben.)* |
| hreflang (Sprachverknüpfung) | **Bestanden** | Im HTML je 3 korrekte Tags pro Seite plus vollständig in der Sitemap, 100 % gegenseitig. *(Als Fehler gemeldet — Nachprüfung ergab: bereits behoben.)* |
| Sitemap | **Bestanden** | 32 URLs = 32 gebaute Seiten, keine Karteileichen, keine Lücken, keine Duplikate. Der stärkste Teil des Setups. Kleinigkeit: `lastmod` wird von Hand gepflegt und ist teils zwei Monate alt. |
| robots.txt | Warnung | Sauber, Sitemap referenziert, neun KI-Crawler ausdrücklich erlaubt. Einziger Punkt: `Disallow: /impressum` — das Impressum ist Pflichtangabe und Vertrauenssignal, es vom Crawling auszuschließen bringt nichts. |
| Open Graph (Vorschau beim Teilen) | Warnung | Titel, Beschreibung, URL und `og:locale` seitenspezifisch und korrekt. Aber: **ein einziges Vorschaubild für alle 32 Seiten.** Bei Blueprint- und Branchenseiten, die einzeln geteilt werden, verschenkt das Klicks. |
| Strukturierte Daten (JSON-LD) | **Durchgefallen** | Ausgeliefert wird nur ein Organisationsblock, identisch auf allen 32 Seiten. FAQ, Dienstleistungen und Brotkrumen-Navigation werden ausschließlich per JavaScript nachgeladen und sind für nicht-rendernde Crawler unsichtbar. Zusätzlich: das JSON-LD verweist auf `https://newedgebrand.com/logo.png` — **diese Datei existiert weder in `dist/` noch in `public/`.** Selbst nachgeprüft. |
| Interne Verlinkung | **Durchgefallen** | 0 Links in allen 32 Dateien zusammen. Für nicht-rendernde Crawler ist jede Seite eine Waise; einziger Auffindungsweg ist die Sitemap. Folgefehler des leeren Textkörpers. |
| H1 / Überschriftenhierarchie | Nicht bewertbar | Im Quellcode je eine H1 pro Seite vorhanden und korrekt — im ausgelieferten HTML kommt keine an. |
| Bildbeschreibungen (alt) | Nicht bewertbar | Im Quellcode vorbildlich (46 Bilder, 0 ohne alt-Attribut) — im ausgelieferten HTML kommt keines an. |
| Bildgewicht | Warnung | 27 Bilddateien über 500 KB, `dist/assets` insgesamt 245 MB. Größte: 2,7 MB (`blog-ki-fehler.jpg`). Mehrere Fotos liegen als PNG statt WebP vor. *Keine Ladezeitmessung durchgeführt — das sind reine Dateigrößen.* |
| Alias-Routen | Warnung | 13 zusätzliche Alias-Adressen (z. B. `/loesungen/auswahlverfahren`, `/industrien/versicherung`) liefern denselben Inhalt, bekommen aber den Startseiten-Titel. Auch die Fallbeispiel-Detailseiten laufen unter der Startseiten-Canonical und werden daher nie indexiert. |

---

## 4. Seiten-Befunde

| Seite | Problem | Schwere | Empfohlene Korrektur |
|---|---|---|---|
| **Alle 32 Routen** | Textkörper wird beim Bauen nicht gefüllt | **Kritisch** | Echtes serverseitiges Rendern in `scripts/prerender-seo.mjs` (`renderToString`), Spline/Three.js beim Renderlauf per dynamischem Import ausklammern. Vorbedingung für alles Weitere. |
| **Alle 8 englischen Blueprint-/Branchenseiten** | Deutsches Modul im englischen Layout | **Kritisch** | `src/content/en/resultJourney.ts` anlegen und in `PainPointAuswahlverfahren.tsx` über `useLocalized` einbinden. |
| Alle 32 Routen | JSON-LD verweist auf nicht existierendes `logo.png` | Hoch | Logo (quadratisch, ≥ 512 px) nach `public/` legen oder Feld auf vorhandene Datei umbiegen. 10 Minuten. |
| Alle 32 Routen | Nur Organisations-Schema ausgeliefert | Hoch | FAQ-, Dienstleistungs- und Brotkrumen-Schema beim Bauen fest ins HTML schreiben statt per JavaScript. |
| Alle 32 Routen | Ein einziges Teilen-Vorschaubild | Hoch | Eigene Bilder mindestens für die 4 Blueprints, 4 Branchen, Cortex, KI-Audit und ROI-Rechner. |
| `/industrien/versicherungen` | „Dunkelverarbeitung" kommt nicht vor; Beschreibung argumentiert aus Anbietersicht („dieselben Bausteine wie jeder anderen Branche") | Hoch | Fachbegriff in Definitionsabsatz und eine FAQ aufnehmen; Beschreibung auf Kundennutzen drehen. Zusätzlich Kernsystem-Namen nennen, an die angebunden wird — das ist der Filter, mit dem Versicherer Anbieter aussortieren. |
| `/industrien/immobilien` | Titel führt „KI-Abteilung" statt des gesuchten Vorgangs; Beschreibung wiederholt die interne Bausteinlogik | Mittel | Auf Mieteranfragen, Schadensmeldungen, Erreichbarkeit drehen. |
| `/industrien/bildung` | Titel nennt die Zielgruppe, nicht den Vorgang | Mittel | Vorgangsbegriffe (Bewerbung, Zulassung) in den Titel, Zielgruppe in die H1. |
| `/industrien/foerderungen-…` | — | — | **Vorbild.** Führt „Bewertungssoftware" im Titel und VgV/UVgO in der Beschreibung. So sollten die anderen drei aussehen. Nur der Titel ist 4 Zeichen zu lang. |
| Alle Blueprint-/Branchenseiten | Dieselbe FAQ dreifach („Bauen Sie für jede Branche eine eigene Lösung?") | Mittel | Duplikate auf eine reduzieren, freiwerdende Plätze mit echten Suchfragen belegen (Kosten, Laufzeit, Abgrenzung zum Fachsystem). |
| `/ki-glossar` | 103 Begriffe auf einer einzigen Adresse, kein Begriffs-Schema | Mittel | Nach dem Render-Fix: Einzelseiten je Begriff mit `DefinedTerm`-Auszeichnung. Definitionsseiten sind das Format, das KI-Assistenten am häufigsten zitieren. |
| `/impressum` | Per robots.txt gesperrt, keine H1 im Quellcode | Niedrig | `Disallow`-Zeile streichen, H1 ergänzen. 5 Minuten. |
| Englisches Impressum | Kein Hinweis, dass im Zweifel die deutsche Fassung gilt | Niedrig | Standardsatz ergänzen, Wortlaut vorher juristisch prüfen lassen. |

---

## 5. Keyword-Chancen

> **Ausdrücklicher Vorbehalt:** Es lagen **keine Tool-Daten** vor — keine Suchvolumina, keine Difficulty-Scores, keine Klickdaten. Die Spalten „Schwierigkeit" und „Chance" sind Einschätzungen auf Basis der Frage, wie dicht und wie professionell der jeweilige Suchraum in der Websuche von Anbietern bespielt wird. Vor Budgetentscheidungen bitte mit der Google Search Console gegenprüfen — die zeigt kostenlos die real erzielten Einblendungen der Domain und ist damit die belastbarste verfügbare Quelle.

| Begriff | Schwierigkeit (geschätzt) | Chance | Suchabsicht | Empfohlenes Format |
|---|---|---|---|---|
| dunkelverarbeitung versicherung | niedrig | **sehr hoch** | Information/Kauf | Abschnitt + FAQ auf `/industrien/versicherungen`, Glossareintrag |
| dunkelverarbeitungsquote erhöhen | niedrig | **sehr hoch** | Kauf | FAQ + eigener Ratgeberbeitrag |
| verwendungsnachweisprüfung digital | sehr niedrig | **sehr hoch** | Kauf | Eigener Abschnitt auf `/industrien/foerderungen-…` |
| bafa förderung ki-beratung | hoch | **sehr hoch** | Kauf | **Eigene Landingpage** — höchste Kaufabsicht im ganzen Umfeld |
| fördermittelmanagement software | mittel | hoch | Kauf | Branchenseite schärfen + Vergleichsseite |
| antragsmanagement software fördermittel | niedrig | hoch | Kauf | Abschnitt auf Branchenseite |
| vergabeverfahren software vgv uvgo | niedrig | hoch | Kauf | Bereits gut abgedeckt — ausbauen |
| bewerbungsunterlagen prüfen automatisiert | sehr niedrig | hoch | Kauf | Abschnitt auf `/industrien/bildung` |
| hochschulzulassung automatisieren | niedrig | hoch | Kauf | Titel/H1 der Bildungsseite |
| bewerbermanagement hochschule software | niedrig | hoch | Kauf | Vergleichsseite gegen den Platzhirsch |
| zulassungssoftware hochschule | niedrig | mittel | Kauf | Branchenseite |
| studierendenanfragen chatbot hochschule | niedrig | mittel | Kauf | Abschnitt Service & Fallbearbeitung |
| mieteranfragen automatisieren | niedrig | hoch | Kauf | Titel/Beschreibung `/industrien/immobilien` |
| schadensmeldung hausverwaltung digital | niedrig | hoch | Kauf | Abschnitt auf Immobilienseite |
| ki hausverwaltung | mittel | mittel | Kauf | Branchenseite + Ratgeber |
| hausverwaltung erreichbarkeit telefon ki | niedrig | mittel | Kauf | Abschnitt |
| nebenkostenabrechnung prüfen ki | niedrig | mittel | Information | Ratgeberbeitrag |
| ki potenzialanalyse unternehmen | mittel | hoch | Kauf | `/ki-audit` schärfen |
| ki roi berechnen | niedrig | hoch | Vergleich | `/roi-rechner` — Format passt bereits |
| ki im mittelstand einführen | mittel | mittel | Information | `/methodik` + Ratgeber |
| lohnt sich ki für mein unternehmen | niedrig | mittel | Information | Ratgeber → `/ki-audit` |
| ki automatisierung mittelstand | hoch | mittel | Kauf | Startseite |
| ki beratung mittelstand | **sehr hoch** | niedrig | Kauf | Startseite — teuerster Einstieg, nicht priorisieren |
| externe ki abteilung | niedrig | niedrig | Kauf | Bereits von einem Wettbewerber besetzt (s. Kapitel 7) |
| ki abteilung mieten | sehr niedrig | niedrig | Kauf | Praktisch unbesetzt, aber auch kaum Nachfrage |

**Die Kernbotschaft aus dieser Tabelle:** Die Startseite zielt heute auf den am dichtesten umkämpften Teil des Raums („KI-Beratung Mittelstand"), wo eine junge Marke am wenigsten ausrichten kann. Die realistischen Gewinne liegen in den Fachbegriffen der vier Branchen — dort ist der Wettbewerb dünn und die Kaufabsicht hoch.

---

## 6. Inhaltslücken

**Es gibt keinen Blog, keinen Ratgeber, keine Wissensebene.** Alle 16 deutschen Adressen sind Angebotsseiten. Bestätigt: `src/App.tsx` enthält keine einzige Blog- oder Artikelroute. Wer „wie führe ich KI im Mittelstand ein", „was kostet KI-Automatisierung" oder „Dunkelverarbeitungsquote erhöhen" sucht, findet bei NEWEDGE keinen Einstieg — bei den Wettbewerbern schon.

| Lücke | Warum sie zählt | Format | Aufwand |
|---|---|---|---|
| **Seite zu Sicherheit, Datenschutz und Betrieb** | „DSGVO-konform", „im Haus", „lokal hostbar" sind die meistgenutzten Argumente der Website — aber es gibt keine Seite dazu. Bei Versicherern, Hochschulen und Vergabestellen löst genau dieses Thema die längste Prüfschleife aus. Ohne Kundenfreigabe schreibbar. | Eine Seite | 1–2 Tage |
| **BAFA-Förderfähigkeit** | Höchste Kaufabsicht im ganzen Umfeld. Mindestens acht Wettbewerber betreiben dafür eigene Landingpages, NEWEDGE hat das Angebot, aber kein Asset. | Eine Landingpage | 1 Tag |
| **Abgrenzung zu den Platzhirschen** | Pro Branche gibt es ein etabliertes System (Hochschulen: HISinOne; Förderungen: IBYKUS; Immobilien: etg24; Versicherung: Guidewire). Die Frage im Einkauf lautet „Ersetzt das unser HISinOne?" — keine Seite beantwortet sie. Die Antwort ist ohnehin verkaufsfördernd: NEWEDGE ersetzt nicht, es legt sich darüber. | Abschnitt je Branchenseite + 2 Vergleichsseiten | 2–3 Tage |
| **Preislogik** | Die häufigste Frage vor dem Erstgespräch. Ein Modell zu erklären reicht, eine Preisliste ist nicht nötig. | Eine Seite oder ein Abschnitt | 0,5 Tage |
| **Glossar-Einzelseiten** | 103 Begriffe liegen auf einer Adresse. Ohne eigene Adresse pro Begriff gibt es nichts, was ein KI-Assistent zitieren kann. Fehlende Branchenbegriffe ergänzen: Dunkelverarbeitung, Verwendungsnachweis, Assekuradeur, VgV/UVgO. | 103 Einzelseiten, generiert | 2–3 Tage (nach Render-Fix) |
| **Benannte Referenzen** | Fallbeispiele existieren als Struktur, aber ohne Kundennamen und ohne eigene Adressen in der Sitemap. | Sobald Freigaben vorliegen | abhängig von Freigaben |
| **Ratgeberebene** | 6–10 gezielte Beiträge entlang der Begriffe aus Kapitel 5, keine Content-Marketing-Maschine. | Blog unter `/wissen` | laufend, 1 Beitrag/Woche |

---

## 7. Wettbewerb

**Datenlage: dünn, aber für drei Anbieter belastbar** (per Websuche recherchiert und direkt abgerufen). Alle Zahlen von Wettbewerber-Websites sind deren eigene, unverifizierte Angaben.

**snutig GmbH (Herford)** besetzt die NEWEDGE-Positionierungsphrase **bereits wörtlich**: „externe KI-Abteilung" für den Mittelstand, gleiche Zielgruppe, gleiches Versprechen (Dauerkonstellation statt Projekt). Unterschied: snutig ist breiter und branchenoffen aufgestellt, NEWEDGE produktseitig deutlich schärfer. snutig hat eine Blog-Ebene, über die sie ranken — NEWEDGE nicht.
→ *Schlussfolgerung: Die Phrase „KI-Abteilung" allein trägt nicht mehr als Unterscheidungsmerkmal. Der verteidigbare Unterschied ist die Standardisierung — ein Cortex, vier Blueprints, Konfiguration statt Individualsoftware. Das steht in der `llms.txt` bereits sehr klar und gehört prominenter in Titel und H1.*

**Pexon Consulting GmbH (Grünwald bei München)** ist der schärfste Gegner in der Versicherungsvertikale — geografisch direkter Nachbar, eigene Seite zu „Claims Dunkelverarbeitung", gleiche Vertikalen-Logik. Ihr Vorsprung ist nicht die Substanz, sondern die Konkretheit: Sie nennen Integrationsnamen (SAP FS-CM, Guidewire) und beziffern Ergebnisse. NEWEDGE nennt auf der Versicherungsseite kein einziges Kernsystem.

**aicist** besetzt die Immobilienvertikale mit Mieteranfragen und automatischer Anrufannahme.

**Platzhirsche pro Branche**, gegen die NEWEDGE im Beschaffungsprozess antritt: Bildung → HIS eG/HISinOne, Classter; Förderungen → IBYKUS, PROANDI; Immobilien → etg24, ImmoApp; Versicherung → Insiders Technologies, ExB, Guidewire.

*Nicht belastbar geprüft:* Marktanteile, Traffic-Zahlen und Umsatzgrößen der Wettbewerber. Dafür wären Werkzeuge nötig, die hier nicht angebunden waren.

---

## 8. Maßnahmenplan

### SOFORT — diese Woche, je unter zwei Stunden

| # | Maßnahme | Datei | Zeit |
|---|---|---|---|
| 1 | **`logo.png` nach `public/` legen** (quadratisch, ≥ 512 px). Das JSON-LD verweist auf eine Datei, die es nicht gibt — das entwertet den Organisationseintrag bei Google. | `public/` | 15 Min |
| 2 | **Grammatikfehler auf der englischen Startseite beheben.** `headingLead: "We use AI as"` und `headingWords: ["a friend", "an engine", "a helper", "an advantage"]`. Aktuell steht sichtbar „as a engine". | `en/sections/horizontalScroll.ts:61` | 5 Min |
| 3 | **Die vier Sinnabweichungen korrigieren** (Versicherungs-Bullet, „remain easy to meet" 2×, „administrative load out of", die beiden Kennzahl-Labels). | `en/painPoints.ts`, `en/sections/positionedForImpact.ts` | 45 Min |
| 4 | **„reads out" → „extracts"** an allen fünf Stellen. Betrifft die Kernaussage eines ganzen Blueprints. | `en/painPoints.ts` | 15 Min |
| 5 | **Deutsche mailto-Betreffzeilen** in den englischen Stellenanzeigen übersetzen. | `en/collections/jobs.ts` (4×) | 10 Min |
| 6 | **„Vertraut von führenden Organisationen"** → „Führende Organisationen in Deutschland vertrauen uns." | `painPoints.ts:229, 902` | 5 Min |
| 7 | **Englischen Reststring** in der deutschen Datei beheben. | `sections/newEdgeSystem.ts:59` | 5 Min |
| 8 | **`Disallow: /impressum`** aus der robots.txt streichen, H1 in `Impressum.tsx` ergänzen. | `public/robots.txt`, `src/pages/Impressum.tsx` | 15 Min |
| 9 | **Die 21 + 23 fehlenden Bildreferenzen** in die englischen Inhaltsdateien spiegeln (Bildschlüssel sind sprachneutral, reines Kopieren). | `en/painPoints.ts`, `en/collections/miniCases.ts` | 60 Min |
| 10 | **Titel über 60 und Beschreibungen über 160 Zeichen kürzen** — beim Kürzen gleich eine Handlungsaufforderung einbauen. | `painPoints.ts`, `en/painPoints.ts`, `pages/**` | 90 Min |
| 11 | **„awarding body" → „contracting authority"** auf der englischen Förderungsseite (5 Stellen). Fachlich falscher Begriff im Titel der Seite. | `en/painPoints.ts` | 20 Min |

### STRATEGISCH — dieses Quartal

| Priorität | Maßnahme | Erwartete Wirkung | Aufwand |
|---|---|---|---|
| **1** | **Serverseitiges Rendern einbauen**, sodass der Textkörper aller 32 Seiten mit echtem Markup ausgeliefert wird. Danach nachmessen: jede Route muss deutlich mehr als 0 Zeichen Fließtext haben. | **Höchste.** Löst in einem Zug: fehlende H1, fehlende Überschriftenhierarchie, fehlende Bildbeschreibungen, fehlende interne Verlinkung, Unsichtbarkeit für KI-Assistenten. Ohne diesen Schritt wirkt keine andere Maßnahme. | 3–5 Tage |
| **2** | **Deutsches Modul auf englischen Seiten beheben:** `en/resultJourney.ts` anlegen, per `useLocalized` einbinden. | Behebt einen sichtbaren Qualitätsbruch auf acht englischen Seiten. | 0,5 Tage |
| **3** | **Strukturierte Daten beim Bauen mitschreiben:** FAQ, Dienstleistung, Brotkrumen-Navigation, Website-Schema. | Voraussetzung für erweiterte Suchergebnisse und für Zitierbarkeit durch KI-Assistenten. | 1–2 Tage |
| **4** | **Seite zu Sicherheit, Datenschutz und Betrieb.** | Nimmt die größte Kaufblockade bei allen vier Zielbranchen weg. Ohne Kundenfreigaben umsetzbar. | 1–2 Tage |
| **5** | **BAFA-Landingpage.** Nur selbst verifizierte Zahlen verwenden — die in der Websuche kursierenden Beträge sind Fremdangaben. | Höchste Kaufabsicht im gesamten Suchumfeld. | 1 Tag |
| **6** | **Die drei schwächeren Branchenseiten nach dem Vorbild der Förderungsseite umbauen:** Vorgangsbegriff in den Titel, Fachbegriffe (Dunkelverarbeitung!) in den Text, Kernsystem-Namen nennen, Beschreibungen von Anbieter- auf Kundensicht drehen. | Der realistischste Rankinggewinn — dünner Wettbewerb, hohe Kaufabsicht. | 2–3 Tage |
| **7** | **Abgrenzungsabschnitte gegen die Platzhirsche** je Branche („läuft neben Ihrem HISinOne, ersetzt es nicht"). | Nimmt die häufigste Einwandfrage im Einkauf weg. | 2 Tage |
| **8** | **Englisches Lektorat durch einen Muttersprachler.** Die Sinnfehler sind mit den Sofortmaßnahmen behoben, die rund zwei Dutzend unidiomatischen Stellen und die uneinheitlichen Begriffe brauchen einen Durchgang. | Glaubwürdigkeit gegenüber internationalen Entscheidern. | 2–3 Tage extern |
| **9** | **Glossar-Einzelseiten mit Begriffs-Auszeichnung** (nach Maßnahme 1). Branchenbegriffe ergänzen. | Definitionsseiten sind das Format, das KI-Assistenten am häufigsten zitieren. | 2–3 Tage |
| **10** | **Bild-Pipeline in den Build** (WebP/AVIF, mehrere Zielbreiten). 27 Dateien über 500 KB, größte 2,7 MB. | Ladezeit. **Wirkung nicht beziffert — es wurden keine Ladezeiten gemessen.** | 1–2 Tage |
| **11** | **Eigene Teilen-Vorschaubilder** für die 11 Kernseiten. | Klickrate beim Teilen in LinkedIn und Slack. | 1 Tag Design |
| **12** | **Sitemap automatisch generieren** statt von Hand pflegen (aus derselben Routenliste, die das Prerender-Skript schon hat). | Verhindert künftiges Auseinanderlaufen. Aktuell noch fehlerfrei. | 0,5 Tage |
| **13** | **Ratgeberebene aufbauen,** 6–10 Beiträge entlang der Begriffe aus Kapitel 5. | Die heute komplett fehlende obere Trichterstufe. Wirkung erst nach Monaten. | laufend |
| **14** | **Search Console auswerten**, bevor größere Redaktionsbudgets fließen. | Ersetzt die Schätzungen in Kapitel 5 durch echte Zahlen. Kostenlos. | 2 Std |
