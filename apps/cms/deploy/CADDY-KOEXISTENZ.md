# NEWEDGE neben einem laufenden Caddy (Mattermost) einhängen

Anleitung für den Fall, dass auf dem Zielserver **schon ein Caddy läuft** und
dort ein **produktives Mattermost** bedient. Ziel: `newedgebrand.com` kommt
zusätzlich dazu — additiv, ohne die bestehende Konfiguration anzufassen.

> **Der nginx-Standardweg (`deploy/nginx.conf` + certbot) ist auf diesem Server
> unbrauchbar.** nginx könnte Port 80/443 gar nicht mehr binden, und certbot
> würde Zertifikate für eine Domain ausstellen wollen, die Caddy selbst
> verwaltet. `deploy/setup.sh` kennt das: sein Default-Modus `--webserver=nginx`
> **bricht ab**, sobald ein fremder Webserver auf 80/443 lauscht — vor dem
> ersten Schreibzugriff. Für diesen Server ist `--webserver=caddy` der richtige
> Aufruf (Abschnitt 9); Webserver und Zertifikate bleiben dabei unangetastet.

---

## Ausgangslage

Von außen verifiziert, **ohne SSH-Zugang**:

| Beobachtung | Bedeutung |
|---|---|
| Port 22, 80, 443 offen | SSH + ein Webserver auf 80/443 |
| Port 1337, 8090, 3000 zu | Strapi und Lead-Service laufen noch nicht — die Ports sind frei |
| Auf 80/443 antwortet Caddy | Caddy hält die Ports, nginx könnte sie nicht binden |
| Dahinter: produktives Mattermost | Darf unter keinen Umständen ausfallen |
| TLS-Handshake für `newedgebrand.com` schlägt fehl | Caddy kennt die Domain noch nicht, hat also kein Zertifikat |

Alles Weitere in diesem Dokument ist **von außen nicht prüfbar** und muss auf
dem Server nachgesehen werden. Deshalb steht jeder Schritt hier als *prüfen →
entscheiden → tun*, nicht als Skript.

### Reihenfolge

Die Abschnitte stehen nach Thema, nicht nach Ablauf. Abgearbeitet wird so:

| # | Was | Abschnitt |
|---|---|---|
| 1 | Feststellen, wie Caddy läuft, und die Konfiguration sichern | 1 – 3 |
| 2 | DNS-A-Record auf die Server-IP setzen | 9 |
| 3 | **Stack + Website ausrollen** (`setup.sh --webserver=caddy`) | 9 |
| 4 | Erst dann den Site-Block einhängen und laden | 4 – 5 |
| 5 | Abnahme — zuerst Mattermost, dann wir | 10 |

**Schritt 3 vor Schritt 4**, sonst holt Caddy zwar brav ein Zertifikat, liefert
aber für alles außer der Startseite 502: Strapi (`:1337`) und Lead-Service
(`:8090`) laufen zu diesem Zeitpunkt noch nicht.

---

## Die Sicherheitsnetze, auf die wir uns verlassen

Zwei Eigenschaften von Caddy machen diesen Umbau vergleichsweise harmlos —
solange man sie auch nutzt:

1. **`caddy validate` prüft, ohne zu laden.** Eine kaputte Datei kommt nie in
   den laufenden Prozess.
2. **`reload` ist atomar und behält bei Fehlern die alte Konfiguration.** Caddy
   startet die neue Konfiguration erst, wenn sie vollständig geladen ist; scheitert
   sie, läuft die alte einfach weiter. **Es gibt keine Lücke, in der Mattermost
   offline ist** — vorausgesetzt, man macht `reload` und nicht `restart`.

Beides fällt weg, sobald jemand `caddy stop`, `systemctl restart caddy` oder ein
Überschreiben der bestehenden Datei benutzt. Deshalb Abschnitt 7 lesen.

---

## 1. Vorher: feststellen, WIE Caddy läuft

Das entscheidet über alles Weitere.

```bash
systemctl status caddy --no-pager        # Fall A/B: Caddy als Systemdienst
docker ps --format '{{.Names}}\t{{.Image}}\t{{.Ports}}'   # Fall C: Caddy im Container
docker ps --filter publish=80 --filter publish=443        # …und zwar gezielt
ss -tlnp '( sport = :80 or sport = :443 )'                # wer hält die Ports wirklich?
caddy version
```

| Befund | Weiterlesen bei |
|---|---|
| `caddy.service` aktiv, Konfiguration unter `/etc/caddy/Caddyfile` | Abschnitt 2 |
| Caddy läuft als Docker-Container | **Abschnitt 6 — hier NICHT weitermachen** |
| `ss` zeigt auf 80/443 **nichts**, `docker ps --filter publish` aber schon | ebenfalls **Abschnitt 6** — siehe Kasten |

**Warum das so wichtig ist:** Ein Caddy im Container erreicht weder
`127.0.0.1:1337` (das ist dort der Container selbst, nicht der Host) noch
`/var/www/newedgebrand/dist` (nicht gemountet). Der Site-Block würde adaptieren,
validieren — und dann 502 liefern.

> ⚠️ **`ss` allein reicht als Beweis nicht.** Wie ein Container-Port auf dem Host
> sichtbar wird, hängt an `userland-proxy` in `/etc/docker/daemon.json`:
>
> | Einstellung | Was `ss -tlnp` auf 80/443 zeigt |
> |---|---|
> | `true` (Voreinstellung) | `docker-proxy` — der Port sieht belegt aus |
> | `false` | **gar nichts** — veröffentlicht wird rein per DNAT in iptables/nftables |
>
> Im zweiten Fall meldet `ss` „frei", obwohl hinter Port 443 ein produktives
> Mattermost hängt. Deshalb **immer beide Befehle** ausführen und `docker ps`
> als gleichwertige Quelle behandeln. `setup.sh` macht es seit dieser Prüfung
> genauso: ein Container auf 80/443 ist dort im Modus `nginx` ein eigener,
> von `ss` unabhängiger Abbruchgrund.
>
> Läuft Caddy im Container mit `network_mode: host`, ist es umgekehrt: `ss`
> zeigt „caddy", `docker ps --filter publish` findet nichts (Host-Netz kennt
> keine veröffentlichten Ports). Auch dann gilt Abschnitt 6.

---

## 2. Bestandsaufnahme und Sicherung

**Nichts hiervon verändert etwas.** Trotzdem der wichtigste Abschnitt.

```bash
# a) Welche Datei ist die maßgebliche?
systemctl cat caddy | grep -E 'ExecStart|ExecReload'
#    Erwartung (Debian/Ubuntu-Paket):
#    ExecStart  = /usr/bin/caddy run  --environ --config /etc/caddy/Caddyfile
#    ExecReload = /usr/bin/caddy reload --config /etc/caddy/Caddyfile --force

# b) Die Datei sichern — VOR jedem Handgriff
sudo cp -a /etc/caddy/Caddyfile /root/Caddyfile.bak-$(date +%Y%m%d-%H%M%S)
sudo ls -l /root/Caddyfile.bak-*

# c) Inhalt ansehen (Struktur verstehen, Abschnitt 3)
sudo cat /etc/caddy/Caddyfile

# d) Was ist WIRKLICH geladen? (Kann von der Datei abweichen!)
LIVE=/root/caddy-live-$(date +%Y%m%d-%H%M%S).json
curl -s localhost:2019/config/ | sudo tee "$LIVE" >/dev/null
sudo wc -c "$LIVE"          # MUSS deutlich > 2 Bytes sein — siehe Kasten unten
sudo head -c 400 "$LIVE"

# e) Gegenprobe: adaptiert die Datei zu genau dem, was läuft?
sudo caddy adapt --config /etc/caddy/Caddyfile --pretty > /tmp/caddy-adapt.json
sudo caddy validate --config /etc/caddy/Caddyfile
```

⚠️ **Punkt (d) und (e) sind kein Selbstzweck.** Caddys Admin-API auf
`localhost:2019` erlaubt es, die laufende Konfiguration zur Laufzeit zu ändern,
ohne die Datei anzufassen. Wenn jemand das getan hat, ist `/etc/caddy/Caddyfile`
**nicht** der laufende Stand — und ein `reload` mit dieser Datei würde
Mattermost genau die Änderung wegnehmen, die dort nur im Speicher steht.
Weichen `/tmp/caddy-adapt.json` und die Live-JSON in den Mattermost-Routen
voneinander ab: **hier aufhören** und mit demjenigen klären, der den Server
betreibt. Das ist der einzige Weg, wie dieser Umbau Mattermost umwerfen kann.

⚠️ **Kommt bei (d) nichts oder nur `null` zurück, ist der Notfallweg aus
Abschnitt 7 nicht vorhanden.** Mögliche Gründe: `admin off` in den globalen
Optionen, ein anderer Admin-Port (`admin localhost:2020`), oder Caddy läuft im
Container (dann ist 2019 dort drin, nicht auf dem Host — Abschnitt 6). Prüfen:

```bash
grep -n 'admin' /etc/caddy/Caddyfile
sudo ss -tlnp '( sport = :2019 )'
```

Ohne verwertbare Live-JSON bleibt als Rückweg nur das Datei-Backup aus (b) plus
`reload` — das genügt in der Praxis, aber man sollte es **wissen, bevor** man
lädt, nicht danach. Ist die Datei-Sicherung aus (b) das einzige Netz: Abschnitt 5
besonders sorgfältig abarbeiten und den Reload in einem Zeitfenster fahren, in
dem ein kurzer Mattermost-Fehler vertretbar wäre.

Die JSON aus (d) ist — wenn vorhanden — das Rettungsnetz für Abschnitt 7.

---

## 3. Die Struktur der bestehenden Datei prüfen

Drei mögliche Formen — nur die erste ist unkritisch.

### Form 1: benannte Site-Blöcke (der Normalfall)

```
mattermost.example.com {
	reverse_proxy 127.0.0.1:8065
}
```

Ein weiterer Site-Block lässt sich daneben stellen. → Abschnitt 4.

### Form 2: Site-Blöcke **plus** globale Optionen

```
{
	email admin@example.com
}

mattermost.example.com {
	…
}
```

Auch unkritisch — **aber**: `Caddyfile.newedge` enthält bewusst **keine**
globalen Optionen. Der `{ … }`-Block darf im Caddyfile nur einmal und nur ganz
oben vorkommen; ein zweiter lässt Caddy die Konfiguration verwerfen. Bitte auch
nichts hineinschreiben. → Abschnitt 4.

### Form 3: Ein-Site-Caddyfile ohne Klammern

```
mattermost.example.com
reverse_proxy 127.0.0.1:8065
```

**Hier NICHT einfach importieren.** In dieser Kurzform gilt die ganze Datei als
eine einzige Site; ein zusätzlicher Site-Block macht die Datei ungültig. Der
Umbau wäre: die bestehenden Zeilen in `mattermost.example.com { … }` einklammern
— also die bestehende Konfiguration anfassen. Das ist ein **bewusster,
angekündigter Schritt** mit Backup und `validate`, kein Nebenbei-Handgriff.
Im Zweifel vorher abstimmen.

---

## 4. Einhängen — beide Fälle

Zuerst die Datei an ihren Platz bringen (das allein ändert noch nichts, weil sie
noch niemand importiert):

```bash
sudo mkdir -p /etc/caddy/conf.d
sudo cp /opt/newedge/apps/cms/deploy/Caddyfile.newedge \
        /etc/caddy/conf.d/newedge.caddyfile
sudo chmod 644 /etc/caddy/conf.d/newedge.caddyfile
```

Domain oder Ausrollpfad weichen ab? Dann jetzt anpassen. Wirksam ist die Domain
**nur in der Adresszeile** (Zeile 47) und der Pfad **nur in `root *`** (Zeile 51);
die übrigen Treffer stehen in Kommentaren und werden vom `/g` bloß mitgezogen —
das schadet nicht, erklärt aber, warum `grep -c` mehr als eine Zeile meldet:

```bash
sudo sed -i -e 's/newedgebrand\.com/<domain>/g' \
            -e 's|/var/www/newedgebrand/dist|<pfad>|g' \
            /etc/caddy/conf.d/newedge.caddyfile

# Kontrolle: die Adresszeile ist die einzige Zeile ohne führendes Leerzeichen/#
grep -nE '^[^[:space:]#]' /etc/caddy/conf.d/newedge.caddyfile
#   erwartet: GENAU zwei Treffer — die Adresszeile und die schließende '}'.
#   Steht dort mehr, ist die Datei nicht mehr „ein einziger Site-Block".
```

> **`www` im Blick behalten.** Die Adresszeile nennt `newedgebrand.com` **und**
> `www.newedgebrand.com`. Caddy versucht für beide sofort ein Zertifikat zu
> holen. Existiert für `www` noch kein A-Record, scheitert das dauerhaft und
> füllt das Log — die Hauptdomain läuft trotzdem. Solange `www` nicht im DNS
> steht: aus der Adresszeile entfernen.

### Fall A — die Caddyfile hat bereits eine `import`-Direktive

Prüfen:

```bash
sudo grep -n '^\s*import' /etc/caddy/Caddyfile
```

Findet sich z. B. `import /etc/caddy/conf.d/*.caddyfile` oder
`import sites/*`, dann ist **nichts weiter zu tun**, sofern unsere Datei in
dieses Muster fällt. Passt die Endung nicht (viele Setups importieren `*.conf`
oder einen ganzen Ordner ohne Muster), die Datei entsprechend umbenennen —
**nicht** das Import-Muster in der bestehenden Datei umschreiben.

```bash
# Beispiel: die Datei importiert /etc/caddy/sites/*.conf
sudo mkdir -p /etc/caddy/sites
sudo mv /etc/caddy/conf.d/newedge.caddyfile /etc/caddy/sites/newedge.conf
```

Weiter bei Abschnitt 5.

### Fall B — es gibt keine `import`-Direktive

Dann kommt **genau eine Zeile** dazu, ans **Ende** der Datei. Nichts wird
ersetzt, nichts gelöscht, nichts umsortiert.

```bash
# Backup steht (Abschnitt 2b)? Dann:
printf '\n# NEWEDGE-Website (apps/cms/deploy/Caddyfile.newedge) — additiv\nimport /etc/caddy/conf.d/*.caddyfile\n' \
  | sudo tee -a /etc/caddy/Caddyfile

sudo tail -5 /etc/caddy/Caddyfile     # kontrollieren, was da jetzt steht
```

Drei Regeln dazu:

- **Ans Ende, nicht in einen Block.** `import` innerhalb eines Site-Blocks würde
  unsere Site-Definition in Mattermosts Block hineinziehen — das ergibt Unsinn
  und Caddy lehnt es ab.
- **Steht ganz oben ein globaler `{ … }`-Block, bleibt er unberührt.** Der
  `import` gehört trotzdem ans Dateiende.
- `import` mit `*`-Muster ist **fehlertolerant**: passt keine Datei, ist die
  Zeile wirkungslos. Ein Tippfehler im Pfad macht also nichts kaputt, er tut nur
  nichts — deshalb Abschnitt 5 (a) wirklich durchführen.

---

## 5. Prüfen, dann laden

**In dieser Reihenfolge. Kein Schritt darf übersprungen werden.**

```bash
# a) Adaptiert die Datei zu dem, was wir erwarten?
#    Unsere Domain MUSS jetzt auftauchen — sonst hat der import nicht gegriffen.
sudo caddy adapt --config /etc/caddy/Caddyfile --pretty > /tmp/caddy-adapt-neu.json
grep -c newedgebrand /tmp/caddy-adapt-neu.json      # > 0 erwartet

# b) Sind die Mattermost-Routen unverändert geblieben?
diff <(jq -S . /tmp/caddy-adapt.json) <(jq -S . /tmp/caddy-adapt-neu.json) | less
#    Erwartung: NUR Zuwachs. Keine Zeile, die eine Mattermost-Route entfernt
#    oder ändert. Wenn doch: nicht laden, Abschnitt 7.

# c) Vollständige Validierung (prüft auch Module und Werte, nicht nur Syntax)
sudo caddy validate --config /etc/caddy/Caddyfile

# d) Erst jetzt laden — RELOAD, nicht restart
sudo systemctl reload caddy
sudo systemctl status caddy --no-pager
sudo journalctl -u caddy -n 60 --no-pager
```

`reload` tauscht die Konfiguration im laufenden Prozess. Mattermost-Verbindungen
bleiben bestehen, es gibt keine Ausfallsekunde. Schlägt der Reload fehl, läuft
die **alte** Konfiguration weiter — dann Abschnitt 7 lesen, nicht `restart`
hinterherwerfen.

### Optionaler Trockenlauf gegen die ACME-Staging-Umgebung

Wer beim ersten Reload nicht gleich echte Let's-Encrypt-Kontingente verbrennen
will (5 Fehlversuche pro Domain und Stunde), hängt **vorübergehend** in
`/etc/caddy/conf.d/newedge.caddyfile` in den Site-Block ein:

```
	tls {
		ca https://acme-staging-v02.api.letsencrypt.org/directory
	}
```

Das ist eine **Site-lokale** Einstellung und berührt Mattermosts Zertifikate
nicht. Routing lässt sich damit vollständig testen (Browser meckert über das
Staging-Zertifikat, `curl -k` nicht). Danach die drei Zeilen wieder entfernen
und erneut `validate` + `reload` — Caddy holt dann das echte Zertifikat.

---

## 6. Fall C — Caddy läuft im Container

**Dann hier stoppen und klären.** Der Site-Block ist inhaltlich richtig, aber
zwei Voraussetzungen fehlen, und beide lassen sich nur über die
Mattermost-Compose-Datei herstellen:

1. `/var/www/newedgebrand/dist` müsste in den Caddy-Container gemountet werden.
2. `127.0.0.1:1337` / `127.0.0.1:8090` zeigen im Container auf den Container
   selbst. Nötig wäre `host.docker.internal:1337` (mit
   `extra_hosts: host.docker.internal:host-gateway`) oder die Bridge-IP des
   Hosts (meist `172.17.0.1`).

Beides bedeutet: **Mattermosts Compose-Datei ändern und den Caddy-Container neu
starten.** Das ist genau das, was hier nicht ohne Absprache passieren soll — ein
Container-Neustart ist kein Reload, Mattermost wäre kurz nicht erreichbar.

Deshalb: Befund dokumentieren, mit dem Serverbetreiber abstimmen, erst dann
handeln. Alternativen (eigener Caddy auf anderen Ports hinter dem bestehenden,
eigene Subdomain) sind möglich, aber je nach Setup unterschiedlich sinnvoll —
das ist eine Entscheidung, keine Anleitung.

---

## 7. Rückbau

### Der normale Weg (dateibasiert)

```bash
# Fall A (import war schon da): unsere Datei entfernen — und zwar DA, wo sie
# gelandet ist. Wurde sie in Abschnitt 4 umbenannt/verschoben, ist es nicht
# /etc/caddy/conf.d/. Erst suchen, dann löschen:
sudo grep -rln 'NEWEDGE — Caddy-Site-Block' /etc/caddy/
sudo rm <gefundener-pfad>

# Fall B (wir haben die import-Zeile ergänzt): Backup zurückspielen.
# Das Backup ersetzt die Datei vollständig — deshalb vorher kurz gegenprüfen,
# dass seither niemand anderes an der Caddyfile gearbeitet hat:
diff /root/Caddyfile.bak-<zeitstempel> /etc/caddy/Caddyfile
#   erwartet: NUR unsere angehängte import-Zeile (+ Kommentar).
#   Steht mehr drin, nicht das Backup einspielen, sondern nur unsere Zeile
#   wieder herausnehmen.
sudo cp -a /root/Caddyfile.bak-<zeitstempel> /etc/caddy/Caddyfile

# Immer, in dieser Reihenfolge:
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Danach ist der Zustand exakt der von vorher. Mattermosts Zertifikat bleibt
unberührt (es liegt in `/var/lib/caddy/`, davon fasst dieser Umbau nichts an).
Das ausgestellte NEWEDGE-Zertifikat bleibt ebenfalls liegen — es stört nicht und
wird bei einem späteren zweiten Anlauf wiederverwendet.

### Der Notfallweg (wenn der Reload etwas Falsches geladen hat)

```bash
curl -X POST localhost:2019/load \
     -H "Content-Type: application/json" \
     --data-binary @/root/caddy-live-<zeitstempel>.json
```

Das lädt exakt den Stand aus Abschnitt 2 (d) zurück in den **laufenden**
Prozess — ohne Neustart, ohne die Datei anzufassen. Anschließend die Datei in
Ruhe geradeziehen und erst dann wieder `reload`.

**Setzt voraus, dass die Datei aus 2 (d) auch Inhalt hat** (dort geprüft). Ist
sie leer oder enthält nur `null`, gibt es diesen Weg auf diesem Server nicht —
dann bleibt nur der dateibasierte Rückbau darüber.

### Prüfen, dass Mattermost wieder/weiterhin steht

```bash
curl -sI https://<mattermost-domain>/ | head -1
echo | openssl s_client -connect <mattermost-domain>:443 \
        -servername <mattermost-domain> 2>/dev/null | openssl x509 -noout -dates
```

---

## 8. Was auf diesem Server NICHT getan wird

| Verboten | Warum |
|---|---|
| `caddy stop`, `systemctl stop/restart caddy` | Mattermost fällt aus. `reload` erledigt dasselbe unterbrechungsfrei und ohne Risiko. |
| `/etc/caddy/Caddyfile` ersetzen oder überschreiben | Darin steht die einzige Kopie der Mattermost-Konfiguration. Nur **anhängen** (Fall B), sonst gar nicht anfassen. |
| Bestehende Site-Blöcke, `import`-Muster oder globale Optionen umschreiben | Additiv heißt: es kommt etwas dazu, es ändert sich nichts. |
| `deploy/setup.sh` **ohne** `--webserver=caddy` | Der Default-Modus installiert nginx (kann 80/443 nicht binden), löscht `/etc/nginx/sites-enabled/default` und ruft `certbot --nginx`. Das Skript bricht deshalb von selbst ab, sobald ein fremder Webserver auf 80/443 lauscht — verlassen sollte man sich darauf trotzdem nicht. |
| Die Vorab-Prüfung von `setup.sh` umgehen oder herauspatchen | Sie ist das Einzige, was zwischen einem falschen Aufruf und einem Mattermost-Ausfall steht. |
| `ALLOW_NGINX=1` setzen | Der Schalter hebt genau **einen** Abbruch auf: „ein anderer Webserver ist installiert, lauscht aber gerade nicht auf 80/443" — gedacht für Server, auf denen ein Caddy-Paket bloß herumliegt. Auf **diesem** Server bedient Caddy Mattermost; hier würde der Schalter nginx daneben setzen. Den Abbruch bei tatsächlich belegtem Port 80/443 hebt er ohnehin nicht auf. |
| `certbot` in jeder Form | Zwei ACME-Clients für dieselbe Domain streiten um Challenge und Rate-Limit. Caddy macht TLS selbst. |
| nginx installieren | Belegt nichts, startet aber auch nicht — und hinterlässt einen fehlgeschlagenen Dienst, der bei jedem Reboot wieder versucht, Port 80 zu nehmen. |
| Globale Optionen in `Caddyfile.newedge` ergänzen | Der `{ … }`-Block darf pro Konfiguration nur einmal existieren. Ein zweiter macht die gesamte Konfiguration ungültig — auch die von Mattermost. |
| Snippets (`(name) { … }`) in `Caddyfile.newedge` | Snippet-Namen sind konfigurationsweit eindeutig und könnten mit bestehenden kollidieren. |
| Aus „`ss` zeigt nichts auf 80/443" auf „Port frei" schließen | Mit `userland-proxy: false` veröffentlicht Docker rein per DNAT — es gibt dann keinen Host-Socket, obwohl der Port an einen Container geht. Immer zusätzlich `docker ps --filter publish=80 --filter publish=443` (Abschnitt 1). |
| Einen Site-Block **ohne** Hostname ergänzen (`:443 { … }`, `http:// { … }`) | Ein Block ohne Adresse fängt jede Anfrage ab, für die es keinen spezifischeren Block gibt — und damit potenziell Mattermost. `Caddyfile.newedge` nennt die Domain deshalb ausdrücklich; das muss so bleiben. |

---

## 9. Der Rest des Deployments

Alles außer dem Webserver kann `setup.sh` übernehmen — im **Modus `caddy`**:

```bash
sudo git clone -b redesign-cms-2026-07 <repo-url> /opt/newedge
cd /opt/newedge
sudo ./apps/cms/deploy/setup.sh newedgebrand.com --webserver=caddy
```

Die TLS-E-Mail entfällt bewusst: sie geht ausschließlich an certbot, und der
läuft in diesem Modus nicht. Caddy verwaltet das Zertifikat.

Was der Modus tut: Docker/Node prüfen, `.env`-Dateien anlegen, Stack bauen und
starten (inkl. Content-Seed), Website bauen und nach `/var/www/newedgebrand/dist`
ausrollen. Was er **nicht** tut: nginx installieren, certbot aufrufen, Caddy
anfassen. Am Ende nennt er die zwei verbleibenden Handgriffe (Leserechte +
Site-Block) und verweist hierher.

> `--webserver=caddy` ist **nicht** persistent. Bei jedem weiteren `setup.sh`-Lauf
> wieder mitgeben — sonst greift der Default `nginx`. Der bricht auf diesem
> Server zwar ab, bevor er etwas verändert, aber der Lauf war dann umsonst.
> `update.sh` ist davon nicht betroffen (siehe Abschnitt 12).

### Dieselben Schritte von Hand

Für den Fall, dass man das Skript nicht laufen lassen will — oder verstehen, was
es tut:

```bash
# 1. Monorepo
sudo git clone -b redesign-cms-2026-07 <repo-url> /opt/newedge
cd /opt/newedge/apps/cms

# 2. CMS-Secrets — Vorlage kopieren und ALLE Werte ersetzen
cp .env.production.example .env && chmod 600 .env
#    PUBLIC_URL=https://newedgebrand.com
#    IS_PROXIED=true            ← Strapi vertraut dann X-Forwarded-* von Caddy
#    CORS_ORIGINS=https://newedgebrand.com,https://www.newedgebrand.com
#    Secrets erzeugen: openssl rand -base64 32   (APP_KEYS = 4 Werte, kommagetrennt)

# 3. Lead-Service-Env  (eine vorhandene .env NICHT überschreiben)
[ -f ../lead-api/.env ] || cp ../lead-api/.env.example ../lead-api/.env
chmod 600 ../lead-api/.env
mkdir -p ../lead-api/data && chmod 700 ../lead-api/data
#    ALLOWED_ORIGINS=https://newedgebrand.com,https://www.newedgebrand.com
#    FOLLOWUP_UNSUBSCRIBE_BASE=https://newedgebrand.com
#    SMTP_PASS=<App-Passwort>   ·   SEND_DISABLED=0

# 4. Stack starten (Erststart MIT Seed)
SEED=1 docker compose up -d --build
docker compose logs -f strapi                      # bis "[seed] DONE"
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:1337/_health   # 204
curl -s http://127.0.0.1:8090/health | jq .

# 5. Website bauen und ausrollen
cd ../website
cp .env.production.example .env.production
#    VITE_STRAPI_URL=https://newedgebrand.com
#    VITE_API_URL=https://newedgebrand.com
npm ci && npm run build
sudo mkdir -p /var/www/newedgebrand/dist
sudo rsync -a --delete dist/ /var/www/newedgebrand/dist/

# 6. Leserechte für den caddy-Benutzer (NICHT vergessen)
sudo chmod -R a+rX /var/www/newedgebrand
sudo -u caddy test -r /var/www/newedgebrand/dist/index.html && echo "caddy kann lesen"

# 7. Caddy: Abschnitte 4 und 5 dieser Datei
```

**Zu Schritt 6:** nginx läuft als `www-data`, das Caddy-Paket als `caddy`. Wer
den nginx-Weg im Kopf hat, vergisst das — und bekommt für jede Seite 403, obwohl
Routing und Zertifikat stimmen. Erkennbar an `permission denied` in
`journalctl -u caddy`.

**Zu Schritt 4:** DNS-A-Record auf die Server-IP muss **vor** dem Caddy-Reload
stehen, sonst scheitert die ACME-Challenge (Port 80 muss dafür offen bleiben —
ist er).

---

## 10. Abnahme

Erst Mattermost, dann wir. Beides nach jedem Reload.

```bash
# ── Mattermost steht noch ────────────────────────────────────────────────────
curl -sI https://<mattermost-domain>/ | head -1              # unverändert

# ── Website ──────────────────────────────────────────────────────────────────
curl -sI https://newedgebrand.com/          | head -1        # 200
curl -sI https://newedgebrand.com/cortex    | head -1        # 200 (kein 301!)
curl -sI https://newedgebrand.com/gibtsnicht | head -1       # 200 = SPA-Fallback, korrekt

# ── Caching: zwei Sorten Dateien unter /assets/ ──────────────────────────────
#    Dateinamen aus dem Build nehmen: ls /var/www/newedgebrand/dist/assets | head
curl -sI https://newedgebrand.com/assets/<bundle>-<hash>.js | grep -i cache-control
#    → public, max-age=31536000, immutable
curl -sI https://newedgebrand.com/assets/<bild>.png         | grep -i cache-control
#    → public, max-age=2592000, must-revalidate
curl -sI https://newedgebrand.com/assets/nichtda.js | head -1  # 404, NICHT 200-HTML

# ── Strapi ───────────────────────────────────────────────────────────────────
curl -s  https://newedgebrand.com/api/kontakt | head -c 200   # JSON
curl -sI https://newedgebrand.com/admin | head -1             # 200/302, kein SPA-HTML

# ── Lead-Service ─────────────────────────────────────────────────────────────
curl -s -o /dev/null -w '%{http_code}\n' -X POST https://newedgebrand.com/contact
#    → 400/422 (JSON-Validierung), NICHT 404 und NICHT 200-HTML
curl -sI https://newedgebrand.com/abmelden/test | head -1     # 404 vom Service
curl -sI https://newedgebrand.com/abmelden/test | grep -i cache-control   # no-store
curl -s -o /dev/null -w '%{http_code}\n' https://newedgebrand.com/health  # 403 — Absicht
curl -s http://127.0.0.1:8090/health | jq .                   # vom Server aus: JSON
```

Und im Browser: Kontaktformular abschicken, ROI-Rechner durchklicken, `/admin`
öffnen.

> **Fallstrick Service Worker.** Die Website ist eine PWA. Ihr Service Worker
> liefert für jede Navigation `index.html` aus, wenn der Pfad nicht in
> `workbox.navigateFallbackDenylist` (`apps/website/vite.config.ts`) steht — er
> würde also auch `/abmelden/<token>` und `/admin` abfangen, obwohl Caddy alles
> richtig macht. Ein `curl`-Test sieht das nie. Neuer Service-Pfad ⇒ Eintrag in
> dieser Liste ⇒ Website neu bauen.

---

## 11. docker-compose: Kollidiert etwas mit Mattermost?

Geprüft in `apps/cms/docker-compose.yml` und
`apps/lead-api/docker-compose.standalone.yml`:

| Punkt | Befund |
|---|---|
| Port 80 / 443 | **kommen nirgends vor.** Kein Container will die Ports, kein Konflikt mit Caddy. |
| `strapi` | `127.0.0.1:1337:1337` — nur Loopback, Port laut Scan frei |
| `lead-api` | `127.0.0.1:8090:8090` — nur Loopback, Port laut Scan frei |
| `postgres` | **kein `ports:`-Mapping.** Erreichbar nur im Compose-Netz. Eine eventuelle Mattermost-Postgres auf 5432 wird nicht berührt. |

**Ergebnis: `docker-compose.yml` braucht keine Änderung.** Die Loopback-Bindung
ist hier sogar genau richtig — Caddy läuft als Systemdienst auf demselben Host
und erreicht `127.0.0.1:1337` direkt, während von außen niemand an den Ports
vorbei an Strapi kommt. (Ausnahme: Caddy im Container → Abschnitt 6.)

Drei Dinge, die man auf dem Server trotzdem einmal nachsieht:

```bash
# a) Compose-Projektname. Er leitet sich vom Ordnernamen ab → "cms".
#    Existiert dort schon ein Projekt "cms", greifen beide auf dieselben
#    Volume-Namen (cms_pgdata, cms_uploads) zu.
docker compose ls

# b) Sind 1337/8090 auf dem Host wirklich frei?
ss -tlnp '( sport = :1337 or sport = :8090 )'    # erwartet: leer

# c) Wird der Lead-Service versehentlich zweimal gestartet?
#    docker-compose.standalone.yml bindet DENSELBEN Port 8090 und DENSELBEN
#    data/-Ordner. Auf diesem Server ist sie nicht zu benutzen.
```

Und eine Warnung, wenn Docker auf dem Server **noch nicht** installiert ist:
`get.docker.com` schreibt iptables-Regeln in die `FORWARD`-Kette. Auf einem
Server mit aktiver `ufw`-Konfiguration kann das bestehende Regeln in ihrer
Wirkung verändern. Läuft Mattermost selbst in Docker, ist Docker ohnehin da und
der Punkt entfällt — deshalb vorher `docker version` prüfen, nicht blind
installieren.

---

## 12. Betrieb danach

Alles wie in `DEPLOY.md`, mit zwei Abweichungen:

| Aufgabe | Auf diesem Server |
|---|---|
| Website-Release ausrollen | `sudo ./apps/cms/deploy/update.sh website` — unverändert nutzbar, fasst Caddy nicht an |
| CMS / Lead-Service aktualisieren | `update.sh cms` / `update.sh lead` — unverändert nutzbar |
| Backup | `sudo ./apps/cms/deploy/backup.sh` — unverändert nutzbar |
| Erstinstallation / Neuaufsetzen | `setup.sh … **--webserver=caddy**` — den Schalter nie vergessen (Abschnitt 9) |
| Zertifikat erneuern | passiert von selbst (Caddy). Kein certbot-Timer, kein Cronjob. |
| Routing ändern | `/etc/caddy/conf.d/newedge.caddyfile` bearbeiten → `caddy validate` → `systemctl reload caddy`. Die Quelle im Repo (`deploy/Caddyfile.newedge`) mit ändern, sonst driftet der Server weg. |

`update.sh website` synchronisiert nur `/var/www/newedgebrand/dist` — nach jedem
Lauf einmal `sudo chmod -R a+rX /var/www/newedgebrand` hinterher, falls neue
Dateien mit engeren Rechten dazukommen.

---

## Ablage im Repo

| Datei | Wofür |
|---|---|
| `deploy/Caddyfile.newedge` | Site-Block für diesen Server (Caddy hält 80/443) |
| `deploy/CADDY-KOEXISTENZ.md` | diese Anleitung |
| `deploy/nginx.conf` | dasselbe Routing für einen frischen Server ohne fremden Webserver |
| `deploy/setup.sh` | Stack + Website; `--webserver=nginx\|caddy\|none` |

**`Caddyfile.newedge` ist die einzige Quelle des Caddy-Routings.** `setup.sh`
druckt bewusst keinen zweiten Site-Block mehr aus, sondern verweist auf diese
Datei — zwei Kopien derselben Regeln driften sonst auseinander, und die Kopie,
die niemand liest, landet am Ende auf dem Server.

Beide Routing-Dateien bilden dasselbe Mapping ab. **Wer eine ändert, ändert die
andere mit** — sonst hängt das Verhalten davon ab, auf welchem Server man landet.
