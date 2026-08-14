# NEWEDGE — Copy-Audit (Website-Texte)

_Ziel: Mittelstand-Entscheider ohne KI-Vorwissen abholen — locker & auf Augenhöhe, kein Fachjargon, Nutzen statt Feature. Quelle: automatischer Audit gegen die Brand-Voice-Guidelines._

> **Status:** 7 von 9 Bereichen auditiert. **CTAs (global)** und **Anwendungsfelder** brachen wegen Credit-Limit ab — separat nachziehbar. Quellen im Fließtext sind bereits entfernt (MIT-Studie bleibt).


**113 Befunde gesamt** über 7 Bereiche.


## Homepage (alle Sections)

_Starke Basis: Der Hero sitzt exakt auf der Kernpositionierung ("Wir bauen die KI-Abteilung für den Mittelstand"), fast alle Sections öffnen Why-first, die CTAs sind durchgängig entry-konform (KI-Potenzial berechnen / Kostenlose Analyse / Cortex kennenlernen), und Founder Letter, Der Schnitt und das Case-Zitat sind Statement-Copy auf Guideline-Niveau. Die größten Schwächen: (1) Jargon-Inseln genau an den Nutzen-Stellen — Governance, Roadmaps, Team Enablement, auditierbar, KI-Layer, Sweet Spot, ROI und Infrastruktur stehen teils wörtlich auf der eigenen Blacklist; (2) zwei Positionierungsbrüche, weil SEO-Snippet und Team-Section noch "Agentur"/"Markenaufbau" verkaufen statt der KI-Abteilung; (3) Redundanz: Die Hero-Subline wiederholt sich wörtlich in Section 2, und die Kennzahlen erscheinen doppelt (impactCounter + positionedForImpact-Stats)._


**🔴 HOCH · pages/home.ts - seo.title + seo.description**
- **Ist:** KI-Agentur München | Prozessautomatisierung & Markenaufbau für KMU | NEWEDGE — "Wir verbinden Prozessautomatisierung, KI-Systeme und Markenaufbau — für den Mittelstand, der konsequent wachsen will."
- **Problem:** Der Google-Ersteindruck verkauft die alte Generalisten-Positionierung ("Agentur", "Markenaufbau") — genau das, was die Guidelines als Zerstörer der Preissetzungsmacht nennen.
- **Neu:** Title: "Die KI-Abteilung für den Mittelstand | NEWEDGE München" — Description: "NEWEDGE baut Ihre eigene KI-Abteilung auf: von der kostenlosen Analyse über Cortex bis zu laufenden Automatisierungen. DSGVO-konform, oft förderfähig."

**🔴 HOCH · sections/statementStats.ts - paragraph**
- **Ist:** KI ist überall — im Mittelstand bleibt sie zu oft Insellösung oder Risiko. Wir bauen Ihre eigene KI-Fähigkeit auf: von der Analyse, die zeigt, wo KI sich lohnt, bis zum laufenden Betrieb.
- **Problem:** Wort-für-wort identisch mit der Hero-Subline eine Scroll-Länge darüber — die wichtigste Seite wiederholt ihren Lead-Absatz, statt die Geschichte weiterzuerzählen.
- **Neu:** Hinter NEWEDGE stehen Sebastian & Wenjamin — und ein Team, das nicht Projekte abliefert, sondern Ihre eigene KI-Fähigkeit aufbaut. Schritt für Schritt, bis KI bei Ihnen keine Insellösung mehr ist, sondern eine Abteilung.

**🔴 HOCH · sections/diamondModel.ts - scenes[1].eyebrow + scenes[1].text**
- **Ist:** 02 / KI-LAYER — "Die KI wird aktiv: Operative Aufgaben steigen aus dem KI-Layer auf und füllen die neue Basis Schritt für Schritt."
- **Problem:** "Layer" steht wörtlich auf der Jargon-Blacklist (hier 2x), und der Satz beschreibt die Grafik statt den Nutzen ("Die KI wird aktiv" = Feature-Sicht).
- **Neu:** 02 / KI-EBENE — "KI übernimmt die Routinearbeit: Was bisher Zeit gefressen hat, läuft automatisch — Ihr Team rückt eine Ebene höher."

**🔴 HOCH · sections/embeddedAI.ts - uebernahme[]**
- **Ist:** Priorisierung / Governance / Roadmaps / Team Enablement / Identifikation neuer Potenziale / Kontinuierliche Optimierung
- **Problem:** Drei der sechs Punkte (Governance, Roadmaps, Team Enablement) stehen wörtlich auf der Jargon-Blacklist — ausgerechnet die Liste, die den Nutzen zeigen soll, ist die unverständlichste Stelle der Seite.
- **Neu:** Prioritäten setzen / Klare Regeln & Sicherheit / Fahrplan für die nächsten Schritte / Ihr Team KI-fit machen / Neue Potenziale erkennen / Laufende Verbesserung

**🔴 HOCH · sections/cortex.ts - subtitle**
- **Ist:** Ab Station 02 entsteht der Ort, an dem Ihre KI gesteuert wird — bevor sie skaliert.
- **Problem:** "Station 02" verweist auf das Stationen-Modell, das auf der Homepage nirgends eingeführt wird — der Leser weiß nicht, wovon die Rede ist; "skaliert" ist Fachsprech.
- **Neu:** Der Ort, an dem Ihre KI gesteuert wird — bevor sie im ganzen Unternehmen wächst.

**🔴 HOCH · sections/cortexFeatures.ts - cortexFeatureDescs[1]**
- **Ist:** Ihre Daten bleiben unter Kontrolle — intern, sicher, auditierbar.
- **Problem:** "auditierbar" steht wörtlich auf der Jargon-Blacklist des Briefs.
- **Neu:** Ihre Daten bleiben unter Kontrolle — intern, sicher, jederzeit nachvollziehbar.

**🔴 HOCH · sections/teamSupport.ts - headingHighlight + features[1].title**
- **Ist:** Eine ganze Agentur dahinter. / Volle Agentur-Manpower
- **Problem:** Positionierungsbruch: NEWEDGE ist laut Guidelines die KI-Abteilung und ausdrücklich keine Agentur — dazu der Anglizismus "Manpower".
- **Neu:** Ein ganzes Team dahinter. / Volle Team-Stärke

**🟡 MITTEL · sections/impactCounter.ts - metrics[0].label (identisch: positionedForImpact.ts - stats[0].label)**
- **Ist:** Mitarbeitende im Sweet Spot
- **Problem:** "Sweet Spot" ist Agentur-Englisch — sagt einem Geschäftsführer ohne Marketing-Hintergrund nichts, und die Kennzahl soll ihm eigentlich sagen: Sie sind hier richtig.
- **Neu:** Mitarbeitende — Unternehmen wie Ihres

**🟡 MITTEL · sections/impactCounter.ts - metrics[2].label (identisch: positionedForImpact.ts - stats[2].label)**
- **Ist:** ROI auf Systemarbeit
- **Problem:** "ROI" und "Systemarbeit" sind zwei unerklärte Fachbegriffe in drei Wörtern — die stärkste Zahl der Seite (4x) bleibt so ohne Bedeutung.
- **Neu:** zahlt sich Ihre Investition aus (ergibt: "4x — zahlt sich Ihre Investition aus")

**🟡 MITTEL · sections/diamondModel.ts - scenes[0].text**
- **Ist:** Viele operative Aufgaben tragen immer weniger strategische Entscheidungen.
- **Problem:** Beim ersten Lesen kaum zu parsen ("Aufgaben tragen Entscheidungen"?) — die Pyramiden-Metapher steckt nur im Bild, nicht im Satz.
- **Neu:** Unten viel Routinearbeit, oben wenige strategische Entscheidungen — so sieht die klassische Organisation heute aus.

**🟡 MITTEL · sections/diamondModel.ts - scenes[2].text**
- **Ist:** In Ihrem Unternehmen entsteht der Diamant. NEWEDGE füllt die frei werdenden Flächen und hält die Pyramide tragfähig.
- **Problem:** Metaphern-Bruch: Satz 1 sagt Diamant, Satz 2 stützt wieder die Pyramide — beim ersten Lesen unklar, welche Form jetzt gilt.
- **Neu:** Ihr Unternehmen wird zum Diamanten: mehr Wirkung pro Kopf. NEWEDGE trägt die neue Basis, damit die Form stabil bleibt.

**🟡 MITTEL · sections/tickerScroll.ts - hashtags**
- **Ist:** #boldimOutput · #realimImpact · #NEWEDGE · #KIStrategie · #Mittelstand · #Cortex · #Automatisierung · #firmeneigen ·
- **Problem:** "#boldimOutput" und "#realimImpact" sind Agentur-Denglisch ohne Bedeutung für einen Geschäftsführer — Buzzword-Bingo laut Guidelines.
- **Neu:** #KIAbteilung · #Mittelstand · #NEWEDGE · #Datenhoheit · #Cortex · #Automatisierung · #förderfähig · #firmeneigen ·

**🟡 MITTEL · sections/embeddedAI.ts - paragraphs[0]**
- **Ist:** Die meisten Unternehmen brauchen keinen Chief AI Officer in Vollzeit. Sie brauchen jemanden, der Verantwortung übernimmt.
- **Problem:** "Chief AI Officer" stapelt weiteren Englisch-Titel auf die ohnehin englische Headline — der Kern (Verantwortung) funktioniert auch ohne.
- **Neu:** Die meisten Unternehmen brauchen keinen KI-Chef in Vollzeit. Sie brauchen jemanden, der Verantwortung übernimmt.

**🟡 MITTEL · sections/cortex.ts - results.items[1]**
- **Ist:** DSGVO-konforme Infrastruktur
- **Problem:** "Infrastruktur" steht auf der Jargon-Liste; als Nutzenpunkt bleibt es abstrakt.
- **Neu:** DSGVO-konform — Daten bleiben bei Ihnen

**🟡 MITTEL · sections/cortex.ts - body**
- **Ist:** Cortex ist der zentrale Einstiegspunkt für KI im Unternehmen: Mitarbeiter erhalten produktive KI. Sie behalten die Kontrolle über Nutzung, Prozesse und Automatisierungen.
- **Problem:** "Mitarbeiter erhalten produktive KI" ist schief formuliert, und das folgende "Sie" ist doppeldeutig (die Mitarbeiter oder der Leser?).
- **Neu:** Cortex ist der zentrale Einstiegspunkt für KI im Unternehmen: Ihre Mitarbeiter arbeiten produktiv mit KI — und Sie behalten die Kontrolle über Nutzung, Prozesse und Automatisierungen.

**🟡 MITTEL · sections/cortex.ts - diagram.spokes (AGENTEN, GOVERNANCE)**
- **Ist:** MENSCHEN / DATEN / PROZESSE / AGENTEN / GOVERNANCE
- **Problem:** "Governance" steht auf der Jargon-Blacklist, und "Agenten" kennt ein Geschäftsführer ohne KI-Vorwissen nicht — beides sichtbare Diagramm-Labels.
- **Neu:** MENSCHEN / DATEN / PROZESSE / KI-ASSISTENTEN / KONTROLLE

**🟡 MITTEL · sections/cortexFeatures.ts - cortexFeatureDescs[3]**
- **Ist:** Prozesse, Agenten und Automatisierungen laufen auf einer gemeinsamen Ebene.
- **Problem:** Feature-Sprache ohne Kundennutzen; "Agenten" und "gemeinsame Ebene" sagen einem Nicht-Fachpublikum nichts.
- **Neu:** Alles läuft an einem Ort zusammen — das Fundament für jede weitere Automatisierung.

**🟡 MITTEL · sections/caseSpotlight.ts - headlineSuffix**
- **Ist:** von 400 Excel-Bewerbungen zur automatisierten Jury-Pipeline kam
- **Problem:** "Pipeline" ist Tech-Jargon — der eigentliche Nutzen (die Bewertung läuft automatisch) verschwindet dahinter.
- **Neu:** von 400 Excel-Bewerbungen zur automatischen Jury-Auswertung kam

**🟡 MITTEL · sections/positionedForImpact.ts - eyebrow**
- **Ist:** Positioned for Impact, Wie wir arbeiten
- **Problem:** Englischer Claim ohne Bedeutung für die Zielgruppe, dazu die sperrige Komma-Doppelung — der deutsche Teil trägt allein besser.
- **Neu:** Wie wir arbeiten

**🟡 MITTEL · sections/positionedForImpact.ts - body**
- **Ist:** Erst wenn Prozesse, Infrastruktur und KI zusammenspielen, entsteht ein Vorsprung, der bleibt.
- **Problem:** "Infrastruktur" steht auf der Jargon-Liste des Briefs.
- **Neu:** Erst wenn Prozesse, Technik und KI zusammenspielen, entsteht ein Vorsprung, der bleibt.

**🟡 MITTEL · sections/derSchnitt.ts - after.rows[5]**
- **Ist:** Skalierbare Infrastruktur
- **Problem:** Doppel-Jargon ("skalierbar" + Blacklist-Wort "Infrastruktur") in einer Liste, die den Nutzen zeigen soll.
- **Neu:** Technik, die mitwächst

**🟡 MITTEL · sections/threeStepsCTA.ts - steps[1].desc**
- **Ist:** In wenigen Werktagen zeigen wir Ihnen die drei Prozesse mit dem höchsten KI-ROI — inklusive Aufwand-Nutzen-Schätzung und Förderhinweis. Oft förderfähig.
- **Problem:** "KI-ROI" bleibt unerklärt (ROI steht auf der Jargon-Liste), und "Förderhinweis" doppelt sich mit "Oft förderfähig".
- **Neu:** In wenigen Werktagen zeigen wir Ihnen die drei Prozesse, in denen KI Ihnen am meisten bringt — inklusive Aufwand-Nutzen-Schätzung. Oft staatlich förderfähig.

**⚪ NIEDRIG · sections/diamondModel.ts - humanLabel, captionShapes, liveTag**
- **Ist:** HUMAN EXPERTISE / PYRAMID / DIAMOND / LIVE MODEL
- **Problem:** Englische Grafik-Labels in einem sonst deutschen Modul — unnötige Hürde für die Nicht-Fach-Zielgruppe.
- **Neu:** MENSCHLICHE EXPERTISE / PYRAMIDE / DIAMANT / LIVE-MODELL

**⚪ NIEDRIG · sections/embeddedAI.ts - eyebrow**
- **Ist:** Embedded AI
- **Problem:** Englischer Phasen-Name ohne Erklärung als Section-Einstieg — die Zielgruppe kann den Begriff nicht einordnen.
- **Neu:** Embedded AI — KI, fest verankert

**⚪ NIEDRIG · sections/cortex.ts - today.items[2]**
- **Ist:** Schatten-IT
- **Problem:** IT-Jargon, der erst drei Absätze später (cortexFeatureDescs) erklärt wird — als alleinstehender Listenpunkt unklar.
- **Neu:** Wildwuchs an Tools (Schatten-IT)

**⚪ NIEDRIG · sections/aiVoices.ts - kicker**
- **Ist:** Glauben Sie nicht dem Hype?
- **Problem:** Die Logik knirscht: Gemeint ist "glauben Sie uns nicht einfach — fragen Sie die KI", nicht Skepsis gegenüber dem KI-Hype; beim ersten Lesen verwirrend.
- **Neu:** Glauben Sie uns kein Wort?

**⚪ NIEDRIG · pages/home.ts - toast.validationTitle + toast.validationFallback**
- **Ist:** Validierungsfehler
- **Problem:** Entwickler-Jargon als sichtbare Fehlermeldung im Kontaktformular.
- **Neu:** Bitte prüfen Sie Ihre Angaben

## Über uns

_Die Seite hat ein starkes Fundament: Der Hero sitzt perfekt (Why-first, Kernpositionierung wörtlich, Nutzen-Schluss „Ergebnis, kein Projekt"), die Werkbank-Idee („Keine Blackbox") verkauft Transparenz als Vertrauensnutzen, und die CTA-Sektion mit direkter Telefonnummer ist angenehm menschlich und auf Augenhöhe. Die größte Schwäche: Sobald es konkret wird, kippt die Seite in Tech- und Berater-Jargon, den ein Geschäftsführer ohne KI-Vorwissen nicht versteht — vor allem die Team-Facts (LLM-Deployment, RAG-Systeme, Cross-funktional) und das Werkbank-Manifest (Use Case, on-premise, Agenten-Framework, API). Dort wird außerdem Feature- statt Nutzen-Sprache gesprochen. Kleinere Ausreißer im Formular (Amtston, Entwickler-Deutsch) runden das Bild ab._


**🔴 HOCH · src/content/pages/about.ts - team[1].facts (Ivan Jovanovic, CTO)**
- **Ist:** "KI-Architektur & ML-Engineering" / "LLM-Deployment & RAG-Systeme" / "Full-Stack & Cloud-Infrastruktur"
- **Problem:** Reines Tech-Jargon-Trio (ML, LLM, RAG, Full-Stack) — für die Zielgruppe komplett unverständlich und Feature- statt Nutzen-Sprache.
- **Neu:** "Baut die KI-Systeme hinter unseren Kundenprojekten" / "Verbindet KI sicher mit Ihrem Firmenwissen" / "Zuhause in Cloud und eigener Server-Welt"

**🔴 HOCH · src/content/pages/about.ts - werkbank.manifest[0] (MODELLE)**
- **Ist:** Claude, GPT und Open-Source-Modelle. Je Use Case das passende, nie aus Prinzip nur eines.
- **Problem:** "Use Case" steht auf der expliziten Jargon-Verbotsliste des Briefs — ein Nicht-Fachpublikum kennt den Begriff nicht.
- **Neu:** Claude, GPT und Open-Source-Modelle. Je Aufgabe das passende, nie aus Prinzip nur eines.

**🔴 HOCH · src/content/pages/about.ts - werkbank.manifest[2] (EIGENBAU)**
- **Ist:** Agenten-Framework und KI-Output-Cockpit. Entwickelt für den Mittelstand, im Einsatz bei Kunden.
- **Problem:** "Agenten-Framework" und "KI-Output-Cockpit" sind Entwickler-Vokabular ohne erkennbaren Nutzen für den Leser.
- **Neu:** Unser eigener Baukasten für KI-Assistenten plus ein Cockpit, das jedes Ergebnis sichtbar macht. Entwickelt für den Mittelstand, im Einsatz bei Kunden.

**🔴 HOCH · src/content/pages/about.ts - werkbank.manifest[1] (INFRASTRUKTUR)**
- **Ist:** EU-Rechenzentren, private Cloud oder on-premise. Sie entscheiden, wo Ihre Daten liegen.
- **Problem:** "on-premise" ist IT-Jargon, den ein Geschäftsführer ohne KI-Vorwissen nicht kennt (der zweite Satz mit dem Datenhoheits-Nutzen ist dagegen stark).
- **Neu:** EU-Rechenzentren, private Cloud oder Ihre eigenen Server im Haus. Sie entscheiden, wo Ihre Daten liegen.

**🟡 MITTEL · src/content/pages/about.ts - werkbank.manifest[3] (INTEGRATIONEN)**
- **Ist:** DATEV, SAP, HubSpot, Shopify, ATLAS und alles mit einer API.
- **Problem:** "API" ist Tech-Jargon; das deutsche "Schnittstelle" versteht die Zielgruppe sofort.
- **Neu:** DATEV, SAP, HubSpot, Shopify, ATLAS — und alles, was eine Schnittstelle hat.

**🟡 MITTEL · src/content/pages/about.ts - team[2].facts (Wenjamin Zabezhanskiy, COO)**
- **Ist:** "Operative Systemintegration & Workflows" / "Cross-funktionale Projektsteuerung"
- **Problem:** "Workflows" steht auf der Jargon-Liste, "Cross-funktional" ist Beraterdeutsch — beides steif und für die Zielgruppe leer.
- **Neu:** "Bringt neue Systeme in bestehende Abläufe" / "Steuert Projekte über alle Abteilungen hinweg"

**🟡 MITTEL · src/content/pages/about.ts - contact.toast.validationTitle**
- **Ist:** Validierungsfehler
- **Problem:** Entwickler-Deutsch in Nutzer-Microcopy — klingt technisch und kalt statt hilfreich.
- **Neu:** Bitte Angaben prüfen

**⚪ NIEDRIG · src/content/pages/about.ts - team[0].facts (Sebastian Pachon, CEO)**
- **Ist:** "Strategie, Marke & Systemarchitektur" / "KI-Implementierungen im DACH-Raum & USA"
- **Problem:** "Systemarchitektur" und "Implementierungen" sind abstrakt-technisch; einfachere Worte tragen dieselbe Aussage.
- **Neu:** "Strategie, Marke & KI-Systeme" / "KI-Projekte umgesetzt im DACH-Raum & in den USA"

**⚪ NIEDRIG · src/content/pages/about.ts - werkbank.manifest[4] (ARBEITSWEISE)**
- **Ist:** Analyse, Pilot mit echten Daten, Go-live, Übergabe. Typisch 4 bis 6 Wochen.
- **Problem:** "Go-live" ist ein Tech-Anglizismus; ein schlichtes deutsches Wort ist beim ersten Lesen klarer.
- **Neu:** Analyse, Pilot mit echten Daten, Start im Betrieb, Übergabe. Typisch 4 bis 6 Wochen.

**⚪ NIEDRIG · src/content/pages/about.ts - contact.description**
- **Ist:** Erzählen Sie uns von Ihrem Projekt — wir melden uns zeitnah.
- **Problem:** "zeitnah" ist Amtsdeutsch und bricht mit dem lockeren, frischen Ton der Marke.
- **Neu:** Erzählen Sie uns von Ihrem Projekt — wir melden uns schnell zurück.

## Methodik

_Starke Seite: Das Manifest öffnet vorbildlich mit Why, die Analyse-Stufe ist konsequent aus Kundensicht geschrieben („Bevor ein Euro fließt"), die Frage „Wo lohnt sich KI wirklich?" und das Outro der Skalierungs-Stufe („Schlagkraft eines ganzen Teams zum Preis einer Stelle") sitzen exakt auf der Positionierung. Größte Schwäche: In den Listen (Leistungen + Ergebnisse) häuft sich genau der Jargon, den der Brief verbietet — Roadmap, ROI-Prognosen, Business Cases, Governance, Team-Enablement, Infrastruktur, Agenten — dort kippt die Seite vom Entscheider-Deutsch ins Beraterdeck. Zweites Problem: Der Hero-CTA „Erstgespräch buchen" ignoriert die Entry-CTA-Logik. Fließtexte sind fast durchgehend gut und sollten nicht angefasst werden._


**🔴 HOCH · src/content/pages/methodik.ts - stufen[2] (Skalierung) - list (Zeile 106)**
- **Ist:** "Strategische Priorisierung", "Laufende Systempflege", "Potenzialerkennung & Weiterentwicklung", "Governance & Datenhoheit", "Team-Enablement", "Infrastruktur-Weiterentwicklung"
- **Problem:** Drei im Brief explizit verbotene Jargon-Begriffe in einer Liste (Governance, Enablement, Infrastruktur) — ein GF ohne KI-Vorwissen versteht die Hälfte der Punkte nicht.
- **Neu:** "Strategische Priorisierung", "Laufende Systempflege", "Potenzialerkennung & Weiterentwicklung", "Klare Regeln & Datenhoheit", "Schulung & Befähigung Ihres Teams", "Ausbau der technischen Basis"

**🔴 HOCH · src/content/pages/methodik.ts - stufen[0] (Analyse) - ergebnis (Zeile 83)**
- **Ist:** "Potenzialanalyse & ROI-Prognosen", "Priorisierte Handlungsfelder", "Business Cases", "Transformations-Roadmap"
- **Problem:** Jargon-Cluster im wichtigsten Block der Einstiegs-Stufe: ROI-Prognosen, Business Cases und Transformations-Roadmap sind Berater-Vokabeln, die der Brief explizit nennt.
- **Neu:** "Potenzialanalyse: was sich rechnet", "Priorisierte Handlungsfelder", "Kosten-Nutzen-Rechnung pro Vorhaben", "Klarer Fahrplan für die Umsetzung"

**🔴 HOCH · src/content/pages/methodik.ts - hero - ctaLabel (Zeile 50)**
- **Ist:** Erstgespräch buchen
- **Problem:** CTA ist nicht entry-konform: Der Primär-CTA muss laut Brief den Einstieg spiegeln (Kostenlose KI-Analyse / ROI berechnen / Cortex kennenlernen), "Erstgespräch buchen" ist generisch und ohne Nutzenversprechen.
- **Neu:** Kostenlose KI-Analyse anfragen

**🔴 HOCH · src/content/pages/methodik.ts - stufen[1] (Umsetzung) - intro[0] (Zeile 90)**
- **Ist:** Jetzt entsteht das Fundament: Cortex — der eine Ort, an dem Mitarbeiter, Daten, Prozesse und Agenten zusammenlaufen. Kontrolliert, sicher, transparent.
- **Problem:** "Agenten" ist unverständlicher KI-Jargon — ein GF ohne Vorwissen denkt an Handelsvertreter, nicht an KI-Software.
- **Neu:** Jetzt entsteht das Fundament: Cortex — der eine Ort, an dem Mitarbeiter, Daten, Prozesse und KI-Assistenten zusammenlaufen. Kontrolliert, sicher, transparent.

**🔴 HOCH · src/content/pages/methodik.ts - stufen[0] (Analyse) - intro[1] (Zeile 79)**
- **Ist:** Dafür schauen wir auf Ihr Tagesgeschäft, machen ungenutzte Potenziale sichtbar und übersetzen jeden Hebel in eine priorisierte Roadmap.
- **Problem:** "Priorisierte Roadmap" ist im Brief explizit genannter Jargon — Alltagssprache sagt es klarer.
- **Neu:** Dafür schauen wir auf Ihr Tagesgeschäft, machen ungenutzte Potenziale sichtbar und übersetzen jeden Hebel in einen klaren Fahrplan — was zuerst, was danach.

**🔴 HOCH · src/content/pages/methodik.ts - stufen[1] (Umsetzung) - list (Zeile 94)**
- **Ist:** "Cortex als Infrastruktur", "Kundenportale & Plattformen", "Web-Applikationen", "Dokumentenverarbeitung", "Kundenservice", "Reporting & Backoffice"
- **Problem:** "Infrastruktur" ist im Brief explizit als Jargon gelistet, "Web-Applikationen" und "Reporting & Backoffice" sind unnötige Anglizismen bzw. Tech-Sprache.
- **Neu:** "Cortex als Fundament", "Kundenportale & Plattformen", "Web-Anwendungen", "Dokumentenverarbeitung", "Kundenservice", "Auswertungen & Verwaltung"

**🟡 MITTEL · src/content/pages/methodik.ts - stufen[2] (Skalierung) - frage (Zeile 100)**
- **Ist:** Kein Recruiting. Kein Onboarding. Kein Risiko.
- **Problem:** Zwei HR-Anglizismen in der prominentesten Zeile der Stufe; die eigene Ergebnis-Liste übersetzt "Onboarding" bereits selbst mit "Einarbeitung".
- **Neu:** Kein Einstellen. Kein Einarbeiten. Kein Risiko.

**🟡 MITTEL · src/content/pages/methodik.ts - stufen[2] (Skalierung) - intro[1] (Zeile 103)**
- **Ist:** Mit Embedded AI übernehmen wir die kontinuierliche Weiterentwicklung.
- **Problem:** "Embedded AI" fällt als unerklärter englischer Produktname vom Himmel — der Leser weiß nicht, was er da bekommt.
- **Neu:** Mit Embedded AI — unserer laufenden Betreuung — entwickeln wir Ihre KI-Abteilung kontinuierlich weiter.

**🟡 MITTEL · src/content/pages/methodik.ts - stufen[1] (Umsetzung) - ergebnis (Zeile 95)**
- **Ist:** "Skalierbare digitale Produkte", "Reduzierter manueller Aufwand", "Mehr operative Kapazität"
- **Problem:** Steifer Nominalstil statt spürbarem Kundennutzen — "operative Kapazität" klingt nach Beraterdeck, nicht nach Augenhöhe.
- **Neu:** "Digitale Produkte, die mitwachsen", "Weniger Handarbeit im Alltag", "Mehr Luft im Tagesgeschäft"

**🟡 MITTEL · src/content/pages/methodik.ts - stufen[2] (Skalierung) - ergebnis (Zeile 108)**
- **Ist:** "Kein Recruiting, keine Einarbeitung", "Kontinuierliche Transformation"
- **Problem:** "Recruiting" ist ein vermeidbarer Anglizismus, "Kontinuierliche Transformation" ist eine Buzzword-Floskel ohne greifbaren Nutzen.
- **Neu:** "Keine Neueinstellungen, keine Einarbeitung", "Laufende Weiterentwicklung"

**🟡 MITTEL · src/content/pages/methodik.ts - toast - validationTitle + errorFallback (Zeilen 157, 161)**
- **Ist:** "Validierungsfehler" / "Bitte erneut versuchen."
- **Problem:** "Validierungsfehler" ist Entwickler-Deutsch in Nutzer-Microcopy, die Fehlermeldung ist unnötig knapp und kalt.
- **Neu:** "Bitte prüfen Sie Ihre Angaben" / "Das hat nicht geklappt — bitte versuchen Sie es noch einmal."

## Cortex-Produktseite (src/content/pages/cortex.ts)

_Starke Seite im Kern: Der Hero öffnet mit der Situation des Kunden statt mit Technik, die Problem-Section ist konkret und auf Augenhöhe, „So kommt Cortex ins Haus", „Prüfen, ob's passt" und „Ein Gespräch, keine Verkaufsshow" treffen den Ton perfekt, und die ehrliche Für-wen-nicht-Section schafft Vertrauen. Größte Schwäche ist ein systematisches Jargon-Problem: „auditierbar" steht siebenmal auf der Seite — ein Prüfer-/Compliance-Begriff, den ein Geschäftsführer ohne IT-Vorwissen nicht sicher versteht, und die Wiederholung macht das zentrale Sicherheitsversprechen monoton; dazu kommen unerklärte Begriffe wie „Infrastruktur", „Agenten" und „Modelle". Zwei strukturelle Punkte: Der Hero-Primär-CTA „Cortex-Demo buchen" weicht vom festgelegten Entry-CTA „Cortex kennenlernen" ab, und die Kern-Metapher widerspricht sich (Cortex ist dreimal „die Ebene darüber", einmal „die Ebene darunter")._


**🔴 HOCH · pages/cortex.ts - hero.sub**
- **Ist:** Cortex ist das Betriebssystem Ihrer KI-Abteilung: ein Einstiegspunkt für Ihre Leute, volle Kontrolle über Nutzung, Daten und Automatisierungen. DSGVO-konform, im Haus, auditierbar.
- **Problem:** „auditierbar" ist Prüfer-Jargon (steht sogar als Beispiel im Brief) und direkt im ersten sichtbaren Text der Seite — ein Geschäftsführer ohne Compliance-Hintergrund weiß nicht, was das für ihn bedeutet.
- **Neu:** Cortex ist das Betriebssystem Ihrer KI-Abteilung: ein Einstiegspunkt für Ihre Leute, volle Kontrolle über Nutzung, Daten und Automatisierungen. DSGVO-konform, im Haus, jederzeit nachvollziehbar.

**🔴 HOCH · pages/cortex.ts - solution.bullets[1]**
- **Ist:** DSGVO-konforme Infrastruktur — Ihre Daten bleiben intern, sicher, auditierbar.
- **Problem:** Doppel-Jargon in einem Kern-Verkaufsargument: „Infrastruktur" und „auditierbar" stehen beide auf der Jargon-Liste des Briefs — der Nutzen (Daten bleiben bei Ihnen, Sie können es belegen) geht hinter Technik-Vokabular verloren.
- **Neu:** DSGVO-konform betrieben — Ihre Daten bleiben im Haus, sicher und jederzeit nachvollziehbar.

**🔴 HOCH · pages/cortex.ts - solution.bullets[3]**
- **Ist:** Fundament für Automatisierungen — Prozesse und Agenten laufen auf einer gemeinsamen Ebene.
- **Problem:** „Agenten" ist unerklärter KI-Jargon (ein GF denkt eher an Versicherungsvertreter), und „laufen auf einer gemeinsamen Ebene" ist Feature-Sprache ohne erkennbaren Kundennutzen.
- **Neu:** Fundament für Automatisierungen — jede neue Automatisierung baut auf derselben Basis auf, statt als Insellösung zu starten.

**🔴 HOCH · pages/cortex.ts - ablauf.steps[3].desc (Automatisierung)**
- **Ist:** Auf der gemeinsamen Ebene bauen Sie Prozesse und Agenten aus — Schritt für Schritt.
- **Problem:** „Agenten" erneut unerklärt, und der Satz öffnet mit der Technik („Auf der gemeinsamen Ebene") statt mit dem Nutzen für den Kunden.
- **Neu:** Schritt für Schritt bauen Sie Automatisierungen aus, die Ihnen echte Arbeit abnehmen — alles auf derselben Basis.

**🔴 HOCH · pages/cortex.ts - faq.items[0].a (Ersetzt Cortex ChatGPT oder Copilot?)**
- **Ist:** Nein. Cortex ist die Ebene darüber: Es bündelt und steuert den Zugang zu KI — welche Modelle Sie nutzen, bleibt flexibel.
- **Problem:** „Modelle" ist KI-Insider-Jargon — ein Geschäftsführer ohne KI-Vorwissen versteht darunter kein Sprachmodell; die Frage nennt ChatGPT/Copilot bereits, daran sollte die Antwort anknüpfen.
- **Neu:** Nein. Cortex ist die Ebene darüber: Es bündelt und steuert den Zugang zu KI — welche KI-Dienste Sie nutzen, etwa ChatGPT oder Copilot, bleibt flexibel.

**🟡 MITTEL · pages/cortex.ts - hero.ctaPrimary**
- **Ist:** Cortex-Demo buchen
- **Problem:** Weicht von der CTA-Logik ab: Der festgelegte Track-B-Entry-CTA ist „Cortex kennenlernen" — „Demo buchen" ist höherschwelliger (klingt nach Termin- und Sales-Commitment) und bricht die Konsistenz zum Schluss-CTA, der bereits „Cortex kennenlernen." heißt.
- **Neu:** Cortex kennenlernen

**🟡 MITTEL · pages/cortex.ts - seo.description**
- **Ist:** Cortex ist die zentrale Ebene für KI im Mittelstand: ein Einstiegspunkt für Ihre Leute, volle Kontrolle über Nutzung, Daten und Automatisierungen — DSGVO-konform und auditierbar.
- **Problem:** „auditierbar" im Google-Snippet — dem allerersten Kontakt mit der Seite; zudem ist „die zentrale Ebene" abstrakter als der bewährte Begriff „Einstiegspunkt".
- **Neu:** Cortex ist der zentrale Einstiegspunkt für KI im Mittelstand: ein Zugang für Ihre Leute, volle Kontrolle über Nutzung, Daten und Automatisierungen — DSGVO-konform und jederzeit nachvollziehbar.

**🟡 MITTEL · pages/cortex.ts - warum.points[1]**
- **Ist:** Ihre Daten bleiben Ihre Daten. Keine Blackbox, keine ungewollten Abflüsse — alles auditierbar.
- **Problem:** „auditierbar" (Jargon) und das verkürzte „ungewollte Abflüsse" klingt schief — gemeint ist Datenabfluss, verständlicher ist der ausgesprochene Nutzen.
- **Neu:** Ihre Daten bleiben Ihre Daten. Keine Blackbox, kein ungewollter Datenabfluss — Sie können jederzeit nachvollziehen, was passiert.

**🟡 MITTEL · pages/cortex.ts - garantie.text**
- **Ist:** Ihre Daten bleiben im Haus — DSGVO-konform und jederzeit auditierbar.
- **Problem:** „auditierbar" ausgerechnet im Garantie-Versprechen — der Satz soll maximale Sicherheit vermitteln, verlangt dem Leser aber einen Fachbegriff ab.
- **Neu:** Ihre Daten bleiben im Haus — DSGVO-konform und jederzeit nachvollziehbar.

**🟡 MITTEL · pages/cortex.ts - fit.passt[1]**
- **Ist:** Sie wollen KI im Haus behalten: DSGVO-konform, kontrolliert, auditierbar.
- **Problem:** „auditierbar" zum wiederholten Mal — spätestens hier kippt die Wiederholung in Buzzword-Monotonie, und der Begriff bleibt für Nicht-IT-Leser unklar.
- **Neu:** Sie wollen KI im Haus behalten: DSGVO-konform, kontrolliert, jederzeit nachvollziehbar.

**🟡 MITTEL · pages/cortex.ts - fit.passtNicht[0]**
- **Ist:** Sie suchen ein einzelnes Feature-Tool zum Ausprobieren — Cortex ist die Ebene darunter.
- **Problem:** „Feature-Tool" ist Tech-Anglizismus, und „die Ebene darunter" widerspricht direkt der Kern-Metapher der Seite — an drei anderen Stellen (Warum, FAQ) heißt es „die Ebene darüber": Der Leser weiß nicht mehr, was Cortex nun ist.
- **Neu:** Sie suchen ein einzelnes Tool zum Ausprobieren — Cortex ist die Steuerungsebene über Ihren Tools.

**🟡 MITTEL · pages/cortex.ts - faq.items[1].a (Bleiben unsere Daten wirklich im Haus?)**
- **Ist:** Ja. Cortex läuft auf DSGVO-konformer, kontrollierter Infrastruktur — Ihre Daten sind intern, sicher und auditierbar.
- **Problem:** „Infrastruktur" und „auditierbar" in genau der FAQ-Antwort, die die größte Sicherheitssorge der Zielgruppe ausräumen soll — hier muss jedes Wort beim ersten Lesen sitzen.
- **Neu:** Ja. Cortex läuft auf DSGVO-konformen, von uns kontrollierten Systemen — Ihre Daten bleiben im Haus, sicher und jederzeit nachvollziehbar.

**⚪ NIEDRIG · pages/cortex.ts - ablauf.steps[0].desc (Setup)**
- **Ist:** Cortex wird in Ihrer Umgebung aufgesetzt — DSGVO-konform, mit Ihren Rollen und Rechten.
- **Problem:** „in Ihrer Umgebung aufgesetzt" und „Rollen und Rechte" sind IT-Sprache, dazu Passiv statt direkter Verben — wer macht hier eigentlich was?
- **Neu:** Wir richten Cortex bei Ihnen ein — DSGVO-konform und mit klaren Regeln, wer was darf.

## KI-Audit-Landingpage (src/content/pages/kiAudit.ts)

_Strukturell eine starke Seite: Why-first-Hero mit klarem Einstiegsversprechen, ehrliche Für-wen/nicht-Sektion, mutige Garantie und eine FAQ auf Augenhöhe („Ist das ein Verkaufsgespräch?") — der Ton trifft die Marke fast durchgehend. Größte Schwäche ist ein Jargon-Cluster aus „Use Case", „ROI", „Roadmap" und „Intake", der sich exakt durch die konversionskritischen Abschnitte zieht (Lösung, Ablauf, Garantie, FAQ) — für einen Geschäftsführer ohne KI-Vorwissen die härteste Verständnishürde, zumal die Seite parallel das schöne deutsche Wort „Fahrplan" etabliert und es dann selbst bricht. Zweite Schwäche: Die Preisfrage wird in der FAQ umschifft und die CTAs verschweigen das niedrigschwelligste Argument („kostenlos"). Randnotiz für das Team: Die Seite nennt zweimal „10 bis 150 Mitarbeitende", die Guidelines sagen 10–250 — bitte prüfen, ob die Verengung gewollt ist (kein Copy-Problem, daher kein Finding)._


**🔴 HOCH · src/content/pages/kiAudit.ts - solution.heading**
- **Ist:** Eine Analyse. Drei priorisierte Use Cases. Ein Fahrplan.
- **Problem:** „Use Cases" ist genau der KI-Jargon, den ein Geschäftsführer ohne Vorwissen nicht kennt — und das ausgerechnet in der zentralen Nutzen-Headline der Seite.
- **Neu:** Eine Analyse. Drei Prozesse mit Priorität. Ein Fahrplan.

**🔴 HOCH · src/content/pages/kiAudit.ts - solution.intro**
- **Ist:** …finden wir die drei Prozesse mit dem höchsten KI- und Automatisierungs-ROI in Ihrem Unternehmen — mit Aufwand-Nutzen-Schätzung.
- **Problem:** „ROI" bleibt unübersetzt — die Abkürzung sagt einem Nicht-Fachpublikum nichts; der Kundennutzen (es lohnt sich finanziell) geht hinter dem Kürzel verloren.
- **Neu:** In rund 25 Stunden, verteilt über 5 bis 10 Werktage, finden wir die drei Prozesse in Ihrem Unternehmen, bei denen KI und Automatisierung am meisten bringen — mit Aufwand-Nutzen-Schätzung. Die Priorität setzen Sie selbst.

**🔴 HOCH · src/content/pages/kiAudit.ts - garantie.text**
- **Ist:** Mindestens drei umsetzbare KI-Use-Cases aus Ihrem Audit. Garantiert — oder Sie zahlen nicht.
- **Problem:** Die Garantie ist das stärkste Kaufargument der Seite — und hängt an einem Begriff („Use-Cases"), den die Zielgruppe nicht sicher versteht. Was garantiert wird, muss beim ersten Lesen klar sein.
- **Neu:** Mindestens drei umsetzbare KI-Anwendungen aus Ihrem Audit. Garantiert — oder Sie zahlen nicht.

**🔴 HOCH · src/content/pages/kiAudit.ts - faq.items[0] („Was kostet das Audit?")**
- **Ist:** Das Erstgespräch ist kostenlos und unverbindlich. Das Audit selbst ist an unsere Garantie geknüpft: Finden wir keine drei umsetzbaren KI-Use-Cases, zahlen Sie nichts.
- **Problem:** Die direkte Preisfrage wird nicht beantwortet — für ein Entry-Offer, bei dem Laien sofort verstehen sollen, „was sie bekommen und was es kostet", ist das die kritischste Lücke der Seite (plus Use-Case-Jargon). Ideal wäre eine echte Zahl oder Spanne — die kann nur das Team ergänzen; der Vorschlag macht das Ausweichen wenigstens ehrlich.
- **Neu:** Das Erstgespräch ist kostenlos und unverbindlich. Den konkreten Preis fürs Audit nennen wir Ihnen dort offen. Und er ist abgesichert: Finden wir keine drei umsetzbaren KI-Anwendungen, zahlen Sie nichts.

**🔴 HOCH · src/content/pages/kiAudit.ts - ablauf.steps[2].title**
- **Ist:** Use-Case-Mapping & ROI
- **Problem:** Doppelter Fachjargon als Schritt-Label — genau die Begriffe, die die Zielgruppe nicht kennt; die Beschreibung darunter erklärt es bereits perfekt auf Deutsch.
- **Neu:** Bewertung & Priorisierung

**🔴 HOCH · src/content/pages/kiAudit.ts - ablauf.steps[0].title**
- **Ist:** Intake
- **Problem:** Englischer Agentur-Jargon, den ein Mittelstands-Geschäftsführer nicht kennt — als Schritt-Titel wird er beim Scannen als Erstes gelesen.
- **Neu:** Vorbereitung

**🔴 HOCH · src/content/pages/kiAudit.ts - ablauf.steps[3] (title + desc)**
- **Ist:** Report & Roadmap-Übergabe / „…ein Gespräch, in dem wir die Roadmap gemeinsam durchgehen."
- **Problem:** „Roadmap" ist Anglizismus UND bricht die eigene Begriffswelt: Hero, FAQ und CTA sagen durchgehend „Fahrplan" — zwei Wörter für dieselbe Sache verwirren Laien.
- **Neu:** Titel: „Report & Fahrplan-Übergabe" / Desc: „Sie bekommen den vollständigen Report — und ein Gespräch, in dem wir den Fahrplan gemeinsam durchgehen."

**🟡 MITTEL · src/content/pages/kiAudit.ts - solution.bullets[0]**
- **Ist:** Drei priorisierte KI-Use-Cases — keine Liste mit fünfzig Ideen, sondern die, die sich wirklich lohnen.
- **Problem:** „Use-Cases" — gleicher Jargon wie in der Heading, im wichtigsten Deliverable-Bullet.
- **Neu:** Drei konkrete KI-Anwendungen mit klarer Priorität — keine Liste mit fünfzig Ideen, sondern die, die sich wirklich lohnen.

**🟡 MITTEL · src/content/pages/kiAudit.ts - solution.bullets[1]**
- **Ist:** Aufwand-Nutzen-Schätzung pro Use Case — die Grundlage für Ihre interne Entscheidung.
- **Problem:** „pro Use Case" — Jargon; der Rest des Satzes ist bereits vorbildlich verständlich.
- **Neu:** Aufwand-Nutzen-Schätzung pro Anwendung — die Grundlage für Ihre interne Entscheidung.

**🟡 MITTEL · src/content/pages/kiAudit.ts - faq.items[3] („Was bekommen wir am Ende konkret?")**
- **Ist:** Eine priorisierte Liste umsetzbarer Use-Cases mit ROI-Einschätzung und einen konkreten Fahrplan — eine Entscheidungsgrundlage, keine weitere Meinung.
- **Problem:** „Use-Cases" + „ROI-Einschätzung" in der Antwort, die das Ergebnis erklären soll — ausgerechnet hier muss es jargonfrei sein; die Seite hat mit „Aufwand-Nutzen-Schätzung" schon die bessere Formulierung.
- **Neu:** Eine priorisierte Liste umsetzbarer KI-Anwendungen mit Aufwand-Nutzen-Einschätzung und einen konkreten Fahrplan — eine Entscheidungsgrundlage, keine weitere Meinung.

**🟡 MITTEL · src/content/pages/kiAudit.ts - hero.ctaPrimary + cta.heading**
- **Ist:** Fahrplan-Gespräch buchen
- **Problem:** Der CTA verschweigt das niedrigschwelligste Argument: dass das Gespräch kostenlos und unverbindlich ist (steht erst versteckt in der FAQ). Die CTA-Logik der Guidelines verlangt ein Entry-Signal wie „Kostenlose KI-Analyse".
- **Neu:** Kostenloses Fahrplan-Gespräch buchen

**🟡 MITTEL · src/content/pages/kiAudit.ts - seo.description**
- **Ist:** In 5–10 Werktagen zeigen wir, welche drei Prozesse den höchsten KI-ROI haben — inkl. Aufwand-Nutzen-Schätzung, Roadmap und Förderhinweis. Garantiert mindestens 3 umsetzbare Use Cases.
- **Problem:** „KI-ROI", „Roadmap" und „Use Cases" im Google-sichtbaren Snippet — der erste Kontaktpunkt mit der Zielgruppe muss jargonfrei sein und sollte dieselben Begriffe nutzen wie die Seite („Fahrplan").
- **Neu:** In 5–10 Werktagen zeigen wir, welche drei Prozesse sich bei Ihnen mit KI zuerst lohnen — inkl. Aufwand-Nutzen-Schätzung, Fahrplan und Förderhinweis. Garantiert mindestens drei umsetzbare KI-Anwendungen.

**⚪ NIEDRIG · src/content/pages/kiAudit.ts - solution.bullets[3]**
- **Ist:** Förderhinweis: Das Audit kann BAFA-förderfähig sein — das senkt Ihren Einstieg spürbar.
- **Problem:** Das Kürzel „BAFA" bleibt unerklärt — viele Geschäftsführer kennen es, aber „staatlich gefördert" versteht jeder sofort und macht das Kaufargument stärker.
- **Neu:** Förderhinweis: Das Audit kann staatlich gefördert werden (BAFA) — das senkt Ihren Einstieg spürbar.

**⚪ NIEDRIG · src/content/pages/kiAudit.ts - problem.situations[0] + fit.passt[1]**
- **Ist:** ChatGPT läuft, Zapier auch — trotzdem kein System, das der ganzen Firma hilft.
- **Problem:** „Zapier" kennt nur, wer schon automatisiert — für den Rest der Zielgruppe ist der Markenname Rauschen; ChatGPT allein trägt den Wiedererkennungseffekt.
- **Neu:** „ChatGPT läuft, ein paar Automatisierungen auch — trotzdem kein System, das der ganzen Firma hilft." / fit.passt[1]: „Sie ChatGPT oder erste Automatisierungs-Tools ausprobiert haben — aber ohne System dahinter."

**⚪ NIEDRIG · src/content/pages/kiAudit.ts - ablauf.steps[1].title**
- **Ist:** Prozessaufnahme-Call
- **Problem:** Denglisch-Kompositum — die Beschreibung und der Rest der Seite sprechen konsequent von „Gespräch", der Titel sollte mitziehen.
- **Neu:** Prozessaufnahme-Gespräch

**⚪ NIEDRIG · src/content/pages/kiAudit.ts - garantie.sub**
- **Ist:** Liefern wir das nicht, entstehen Ihnen keine Kosten.
- **Problem:** Wiederholt wortgleich die Zeile darüber („oder Sie zahlen nicht") — verschenkter Platz; die Subline könnte stattdessen erklären, was „umsetzbar" heißt.
- **Neu:** Umsetzbar heißt: mit Aufwand, Nutzen und erstem Schritt — keine Ideenliste.

## ROI-Rechner / Lead-Magnet (KI-Hebel-Audit)

_Starke Seite: Der Aufbau ist konsequent nutzenorientiert („Das bekommen Sie zurück", „nicht Ihre Kosten"), die CTAs sind entry-konform, die Rollen-Metapher („Der Türöffner", „Der Kassenwart") macht abstrakte KI-Themen greifbar, und die Sie-Form sitzt durchgehend. Größte Schwächen: An mehreren Stellen bricht Fach- und Marketing-Jargon durch, den ein Geschäftsführer ohne KI-Vorwissen nicht kennt — „Use Cases", „Stack", „FTE", „Quick Win", „reinvestierbar", „adressieren" — und einzelne Formulierungen („Realitäts-Regler", „Wert heben", „Entscheidungsinstanzen") sind eher intern-clever als beim ersten Lesen verständlich. In roiAudit.ts stecken zudem sichtbare Rollen-Untertitel mit Anglizismen (KPI, Cashflow, Compliance, Supply Chain), die auf der Karte im Schritt 2 und in der Auswertung erscheinen._


**🔴 HOCH · src/pages/RoiRechner.tsx - T_DE.emptyNoBranche (Z. 127)**
- **Ist:** Wählen Sie Ihre Branche. Wir gleichen mit realen Automatisierungs-Werten aus über 40 Use Cases ab.
- **Problem:** „Use Cases" ist KI-/Berater-Jargon, den ein Geschäftsführer ohne Vorwissen nicht kennt — direkt daneben (heroSub) heißt es korrekt „aus über 40 realen Automatisierungen".
- **Neu:** Wählen Sie Ihre Branche. Wir gleichen mit Werten aus über 40 realen Automatisierungen ab.

**🔴 HOCH · src/pages/RoiRechner.tsx - Anzeige Wachstums-Lens (Z. 530, FTE-Einheit)**
- **Ist:** `${fmtDec(calc.fte)} FTE` (große Ergebniszahl in der Wachstums-Ansicht)
- **Problem:** „FTE" ist HR-Controlling-Jargon; die Kennzahl ist das prominenteste Element der Ansicht und muss ohne Übersetzung verständlich sein — die Texte darunter sagen bereits „Vollzeitkräfte".
- **Neu:** `${fmtDec(calc.fte)} Vollzeitkräfte` (bzw. bei Platzmangel „Vollzeitstellen")

**🔴 HOCH · src/pages/RoiRechner.tsx - T_DE.stackTitle + stackNote (Z. 142-143)**
- **Ist:** Ihr Stack · 3 Tools / „Diese Tools binden wir direkt an — Ihre KI-Abteilung baut auf dem auf, was schon läuft, statt es zu ersetzen."
- **Problem:** „Stack" ist Tech-Jargon; „Ihre Tools" versteht jeder, und die Erklärzeile darunter bleibt stark und darf bleiben.
- **Neu:** stackTitle: (n) => `Ihre Tools · ${n} im Einsatz` — stackNote unverändert lassen.

**🔴 HOCH · src/pages/RoiRechner.tsx - T_DE.roadmapSub (Z. 157)**
- **Ist:** Sortiert nach Wirkung × Aufwand. Quick Wins zuerst — inklusive des Tool-Stacks, mit dem wir jede Rolle bauen.
- **Problem:** Dreifacher Jargon in einem Satz: „Wirkung × Aufwand" (Formel-Notation), „Quick Wins" und „Tool-Stack" — nichts davon ist Alltagssprache der Zielgruppe.
- **Neu:** Sortiert nach dem besten Verhältnis von Wirkung zu Aufwand. Die schnellsten Erfolge zuerst — inklusive der Programme, mit denen wir jede Rolle aufbauen.

**🔴 HOCH · src/content/roiAudit.ts - PAINFIELDS „Das Cockpit".sub (Z. 41)**
- **Ist:** KPI & Reporting
- **Problem:** Doppelter Anglizismus als sichtbarer Rollen-Untertitel in Schritt 2 und der Auswertung; „KPI" kennt die Zielgruppe nicht sicher.
- **Neu:** Zahlen & Berichte

**🔴 HOCH · src/content/roiAudit.ts - BRANCHES „handel".label + sub (Z. 61)**
- **Ist:** Handel & Supply Chain — „Handel · Import/Export · Logistik · Handwerk"
- **Problem:** „Supply Chain" ist Anglizismus im wichtigsten Auswahlmoment (Schritt 1); die Unterzeile sagt es bereits auf Deutsch („Logistik").
- **Neu:** Handel & Lieferkette

**🔴 HOCH · src/content/roiAudit.ts - BRANCHES „professional".label (Z. 62)**
- **Ist:** Professional Services
- **Problem:** Rein englischer Kategoriename als Branchen-Label in Schritt 1; ein deutscher Kanzlei- oder Beratungsinhaber sucht sich darunter nicht sicher selbst.
- **Neu:** Kanzleien & Beratung (Unterzeile „Kanzleien · Beratung · Architektur · Makler" bleibt)

**🔴 HOCH · src/pages/RoiRechner.tsx - T_DE.reportSub (Z. 164)**
- **Ist:** Speichern Sie Ihr Audit inkl. Tool-Roadmap direkt als PDF — oder lassen Sie es sich persönlich per E-Mail schicken.
- **Problem:** „Tool-Roadmap" ist doppelter Anglizismus im Lead-Formular — dem konversionskritischsten Text der Seite; auch reportTitle (Z. 163) nutzt ihn.
- **Neu:** Speichern Sie Ihr Audit inkl. Umsetzungsplan direkt als PDF — oder lassen Sie es sich persönlich per E-Mail schicken. (reportTitle analog: „Report als PDF + Umsetzungsplan")

**🟡 MITTEL · src/pages/RoiRechner.tsx - T_DE.growthRange (Z. 138)**
- **Ist:** ${hours} Std./Jahr — reinvestierbar statt Neueinstellung
- **Problem:** „reinvestierbar" ist Finanz-Jargon und der Telegrammstil macht den Nutzen abstrakt statt konkret.
- **Neu:** ${hours} Std./Jahr — Zeit für Wachstum, ohne neu einzustellen

**🟡 MITTEL · src/pages/RoiRechner.tsx - T_DE.benchmark (Z. 139-141)**
- **Ist:** Betriebe in „{label}" heben mit einer vollen KI-Abteilung typischerweise {full}/Jahr. Sie adressieren gerade {share}% davon.
- **Problem:** „heben" und „adressieren" sind Beraterdeutsch; ein GF ohne Vorwissen liest „adressieren" nicht als „ausschöpfen".
- **Neu:** Betriebe in „{label}" holen mit einer vollen KI-Abteilung typischerweise {full}/Jahr heraus. Ihre Auswahl deckt davon {share}% ab.

**🟡 MITTEL · src/pages/RoiRechner.tsx - T_DE.s3Sub (Z. 121)**
- **Ist:** Wie weit sind Sie mit Automatisierung? Das kalibriert, wie schnell Sie den Wert heben.
- **Problem:** „kalibriert" ist technisches Vokabular und „Wert heben" Beraterfloskel — beides erste-Lese-Hürden an einer entscheidenden Stelle (letzter Schritt vor der Analyse).
- **Neu:** Wie weit sind Sie mit Automatisierung? Danach richtet sich, wie schnell sich das Potenzial für Sie auszahlt.

**🟡 MITTEL · src/pages/RoiRechner.tsx - T_DE.realismTitle (Z. 148)**
- **Ist:** Realitäts-Regler
- **Problem:** Interner Feature-Name statt Nutzer-Sprache; ohne Erklärung ist unklar, was der Regler tut (er stellt ein, wie vorsichtig gerechnet wird).
- **Neu:** Wie vorsichtig rechnen wir?

**🟡 MITTEL · src/pages/RoiRechner.tsx - „Quick Win"-Badge (hartcodiert, Z. 440 u. 635)**
- **Ist:** Quick Win
- **Problem:** Anglizismus als Label auf den Rollen-Karten (Schritt 2) und in der Auswertung; nicht jeder GF liest daraus „schneller Erfolg" — zudem hartcodiert statt im T_DE-Wörterbuch (EN-Seite zeigt dasselbe, DE braucht eine eigene Fassung).
- **Neu:** Schneller Erfolg (als T_DE-Eintrag, z. B. quickWinLabel: "Schneller Erfolg")

**🟡 MITTEL · src/pages/RoiRechner.tsx - T_DE.footnoteModeled (Z. 154)**
- **Ist:** Modellierte Richtwerte für Entscheidungsinstanzen, skaliert auf Reifegrad und Teamgröße, minus ~15 % laufende Kosten.
- **Problem:** „Modellierte Richtwerte", „skaliert", „Reifegrad" — die Fußnote soll Vertrauen schaffen, liest sich aber wie ein Methodenpapier; zudem taucht der interne Branchenname „Entscheidungsinstanzen" auf.
- **Neu:** Geschätzte Richtwerte für diese Branche, angepasst an Ihren Stand und Ihre Teamgröße, abzüglich ~15 % laufender Kosten.

**🟡 MITTEL · src/content/roiAudit.ts - PAINFIELDS „Der Kassenwart".sub (Z. 39)**
- **Ist:** Rechnung & Cashflow
- **Problem:** „Cashflow" ist Finanz-Anglizismus; die Rolle soll gerade den Alltag des Betriebs treffen.
- **Neu:** Rechnungen & Zahlungseingang

**🟡 MITTEL · src/content/roiAudit.ts - PAINFIELDS „Der Wächter".sub (Z. 43)**
- **Ist:** Compliance & Recht
- **Problem:** „Compliance" ist Fachjargon; als Untertitel muss die Funktion sofort klar sein.
- **Neu:** Vorschriften & Recht

**🟡 MITTEL · src/content/roiAudit.ts - BRANCHES „health".label (Z. 63)**
- **Ist:** Health Care
- **Problem:** Unnötiger Anglizismus, wo die deutsche Entsprechung kürzer und klarer ist — die Unterzeile („Praxen · MVZ · Therapeuten") ist bereits deutsch.
- **Neu:** Gesundheitswesen

**🟡 MITTEL · src/content/roiAudit.ts - BRANCHES „instanzen".label (Z. 64)**
- **Ist:** Entscheidungsinstanzen — „Awards · Gremien · Vergabe · Hochschulen"
- **Problem:** „Entscheidungsinstanzen" ist Verwaltungs-Abstraktum, unter dem sich ein Award-Veranstalter oder eine Vergabestelle nicht sofort erkennt.
- **Neu:** Jurys & Vergabestellen (Unterzeile „Awards · Gremien · Vergabe · Hochschulen" bleibt)

**🟡 MITTEL · src/pages/RoiRechner.tsx - T_DE.seoTitle (Z. 104)**
- **Ist:** KI-Hebel-Audit — Ihre KI-Abteilung nach Branche | NEWEDGE
- **Problem:** „KI-Hebel-Audit" stapelt drei Abstrakta; „Hebel" ist Beraterbild, und der Titel verrät nicht den Nutzen (kostenlos, in Minuten Klarheit) — schwach für Klickrate und Ersteindruck.
- **Neu:** Kostenlose KI-Analyse — was KI Ihrem Betrieb bringt | NEWEDGE

**⚪ NIEDRIG · src/pages/RoiRechner.tsx - T_DE.footnoteReal (Z. 155)**
- **Ist:** Spannen aus realen Automatisierungen, skaliert auf Reifegrad und Teamgröße, minus ~15 % laufende Kosten. Investition = KI-Audit + geschätzte Umsetzung.
- **Problem:** „skaliert auf Reifegrad" ist Modell-Jargon; die Gleichungs-Schreibweise „Investition = …" ist Excel-Stil statt Satz.
- **Neu:** Spannen aus realen Automatisierungen, angepasst an Ihren Stand und Ihre Teamgröße, abzüglich ~15 % laufender Kosten. Die Investition umfasst das KI-Audit plus die geschätzte Umsetzung.

**⚪ NIEDRIG · src/pages/RoiRechner.tsx - T_DE.moneySub (Z. 133)**
- **Ist:** Netto-Einsparpotenzial / Jahr
- **Problem:** „Netto-Einsparpotenzial" ist Controller-Sprache und widerspricht der Benefit-Logik der Headline darüber („Das bekommen Sie zurück") — Feature- statt Nutzenformulierung.
- **Neu:** Das sparen Sie pro Jahr — nach Abzug der laufenden Kosten

**⚪ NIEDRIG · src/pages/RoiRechner.tsx - T_DE.paybackLab (Z. 151)**
- **Ist:** Amortisation
- **Problem:** Betriebswirtschaftlicher Fachbegriff als einsames Label unter der Zahl; „3 Mon." + „Amortisation" erschließt sich Nicht-BWLern nicht sofort.
- **Neu:** Investition wieder drin nach

**⚪ NIEDRIG · src/pages/RoiRechner.tsx - T_DE.leadSuccess (Z. 172-174)**
- **Ist:** Unterwegs an {email}. Wir melden uns mit Ihrer Roadmap.
- **Problem:** „Roadmap" ist Anglizismus und inkonsistent, wenn das Formular davor auf „Umsetzungsplan" umgestellt wird.
- **Neu:** Unterwegs an {email}. Wir melden uns mit Ihrem Umsetzungsplan.

**⚪ NIEDRIG · src/pages/RoiRechner.tsx - T_DE.noSharing (Z. 171)**
- **Ist:** Keine Weitergabe.
- **Problem:** Zu knapp, um Vertrauen zu stiften — unklar, was nicht weitergegeben wird; Microcopy neben dem Absenden-Button soll die letzte Hürde nehmen.
- **Neu:** Ihre Daten bleiben bei uns.

**⚪ NIEDRIG · src/content/roiAudit.ts - ROI_ENTRY.note (Z. 30, sichtbar als „Einstieg · BAFA-förderfähig")**
- **Ist:** BAFA-förderfähig
- **Problem:** Das Kürzel „BAFA" kennt nicht jeder GF; die eigentliche Botschaft — der Staat zahlt mit — geht hinter dem Behördenkürzel verloren.
- **Neu:** staatlich förderfähig (BAFA)

## WebDesign-Seite (/websites)

_Starke Seite im Kern: Der Hero öffnet vorbildlich mit dem Why („Websites, die verkaufen“), die Copy denkt fast durchgehend vom Kundennutzen her (Anfragen, Vertrauen, „am Ende gehört alles Ihnen“), und die CTAs sind klar und niedrigschwellig. Die größte Schwäche ist Tech- und Marketing-Jargon, den ein Geschäftsführer ohne Vorwissen nicht sicher versteht — „Conversion“, „performant“, „skalierbar“, „Interface“, „Buchungsstrecke“ — plus der englische Kalk „Vertraut von wachsenden Marken“, der ausgerechnet auf einer Seite, die Sprachqualität mitverkauft, unsauber wirkt. Kleiner Positionierungs-Hinweis: „Mittelstand“ steht nur in der Meta-Description, nirgends im sichtbaren Text._


**🔴 HOCH · src/content/pages/webDesign.ts — hero.trustChips[0]**
- **Ist:** Höhere Conversion
- **Problem:** „Conversion“ ist Marketing-Jargon, den die Zielgruppe (GF ohne Marketing-Vorwissen) nicht sicher kennt — und das als erster Trust-Chip im Hero.
- **Neu:** Besucher werden Kunden

**🔴 HOCH · src/content/pages/webDesign.ts — prozess.steps[2] (Entwicklung), desc**
- **Ist:** Skalierbar und sauber gebaut: schnell, flexibel, wartbar — am Ende gehört alles Ihnen, ohne Agentur-Abhängigkeit.
- **Problem:** „Skalierbar“ und „wartbar“ sind Entwickler-Jargon; der Satz öffnet mit Technik-Attributen (What) statt mit dem starken Nutzen am Ende.
- **Neu:** Sauber gebaut und wächst mit Ihnen mit: schnell, flexibel, leicht zu pflegen — am Ende gehört alles Ihnen, ohne Agentur-Abhängigkeit.

**🔴 HOCH · src/content/pages/webDesign.ts — prozess.steps[1] (Webdesign), desc**
- **Ist:** Ein performantes, individuelles Design, das Besucher überzeugt und gezielt zu Anfragen führt — nicht nur gefällt.
- **Problem:** „performant“ ist Tech-Jargon — ein GF weiß nicht, dass damit „schnell ladend“ gemeint ist.
- **Neu:** Ein schnelles, individuelles Design, das Besucher überzeugt und gezielt zu Anfragen führt — nicht nur gefällt.

**🔴 HOCH · src/content/pages/webDesign.ts — showreel.logosHeading**
- **Ist:** Vertraut von wachsenden Marken
- **Problem:** Wörtliche Übersetzung von „Trusted by“ — im Deutschen grammatisch schief und damit ein Glaubwürdigkeitsproblem auf einer Seite, die Qualität verkauft.
- **Neu:** Wachsende Marken vertrauen NEWEDGE

**🟡 MITTEL · src/content/pages/webDesign.ts — cases.items[2] (Becoming You), desc**
- **Ist:** Eine Plattform, die skaliert: individuelles Interface, sauberes Fundament und ein System, das das Team eigenständig weiterpflegen kann.
- **Problem:** „skaliert“ und „Interface“ sind Tech-Jargon für ein Nicht-Fachpublikum.
- **Neu:** Eine Plattform, die mitwächst: individuelle Oberfläche, sauberes Fundament und ein System, das das Team selbst weiterpflegen kann.

**🟡 MITTEL · src/content/pages/webDesign.ts — cases.items[0] (AlbaNova Consulting), desc**
- **Ist:** Von der Vision zur Marktpräsenz: neue Website und Brand-System für die Consulting-Marke — klar positioniert, hochwertig, auf Anfragen ausgerichtet.
- **Problem:** „Brand-System“ ist Agentur-Jargon; „Markenauftritt“ sagt dasselbe in Alltagssprache.
- **Neu:** Von der Vision zur Marktpräsenz: neue Website und durchgängiger Markenauftritt — klar positioniert, hochwertig, auf Anfragen ausgerichtet.

**🟡 MITTEL · src/content/pages/webDesign.ts — prozess.eyebrow**
- **Ist:** Schnell. Effizient. Ergebnisorientiert.
- **Problem:** Adjektiv-Stakkato ohne Substanz — genau die Beraterfloskeln, die die Guidelines ausschließen („leere Superlative“); zudem What statt Why.
- **Neu:** In drei Schritten zur Website, die verkauft.

**🟡 MITTEL · src/content/pages/webDesign.ts — cases.items[1] (Elite Aesthetic), desc**
- **Ist:** Design und Buchungsstrecke greifen ineinander und wirken sofort professionell.
- **Problem:** „Buchungsstrecke“ ist Funnel-Jargon aus der Marketing-Welt; die Zielgruppe kennt den Begriff nicht.
- **Neu:** Design und Online-Buchung greifen ineinander und wirken sofort professionell.

**⚪ NIEDRIG · src/content/pages/webDesign.ts — seo.description**
- **Ist:** Strategie, Design und Entwicklung aus einer Hand — performant, individuell, skalierbar.
- **Problem:** „performant“ und „skalierbar“ sind Tech-Jargon — auch im Google-Snippet muss die Zielgruppe den Nutzen sofort verstehen.
- **Neu:** Strategie, Design und Entwicklung aus einer Hand — schnell, individuell und gebaut, um mitzuwachsen.

**⚪ NIEDRIG · src/content/pages/webDesign.ts — finalCta.sub**
- **Ist:** In einem kurzen Kennenlern-Call schauen wir gemeinsam, ob und wo ein Projekt Sinn ergibt — auf Basis Ihrer Situation und Ziele. Komplett unverbindlich.
- **Problem:** „Kennenlern-Call“ ist unnötiger Anglizismus; außerdem doppelt „Komplett unverbindlich“ die direkt darunter stehende Note „100% kostenlos & unverbindlich“.
- **Neu:** In einem kurzen Kennenlerngespräch schauen wir gemeinsam, ob und wo ein Projekt Sinn ergibt — auf Basis Ihrer Situation und Ziele.

**⚪ NIEDRIG · src/content/pages/webDesign.ts — showreel.videoCaption**
- **Ist:** NEWEDGE — Showreel
- **Problem:** „Showreel“ ist Branchen-Jargon aus der Kreativwelt; ein Mittelstands-GF kann den Begriff nicht sicher einordnen.
- **Neu:** NEWEDGE — Projekte im Video