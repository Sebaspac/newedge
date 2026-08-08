# Team-Sektion auf "Über uns" entfernen (auf Basis des Live-Stands)

## Ablauf

1. **Du** stellst über **History** die aktuell live Version wieder her (Restore beim Eintrag, der dem letzten Publish entspricht). Die "neuen" Änderungen werden dadurch archiviert, aber nicht gelöscht — sie können später jederzeit wieder geholt werden.
2. **Ich** entferne anschließend die Team-Sektion auf der Seite `/ueber-uns`.
3. **Du** klickst **Publish → Update**, damit der neue Live-Stand (= alter Stand ohne Team-Sektion) live geht.

## Was genau entfernt wird (in `src/pages/About.tsx`)

- **Team-Karten-Sektion** (Zeilen ~230–362): kompletter Block `{/* ── TEAM CARDS ── */}` inkl. Grid, Karten, Foto/Avatar, Rolle, Facts.
- **`team`-Array-Definition** (ab Zeile 32) inkl. der Mitglieder-Einträge.
- **Ungenutzte Imports** der Team-Bilder (`team-sebastian.png`, `team-ivan.png`, `team-wenjamin.png`, Zeilen 18–20).
- **Hero-Headline-Text "Unser Team."** bleibt vorerst erhalten — falls dieser auch weg soll, bitte kurz Bescheid geben (Zeile 171 + zugehörige Beschreibung Zeile 185 und SEO-Title/Description Zeilen 107–108).

Hero, Werte, Units-Links und CTA-Sektion bleiben unverändert.

## Wichtig

- Solange Schritt 1 (History-Restore) nicht passiert ist, würde mein Edit auf dem aktuellen Editor-Stand (= die "neue" Version, die du verwerfen willst) landen. Bitte zuerst restoren, dann gib mir Bescheid — ich entferne die Sektion dann sofort.
