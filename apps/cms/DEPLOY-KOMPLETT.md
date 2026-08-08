# ÜBERHOLT — NACH DIESEM DOKUMENT WIRD NICHT MEHR DEPLOYT

> **Der einzige gültige Deploy-Weg steht in [`HANDOVER.md`](../../HANDOVER.md)
> in der Repo-Wurzel.** Dort: ein Kommando (`deploy.sh`), davor ein Trockenlauf,
> danach eine Abnahme (`verify.sh`). Dieses Dokument hier kennt weder `deploy.sh`
> noch `verify.sh` noch `caddy-einbinden.sh` — es ist älter als alle drei.
>
> **Warum es auf DIESEM Server gefährlich ist:** Diese Anleitung beschreibt ein
> Deployment mit **nginx + certbot**. Auf dem Zielserver (Hetzner CX23,
> `178.104.36.93`) hält aber **Caddy** die Ports 80/443 — und dahinter liegt ein
> **produktives Mattermost** (`chat.newedgebrand.com`, mit Hermes-Agent).
> Das `apt install -y nginx certbot python3-certbot-nginx` aus Abschnitt 1
> installiert und aktiviert nginx neben Caddy. Es startet nicht sofort
> („Address already in use"), bleibt aber **installiert und per systemd
> aktiviert** — und rennt beim nächsten Serverneustart mit Caddy um Port 80/443.
> Wer dieses Rennen gewinnt, entscheidet die Startreihenfolge, nicht die Absicht.
> Verliert Caddy, ist Mattermost offline, ohne dass jemand etwas getan hat.
>
> **Auf diesem Server deshalb niemals:** `apt install nginx`, `certbot --nginx`,
> `systemctl enable/start nginx`, `setup.sh` ohne `--webserver=caddy`.
>
> **Was hier trotzdem noch stimmt:** die Beschreibung der Dienste und ihrer
> Zuständigkeiten (Abschnitt 2–4), der Redaktions-Alltag „Bilder und Videos
> austauschen" (Abschnitt 7) und das Nachziehen von Inhalten aus dem Code
> (Abschnitt 8). Alles, was Webserver, TLS oder Reihenfolge des Deploys betrifft,
> ist überholt. Lies es als Hintergrund, führe es nicht aus.

---

## NEWEDGE — Kompletter Go-Live auf dem eigenen VPS (überholter Stand)

Eine Domain, ein Server, drei Dienste. Nach dieser Anleitung läuft alles auf
eurem VPS und ihr müsst nur noch die Videos im CMS hochladen.

```
                        ┌── nginx (Port 80/443, HTTPS via certbot) ──┐
  newedgebrand.com  ──▶ │                                            │
                        │  /                  → Website (dist/)      │  statisch
                        │  /api /uploads      → Strapi   :1337       │  CMS
                        │  /admin             → Strapi   :1337       │  Redaktion
                        │  /contact           → Lead-Service :8090   │  Kontaktformular
                        │  /roi-report        → Lead-Service :8090   │  ROI-Report + PDF
                        │  /abmelden/<token>  → Lead-Service :8090   │  Abmeldung (DSGVO)
                        │  /health            → Lead-Service :8090   │  nur ab 127.0.0.1
                        └────────────────────────────────────────────┘
```

> An der Stelle von „nginx (Port 80/443, HTTPS via certbot)" steht auf dem
> Zielserver **Caddy** — mit denselben Pfaden und Zielen, aber ohne certbot
> (Caddy holt und erneuert die Zertifikate selbst) und mit Mattermost im selben
> Webserver. Die Pfad-Zuordnung darunter stimmt also weiter, der Träger nicht.

**Ein Repo, ein Compose-Stack.** CMS und Lead-Service liegen im selben
`docker compose` (`apps/cms/docker-compose.yml`) — nicht mehr in getrennten
Klonen unter `/opt/newedge-*`:

| Ordner im Monorepo | Rolle | Läuft als |
|---|---|---|
| `apps/website/` | Website (Vite-Build) | statische Dateien in `/var/www/newedgebrand/dist` |
| `apps/cms/` | CMS + Postgres | Compose-Services `strapi`, `postgres` |
| `apps/lead-api/` | Kontaktformular + ROI-PDF | Compose-Service `lead-api` (im selben Stack) |

> ~~Diese Datei ist die ausführliche Erzählfassung. Das gepflegte Runbook mit
> Routing-Tabelle, Backup und Troubleshooting ist **`DEPLOY.md`**; der schnellste
> Weg ist ohnehin `sudo ./apps/cms/deploy/setup.sh <domain> <mail>`.~~
>
> **Überholt.** `DEPLOY.md` ist ebenfalls ein nginx-Runbook und ebenfalls nicht
> mehr gültig. Der schnellste **und einzige** Weg ist `sudo ./deploy.sh` aus der
> Repo-Wurzel — beschrieben in [`HANDOVER.md`](../../HANDOVER.md), Abschnitt 2.
> `setup.sh` direkt und ohne `--webserver=caddy` aufzurufen, ist auf diesem
> Server der Einstieg in den nginx-Fehler (siehe Kasten ganz oben).

---

## 1. Vorbereitung (einmalig)

> **NICHT AUSFÜHREN.** Der `apt install`-Befehl unten ist der gefährlichste
> Befehl im ganzen Repo: Auf dem Zielserver hält **Caddy** die Ports 80/443 für
> ein **produktives Mattermost**. Ein installiertes und aktiviertes nginx nimmt
> sich den Port beim nächsten Neustart im Rennen gegen Caddy.
> Richtiger Weg: [`HANDOVER.md`](../../HANDOVER.md) — `deploy.sh` installiert
> nichts an Webservern und hängt den Site-Block additiv in den laufenden Caddy.

- **DNS:** A-Record `newedgebrand.com` (und `www`) auf die VPS-IP.
- **VPS:** Docker + Docker Compose + ~~nginx + certbot~~ installiert.
  ```bash
  curl -fsSL https://get.docker.com | sh
  # ÜBERHOLT UND GEFÄHRLICH — auf diesem Server NICHT ausführen:
  # apt install -y nginx certbot python3-certbot-nginx
  ```
- **SMTP-Zugang:** bei Google Workspace ein **App-Passwort** — aber für
  `sebastian.p@newedgebrand.com`, nicht für `info@`: das ist nur ein Alias
  ohne eigenes Konto (Details: `HANDOVER.md`, Abschnitt 4.2).

---

## 2. CMS starten (Strapi + Postgres)

> **Überholt.** Klon-Adresse, Branch und die Handarbeit unten entsprechen nicht
> mehr dem gültigen Ablauf; `deploy.sh` erledigt Secrets, `.env`, Stack und Seed
> selbst. Der Abschnitt erklärt nur noch, **was** dabei passiert.
> Verbindlich: [`HANDOVER.md`](../../HANDOVER.md), Abschnitt 2.

```bash
# Monorepo — enthält Website, CMS und Lead-Service
git clone -b redesign-cms-2026-07 <new-edge-nexus-build-aeb8eb8b> /opt/newedge
cd /opt/newedge/apps/cms
cp .env.production.example .env   # Secrets erzeugen/eintragen (APP_KEYS etc.)
                                  # + DATABASE_PASSWORD setzen

# Erststart MIT Seed — legt alle Inhalte und die 168 „Bild austauschen"-Einträge an
SEED=1 docker compose up -d --build

docker compose logs -f strapi   # bis "[seed] DONE"
```

Danach **Admin-Konto anlegen**: `https://newedgebrand.com/admin` im Browser
öffnen und das erste Benutzerkonto erstellen (das macht Strapi selbst beim
ersten Aufruf; niemand sonst kann sich vorher registrieren).

---

## 3. Lead-Service scharf schalten (Formulare + PDF)

Nichts zu klonen und nichts extra zu starten: Der Container ist in Schritt 2
schon mit hochgekommen (`docker compose up` startet alle drei Services). Er
braucht nur noch seine eigene `.env`:

```bash
cd apps/lead-api
cp .env.example .env          # SMTP_* + NOTIFY_TO eintragen, SEND_DISABLED=0
chmod 600 .env                # enthält das SMTP-App-Passwort
#   ALLOWED_ORIGINS=https://newedgebrand.com,https://www.newedgebrand.com
#   FOLLOWUP_UNSUBSCRIBE_BASE=https://newedgebrand.com

cd ../cms
docker compose up -d lead-api
curl -s http://127.0.0.1:8090/health | jq .   # → {"status":"ok","mail":true,...}
```

Nur das CMS neu starten, ohne die Formulare anzufassen (und umgekehrt), geht
über die Service-Namen: `docker compose up -d --build postgres strapi` bzw.
`docker compose up -d --build lead-api`. Ein `depends_on` gibt es bewusst
nicht — fällt Strapi aus, nehmen die Formulare weiter Leads an.

---

## 4. Website bauen und ausliefern

> **Überholt.** Es gibt keinen zweiten Klon mehr — Website, CMS und Lead-Service
> liegen im selben Monorepo, und `setup.sh` (von `deploy.sh` aufgerufen) baut die
> Website und rollt sie nach `/var/www/newedgebrand/dist` aus. Die Erklärung zu
> `.env.production` darunter gilt weiterhin: Vite bäckt die Werte zur Build-Zeit
> ein.

```bash
# ÜBERHOLT — zweiter Klon, es gibt nur noch das Monorepo:
git clone <new-edge-website-ACTIVE>  /opt/newedge-web
cd /opt/newedge-web
cp .env.production.example .env.production     # Werte prüfen! (siehe unten)
npm ci
npm run build

mkdir -p /var/www/newedgebrand
rsync -a --delete dist/ /var/www/newedgebrand/dist/
```

`.env.production` muss enthalten — **beides auf die eigene Domain**, niemals localhost:

```
VITE_STRAPI_URL=https://newedgebrand.com
VITE_API_URL=https://newedgebrand.com
```

> Vite bäckt diese Werte zur **Build-Zeit** ein. Nach jeder Änderung neu bauen
> und neu rsyncen.

---

## 5. nginx + HTTPS

> **NICHT AUSFÜHREN — ÜBERHOLT.** Auf dem Zielserver gibt es kein nginx, sondern
> **Caddy** mit einem produktiven Mattermost dahinter. `systemctl reload nginx`
> und `certbot --nginx` gehören zu einem Webserver, der hier nicht laufen darf.
> Den Site-Block hängt `apps/cms/deploy/caddy-einbinden.sh` additiv in den
> laufenden Caddy ein — mit Sicherung, Beweis und automatischem Rückbau.
> `deploy.sh` ruft es als Schritt 2 von selbst auf.
> Beschreibung: [`HANDOVER.md`](../../HANDOVER.md), Abschnitte 1 und 2;
> Handarbeit-Variante: [`deploy/CADDY-KOEXISTENZ.md`](deploy/CADDY-KOEXISTENZ.md).

```bash
# ÜBERHOLT — nginx-Weg, auf diesem Server NICHT ausführen:
# cp /opt/newedge-cms/deploy/nginx.conf /etc/nginx/sites-available/newedgebrand.conf
# ln -s ../sites-available/newedgebrand.conf /etc/nginx/sites-enabled/
# nginx -t && systemctl reload nginx
#
# certbot --nginx -d newedgebrand.com -d www.newedgebrand.com
```

---

## 6. Abnahme (bitte wirklich durchgehen)

> **Ersetzt.** Die Abnahme macht heute `./verify.sh <domain>` mit 35 Prüfpunkten,
> rein lesend — `deploy.sh` ruft es als Schritt 3 auf, wiederholen geht mit
> `sudo ./deploy.sh <domain> --nur-pruefen`. Die vier `curl`-Zeilen unten sind
> eine Teilmenge davon und schaden nicht, beweisen aber deutlich weniger.

```bash
curl -I https://newedgebrand.com                       # 200, Website
curl -s https://newedgebrand.com/api/kontakt | head -c 200   # JSON aus Strapi
curl -s https://newedgebrand.com/api/image-overrides | head -c 120
curl -s https://newedgebrand.com/health                # Lead-Service
```

Und im Browser:
1. Kontaktformular abschicken → Mail bei euch **und** Bestätigung beim Absender.
2. ROI-Rechner durchklicken → PDF-Report per Mail.
3. `/admin` öffnen → Inhalte sichtbar.

---

## 7. Bilder und Videos austauschen (der Redaktions-Alltag)

Im Admin unter **„Bild austauschen"** liegt **ein Eintrag pro Bild der Website**
(168 Stück, nach Kategorie sortiert: Brand, Team, Anwendungsfelder, Case
Studies, Client Logos, Videos …).

**So tauscht man ein Bild:**
1. Eintrag öffnen (z. B. `pain-point-compliance-hero`).
2. Bei **Datei** das neue Bild hochladen.
3. Speichern. Fertig — die Website zeigt es sofort, **ohne neuen Build**.

**Feld leer lassen = das eingebaute Bild bleibt.** Es geht also nichts kaputt,
wenn ein Eintrag unbefüllt ist.

### Die Videos (euer letzter Schritt)

| Wo | Eintrag / Feld | Format |
|---|---|---|
| Kontaktseite, Reel links | „Bild austauschen" → **`contact-reel`** | Video 9:16 (Portrait) |
| Hero, Showcase, About, /websites | Single Type → Feld `video.youtubeId` | YouTube-ID (Textfeld) |

Solange bei `contact-reel` nichts liegt, zeigt die Kontaktseite weiterhin das
Standbild mit Play-Badge. Sobald ein Video hochgeladen ist, erscheint dort ein
echter Player mit dem Standbild als Vorschaubild.

Die vier anderen Video-Stellen sind YouTube-Einbettungen und nutzen aktuell
**alle dieselbe Video-ID** (`4TU1CdVskP8`) — inhaltlich ein Platzhalter-Zustand.
Eigene IDs lassen sich im CMS pro Sektion eintragen.

---

## 8. Inhalte aus dem Code ins CMS nachziehen

Nötig, wenn im Code **neue Felder** dazukommen (nicht bei reinen Textänderungen
im CMS). Ablauf:

```bash
# 1. im Website-Repo
node scripts/export-content.mjs           # → /tmp/newedge-content.json

# 2. im CMS-Repo
node scripts/gen-schemas.mjs /tmp/newedge-content.json

# 3. auf dem Server
SEED=1 docker compose up -d --build
```

**Zwei Dinge dazu, die man kennen muss:**

- **Der Reseed überschreibt redaktionelle Texte** im CMS mit dem Code-Stand.
  Wer im Admin Texte geändert hat, verliert sie. Vorher `deploy/backup.sh`.
- **Hochgeladene Bilder/Videos sind sicher.** Die „Bild austauschen"-Einträge
  werden nur angelegt, nie überschrieben — verifiziert: ein zweiter Seed-Lauf
  meldete „1 neu angelegt, 167 bestehende unverändert".

**Wichtig zur Reihenfolge:** Das CMS gewinnt gegenüber dem eingebauten Content.
Ein Feld, das im Code existiert, aber im CMS-Eintrag fehlt, ist zur Laufzeit
`undefined` — nicht der Code-Wert. Nach Code-Änderungen an der Content-Struktur
also immer Schritt 1–3 fahren, sonst fehlen neue Felder auf der Live-Seite.

---

## 9. Betrieb

Alle `docker compose`-Befehle aus `apps/cms/` — dort liegt der gemeinsame Stack.

| Aufgabe | Befehl |
|---|---|
| Backup (DB + Uploads + **Leads**) | `sudo ./apps/cms/deploy/backup.sh` |
| CMS aktualisieren | `git pull && sudo ./apps/cms/deploy/update.sh cms` |
| Lead-Service aktualisieren | `git pull && sudo ./apps/cms/deploy/update.sh lead` |
| Website neu bauen | `git pull && sudo ./apps/cms/deploy/update.sh website` |
| Alles auf einmal | `git pull && sudo ./apps/cms/deploy/update.sh all` |
| Status aller Container | `cd apps/cms && docker compose ps` |
| Kontaktanfragen einsehen | `cat apps/lead-api/data/contacts.jsonl \| jq .` |
| ROI-Leads einsehen | `cat apps/lead-api/data/leads.jsonl \| jq .` |
| Lead-Service-Logs | `cd apps/cms && docker compose logs -f lead-api` |

**Vor dem ersten öffentlichen Aufruf:** Das Passwort-Gate in `netlify.toml`
(Edge Function `auth` auf `/*`) betrifft nur Netlify. Beim Betrieb über nginx
greift es nicht — die Seite ist also ab Schritt 5 öffentlich erreichbar.
