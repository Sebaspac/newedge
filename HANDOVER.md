# Übergabe — NEWEDGE auf den VPS

Stand: 29.07.2026 · Ziel: Website + CMS + Lead-Service auf dem eigenen Server.

Der Deploy ist ein Kommando. Von Hand bleiben genau zwei Dinge (Abschnitt 4).
Lies vorher Abschnitt 1 — es ist der einzige Absatz, bei dem ein Fehler fremden,
produktiven Betrieb trifft.

---

## 1. ⚠️ Auf dem Server läuft ein produktives Mattermost

| | |
|---|---|
| Server | Hetzner CX23, `178.104.36.93`, Ubuntu 24.04.3 LTS |
| Läuft dort | **Caddy** auf Port 80/443, davor **Mattermost** unter `chat.newedgebrand.com` — produktiv, mit Hermes-Agent |
| Frei | Ports 1337 (Strapi) und 8090 (Lead-Service), beide nur auf `127.0.0.1` |
| DNS | `newedgebrand.com` und `www` zeigen bereits auf diese IP; `chat` und MX unberührt |

**Nichts löschen, nichts stoppen, nichts neu starten.** Der gesamte Deploy fasst
am fremden Webserver nur an:

* eine **neue** Datei `/etc/caddy/conf.d/newedge.caddyfile`,
* höchstens **zwei Zeilen** am Ende von `/etc/caddy/Caddyfile` (nur, falls dort
  noch keine passende `import`-Zeile steht),
* `systemctl reload caddy` — **niemals** `restart` oder `stop`.

Bestehende Site-Blöcke, globale Optionen, import-Muster und der Zertifikats-
speicher `/var/lib/caddy` bleiben unangetastet. `Caddyfile.newedge` enthält
bewusst keine globalen Optionen und keine Snippets — beides gälte konfigurations-
weit und würde Mattermost mit verändern.

**Der eine Fall, der diesen Umzug wirklich umwerfen könnte:** Caddy nimmt
Änderungen zur Laufzeit über die Admin-API entgegen. Ist jemand diesen Weg
gegangen, ist `/etc/caddy/Caddyfile` **nicht** der laufende Stand — und ein
`reload` nähme Mattermost genau diese Änderung weg. `caddy-einbinden.sh` prüft
das in Phase **[P5]**: es vergleicht `caddy adapt` der Datei gegen
`curl :2019/config/` und **bricht vor jedem Schreibzugriff ab**, wenn beides
auseinanderläuft. Diesen Abbruch bitte nicht übergehen — danach ist er nicht
mehr reparierbar, nur noch aus `live-vorher.json` zurückladbar.

Läuft Caddy im Container statt als Systemdienst, bricht das Skript ebenfalls ab.
Dann ist der Einbau Handarbeit: `apps/cms/deploy/CADDY-KOEXISTENZ.md`, Abschnitt 6.

---

## 2. Deployen

Voraussetzung: **SSH mit sudo auf `178.104.36.93`.** (Über die Hetzner-Web-Konsole
ist das mühsam — sie legt unter die deutsche Tastatur ein US-Layout, `~`, `+`,
`_` und `>` kommen falsch an. `loadkeys de` hilft, falls `kbd` installiert ist.)

Das Repo ist öffentlich — der Klon braucht keine Anmeldung:

```bash
# 1 — Repo holen. Der Stand liegt auf main; es gibt keinen anderen Branch zu wählen.
sudo git clone https://github.com/Sebaspac/newedge.git /opt/newedge
cd /opt/newedge
```

```bash
# 2 — Trockenlauf. Verändert nichts, prüft nur.
sudo ./deploy.sh newedgebrand.com --dry-run
```

```bash
# 3 — Echtlauf
sudo ./deploy.sh newedgebrand.com admin@newedgebrand.com
```

Das ist alles. `deploy.sh` schreibt selbst nichts am System; es prüft rein lesend
die Voraussetzungen und ruft dann der Reihe nach:

1. `apps/cms/deploy/setup.sh <domain> --webserver=caddy` — Pakete, Docker, Node,
   Secrets, `.env`-Dateien, Docker-Stack (Postgres + Strapi + Lead-Service),
   Content-Seed beim Erststart, Website-Build, Ausrollen nach `/var/www/newedgebrand/dist`
2. `apps/cms/deploy/caddy-einbinden.sh <domain>` — Site-Block additiv einhängen,
   mit Sicherung, Beweis und automatischem Rückbau
3. `./verify.sh <domain>` — 35 Prüfpunkte Abnahme, rein lesend

Exit-Code 0 = kein Blocker offen. Dauer 10–20 Minuten, das meiste sind die beiden
Builds (Strapi-Admin und Vite).

| Schalter | Wirkung |
|---|---|
| `--dry-run` | Nichts verändern (siehe Abschnitt 3) |
| `--ohne-caddy` | Schritt 2 auslassen. Stack und Website werden trotzdem gebaut und ausgerollt, der Webserver bleibt komplett unberührt. |
| `--nur-pruefen` | Nur `verify.sh`. Für die Abnahme nach jeder Korrektur. |

Die TLS-Adresse wird an `setup.sh` durchgereicht, bleibt im Caddy-Betrieb aber
ohne Wirkung — Caddy holt seine Zertifikate selbst.

Ein erneuter Aufruf von `./deploy.sh` ist gefahrlos: keine neuen Secrets, kein
erneuter Seed, vorhandene `.env`-Dateien werden nie überschrieben.

**Der wahrscheinlichste Abbruch: Arbeitsspeicher.** Auf der CX23 laufen bereits
Mattermost und der Hermes-Agent; dazu kommen nacheinander der Strapi-Admin-Build
(~2 GB) und der Vite-Build (1–2 GB). Reicht es nicht, killt der OOM-Killer den
Build kommentarlos — sichtbar als Strapi-Healthcheck-Timeout nach 300 s oder als
abgebrochener `npm run build`. `deploy.sh` warnt vorab unterhalb von 2,5 GB
RAM+Swap. Wer die Warnung sieht, legt **vor** dem Echtlauf Swap an:

```bash
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile
sudo swapon /swapfile && echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

Danach `./deploy.sh` einfach erneut aufrufen — siehe oben, das ist gefahrlos.
Woran man einen OOM-Abbruch im Nachhinein erkennt:
`dmesg | tail -30 | grep -i -e oom -e 'killed process'`.

---

## 3. Ehrlich: diese Skripte sind auf keinem Server gelaufen

`deploy.sh`, `caddy-einbinden.sh` und `verify.sh` sind neu. Geprüft wurden sie
mit `bash -n`, mit Einzeltests ihrer Kernlogik und mit Simulationsläufen gegen
nachgebaute Kommandos. Es gab hier weder Docker noch Caddy noch Ubuntu:
**kein Lauf gegen einen echten Server, kein Lauf gegen echtes Caddy.** Rechne mit
Reibung — nicht mit einem Knopf, der garantiert durchläuft.

Was der Trockenlauf leistet: `deploy.sh --dry-run` durchläuft alle Vorab-Prüfungen
(root, Ubuntu/Debian, Werkzeuge, `openssl`, `jq`, `docker compose` ≥ 2.24,
Plattenplatz, `NODE_ENV`, `COMPOSE_PROJECT_NAME`, Vollständigkeit des Klons,
aktiver `caddy.service`). `setup.sh` kennt kein `--dry-run` und wird deshalb gar
nicht gestartet, nur angekündigt. `caddy-einbinden.sh` dagegen **läuft** mit
`--dry-run` und macht seine komplette Prüfphase — inklusive der Frage aus
Abschnitt 1. Fehlende Pakete werden mit der passenden `apt-get`-Zeile gemeldet.

**Diese Reihenfolge zuerst laufen lassen:**

```bash
sudo ./deploy.sh newedgebrand.com --dry-run
```
Auf dem noch leeren Server endet das mit einem Abbruch in Schritt 2, bei `[P7]`:
`/var/www/newedgebrand/dist/index.html` fehlt, weil noch nichts ausgerollt ist.
**Das ist erwartet.** Entscheidend ist, was davor steht — `[P1]` bis `[P6]` müssen
grün sein, dort hängt der Mattermost-Beweis.

```bash
sudo ./deploy.sh newedgebrand.com --ohne-caddy
```
Baut Stack und Website. Der Webserver wird nicht angefasst, von außen ist noch
nichts erreichbar — Mattermost kann in diesem Schritt nicht betroffen sein.

```bash
sudo bash apps/cms/deploy/caddy-einbinden.sh newedgebrand.com --dry-run
```
Jetzt läuft die Prüfphase vollständig durch (`[P1]`–`[P9]`) und endet mit
`PROBELAUF BESTANDEN` plus einer Liste dessen, was der Echtlauf täte. Erst wenn
das steht:

```bash
sudo ./deploy.sh newedgebrand.com admin@newedgebrand.com
```

Wer es eilig hat, kann direkt den Ablauf aus Abschnitt 2 nehmen — der Caddy-Schritt
sichert vorher und rollt bei jeder Abweichung selbst zurück. Der Umweg kostet ein
paar Minuten und nimmt dem einzigen riskanten Schritt die Überraschung.

---

## 4. Die zwei Handgriffe, die kein Skript übernehmen kann

### 4.1 Strapi-Admin-Konto anlegen

Strapi lässt das erste Konto ausschließlich über die Weboberfläche anlegen.

1. `https://newedgebrand.com/admin` aufrufen
2. Formular ausfüllen: Vorname, Nachname, E-Mail, Passwort
3. Absenden — danach ist man im Content-Manager

Gegenprobe vorher und nachher:

```bash
curl -s https://newedgebrand.com/admin/init     # vorher "hasAdmin":false, nachher true
```

Das Passwort gehört in den Passwortmanager: Es ist der einzige Zugang zur
Redaktion, und der Weg zurück führt über den Container.

### 4.2 SMTP-App-Passwort eintragen

**Ohne diesen Schritt läuft der Lead-Service im Testmodus** — `setup.sh` setzt
beim Erststart bewusst `SEND_DISABLED=1`. Die Formulare antworten dann mit
HTTP 200 und `"success":true`, der Lead wird gespeichert, das PDF erzeugt — und
es geht **keine Mail** raus, weder an den Interessenten noch an das Team. Von
außen sieht das aus wie Normalbetrieb.

**`info@newedgebrand.com` ist nur ein Alias** des Kontos
`sebastian.p@newedgebrand.com` — ein Alias hat kein eigenes Google-Konto, keine
eigenen App-Passwörter und keine eigene SMTP-Anmeldung. Beides läuft deshalb
über das echte Konto; nur der Absender der Mails bleibt `info@`.

App-Passwort besorgen: Google-Konto von **`sebastian.p@newedgebrand.com`** →
**Sicherheit** → **Bestätigung in zwei Schritten** (muss aktiv sein) →
**App-Passwörter** → Name z. B. `newedge lead-api` → 16 Zeichen, werden genau
einmal angezeigt. Das kann nur der Kontoinhaber — das Passwort kommt also vom
Auftraggeber, nicht aus diesem Repo.

```bash
sudo nano /opt/newedge/apps/lead-api/.env
#   SMTP_USER=sebastian.p@newedgebrand.com   ← das echte Konto, NICHT info@
#   SMTP_PASS=<die 16 Zeichen>
#   MAIL_FROM=NEWEDGE <info@newedgebrand.com>
#   SEND_DISABLED=0

cd /opt/newedge/apps/cms && sudo docker compose up -d lead-api
```

Falls ankommende Mails als Absender `sebastian.p@` statt `info@` zeigen:
Gmail schreibt den Absender um, wenn der Alias nicht unter **Einstellungen →
Konten → „Senden als"** eingetragen ist — dort einmalig ergänzen.

**`up -d`, nicht `restart`.** `restart` startet nur den Prozess im bestehenden
Container und liest `env_file` nicht neu — die Änderung bliebe wirkungslos und man
sucht an der falschen Stelle.

Kontrolle in zwei Stufen:

```bash
curl -s http://127.0.0.1:8090/health            # "mail":true

curl -s -X POST https://newedgebrand.com/contact -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"<eigene echte Adresse>","consent":true,
       "message":"Testnachricht ueber das Kontaktformular."}'
```

Die Antwortform ist der Beweis: **200 ohne** Feld `mail` = der Relay hat die
Nachricht angenommen · **200 mit** `"mail":"disabled"` = weiterhin Testmodus ·
**502 `mail_failed`** = SMTP hat abgelehnt (falsches App-Passwort, 2FA aus).
Ob die Mail auch zugestellt wird (SPF/DKIM, Spam-Ordner), kann kein Skript
beweisen — einmal ins Postfach von `NOTIFY_TO` sehen.

**Der vollständige Beweis** — prüft beide Formulare, also auch den ROI-Rechner
samt PDF-Erzeugung, nicht nur `/contact`:

```bash
sudo ./verify.sh newedgebrand.com --mit-formularen
```

Standardmäßig lässt `verify.sh` die Formulare aus, weil diese Tests **echte
Leads anlegen** (in `contacts.jsonl` bzw. `leads.jsonl`) — der Schalter macht
das ausdrücklich. Die Testeinträge sind an der Testadresse erkennbar und
sollten danach aus den `.jsonl`-Dateien entfernt werden. Ohne diesen Lauf gilt:
`"mail":true` im Health-Check beweist nur die Konfiguration, nicht den Versand.

Das Rate-Limit liegt bei 5 Anfragen je IP je 10 Minuten, **gemeinsam** für
`/contact` und `/roi-report`. `429 rate_limited` ist kein Fehler, nur Geduld.

### Zwei weitere, die `deploy.sh` am Ende ausgibt

**Leads zusätzlich im CMS sichtbar machen** (optional; ohne Token liegen sie in
`apps/lead-api/data/leads.jsonl` bzw. `contacts.jsonl` — verloren geht nichts):
Admin → **Settings** → **API Tokens** → *Create new API Token*, Typ **Custom**,
Rechte ausschließlich **Lead → create**. Token in `apps/lead-api/.env` als
`STRAPI_TOKEN`, dazu `STRAPI_URL=http://strapi:1337`, dann wieder
`docker compose up -d lead-api`. Kontrolle: `/health` meldet `"cms":true`.

**Backup-Zeitplan** — ohne diese Zeile wird nie eines erstellt:

```bash
echo '0 3 * * * root /opt/newedge/apps/cms/deploy/backup.sh >/var/log/newedge-backup.log 2>&1' \
  | sudo tee /etc/cron.d/newedge-backup
```

Danach die Abnahme wiederholen: `sudo ./deploy.sh newedgebrand.com --nur-pruefen`

---

## 5. Wenn etwas schiefgeht

**Wer sichert was:**

| Skript | Sicherung | Ablage |
|---|---|---|
| `caddy-einbinden.sh` | `Caddyfile.orig` + Prüfsumme, `live-vorher.json` (laufende Konfiguration), `adapt-vorher.json`, Fingerabdruck der fremden Hosts vorher/nachher, Caddy-Journal, `rollback.sh` | `/root/newedge-caddy-<zeitstempel>/` (Probelauf: `/tmp/newedge-caddy-probelauf-…`) |
| `deploy.sh` | ruft vor einem **Wiederholungs**lauf `backup.sh` | `/opt/newedge/backups/` — DB-Dump, Uploads, Lead-Dateien, 14 Stände |
| `setup.sh` | überschreibt vorhandene `.env`-Dateien nie; Secrets bleiben gültig | `apps/cms/.env`, `apps/lead-api/.env` |
| `verify.sh` | keine — rein lesend | — |

**Mattermost antwortet nicht mehr.** Nicht vorwärts reparieren, zurückgehen:

```bash
sudo /root/newedge-caddy-<zeitstempel>/rollback.sh
```

Das nimmt den Dateistand zurück, validiert, lädt neu und prüft erneut. Hat
inzwischen jemand anders an der `Caddyfile` gearbeitet, entfernt es chirurgisch
nur die beiden eigenen Markerzeilen statt das Backup einzuspielen. Trägt das
nicht — weil der laufende Stand nie aus der Datei kam —, bleibt der Notfallweg:

```bash
python3 /root/newedge-caddy-<zeitstempel>/helfer.py senden \
  http://127.0.0.1:2019/load /root/newedge-caddy-<zeitstempel>/live-vorher.json
```

Der lädt den exakten Vorher-Zustand in den **laufenden** Prozess, ohne Neustart.
`systemctl restart caddy` bleibt verboten: Es repariert nichts, was der Rückbau
nicht besser repariert, und kostet Mattermost ein Ausfallfenster.

Der Caddy-Schritt rollt bei einer Abweichung **selbst** zurück: gewechselte PID
(also Neustart statt Reload), veränderte fremde Route, abweichende Statuszeile,
abweichendes Zertifikatsdatum oder `/api/v4/system/ping` ohne `status OK`.
Antwortet nur die **eigene** Domain noch nicht, wird 12 × 5 s gewartet und dann
berichtet — kein Rollback, denn Caddy holt das Zertifikat asynchron und
Mattermost ist in diesem Fall nachweislich unberührt.

**Protokolle:**

```bash
cd /opt/newedge/apps/cms
docker compose ps                          # alle drei: Up (healthy)
docker compose logs --tail=80 strapi
docker compose logs --tail=80 lead-api
journalctl -u caddy -n 80 --no-pager
```

**Abnahme wiederholen:** `sudo ./deploy.sh newedgebrand.com --nur-pruefen`.
Exit-Code 0 = kein Blocker · 1 = Blocker gefallen · 2 = eine blockierende Prüfung
war nicht durchführbar, das Ergebnis ist also unvollständig, **nicht** bestanden.

**Der häufigste Befund nach dem ersten Lauf:** `/api/...` antwortet 403. Dann ist
der Content-Seed nie durchgelaufen — die öffentlichen Leserechte werden
ausschließlich dabei vergeben. Die Website läuft dann still auf ihrem eingebauten
Inhalt weiter und sieht identisch aus. Reparatur:

```bash
sudo /opt/newedge/apps/cms/deploy/update.sh reseed
```

Das überschreibt redaktionelle Änderungen mit dem Code-Stand, legt vorher selbst
ein Backup an und fragt zur Sicherheit nach.

**Ein Backup zurückspielen.** `backup.sh` schreibt drei Archive nach
`/opt/newedge/backups/`: `db-<stempel>.sql.gz` (Postgres-Dump),
`uploads-<stempel>.tar.gz` (CMS-Mediendateien) und `leads-<stempel>.tar.gz`
(die `.jsonl`-Primärablage des Lead-Service). Der Rückweg, abgeleitet aus dem
Skript — zuerst den aktuellen Stand sichern, auch wenn er kaputt ist, denn ein
Restore, der schiefgeht, ist sonst endgültig:

```bash
sudo /opt/newedge/apps/cms/deploy/backup.sh   # Ist-Zustand wegsichern
cd /opt/newedge/apps/cms

# 1) Strapi anhalten — während des Einspielens darf niemand schreiben
sudo docker compose stop strapi

# 2) Datenbank neu aufbauen und Dump einspielen
#    (Name und Benutzer sind "strapi", sofern .env nichts anderes setzt)
sudo docker compose exec -T postgres psql -U strapi -d postgres \
  -c 'DROP DATABASE strapi;' -c 'CREATE DATABASE strapi OWNER strapi;'
gunzip -c /opt/newedge/backups/db-<stempel>.sql.gz \
  | sudo docker compose exec -T postgres psql -q -U strapi -d strapi

# 3) Uploads ins Volume zurück (entpackt über den Bestand; Dateien, die erst
#    nach dem Backup dazukamen, bleiben liegen)
sudo docker run --rm -v cms_uploads:/u -v /opt/newedge/backups:/out alpine \
  tar xzf "/out/uploads-<stempel>.tar.gz" -C /u

# 4) Strapi wieder starten, dann Abnahme
sudo docker compose start strapi
sudo /opt/newedge/deploy.sh newedgebrand.com --nur-pruefen
```

Die Lead-Dateien nur bei tatsächlichem Datenverlust zurückspielen:

```bash
sudo tar xzf /opt/newedge/backups/leads-<stempel>.tar.gz \
  -C /opt/newedge/apps/lead-api/data
```

Vorsicht dabei: das Archiv enthält auch die **Follow-up-Warteschlange**. Ein
alter Stand kann bereits abgearbeitete Einträge wiederbeleben — nach dem
Einspielen die Warteschlange prüfen, bevor `FOLLOWUP_ENABLED` angeschaltet wird.

---

## 6. Bekannte Eigenheiten

Jede hier einzeln gegen den heutigen Code geprüft.

**`SEND_DISABLED=1` ist kein Pause-Knopf für Follow-ups.** `followups.py` Z. 111:
`DRY_RUN = FOLLOWUP_DRY_RUN oder SEND_DISABLED`. Fällige Einträge werden dabei als
`dry_run` abgehakt — und `dry_run` ist ein Endzustand, sie gehen nie mehr raus.
Zum Pausieren `FOLLOWUP_WORKER=0`.

**Follow-ups sind per Default aus** (`FOLLOWUP_ENABLED=0`, das Kontaktformular
zusätzlich `FOLLOWUP_CONTACT_ENABLED=0`). Erst einschalten, wenn die Texte gelesen
sind — sie gehen an echte Interessenten. Der Dienst sieht nur den Eingang der
Anfrage, nicht das Postfach: Er kann nicht wissen, ob jemand aus dem Team längst
geantwortet hat.

**Das CMS gewinnt gegenüber dem eingebauten Inhalt,** sobald es antwortet
(`useCms.ts`: der Fallback greift nur, solange nichts geladen ist). Ein veralteter
Seed überschreibt also neuere Texte aus dem Code. Umgekehrt gilt: Fällt das CMS
aus oder fehlt `VITE_STRAPI_URL` beim Build, zeigt die Seite still den eingebauten
Stand — und weil Seed und Fallback aus derselben Quelle erzeugt werden, sieht das
**identisch** aus. Genau deshalb prüft `verify.sh`, ob die CMS-Adresse überhaupt
im ausgelieferten Bundle steht. Nach Content-Änderungen im Code neu erzeugen:
`apps/website/scripts/export-content.mjs` → `apps/cms/scripts/gen-schemas.mjs` →
`SEED=1` bzw. `update.sh reseed`.

**Bilder und Videos werden nicht im Code getauscht,** sondern über die
CMS-Sammlung **„Bild austauschen"**: ein Eintrag je Bild, Datei hochladen, fertig
— kein Deploy. Das Feld akzeptiert Bilder **und** Videos; dort kommen auch die
noch fehlenden Clips rein. Ein Reseed überschreibt hochgeladene Dateien nicht
(`createIfMissing`).
Offene Einschränkung: Es gibt 168 Einträge, `apps/cms/config/api.ts` deckelt aber
jede Sammlung auf `maxLimit: 100`, während der Hook `pageSize=500` anfragt. Die
letzten 68 Einträge greifen im Frontend nicht. `verify.sh` meldet das als Warnung,
nicht als Deploy-Fehler.

**`testimonials` und `jobs` liefern 403,** bis einmal mit `SEED=1` geseedet wurde
— die öffentlichen Leserechte werden nur dabei vergeben, unabhängig davon, ob die
Redaktion die Einträge selbst angelegt hat.

**246 der 304 Felder in den Single Types sind vom Typ `json`** (81 %) — im Admin
also rohe JSON-Editoren statt Eingabemasken. Folge der automatischen
Schema-Generierung. Von Hand verfeinerte Schemas überschreibt `gen-schemas.mjs`
wieder.

**Der Compose-Projektname ist `cms`** (Ordnername), die Volumes heißen
`cms_pgdata` und `cms_uploads`. Ein gesetztes `COMPOSE_PROJECT_NAME` verschiebt
beide — `deploy.sh` bricht deshalb ab, wenn die Variable abweicht.

**Der Typ `Lead` hat bewusst kein Public-Read.** `https://<domain>/api/leads` muss
403 liefern; ein 200 wäre ein Datenschutzvorfall. `verify.sh` prüft das als
Blocker. `/health` ist von außen ebenfalls absichtlich gesperrt (403) — Prüfungen
des Lead-Service laufen auf dem Server gegen `127.0.0.1:8090`.

---

## 7. Erst danach

* **Cookiebot-Scan auslösen — geht erst, wenn die Seite live ist.** Das
  Cookiebot-Tag ist eingebaut (`apps/website/index.html`, CBID
  `196aa51d-737c-49f4-abdb-fee88db82562`), die Domaingruppe im Cookiebot-Konto
  steht auf `newedgebrand.com`. Cookiebot schaltet eine Domain aber erst frei,
  **nachdem sein Scanner sie erreichen konnte** — und `newedgebrand.com` liefert
  bis zu diesem Deploy noch keine Seite. Deshalb antwortet `configuration.js`
  derzeit mit **404**, und es erscheint kein Banner. Das ist der erwartete
  Zwischenzustand, kein Fehler: **Reihenfolge ist Deploy → dann Cookiebot-Scan.**
  Nach dem Deploy in der Cookiebot-Konsole den Scan der Domaingruppe starten.
  Gegenprobe, muss danach **200** liefern statt 404:
  ```bash
  curl -so /dev/null -w '%{http_code}\n' https://consentcdn.cookiebot.com/consentconfig/196aa51d-737c-49f4-abdb-fee88db82562/newedgebrand.com/configuration.js
  ```
  Solange das 404 bleibt, laden GTM und GA4 **gar nicht** —
  der datenschutzrechtlich sichere Zustand, aber eben auch ohne Messdaten.
  Zwei Konto-Einstellungen beim Scan gleich mitnehmen: Die Widget-Sprache steht
  auf **Englisch** (`cultures: ["en"]`) — für die deutsche Seite auf `de`
  stellen. Und die Akzentfarbe ist Cookiebot-Blau `#1032CF` statt Lime `#CCFF00`.
* **Datenschutzerklärung prüfen.** Abschnitt 12 („Cookie-Consent &
  Tracking-Opt-in", im `impressum`-Content DE/EN) beschreibt noch den alten
  eigenen Banner und nennt Meta Pixel/GTM/Google Analytics — bei der
  Cookiebot-Einführung juristisch aktualisieren.
* **Netlify** (`newedgebrand.netlify.app`) läuft als Staging weiter. Nicht
  abschalten, bis der VPS stabil ist. Passwort-Gate seit 30.07.2026
  **abgeschaltet** — die Seite ist ohne Login erreichbar, aber über
  `X-Robots-Tag: noindex, nofollow` in `netlify.toml` von Suchmaschinen
  ausgenommen. Der Header gilt **nur** für Netlify; `newedgebrand.com` auf dem
  VPS bleibt normal indexierbar. Zusätzlich zeigt jede Seite ein Canonical auf
  `https://newedgebrand.com`.
  **Beim Abschalten:** den `[[headers]]`-Block stehen lassen, De-Indexierung in
  der Search Console anstoßen — und **erst danach** die Netlify-Site löschen.
  Wer direkt löscht, hinterlässt indexierte URLs, die ins Leere laufen.
  Passwort-Gate wieder an: die drei auskommentierten `[[edge_functions]]`-Zeilen
  in `netlify.toml` aktivieren (`auth.ts` liegt weiter im Repo).
* **`apps/website/public/sitemap.xml`** ist unvollständig: 13 URLs, es fehlen
  `/cortex`, `/websites`, `/roi-rechner` und alle `/en/*`.
