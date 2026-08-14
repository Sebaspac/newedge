# NEWEDGE — Monorepo

Website, CMS und Lead-Service in einem Repo. Vorher lagen sie in drei
getrennten Codebasen, eine davon unversioniert auf dem Desktop.

> **Neu hier und sollst das deployen? → [HANDOVER.md](HANDOVER.md)**
> Das ist der **einzige** gültige Deploy-Weg. Vor dem ersten Serverbefehl lesen
> — Abschnitt 1: Auf dem Ziel-VPS läuft ein produktives Mattermost hinter
> demselben Caddy.

Der Deploy ist ein Kommando (`sudo ./deploy.sh <domain> <tls-mail>`, davor ein
Trockenlauf). Die genauen Befehle stehen bewusst **nur** in
[HANDOVER.md](HANDOVER.md), Abschnitt 2 — an einer Stelle, damit sie nicht
auseinanderlaufen können.

`deploy.sh` ruft der Reihe nach `apps/cms/deploy/setup.sh` (Docker-Stack,
Website-Build, Ausrollen nach `/var/www/newedgebrand/dist`),
`apps/cms/deploy/caddy-einbinden.sh` (Site-Block additiv in den laufenden Caddy,
mit Sicherung und automatischem Rückbau) und `./verify.sh` (Abnahme). Von Hand
bleiben genau zwei Dinge: Strapi-Admin-Konto anlegen und SMTP-App-Passwort
eintragen — beides in [HANDOVER.md](HANDOVER.md), Abschnitt 4.

### Welche Doku gilt — und welche nicht

Im Repo liegen ältere Runbooks. Sie beschreiben ein **nginx + certbot**-Setup
und sind damit für diesen Server **falsch und gefährlich**: dort hält Caddy die
Ports 80/443 für ein produktives Mattermost. Ein installiertes nginx startet
zwar nicht, bleibt aber aktiviert und rennt beim nächsten Neustart mit Caddy um
den Port.

| Dokument | Status |
|---|---|
| [`HANDOVER.md`](HANDOVER.md) | **Gültig.** Deploy, Abnahme, Betrieb, Fehlersuche. Hier anfangen. |
| [`apps/cms/deploy/CADDY-KOEXISTENZ.md`](apps/cms/deploy/CADDY-KOEXISTENZ.md) | **Gültig** als Handarbeit-Variante des Caddy-Einbaus (z. B. wenn Caddy im Container läuft). |
| [`apps/lead-api/README-DEPLOY.md`](apps/lead-api/README-DEPLOY.md) | **Gemischt.** Deploy-Teil (Abschnitte 1–3) überholt; der **Betriebsteil ab 4b** — Follow-ups, Abmeldung, Selbsttest, Lead-Ablage — gilt und steht nirgends sonst. |
| [`apps/cms/DEPLOY.md`](apps/cms/DEPLOY.md) | **Überholt** (nginx). Als Hintergrund lesbar: Same-Origin-Begründung, Routing-Tabelle, PWA-Service-Worker-Falle, Troubleshooting. Nicht ausführen. |
| [`apps/cms/DEPLOY-KOMPLETT.md`](apps/cms/DEPLOY-KOMPLETT.md) | **Überholt** (nginx). Als Hintergrund lesbar: Redaktions-Alltag „Bild austauschen", Content-Nachzug. Nicht ausführen. |

Jedes überholte Dokument trägt die Warnung noch einmal an seinem Anfang und an
den gefährlichen Befehlen selbst.

```
apps/
├── website/    Vite + React      → Netlify (statisch)
├── cms/        Strapi 5          → VPS (Docker + Postgres)
└── lead-api/   FastAPI (Python)  → VPS (Docker)
```

## Wer spricht mit wem

```
Besucher ─▶ Website (Netlify oder VPS/Caddy)
              │
              ├─ Inhalte + Bilder ──▶ CMS        (VITE_STRAPI_URL)
              └─ Formulare ─────────▶ Lead-API   (VITE_API_URL)
                                        │
                                        ├─ data/*.jsonl   (Primärablage)
                                        ├─ Mail via SMTP
                                        └─ Lead ──▶ CMS   (Zweitablage, optional)
```

Beide Verbindungen der Website sind **optional**: Ohne `VITE_STRAPI_URL`
liefert die Website ihre eingebauten Inhalte, ohne `VITE_API_URL` laufen die
Formulare im Testmodus. Das ist Absicht — nichts bricht, wenn ein Dienst fehlt.

---

## Website — `apps/website`

```bash
cd apps/website
npm install
npm run dev          # http://localhost:8081
npm run build        # → dist/
```

Netlify baut aus der Repo-Wurzel; `netlify.toml` setzt `base = "apps/website"`.

| Variable | Wirkung |
|---|---|
| `VITE_STRAPI_URL` | CMS-Basis-URL. Leer = eingebaute Inhalte. **Nie localhost eintragen** — der Wert wird ins Live-Bundle gebacken. |
| `VITE_API_URL` | Lead-Service-Basis-URL, ohne Pfad. Leer = Formulare senden nichts. |

## CMS — `apps/cms`

```bash
cd apps/cms
npm install
SEED=1 npm run develop     # http://localhost:1337/admin
```

`SEED=1` nur beim Erststart oder nach `gen-schemas` — der Seed **überschreibt**
redaktionelle Änderungen an geseedeten Einträgen. Details: [HANDOVER.md](HANDOVER.md),
Abschnitt 6 („Bekannte Eigenheiten"), und für das Content-Modell
`apps/cms/CONTENT-MODEL.md`.

Inhalte pflegen: Single Types je Seite/Sektion, Collections für
Anwendungsfelder, Testimonials, Jobs. **Bilder und Videos** werden nicht im
Code getauscht, sondern über die Collection *„Bild austauschen"* — ein Eintrag
je Bild, Datei hochladen, fertig. Kein Deploy nötig.

## Lead-Service — `apps/lead-api`

```bash
cd apps/lead-api
cp .env.example .env       # SMTP-Zugang eintragen
docker compose up -d --build
curl http://127.0.0.1:8090/health
```

Nimmt Kontaktformular und ROI-Rechner entgegen, erzeugt den PDF-Report und
verschickt die Mails. Auf dem VPS läuft er als Container `lead-api` im
gemeinsamen Stack — deployt wird er über [HANDOVER.md](HANDOVER.md), nicht
separat. Betrieb (Follow-ups, Abmeldung, Selbsttest, Lead-Ablage):
`apps/lead-api/README-DEPLOY.md` **ab Abschnitt 4b** — die Abschnitte 1–3
derselben Datei sind ein überholtes nginx-Runbook.

Zwei Dinge, die man wissen sollte:

- **Follow-ups sind per Default aus** (`FOLLOWUP_ENABLED=0`). Erst einschalten,
  wenn die Texte gelesen sind — sie gehen an echte Interessenten.
- **`SEND_DISABLED=1` ist kein Pause-Knopf.** Fällige Follow-ups werden dabei
  als „dry run" endgültig abgehakt. Zum Pausieren `FOLLOWUP_WORKER=0`.

---

## Content-Sync: Code → CMS

Die Website bringt ihre Inhalte eingebaut mit (`apps/website/src/content/**`).
Das CMS wird daraus befüllt:

```bash
cd apps/website && node scripts/export-content.mjs      # → newedge-content.json
cd ../cms && node scripts/gen-schemas.mjs <pfad>        # Schemas + Seed-Datei
SEED=1 npm run develop                                   # in die Datenbank
```

Sobald das CMS antwortet, **gewinnt es gegenüber den eingebauten Inhalten**.
Ein veralteter Seed überschreibt also neuere Texte aus dem Code — vor dem
Live-Gang einmal frisch seeden.

## Personenbezogene Daten

- `apps/lead-api/data/` (Leads, Reports, Follow-up-Queue) ist gitignored und
  gehört nie ins Repo.
- Der CMS-Typ *Lead* hat bewusst **kein** Public-Read: Leads sind nur im Admin
  sichtbar, nicht über die offene API abrufbar.
