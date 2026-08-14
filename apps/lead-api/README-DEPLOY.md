# Lead- & Report-Service — Betriebsanleitung (Deploy-Teil ÜBERHOLT)

> **Diese Datei ist zweigeteilt. Lies zuerst, welche Hälfte du vor dir hast.**
>
> | Teil | Status |
> |---|---|
> | Abschnitte **1–3** (Voraussetzungen, „Service auf den VPS bringen", HTTPS & Routing) | **ÜBERHOLT** — nicht ausführen |
> | Abschnitt **4** (Website verbinden) | gilt, aber `setup.sh` setzt `VITE_API_URL` selbst |
> | Abschnitte **4b, 4c, 5, Betrieb, Kontrakt zum Frontend** | **gültig und weiterhin die einzige Quelle** für Follow-ups, Abmeldung, Selbsttest und Lead-Ablage |
>
> **Deployt wird ausschließlich nach [`HANDOVER.md`](../../HANDOVER.md) in der
> Repo-Wurzel:** ein Kommando (`deploy.sh`), davor ein Trockenlauf, danach eine
> Abnahme (`verify.sh`). Der Lead-Service wird dabei als Container `lead-api` im
> gemeinsamen Stack mitgebaut — hier gibt es nichts separat zu deployen.
>
> **Gefahr im überholten Teil:** Abschnitt 3 beschreibt das Routing über
> **nginx**. Auf dem Zielserver (Hetzner CX23, `178.104.36.93`) hält aber
> **Caddy** die Ports 80/443 — dahinter liegt ein **produktives Mattermost**
> (`chat.newedgebrand.com`). Wer daraufhin nginx installiert oder konfiguriert,
> setzt einen Dienst neben Caddy, der beim nächsten Serverneustart um denselben
> Port rennt; verliert Caddy, ist Mattermost offline. Auf diesem Server also
> nie `apt install nginx`, nie `certbot --nginx`, nie `systemctl … nginx`.
>
> Der Rest der Datei — Follow-up-Warteschlange, Dateisperre, Abmeldung, DSGVO,
> Selbsttest, Backup-Hinweise — ist vom Webserver völlig unabhängig und bleibt
> unverändert gültig.

---

## Lead- & Report-Service (VPS, ohne n8n)

Ein kleiner FastAPI-Service, der **beide Formulare** der Website bedient:
ROI-Rechner (inkl. 6-seitigem PDF-Report via ReportLab, Lime/Ink-CI) und
Kontaktformular. Ein Service, ein SMTP-Zugang, ein Deploy.

**Der Service läuft nicht mehr allein.** Er ist ein Container im gemeinsamen
VPS-Stack: `apps/cms/docker-compose.yml`, Service **`lead-api`**, zusammen mit
Postgres und Strapi hinter demselben Webserver — auf dem Zielserver ist das
**Caddy**, nicht das im folgenden Kasten gezeichnete nginx. Eine Domain, ein
`docker compose`, ein Backup. Alle Betriebsbefehle unten laufen deshalb
**aus `apps/cms/`**.

```
                          ┌─ nginx (eine Domain, TLS) ─────────────────┐
Browser ── HTTPS ────────▶│ /                    → dist/ (Website)     │
                          │ /contact /roi-report → lead-api  :8090     │
                          │ /abmelden/<token>    → lead-api  :8090     │
                          │ /api /uploads /admin → strapi    :1337     │
                          └────────────────────────────────────────────┘
                                        │
                       docker compose (apps/cms/docker-compose.yml)
                          ┌─────────────┴──────────────┐
                          │ lead-api  (FastAPI, :8090) │  ← kein depends_on
                          │ strapi    (Node 22, :1337) │
                          │ postgres  16               │
                          └────────────────────────────┘

POST /roi-report ─┐
POST /contact  ───┴─▶ ├─ data/leads.jsonl        (ROI-Leads)
                      ├─ data/contacts.jsonl     (Kontaktanfragen)
                      ├─ data/reports/<id>.pdf   (Report-Archiv)
                      ├─ Strapi „Lead" (optional, Zweitablage)
                      ├─ Mail an Lead (PDF im Anhang / Bestätigung)
                      ├─ Benachrichtigung an NOTIFY_TO
                      └─ data/followups.jsonl    (optional: Nachfassen
                         ──Worker im selben Container──▶ Mail nach 3/5 Tagen)
```

**Der Lead-Service hängt bewusst an keinem anderen Container** — kein
`depends_on` auf Postgres oder Strapi. Fällt das CMS aus, nehmen die Formulare
weiter Leads an, schreiben sie in `data/*.jsonl` und mailen normal; nur die
optionale CMS-Zweitablage entfällt und wird geloggt. Umgekehrt gilt dasselbe.

Wichtig dabei: Beide Formulare melden nur bei **echtem** Erfolg Erfolg — ein
stiller Testmodus oder eine fehlgeschlagene Zustellung wird nicht als Erfolg
ausgegeben.

## 1. Voraussetzungen (einmalig)

- DNS: `newedgebrand.com` / `www.` → VPS-IP. **Keine eigene Subdomain mehr** —
  der Service liegt Same-Origin unter der Hauptdomain.
- VPS: Docker + Docker Compose ≥ 2.24 (`curl -fsSL https://get.docker.com | sh`)
- SMTP-Zugang: bei Google Workspace ein **App-Passwort** für das Postfach
  (Google-Konto → Sicherheit → 2FA → App-Passwörter). Limit ~500 Mails/Tag —
  für Leads mehr als genug. **Achtung:** `info@newedgebrand.com` ist nur ein
  Alias von `sebastian.p@newedgebrand.com` — App-Passwort und `SMTP_USER`
  gehören zum echten Konto, nur `MAIL_FROM` bleibt `info@` (Details in
  `.env.example`).

## 2. Service auf den VPS bringen — ÜBERHOLT

> **NICHT so aufrufen.** `setup.sh` ohne `--webserver=caddy` läuft im
> Default-Modus **nginx** und will nginx + certbot einrichten — auf einem
> Server, auf dem Caddy Port 80/443 für ein produktives Mattermost hält.
> Gültig ist stattdessen, aus der Repo-Wurzel:
> `sudo ./deploy.sh newedgebrand.com --dry-run`, dann
> `sudo ./deploy.sh newedgebrand.com admin@newedgebrand.com`.
> Beschreibung: [`HANDOVER.md`](../../HANDOVER.md), Abschnitt 2.

Es gibt nichts separat zu deployen: Der Service steckt im Monorepo und wird vom
gemeinsamen Setup mitgebaut. (Das gilt weiter — nur der Aufruf unten nicht.)

```bash
# ÜBERHOLT — Default-Modus ist nginx. NICHT ausführen:
# sudo ./apps/cms/deploy/setup.sh newedgebrand.com admin@newedgebrand.com
#
# Gültig (aus der Repo-Wurzel, siehe HANDOVER.md):
#   sudo ./deploy.sh newedgebrand.com admin@newedgebrand.com
```

Danach nur noch SMTP eintragen (setup.sh legt `.env` im Testmodus an):

```bash
$EDITOR apps/lead-api/.env      # SMTP_PASS=<App-Passwort>, SEND_DISABLED=0
cd apps/cms && docker compose up -d lead-api
curl http://127.0.0.1:8090/health          # → {"status":"ok","mail":true,...}
```

Updates später:

```bash
git pull
sudo ./apps/cms/deploy/update.sh lead      # nur den Lead-Service neu bauen
sudo ./apps/cms/deploy/update.sh all       # CMS + Lead-Service + Website
```

Von Hand geht natürlich auch alles direkt:

```bash
cd apps/cms
docker compose up -d --build lead-api      # bauen/starten
docker compose logs -f lead-api            # Logs
docker compose ps                          # Status inkl. Healthcheck
```

> **Zwei `.env`-Dateien, bewusst getrennt:** `apps/cms/.env` (CMS-Secrets) und
> `apps/lead-api/.env` (SMTP, Follow-ups). Die zweite ist im Compose als
> `required: false` eingebunden — fehlt sie, startet der Stack trotzdem, der
> Lead-Service läuft dann nur ohne Mailversand (`/health` zeigt `"mail": false`).
> So kann ein vergessenes Lead-`.env` nie das CMS am Hochfahren hindern.

### Standalone-Betrieb (Sonderfall)

`docker-compose.standalone.yml` in diesem Ordner startet den Service allein —
für lokales Ausprobieren ohne Postgres/Strapi oder für einen eigenen Host mit
eigener Subdomain (Reverse-Proxy dann via `Caddyfile.example`):

```bash
docker compose -f docker-compose.standalone.yml up -d --build
```

Nicht gleichzeitig mit dem gemeinsamen Stack betreiben: beide binden
`127.0.0.1:8090`, der zweite Start scheitert mit „port is already allocated" —
gewollt, denn zwei Prozesse auf demselben `data/` würden sich die Follow-up-
Warteschlange streitig machen.

## 3. HTTPS & Routing — ÜBERHOLT (beschreibt nginx)

> **Auf dem Zielserver läuft kein nginx, sondern Caddy vor einem produktiven
> Mattermost.** Die Konfiguration kommt heute aus
> `apps/cms/deploy/Caddyfile.newedge` und wird von
> `apps/cms/deploy/caddy-einbinden.sh` additiv eingehängt — mit Sicherung,
> Beweis und automatischem Rückbau. certbot wird nicht gebraucht: Caddy holt und
> erneuert die Zertifikate selbst.
>
> **Die Routing-Tabelle darunter gilt inhaltlich unverändert** — der
> Caddy-Site-Block bildet dieselben Pfade und Ziele ab. Nur „nginx" als Träger
> und alles, was man an nginx tippen würde, ist überholt.

Nichts Eigenes mehr: Der Service hängt in derselben Konfiguration wie Website und
CMS (früher `apps/cms/deploy/nginx.conf`, heute der Caddy-Site-Block), TLS
kommt für die Hauptdomain von Caddy. Geroutet wird ohne Präfix:

| Pfad | Ziel | Bemerkung |
|---|---|---|
| `/contact`, `/roi-report` | `lead-api:8090` | `client_max_body_size 1m` (nur JSON) |
| `/abmelden/<token>` | `lead-api:8090` | DSGVO-Abmeldeseite aus Follow-up-Mails |
| `/health` | `lead-api:8090` | **nur von 127.0.0.1** — verrät Betriebsinterna |
| `/api`, `/uploads`, `/admin`, …, `/_health` | `strapi:1337` | unverändert |
| alles andere | `dist/` | SPA-Fallback |

Warum keine Präfixe (`/lead/...`)? Es gibt schlicht keine Kollision:
Strapis Healthcheck heißt `/_health` (Unterstrich), der des Lead-Service
`/health`; die SPA-Routen sind deutsch (`/kontakt`, `/roi-rechner`). Und
`/abmelden/<token>` steht bereits in versendeten Mails — dieser Pfad darf sich
nicht mehr ändern. Ein Präfix hätte den Frontend-Kontrakt und die
Abmeldelinks gebrochen, ohne ein Problem zu lösen.

## 4. Website verbinden

Der Website-Build braucht **eine** Variable — die eigene Domain, weil alles
Same-Origin läuft (`apps/website/.env.production`, setzt setup.sh automatisch):

```
VITE_API_URL = https://newedgebrand.com
```

Daraus baut `apps/website/src/utils/apiConfig.ts` `…/contact` und
`…/roi-report`. Ohne die Variable laufen beide Formulare im Testmodus (zeigen
Erfolg, senden nichts) — lokal gilt dasselbe. Lokal echt testen: Container
starten und `VITE_API_URL=http://localhost:8081` setzen, der Vite-Dev-Proxy
reicht `/contact`, `/roi-report`, `/abmelden` und `/health` an `:8090` weiter.

---

> **AB HIER GILT ALLES.** Was folgt, ist die Betriebsanleitung des
> Lead-Service — Lead-Ablage im CMS, Follow-ups, Abmeldung, Selbsttest,
> Datensicherung, Frontend-Kontrakt. Sie ist unabhängig davon, ob vorne nginx
> oder Caddy steht, und steht nirgendwo sonst im Repo — `HANDOVER.md` nennt in
> Abschnitt 6 nur die zwei wichtigsten Fallen (`SEND_DISABLED`, Default-AUS der
> Follow-ups). Wer mehr braucht, ist hier richtig.

---

## 4b. Leads zusätzlich im CMS sichtbar machen (optional)

Damit das Team Leads ohne SSH sehen kann, schreibt der Service jeden Lead
**zusätzlich** in den Strapi-Collection-Type „Lead". Die `.jsonl`-Dateien
bleiben die Primärablage — das CMS ist reine Bequemlichkeit.

**API-Token in Strapi anlegen** (einmalig):

1. Strapi-Admin öffnen → **Einstellungen → API-Tokens → „Neuer API-Token"**
2. Name: `roi-report-service` · Gültigkeit: **Unbegrenzt** · Token-Typ: **Custom**
3. Unter *Lead* nur **`create`** anhaken — mehr braucht der Service nicht.
   (Kein `find`/`findOne`, kein Full-Access: der Token liegt auf dem VPS.)
4. Speichern. Der Token wird **genau einmal** angezeigt → sofort kopieren.

**In `apps/lead-api/.env` eintragen:**

```
STRAPI_URL=http://strapi:1337               # Container-Name im gemeinsamen Stack
STRAPI_TOKEN=<der kopierte Token>
# STRAPI_TIMEOUT=5                          # optional
```

`http://strapi:1337` statt der öffentlichen URL: Beide Container hängen im
selben Compose-Netz, der Aufruf geht direkt von Container zu Container — ohne
Umweg über nginx, ohne TLS-Handshake, und er funktioniert auch, wenn gerade das
Zertifikat oder der Reverse-Proxy klemmt. Ein `depends_on` entsteht dadurch
**nicht**: Ist Strapi weg, läuft der Call in den Timeout und wird geloggt, der
Lead ist längst in der Datei. (Standalone-Betrieb: dort stattdessen die
öffentliche Basis-URL eintragen, z. B. `https://newedgebrand.com`.)

Danach `cd apps/cms && docker compose up -d lead-api`. Kontrolle:
`curl -s http://127.0.0.1:8090/health` meldet `"cms": true`.

Wichtig — **Leads sind personenbezogene Daten**: Der Typ „Lead" bekommt in
Strapi **keine** Public-Rechte (Einstellungen → Users & Permissions → Roles →
Public: bei *Lead* nichts anhaken). Leads sind so ausschließlich im Admin und
über den Token sichtbar.

**Wenn Strapi weg ist, passiert nichts Schlimmes:** sind `STRAPI_URL`/
`STRAPI_TOKEN` nicht gesetzt, ist das CMS offline, der Token abgelaufen oder
antwortet Strapi mit einem Fehler, wird das nur ins Log geschrieben
(`[strapi] Lead <id> NICHT ins CMS übertragen … — liegt in data/leads.jsonl`).
Der Lead ist zu diesem Zeitpunkt bereits in der Datei, PDF und Mailversand
laufen normal weiter, das Frontend bekommt `{"success":true}`. Nachträglich
importieren geht jederzeit aus der `.jsonl`.

## 4c. Follow-ups (zeitversetztes Nachfassen) — Default AUS

Der Service kann nach der Sofort-Mail **eine** weitere Mail schicken:

| Formular | Abstand | Inhalt |
|---|---|---|
| ROI-Rechner | 3 Tage | „Fragen zum Report? 30 Minuten Gespräch." |
| Kontaktformular | 5 Tage | Erinnerung, falls die Anfrage noch offen ist |

Es bleibt bei genau einer Nachfass-Mail je Absendung — keine Sequenz, kein
Drip. Solange `FOLLOWUP_ENABLED=0` (Default) ist, wird **nichts eingeplant und
nichts verschickt**; der Service verhält sich exakt wie vorher.

### Wie es funktioniert (und warum so)

Ein **Hintergrund-Thread im Service** sieht alle 10 Minuten nach, was fällig
ist. Keine zusätzliche Infrastruktur: kein Redis, keine Queue, kein Celery,
kein externer Dienst, kein zweiter Container.

*Warum Thread und nicht Cron?* Auf einem VPS mit **einem** Container ist Cron
der aufwendigere Weg: Cron **im** Container bräuchte einen zweiten Dienst
(supervisord o. Ä.) und macht aus „ein Container, ein Prozess" ein
Prozess-Gespann mit eigenem Logging. Cron **auf dem Host** bräuchte
`docker exec`, eine eigene Fehlerbehandlung, wenn der Container gerade neu
startet, und einen zweiten Ort, an den man bei Updates denken muss. Der Thread
dagegen startet und stirbt mit dem Service, nutzt exakt denselben SMTP-Weg wie
der Sofortversand und kommt durch `restart: unless-stopped` automatisch mit
zurück. (Wer trotzdem Cron will: **`FOLLOWUP_WORKER=0` setzen** — dann plant
der Service weiterhin ein, versendet aber nicht selbst — und den Versand per
`docker compose exec lead-api python followups.py run-once --send` anstoßen.
Den Thread nur „stillzulegen", indem man `FOLLOWUP_INTERVAL_MINUTES` hoch
dreht, reicht **nicht**: er hält die Dateisperre über die ganze Laufzeit, der
Cron-Lauf käme nie zum Zug und täte stillschweigend nichts.)

**Neustart-fest und ohne Doppelmails.** Zwei Dateien im gemounteten `data/`:

```
data/followups.jsonl       Warteschlange   (append-only, eine Zeile = ein Follow-up)
data/followups.log.jsonl   Protokoll       (append-only, eine Zeile = ein Zustandswechsel)
data/suppressed.txt        Abgemeldete Adressen
data/followups.lock        Dateisperre: genau ein Durchlauf gleichzeitig
```

Die Dateisperre gilt für **jeden** Durchlauf, nicht nur für den Worker-Thread:
Ein `run-once --send`, das startet, während der Worker gerade arbeitet, macht
gar nichts und sagt das auch („Durchlauf übersprungen …"). Ohne diese Sperre
würden beide Läufe dieselbe Zeile beanspruchen und die Mail ginge doppelt raus
— der `claim` allein schützt nur gegen Abstürze, nicht gegen Parallelität.

Vor jedem Versand wird ein `claim` ins Protokoll geschrieben und **auf die
Platte gezwungen (`fsync`)**, erst danach geht die Mail raus. Stirbt der
Container mittendrin, steht beim nächsten Start der `claim` ohne Abschluss da —
der Eintrag wird als `orphaned` geschlossen und **nicht erneut verschickt**.
Bewusste Entscheidung: lieber ein verlorenes Follow-up als eine doppelte Mail.
Solche Fälle stehen im Log (`VERWAIST …`) und in `/health` unter
`followups.orphaned`, lassen sich also von Hand nachholen.

> ⚠️ **`SEND_DISABLED=1` ist kein Pause-Knopf für Follow-ups.** Im Trockenlauf
> wird ein fälliger Eintrag als `dry_run` **endgültig abgeschlossen** — er geht
> später *nicht* doch noch raus. Wer den Mailversand vorübergehend stoppen
> will, ohne die Warteschlange zu verbrennen, setzt `FOLLOWUP_WORKER=0`:
> dann bleibt alles liegen, bis der Worker wieder läuft.

Zwei weitere Schutzmechanismen:

- **Versandfenster** `FOLLOWUP_SEND_WINDOW=08:00-18:00` (Mo–Fr, `FOLLOWUP_TZ`).
  Außerhalb wird nur gewartet, nichts verworfen — keine Mail um 4 Uhr nachts.
- **Verfall**: Einträge, die mehr als `FOLLOWUP_MAX_OVERDUE_DAYS` (14) zu spät
  dran sind, werden verworfen. Nach zwei Wochen Ausfall geht so kein Schwall
  veralteter Post raus.

### Abmeldung (DSGVO)

Jede Follow-up-Mail trägt einen Abmeldehinweis — das ist Pflicht und nicht
abschaltbar:

- Abmeldelink `https://…/abmelden/<token>` (nur wenn
  `FOLLOWUP_UNSUBSCRIBE_BASE` gesetzt ist). Der Token steht im
  Warteschlangen-Eintrag, damit **keine E-Mail-Adresse in einer URL** landet.
  `GET` zeigt nur eine Bestätigungsseite (Mailscanner rufen Links automatisch
  auf — ein GET darf deshalb nichts ändern), erst `POST` trägt aus.
- `List-Unsubscribe`-Header, damit Gmail & Co. den „Abmelden"-Knopf anzeigen.
- Immer zusätzlich: Antwort mit „Abmelden" genügt.

Abgemeldete Adressen stehen in `data/suppressed.txt` und werden vor **jedem**
Follow-up geprüft (auch beim Einplanen). Von Hand eintragen geht auch:
`docker compose exec lead-api python followups.py unsubscribe max@muster.de`.
Die Sofort-Mails (Report, Empfangsbestätigung) sind davon nicht betroffen —
das sind angeforderte Transaktionsmails.

### Einschränkung beim Kontaktformular — ehrlich gesagt

`FOLLOWUP_CONTACT_ENABLED` ist ein **eigener** Schalter und ebenfalls Default
aus. Grund: Der Service kennt nur den Eingang der Anfrage, **nicht das
Postfach**. Er kann nicht wissen, ob jemand aus dem Team längst geantwortet
hat. Eingeschaltet bekommt also womöglich auch jemand eine Erinnerung, der
schon eine Antwort in der Hand hält. Zwei Konsequenzen daraus:

1. Der Mailtext ist so geschrieben, dass er in beiden Fällen passt
   („Diese Mail ist automatisch — wenn sich die Sache erledigt hat, ignorieren
   Sie sie bitte."). Genauer geht es ohne IMAP-Zugriff aufs Postfach nicht.
2. Wer sauber nachfassen will, macht es besser von Hand — oder wir bauen
   später einen IMAP-Abgleich („liegt eine Antwort an diese Adresse im
   Gesendet-Ordner?"). Bis dahin: bewusst einschalten oder aus lassen.

### Einschalten

```bash
# in apps/lead-api/.env
FOLLOWUP_ENABLED=1
FOLLOWUP_UNSUBSCRIBE_BASE=https://newedgebrand.com   # Hauptdomain, der Webserver routet /abmelden/
# FOLLOWUP_CONTACT_ENABLED=1     # nur wenn die Einschränkung oben akzeptiert ist

cd apps/cms && docker compose up -d lead-api
curl -s http://127.0.0.1:8090/health | jq .followups
# → {"enabled":true,"worker":true,"queued":0,...}
```

> `FOLLOWUP_UNSUBSCRIBE_BASE` ist die **Hauptdomain**, nicht mehr eine
> Subdomain: Der Webserver proxied `/abmelden/<token>` an den Lead-Service —
> auf diesem Server **Caddy** über `/etc/caddy/conf.d/newedge.caddyfile`
> (früher: eigener nginx-location-Block). Der Wert landet in jeder verschickten
> Mail — einmal gesetzt, bleibt er. Ändert er sich, sind alle bereits versandten
> Abmeldelinks tot. Gegenprobe nach jedem Umbau am Webserver:
> `curl -sI https://newedgebrand.com/abmelden/test | head -1` → **404 vom
> Service** ist richtig (Token unbekannt); ein **200 mit HTML der Website**
> heißt, der SPA-Fallback frisst den Pfad.

## 5. Testen

Alles unter der Hauptdomain (Same-Origin):

```bash
# ROI-Report
curl -X POST https://newedgebrand.com/roi-report \
  -H "Content-Type: application/json" --data @sample_roi_lead.json

# Kontaktformular
curl -X POST https://newedgebrand.com/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Person","email":"DEINE@adresse.de","company":"Test GmbH",
       "message":"Testnachricht ueber das Kontaktformular.","consent":true}'

# Health — nur vom Server selbst (der Webserver sperrt /health nach außen ab)
curl -s http://127.0.0.1:8090/health | jq .
```

Beide antworten `{"success":true,...}` und lösen echte Mails aus.
Testmodus ohne Mailversand: `SEND_DISABLED=1` in `apps/lead-api/.env`, dann
`cd apps/cms && docker compose up -d lead-api`.

### Follow-ups testen, ohne dass eine Mail rausgeht

Alle folgenden Befehle verschicken **nichts** — `followups.py` ohne `--send`
ist immer ein Trockenlauf.

```bash
# 1) Wie sehen die Mails aus? (rendert nur, kein Versand, kein SMTP nötig)
docker compose exec lead-api python followups.py preview roi
docker compose exec lead-api python followups.py preview contact

# 2) Testeintrag anlegen, der sofort fällig ist (geht auch bei FOLLOWUP_ENABLED=0)
docker compose exec lead-api python followups.py enqueue-test DEINE@adresse.de roi

# 3) Warteschlange + Status ansehen
docker compose exec lead-api python followups.py list

# 4) Fälliges abarbeiten — Trockenlauf: protokolliert "dry_run", sendet nichts
docker compose exec lead-api python followups.py run-once

# 5) Erneut laufen lassen → 0 Mails. Das ist der Idempotenz-Nachweis.
docker compose exec lead-api python followups.py run-once
```

Ganze Kette ohne Mailversand (Formular → Warteschlange → Worker):
`SEND_DISABLED=1` **und** `FOLLOWUP_ENABLED=1` setzen, dazu
`FOLLOWUP_ROI_DELAY_DAYS=0` (sofort fällig) und `FOLLOWUP_SEND_WINDOW=off`.
Dann ein Formular abschicken und `docker compose logs -f lead-api | grep followups`
beobachten: Der Worker meldet `DRY-RUN … | Kurz nachgefragt: …`. Es geht
keine einzige Mail raus, aber der komplette Weg ist durchlaufen.

Echten Versand an sich selbst prüfen: Schritt 2 mit der eigenen Adresse, dann
`run-once --send`.

**Selbsttest** — beweist genau die Zusagen von oben (kein Doppelversand nach
Absturz, Abmeldung, Verfall, Wiederholung mit Deckel). Verschickt nichts,
braucht keinen SMTP-Zugang und arbeitet in einem eigenen Temp-Verzeichnis,
fasst `data/` also nie an:

```bash
docker compose exec lead-api python test_followups.py
# → ALLE PRÜFUNGEN BESTANDEN
```

**Neustart-Verhalten prüfen** (der eigentliche Härtetest):

```bash
docker compose exec lead-api python followups.py enqueue-test DEINE@adresse.de roi
docker compose restart lead-api        # mitten in der Wartezeit
docker compose exec lead-api python followups.py list   # Eintrag ist noch da
```

Und andersherum: Sobald ein Eintrag `sent` (oder `dry_run`) im Protokoll hat,
bringt ihn kein Neustart und kein zweiter Lauf mehr zum Versand.

## Betrieb

Alle `docker compose`-Befehle aus **`apps/cms/`** — dort liegt der gemeinsame
Stack. Die Daten liegen weiterhin in **`apps/lead-api/data/`** (Bind-Mount auf
`/data` im Container), sind also ohne Docker-Umweg les- und sicherbar.

- ROI-Leads: `cat apps/lead-api/data/leads.jsonl | jq .`
- Kontaktanfragen: `cat apps/lead-api/data/contacts.jsonl | jq .`
- Im Browser (falls CMS verbunden): Strapi-Admin → Content Manager → **Lead**
- CMS-Übertragung prüfen: `docker compose logs -f lead-api | grep strapi`
- Reports liegen unter `apps/lead-api/data/reports/` (werden nicht automatisch gelöscht)
- Status: `docker compose ps` — die Spalte `STATUS` zeigt den Healthcheck
  (`healthy` = `/health` antwortet)
- Update: `git pull && sudo ./apps/cms/deploy/update.sh lead`
- **Backup:** `sudo ./apps/cms/deploy/backup.sh` sichert seit der
  Zusammenlegung auch `apps/lead-api/data/` (→ `leads-<datum>.tar.gz`).
  Das ist der wichtigste Teil: Die `.jsonl`-Dateien sind die **einzige**
  vollständige Kopie der Leads — das CMS ist nur Zweitablage.
- Eingebaute Absicherung: CORS-Whitelist, 5 Requests / 10 Min. je IP,
  E-Mail-Validierung, Honeypot, Pflicht-Einwilligung (`consent`) beim Kontakt.
  Das IP-Limit funktioniert nur, weil der Webserver `X-Forwarded-For` mitgibt
  (Caddy tut das in `Caddyfile.newedge`, nginx tat es in `nginx.conf`) — sonst
  sähe der Service alle Besucher als eine einzige IP.
- Follow-ups: `curl -s .../health | jq .followups` zeigt offen / fällig /
  gesendet / verwaist. Warteschlange im Detail:
  `docker compose exec lead-api python followups.py list`
- Follow-up-Log: `docker compose logs -f lead-api | grep followups`. Wichtig ist die
  Zeile `VERWAIST <id>` — dort ist während eines Absturzes unklar geblieben,
  ob die Mail rausging; solche Fälle bei Bedarf von Hand nachholen.
- Abmeldungen: `cat apps/lead-api/data/suppressed.txt` · von Hand eintragen mit
  `docker compose exec lead-api python followups.py unsubscribe <adresse>`

## Kontrakt zum Frontend

- **ROI:** `apps/website/src/pages/RoiRechner.tsx` (`submitLead`) sendet den
  vollen berechneten Stand — Kontrakt siehe `sample_roi_lead.json`. Alle Zahlen
  werden im Frontend gerechnet (eine Rechen-Wahrheit); der Service rechnet
  nichts nach.
- **Kontakt:** `apps/website/src/utils/contactFormValidation.ts`
  (`submitContactForm`) sendet name, email, phone, company, position, message,
  consent, sourcePage.
- Beide Endpoints leiten sich aus `VITE_API_URL` ab — siehe
  `apps/website/src/utils/apiConfig.ts`.

**Die Pfade sind Teil des Kontrakts und bleiben ohne Präfix.** Wer sie ändert,
muss vier Stellen gleichzeitig anfassen — `apiConfig.ts`, den Site-Block des
Webservers (`Caddyfile.newedge`, früher `nginx.conf`), den
Vite-Dev-Proxy in `vite.config.ts` und `FOLLOWUP_UNSUBSCRIBE_BASE` — und macht
zusätzlich alle Abmeldelinks in bereits versendeten Mails ungültig. Es gibt
keinen Grund dafür: Kollisionen mit Strapi oder der SPA existieren nicht
(siehe Abschnitt 3).

Eine Falle gibt es doch, und sie ist unsichtbar: Die Website ist eine PWA. Ihr
Service Worker liefert per `navigateFallback` für **jede** Navigation
`index.html` aus — er würde also auch `/abmelden/<token>` abfangen, obwohl
der Webserver völlig richtig konfiguriert ist. Deshalb steht in `vite.config.ts` eine
`navigateFallbackDenylist` mit allen Pfaden, die nicht der SPA gehören. Kommt
ein neuer Service-Pfad dazu, gehört er dort hinein — sonst funktioniert er für
alle Besucher, die die Seite schon einmal geladen haben, nicht.
