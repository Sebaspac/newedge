#!/usr/bin/env bash
# ============================================================================
# NEWEDGE — Caddy-Site-Block additiv in ein BESTEHENDES Caddy einhängen
# ----------------------------------------------------------------------------
#   sudo ./apps/cms/deploy/caddy-einbinden.sh <domain> [--dry-run] [Optionen]
#   z. B.: sudo ./apps/cms/deploy/caddy-einbinden.sh newedgebrand.com --dry-run
#          sudo ./apps/cms/deploy/caddy-einbinden.sh newedgebrand.com
#
# WOFÜR:
# Auf dem Zielserver hält bereits Caddy die Ports 80/443 und bedient dort ein
# PRODUKTIVES Mattermost. Dieses Skript hängt deploy/Caddyfile.newedge additiv
# daneben — ohne die bestehende Konfiguration zu ersetzen, zu stoppen oder
# umzuschreiben. Es ist die skriptgewordene Fassung von deploy/CADDY-KOEXISTENZ.md.
#
# WAS ES ANFASST (mehr nicht):
#   /etc/caddy/conf.d/newedge.caddyfile   ← NEU, unsere Datei
#   /etc/caddy/Caddyfile                  ← NUR falls dort noch keine passende
#                                            import-Zeile steht: genau zwei
#                                            Zeilen ans DATEIENDE angehängt
#   /var/www/newedgebrand                 ← chmod -R a+rX (Leserechte für caddy)
#   systemctl reload caddy                ← RELOAD, niemals stop/restart
#
# WAS ES NIEMALS TUT:
#   restart/stop von caddy · bestehende Site-Blöcke, import-Muster oder globale
#   Optionen umschreiben · certbot · nginx · die laufende Konfiguration über die
#   Admin-API verändern (die wird nur GELESEN — und im Notfall zurückgeladen).
#
# ABLAUF (Phasen wie im Runbook):
#   P1–P9   Prüfphase — verändert NICHTS. Jeder Zweifel ist ein Abbruch.
#   P10     rollback.sh erzeugen
#   P11     Schreiben (der einzige Schreibzugriff auf fremde Dateien)
#   P12     reload + Abnahme
#   P13     Ergebnis · bei Fehlschlag automatischer Rollback
#
# WERKZEUGE: python3 wird gebraucht (JSON-Vergleich, TLS-Proben) — auf Ubuntu
# Teil der Grundinstallation. jq wird NICHT gebraucht. curl ist optional; fehlt
# es, übernimmt python3. Kein Werkzeug wird nachinstalliert.
# ============================================================================
set -euo pipefail

# ── Ausgabe ─────────────────────────────────────────────────────────────────
say()  { printf '\033[1;35m▸ %s\033[0m\n' "$*"; }
ok()   { printf '\033[1;32m✔ %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m⚠ %s\033[0m\n' "$*"; }
err()  { printf '\033[1;31m✖ %s\033[0m\n' "$*" >&2; }
info() { printf '    %s\n' "$*"; }

GEAENDERT=0          # 1, sobald an /etc/caddy geschrieben wurde
WEBROOT_CHMOD=0      # 1, sobald chmod auf dem Webroot lief
W=""                 # Arbeits-/Sicherungsverzeichnis

abbruch() {
  local grund="$1"; shift || true
  echo
  err "ABBRUCH: $grund"
  if [ "$#" -gt 0 ]; then
    echo >&2
    printf '  %s\n' "$@" >&2
  fi
  echo >&2
  if [ "$GEAENDERT" -eq 0 ]; then
    printf '  An Caddy wurde NICHTS verändert. Der Dienst läuft unverändert weiter.\n' >&2
    [ "$WEBROOT_CHMOD" -eq 1 ] && printf '  (Einzige Ausnahme: Leserechte im eigenen Webroot wurden gesetzt — harmlos.)\n' >&2
  else
    printf '  ACHTUNG: es wurde bereits an /etc/caddy geschrieben.\n' >&2
    printf '  Rückbau:  %s\n' "${W:-<Arbeitsverzeichnis>}/rollback.sh" >&2
  fi
  echo >&2
  exit 1
}

usage() {
  cat <<'EOF'
Usage: sudo ./apps/cms/deploy/caddy-einbinden.sh <domain> [Optionen]

  --dry-run              Komplette Prüfphase durchlaufen und genau anzeigen, was
                         passieren WÜRDE. Es wird nichts verändert.
  --web-root=<pfad>      Ausrollverzeichnis der Website (Vorgabe: /var/www/newedgebrand).
                         Ausgeliefert wird <pfad>/dist.
  --conf-dir=<pfad>      Ablage für unseren Site-Block (Vorgabe: /etc/caddy/conf.d).
  --ohne-www             www.<domain> aus der Adresszeile entfernen, auch wenn
                         ein A-Record existiert.
  --catchall-erlauben    Fortfahren, obwohl im Bestand eine Route OHNE Host-Matcher
                         existiert (siehe Abbruchmeldung — bitte erst lesen).
  --dns-egal             Fortfahren, obwohl der A-Record der Hauptdomain nicht auf
                         diesen Server zeigt (dann holt Caddy kein Zertifikat).
  --ohne-mm-abnahme      Fortfahren, obwohl der Bestands-Fingerabdruck der fremden
                         Hosts nicht erhoben werden konnte. NUR nach Rücksprache.
  -h, --help             Diese Hilfe.

Rückbau eines gelaufenen Einbaus: <arbeitsverzeichnis>/rollback.sh
EOF
}

# ── Argumente ───────────────────────────────────────────────────────────────
DRYRUN=0
WEB_ROOT="/var/www/newedgebrand"
CONF_DIR="/etc/caddy/conf.d"
OHNE_WWW=0
CATCHALL_OK=0
DNS_EGAL=0
OHNE_MM_ABNAHME=0
POSITIONAL=()

for arg in "$@"; do
  case "$arg" in
    --dry-run)            DRYRUN=1 ;;
    --web-root=*)         WEB_ROOT="${arg#*=}" ;;
    --conf-dir=*)         CONF_DIR="${arg#*=}" ;;
    --ohne-www)           OHNE_WWW=1 ;;
    --catchall-erlauben)  CATCHALL_OK=1 ;;
    --dns-egal)           DNS_EGAL=1 ;;
    --ohne-mm-abnahme)    OHNE_MM_ABNAHME=1 ;;
    -h|--help)            usage; exit 0 ;;
    -*)                   echo "Unbekannte Option: $arg"; echo; usage; exit 1 ;;
    *)                    POSITIONAL+=("$arg") ;;
  esac
done

DOMAIN="${POSITIONAL[0]:-}"
[ -z "$DOMAIN" ] && { usage; exit 1; }

# Die Domain landet in sed-Ersetzungen, in Dateinamen und in TLS-Proben —
# deshalb einmal prüfen, statt Sonderzeichen durchzureichen.
case "$DOMAIN" in
  *[!a-zA-Z0-9.-]*|-*|.*|*.|*-)
    echo "Ungültige Domain: $DOMAIN"; exit 1 ;;
esac
case "$DOMAIN" in
  www.*)
    echo "Bitte die Hauptdomain OHNE www übergeben (z. B. newedgebrand.com)."
    echo "www.<domain> ergänzt das Skript selbst — sofern dafür ein A-Record existiert."
    exit 1 ;;
esac

# Webroot und conf-Verzeichnis gehen in sed und in Dateipfade.
case "$WEB_ROOT" in
  /*) ;;
  *)  echo "--web-root muss ein absoluter Pfad sein: $WEB_ROOT"; exit 1 ;;
esac
case "$WEB_ROOT" in
  *[\|\&\'\"\`\$\*[:space:]]*) echo "--web-root enthält Sonderzeichen: $WEB_ROOT"; exit 1 ;;
esac
case "$CONF_DIR" in
  /*) ;;
  *)  echo "--conf-dir muss ein absoluter Pfad sein: $CONF_DIR"; exit 1 ;;
esac
case "$CONF_DIR" in
  *[\|\&\'\"\`\$\*[:space:]]*) echo "--conf-dir enthält Sonderzeichen: $CONF_DIR"; exit 1 ;;
esac
CONF_DIR="${CONF_DIR%/}"
WEB_ROOT="${WEB_ROOT%/}"

WWW_DOMAIN="www.$DOMAIN"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VORLAGE="$SCRIPT_DIR/Caddyfile.newedge"
RUNBOOK="$SCRIPT_DIR/CADDY-KOEXISTENZ.md"
SITE_MARKER='NEWEDGE — Caddy-Site-Block'
IMPORT_MARKER='# >>> NEWEDGE-IMPORT (apps/cms/deploy/caddy-einbinden.sh) — additiv, entfernbar <<<'

echo
if [ "$DRYRUN" -eq 1 ]; then
  say "NEWEDGE Caddy-Einbau — PROBELAUF (--dry-run): es wird nichts verändert"
else
  say "NEWEDGE Caddy-Einbau — Echtlauf für $DOMAIN"
fi

# ── Aufräumen: Probierkopien und Sperre ─────────────────────────────────────
# Die Probierkopien können in /etc/caddy liegen (nur dann, wenn die bestehende
# Konfiguration relative import-Muster benutzt). Sie dürfen dort auf keinen Fall
# liegen bleiben — deshalb ein trap, der auch bei Abbruch greift.
AUFRAEUMEN=()
LOCK_DIR=""
aufraeumen() {
  local f
  if [ "${#AUFRAEUMEN[@]}" -gt 0 ]; then
    for f in "${AUFRAEUMEN[@]}"; do
      [ -n "$f" ] || continue
      rm -f "$f" 2>/dev/null || true
    done
  fi
  [ -n "$LOCK_DIR" ] && rmdir "$LOCK_DIR" 2>/dev/null
  return 0
}
trap aufraeumen EXIT

# Strg-C oder eine abreißende SSH-Verbindung darf keinen HALBEN Stand
# hinterlassen: eine geschriebene, aber nie geprüfte und nie geladene
# Konfiguration ist genau das, was der nächste Neustart lädt — und damit der
# Weg, auf dem der fremde Dienst später doch noch offline geht.
# Deshalb: bei Signal zurückbauen, statt einfach zu sterben.
RELOAD_GEMACHT=0     # 1, sobald ein Reload angestoßen wurde
signal_abbruch() {
  local sig="$1"
  trap - INT TERM HUP EXIT
  echo >&2
  err "Signal $sig empfangen — Abbruch."
  if [ "$GEAENDERT" -eq 1 ] && [ -n "$W" ] && [ -x "$W/rollback.sh" ]; then
    err "An /etc/caddy wurde bereits geschrieben — es wird automatisch zurückgebaut."
    if [ "$RELOAD_GEMACHT" -eq 1 ]; then
      "$W/rollback.sh"              || err "Rückbau meldete Fehler: $W/rollback.log"
    else
      "$W/rollback.sh" --ohne-reload || err "Rückbau meldete Fehler: $W/rollback.log"
    fi
  elif [ "$GEAENDERT" -eq 1 ]; then
    err "ACHTUNG: an /etc/caddy wurde bereits geschrieben, ein Rückbau-Skript"
    err "gibt es aber noch nicht. Von Hand:"
    printf '    cp -a %s/Caddyfile.orig %s\n' "${W:-<arbeitsverzeichnis>}" "${CADDYFILE:-/etc/caddy/Caddyfile}" >&2
    printf '    rm -f %s\n' "${SITE_ZIEL:-<site-datei>}" >&2
  else
    printf '  An Caddy wurde nichts verändert.\n' >&2
  fi
  aufraeumen
  exit 130
}
trap 'signal_abbruch INT'  INT
trap 'signal_abbruch TERM' TERM
trap 'signal_abbruch HUP'  HUP

# ═══════════════════════════════════════════════════════════════════════════
# P1 — Rechte, Werkzeuge, Sperre. Ab hier bis P10 wird NICHTS verändert.
# ═══════════════════════════════════════════════════════════════════════════
say "[P1] Rechte und Werkzeuge"

[ "$(id -u)" -eq 0 ] || {
  echo "Bitte mit sudo ausführen."
  exit 1
}

command -v systemctl >/dev/null 2>&1 || abbruch \
  "systemctl nicht gefunden." \
  "Dieses Skript setzt einen Caddy als systemd-Dienst voraus." \
  "Läuft Caddy im Container, ist der Einbau ohnehin Handarbeit:" \
  "$RUNBOOK, Abschnitt 6."

# python3 macht die gesamte JSON-Auswertung und die TLS-Proben. Ohne verlässlichen
# JSON-Vergleich lässt sich nicht beweisen, dass Mattermost unberührt bleibt —
# und ohne diesen Beweis wird hier nichts angefasst.
command -v python3 >/dev/null 2>&1 || abbruch \
  "python3 nicht gefunden." \
  "Es wird für den JSON-Vergleich (laufende Konfiguration vorher/nachher)" \
  "und für die TLS-Proben gegen die fremden Hosts gebraucht. Ohne diesen" \
  "Vergleich gibt es keinen Beweis, dass Mattermost unverändert bleibt." \
  "" \
  "    apt-get install -y python3" \
  "" \
  "jq wird NICHT gebraucht."

for werkzeug in awk sed grep diff cat cp mkdir rm date; do
  command -v "$werkzeug" >/dev/null 2>&1 || abbruch \
    "$werkzeug nicht gefunden." \
    "Ohne die Standardwerkzeuge lässt sich hier nichts sicher prüfen."
done

# Prüfsumme: coreutils oder openssl — eines von beiden genügt.
HASH_ART=""
if   command -v sha256sum >/dev/null 2>&1; then HASH_ART=sha256sum
elif command -v shasum    >/dev/null 2>&1; then HASH_ART=shasum
elif command -v openssl   >/dev/null 2>&1; then HASH_ART=openssl
fi
[ -n "$HASH_ART" ] || abbruch \
  "Kein Werkzeug für Prüfsummen gefunden (sha256sum, shasum oder openssl)." \
  "Die Prüfsumme ist das Einzige, was zwischen 'wir haben die Datei zuletzt" \
  "angefasst' und 'jemand anders hat inzwischen editiert' unterscheidet." \
  "" \
  "    apt-get install -y coreutils"

datei_hash() {
  # Ausgabe: nur der Hex-Wert, ohne Dateinamen.
  case "$HASH_ART" in
    sha256sum) sha256sum "$1" 2>/dev/null | awk '{print $1}' ;;
    shasum)    shasum -a 256 "$1" 2>/dev/null | awk '{print $1}' ;;
    openssl)   openssl dgst -sha256 "$1" 2>/dev/null | awk '{print $NF}' ;;
  esac
}

# Port-Werkzeug: nötig für die Frage, WELCHER Prozess auf 443 und 2019 lauscht.
PORT_TOOL=""
if   command -v ss   >/dev/null 2>&1; then PORT_TOOL=ss
elif command -v lsof >/dev/null 2>&1; then PORT_TOOL=lsof
fi
[ -n "$PORT_TOOL" ] || abbruch \
  "Weder 'ss' noch 'lsof' vorhanden." \
  "Ohne beide lässt sich nicht feststellen, ob der Caddy auf Port 443 wirklich" \
  "derselbe Prozess ist wie der systemd-Dienst — und genau daran hängt, ob ein" \
  "Rollback den richtigen Caddy trifft." \
  "" \
  "    apt-get install -y iproute2      # liefert 'ss'"

# HTTP: curl bevorzugt, sonst python3. Beides erledigt dieselben Aufgaben.
HTTP_ART="python3"
command -v curl >/dev/null 2>&1 && HTTP_ART="curl"

command -v openssl >/dev/null 2>&1 || warn "openssl fehlt — Zertifikatsdaten holt stattdessen python3 (gleichwertig)."

[ -f "$VORLAGE" ] || abbruch \
  "Vorlage nicht gefunden: $VORLAGE" \
  "Dieses Skript muss aus einem vollständigen Monorepo-Klon laufen —" \
  "es baut ausschließlich auf Dateien neben sich selbst."
[ -r "$VORLAGE" ] || abbruch "Vorlage nicht lesbar: $VORLAGE"

# Sperre: zwei gleichzeitige Läufe würden sich beim Anhängen der import-Zeile
# gegenseitig überschreiben. mkdir ist atomar und braucht kein flock.
LOCK_BASIS="/run"
[ -d "$LOCK_BASIS" ] || LOCK_BASIS="/tmp"
if mkdir "$LOCK_BASIS/newedge-caddy-einbinden.lock" 2>/dev/null; then
  LOCK_DIR="$LOCK_BASIS/newedge-caddy-einbinden.lock"
else
  abbruch \
    "Ein anderer Lauf dieses Skripts ist noch aktiv (oder hat die Sperre liegen lassen)." \
    "Sperre: $LOCK_BASIS/newedge-caddy-einbinden.lock" \
    "" \
    "Läuft nachweislich nichts mehr, die Sperre entfernen:" \
    "    rmdir $LOCK_BASIS/newedge-caddy-einbinden.lock"
fi

ok "Werkzeuge vollständig (JSON/TLS über python3, HTTP über $HTTP_ART, Ports über $PORT_TOOL)"

# ── Arbeits- und Sicherungsverzeichnis ──────────────────────────────────────
# Im Echtlauf unter /root (überlebt Neustarts, gehört zum Rettungsnetz), im
# Probelauf unter /tmp (reine Analysedateien, keine Systemänderung).
ZEITSTEMPEL="$(date +%Y%m%d-%H%M%S)"
if [ "$DRYRUN" -eq 1 ]; then
  W="${TMPDIR:-/tmp}/newedge-caddy-probelauf-$ZEITSTEMPEL"
else
  W="/root/newedge-caddy-$ZEITSTEMPEL"
fi
mkdir -p "$W" || abbruch "Arbeitsverzeichnis lässt sich nicht anlegen: $W"
chmod 700 "$W" 2>/dev/null || true
info "Arbeitsverzeichnis: $W"

PY="$W/helfer.py"
cat >"$PY" <<'PYEOF'
#!/usr/bin/env python3
# Hilfsprogramm für caddy-einbinden.sh.
# Bewusst ohne Fremdbibliotheken: nur Standardbibliothek, damit auf dem Server
# nichts nachinstalliert werden muss (kein jq, kein curl nötig).
#
# Unterbefehle:
#   pruefe  <datei>                     JSON ist ein Objekt mit apps.http.servers?
#   norm    <datei>                     kanonische Ausgabe (Schluessel sortiert)
#   kern    <datei>                     kanonisch, nur {http, tls}
#   hosts   <datei>                     alle Host-Namen, sortiert, je Zeile einer
#   routen  <datei> <host>              kanonisch: Routen dieses Hosts je Server
#   catchall <datei>                    Anzahl Routen OHNE Host-Matcher
#   ohne    <datei> <dom> [<dom> ...]   kanonisch, aber ohne unsere Routen/Policies
#   holen   <url> [<zieldatei>]         HTTP GET, gibt den Statuscode aus
#   senden  <url> <datei>               HTTP POST (JSON), gibt den Statuscode aus
#   dns     <name>                      A-Records, je Zeile einer
#   probe   <host> <ip> <port> <pfad>   HTTPS-Probe mit SNI=<host> gegen <ip>
import http.client
import json
import socket
import ssl
import sys
import urllib.error
import urllib.request


def lade(pfad):
    with open(pfad, "r", encoding="utf-8") as f:
        return json.load(f)


def dump(objekt):
    return json.dumps(objekt, sort_keys=True, indent=1, ensure_ascii=False)


def hosts_sammeln(knoten, acc):
    """Sammelt JEDEN "host": [...]-Eintrag, auch in verschachtelten Subrouten."""
    if isinstance(knoten, dict):
        for schluessel, wert in knoten.items():
            if schluessel == "host" and isinstance(wert, list):
                for h in wert:
                    if isinstance(h, str):
                        acc.add(h)
            hosts_sammeln(wert, acc)
    elif isinstance(knoten, list):
        for wert in knoten:
            hosts_sammeln(wert, acc)


def server_map(cfg):
    apps = cfg.get("apps") if isinstance(cfg, dict) else None
    httpapp = apps.get("http") if isinstance(apps, dict) else None
    server = httpapp.get("servers") if isinstance(httpapp, dict) else None
    return server if isinstance(server, dict) else {}


def route_hosts(route):
    acc = set()
    hosts_sammeln(route, acc)
    return acc


def probe(host, ip, port, pfad):
    # 1) Zertifikat: mit Prüfung, damit getpeercert() die Daten liefert.
    zert = "unpruefbar:unbekannt"
    try:
        ctx = ssl.create_default_context()
        with socket.create_connection((ip, port), timeout=8) as s:
            with ctx.wrap_socket(s, server_hostname=host) as tls:
                daten = tls.getpeercert() or {}
                zert = daten.get("notAfter", "ohne-datum")
    except ssl.SSLCertVerificationError:
        zert = "unpruefbar:zertifikatspruefung"
    except Exception as fehler:  # noqa: BLE001 - Fehlerklasse genügt als Merkmal
        zert = "unpruefbar:" + type(fehler).__name__

    # 2) Antwort: ohne Prüfung, damit auch ein fremdes/abgelaufenes Zertifikat
    #    die Statuszeile nicht verdeckt. Wir vergleichen vorher/nachher, wir
    #    bewerten das Zertifikat nicht.
    status = "000"
    koerper = ""
    try:
        ctx2 = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
        ctx2.check_hostname = False
        ctx2.verify_mode = ssl.CERT_NONE
        roh = socket.create_connection((ip, port), timeout=10)
        tls = ctx2.wrap_socket(roh, server_hostname=host)
        verbindung = http.client.HTTPSConnection(host, port, timeout=10)
        verbindung.sock = tls
        verbindung.request(
            "GET", pfad,
            headers={"Host": host,
                     "User-Agent": "newedge-caddy-einbinden",
                     "Connection": "close"})
        antwort = verbindung.getresponse()
        status = str(antwort.status)
        koerper = antwort.read(400).decode("utf-8", "replace")
        verbindung.close()
    except Exception as fehler:  # noqa: BLE001
        status = "000"
        koerper = "FEHLER " + type(fehler).__name__
    print("status %s" % status)
    print("zert %s" % zert)
    print("koerper %s" % " ".join(koerper.split())[:200])


befehl = sys.argv[1] if len(sys.argv) > 1 else ""

if befehl == "pruefe":
    try:
        cfg = lade(sys.argv[2])
    except Exception as fehler:  # noqa: BLE001
        print("nicht lesbar oder kein JSON: %s" % fehler)
        sys.exit(3)
    if not isinstance(cfg, dict):
        print("kein JSON-Objekt")
        sys.exit(3)
    if not server_map(cfg):
        print("kein apps.http.servers enthalten")
        sys.exit(3)
    print("ok")

elif befehl == "norm":
    print(dump(lade(sys.argv[2])))

elif befehl == "kern":
    cfg = lade(sys.argv[2])
    apps = cfg.get("apps") or {}
    print(dump({"http": apps.get("http"), "tls": apps.get("tls")}))

elif befehl == "hosts":
    acc = set()
    hosts_sammeln(lade(sys.argv[2]), acc)
    for h in sorted(acc):
        print(h)

elif befehl == "routen":
    cfg = lade(sys.argv[2])
    gesucht = sys.argv[3]
    ergebnis = {}
    for name, srv in server_map(cfg).items():
        treffer = [r for r in (srv.get("routes") or []) if gesucht in route_hosts(r)]
        if treffer:
            ergebnis[name] = treffer
    print(dump(ergebnis))

elif befehl == "catchall":
    cfg = lade(sys.argv[2])
    anzahl = 0
    for name, srv in server_map(cfg).items():
        for route in (srv.get("routes") or []):
            if not route_hosts(route):
                anzahl += 1
    print(anzahl)

elif befehl == "ohne":
    # Entfernt AUSSCHLIESSLICH das, was zu unseren Domains gehört. Bleibt danach
    # ein Unterschied zum Vorher-Stand, war die Änderung nicht rein additiv.
    cfg = lade(sys.argv[2])
    unsere = set(sys.argv[3:])
    srvmap = server_map(cfg)
    for name in list(srvmap.keys()):
        srv = srvmap[name]
        routen = srv.get("routes")
        if not isinstance(routen, list):
            continue
        gefiltert = [r for r in routen
                     if not (route_hosts(r) and route_hosts(r) <= unsere)]
        if routen and not gefiltert:
            # Dieser Server enthielt nur unsere Routen — es gab ihn vorher nicht.
            del srvmap[name]
            continue
        srv["routes"] = gefiltert
    tls = (cfg.get("apps") or {}).get("tls")
    if isinstance(tls, dict):
        automation = tls.get("automation")
        if isinstance(automation, dict) and isinstance(automation.get("policies"), list):
            automation["policies"] = [
                p for p in automation["policies"]
                if not (isinstance(p, dict) and p.get("subjects")
                        and set(p["subjects"]) <= unsere)]
    print(dump(cfg))

elif befehl == "holen":
    url = sys.argv[2]
    ziel = sys.argv[3] if len(sys.argv) > 3 else ""
    anfrage = urllib.request.Request(
        url, headers={"User-Agent": "newedge-caddy-einbinden"})
    try:
        with urllib.request.urlopen(anfrage, timeout=15) as antwort:
            inhalt = antwort.read(20000000)
            code = antwort.status
    except urllib.error.HTTPError as fehler:
        inhalt = fehler.read(20000)
        code = fehler.code
    except Exception as fehler:  # noqa: BLE001
        sys.stderr.write("Fehler: %s\n" % fehler)
        print("000")
        sys.exit(4)
    if ziel:
        with open(ziel, "wb") as f:
            f.write(inhalt)
    print(code)

elif befehl == "senden":
    url = sys.argv[2]
    with open(sys.argv[3], "rb") as f:
        nutzlast = f.read()
    anfrage = urllib.request.Request(
        url, data=nutzlast,
        headers={"Content-Type": "application/json",
                 "User-Agent": "newedge-caddy-einbinden"},
        method="POST")
    try:
        with urllib.request.urlopen(anfrage, timeout=60) as antwort:
            print(antwort.status)
    except urllib.error.HTTPError as fehler:
        sys.stderr.write(fehler.read(4000).decode("utf-8", "replace") + "\n")
        print(fehler.code)
        sys.exit(5)
    except Exception as fehler:  # noqa: BLE001
        sys.stderr.write(str(fehler) + "\n")
        print("000")
        sys.exit(5)

elif befehl == "dns":
    try:
        infos = socket.getaddrinfo(sys.argv[2], None, socket.AF_INET, socket.SOCK_STREAM)
    except Exception as fehler:  # noqa: BLE001
        sys.stderr.write(str(fehler) + "\n")
        sys.exit(6)
    for adresse in sorted({eintrag[4][0] for eintrag in infos}):
        print(adresse)

elif befehl == "probe":
    probe(sys.argv[2], sys.argv[3], int(sys.argv[4]), sys.argv[5])

else:
    sys.stderr.write("Unbekannter Unterbefehl: %s\n" % befehl)
    sys.exit(2)
PYEOF
chmod 700 "$PY" 2>/dev/null || true

# Sofort gegenprüfen, dass python3 das Hilfsprogramm überhaupt einliest —
# ein Syntaxfehler soll hier auffallen und nicht mitten im Beweis.
python3 -c "import py_compile,sys; py_compile.compile(sys.argv[1], doraise=True)" "$PY" >/dev/null 2>&1 \
  || abbruch "Das Hilfsprogramm $PY lässt sich von python3 nicht übersetzen." \
             "Das deutet auf ein beschädigtes Skript oder ein sehr altes python3 hin." \
             "Benötigt wird python3 ≥ 3.6."

# ── HTTP-Hüllen (curl bevorzugt, sonst python3) ─────────────────────────────
http_status() {
  # $1 = URL. Ausgabe: Statuscode, "000" bei Verbindungsfehler.
  local url="$1" code
  if [ "$HTTP_ART" = curl ]; then
    code="$(curl -s -o /dev/null -m 15 -w '%{http_code}' "$url" 2>/dev/null || true)"
  else
    code="$(python3 "$PY" holen "$url" 2>/dev/null || true)"
  fi
  [ -n "$code" ] || code="000"
  printf '%s' "$code"
}

http_nach_datei() {
  # $1 = URL, $2 = Zieldatei. Rückgabe 0 nur bei Status 200.
  local url="$1" ziel="$2" code
  if [ "$HTTP_ART" = curl ]; then
    code="$(curl -s -m 20 -o "$ziel" -w '%{http_code}' "$url" 2>/dev/null || true)"
  else
    code="$(python3 "$PY" holen "$url" "$ziel" 2>/dev/null || true)"
  fi
  [ "$code" = "200" ]
}

# ═══════════════════════════════════════════════════════════════════════════
# P2 — Welches Binary, welche Konfigurationsdatei? Nicht raten, ableiten.
# ═══════════════════════════════════════════════════════════════════════════
say "[P2] Caddy-Dienst und maßgebliche Konfigurationsdatei bestimmen"

DIENST_AKTIV="$(systemctl is-active caddy 2>/dev/null || true)"
[ "$DIENST_AKTIV" = "active" ] || abbruch \
  "caddy.service ist nicht aktiv (Status: ${DIENST_AKTIV:-unbekannt})." \
  "Dieses Skript hängt eine Site in einen LAUFENDEN Caddy ein und beweist" \
  "danach, dass der fremde Dienst dahinter unverändert weiterläuft. Läuft" \
  "Caddy nicht, gibt es weder etwas zu beweisen noch etwas neu zu laden." \
  "" \
  "Läuft Caddy im Container? Dann ist der Einbau Handarbeit:" \
  "$RUNBOOK, Abschnitt 6."

EXECSTART="$(systemctl show caddy -p ExecStart --value 2>/dev/null || true)"
[ -n "$EXECSTART" ] || abbruch \
  "ExecStart von caddy.service ist nicht auslesbar." \
  "Ohne ExecStart lässt sich weder das Binary noch die maßgebliche" \
  "Konfigurationsdatei bestimmen. Bitte 'systemctl cat caddy' ansehen und" \
  "nach $RUNBOOK, Abschnitt 2, von Hand vorgehen."

# systemd liefert ExecStart als { path=… ; argv[]=… ; ignore_errors=… ; … }
CADDY_BIN="$(printf '%s' "$EXECSTART" | sed -n 's/.*path=\([^ ;]*\).*/\1/p' | head -n1)"
ARGV="$(printf '%s' "$EXECSTART" | sed -n 's/.*argv\[\]=\([^;]*\);.*/\1/p' | head -n1)"
[ -n "$CADDY_BIN" ] || abbruch "Aus ExecStart lässt sich kein Programmpfad lesen: $EXECSTART"
[ -x "$CADDY_BIN" ] || abbruch "Caddy-Binary nicht ausführbar: $CADDY_BIN"

# --config aus der Argumentliste holen; beide Schreibweisen zulassen.
CADDYFILE="$(printf '%s' "$ARGV" | awk '
  {
    for (i = 1; i <= NF; i++) {
      if ($i == "--config" && i < NF) { print $(i+1); exit }
      if ($i ~ /^--config=/)          { sub(/^--config=/, "", $i); print $i; exit }
    }
  }')"
[ -n "$CADDYFILE" ] || abbruch \
  "In ExecStart steht kein --config." \
  "argv: $ARGV" \
  "" \
  "Ohne --config lädt Caddy aus einer anderen Quelle (Autosave-JSON, eingebauter" \
  "Default). Dann wäre eine geänderte Caddyfile wirkungslos — oder, schlimmer," \
  "ein reload würde etwas ganz anderes laden als das, was hier geprüft wurde."

case " $ARGV " in
  *" --resume "*)
    abbruch \
      "caddy.service startet mit --resume." \
      "Dann ist die zuletzt über die Admin-API gespeicherte JSON die Quelle der" \
      "Wahrheit — nicht $CADDYFILE. Ein Einbau über die Datei wäre wirkungslos" \
      "oder würde beim nächsten Start Fremdänderungen verwerfen." \
      "" \
      "Bitte mit dem Serverbetreiber klären. $RUNBOOK, Abschnitt 2." ;;
esac

ADAPTER="$(printf '%s' "$ARGV" | awk '
  {
    for (i = 1; i <= NF; i++) {
      if ($i == "--adapter" && i < NF) { print $(i+1); exit }
      if ($i ~ /^--adapter=/)          { sub(/^--adapter=/, "", $i); print $i; exit }
    }
  }')"
if [ -n "$ADAPTER" ] && [ "$ADAPTER" != "caddyfile" ]; then
  abbruch \
    "caddy.service benutzt den Adapter '$ADAPTER', nicht 'caddyfile'." \
    "Dann ist $CADDYFILE keine Caddyfile, und der fertige Site-Block aus" \
    "$VORLAGE passt syntaktisch nicht dazu."
fi

EXECRELOAD="$(systemctl show caddy -p ExecReload --value 2>/dev/null || true)"
case "$EXECRELOAD" in
  *"caddy reload"*|*"caddy"*"reload"*) ;;
  "")
    abbruch \
      "caddy.service kennt kein ExecReload." \
      "Dann würde 'systemctl reload caddy' fehlschlagen — oder systemd fiele auf" \
      "einen Neustart zurück, und der fremde Dienst wäre kurz offline." \
      "Bitte von Hand nach $RUNBOOK, Abschnitt 5, vorgehen." ;;
  *)
    abbruch \
      "ExecReload von caddy.service tut etwas anderes als 'caddy reload':" \
      "    $EXECRELOAD" \
      "" \
      "Ein Reload muss die Konfiguration im laufenden Prozess tauschen. Alles" \
      "andere (restart, stop/start) nimmt den fremden Dienst kurz vom Netz." ;;
esac

# Und jetzt die Frage, an der alles hängt: LÄDT der Reload überhaupt DIE Datei,
# die hier geprüft, gesichert und beschrieben wird?
# 'caddy reload' nimmt seinen eigenen --config-Wert, NICHT den von ExecStart.
# Weichen die beiden ab, prüfen und sichern wir Datei A und laden Datei B — im
# schlimmsten Fall einen alten Stand ohne die Site-Blöcke des fremden Dienstes.
# Der Reload würde dessen Routen dann ersatzlos aus dem laufenden Prozess
# entfernen, und der Rückbau könnte es nicht heilen, weil er über denselben
# falschen Reload läuft. Deshalb hier vergleichen, nicht hoffen.
RELOAD_ARGV="$(printf '%s' "$EXECRELOAD" | sed -n 's/.*argv\[\]=\([^;]*\);.*/\1/p' | head -n1)"
RELOAD_CONFIG="$(printf '%s' "$RELOAD_ARGV" | awk '
  {
    for (i = 1; i <= NF; i++) {
      if ($i == "--config" && i < NF) { print $(i+1); exit }
      if ($i ~ /^--config=/)          { sub(/^--config=/, "", $i); print $i; exit }
    }
  }')"
[ -n "$RELOAD_CONFIG" ] || abbruch \
  "In ExecReload von caddy.service steht kein --config." \
  "    $EXECRELOAD" \
  "" \
  "'caddy reload' ohne --config sucht eine Caddyfile im ARBEITSVERZEICHNIS des" \
  "Dienstes. Was dabei geladen würde, ist nicht vorhersagbar — geprüft und" \
  "gesichert wird hier aber $CADDYFILE. Bitte die Unit geradeziehen" \
  "('systemctl cat caddy') oder von Hand nach $RUNBOOK, Abschnitt 5, vorgehen."
RELOAD_CONFIG_ABS="$(readlink -f "$RELOAD_CONFIG" 2>/dev/null || printf '%s' "$RELOAD_CONFIG")"
CADDYFILE_ABS="$(readlink -f "$CADDYFILE" 2>/dev/null || printf '%s' "$CADDYFILE")"
[ "$RELOAD_CONFIG_ABS" = "$CADDYFILE_ABS" ] || abbruch \
  "ExecStart und ExecReload von caddy.service benennen VERSCHIEDENE Konfigurationsdateien." \
  "    ExecStart  → $CADDYFILE_ABS" \
  "    ExecReload → $RELOAD_CONFIG_ABS" \
  "" \
  "Dieses Skript prüft, sichert und beschreibt die Datei aus ExecStart —" \
  "'systemctl reload caddy' lädt aber die aus ExecReload. Enthält die einen" \
  "anderen (z. B. älteren) Stand, nähme der Reload dem fremden Dienst seine" \
  "Routen weg, und der Rückbau könnte das nicht rückgängig machen, weil er" \
  "über denselben Reload läuft." \
  "" \
  "Bitte mit dem Serverbetreiber klären ('systemctl cat caddy')."

MAINPID_VORHER="$(systemctl show caddy -p MainPID --value 2>/dev/null || true)"
case "$MAINPID_VORHER" in
  ''|0|*[!0-9]*) abbruch "MainPID von caddy.service ist nicht auslesbar (Wert: '${MAINPID_VORHER:-leer}')." ;;
esac
NRESTARTS_VORHER="$(systemctl show caddy -p NRestarts --value 2>/dev/null || echo "?")"
CADDY_USER="$(systemctl show caddy -p User --value 2>/dev/null || true)"
[ -n "$CADDY_USER" ] || CADDY_USER="caddy"

# Gegenprobe: läuft wirklich DAS Binary, das wir gleich zum Adaptieren benutzen?
# Adaptiert eine andere Version als die laufende, rauscht jeder Vergleich.
LAUFENDES_BIN="$(readlink -f "/proc/$MAINPID_VORHER/exe" 2>/dev/null || true)"
ERWARTETES_BIN="$(readlink -f "$CADDY_BIN" 2>/dev/null || printf '%s' "$CADDY_BIN")"
[ -n "$LAUFENDES_BIN" ] || abbruch \
  "/proc/$MAINPID_VORHER/exe ist nicht lesbar." \
  "Damit lässt sich nicht belegen, dass der laufende Prozess dasselbe Binary" \
  "benutzt wie das, mit dem hier geprüft würde."
[ "$LAUFENDES_BIN" = "$ERWARTETES_BIN" ] || abbruch \
  "Der laufende Caddy benutzt ein anderes Binary als ExecStart angibt." \
  "    laufend:  $LAUFENDES_BIN" \
  "    ExecStart: $ERWARTETES_BIN" \
  "" \
  "Zwischen Adapter-Versionen wandert das JSON-Schema. Ein Vergleich 'Datei" \
  "gegen laufenden Stand' wäre dann nicht aussagekräftig — und genau der" \
  "Vergleich ist hier das Sicherheitsnetz. Vermutlich wurde Caddy aktualisiert," \
  "aber nie neu gestartet."

[ -f "$CADDYFILE" ] || abbruch "Konfigurationsdatei existiert nicht: $CADDYFILE"
[ -r "$CADDYFILE" ] || abbruch "Konfigurationsdatei nicht lesbar: $CADDYFILE"
[ -s "$CADDYFILE" ] || abbruch \
  "Konfigurationsdatei ist leer: $CADDYFILE" \
  "Eine leere Datei kann nicht der Stand sein, aus dem der laufende Dienst" \
  "kommt. Hier stimmt etwas Grundsätzliches nicht."

CADDY_DIR="$(cd "$(dirname "$CADDYFILE")" && pwd)"
CADDY_VERSION="$("$CADDY_BIN" version 2>/dev/null | head -n1 || true)"

ok "Dienst aktiv · PID $MAINPID_VORHER · Benutzer '$CADDY_USER'"
info "Binary:        $CADDY_BIN  ${CADDY_VERSION:+($CADDY_VERSION)}"
info "Konfiguration: $CADDYFILE"

# ═══════════════════════════════════════════════════════════════════════════
# P3 — Systemdienst oder Container? Der Unterschied entscheidet alles.
# ═══════════════════════════════════════════════════════════════════════════
say "[P3] Systemdienst oder Container"

pids_auf_port() {
  local port="$1"
  if [ "$PORT_TOOL" = ss ]; then
    ss -ltnp 2>/dev/null | awk -v re=":$port\$" '
      NR > 1 && $4 ~ re {
        rest = $0
        while (match(rest, /pid=[0-9]+/)) {
          print substr(rest, RSTART + 4, RLENGTH - 4)
          rest = substr(rest, RSTART + RLENGTH)
        }
      }' | sort -u
  else
    lsof -nP -iTCP:"$port" -sTCP:LISTEN 2>/dev/null | awk 'NR > 1 { print $2 }' | sort -u
  fi
}

PIDS_443="$(pids_auf_port 443 || true)"
PIDS_2019="$(pids_auf_port 2019 || true)"
PID_443="$(printf '%s\n' "$PIDS_443" | sed '/^$/d' | head -n1)"
PID_2019="$(printf '%s\n' "$PIDS_2019" | sed '/^$/d' | head -n1)"

DOCKER_WEB=""
if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  DOCKER_WEB="$(docker ps --filter publish=80 --filter publish=443 \
                          --format '{{.Names}} ({{.Image}})' 2>/dev/null || true)"
fi

# Fall 1: kein Host-Socket auf 443, aber ein Container veröffentlicht ihn.
# Das ist Docker mit "userland-proxy": false — DNAT statt Socket.
if [ -z "$PID_443" ] && [ -n "$DOCKER_WEB" ]; then
  abbruch \
    "Port 443 wird von einem Container gehalten, nicht von einem Host-Prozess." \
    "    $DOCKER_WEB" \
    "" \
    "Ein Caddy im Container erreicht weder 127.0.0.1:1337 (das ist dort der" \
    "Container selbst) noch $WEB_ROOT/dist (nicht gemountet). Der Site-Block" \
    "würde validieren und danach 502 liefern. Beides ließe sich nur über die" \
    "fremde Compose-Datei und einen Container-NEUSTART herstellen — und der" \
    "nimmt Mattermost kurz vom Netz." \
    "" \
    "Vorgehen: $RUNBOOK, Abschnitt 6 (Fall C). Erst abstimmen, dann handeln."
fi

[ -n "$PID_443" ] || abbruch \
  "Auf Port 443 lauscht niemand, und kein Container veröffentlicht ihn." \
  "Dann bedient dieser Caddy gar keinen HTTPS-Verkehr — hier stimmt die" \
  "Annahme nicht, auf die dieses Skript gebaut ist."

# Fall 2: der Lauscher ist ein Container-Prozess (auch network_mode: host).
PID443_ROOT="$(readlink "/proc/$PID_443/root" 2>/dev/null || true)"
if [ -n "$PID443_ROOT" ] && [ "$PID443_ROOT" != "/" ]; then
  abbruch \
    "Der Prozess auf Port 443 (PID $PID_443) läuft in einem eigenen Dateisystem-Root." \
    "    /proc/$PID_443/root → $PID443_ROOT" \
    "" \
    "Das ist ein Container. Siehe $RUNBOOK, Abschnitt 6."
fi
if [ -r "/proc/$PID_443/cgroup" ] && grep -qE '(docker|containerd|libpod)' "/proc/$PID_443/cgroup" 2>/dev/null; then
  abbruch \
    "Der Prozess auf Port 443 (PID $PID_443) läuft in einer Container-cgroup." \
    "$(sed -n '1,3p' "/proc/$PID_443/cgroup" 2>/dev/null || true)" \
    "" \
    "Auch mit network_mode: host bleibt es ein Container — das Dateisystem und" \
    "127.0.0.1 sind dort andere als auf dem Host. $RUNBOOK, Abschnitt 6."
fi

# Fall 3: es lauscht zwar ein Caddy, aber nicht UNSER Dienst.
[ "$PID_443" = "$MAINPID_VORHER" ] || abbruch \
  "Auf Port 443 lauscht PID $PID_443, der Dienst caddy.service hat aber PID $MAINPID_VORHER." \
  "Dann würden Sicherung, Reload und Rollback einen ANDEREN Caddy treffen als" \
  "den, der Mattermost bedient. Das ist der teuerste denkbare Irrtum — deshalb" \
  "hier Schluss."

# Fall 4: Admin-API muss zum selben Prozess gehören.
[ -n "$PID_2019" ] || abbruch \
  "Auf Port 2019 (Caddys Admin-API) lauscht niemand." \
  "Mögliche Gründe: 'admin off' in den globalen Optionen, ein abweichender" \
  "Admin-Port, oder ein anderer Netzwerk-Namensraum." \
  "" \
  "Ohne Admin-API gibt es keinen Schnappschuss der LAUFENDEN Konfiguration —" \
  "und damit weder den Beweis, dass $CADDYFILE der laufende Stand ist, noch" \
  "den Notfall-Rückweg. Prüfen:" \
  "    grep -n admin $CADDYFILE" \
  "    ss -tlnp '( sport = :2019 )'"
[ "$PID_2019" = "$PID_443" ] || abbruch \
  "Die Admin-API (PID $PID_2019) gehört zu einem anderen Prozess als Port 443 (PID $PID_443)." \
  "Dann würde der Schnappschuss einen anderen Caddy beschreiben als den, der" \
  "gleich neu lädt."

ok "Caddy ist ein Systemdienst auf dem Host (PID $MAINPID_VORHER hält 443 und 2019)"

# ═══════════════════════════════════════════════════════════════════════════
# P4 — Sicherung. Liest nur, schreibt ausschließlich ins Arbeitsverzeichnis.
# ═══════════════════════════════════════════════════════════════════════════
say "[P4] Sicherung anlegen"

cp -a "$CADDYFILE" "$W/Caddyfile.orig" || abbruch "Sicherungskopie schlug fehl: $CADDYFILE"
HASH_ORIG="$(datei_hash "$W/Caddyfile.orig")"
[ -n "$HASH_ORIG" ] || abbruch "Prüfsumme der Sicherungskopie lässt sich nicht bilden."
printf '%s  %s\n' "$HASH_ORIG" "$CADDYFILE" >"$W/Caddyfile.orig.sha256"

{ systemctl cat caddy 2>/dev/null || true
  echo
  systemctl show caddy -p MainPID,NRestarts,User,Group,ExecStart,ExecReload,Environment,EnvironmentFile 2>/dev/null || true
} >"$W/caddy-unit.txt"

# Laufende Konfiguration aus der Admin-API — das Rettungsnetz für den Notfall.
if ! http_nach_datei "http://127.0.0.1:2019/config/" "$W/live-vorher.json"; then
  abbruch \
    "Die laufende Konfiguration ließ sich nicht über http://127.0.0.1:2019/config/ holen." \
    "Ohne diesen Schnappschuss gibt es keinen Notfall-Rückweg (POST /load) und" \
    "keinen Beweis, dass $CADDYFILE dem laufenden Stand entspricht." \
    "" \
    "Prüfen:  grep -n admin $CADDYFILE     ·     ss -tlnp '( sport = :2019 )'"
fi
LIVE_PRUEFUNG="$(python3 "$PY" pruefe "$W/live-vorher.json" 2>&1 || true)"
[ "$LIVE_PRUEFUNG" = "ok" ] || abbruch \
  "Die Antwort der Admin-API ist keine brauchbare Konfiguration ($LIVE_PRUEFUNG)." \
  "Erwartet wird ein JSON-Objekt mit apps.http.servers. Kommt 'null' oder ein" \
  "leerer Körper zurück, ist der Notfallweg aus $RUNBOOK, Abschnitt 7, nicht" \
  "vorhanden — dann wird hier nichts angefasst."

# Und die Datei adaptieren, um beides vergleichen zu können.
adapt_nach() {
  # $1 = Konfigurationsdatei, $2 = Ziel-JSON, $3 = Fehlerprotokoll
  "$CADDY_BIN" adapt --config "$1" --adapter caddyfile >"$2" 2>"$3"
}

if ! adapt_nach "$CADDYFILE" "$W/adapt-vorher.json" "$W/adapt-vorher.err"; then
  abbruch \
    "'caddy adapt' scheitert bereits an der UNVERÄNDERTEN Bestandsdatei." \
    "$(sed -n '1,8p' "$W/adapt-vorher.err" 2>/dev/null || true)" \
    "" \
    "Der Dienst läuft dann aus einem älteren Stand, als in der Datei steht." \
    "Hier nichts anfassen: ein Reload würde diesen Fehler scharf schalten."
fi
if ! "$CADDY_BIN" validate --config "$CADDYFILE" --adapter caddyfile >"$W/validate-vorher.log" 2>&1; then
  abbruch \
    "'caddy validate' scheitert an der UNVERÄNDERTEN Bestandsdatei $CADDYFILE." \
    "$(sed -n '1,8p' "$W/validate-vorher.log" 2>/dev/null || true)" \
    "" \
    "Der laufende Dienst kommt dann aus einem anderen Stand als die Datei." \
    "Ein Reload würde die kaputte Datei laden — und Mattermost mitnehmen."
fi

# Bestandsinventar: was gab es vorher schon? Der Rückbau darf nichts löschen,
# was er nicht selbst angelegt hat.
# ACHTUNG: $CONF_DIR kann in P6 (Fall A) noch auf das Verzeichnis eines
# BESTEHENDEN import-Musters umgesetzt werden. Ob es vorher schon da war, wird
# deshalb erst NACH dieser Entscheidung festgehalten — sonst hielte der Rückbau
# ein fremdes Verzeichnis für seines und würde es entfernen.
{
  echo "caddyfile=$CADDYFILE"
  echo "caddy_bin=$CADDY_BIN"
  echo "caddy_user=$CADDY_USER"
  echo "mainpid_vorher=$MAINPID_VORHER"
  echo "nrestarts_vorher=$NRESTARTS_VORHER"
  echo "hash_orig=$HASH_ORIG"
} >"$W/bestand.txt"

ok "Gesichert: Caddyfile.orig · live-vorher.json · adapt-vorher.json · caddy-unit.txt"

# ═══════════════════════════════════════════════════════════════════════════
# P5 — Die entscheidende Frage: stammt der LAUFENDE Stand aus dieser Datei?
# ═══════════════════════════════════════════════════════════════════════════
# Caddys Admin-API erlaubt Änderungen zur Laufzeit, ohne die Datei anzufassen.
# Hat das jemand getan, würde unser reload dem fremden Dienst genau diese
# Änderung wegnehmen — und der dateibasierte Rollback holte sie NICHT zurück.
# Deshalb ist das hier ein Abbruch VOR dem Reload, keine Diagnose danach.
say "[P5] Stammt die laufende Konfiguration aus $CADDYFILE?"

python3 "$PY" norm "$W/adapt-vorher.json" >"$W/adapt-vorher.norm" 2>/dev/null \
  || abbruch "adapt-vorher.json lässt sich nicht normalisieren."
python3 "$PY" norm "$W/live-vorher.json"  >"$W/live-vorher.norm"  2>/dev/null \
  || abbruch "live-vorher.json lässt sich nicht normalisieren."

WAHRHEIT="streng"
if ! diff -q "$W/adapt-vorher.norm" "$W/live-vorher.norm" >/dev/null 2>&1; then
  # Stufe 2: der sicherheitsrelevante Ausschnitt muss identisch sein.
  # (Abweichungen in admin/logging/pki sind erwartbar und unkritisch.)
  WAHRHEIT="kern"
  python3 "$PY" kern "$W/adapt-vorher.json" >"$W/adapt-vorher.kern" 2>/dev/null || true
  python3 "$PY" kern "$W/live-vorher.json"  >"$W/live-vorher.kern"  2>/dev/null || true
  if ! diff -q "$W/adapt-vorher.kern" "$W/live-vorher.kern" >/dev/null 2>&1; then
    diff -u "$W/adapt-vorher.kern" "$W/live-vorher.kern" >"$W/wahrheit.diff" 2>&1 || true
    echo
    err "Unterschied zwischen Datei und laufendem Stand (Auszug):"
    sed -n '1,40p' "$W/wahrheit.diff" 2>/dev/null | sed 's/^/      /' || true
    HINWEIS_PLATZHALTER=""
    grep -q '{\$' "$CADDYFILE" 2>/dev/null && HINWEIS_PLATZHALTER="Die Datei enthält {\$…}-Platzhalter. Sie werden beim Adaptieren aus der Umgebung des adaptierenden Prozesses ersetzt — systemd hat eine andere (siehe $W/caddy-unit.txt). Das allein kann den Unterschied erklären."
    abbruch \
      "Der laufende Stand entspricht NICHT dem, was $CADDYFILE ergibt (Teil http/tls)." \
      "Vollständiger Unterschied: $W/wahrheit.diff" \
      "" \
      "Wahrscheinlichste Ursache: jemand hat die laufende Konfiguration über die" \
      "Admin-API geändert, ohne die Datei nachzuziehen — oder die Datei wurde" \
      "editiert und nie geladen. In beiden Fällen würde ein Reload den fremden" \
      "Dienst verändern, und das Datei-Backup könnte es nicht rückgängig machen." \
      "${HINWEIS_PLATZHALTER:-}" \
      "" \
      "Weitere mögliche Ursachen: relative import-Muster, die aus einem anderen" \
      "Verzeichnis ins Leere laufen, oder eine andere Caddy-Version." \
      "" \
      "Bitte mit dem Serverbetreiber klären. $RUNBOOK, Abschnitt 2."
  fi
fi

if [ "$WAHRHEIT" = "streng" ]; then
  ok "Laufender Stand und Datei sind identisch (vollständiger Vergleich)"
else
  ok "Laufender Stand und Datei sind in apps.http und apps.tls identisch"
  info "(Unterschiede nur außerhalb — z. B. admin, logging, pki. Unkritisch.)"
fi

# Fallen benennen, auch wenn der Vergleich gehalten hat: sie erklären spätere
# Abweichungen und entscheiden über den Ablageort der Probierkopie.
if grep -q '{\$' "$CADDYFILE" 2>/dev/null; then
  warn "Die Bestandsdatei benutzt {\$…}-Platzhalter aus der Umgebung."
  info "Der Vergleich oben hat trotzdem gehalten — geladen wird ohnehin über"
  info "systemd (ExecReload), also mit der richtigen Umgebung."
fi
RELATIVE_IMPORTE="$(grep -nE '^[[:space:]]*import[[:space:]]+[^/[:space:]]' "$CADDYFILE" 2>/dev/null || true)"
if [ -n "$RELATIVE_IMPORTE" ]; then
  warn "Die Bestandsdatei benutzt RELATIVE import-Muster:"
  printf '%s\n' "$RELATIVE_IMPORTE" | sed 's/^/      /'
  info "Die Probierkopie muss deshalb im selben Verzeichnis liegen ($CADDY_DIR),"
  info "sonst laufen diese Muster ins Leere und der Vergleich meldet Unsinn."
fi

# ═══════════════════════════════════════════════════════════════════════════
# P6 — Struktur der Bestandsdatei: wo ist „oberste Ebene"?
# ═══════════════════════════════════════════════════════════════════════════
# Ein EINGERÜCKTES 'import' steht in einem Site-Block und würde unsere Site in
# den fremden Block hineinziehen. Ein 'grep import' kann das nicht unterscheiden
# — deshalb hier ein klammer- und kommentarbewusster Durchlauf, der für jede
# Zeile die Klammertiefe kennt.
#
# Caddyfile-Syntax macht das eindeutig: eine öffnende Klammer steht IMMER am
# Zeilenende, eine schließende IMMER am Zeilenanfang. Deshalb werden nicht alle
# Klammern gezählt (das würde an Platzhaltern wie {path} scheitern), sondern nur
# diese beiden Formen.
say "[P6] Struktur der Bestandsdatei prüfen"

struktur_scan() {
  awk '
    function ist_leer(s) { return (s == "") }
    {
      raw = $0
      code = ""; inq = 0; q = ""
      n = length(raw)
      for (i = 1; i <= n; i++) {
        c = substr(raw, i, 1)
        if (inq) {
          if (c == "\\") { i++; c = substr(raw, i, 1)
                           if (c == "{" || c == "}" || c == "#") c = "_"
                           code = code c; continue }
          if (c == q) { inq = 0; q = ""; continue }
          if (c == "{" || c == "}" || c == "#") c = "_"
          code = code c
          continue
        }
        if (c == "\"" || c == "`") { inq = 1; q = c; continue }
        if (c == "#" && (i == 1 || substr(raw, i - 1, 1) ~ /[ \t]/)) break
        code = code c
      }
      t = code
      gsub(/^[ \t]+/, "", t); gsub(/[ \t]+$/, "", t)

      if (fortsetzung) { fortsetzung = (t ~ /\\$/); next }
      if (ist_leer(t)) next

      d0 = tiefe
      schliesst = (substr(t, 1, 1) == "}")
      oeffnet   = (t ~ /\{$/)
      if (schliesst) {
        tiefe--
        if (tiefe < 0) { print "NEGATIV " NR; tiefe = 0 }
        d0 = tiefe
      }
      if (oeffnet) tiefe++

      if (t ~ /\\$/) { fortsetzung = 1 }

      if (d0 == 0) {
        if (t ~ /^import([ \t]|$)/) {
          print "TOPIMPORT " NR " " t
        } else if (!oeffnet && t != "}" && !fortsetzung) {
          print "BADLINE " NR " " t
        }
      }
    }
    END { print "TIEFE " tiefe+0 }
  ' "$1"
}

STRUKTUR="$(struktur_scan "$CADDYFILE" || true)"
[ -n "$STRUKTUR" ] || abbruch "Die Struktur von $CADDYFILE ließ sich nicht auswerten."

if printf '%s\n' "$STRUKTUR" | grep -q '^NEGATIV '; then
  abbruch \
    "In $CADDYFILE schließt eine Klammer, die nie geöffnet wurde:" \
    "$(printf '%s\n' "$STRUKTUR" | grep '^NEGATIV ' | head -n3)" \
    "" \
    "Die Datei ist damit nicht sicher deutbar. Bitte von Hand ansehen."
fi

ENDTIEFE="$(printf '%s\n' "$STRUKTUR" | awk '$1 == "TIEFE" { print $2 }' | tail -n1)"
[ "${ENDTIEFE:-1}" = "0" ] || abbruch \
  "$CADDYFILE endet auf Klammertiefe ${ENDTIEFE:-?}, nicht auf 0." \
  "Anhängen ans Dateiende wäre dann KEIN Anhängen auf oberster Ebene — die" \
  "import-Zeile landete in einem offenen Block, vermutlich im Block des" \
  "fremden Dienstes. Genau das soll hier nie passieren."

BADLINES="$(printf '%s\n' "$STRUKTUR" | grep '^BADLINE ' || true)"
if [ -n "$BADLINES" ]; then
  abbruch \
    "$CADDYFILE enthält auf oberster Ebene Zeilen, die weder Site-Block noch import sind:" \
    "$(printf '%s\n' "$BADLINES" | head -n5 | sed 's/^BADLINE /    Zeile /')" \
    "" \
    "Das ist die Kurzform ohne Klammern (Form 3 im Runbook): die GANZE Datei" \
    "gilt dann als eine einzige Site. Ein zusätzlicher Site-Block macht sie" \
    "ungültig — auch für den fremden Dienst." \
    "" \
    "Der Umbau wäre, die bestehenden Zeilen in einen benannten Block zu" \
    "klammern. Das ist ein bewusster, angekündigter Schritt und passiert hier" \
    "nicht automatisch. $RUNBOOK, Abschnitt 3."
fi

TOPIMPORTE="$(printf '%s\n' "$STRUKTUR" | grep '^TOPIMPORT ' || true)"
ANZAHL_TOPIMPORTE=0
[ -n "$TOPIMPORTE" ] && ANZAHL_TOPIMPORTE="$(printf '%s\n' "$TOPIMPORTE" | wc -l | tr -d ' ')"
ok "Struktur in Ordnung (Endtiefe 0, $ANZAHL_TOPIMPORTE import-Zeile(n) auf oberster Ebene)"

# ── Ablageort unserer Datei bestimmen: Fall A oder Fall B ───────────────────
# Fall A = es gibt bereits ein import-Muster auf oberster Ebene, das unsere
#          Datei einsammelt. Dann wird $CADDYFILE ÜBERHAUPT NICHT angefasst.
# Fall B = es gibt keines. Dann kommt genau eine Zeile ans Dateiende.
SITE_ZIEL="$CONF_DIR/newedge.caddyfile"
FALL="B"
GENUTZTES_MUSTER=""

muster_absolut() {
  # Relative import-Muster sind relativ zum Verzeichnis der importierenden Datei.
  case "$1" in
    /*) printf '%s' "$1" ;;
    *)  printf '%s/%s' "$CADDY_DIR" "$1" ;;
  esac
}

pfad_aus_muster() {
  # Leitet aus einem Glob einen konkreten Dateinamen ab, der ihn erfüllt.
  # Leere Ausgabe = geht nicht (kein *, oder * im Verzeichnisteil).
  local muster="$1" verz basis name
  case "$muster" in
    *'*'*) ;;
    *)     printf ''; return 0 ;;
  esac
  verz="$(dirname "$muster")"
  basis="$(basename "$muster")"
  case "$verz" in
    *'*'*) printf ''; return 0 ;;
  esac
  case "$basis" in
    '*')   name="newedge.caddyfile" ;;
    '*'*)  name="newedge${basis#\*}" ;;
    *'*')  name="${basis%\*}newedge" ;;
    *)     name="$(printf '%s' "$basis" | sed 's/\*/newedge/')" ;;
  esac
  case "$name" in
    *'*'*) printf ''; return 0 ;;
  esac
  printf '%s/%s' "$verz" "$name"
}

MUSTERLISTE=()
if [ -n "$TOPIMPORTE" ]; then
  while IFS= read -r zeile; do
    [ -n "$zeile" ] || continue
    # Format: TOPIMPORT <nr> import <muster> [weitere args]
    m="$(printf '%s' "$zeile" | awk '{ print $4 }')"
    [ -n "$m" ] || continue
    MUSTERLISTE+=("$(muster_absolut "$m")")
  done <<<"$TOPIMPORTE"
fi

if [ "${#MUSTERLISTE[@]}" -gt 0 ]; then
  # a) Fängt eines der Muster unseren Wunschpfad schon ein?
  for m in "${MUSTERLISTE[@]}"; do
    # shellcheck disable=SC2053  # Mustervergleich ist hier ausdrücklich gewollt
    if [[ "$SITE_ZIEL" == $m ]]; then
      FALL="A"; GENUTZTES_MUSTER="$m"; break
    fi
  done
  # b) Sonst: bei GENAU EINEM Muster einen passenden Namen ableiten.
  #    Das fremde Muster wird dabei NIE umgeschrieben — wir passen uns an.
  if [ "$FALL" = "B" ]; then
    if [ "${#MUSTERLISTE[@]}" -eq 1 ]; then
      kandidat="$(pfad_aus_muster "${MUSTERLISTE[0]}")"
      if [ -n "$kandidat" ]; then
        # shellcheck disable=SC2053
        if [[ "$kandidat" == ${MUSTERLISTE[0]} ]]; then
          SITE_ZIEL="$kandidat"
          CONF_DIR="$(dirname "$kandidat")"
          FALL="A"; GENUTZTES_MUSTER="${MUSTERLISTE[0]}"
        fi
      fi
    fi
  fi
  if [ "$FALL" = "B" ]; then
    abbruch \
      "Es gibt import-Zeilen auf oberster Ebene, aber keine passt zu unserer Datei." \
      "$(printf '    %s\n' "${MUSTERLISTE[@]}")" \
      "" \
      "Eine zweite import-Zeile anzuhängen wäre zwar additiv, würde aber eine" \
      "fremde Datei ein zweites Mal anfassen, obwohl sie das Thema schon regelt." \
      "Ein bestehendes Muster umzuschreiben ist ausgeschlossen." \
      "" \
      "Von Hand entscheiden: unsere Datei so benennen, dass sie in eines der" \
      "Muster fällt, und dann erneut starten mit" \
      "    --conf-dir=<verzeichnis-des-musters>" \
      "$RUNBOOK, Abschnitt 4 (Fall A)."
  fi
fi

if [ "$FALL" = "A" ]; then
  ok "Fall A — bestehendes import-Muster sammelt unsere Datei ein: $GENUTZTES_MUSTER"
  info "$CADDYFILE wird ÜBERHAUPT NICHT angefasst."
  info "Ablage unserer Datei: $SITE_ZIEL"
else
  ok "Fall B — keine import-Zeile auf oberster Ebene"
  info "Es kommen genau zwei Zeilen ans DATEIENDE von $CADDYFILE"
  info "(ein Markerkommentar und 'import $CONF_DIR/*.caddyfile')."
  info "Ablage unserer Datei: $SITE_ZIEL"
fi

# Jetzt erst steht endgültig fest, WELCHES Verzeichnis gemeint ist. In Fall A
# gehört es dem Bestand — dann wird es weder in seinen Rechten verändert noch
# beim Rückbau entfernt.
CONF_DIR_EXISTIERT=0
[ -d "$CONF_DIR" ] && CONF_DIR_EXISTIERT=1
if [ "$CONF_DIR_EXISTIERT" -eq 1 ]; then
  info "Ablageverzeichnis $CONF_DIR existiert bereits — Rechte und Bestand bleiben unangetastet."
fi

# Liegt dort schon etwas Fremdes? Dann nicht überschreiben.
SITE_ZIEL_EXISTIERTE=0
EIGENE_FASSUNG=0        # 1 = es liegt bereits eine Fassung von UNS dort
if [ -e "$SITE_ZIEL" ]; then
  SITE_ZIEL_EXISTIERTE=1
  if grep -Fq "$SITE_MARKER" "$SITE_ZIEL" 2>/dev/null; then
    EIGENE_FASSUNG=1
    warn "$SITE_ZIEL existiert bereits und stammt von uns — sie wird ersetzt (Kopie im Arbeitsverzeichnis)."
    cp -a "$SITE_ZIEL" "$W/newedge.caddyfile.vorher" 2>/dev/null || true
  else
    abbruch \
      "$SITE_ZIEL existiert bereits und stammt NICHT von diesem Skript." \
      "Der Marker '$SITE_MARKER' fehlt darin." \
      "" \
      "Eine fremde Datei wird hier nicht überschrieben. Bitte ansehen und" \
      "entweder wegräumen oder mit --conf-dir=<anderes-verzeichnis> arbeiten."
  fi
fi
echo "conf_dir=$CONF_DIR"                  >>"$W/bestand.txt"
echo "conf_dir_existierte=$CONF_DIR_EXISTIERT"    >>"$W/bestand.txt"
echo "site_ziel=$SITE_ZIEL"                >>"$W/bestand.txt"
echo "site_ziel_existierte=$SITE_ZIEL_EXISTIERTE" >>"$W/bestand.txt"
echo "fall=$FALL"                          >>"$W/bestand.txt"

# ═══════════════════════════════════════════════════════════════════════════
# P6b — Kollisionen mit dem Bestand
# ═══════════════════════════════════════════════════════════════════════════
say "[P6] Kollisionen prüfen"

python3 "$PY" hosts "$W/adapt-vorher.json" >"$W/hosts-vorher.txt" 2>/dev/null \
  || abbruch "Die Host-Liste des Bestands ließ sich nicht ermitteln."

# Wird unsere Domain schon bedient? Zwei sehr verschiedene Fälle:
#   a) aus UNSERER eigenen, früher abgelegten Datei  → Wiederholungslauf, in
#      Ordnung. Die Vorher-/Nachher-Vergleiche rechnen unsere Domains auf BEIDEN
#      Seiten heraus, der Beweis bleibt also gültig.
#   b) aus einem fremden Block → Abbruch. (Zwei Blöcke für dieselbe Adresse
#      lehnt Caddy ohnehin ab; adapt oben ist durchgelaufen, also kann es neben
#      unserer Datei keinen zweiten Block für dieselbe Domain geben.)
DOMAIN_SCHON_DA=0
grep -Fxq "$DOMAIN" "$W/hosts-vorher.txt" 2>/dev/null && DOMAIN_SCHON_DA=1
grep -Fxq "$WWW_DOMAIN" "$W/hosts-vorher.txt" 2>/dev/null && DOMAIN_SCHON_DA=1
if [ "$DOMAIN_SCHON_DA" -eq 1 ]; then
  if [ "$EIGENE_FASSUNG" -eq 1 ]; then
    ok "Wiederholungslauf — $DOMAIN wird bereits von unserer eigenen Datei bedient"
    info "Der Additivitätsbeweis rechnet unsere Domains auf beiden Seiten heraus."
  else
    abbruch \
      "$DOMAIN (oder $WWW_DOMAIN) wird von der bestehenden Konfiguration bereits bedient," \
      "aber NICHT von einer Datei dieses Skripts ($SITE_ZIEL fehlt oder trägt" \
      "unseren Marker nicht)." \
      "" \
      "Bitte erst klären, wem der vorhandene Block gehört:" \
      "    grep -rn '$DOMAIN' $CADDY_DIR"
  fi
fi

# Fremde Hosts = alles außer unseren. Sie sind die Zielliste jeder Nachher-Prüfung.
MM_HOSTS=""
while IFS= read -r h; do
  [ -n "$h" ] || continue
  [ "$h" = "$DOMAIN" ] && continue
  [ "$h" = "$WWW_DOMAIN" ] && continue
  MM_HOSTS="$MM_HOSTS $h"
done <"$W/hosts-vorher.txt"
MM_HOSTS="$(printf '%s' "$MM_HOSTS" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
printf '%s\n' $MM_HOSTS >"$W/mm-hosts.txt" 2>/dev/null || true

if [ -z "$MM_HOSTS" ]; then
  warn "Die bestehende Konfiguration nennt keinen einzigen Hostnamen."
  info "Dann gibt es auch keinen fremden Dienst, dessen Unverändertheit sich"
  info "über Statuszeile und Zertifikat belegen ließe. Der Vergleich der"
  info "laufenden Konfiguration (vorher/nachher) greift trotzdem."
else
  ok "Fremde Hosts im Bestand: $MM_HOSTS"
fi

# Catch-all: eine Route ohne Host-Matcher fängt heute auch unsere Domain ab —
# nach dem Einbau nicht mehr. Das ist eine Verhaltensänderung an fremder
# Konfiguration, also standardmäßig ein Abbruch.
CATCHALL="$(python3 "$PY" catchall "$W/adapt-vorher.json" 2>/dev/null || echo "?")"
case "$CATCHALL" in
  0) ok "Keine Route ohne Host-Matcher im Bestand" ;;
  ''|'?') warn "Die Catch-all-Prüfung lieferte kein Ergebnis — bitte den Bestand von Hand ansehen." ;;
  *)
    if [ "$CATCHALL_OK" -eq 1 ]; then
      warn "$CATCHALL Route(n) ohne Host-Matcher im Bestand — per --catchall-erlauben überstimmt."
    else
      abbruch \
        "Im Bestand gibt es $CATCHALL Route(n) OHNE Host-Matcher (Catch-all, z. B. ':443 { … }')." \
        "So eine Route beantwortet heute JEDE Anfrage, für die es keinen" \
        "spezifischeren Block gibt — also auch Anfragen an $DOMAIN." \
        "Nach dem Einbau übernimmt unser Block diese Anfragen. Das ist eine" \
        "Verhaltensänderung an fremder Konfiguration, auch wenn keine Zeile" \
        "des fremden Blocks angefasst wird." \
        "" \
        "Ist das gewollt und abgestimmt, erneut starten mit --catchall-erlauben."
    fi ;;
esac

# ═══════════════════════════════════════════════════════════════════════════
# P6c — Unsere eigene Datei vorbereiten und selbst prüfen
# ═══════════════════════════════════════════════════════════════════════════
say "[P6] Site-Block vorbereiten (Kopie im Arbeitsverzeichnis)"

SITE_KOPIE="$W/newedge.caddyfile"
cp "$VORLAGE" "$SITE_KOPIE" || abbruch "Vorlage lässt sich nicht kopieren: $VORLAGE"
chmod 644 "$SITE_KOPIE" 2>/dev/null || true

# Domain und Ausrollpfad einsetzen. Beide Werte sind oben auf harmlose Zeichen
# geprüft; wirksam sind sie nur in der Adresszeile und in 'root *' — die
# übrigen Treffer stehen in Kommentaren und werden bloß mitgezogen.
sed -i -e "s/newedgebrand\.com/$DOMAIN/g" \
       -e "s|/var/www/newedgebrand/dist|$WEB_ROOT/dist|g" \
       "$SITE_KOPIE" || abbruch "Ersetzung in $SITE_KOPIE schlug fehl."

# Adresszeile finden: die erste Zeile ohne Einrückung, die auf '{' endet.
ADRESSZEILE_NR="$(grep -nE '^[^[:space:]#].*\{[[:space:]]*$' "$SITE_KOPIE" | head -n1 | cut -d: -f1 || true)"
[ -n "$ADRESSZEILE_NR" ] || abbruch \
  "In $SITE_KOPIE ist keine Adresszeile zu finden." \
  "Erwartet wird eine nicht eingerückte Zeile, die auf '{' endet."
ADRESSZEILE="$(sed -n "${ADRESSZEILE_NR}p" "$SITE_KOPIE")"

# ── DNS: zeigt die Domain überhaupt hierher? ───────────────────────────────
lokale_ipv4() {
  if command -v ip >/dev/null 2>&1; then
    ip -4 -o addr show 2>/dev/null | awk '{ print $4 }' | cut -d/ -f1
  elif command -v hostname >/dev/null 2>&1; then
    hostname -I 2>/dev/null | tr ' ' '\n'
  fi
}
LOKALE_IPS="$(lokale_ipv4 | sed '/^$/d' | sort -u || true)"
DNS_DOMAIN="$(python3 "$PY" dns "$DOMAIN" 2>/dev/null || true)"
DNS_WWW="$(python3 "$PY" dns "$WWW_DOMAIN" 2>/dev/null || true)"

if [ -z "$DNS_DOMAIN" ]; then
  if [ "$DNS_EGAL" -eq 1 ]; then
    warn "$DOMAIN löst nicht auf — per --dns-egal überstimmt. Caddy wird kein Zertifikat bekommen."
  else
    abbruch \
      "$DOMAIN löst zu keiner IPv4-Adresse auf." \
      "Caddy versucht direkt nach dem Reload ein Zertifikat zu holen. Ohne" \
      "A-Record scheitert das dauerhaft und füllt das Journal im Minutentakt." \
      "" \
      "Erst den A-Record setzen, dann erneut starten." \
      "Wenn das bewusst so ist: --dns-egal."
  fi
elif [ -n "$LOKALE_IPS" ]; then
  TREFFER=0
  for ip in $DNS_DOMAIN; do
    if printf '%s\n' "$LOKALE_IPS" | grep -Fxq "$ip"; then TREFFER=1; break; fi
  done
  if [ "$TREFFER" -eq 1 ]; then
    ok "$DOMAIN zeigt auf diesen Server ($(printf '%s' "$DNS_DOMAIN" | tr '\n' ' '))"
  elif [ "$DNS_EGAL" -eq 1 ]; then
    warn "$DOMAIN zeigt NICHT auf diesen Server — per --dns-egal überstimmt."
  else
    abbruch \
      "$DOMAIN zeigt nicht auf eine Adresse dieses Servers." \
      "    A-Record:    $(printf '%s' "$DNS_DOMAIN" | tr '\n' ' ')" \
      "    lokale IPs:  $(printf '%s' "$LOKALE_IPS" | tr '\n' ' ')" \
      "" \
      "Dann scheitert die ACME-Challenge und die Domain bekommt kein" \
      "Zertifikat — der Einbau wäre wirkungslos, das Journal voll." \
      "" \
      "Steht der Server hinter NAT oder einer Floating-IP, ist der Befund" \
      "erklärbar: dann --dns-egal mitgeben."
  fi
else
  warn "Die lokalen IP-Adressen ließen sich nicht ermitteln — DNS-Abgleich übersprungen."
fi

# www: ohne A-Record fliegt es aus der Adresszeile. Gezielt über die
# Zeilennummer, nicht per globalem sed.
WWW_AKTIV=1
if [ "$OHNE_WWW" -eq 1 ]; then
  WWW_AKTIV=0
  info "www wird auf Wunsch (--ohne-www) nicht beansprucht."
elif [ -z "$DNS_WWW" ]; then
  WWW_AKTIV=0
  warn "$WWW_DOMAIN hat keinen A-Record — www wird aus der Adresszeile entfernt."
  info "Später ergänzen: A-Record setzen, dieses Skript erneut laufen lassen."
fi

if [ "$WWW_AKTIV" -eq 0 ]; then
  NEUE_ADRESSZEILE="$(printf '%s' "$ADRESSZEILE" | awk -v weg="$WWW_DOMAIN" '
    {
      sub(/[[:space:]]*\{[[:space:]]*$/, "", $0)
      n = split($0, teile, ",")
      raus = ""
      for (i = 1; i <= n; i++) {
        t = teile[i]
        gsub(/^[[:space:]]+|[[:space:]]+$/, "", t)
        if (t == "" || t == weg) continue
        raus = (raus == "") ? t : raus ", " t
      }
      print raus " {"
    }')"
  [ -n "$NEUE_ADRESSZEILE" ] || abbruch "Die Adresszeile ließe sich ohne www nicht neu bilden."
  awk -v nr="$ADRESSZEILE_NR" -v neu="$NEUE_ADRESSZEILE" \
      'NR == nr { print neu; next } { print }' "$SITE_KOPIE" >"$SITE_KOPIE.tmp" \
    && mv "$SITE_KOPIE.tmp" "$SITE_KOPIE" \
    || abbruch "Adresszeile ließ sich nicht ersetzen."
  ADRESSZEILE="$NEUE_ADRESSZEILE"
fi

# ── Selbstprüfung: ist unsere Datei noch genau EIN Site-Block? ─────────────
UNINDENTIERT="$(grep -cE '^[^[:space:]#]' "$SITE_KOPIE" || true)"
[ "${UNINDENTIERT:-0}" -eq 2 ] || abbruch \
  "Unsere eigene Datei ist kein einzelner Site-Block mehr." \
  "Erwartet: genau 2 nicht eingerückte Zeilen (Adresszeile + schließende '}')." \
  "Gefunden: ${UNINDENTIERT:-0}." \
  "" \
  "Wer $VORLAGE bearbeitet, soll hier scheitern und nicht auf dem Server:" \
  "    grep -nE '^[^[:space:]#]' $SITE_KOPIE"

grep -qE '^\(' "$SITE_KOPIE" && abbruch \
  "Unsere Datei enthält ein Snippet '(name) { … }'." \
  "Snippet-Namen sind konfigurationsweit eindeutig und könnten mit bestehenden" \
  "kollidieren. $VORLAGE darf keine enthalten."
grep -qE '^\{' "$SITE_KOPIE" && abbruch \
  "Unsere Datei enthält einen globalen Optionsblock '{ … }'." \
  "Der darf pro Konfiguration nur EINMAL vorkommen und steht bereits in der" \
  "Bestandsdatei. Ein zweiter macht die GESAMTE Konfiguration ungültig — auch" \
  "die des fremden Dienstes."
grep -qE '^[[:space:]]*import[[:space:]]' "$SITE_KOPIE" && abbruch \
  "Unsere Datei enthält selbst eine import-Zeile. Das ist hier nicht vorgesehen."
grep -q '{\$' "$SITE_KOPIE" && abbruch \
  "Unsere Datei enthält {\$…}-Umgebungsplatzhalter." \
  "Die würden zur Laufzeit aus systemds Umgebung ersetzt und lassen sich hier" \
  "nicht verlässlich prüfen. $VORLAGE darf keine enthalten."

# Adresszeile muss einen Hostnamen nennen. Ein Block ohne Adresse (':443 { }')
# fängt fremde Anfragen ab — genau das darf nie passieren.
case "$ADRESSZEILE" in
  *"$DOMAIN"*) ;;
  *) abbruch "Die Adresszeile nennt $DOMAIN nicht: $ADRESSZEILE" ;;
esac
printf '%s' "$ADRESSZEILE" | grep -qE '^[[:space:]]*(:[0-9]+|https?://)?[[:space:]]*\{' && abbruch \
  "Die Adresszeile nennt keinen Hostnamen: $ADRESSZEILE" \
  "Ein Site-Block ohne Adresse fängt jede Anfrage ab, für die es keinen" \
  "spezifischeren Block gibt — und damit potenziell den fremden Dienst."

# Fremde Hosts dürfen in unserer Datei nicht auftauchen.
for h in $MM_HOSTS; do
  if grep -Fq "$h" "$SITE_KOPIE"; then
    abbruch \
      "Unsere Datei erwähnt den fremden Host '$h'." \
      "Das wäre ein Zugriff auf fremdes Routing. Bitte $VORLAGE prüfen."
  fi
done

# Abschließende Zeilenumbruch-Kontrolle: die Datei muss mit \n enden.
if [ -n "$(tail -c1 "$SITE_KOPIE" 2>/dev/null)" ]; then
  printf '\n' >>"$SITE_KOPIE"
fi

ok "Site-Block vorbereitet: $(printf '%s' "$ADRESSZEILE" | sed 's/[[:space:]]*{$//')"
info "Ausrollverzeichnis im Block: $WEB_ROOT/dist"

# ═══════════════════════════════════════════════════════════════════════════
# P7 — Fachliche Voraussetzungen. Sonst lädt man ein 502 nach.
# ═══════════════════════════════════════════════════════════════════════════
say "[P7] Voraussetzungen des Site-Blocks"

[ -f "$WEB_ROOT/dist/index.html" ] || abbruch \
  "$WEB_ROOT/dist/index.html fehlt." \
  "Der Site-Block liefert die Website aus diesem Verzeichnis. Ohne Build gäbe" \
  "es nach dem Reload für jede Seite einen Fehler." \
  "" \
  "Zuerst ausrollen:" \
  "    sudo ./apps/cms/deploy/setup.sh $DOMAIN --webserver=caddy" \
  "Anderer Pfad? Dann --web-root=<pfad> mitgeben."

STRAPI_CODE="$(http_status "http://127.0.0.1:1337/_health")"
[ "$STRAPI_CODE" = "204" ] || abbruch \
  "Strapi antwortet auf http://127.0.0.1:1337/_health mit '$STRAPI_CODE' statt 204." \
  "Der Site-Block leitet /api, /admin, /uploads … dorthin. Läuft Strapi nicht," \
  "liefert die Domain nach dem Reload für all diese Pfade 502." \
  "" \
  "    cd $(dirname "$SCRIPT_DIR") && docker compose ps" \
  "    cd $(dirname "$SCRIPT_DIR") && docker compose logs --tail 50 strapi"
ok "Strapi antwortet (204 auf 127.0.0.1:1337/_health)"

LEAD_CODE="$(http_status "http://127.0.0.1:8090/health")"
[ "$LEAD_CODE" = "200" ] || abbruch \
  "Der Lead-Service antwortet auf http://127.0.0.1:8090/health mit '$LEAD_CODE' statt 200." \
  "Der Site-Block leitet /contact, /roi-report und /abmelden/* dorthin." \
  "" \
  "    cd $(dirname "$SCRIPT_DIR") && docker compose logs --tail 50 lead-api"
ok "Lead-Service antwortet (200 auf 127.0.0.1:8090/health)"

# ── Leserechte für den Caddy-Benutzer ──────────────────────────────────────
# nginx läuft als www-data, das Caddy-Paket als '$CADDY_USER'. rsync hat die
# Rechte aus dem Build übernommen — passen sie nicht, gibt es für jede Seite
# 403, obwohl Routing und Zertifikat stimmen.
lesetest() {
  # 0 = kann lesen, 1 = kann nicht, 2 = nicht prüfbar
  local datei="$WEB_ROOT/dist/index.html"
  if ! id -u "$CADDY_USER" >/dev/null 2>&1; then return 2; fi
  if command -v runuser >/dev/null 2>&1; then
    runuser -u "$CADDY_USER" -- test -r "$datei" >/dev/null 2>&1 && return 0 || return 1
  elif command -v sudo >/dev/null 2>&1; then
    sudo -n -u "$CADDY_USER" test -r "$datei" >/dev/null 2>&1 && return 0 || return 1
  elif command -v su >/dev/null 2>&1; then
    su -s /bin/sh -c "test -r '$datei'" "$CADDY_USER" >/dev/null 2>&1 && return 0 || return 1
  fi
  return 2
}

if [ "$DRYRUN" -eq 1 ]; then
  set +e; lesetest; LESEN=$?; set -e
  case "$LESEN" in
    0) ok "Benutzer '$CADDY_USER' kann $WEB_ROOT/dist/index.html bereits lesen" ;;
    1) warn "Benutzer '$CADDY_USER' kann $WEB_ROOT/dist/index.html noch nicht lesen."
       info "Im Echtlauf würde davor 'chmod -R a+rX $WEB_ROOT' laufen." ;;
    *) warn "Der Lesetest ließ sich nicht ausführen (Benutzer '$CADDY_USER' unbekannt?)." ;;
  esac
else
  chmod -R a+rX "$WEB_ROOT" 2>/dev/null || warn "chmod -R a+rX $WEB_ROOT meldete Fehler — bitte Rechte von Hand prüfen."
  WEBROOT_CHMOD=1
  set +e; lesetest; LESEN=$?; set -e
  case "$LESEN" in
    0) ok "Benutzer '$CADDY_USER' kann $WEB_ROOT/dist/index.html lesen" ;;
    1) abbruch \
         "Benutzer '$CADDY_USER' kann $WEB_ROOT/dist/index.html auch nach 'chmod -R a+rX' nicht lesen." \
         "Dann lieferte die Domain nach dem Reload für jede Seite 403 (erkennbar" \
         "an 'permission denied' in journalctl -u caddy)." \
         "" \
         "Meist liegt es an den Rechten eines übergeordneten Verzeichnisses:" \
         "    namei -l $WEB_ROOT/dist/index.html" \
         "" \
         "An Caddy wurde nichts verändert." ;;
    *) warn "Der Lesetest ließ sich nicht ausführen (Benutzer '$CADDY_USER' unbekannt?) — bitte von Hand prüfen." ;;
  esac
fi

# ── Fingerabdruck der fremden Hosts VOR der Änderung ───────────────────────
# Verglichen werden später nur stabile Merkmale: Statuszeile, Ablaufdatum des
# Zertifikats und die Frage, ob die Mattermost-API 'status: OK' meldet.
# Antwortkörper werden bewusst NICHT verglichen — die enthalten Tokens und
# Zeitstempel und würden bei jedem Aufruf abweichen.
PROBE_IP="127.0.0.1"
mm_fingerabdruck() {
  # $1 = Zieldatei
  local ziel="$1" h zeile status zert koerper pfad
  : >"$ziel"
  for h in $MM_HOSTS; do
    for pfad in "/" "/api/v4/system/ping"; do
      status="000"; zert="?"; koerper=""
      while IFS= read -r zeile; do
        case "$zeile" in
          "status "*)  status="${zeile#status }" ;;
          "zert "*)    zert="${zeile#zert }" ;;
          "koerper "*) koerper="${zeile#koerper }" ;;
        esac
      done < <(python3 "$PY" probe "$h" "$PROBE_IP" 443 "$pfad" 2>/dev/null || true)
      printf '%s %s status %s\n' "$h" "$pfad" "$status" >>"$ziel"
      printf '%s %s zert %s\n'   "$h" "$pfad" "$zert"   >>"$ziel"
      if [ "$pfad" = "/api/v4/system/ping" ]; then
        case "$koerper" in
          *'"status":"OK"'*|*'"status": "OK"'*) printf '%s ping ok ja\n' "$h" >>"$ziel" ;;
          *)                                    printf '%s ping ok nein\n' "$h" >>"$ziel" ;;
        esac
      fi
    done
  done
  return 0
}

MM_ABNAHME=1
if [ -z "$MM_HOSTS" ]; then
  MM_ABNAHME=0
else
  mm_fingerabdruck "$W/mm-fingerprint-vorher.txt"
  if ! grep -qE ' / status (1|2|3|4|5)' "$W/mm-fingerprint-vorher.txt" 2>/dev/null; then
    # Über 127.0.0.1 kam nichts. Zweiter Versuch über die DNS-Adresse des
    # ersten fremden Hosts — Caddy könnte nur auf der öffentlichen IP lauschen.
    ERSTER_HOST="$(printf '%s' "$MM_HOSTS" | awk '{print $1}')"
    ALT_IP="$(python3 "$PY" dns "$ERSTER_HOST" 2>/dev/null | head -n1 || true)"
    if [ -n "$ALT_IP" ] && [ "$ALT_IP" != "127.0.0.1" ]; then
      PROBE_IP="$ALT_IP"
      mm_fingerabdruck "$W/mm-fingerprint-vorher.txt"
    fi
  fi
  if grep -qE ' / status (1|2|3|4|5)' "$W/mm-fingerprint-vorher.txt" 2>/dev/null; then
    ok "Fingerabdruck der fremden Hosts erhoben (über $PROBE_IP:443)"
    sed -n '1,8p' "$W/mm-fingerprint-vorher.txt" | sed 's/^/      /'
  elif [ "$OHNE_MM_ABNAHME" -eq 1 ]; then
    MM_ABNAHME=0
    warn "Fremde Hosts antworten nicht über 443 — per --ohne-mm-abnahme überstimmt."
  else
    abbruch \
      "Von den fremden Hosts ($MM_HOSTS) antwortet keiner über Port 443." \
      "Versucht wurde 127.0.0.1 und ${ALT_IP:-<keine DNS-Adresse>}." \
      "" \
      "Ohne Vorher-Fingerabdruck gibt es nach dem Reload keinen Beleg, dass der" \
      "fremde Dienst unverändert antwortet — und genau dieser Beleg ist der" \
      "Zweck dieses Skripts." \
      "" \
      "Ist der fremde Dienst gerade planmäßig unten oder nur über einen anderen" \
      "Weg erreichbar, hilft --ohne-mm-abnahme. Dann bleibt als Nachweis der" \
      "Vergleich der laufenden Konfiguration vorher/nachher."
  fi
fi

# ═══════════════════════════════════════════════════════════════════════════
# P8 — Probierkopie: alles wird an einer Kopie bewiesen, nicht am Original.
# ═══════════════════════════════════════════════════════════════════════════
say "[P8] Probierkopie bauen (die Bestandsdatei bleibt unberührt)"

# Ablageort: normalerweise das Arbeitsverzeichnis. Benutzt der Bestand aber
# RELATIVE import-Muster, muss die Probe im selben Verzeichnis liegen — sonst
# laufen die Muster ins Leere und der Vergleich meldet fälschlich, dass fremde
# Routen fehlen.
if [ -n "$RELATIVE_IMPORTE" ]; then
  PROBE_CADDYFILE="$CADDY_DIR/.newedge-probe-$$-$ZEITSTEMPEL"
  info "Probe liegt wegen relativer import-Muster in $CADDY_DIR"
else
  PROBE_CADDYFILE="$W/Caddyfile.probe"
fi

# Die Probe darf von keinem bestehenden import-Muster eingesammelt werden —
# sonst zöge ein fremder Reload unsere Probe mit hinein.
if [ "${#MUSTERLISTE[@]}" -gt 0 ]; then
  for m in "${MUSTERLISTE[@]}"; do
    # shellcheck disable=SC2053
    if [[ "$PROBE_CADDYFILE" == $m ]] || [[ "$SITE_KOPIE" == $m ]]; then
      abbruch \
        "Eine Probierdatei fiele in ein bestehendes import-Muster ($m)." \
        "Dann würde ein fremder Reload unsere Probe einlesen. Bitte mit einem" \
        "anderen Arbeitsverzeichnis erneut versuchen (TMPDIR setzen)."
    fi
  done
fi
AUFRAEUMEN+=("$PROBE_CADDYFILE")

cp -a "$CADDYFILE" "$PROBE_CADDYFILE" || abbruch "Probierkopie ließ sich nicht anlegen."

# An die PROBE kommt die import-Zeile — mit direktem Verweis auf unsere
# vorbereitete Datei. Das Ergebnis des Adaptierens ist dasselbe wie später über
# das Glob-Muster: import-Pfade tauchen im erzeugten JSON nicht auf.
# Das führende \n ist NICHT kosmetisch: endet die Bestandsdatei ohne
# Zeilenumbruch, klebte die import-Zeile sonst an der letzten Zeile.
printf '\n%s\nimport %s\n' "$IMPORT_MARKER" "$SITE_KOPIE" >>"$PROBE_CADDYFILE" \
  || abbruch "Die import-Zeile ließ sich nicht an die Probierkopie anhängen."

# Gegenprobe, sobald die Probe liegt: die UNVERÄNDERTE Bestandsdatei muss immer
# noch exakt dasselbe ergeben wie vorhin.
# Warum: die import-Muster der obersten Ebene wurden oben geprüft, import-Zeilen
# INNERHALB bereits importierter Dateien aber nicht — die kennt dieses Skript
# gar nicht. Fiele die Probierkopie in so ein Muster, stünde ab sofort jeder
# fremde Site-Block DOPPELT in der Konfiguration. Ein Reload schlüge dann fehl
# (Caddy behält die alte Konfiguration, der fremde Dienst läuft weiter), aber
# der nächste NEUSTART — Paket-Update, Reboot — käme nicht mehr hoch, und der
# fremde Dienst wäre weg. Deshalb hier merken, solange noch nichts passiert ist.
if ! adapt_nach "$CADDYFILE" "$W/adapt-kontrolle.json" "$W/adapt-kontrolle.err"; then
  abbruch \
    "Nachdem die Probierkopie abgelegt wurde, lässt sich die UNVERÄNDERTE" \
    "Bestandsdatei nicht mehr adaptieren:" \
    "$(sed -n '1,8p' "$W/adapt-kontrolle.err" 2>/dev/null || true)" \
    "" \
    "Das heißt: die Probierkopie $PROBE_CADDYFILE wird von einem import-Muster" \
    "eingesammelt, das dieses Skript nicht kennt (vermutlich eines INNERHALB" \
    "einer bereits importierten Datei). Sie wird beim Beenden entfernt — bitte" \
    "danach kontrollieren:" \
    "    ls -la $CADDY_DIR" \
    "    $CADDY_BIN validate --config $CADDYFILE"
fi
python3 "$PY" norm "$W/adapt-kontrolle.json" >"$W/adapt-kontrolle.norm" 2>/dev/null \
  || abbruch "adapt-kontrolle.json lässt sich nicht normalisieren."
if ! diff -q "$W/adapt-vorher.norm" "$W/adapt-kontrolle.norm" >/dev/null 2>&1; then
  diff -u "$W/adapt-vorher.norm" "$W/adapt-kontrolle.norm" >"$W/probe-nebenwirkung.diff" 2>&1 || true
  abbruch \
    "Allein das Ablegen der Probierkopie hat den Bestand verändert." \
    "Unterschied: $W/probe-nebenwirkung.diff" \
    "" \
    "$PROBE_CADDYFILE wird also von einem import-Muster eingesammelt, das" \
    "dieses Skript nicht sehen kann (ein import INNERHALB einer importierten" \
    "Datei). Die Probe wird beim Beenden entfernt; danach bitte prüfen:" \
    "    grep -rn '^[[:space:]]*import' $CADDY_DIR" \
    "    $CADDY_BIN validate --config $CADDYFILE"
fi

ok "Probierkopie: $PROBE_CADDYFILE (ohne Nebenwirkung auf den Bestand)"

# ═══════════════════════════════════════════════════════════════════════════
# P9 — Beweis an der Probe. Erst danach darf überhaupt geschrieben werden.
# ═══════════════════════════════════════════════════════════════════════════
say "[P9] Beweis: greift der import, und bleibt alles Fremde unberührt?"

beweis_fuehren() {
  # $1 = zu prüfende Konfigurationsdatei, $2 = Kennung für Dateinamen/Meldungen
  # Rückgabe 0 = bewiesen. Gibt bei Fehlschlag selbst eine Meldung aus.
  local konfig="$1" kennung="$2"
  local nachher="$W/adapt-$kennung.json"
  local fehlerlog="$W/adapt-$kennung.err"

  if ! adapt_nach "$konfig" "$nachher" "$fehlerlog"; then
    err "'caddy adapt' scheitert an $konfig:"
    sed -n '1,10p' "$fehlerlog" 2>/dev/null | sed 's/^/      /' || true
    return 1
  fi
  if ! "$CADDY_BIN" validate --config "$konfig" --adapter caddyfile >"$W/validate-$kennung.log" 2>&1; then
    err "'caddy validate' scheitert an $konfig:"
    sed -n '1,10p' "$W/validate-$kennung.log" 2>/dev/null | sed 's/^/      /' || true
    return 1
  fi

  # (1) Hat der import überhaupt gegriffen? Ohne unsere Domain im Ergebnis
  #     würde der Reload schlicht die alte Konfiguration erneut laden.
  if ! python3 "$PY" hosts "$nachher" >"$W/hosts-$kennung.txt" 2>/dev/null; then
    err "Die Host-Liste aus $nachher ließ sich nicht ermitteln."
    return 1
  fi
  if ! grep -Fxq "$DOMAIN" "$W/hosts-$kennung.txt"; then
    err "$DOMAIN taucht im erzeugten Ergebnis NICHT auf — der import hat nicht gegriffen."
    info "Ein Reload würde nichts bewirken (oder Schlimmeres). Es wird nicht geladen."
    return 1
  fi
  if [ "$WWW_AKTIV" -eq 1 ] && ! grep -Fxq "$WWW_DOMAIN" "$W/hosts-$kennung.txt"; then
    err "$WWW_DOMAIN fehlt im erzeugten Ergebnis, obwohl es in der Adresszeile steht."
    return 1
  fi

  # (2) Ist die Änderung REIN ADDITIV? Auf BEIDEN Seiten wird alles
  #     herausgerechnet, was zu unseren Domains gehört. Was danach übrig
  #     bleibt, ist fremde Konfiguration — und die muss Byte für Byte gleich
  #     sein. (Beidseitig, damit auch ein Wiederholungslauf über eine bereits
  #     abgelegte eigene Fassung sauber vergleicht.)
  local unsere=("$DOMAIN" "$WWW_DOMAIN")
  if ! python3 "$PY" ohne "$W/adapt-vorher.json" "${unsere[@]}" >"$W/rest-vorher.json" 2>"$W/rest-vorher.err"; then
    err "Der Vorher-Stand ließ sich für den Vergleich nicht aufbereiten:"
    sed -n '1,5p' "$W/rest-vorher.err" 2>/dev/null | sed 's/^/      /' || true
    return 1
  fi
  if ! python3 "$PY" ohne "$nachher" "${unsere[@]}" >"$W/rest-$kennung.json" 2>"$W/rest-$kennung.err"; then
    err "Die Additivitäts-Prüfung ließ sich nicht durchführen:"
    sed -n '1,5p' "$W/rest-$kennung.err" 2>/dev/null | sed 's/^/      /' || true
    return 1
  fi
  if ! diff -q "$W/rest-vorher.json" "$W/rest-$kennung.json" >/dev/null 2>&1; then
    diff -u "$W/rest-vorher.json" "$W/rest-$kennung.json" >"$W/additiv-$kennung.diff" 2>&1 || true
    err "Die Änderung ist NICHT rein additiv — am Bestand hat sich etwas verändert:"
    sed -n '1,40p' "$W/additiv-$kennung.diff" 2>/dev/null | sed 's/^/      /' || true
    info "Vollständig: $W/additiv-$kennung.diff"
    return 1
  fi

  # (3) Zweiter, unabhängiger Beweis: je fremdem Host müssen die Routen
  #     byte-identisch bleiben. Wäre unser import in einem fremden Site-Block
  #     gelandet, änderten sich dessen Routen — ganz ohne Textheuristik.
  local h
  for h in $MM_HOSTS; do
    if ! python3 "$PY" routen "$W/adapt-vorher.json" "$h" >"$W/routen-vorher-$h.json" 2>/dev/null \
       || ! python3 "$PY" routen "$nachher" "$h" >"$W/routen-$kennung-$h.json" 2>/dev/null; then
      err "Die Routen des fremden Hosts '$h' ließen sich nicht auswerten."
      return 1
    fi
    # Leeres Ergebnis: der Host steht an einer Stelle, die dieser Vergleich nicht
    # erfasst (z. B. nur in errors.routes). Kein Beweis, aber auch kein Problem —
    # Prüfung (2) oben deckt die gesamte Konfiguration ab und hat gehalten.
    if [ ! -s "$W/routen-vorher-$h.json" ] || grep -qx '{}' "$W/routen-vorher-$h.json"; then
      warn "Für '$h' sind keine eigenen Routen auffindbar — Einzelvergleich übersprungen (Gesamtvergleich greift)."
      continue
    fi
    if ! diff -q "$W/routen-vorher-$h.json" "$W/routen-$kennung-$h.json" >/dev/null 2>&1; then
      err "Die Routen des fremden Hosts '$h' haben sich verändert."
      diff -u "$W/routen-vorher-$h.json" "$W/routen-$kennung-$h.json" 2>&1 | sed -n '1,30p' | sed 's/^/      /' || true
      return 1
    fi
  done

  # (4) Und der laufende Stand ist immer noch der von vorhin — niemand war
  #     zwischenzeitlich über die Admin-API dazwischen.
  if http_nach_datei "http://127.0.0.1:2019/config/" "$W/live-zwischen.json"; then
    python3 "$PY" kern "$W/live-zwischen.json" >"$W/live-zwischen.kern" 2>/dev/null || true
    python3 "$PY" kern "$W/live-vorher.json"   >"$W/live-vorher.kern2"  2>/dev/null || true
    if ! diff -q "$W/live-vorher.kern2" "$W/live-zwischen.kern" >/dev/null 2>&1; then
      err "Die LAUFENDE Konfiguration hat sich seit Beginn dieses Laufs geändert."
      info "Jemand arbeitet parallel am Server. Hier wird nichts geladen."
      return 1
    fi
  else
    err "Die laufende Konfiguration ließ sich nicht erneut abfragen."
    return 1
  fi

  return 0
}

if ! beweis_fuehren "$PROBE_CADDYFILE" "probe"; then
  abbruch \
    "Der Beweis an der Probierkopie ist gescheitert (Meldung oben)." \
    "Es wurde weder geschrieben noch geladen. Belege: $W" \
    "" \
    "Hintergründe und Handarbeit: $RUNBOOK"
fi

ok "Bewiesen: unsere Domain kommt hinzu, alles Fremde bleibt Byte für Byte gleich"

# ═══════════════════════════════════════════════════════════════════════════
# Ausstieg im Probelauf — hier endet --dry-run, ohne etwas verändert zu haben.
# ═══════════════════════════════════════════════════════════════════════════
if [ "$DRYRUN" -eq 1 ]; then
  echo
  say "PROBELAUF BESTANDEN — folgendes WÜRDE der Echtlauf tun:"
  cat <<EOF

  1) Leserechte setzen (nur im eigenen Webroot):
         chmod -R a+rX $WEB_ROOT
         Gegenprobe: Benutzer '$CADDY_USER' muss $WEB_ROOT/dist/index.html lesen können.

  2) Site-Block ablegen (NEUE Datei, 0644):
         $SITE_ZIEL
         Adresszeile:        $(printf '%s' "$ADRESSZEILE" | sed 's/[[:space:]]*{$//')
         Ausrollverzeichnis: $WEB_ROOT/dist
EOF
  if [ "$FALL" = "A" ]; then
    cat <<EOF

  3) $CADDYFILE wird NICHT angefasst.
         Das bestehende Muster '$GENUTZTES_MUSTER' sammelt die Datei ein.
EOF
  else
    cat <<EOF

  3) Genau zwei Zeilen ans DATEIENDE von $CADDYFILE anhängen
     (nachweislich auf oberster Ebene — die Datei endet auf Klammertiefe 0):

         $IMPORT_MARKER
         import $CONF_DIR/*.caddyfile

     Nichts wird ersetzt, gelöscht oder umsortiert. Sicherungskopie liegt in
     $W/Caddyfile.orig.
EOF
  fi
  cat <<EOF

  4) caddy validate + caddy adapt gegen den ECHTEN Stand, mit denselben
     Prüfungen wie eben an der Probe. Schlägt eine fehl: kein Reload.

  5) systemctl reload caddy   (RELOAD, niemals stop/restart)

  6) Abnahme: PID unverändert, Dienst aktiv, Routen der fremden Hosts
     unverändert, Statuszeile und Zertifikat der fremden Hosts unverändert.
     Bei Abweichung: automatischer Rollback.

  Belege dieses Probelaufs liegen in:
      $W
  (Verzeichnis kann bedenkenlos gelöscht werden — es enthält nur Analysedateien.)

  Echtlauf — dieselben Schalter, nur ohne --dry-run:
      sudo $0 $DOMAIN$( [ "$WEB_ROOT" != "/var/www/newedgebrand" ] && printf ' --web-root=%s' "$WEB_ROOT" )$( [ "$CONF_DIR" != "/etc/caddy/conf.d" ] && printf ' --conf-dir=%s' "$CONF_DIR" )$( [ "$OHNE_WWW" -eq 1 ] && printf ' --ohne-www' )$( [ "$CATCHALL_OK" -eq 1 ] && printf ' --catchall-erlauben' )$( [ "$DNS_EGAL" -eq 1 ] && printf ' --dns-egal' )$( [ "$OHNE_MM_ABNAHME" -eq 1 ] && printf ' --ohne-mm-abnahme' )

EOF
  ok "Es wurde nichts verändert."
  exit 0
fi

# ═══════════════════════════════════════════════════════════════════════════
# P10 — rollback.sh erzeugen, BEVOR geschrieben wird.
# ═══════════════════════════════════════════════════════════════════════════
say "[P10] Rückbau-Skript erzeugen"

cat >"$W/rollback.sh" <<ROLLBACKEOF
#!/usr/bin/env bash
# Rückbau des NEWEDGE-Caddy-Einbaus vom $ZEITSTEMPEL.
# Erzeugt von caddy-einbinden.sh. Alle Pfade sind fest eingesetzt.
#
# Nimmt zurück:
#   - unsere Site-Datei $SITE_ZIEL
#   - (nur Fall B) die angehängte import-Zeile in $CADDYFILE
# Fasst NICHTS anderes an. Danach: validate + reload + Kontrolle.
#
#   rollback.sh                 Rückbau + reload (der Normalfall)
#   rollback.sh --ohne-reload   Rückbau ohne reload. Nur sinnvoll, wenn unser
#                               Stand nie geladen wurde — dann muss der fremde
#                               Dienst auch nicht angefasst werden.
set -uo pipefail

MIT_RELOAD=1
[ "\${1:-}" = "--ohne-reload" ] && MIT_RELOAD=0

W="$W"
CADDYFILE="$CADDYFILE"
CADDY_BIN="$CADDY_BIN"
SITE_ZIEL="$SITE_ZIEL"
CONF_DIR="$CONF_DIR"
CONF_DIR_EXISTIERTE="$CONF_DIR_EXISTIERT"
SITE_ZIEL_EXISTIERTE="$SITE_ZIEL_EXISTIERTE"
FALL="$FALL"
MARKER='$IMPORT_MARKER'
HASH_ORIG="$HASH_ORIG"

[ "\$(id -u)" -eq 0 ] || { echo "Bitte mit sudo ausführen."; exit 1; }

hashe() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "\$1" 2>/dev/null | awk '{print \$1}'
  elif command -v shasum >/dev/null 2>&1; then
    shasum -a 256 "\$1" 2>/dev/null | awk '{print \$1}'
  elif command -v openssl >/dev/null 2>&1; then
    openssl dgst -sha256 "\$1" 2>/dev/null | awk '{print \$NF}'
  fi
}
protokoll() { printf '%s %s\n' "\$(date '+%Y-%m-%d %H:%M:%S')" "\$*" | tee -a "\$W/rollback.log"; }

protokoll "Rückbau gestartet"

# 1) Site-Datei entfernen — und zwar da, wo sie wirklich liegt.
if [ -f "\$SITE_ZIEL" ]; then
  if [ "\$SITE_ZIEL_EXISTIERTE" = "1" ] && [ -f "\$W/newedge.caddyfile.vorher" ]; then
    cp -a "\$W/newedge.caddyfile.vorher" "\$SITE_ZIEL"
    protokoll "vorherige Fassung von \$SITE_ZIEL wiederhergestellt"
  else
    rm -f "\$SITE_ZIEL"
    protokoll "\$SITE_ZIEL entfernt"
  fi
else
  GEFUNDEN="\$(grep -rls 'NEWEDGE — Caddy-Site-Block' /etc/caddy/ 2>/dev/null | head -n1 || true)"
  if [ -n "\$GEFUNDEN" ]; then
    rm -f "\$GEFUNDEN"
    protokoll "\$GEFUNDEN entfernt (über den Marker gefunden)"
  else
    protokoll "keine Site-Datei mehr vorhanden"
  fi
fi

if [ "\$CONF_DIR_EXISTIERTE" = "0" ] && [ -d "\$CONF_DIR" ]; then
  rmdir "\$CONF_DIR" 2>/dev/null && protokoll "\$CONF_DIR entfernt (war vorher nicht da)"
fi

# 2) Nur Fall B: die angehängte import-Zeile zurücknehmen.
if [ "\$FALL" = "B" ]; then
  JETZT="\$(hashe "\$CADDYFILE")"
  NACH=""
  [ -f "\$W/Caddyfile.nach.sha256" ] && NACH="\$(awk '{print \$1}' "\$W/Caddyfile.nach.sha256")"
  if [ -n "\$NACH" ] && [ "\$JETZT" = "\$NACH" ]; then
    cp -a "\$W/Caddyfile.orig" "\$CADDYFILE"
    protokoll "Sicherungskopie eingespielt (Datei war unverändert seit unserem Schreibzugriff)"
  elif [ "\$JETZT" = "\$HASH_ORIG" ]; then
    protokoll "Datei entspricht bereits dem Ursprungsstand — nichts zu tun"
  elif grep -Fq "\$MARKER" "\$CADDYFILE" 2>/dev/null; then
    # Jemand anders hat inzwischen editiert: NUR unsere zwei Zeilen entfernen.
    awk -v m="\$MARKER" '
      \$0 == m { weg = 1; next }
      weg == 1 && \$0 ~ /^[[:space:]]*import[[:space:]]/ { weg = 0; next }
      { weg = 0; print }
    ' "\$CADDYFILE" >"\$W/Caddyfile.chirurgisch" && cat "\$W/Caddyfile.chirurgisch" >"\$CADDYFILE"
    protokoll "ACHTUNG: Datei wurde seither fremd verändert — nur unsere Markerzeilen entfernt"
  else
    # Weder unser Stand noch der Ursprungsstand — und unser Marker fehlt. Dann
    # ist der Schreibzugriff abgebrochen (Torso) oder die Datei wurde komplett
    # ersetzt. Ein 'nur unsere Zeilen entfernen' würde hier NICHTS reparieren.
    protokoll "ACHTUNG: \$CADDYFILE ist weder unser Stand noch der Ursprung, und unser Marker fehlt."
    protokoll "Vermutlich ein abgebrochener Schreibzugriff. Sicherungskopie wird eingespielt."
    cp -a "\$W/Caddyfile.orig" "\$CADDYFILE" \\
      && protokoll "Sicherungskopie eingespielt — bitte 'diff' gegen die eigene Erwartung prüfen" \\
      || protokoll "FEHLER: Sicherungskopie ließ sich nicht einspielen"
  fi
fi

# 3) Prüfen, dann laden.
if ! "\$CADDY_BIN" validate --config "\$CADDYFILE" --adapter caddyfile >"\$W/rollback-validate.log" 2>&1; then
  protokoll "FEHLER: validate schlägt nach dem Rückbau fehl — NICHT reloaden!"
  sed -n '1,20p' "\$W/rollback-validate.log"
  echo
  echo "Notfallweg (lädt den Vorher-Stand direkt in den laufenden Prozess):"
  echo "    curl -X POST http://127.0.0.1:2019/load -H 'Content-Type: application/json' \\\\"
  echo "         --data-binary @\$W/live-vorher.json"
  echo "    # ohne curl:"
  echo "    python3 \$W/helfer.py senden http://127.0.0.1:2019/load \$W/live-vorher.json"
  exit 1
fi

if [ "\$MIT_RELOAD" -eq 0 ]; then
  protokoll "kein reload nötig — unser Stand war nie geladen"
elif systemctl reload caddy; then
  protokoll "reload ausgeführt"
else
  protokoll "FEHLER: reload schlug fehl. Die ALTE Konfiguration läuft weiter."
fi

echo
echo "Kontrolle:"
echo "    systemctl status caddy --no-pager | head -5"
echo "    journalctl -u caddy -n 40 --no-pager"
for h in $MM_HOSTS; do
  echo "    curl -sI https://\$h/ | head -1"
done
echo
protokoll "Rückbau beendet"
ROLLBACKEOF
chmod 700 "$W/rollback.sh" 2>/dev/null || true
ok "Rückbau-Skript: $W/rollback.sh"

# ═══════════════════════════════════════════════════════════════════════════
# P11 — Schreiben. Der einzige Schreibzugriff auf fremdes Terrain.
# ═══════════════════════════════════════════════════════════════════════════
say "[P11] Schreiben"

# Letzte Gegenprobe: hat jemand die Bestandsdatei zwischenzeitlich angefasst?
HASH_JETZT="$(datei_hash "$CADDYFILE")"
[ "$HASH_JETZT" = "$HASH_ORIG" ] || abbruch \
  "$CADDYFILE hat sich seit dem Beginn dieses Laufs geändert." \
  "    gesichert: $HASH_ORIG" \
  "    jetzt:     $HASH_JETZT" \
  "" \
  "Jemand arbeitet parallel an derselben Datei. Hier wird nichts geschrieben." \
  "Bitte abstimmen und danach erneut starten — die Prüfphase läuft dann frisch."

# Das Ablageverzeichnis wird NUR angelegt, wenn es fehlt — und nur dann bekommt
# es auch Rechte gesetzt. Ein bestehendes Verzeichnis gehört dem Bestand: ein
# 'chmod 755' darauf würde eine fremde Datei (z. B. den Site-Block des fremden
# Dienstes samt Zugangsdaten) für alle Benutzer lesbar machen.
if [ "$CONF_DIR_EXISTIERT" -eq 0 ]; then
  mkdir -p "$CONF_DIR" || abbruch "Verzeichnis lässt sich nicht anlegen: $CONF_DIR"
  chmod 755 "$CONF_DIR" 2>/dev/null || true
  info "$CONF_DIR neu angelegt (0755)"
else
  [ -d "$CONF_DIR" ] || abbruch \
    "$CONF_DIR ist seit der Prüfphase verschwunden." \
    "Jemand arbeitet parallel am Server. Hier wird nichts geschrieben."
  info "$CONF_DIR bestand bereits — Rechte unverändert"
fi

# (a) Site-Block ablegen. In Fall B ist die Datei zunächst wirkungslos, weil sie
#     noch niemand importiert. In Fall A greift sie ab sofort beim nächsten
#     Reload durch irgendwen — deshalb wurde vorher bewiesen, dass sie additiv ist.
GEAENDERT=1
if command -v install >/dev/null 2>&1; then
  install -m 0644 "$SITE_KOPIE" "$SITE_ZIEL" || abbruch "Site-Block ließ sich nicht ablegen: $SITE_ZIEL"
else
  cp "$SITE_KOPIE" "$SITE_ZIEL" && chmod 0644 "$SITE_ZIEL" \
    || abbruch "Site-Block ließ sich nicht ablegen: $SITE_ZIEL"
fi
ok "Site-Block abgelegt: $SITE_ZIEL"

# (b) Nur Fall B: genau zwei Zeilen ans Dateiende. Geschrieben wird über
#     'cat > datei' — dabei bleiben Inode, Eigentümer und Rechte erhalten.
if [ "$FALL" = "B" ]; then
  cp -a "$CADDYFILE" "$W/Caddyfile.neu" || abbruch "Arbeitskopie ließ sich nicht anlegen."
  printf '\n%s\nimport %s/*.caddyfile\n' "$IMPORT_MARKER" "$CONF_DIR" >>"$W/Caddyfile.neu" \
    || abbruch "Die import-Zeile ließ sich nicht anhängen."
  # Erwartungswert VOR dem Schreiben bilden. 'cat > datei' schneidet die Datei
  # zuerst auf null ab und schreibt dann — bricht das dazwischen ab (volle
  # Platte, Signal, E/A-Fehler), steht dort ein Torso. Genau dieser Torso wäre
  # das, was der nächste Neustart lädt: dann bliebe der fremde Dienst weg.
  # Deshalb wird jeder Fehlschlag SOFORT hier zurückgenommen, nicht später.
  HASH_ERWARTET="$(datei_hash "$W/Caddyfile.neu")"
  SCHREIBFEHLER=""
  if ! cat "$W/Caddyfile.neu" >"$CADDYFILE"; then
    SCHREIBFEHLER="der Schreibvorgang selbst meldete einen Fehler"
  else
    HASH_NACH="$(datei_hash "$CADDYFILE")"
    if [ -z "$HASH_NACH" ] || [ "$HASH_NACH" != "$HASH_ERWARTET" ]; then
      SCHREIBFEHLER="die geschriebene Datei stimmt nicht mit der Vorlage überein (unvollständig geschrieben)"
    fi
  fi
  if [ -n "$SCHREIBFEHLER" ]; then
    err "Schreiben nach $CADDYFILE schlug fehl: $SCHREIBFEHLER"
    err "Die Datei wird SOFORT aus der Sicherungskopie wiederhergestellt."
    if cat "$W/Caddyfile.orig" >"$CADDYFILE" \
       && [ "$(datei_hash "$CADDYFILE")" = "$HASH_ORIG" ]; then
      ok "$CADDYFILE ist wieder byte-identisch mit dem Ursprungsstand."
      info "Die laufende Konfiguration wurde nie angefasst — es gab keinen Reload."
      # Die Site-Datei aus (a) über den Rückbau wegräumen: der stellt bei einem
      # Wiederholungslauf die vorherige eigene Fassung wieder her, statt sie
      # einfach zu löschen.
      "$W/rollback.sh" --ohne-reload >/dev/null 2>&1 && GEAENDERT=0 || true
      abbruch \
        "Einbau abgebrochen, alles zurückgenommen." \
        "Häufigste Ursache: volle Platte. Prüfen:  df -h $CADDY_DIR" \
        "Kontrolle:  diff $W/Caddyfile.orig $CADDYFILE   (erwartet: kein Unterschied)"
    fi
    abbruch \
      "$CADDYFILE ließ sich WEDER vollständig schreiben NOCH wiederherstellen." \
      "Die Datei ist jetzt möglicherweise unvollständig. Der laufende Caddy" \
      "arbeitet weiter mit der alten Konfiguration im Speicher — der fremde" \
      "Dienst läuft also noch. Ein NEUSTART würde ihn aber mitnehmen." \
      "" \
      "SOFORT von Hand (kein restart, kein reload):" \
      "    df -h $CADDY_DIR" \
      "    cp -a $W/Caddyfile.orig $CADDYFILE" \
      "    $CADDY_BIN validate --config $CADDYFILE" \
      "    rm -f $SITE_ZIEL"
  fi
  printf '%s  %s\n' "$HASH_NACH" "$CADDYFILE" >"$W/Caddyfile.nach.sha256"
  ok "Zwei Zeilen an $CADDYFILE angehängt (oberste Ebene, Dateiende)"
  info "$IMPORT_MARKER"
  info "import $CONF_DIR/*.caddyfile"
else
  ok "$CADDYFILE wurde nicht angefasst (Fall A)"
fi

# ── Der endgültige Beweis: jetzt am ECHTEN Stand, vor dem Reload ───────────
say "[P11] Beweis am echten Stand (noch ohne Reload)"
if ! beweis_fuehren "$CADDYFILE" "echt"; then
  err "Der Beweis am echten Stand ist gescheitert. Es wird NICHT geladen."
  echo
  say "Rückbau läuft automatisch (ohne reload — unser Stand war nie geladen)"
  if "$W/rollback.sh" --ohne-reload; then
    GEAENDERT=0
    ok "Zurückgebaut. Der laufende Caddy wurde nie mit unserem Stand geladen."
  else
    err "Der automatische Rückbau meldete Fehler. Bitte $W/rollback.log ansehen."
  fi
  abbruch \
    "Einbau abgebrochen: der erzeugte Stand hielt der Prüfung nicht stand." \
    "Der Dienst wurde nie neu geladen; die laufende Konfiguration ist unberührt." \
    "Belege: $W"
fi
ok "Auch am echten Stand bewiesen: additiv, unsere Domain ist enthalten"

# ═══════════════════════════════════════════════════════════════════════════
# P12 — Reload und Abnahme
# ═══════════════════════════════════════════════════════════════════════════
say "[P12] systemctl reload caddy"

T0="$(date '+%Y-%m-%d %H:%M:%S')"
RELOAD_OK=1
# Vor dem Aufruf setzen, nicht danach: bricht der Lauf mitten im Reload ab, muss
# der Rückbau davon ausgehen, dass unser Stand bereits geladen ist.
RELOAD_GEMACHT=1
if ! systemctl reload caddy >"$W/reload.log" 2>&1; then
  RELOAD_OK=0
  err "'systemctl reload caddy' meldete einen Fehler:"
  sed -n '1,15p' "$W/reload.log" 2>/dev/null | sed 's/^/      /' || true
  info "Caddy behält bei Ladefehlern die ALTE Konfiguration — der fremde Dienst"
  info "läuft also weiter. Trotzdem wird jetzt zurückgebaut."
else
  ok "Reload ausgeführt"
fi

# ── Abnahme ────────────────────────────────────────────────────────────────
abnahme() {
  # Rückgabe 0 = fremder Dienst nachweislich unverändert.
  local fehler=0 aktiv pid nrestarts h
  local live="$W/live-nachher.json"

  pid="$(systemctl show caddy -p MainPID --value 2>/dev/null || true)"
  if [ "$pid" != "$MAINPID_VORHER" ]; then
    err "MainPID hat sich geändert ($MAINPID_VORHER → ${pid:-leer}) — das war ein NEUSTART, kein Reload."
    fehler=1
  fi
  nrestarts="$(systemctl show caddy -p NRestarts --value 2>/dev/null || echo "?")"
  if [ "$nrestarts" != "$NRESTARTS_VORHER" ]; then
    err "NRestarts hat sich geändert ($NRESTARTS_VORHER → $nrestarts) — der Dienst wurde neu gestartet."
    fehler=1
  fi
  aktiv="$(systemctl is-active caddy 2>/dev/null || true)"
  if [ "$aktiv" != "active" ]; then
    err "caddy.service ist nicht mehr aktiv (Status: ${aktiv:-unbekannt})."
    fehler=1
  fi

  # Journal seit dem Reload
  journalctl -u caddy --since "$T0" --no-pager >"$W/journal-nachher.log" 2>/dev/null || true
  if grep -qi 'panic' "$W/journal-nachher.log" 2>/dev/null; then
    err "Im Journal steht 'panic':"
    grep -i 'panic' "$W/journal-nachher.log" | sed -n '1,5p' | sed 's/^/      /' || true
    fehler=1
  fi
  if grep -qi 'permission denied' "$W/journal-nachher.log" 2>/dev/null; then
    warn "Im Journal steht 'permission denied' — meist fehlende Leserechte im Webroot:"
    grep -i 'permission denied' "$W/journal-nachher.log" | sed -n '1,3p' | sed 's/^/      /' || true
  fi

  # Laufende Konfiguration: Routen der fremden Hosts müssen identisch sein.
  if http_nach_datei "http://127.0.0.1:2019/config/" "$live"; then
    for h in $MM_HOSTS; do
      python3 "$PY" routen "$live" "$h" >"$W/routen-live-$h.json" 2>/dev/null || true
      if ! diff -q "$W/routen-vorher-$h.json" "$W/routen-live-$h.json" >/dev/null 2>&1; then
        err "Die LAUFENDEN Routen des fremden Hosts '$h' weichen vom Vorher-Stand ab."
        diff -u "$W/routen-vorher-$h.json" "$W/routen-live-$h.json" 2>&1 | sed -n '1,25p' | sed 's/^/      /' || true
        fehler=1
      fi
    done
    if python3 "$PY" hosts "$live" >"$W/hosts-live.txt" 2>/dev/null; then
      for h in $MM_HOSTS; do
        grep -Fxq "$h" "$W/hosts-live.txt" || { err "Der fremde Host '$h' ist aus der laufenden Konfiguration verschwunden."; fehler=1; }
      done
    fi
  else
    err "Die laufende Konfiguration ließ sich nach dem Reload nicht abfragen."
    fehler=1
  fi

  # Fingerabdruck: Statuszeile, Zertifikatsablauf, Anwendungsantwort.
  if [ "$MM_ABNAHME" -eq 1 ]; then
    mm_fingerabdruck "$W/mm-fingerprint-nachher.txt"
    if ! diff -q "$W/mm-fingerprint-vorher.txt" "$W/mm-fingerprint-nachher.txt" >/dev/null 2>&1; then
      err "Der Fingerabdruck der fremden Hosts hat sich verändert:"
      diff -u "$W/mm-fingerprint-vorher.txt" "$W/mm-fingerprint-nachher.txt" 2>&1 | sed -n '1,25p' | sed 's/^/      /' || true
      fehler=1
    fi
  fi

  # Lauscher auf 443 muss derselbe Prozess sein.
  local pid443
  pid443="$(pids_auf_port 443 | sed '/^$/d' | head -n1 || true)"
  if [ -n "$pid443" ] && [ "$pid443" != "$MAINPID_VORHER" ]; then
    err "Auf Port 443 lauscht jetzt PID $pid443 statt $MAINPID_VORHER."
    fehler=1
  fi

  return "$fehler"
}

ABNAHME_OK=1
if [ "$RELOAD_OK" -eq 0 ]; then
  ABNAHME_OK=0
else
  say "[P12] Abnahme — zuerst der fremde Dienst"
  if abnahme; then
    ok "Der fremde Dienst ist nachweislich unverändert"
    [ -n "$MM_HOSTS" ] && info "geprüfte Hosts: $MM_HOSTS"
  else
    ABNAHME_OK=0
  fi
fi

# ═══════════════════════════════════════════════════════════════════════════
# P13 — Ergebnis. Bei Abweichung: automatischer Rollback.
# ═══════════════════════════════════════════════════════════════════════════
if [ "$ABNAHME_OK" -eq 0 ]; then
  echo
  err "ABNAHME FEHLGESCHLAGEN — es wird zurückgebaut. Ab hier nur noch zurück."
  echo
  if "$W/rollback.sh"; then
    ok "Rückbau ausgeführt"
  else
    err "Der Rückbau meldete Fehler."
  fi
  echo
  say "Kontrolle nach dem Rückbau"
  if abnahme; then
    GEAENDERT=0
    ok "Der fremde Dienst ist wieder in seinem Ausgangszustand."
  else
    err "Der fremde Dienst weicht weiterhin vom Ausgangszustand ab."
    echo
    err "NOTFALLWEG — lädt den exakten Vorher-Stand in den laufenden Prozess:"
    printf '  %s\n' \
      "python3 $W/helfer.py senden http://127.0.0.1:2019/load $W/live-vorher.json" \
      "" \
      "mit curl:" \
      "curl -X POST http://127.0.0.1:2019/load -H 'Content-Type: application/json' \\" \
      "     --data-binary @$W/live-vorher.json" \
      "" \
      "Danach die Datei in Ruhe geradeziehen — der nächste Reload durch" \
      "irgendwen würde den Fehler sonst wiederholen." \
      "'systemctl restart caddy' bleibt verboten: es behebt nichts, was der" \
      "Notfallweg nicht besser behebt, und kostet den fremden Dienst eine" \
      "Ausfallsekunde."
  fi
  abbruch \
    "Der Einbau wurde zurückgenommen." \
    "Alle Belege (Vorher-/Nachher-Stände, Journal, Protokolle): $W"
fi

# ── Und jetzt die eigene Domain ────────────────────────────────────────────
# Wichtige Asymmetrie: antwortet NUR unsere Domain noch nicht, ist das KEIN
# Rollback-Grund. Caddy holt das Zertifikat asynchron, das dauert ein paar
# Sekunden. Der fremde Dienst ist an dieser Stelle bereits nachweislich
# unberührt — es wird also berichtet, nicht zurückgebaut.
say "[P12] Abnahme — die neue Domain"

EIGENE_OK=0
EIGENE_CODE="000"
for versuch in 1 2 3 4 5 6 7 8 9 10 11 12; do
  EIGENE_CODE="$(http_status "https://$DOMAIN/")"
  case "$EIGENE_CODE" in
    200) EIGENE_OK=1; break ;;
  esac
  [ "$versuch" -lt 12 ] && sleep 5
done

if [ "$EIGENE_OK" -eq 1 ]; then
  ok "https://$DOMAIN/ antwortet mit 200"
  for pfad in /admin /api/nav; do
    code="$(http_status "https://$DOMAIN$pfad")"
    info "https://$DOMAIN$pfad → $code"
  done
  code="$(http_status "https://$DOMAIN/health")"
  if [ "$code" = "403" ]; then
    info "https://$DOMAIN/health → 403 (Absicht: Betriebsinterna bleiben drinnen)"
  else
    warn "https://$DOMAIN/health → $code (erwartet 403)"
  fi
else
  warn "https://$DOMAIN/ antwortet noch nicht (zuletzt: $EIGENE_CODE)."
  info "Das ist KEIN Rollback-Grund — der fremde Dienst ist unverändert."
  info "Caddy holt das Zertifikat asynchron. Beobachten:"
  info "    journalctl -u caddy -f"
  info "Bleibt es dabei, sind die häufigsten Ursachen:"
  info "    · A-Record zeigt woanders hin (ACME-Challenge scheitert)"
  info "    · Port 80 ist von außen gesperrt (ufw/nftables) — ACME braucht ihn"
  info "    · Rate-Limit von Let's Encrypt nach zu vielen Fehlversuchen"
  info "Rückbau jederzeit:  $W/rollback.sh"
fi

# ═══════════════════════════════════════════════════════════════════════════
# Zusammenfassung
# ═══════════════════════════════════════════════════════════════════════════
echo
if [ "$EIGENE_OK" -eq 1 ]; then
  ok "EINBAU KOMPLETT"
else
  ok "EINBAU KOMPLETT — die neue Domain antwortet noch nicht (siehe oben)"
fi

cat <<EOF

  GEÄNDERT WURDE:

    1) $SITE_ZIEL      (neu angelegt, 0644)
       Site-Block für $(printf '%s' "$ADRESSZEILE" | sed 's/[[:space:]]*{$//')
       Quelle im Repo: $VORLAGE
EOF

if [ "$FALL" = "B" ]; then
  cat <<EOF

    2) $CADDYFILE      (zwei Zeilen ans Dateiende angehängt)
           $IMPORT_MARKER
           import $CONF_DIR/*.caddyfile
       Nichts ersetzt, nichts gelöscht, nichts umsortiert.
EOF
else
  cat <<EOF

    2) $CADDYFILE      NICHT angefasst.
       Das bestehende import-Muster '$GENUTZTES_MUSTER' sammelt unsere Datei ein.
EOF
fi

cat <<EOF

    3) chmod -R a+rX $WEB_ROOT   (Leserechte für den Benutzer '$CADDY_USER')

    4) systemctl reload caddy    (Reload, kein Neustart — PID $MAINPID_VORHER unverändert)

  NICHT GEÄNDERT: bestehende Site-Blöcke, globale Optionen, import-Muster,
  Zertifikatsspeicher (/var/lib/caddy), Mattermost, docker-compose.

  RÜCKBAU — der bequeme Weg:

      sudo $W/rollback.sh

  RÜCKBAU — von Hand:

      sudo rm -f $SITE_ZIEL
EOF
if [ "$FALL" = "B" ]; then
  cat <<EOF
      # Prüfen, dass seither niemand anderes an der Datei gearbeitet hat:
      diff $W/Caddyfile.orig $CADDYFILE
      #   erwartet: NUR unsere angehängte import-Zeile samt Kommentar.
      #   Steht mehr drin: NICHT das Backup einspielen, sondern nur die beiden
      #   Zeilen mit dem Marker '>>> NEWEDGE-IMPORT' herausnehmen.
      sudo cp -a $W/Caddyfile.orig $CADDYFILE
EOF
fi
cat <<EOF
      sudo $CADDY_BIN validate --config $CADDYFILE
      sudo systemctl reload caddy

  NOTFALL — falls ein Reload je etwas Falsches lädt (lädt den heutigen
  Vorher-Stand direkt in den laufenden Prozess, ohne Neustart):

      python3 $W/helfer.py senden http://127.0.0.1:2019/load $W/live-vorher.json

  BELEGE (bitte aufheben, bis der Betrieb bestätigt ist):

      $W/Caddyfile.orig             Sicherungskopie der Bestandsdatei
      $W/live-vorher.json           laufende Konfiguration VOR dem Eingriff
      $W/adapt-vorher.json          Bestandsdatei adaptiert, VOR dem Eingriff
      $W/adapt-echt.json            adaptierter Stand NACH dem Einbau
      $W/mm-fingerprint-*.txt       fremde Hosts vorher/nachher
      $W/journal-nachher.log        Caddy-Journal seit dem Reload
      $W/rollback.sh                Rückbau in einem Kommando

  ABNAHME DER WEBSITE (Auszug aus $RUNBOOK, Abschnitt 10):

      curl -sI https://$DOMAIN/            | head -1     # 200
      curl -sI https://$DOMAIN/cortex      | head -1     # 200, kein 301
      curl -sI https://$DOMAIN/gibtsnicht  | head -1     # 200 = SPA-Fallback
      curl -sI https://$DOMAIN/assets/nichtda.js | head -1   # 404, kein HTML
      curl -s  https://$DOMAIN/api/kontakt | head -c 200     # JSON
      curl -sI https://$DOMAIN/admin       | head -1     # 200
      curl -sI https://$DOMAIN/abmelden/test | head -1   # 404 vom Lead-Service
      curl -s -o /dev/null -w '%{http_code}\\n' https://$DOMAIN/health   # 403

  WICHTIG FÜR SPÄTER: Routing ändern heißt
      $SITE_ZIEL bearbeiten
      $CADDY_BIN validate --config $CADDYFILE
      systemctl reload caddy
  und dieselbe Änderung in $VORLAGE nachziehen — sonst driftet der Server weg.

EOF
exit 0
