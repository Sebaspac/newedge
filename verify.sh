#!/usr/bin/env bash
# ============================================================================
# NEWEDGE — ABNAHME NACH DEM DEPLOY
# ----------------------------------------------------------------------------
#   sudo ./verify.sh [<domain>] [--mit-formularen] [weitere Optionen]
#   z. B.: sudo ./verify.sh newedgebrand.com
#
# Dieses Skript BEWEIST, dass der Deploy funktioniert — es repariert nichts.
#
# REIN LESEND. Es startet, stoppt und ändert nichts: keine Container, keine
# Konfiguration, keine .env, kein Webserver-Reload. Geschrieben wird
# ausschließlich in ein eigenes Temp-Verzeichnis, das am Ende verschwindet.
# Die EINZIGE Ausnahme sind die Formular-Tests — die sind standardmäßig AUS
# und müssen mit --mit-formularen ausdrücklich eingeschaltet werden (sie legen
# echte Leads an, siehe unten).
#
# Es unterscheidet drei Ergebnisse:
#   ✔ OK        Die Prüfung ist bestanden.
#   ✖ BLOCKER   Der Deploy gilt als GESCHEITERT. Muss behoben werden.
#   ⚠ WARNUNG   Läuft, aber es fehlt etwas (z. B. SMTP noch nicht eingetragen).
#   ? UNGEPRÜFT Die Prüfung konnte nicht durchgeführt werden (Werkzeug fehlt,
#               keine Rechte). Bei einer blockierenden Prüfung heißt das:
#               unbewiesen, also NICHT bestanden.
#
# Exit-Code:
#   0  kein Blocker offen  (Warnungen dürfen offen sein)
#   1  mindestens ein Blocker gefallen
#   2  kein Blocker gefallen, aber eine blockierende Prüfung war nicht prüfbar
#      → das Ergebnis ist unvollständig, nicht „bestanden"
#
# WICHTIG — mit sudo ausführen. Ohne root fehlen: docker, die .env-Dateien und
# die Prozessnamen auf Port 80/443. Das Skript läuft trotzdem, meldet die
# betroffenen Punkte aber als UNGEPRÜFT statt sie zu erfinden.
#
# --mit-formularen schaltet drei schreibende Tests frei:
#   1. eine absichtlich ungültige Anfrage an /contact (wird verworfen, kein Lead)
#   2. eine echte Anfrage an /contact   → erzeugt einen Lead in contacts.jsonl
#   3. eine echte Anfrage an /roi-report → erzeugt einen Lead in leads.jsonl + PDF
# Die Testadresse liegt auf der EIGENEN Domain (abnahme+verify-sh@<domain>),
# es geht also nie eine Mail an Fremde. Bei aktivem Versand bekommt NOTIFY_TO
# zwei Benachrichtigungen. Das Skript sagt am Ende, welche Einträge entstanden
# sind und wo sie zu entfernen sind.
# Achtung: der Lead-Service begrenzt auf 5 Anfragen je IP je 10 Minuten —
# gemeinsam für /contact UND /roi-report. Die drei Tests verbrauchen drei davon.
# ============================================================================

# Bewusst KEIN `set -e`: fast jede Prüfung hier darf fehlschlagen, das ist ihr
# Zweck. Ein Abbruch beim ersten roten Haken wäre genau das Gegenteil einer
# Abnahmeliste. `-u` und `pipefail` bleiben.
set -uo pipefail

VERSION="1.0"

# ── Parameter ────────────────────────────────────────────────────────────────
usage() {
  cat <<'EOF'
Usage: sudo ./verify.sh [<domain>] [Optionen]

  <domain>                Zu prüfende Domain. Ohne Angabe wird sie aus
                          apps/cms/.env (PUBLIC_URL) gelesen, sonst
                          newedgebrand.com.

  --mit-formularen        Schreibende Formular-Tests einschalten (Default: AUS).
                          Erzeugt ECHTE Leads und — bei aktivem Versand —
                          echte Mails an NOTIFY_TO. Siehe Kopf dieser Datei.
  --test-mail=<adresse>   Absenderadresse für die Formular-Tests.
                          Default: abnahme+verify-sh@<domain>
  --mattermost=<host>     Fremddienst, der weiterlaufen muss.
                          Default: chat.<domain>
  --ohne-mattermost       Koexistenz-Prüfung überspringen (nur wenn auf dem
                          Server wirklich kein Mattermost läuft).
  --web-root=<pfad>       Ausrollverzeichnis. Default: /var/www/newedgebrand
  --timeout=<sekunden>    Zeitlimit je HTTP-Aufruf. Default: 15
  -h, --help              Diese Hilfe.
EOF
}

MIT_FORMULAREN=0
TEST_MAIL=""
MM_HOST=""
MM_PRUEFEN=1
WEB_ROOT="/var/www/newedgebrand"
TIMEOUT=15
POSITIONAL=()

for arg in "$@"; do
  case "$arg" in
    --mit-formularen)  MIT_FORMULAREN=1 ;;
    --test-mail=*)     TEST_MAIL="${arg#*=}" ;;
    --mattermost=*)    MM_HOST="${arg#*=}" ;;
    --ohne-mattermost) MM_PRUEFEN=0 ;;
    --web-root=*)      WEB_ROOT="${arg#*=}" ;;
    --timeout=*)       TIMEOUT="${arg#*=}" ;;
    -h|--help)         usage; exit 0 ;;
    -*)                echo "Unbekannte Option: $arg"; echo; usage; exit 1 ;;
    *)                 POSITIONAL+=("$arg") ;;
  esac
done

case "$TIMEOUT" in
  ''|*[!0-9]*) echo "--timeout erwartet eine Zahl in Sekunden: $TIMEOUT"; exit 1 ;;
esac

# ── Pfade (dieses Skript liegt in der Monorepo-Wurzel) ───────────────────────
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CMS_DIR="$REPO_ROOT/apps/cms"
LEAD_DIR="$REPO_ROOT/apps/lead-api"
WEB_DIR="$REPO_ROOT/apps/website"

# ── Domain bestimmen ─────────────────────────────────────────────────────────
DOMAIN="${POSITIONAL[0]:-}"
DOMAIN_QUELLE="Parameter"
if [ -z "$DOMAIN" ] && [ -r "$CMS_DIR/.env" ]; then
  # PUBLIC_URL=https://newedgebrand.com  →  newedgebrand.com
  DOMAIN="$(sed -n 's|^PUBLIC_URL=[[:space:]]*https\{0,1\}://||p' "$CMS_DIR/.env" | head -1 | sed 's|/.*||' | tr -d '"'"'"' \r')"
  [ -n "$DOMAIN" ] && DOMAIN_QUELLE="apps/cms/.env (PUBLIC_URL)"
fi
if [ -z "$DOMAIN" ]; then
  DOMAIN="newedgebrand.com"
  DOMAIN_QUELLE="Voreinstellung"
fi
case "$DOMAIN" in
  *[!a-zA-Z0-9.-]*|-*|.*|*.|*-) echo "Ungültige Domain: $DOMAIN"; exit 1 ;;
esac

BASE="https://$DOMAIN"
[ -n "$TEST_MAIL" ] || TEST_MAIL="abnahme+verify-sh@$DOMAIN"
# Der Fremddienst hängt an DIESER Domain. Ein fest verdrahtetes
# chat.newedgebrand.com würde bei jeder anderen Domain einen wildfremden Host
# abfragen und dessen Zustand als Abnahmekriterium melden.
[ -n "$MM_HOST" ] || MM_HOST="chat.$DOMAIN"

# ── Temp-Verzeichnis (das einzige, wohin dieses Skript schreibt) ─────────────
TMPD="$(mktemp -d "${TMPDIR:-/tmp}/newedge-verify.XXXXXX")" || { echo "Kein Temp-Verzeichnis anlegbar."; exit 1; }
chmod 700 "$TMPD" 2>/dev/null
aufraeumen() { rm -rf "$TMPD"; }
trap aufraeumen EXIT

# ── Ausgabe ──────────────────────────────────────────────────────────────────
if [ -t 1 ]; then
  C_0='\033[0m'; C_OK='\033[1;32m'; C_ERR='\033[1;31m'; C_WARN='\033[1;33m'
  C_HEAD='\033[1;35m'; C_DIM='\033[2m'
else
  C_0=''; C_OK=''; C_ERR=''; C_WARN=''; C_HEAD=''; C_DIM=''
fi

N_OK=0; N_BLOCK=0; N_WARN=0; N_OFFEN_B=0; N_OFFEN_W=0
BLOCKER_LISTE=(); WARN_LISTE=(); OFFEN_LISTE=()

abschnitt() { printf '\n%b── %s %b\n' "$C_HEAD" "$*" "$C_0"; }

# Mehrzeilige Begründungen sauber unter die Prüfzeile hängen.
_zeile() {
  local label="$1" text="$2" first=1 line
  while IFS= read -r line; do
    if [ "$first" -eq 1 ]; then printf '        %-9s%s\n' "$label" "$line"; first=0
    else                        printf '        %-9s%s\n' ''       "$line"; fi
  done <<<"$text"
}

# ergebnis <status> <id> <name> [grund] [abhilfe]
#   status: ok | blocker | warn | offen_b | offen_w | info
ergebnis() {
  local st="$1" id="$2" name="$3" grund="${4:-}" abhilfe="${5:-}"
  case "$st" in
    ok)      printf '%b  ✔  %-4s %s%b\n' "$C_OK"   "$id" "$name" "$C_0"; N_OK=$((N_OK+1)) ;;
    blocker) printf '%b  ✖  %-4s %s%b\n' "$C_ERR"  "$id" "$name" "$C_0"
             N_BLOCK=$((N_BLOCK+1)); BLOCKER_LISTE+=("$id  $name") ;;
    warn)    printf '%b  ⚠  %-4s %s%b\n' "$C_WARN" "$id" "$name" "$C_0"
             N_WARN=$((N_WARN+1));  WARN_LISTE+=("$id  $name") ;;
    offen_b) printf '%b  ?  %-4s %s  [UNGEPRÜFT — blockierend]%b\n' "$C_WARN" "$id" "$name" "$C_0"
             N_OFFEN_B=$((N_OFFEN_B+1)); OFFEN_LISTE+=("$id  $name  (blockierend)") ;;
    offen_w) printf '%b  ?  %-4s %s  [UNGEPRÜFT]%b\n' "$C_WARN" "$id" "$name" "$C_0"
             N_OFFEN_W=$((N_OFFEN_W+1)); OFFEN_LISTE+=("$id  $name") ;;
    info)    printf '%b  ·  %-4s %s%b\n' "$C_DIM"  "$id" "$name" "$C_0" ;;
  esac
  [ -n "$grund" ]   && _zeile "Grund:"   "$grund"
  [ -n "$abhilfe" ] && _zeile "Abhilfe:" "$abhilfe"
  return 0
}

# ── Werkzeug-Helfer ──────────────────────────────────────────────────────────
da() { command -v "$1" >/dev/null 2>&1; }

# HTTP-Aufruf. Der Antwortkörper landet in der Datei $TMPD/body, Rückgabe ist
# der HTTP-Code ("000" = keine Antwort). --globoff ist Pflicht: sonst deutet
# curl [ ] in URLs wie ?pagination[pageSize]=100 als Platzhalter-Bereich und
# ruft gar nichts auf.
#
# WICHTIG — warum der Körper NICHT hier in $BODY landet: die Aufrufe lauten
# CODE="$(http …)". Eine Kommandosubstitution ist eine Subshell; eine Zuweisung
# an $BODY DARIN käme in dieser Shell nie an, $BODY bliebe für immer leer und
# jede inhaltliche Prüfung (hasAdmin, mail, total, contactId …) fiele still auf
# den leeren Wert zurück. Deshalb schreibt curl den Körper in eine Datei, und
# der Aufrufer holt ihn direkt danach mit koerper_lesen() ab — das läuft in
# DIESER Shell und wirkt.
BODY=""
http() {
  local url="$1" code
  # Erst löschen: kommt keine Antwort, legt curl die Datei nicht an — ohne das
  # rm läse die nächste Prüfung den Body der vorigen und käme zum falschen Schluss.
  rm -f "$TMPD/body"
  code="$(curl -s --globoff -o "$TMPD/body" -w '%{http_code}' --max-time "$TIMEOUT" "$url" 2>/dev/null)"
  printf '%s' "${code:-000}"
}

# Holt den Körper der zuletzt geholten Antwort nach $BODY. Direkt nach jedem
# http/http_post_json aufrufen — und zwar NICHT in einer Subshell.
koerper_lesen() {
  BODY=""
  [ -f "$TMPD/body" ] && BODY="$(cat "$TMPD/body" 2>/dev/null)"
  return 0
}

# Nur der HTTP-Code, Body wird verworfen (für große Dateien wie JS-Bundles).
code_of() {
  local code
  code="$(curl -s --globoff -o /dev/null -w '%{http_code}' --max-time "$TIMEOUT" "$@" 2>/dev/null)"
  printf '%s' "${code:-000}"
}

# POST mit JSON-Datei. Körper wie oben in $TMPD/body, Rückgabe HTTP-Code.
# Danach ebenfalls koerper_lesen aufrufen.
http_post_json() {
  local url="$1" datei="$2" code
  rm -f "$TMPD/body"
  code="$(curl -s --globoff -o "$TMPD/body" -w '%{http_code}' --max-time "$TIMEOUT" \
          -X POST -H 'Content-Type: application/json' --data-binary "@$datei" "$url" 2>/dev/null)"
  printf '%s' "${code:-000}"
}

# Flaches JSON-Feld lesen — bewusst ohne jq, das ist auf einem frischen Ubuntu
# nicht installiert. Reicht für die flachen Antworten hier ("mail": true,
# "hasAdmin": false, "total": 168). Für verschachtelte Strukturen ist das
# absichtlich NICHT gedacht.
json_get() {
  printf '%s' "$1" | tr -d '\n' \
    | grep -oE "\"$2\"[[:space:]]*:[[:space:]]*(\"[^\"]*\"|true|false|null|-?[0-9]+(\.[0-9]+)?)" \
    | head -1 \
    | sed -E 's/^"[^"]*"[[:space:]]*:[[:space:]]*//; s/^"//; s/"$//'
}

# Enthält der Text die Zeichenkette? (fest, keine Regex)
hat() { printf '%s' "$1" | grep -qF -- "$2"; }

# Kurze, lesbare Fassung der letzten Antwort für Fehlermeldungen.
# Bei 000 gibt es keinen Body — dann steht dort sonst nur eine leere Zeile,
# und der Leser sucht den Fehler an der falschen Stelle.
kurz() {
  if [ "${1:-}" = "000" ]; then
    printf 'keine Antwort erhalten (DNS, TLS, Firewall oder Dienst unten)'
  else
    printf '%s' "$BODY" | head -c 200
  fi
}

# ── Kopf ─────────────────────────────────────────────────────────────────────
printf '%b' "$C_HEAD"
echo "════════════════════════════════════════════════════════════════════════"
echo " NEWEDGE — Abnahme nach dem Deploy (verify.sh $VERSION, rein lesend)"
echo "════════════════════════════════════════════════════════════════════════"
printf '%b' "$C_0"
printf '  Domain      %s   (%s)\n' "$DOMAIN" "$DOMAIN_QUELLE"
printf '  Monorepo    %s\n' "$REPO_ROOT"
printf '  Webroot     %s\n' "$WEB_ROOT"
if [ "$MM_PRUEFEN" -eq 1 ]; then
  printf '  Fremddienst %s (muss unverändert weiterlaufen)\n' "$MM_HOST"
else
  printf '  Fremddienst Prüfung abgeschaltet (--ohne-mattermost)\n'
fi
if [ "$MIT_FORMULAREN" -eq 1 ]; then
  printf '%b  Formulare   SCHREIBENDE TESTS AKTIV — es entstehen echte Leads (%s)%b\n' "$C_WARN" "$TEST_MAIL" "$C_0"
else
  printf '  Formulare   nur lesend (schreibende Tests mit --mit-formularen)\n'
fi
printf '  Zeichen     ✔ OK   ✖ BLOCKER   ⚠ WARNUNG   ? UNGEPRÜFT\n'

IST_ROOT=0
[ "$(id -u)" -eq 0 ] && IST_ROOT=1

if ! da curl; then
  printf '\n%b  ✖  curl fehlt — ohne curl ist keine einzige Prüfung möglich.%b\n' "$C_ERR" "$C_0"
  echo "     Abhilfe: apt-get install -y curl"
  exit 1
fi
if [ "$IST_ROOT" -eq 0 ]; then
  printf '\n%b  ⚠  Ohne sudo gestartet. docker, die .env-Dateien und die Prozessnamen%b\n' "$C_WARN" "$C_0"
  printf '%b     auf Port 80/443 sind dann nicht lesbar — die betroffenen Punkte%b\n' "$C_WARN" "$C_0"
  printf '%b     erscheinen als UNGEPRÜFT. Empfohlen: sudo %s%b\n' "$C_WARN" "$0" "$C_0"
fi

# Compose-Kommando bestimmen (v2-Plugin bevorzugt, v1 als Rückfallebene).
DC=(); DC_GEFUNDEN=0
if   docker compose version >/dev/null 2>&1; then DC=(docker compose); DC_GEFUNDEN=1
elif da docker-compose;                      then DC=(docker-compose); DC_GEFUNDEN=1
fi
# DOCKER_DA ist die einzige Bedingung, unter der "${DC[@]}" später expandiert
# wird — ein leeres Array wird nie angefasst.
DOCKER_DA=0
if [ "$DC_GEFUNDEN" -eq 1 ] && docker info >/dev/null 2>&1; then DOCKER_DA=1; fi

# ============================================================================
# A — Infrastruktur
# ============================================================================
abschnitt "A · Infrastruktur"

# A1 — Container laufen und sind healthy
if [ "$DOCKER_DA" -eq 0 ]; then
  ergebnis offen_b "A1" "Container laufen und sind healthy" \
    "docker ist nicht ansprechbar (fehlt, Dienst aus, oder keine Rechte)" \
    "Mit sudo ausführen. Sonst: systemctl status docker"
else
  PS_OUT="$( ( cd "$CMS_DIR" 2>/dev/null && "${DC[@]}" ps --format '{{.Service}}|{{.State}}|{{.Health}}' ) 2>/dev/null )"
  PS_ROH="$( ( cd "$CMS_DIR" 2>/dev/null && "${DC[@]}" ps ) 2>/dev/null )"
  A1_FEHLER=""
  for svc in postgres strapi lead-api; do
    zeile="$(printf '%s\n' "$PS_OUT" | grep -E "^$svc\|" | head -1)"
    if [ -n "$zeile" ]; then
      state="$(printf '%s' "$zeile" | cut -d'|' -f2)"
      health="$(printf '%s' "$zeile" | cut -d'|' -f3)"
      if [ "$state" != "running" ]; then
        A1_FEHLER="$A1_FEHLER$svc: State=$state"$'\n'
      elif [ -n "$health" ] && [ "$health" != "healthy" ]; then
        A1_FEHLER="$A1_FEHLER$svc: läuft, Healthcheck=$health"$'\n'
      fi
    else
      # Ältere Compose-Versionen kennen {{.Health}} nicht → Rohausgabe prüfen.
      if printf '%s\n' "$PS_ROH" | grep -q -- "$svc"; then
        if ! printf '%s\n' "$PS_ROH" | grep -- "$svc" | grep -qi 'up'; then
          A1_FEHLER="$A1_FEHLER$svc: nicht 'Up' (siehe docker compose ps)"$'\n'
        fi
      else
        A1_FEHLER="$A1_FEHLER$svc: Container nicht vorhanden"$'\n'
      fi
    fi
  done
  if [ -z "$A1_FEHLER" ]; then
    ergebnis ok "A1" "Container postgres, strapi, lead-api laufen"
  else
    ergebnis blocker "A1" "Container postgres, strapi, lead-api laufen" \
      "${A1_FEHLER%$'\n'}" \
      "cd $CMS_DIR && docker compose ps
cd $CMS_DIR && docker compose logs --tail 100 <service>"
  fi
fi

# A2 — Wer hält 80/443? Es darf NICHT unser Stack sein.
LISTEN_P=""
if da ss; then LISTEN_P="$(ss -ltnp 2>/dev/null)"; elif da lsof; then LISTEN_P="$(lsof -nP -iTCP -sTCP:LISTEN 2>/dev/null)"; fi
if [ -z "$LISTEN_P" ]; then
  ergebnis offen_b "A2" "Port 80/443 gehört weiter dem vorhandenen Webserver" \
    "Weder ss noch lsof lieferten eine Ausgabe" \
    "apt-get install -y iproute2, dann erneut mit sudo starten"
else
  WEB_ZEILEN="$(printf '%s\n' "$LISTEN_P" | grep -E '[:.](80|443)[[:space:]]' )"
  if [ -z "$WEB_ZEILEN" ]; then
    ergebnis blocker "A2" "Port 80/443 gehört weiter dem vorhandenen Webserver" \
      "Auf 80/443 lauscht niemand — die Domain kann gar nicht antworten" \
      "systemctl status caddy   (der Webserver ist unten)"
  elif printf '%s\n' "$WEB_ZEILEN" | grep -q 'docker-proxy'; then
    # Ein Container hält 443. Entscheidend ist, WESSEN Container: unser Stack
    # (Compose-Projekt "cms") darf das nie — ein fremder Caddy im Container ist
    # dagegen der bekannte Sonderfall aus CADDY-KOEXISTENZ.md.
    UNSER443=""
    [ "$DOCKER_DA" -eq 1 ] && UNSER443="$(docker ps --filter publish=443 --format '{{.Names}}' 2>/dev/null | grep -E '^cms[-_]')"
    if [ -n "$UNSER443" ]; then
      ergebnis blocker "A2" "Port 80/443 gehört weiter dem vorhandenen Webserver" \
        "Ein Container UNSERES Stacks hält 443: $UNSER443" \
        "postgres, strapi und lead-api dürfen ausschließlich an 127.0.0.1 binden.
ports-Einträge in $CMS_DIR/docker-compose.yml prüfen."
    else
      ergebnis warn "A2" "Port 80/443 gehört weiter dem vorhandenen Webserver" \
        "Ein fremder Container (docker-proxy) hält 80/443 — der Webserver läuft
also im Container, nicht als Systemdienst" \
        "Kein Fehler unseres Stacks. Für den Site-Block heißt das: Fall C in
$CMS_DIR/deploy/CADDY-KOEXISTENZ.md — der Einbau läuft dort anders
(Mount des Webroots, Reload per docker exec)."
    fi
  elif printf '%s\n' "$WEB_ZEILEN" | grep -q 'nginx'; then
    if [ "$MM_PRUEFEN" -eq 0 ]; then
      ergebnis ok "A2" "Port 80/443 gehört nginx (Modus --webserver=nginx, kein Fremddienst)"
    else
      ergebnis blocker "A2" "Port 80/443 gehört weiter dem vorhandenen Webserver" \
        "nginx hält 80/443 — auf diesem Server gehören sie Caddy (Mattermost!)" \
        "setup.sh lief im falschen Modus. Richtig ist --webserver=caddy.
Läuft hier bewusst nginx und gar kein Mattermost: --ohne-mattermost setzen."
    fi
  elif printf '%s\n' "$WEB_ZEILEN" | grep -q 'caddy'; then
    ergebnis ok "A2" "Port 80/443 gehört weiter Caddy"
  elif [ "$IST_ROOT" -eq 0 ]; then
    ergebnis offen_w "A2" "Port 80/443 gehört weiter dem vorhandenen Webserver" \
      "Ohne root zeigt ss keine Prozessnamen" \
      "Erneut mit sudo starten"
  else
    ergebnis warn "A2" "Port 80/443 gehört weiter dem vorhandenen Webserver" \
      "Lauscher erkannt, aber weder caddy noch nginx noch docker-proxy" \
      "Von Hand ansehen: ss -ltnp | grep -E ':(80|443)'"
  fi
fi

# A3 — Strapi und Lead-Service dürfen NUR lokal gebunden sein
LISTEN="$(ss -ltn 2>/dev/null || true)"
if [ -z "$LISTEN" ] && [ -n "$LISTEN_P" ]; then LISTEN="$LISTEN_P"; fi
if [ -z "$LISTEN" ]; then
  ergebnis offen_b "A3" "Strapi (1337) und Lead-Service (8090) binden nur auf 127.0.0.1" \
    "ss/lsof lieferten keine Ausgabe" "apt-get install -y iproute2"
else
  OFFEN="$(printf '%s\n' "$LISTEN" | grep -E '(0\.0\.0\.0|\*|\[::\]|::):(1337|8090)([[:space:]]|$)')"
  if [ -n "$OFFEN" ]; then
    ergebnis blocker "A3" "Strapi (1337) und Lead-Service (8090) binden nur auf 127.0.0.1" \
      "Mindestens einer der beiden Ports ist von außen erreichbar:
$OFFEN" \
      "docker-compose.yml prüfen: die ports-Einträge müssen '127.0.0.1:1337:1337'
bzw. '127.0.0.1:8090:8090' lauten. Danach: docker compose up -d"
  elif printf '%s\n' "$LISTEN" | grep -qE '127\.0\.0\.1:(1337|8090)'; then
    ergebnis ok "A3" "Strapi (1337) und Lead-Service (8090) binden nur auf 127.0.0.1"
  else
    ergebnis blocker "A3" "Strapi (1337) und Lead-Service (8090) binden nur auf 127.0.0.1" \
      "Auf 1337/8090 lauscht überhaupt niemand" \
      "cd $CMS_DIR && docker compose ps"
  fi
fi

# A4 — Personenbezogene Daten dürfen nicht weltlesbar sein
A4_PROBLEM=""
A4_UNGEPRUEFT=""
for pfad in "$LEAD_DIR/data" "$LEAD_DIR/.env" "$CMS_DIR/.env"; do
  if [ ! -e "$pfad" ]; then
    A4_UNGEPRUEFT="$A4_UNGEPRUEFT$pfad: existiert nicht"$'\n'
    continue
  fi
  m="$(stat -c '%a' "$pfad" 2>/dev/null || stat -f '%Lp' "$pfad" 2>/dev/null)"
  if [ -z "$m" ]; then
    A4_UNGEPRUEFT="$A4_UNGEPRUEFT$pfad: stat lieferte nichts"$'\n'
    continue
  fi
  # letzte Ziffer = Rechte für "andere". Alles außer 0 ist hier zu viel.
  if [ "${m: -1}" != "0" ]; then
    A4_PROBLEM="$A4_PROBLEM$pfad: Modus $m — auch Fremde dürfen lesen"$'\n'
  fi
done
if [ -n "$A4_PROBLEM" ]; then
  ergebnis blocker "A4" "Leads und Secrets sind nicht weltlesbar" \
    "${A4_PROBLEM%$'\n'}" \
    "chmod 700 $LEAD_DIR/data
chmod 600 $LEAD_DIR/.env $CMS_DIR/.env"
elif [ -n "$A4_UNGEPRUEFT" ]; then
  ergebnis warn "A4" "Leads und Secrets sind nicht weltlesbar" \
    "${A4_UNGEPRUEFT%$'\n'}" \
    "Fehlt apps/lead-api/.env, lief setup.sh nicht vollständig durch.
Ohne root ist der Pfad ggf. nur nicht sichtbar — dann mit sudo erneut prüfen."
else
  ergebnis ok "A4" "Leads und Secrets sind nicht weltlesbar"
fi

# ============================================================================
# B — CMS (Strapi)
# ============================================================================
abschnitt "B · CMS (Strapi)"

# B1 — Strapi antwortet lokal
CODE="$(code_of http://127.0.0.1:1337/_health)"
if [ "$CODE" = "204" ]; then
  ergebnis ok "B1" "Strapi antwortet lokal (127.0.0.1:1337/_health → 204)"
  STRAPI_LOKAL=1
else
  STRAPI_LOKAL=0
  ergebnis blocker "B1" "Strapi antwortet lokal (127.0.0.1:1337/_health → 204)" \
    "Antwort: HTTP $CODE (erwartet 204; 000 = keine Verbindung)" \
    "cd $CMS_DIR && docker compose logs --tail 100 strapi"
fi

# B2 — Strapi über die Domain (beweist die Proxy-Kette)
CODE="$(code_of "$BASE/_health")"
if [ "$CODE" = "204" ]; then
  ergebnis ok "B2" "Strapi über $BASE erreichbar (Proxy-Kette steht)"
else
  ergebnis blocker "B2" "Strapi über $BASE erreichbar (Proxy-Kette steht)" \
    "Antwort: HTTP $CODE (erwartet 204)" \
    "502 = der Webserver zeigt ins Leere (Strapi unten oder falscher Port).
404 = die CMS-Pfade fehlen im Site-Block (/api /admin /_health …).
000 = TLS/DNS/Firewall. Site-Block: $CMS_DIR/deploy/Caddyfile.newedge"
fi

# B3 — Admin-Panel + Admin-Konto
CODE="$(code_of "$BASE/admin")"
if [ "$CODE" = "200" ]; then
  ergebnis ok "B3" "Admin-Panel erreichbar ($BASE/admin)"
else
  ergebnis blocker "B3" "Admin-Panel erreichbar ($BASE/admin)" \
    "Antwort: HTTP $CODE (erwartet 200)" \
    "Ohne /admin kann niemand Inhalte pflegen. Pfadliste im Site-Block prüfen."
fi
CODE="$(http "$BASE/admin/init")"
koerper_lesen
HAS_ADMIN="$(json_get "$BODY" hasAdmin)"
if [ "$CODE" != "200" ]; then
  ergebnis offen_w "B3b" "Admin-Konto ist angelegt" \
    "/admin/init antwortete mit HTTP $CODE" \
    "Sobald /admin erreichbar ist, hier erneut prüfen"
elif [ "$HAS_ADMIN" = "true" ]; then
  ergebnis ok "B3b" "Admin-Konto ist angelegt (hasAdmin: true)"
else
  ergebnis warn "B3b" "Admin-Konto ist angelegt" \
    "hasAdmin: ${HAS_ADMIN:-unbekannt} — es existiert noch kein Redaktionskonto" \
    "EINMALIG im Browser anlegen: $BASE/admin
Das geht nur über die Weboberfläche. Bis dahin kann niemand Inhalte ändern."
fi

# B4 — Alle Single Types öffentlich lesbar und befüllt
SCHEMAS=("$CMS_DIR"/src/api/*/content-types/*/schema.json)
if [ ! -e "${SCHEMAS[0]}" ]; then
  ergebnis offen_b "B4" "Alle 48 Single Types öffentlich lesbar und befüllt" \
    "Keine Schema-Dateien unter $CMS_DIR/src/api gefunden" \
    "Das Skript muss aus der Monorepo-Wurzel laufen (dort, wo apps/ liegt)."
else
  N_SINGLE=0; N_SINGLE_OK=0
  B4_DETAIL=""
  B4_403=0
  for f in "${SCHEMAS[@]}"; do
    grep -q '"kind"[[:space:]]*:[[:space:]]*"singleType"' "$f" || continue
    api="$(sed -n 's/.*"singularName"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$f" | head -1)"
    [ -n "$api" ] || continue
    N_SINGLE=$((N_SINGLE+1))
    # Attributnamen: die Schlüssel direkt unterhalb von "attributes" stehen in
    # diesen Dateien konstant auf Einrückungstiefe 4. Verschachtelte Angaben
    # ("type", "required") liegen tiefer und werden so nicht mitgezählt.
    attrs="$(sed -n '/"attributes"[[:space:]]*:[[:space:]]*{/,$p' "$f" | grep -oE '^    "[A-Za-z0-9_]+"' | tr -d ' "')"
    code="$(http "$BASE/api/$api")"
    koerper_lesen
    if [ "$code" = "403" ]; then
      B4_403=$((B4_403+1))
      B4_DETAIL="$B4_DETAIL$api: HTTP 403 (keine öffentlichen Leserechte)"$'\n'
      continue
    fi
    if [ "$code" != "200" ]; then
      B4_DETAIL="$B4_DETAIL$api: HTTP $code"$'\n'
      continue
    fi
    if hat "$BODY" '"data":null'; then
      B4_DETAIL="$B4_DETAIL$api: HTTP 200, aber data ist null (Typ existiert, Inhalt fehlt)"$'\n'
      continue
    fi
    fehlend=""; leer=""
    while IFS= read -r a; do
      [ -n "$a" ] || continue
      if ! hat "$BODY" "\"$a\":"; then
        fehlend="$fehlend $a"
      elif printf '%s' "$BODY" | grep -qE "\"$a\"[[:space:]]*:[[:space:]]*(null|\"\"|\[\]|\{\})"; then
        leer="$leer $a"
      fi
    done <<<"$attrs"
    if [ -n "$fehlend" ] || [ -n "$leer" ]; then
      B4_DETAIL="$B4_DETAIL$api: fehlend=[${fehlend# }] leer=[${leer# }]"$'\n'
    else
      N_SINGLE_OK=$((N_SINGLE_OK+1))
    fi
  done
  if [ "$N_SINGLE" -eq 0 ]; then
    ergebnis offen_b "B4" "Alle Single Types öffentlich lesbar und befüllt" \
      "In den Schema-Dateien wurde kein einziger Single Type gefunden" \
      "Repo-Stand prüfen: ls $CMS_DIR/src/api"
  elif [ "$N_SINGLE_OK" -eq "$N_SINGLE" ]; then
    ergebnis ok "B4" "$N_SINGLE_OK von $N_SINGLE Single Types öffentlich lesbar und vollständig befüllt"
  else
    # Nur die ersten Zeilen zeigen — 48 Fehlermeldungen liest niemand.
    KURZ="$(printf '%s' "$B4_DETAIL" | head -8)"
    REST=$(( $(printf '%s' "$B4_DETAIL" | grep -c '') - 8 ))
    [ "$REST" -gt 0 ] && KURZ="$KURZ"$'\n'"… und $REST weitere"
    if printf '%s' "$B4_DETAIL" | grep -q 'HTTP 000'; then
      HINWEIS="HTTP 000 heißt: es kam gar keine Antwort — das ist kein CMS-Problem,
sondern DNS, TLS, Firewall oder ein toter Webserver. Erst B1 und B2 lösen,
danach hat diese Prüfung überhaupt erst Aussagekraft."
    elif [ "$B4_403" -gt 0 ]; then
      HINWEIS="403 heißt: der Seed lief NIE durch. Die öffentlichen Leserechte werden
ausschließlich im Seed vergeben (apps/cms/src/index.ts, nur bei SEED=1).
Ohne sie fällt die Website still auf eingebauten Content zurück — sie sieht
richtig aus, zeigt aber nicht das CMS.
Nachholen: sudo $CMS_DIR/deploy/update.sh reseed"
    else
      HINWEIS="Fehlende/leere Felder heißen: der Seed war unvollständig.
Prüfen: cd $CMS_DIR && docker compose logs strapi | grep '\[seed\]'
Nachholen: sudo $CMS_DIR/deploy/update.sh reseed  (überschreibt Redaktionsstand!)"
    fi
    ergebnis blocker "B4" "$N_SINGLE_OK von $N_SINGLE Single Types öffentlich lesbar und vollständig befüllt" \
      "$KURZ" "$HINWEIS"
  fi
fi

# B5 — Collection Types (Custom Posts)
B5_FEHLER=""; B5_WARN=""
for spec in "pain-points:8" "pain-point-ens:8" "testimonials:8" "jobs:4" "image-overrides:168"; do
  api="${spec%:*}"; soll="${spec#*:}"
  code="$(http "$BASE/api/$api?pagination[pageSize]=100")"
  koerper_lesen
  if [ "$code" = "403" ]; then
    B5_FEHLER="$B5_FEHLER$api: HTTP 403 (keine öffentlichen Leserechte → Seed lief nicht)"$'\n'
    continue
  fi
  if [ "$code" != "200" ]; then
    B5_FEHLER="$B5_FEHLER$api: HTTP $code"$'\n'
    continue
  fi
  # "total" steht in der pagination-Meta am Ende der Antwort.
  total="$(printf '%s' "$BODY" | tr -d '\n' | grep -oE '"total":[0-9]+' | tail -1 | cut -d: -f2)"
  total="${total:-0}"
  if [ "$total" -lt "$soll" ]; then
    B5_FEHLER="$B5_FEHLER$api: total=$total (erwartet $soll)"$'\n'
  elif [ "$total" -gt "$soll" ]; then
    B5_WARN="$B5_WARN$api: total=$total (erwartet $soll — offenbar redaktionell ergänzt)"$'\n'
  fi
done
if [ -n "$B5_FEHLER" ]; then
  ergebnis blocker "B5" "Collection Types vollständig und öffentlich lesbar" \
    "${B5_FEHLER%$'\n'}" \
    "403 = Seed lief nie (Leserechte hängen am Seed).
Zu wenige Einträge = Seed war unvollständig.
Nachholen: sudo $CMS_DIR/deploy/update.sh reseed"
elif [ -n "$B5_WARN" ]; then
  ergebnis warn "B5" "Collection Types vollständig und öffentlich lesbar" \
    "${B5_WARN%$'\n'}" \
    "Mehr Einträge als im Seed ist normal, sobald redaktionell gearbeitet wurde."
else
  ergebnis ok "B5" "Collection Types vollständig und öffentlich lesbar (8/8/8/4/168)"
fi

# B5b — bekannte Deckelung: image-overrides liefert der Website nur 100 Zeilen
code="$(http "$BASE/api/image-overrides?pagination[pageSize]=500")"
koerper_lesen
if [ "$code" = "200" ]; then
  # Anzahl gelieferter Zeilen = Anzahl der documentId-Vorkommen. `grep -c` zählt
  # ZEILEN, die Antwort ist aber eine einzige — deshalb -o und dann wc -l.
  gel="$(printf '%s' "$BODY" | grep -o '"documentId"' | wc -l | tr -d ' ')"
  tot="$(printf '%s' "$BODY" | tr -d '\n' | grep -oE '"total":[0-9]+' | tail -1 | cut -d: -f2)"
  gel="${gel:-0}"; tot="${tot:-0}"
  if [ "$tot" -gt "$gel" ]; then
    ergebnis warn "B5b" "Bilder-Austausch: alle Einträge erreichen das Frontend" \
      "Die API liefert $gel von $tot image-overrides (config/api.ts deckelt auf maxLimit 100)" \
      "Die letzten $((tot-gel)) austauschbaren Bilder greifen im Frontend nicht.
Entweder maxLimit in $CMS_DIR/config/api.ts anheben oder in
apps/website/src/hooks/useImageOverrides.ts paginieren. Kein Deploy-Fehler,
sondern ein bekannter Befund — er blockiert die Abnahme nicht."
  else
    ergebnis ok "B5b" "Bilder-Austausch: alle $tot Einträge erreichen das Frontend"
  fi
else
  ergebnis offen_w "B5b" "Bilder-Austausch: alle Einträge erreichen das Frontend" \
    "HTTP $code auf /api/image-overrides" "Siehe B5"
fi

# B6 — Ist der Seed jemals durchgelaufen?
if [ "$DOCKER_DA" -eq 0 ]; then
  ergebnis offen_w "B6" "Seed ist vollständig durchgelaufen ([seed] DONE)" \
    "docker nicht ansprechbar" "Mit sudo ausführen"
else
  # Log erst einsammeln, dann prüfen. `… logs | grep -q` würde den Erzeuger nach
  # dem ersten Treffer per SIGPIPE abwürgen; unter `set -o pipefail` liefert die
  # Pipeline dann 141 und der Marker gälte als NICHT gefunden, obwohl er dasteht.
  # (Ein Strapi-Log nach Build und Seed ist deutlich größer als der Pipe-Puffer.)
  SEED_LOG="$( ( cd "$CMS_DIR" 2>/dev/null && "${DC[@]}" logs --no-color strapi ) 2>/dev/null )"
  if grep -qF '[seed] DONE' <<<"$SEED_LOG"; then
    ergebnis ok "B6" "Seed ist vollständig durchgelaufen ([seed] DONE im Log)"
  else
    ergebnis warn "B6" "Seed ist vollständig durchgelaufen ([seed] DONE)" \
      "Der Marker steht nicht im Log des Strapi-Containers" \
      "Das ist NICHT zwingend ein Fehler: nach einem Container-Neubau ist das
Log des Erststarts weg. Der belastbare Beweis sind B4 und B5 — sind die
grün, ist der Seed gelaufen. Sind sie rot, hier ansetzen:
cd $CMS_DIR && docker compose logs strapi | grep '\[seed\]'"
  fi
fi

# B7 — Leads dürfen NICHT öffentlich abrufbar sein
CODE="$(http "$BASE/api/leads")"
koerper_lesen
if [ "$CODE" = "403" ]; then
  ergebnis ok "B7" "Leads sind NICHT öffentlich abrufbar (/api/leads → 403)"
elif [ "$CODE" = "404" ]; then
  ergebnis warn "B7" "Leads sind NICHT öffentlich abrufbar (/api/leads → 403)" \
    "HTTP 404 statt 403 — die Route antwortet gar nicht" \
    "Kein Datenschutzproblem, aber prüfen, ob der Content-Type 'Lead' existiert."
else
  ergebnis blocker "B7" "Leads sind NICHT öffentlich abrufbar (/api/leads → 403)" \
    "HTTP $CODE — bei 200 sind personenbezogene Daten öffentlich im Netz" \
    "SOFORT: Strapi-Admin → Settings → Users & Permissions → Roles → Public →
alle Rechte auf 'Lead' entfernen. Dann hier erneut prüfen."
fi

# ============================================================================
# C — Lead-Service (Formulare, Leads, E-Mail)
# ============================================================================
abschnitt "C · Lead-Service (Formulare, Leads, E-Mail)"

# C1 — Antwortet der Dienst lokal?
CODE="$(http http://127.0.0.1:8090/health)"
koerper_lesen
HEALTH_BODY="$BODY"
if [ "$CODE" = "200" ] && hat "$HEALTH_BODY" '"status"'; then
  ergebnis ok "C1" "Lead-Service antwortet lokal (127.0.0.1:8090/health)"
  LEAD_LOKAL=1
else
  LEAD_LOKAL=0
  ergebnis blocker "C1" "Lead-Service antwortet lokal (127.0.0.1:8090/health)" \
    "Antwort: HTTP $CODE" \
    "cd $CMS_DIR && docker compose logs --tail 100 lead-api"
fi

# C2 — /health darf von außen NICHT antworten
CODE="$(code_of "$BASE/health")"
if [ "$CODE" = "403" ]; then
  ergebnis ok "C2" "/health ist von außen gesperrt (403) — Betriebsinterna bleiben intern"
elif [ "$CODE" = "200" ]; then
  ergebnis blocker "C2" "/health ist von außen gesperrt (403)" \
    "HTTP 200 — SMTP-Status, CMS-Kopplung und Follow-up-Zahlen sind öffentlich" \
    "Im Site-Block muss der /health-Block 'respond @fremd 403' enthalten
(Caddy) bzw. 'allow 127.0.0.1; deny all;' (nginx).
Vorlage: $CMS_DIR/deploy/Caddyfile.newedge"
else
  ergebnis warn "C2" "/health ist von außen gesperrt (403)" \
    "HTTP $CODE statt 403 — nicht offen, aber auch nicht wie vorgesehen" \
    "Solange es nicht 200 ist, liegt kein Leck vor. Site-Block gegenprüfen."
fi

# C3 — Werden die Formular-/Abmeldepfade wirklich durchgereicht?
# Rein lesend: ein ungültiger Token erzeugt nichts, er zeigt nur die 404-Seite
# des Lead-Service. Genau daran erkennt man, ob der Proxy greift oder ob
# stattdessen die SPA ausgeliefert wird.
CODE="$(http "$BASE/abmelden/verify-sh-ungueltiger-token")"
koerper_lesen
if [ "$CODE" = "404" ] && hat "$BODY" "Link nicht mehr"; then
  ergebnis ok "C3" "Formular-/Abmeldepfade werden an den Lead-Service durchgereicht"
elif hat "$BODY" "<div id=\"root\""; then
  ergebnis blocker "C3" "Formular-/Abmeldepfade werden an den Lead-Service durchgereicht" \
    "/abmelden/<token> liefert die Website (SPA-Fallback) statt den Lead-Service" \
    "Im Site-Block fehlt der Block 'handle /abmelden/*' → reverse_proxy 127.0.0.1:8090.
Folge: jeder Abmeldelink in bereits versendeten Mails ist tot (DSGVO).
Vorlage: $CMS_DIR/deploy/Caddyfile.newedge"
else
  ergebnis blocker "C3" "Formular-/Abmeldepfade werden an den Lead-Service durchgereicht" \
    "HTTP $CODE, und die erwartete Seite des Lead-Service kam nicht zurück" \
    "502 = Lead-Container unten. Sonst Site-Block prüfen."
fi

# C4 — Testmodus oder echter Versand? Der wichtigste Punkt hier.
MAIL_FLAG="$(json_get "$HEALTH_BODY" mail)"
CMS_FLAG="$(json_get "$HEALTH_BODY" cms)"

# Zweite, unabhängige Quelle: die Umgebung IM laufenden Container. Die .env auf
# der Platte kann längst geändert sein, ohne dass der Container sie gelesen hat
# (env_file wird nur bei `up -d` neu eingelesen, nicht bei `restart`).
ENV_SEND=""; ENV_SMTP_HOST=""; ENV_PASS_ZUSTAND=""
if [ "$DOCKER_DA" -eq 1 ]; then
  CENV="$( ( cd "$CMS_DIR" 2>/dev/null && "${DC[@]}" exec -T lead-api printenv ) 2>/dev/null )"
  if [ -n "$CENV" ]; then
    ENV_SEND="$(printf '%s\n' "$CENV" | sed -n 's/^SEND_DISABLED=//p' | head -1)"
    ENV_SMTP_HOST="$(printf '%s\n' "$CENV" | sed -n 's/^SMTP_HOST=//p' | head -1)"
    PASS="$(printf '%s\n' "$CENV" | sed -n 's/^SMTP_PASS=//p' | head -1)"
    # Der Wert selbst wird NIE ausgegeben — nur sein Zustand.
    if   [ -z "$PASS" ];            then ENV_PASS_ZUSTAND="leer"
    elif [ "$PASS" = "xxxx xxxx xxxx xxxx" ]; then ENV_PASS_ZUSTAND="Platzhalter aus der Vorlage"
    else                                 ENV_PASS_ZUSTAND="gesetzt"; fi
  fi
fi

if [ "$LEAD_LOKAL" -eq 0 ]; then
  ergebnis offen_b "C4" "Mailversand ist scharf geschaltet (kein Testmodus)" \
    "Der Lead-Service antwortet nicht (siehe C1)" "Erst C1 lösen"
elif [ "$MAIL_FLAG" = "true" ]; then
  if [ "$ENV_PASS_ZUSTAND" = "Platzhalter aus der Vorlage" ] || [ "$ENV_PASS_ZUSTAND" = "leer" ]; then
    ergebnis warn "C4" "Mailversand ist scharf geschaltet (kein Testmodus)" \
      "/health meldet mail:true, aber SMTP_PASS im Container ist $ENV_PASS_ZUSTAND" \
      "Ohne gültiges App-Passwort quittiert jedes Formular mit 502 mail_failed.
App-Passwort in $LEAD_DIR/.env eintragen, dann:
cd $CMS_DIR && docker compose up -d lead-api      (NICHT restart!)"
  else
    ergebnis ok "C4" "Mailversand ist scharf geschaltet (SEND_DISABLED=${ENV_SEND:-0}, mail:true)"
  fi
elif [ "$MAIL_FLAG" = "false" ]; then
  GRUND="/health meldet mail:false"
  [ -n "$ENV_SEND" ]      && GRUND="$GRUND — SEND_DISABLED=$ENV_SEND im laufenden Container"
  [ -z "$ENV_SMTP_HOST" ] && [ "$DOCKER_DA" -eq 1 ] && GRUND="$GRUND, SMTP_HOST leer"
  ergebnis warn "C4" "Mailversand ist scharf geschaltet (kein Testmodus)" \
    "$GRUND
Die Formulare antworten trotzdem mit success:true — es geht aber KEINE Mail raus.
Genau das ist die Falle: von außen sieht der Testmodus wie Erfolg aus." \
    "1. Google-Workspace-App-Passwort in $LEAD_DIR/.env als SMTP_PASS eintragen
2. dort SEND_DISABLED=0 setzen
3. cd $CMS_DIR && docker compose up -d lead-api     (restart reicht NICHT —
   env_file wird nur bei 'up -d' neu gelesen)
4. Danach dieses Skript erneut, idealerweise mit --mit-formularen"
else
  ergebnis offen_b "C4" "Mailversand ist scharf geschaltet (kein Testmodus)" \
    "Aus /health war kein mail-Feld lesbar" \
    "Von Hand ansehen: curl -s http://127.0.0.1:8090/health"
fi

# C5 — Landen Leads auch im CMS?
if [ "$LEAD_LOKAL" -eq 0 ]; then
  ergebnis offen_w "C5" "Leads landen zusätzlich im CMS" "Lead-Service antwortet nicht" "Erst C1 lösen"
elif [ "$CMS_FLAG" = "true" ]; then
  ergebnis ok "C5" "Leads landen zusätzlich im CMS (STRAPI_URL + STRAPI_TOKEN gesetzt)"
else
  ergebnis warn "C5" "Leads landen zusätzlich im CMS" \
    "/health meldet cms:false — STRAPI_URL und/oder STRAPI_TOKEN fehlen" \
    "Leads gehen NICHT verloren: sie liegen in $LEAD_DIR/data/*.jsonl.
Sie sind nur im Strapi-Admin nicht sichtbar. Nachholen:
1. Strapi-Admin → Settings → API Tokens → neuer Token, Typ Custom,
   Rechte: nur Lead → create. Wird genau EINMAL angezeigt.
2. In $LEAD_DIR/.env eintragen:
   STRAPI_URL=http://strapi:1337
   STRAPI_TOKEN=<token>
3. cd $CMS_DIR && docker compose up -d lead-api"
fi

# C6 — Follow-ups (nur Information, Default ist bewusst aus)
if [ "$LEAD_LOKAL" -eq 1 ]; then
  FU_EN="$(printf '%s' "$HEALTH_BODY" | tr -d '\n' | sed -n 's/.*"followups"[[:space:]]*:[[:space:]]*{//p' | grep -oE '"enabled":(true|false)' | head -1 | cut -d: -f2)"
  FU_WORKER="$(printf '%s' "$HEALTH_BODY" | tr -d '\n' | sed -n 's/.*"followups"[[:space:]]*:[[:space:]]*{//p' | grep -oE '"worker":(true|false)' | head -1 | cut -d: -f2)"
  ergebnis info "C6" "Follow-up-Mails: enabled=${FU_EN:-?}, worker=${FU_WORKER:-?} (Default ist aus — kein Fehler)"
fi

# C7/C8/C9 — schreibende Tests, nur mit --mit-formularen
if [ "$MIT_FORMULAREN" -eq 0 ]; then
  ergebnis offen_w "C7" "Kontaktformular nimmt einen Lead an" \
    "Schreibende Tests sind standardmäßig aus" \
    "Einschalten mit --mit-formularen. Achtung: erzeugt einen ECHTEN Lead und —
bei scharfem Versand — echte Mails an NOTIFY_TO."
  ergebnis offen_w "C8" "ROI-Report nimmt einen Lead an und erzeugt ein PDF" \
    "Schreibende Tests sind standardmäßig aus" \
    "Einschalten mit --mit-formularen."
else
  printf '\n%b  ACHTUNG: die nächsten Tests schreiben. Es entstehen echte Einträge\n' "$C_WARN"
  printf '  in %s/data/ und — bei scharfem Versand — echte Mails an NOTIFY_TO.\n' "$LEAD_DIR"
  printf '  Testabsender: %s%b\n\n' "$TEST_MAIL" "$C_0"

  # C7a — Negativprobe: die Validierung muss greifen. Erzeugt KEINEN Lead,
  # weil server.py vor dem Schreiben prüft.
  cat > "$TMPD/ungueltig.json" <<'JSON'
{"name":"x","email":"kaputt","message":"kurz"}
JSON
  CODE="$(http_post_json "$BASE/contact" "$TMPD/ungueltig.json")"
  koerper_lesen
  if [ "$CODE" = "400" ]; then
    ergebnis ok "C7a" "Kontaktformular weist ungültige Eingaben ab (400, kein Lead entstanden)"
  elif [ "$CODE" = "429" ]; then
    ergebnis warn "C7a" "Kontaktformular weist ungültige Eingaben ab" \
      "HTTP 429 rate_limited (5 Anfragen je IP je 10 Minuten, gemeinsam mit /roi-report)" \
      "10 Minuten warten und erneut starten. Kein Fehler im Deploy."
  else
    ergebnis blocker "C7a" "Kontaktformular weist ungültige Eingaben ab" \
      "HTTP $CODE statt 400 — Antwort: $(kurz "$CODE")" \
      "Erwartet wird invalid_email / invalid_fields / consent_required.
Bei 000 zuerst B2 und D1 lösen — dann hat dieser Test erst Aussagekraft."
  fi

  # C7 — echter Kontakt-Lead
  cat > "$TMPD/contact.json" <<JSON
{"name":"NEWEDGE Abnahme (verify.sh)",
 "email":"$TEST_MAIL",
 "company":"verify.sh Abnahme",
 "message":"Automatischer Abnahmetest des Kontaktformulars nach dem Deploy. Dieser Eintrag darf geloescht werden.",
 "consent":true,
 "sourcePage":"/verify.sh"}
JSON
  CODE="$(http_post_json "$BASE/contact" "$TMPD/contact.json")"
  koerper_lesen
  CONTACT_ID="$(json_get "$BODY" contactId)"
  MAIL_FELD="$(json_get "$BODY" mail)"
  if [ "$CODE" = "200" ] && [ -n "$CONTACT_ID" ] && [ -z "$MAIL_FELD" ]; then
    ergebnis ok "C7" "Kontaktformular angenommen UND Mail vom Relay akzeptiert (contactId $CONTACT_ID)"
    TESTLEAD_KONTAKT="$CONTACT_ID"
  elif [ "$CODE" = "200" ] && [ "$MAIL_FELD" = "disabled" ]; then
    ergebnis warn "C7" "Kontaktformular angenommen — aber im TESTMODUS" \
      "Antwort enthält \"mail\":\"disabled\" → der Lead ist gespeichert (contactId $CONTACT_ID),
es wurde aber KEINE Mail verschickt." \
      "Siehe C4: SMTP_PASS eintragen, SEND_DISABLED=0, docker compose up -d lead-api"
    TESTLEAD_KONTAKT="$CONTACT_ID"
  elif [ "$CODE" = "502" ]; then
    ergebnis blocker "C7" "Kontaktformular angenommen und Mail verschickt" \
      "HTTP 502 — der SMTP-Server hat abgelehnt: $(printf '%s' "$BODY" | head -c 200)" \
      "Falsches App-Passwort oder blockierter Port 587. Zugangsdaten in
$LEAD_DIR/.env prüfen, danach: docker compose up -d lead-api"
    TESTLEAD_KONTAKT=""
  elif [ "$CODE" = "429" ]; then
    ergebnis warn "C7" "Kontaktformular nimmt einen Lead an" \
      "HTTP 429 rate_limited" "10 Minuten warten und erneut starten."
    TESTLEAD_KONTAKT=""
  else
    ergebnis blocker "C7" "Kontaktformular nimmt einen Lead an" \
      "HTTP $CODE — Antwort: $(kurz "$CODE")" \
      "cd $CMS_DIR && docker compose logs --tail 50 lead-api"
    TESTLEAD_KONTAKT=""
  fi

  # C8 — echter ROI-Lead inkl. PDF. Grundlage ist die mitgelieferte Beispiel-
  # datei: generate_roi_report.py erwartet in jeder rows-Zeile ein "sub", ein
  # selbst erfundener Payload scheitert daran.
  if [ ! -r "$LEAD_DIR/sample_roi_lead.json" ]; then
    ergebnis offen_w "C8" "ROI-Report nimmt einen Lead an und erzeugt ein PDF" \
      "$LEAD_DIR/sample_roi_lead.json nicht lesbar" "Aus dem Monorepo heraus starten"
  else
    # Nur die drei Kopffelder ersetzen (Einrückungstiefe 2) — die gleichnamigen
    # Felder in "rows" liegen tiefer und bleiben unberührt.
    sed -e "s|^  \"name\": .*|  \"name\": \"NEWEDGE Abnahme (verify.sh)\",|" \
        -e "s|^  \"company\": .*|  \"company\": \"verify.sh Abnahme\",|" \
        -e "s|^  \"email\": .*|  \"email\": \"$TEST_MAIL\",|" \
        "$LEAD_DIR/sample_roi_lead.json" > "$TMPD/roi.json"
    CODE="$(http_post_json "$BASE/roi-report" "$TMPD/roi.json")"
    koerper_lesen
    LEAD_ID="$(json_get "$BODY" leadId)"
    MAIL_FELD="$(json_get "$BODY" mail)"
    if [ "$CODE" = "200" ] && [ -n "$LEAD_ID" ] && [ -z "$MAIL_FELD" ]; then
      ergebnis ok "C8" "ROI-Report angenommen, PDF erzeugt, Mail akzeptiert (leadId $LEAD_ID)"
      TESTLEAD_ROI="$LEAD_ID"
    elif [ "$CODE" = "200" ] && [ "$MAIL_FELD" = "disabled" ]; then
      ergebnis warn "C8" "ROI-Report angenommen — aber im TESTMODUS" \
        "leadId $LEAD_ID gespeichert, PDF erzeugt, KEINE Mail verschickt" \
        "Siehe C4."
      TESTLEAD_ROI="$LEAD_ID"
    elif [ "$CODE" = "429" ]; then
      ergebnis warn "C8" "ROI-Report nimmt einen Lead an und erzeugt ein PDF" \
        "HTTP 429 rate_limited" "10 Minuten warten und erneut starten."
      TESTLEAD_ROI=""
    else
      ergebnis blocker "C8" "ROI-Report nimmt einen Lead an und erzeugt ein PDF" \
        "HTTP $CODE — Antwort: $(kurz "$CODE")" \
        "pdf_failed = Schriften/Assets im Image fehlen.
cd $CMS_DIR && docker compose logs --tail 50 lead-api"
      TESTLEAD_ROI=""
    fi

    # C8b — ist wirklich ein PDF entstanden? (nur mit Leserecht auf data/)
    if [ -n "${TESTLEAD_ROI:-}" ]; then
      PDF="$(ls -t "$LEAD_DIR/data/reports/"*.pdf 2>/dev/null | head -1)"
      if [ -z "$PDF" ]; then
        ergebnis offen_w "C8b" "Das erzeugte PDF liegt im Archiv" \
          "Kein PDF gefunden oder $LEAD_DIR/data/reports nicht lesbar (Modus 700, root)" \
          "Mit sudo erneut prüfen: ls -la $LEAD_DIR/data/reports"
      elif [ "$(head -c 4 "$PDF" 2>/dev/null)" = "%PDF" ]; then
        ergebnis ok "C8b" "Das erzeugte PDF liegt im Archiv ($(basename "$PDF"))"
      else
        ergebnis blocker "C8b" "Das erzeugte PDF liegt im Archiv" \
          "Die neueste Datei beginnt nicht mit %PDF: $PDF" \
          "cd $CMS_DIR && docker compose logs --tail 50 lead-api"
      fi
    fi
  fi

  # C9 — ist der Lead auch im CMS gelandet?
  if [ "$CMS_FLAG" = "true" ] && [ "$DOCKER_DA" -eq 1 ] && { [ -n "${TESTLEAD_KONTAKT:-}" ] || [ -n "${TESTLEAD_ROI:-}" ]; }; then
    LOG="$( ( cd "$CMS_DIR" 2>/dev/null && "${DC[@]}" logs --no-color --since 5m lead-api ) 2>/dev/null )"
    if printf '%s\n' "$LOG" | grep -qF 'im CMS angelegt'; then
      ergebnis ok "C9" "Der Testlead ist im CMS angelegt worden"
    elif printf '%s\n' "$LOG" | grep -qF 'NICHT ins CMS'; then
      ergebnis blocker "C9" "Der Testlead ist im CMS angelegt worden" \
        "Im Log steht: $(printf '%s\n' "$LOG" | grep -F 'NICHT ins CMS' | tail -1 | head -c 200)" \
        "HTTP 403 = der API-Token hat kein create-Recht auf Lead.
HTTP 400 = leadId doppelt. Token im Strapi-Admin prüfen (siehe C5)."
    else
      ergebnis offen_w "C9" "Der Testlead ist im CMS angelegt worden" \
        "Im Log der letzten 5 Minuten steht dazu nichts" \
        "cd $CMS_DIR && docker compose logs --since 10m lead-api | grep strapi"
    fi
  fi
fi

# ============================================================================
# D — Website
# ============================================================================
abschnitt "D · Website"

# D1 — Auslieferung und SPA-Fallback
D1_FEHLER=""
CT="$(curl -s --globoff -o /dev/null -w '%{http_code} %{content_type}' --max-time "$TIMEOUT" "$BASE/" 2>/dev/null)"
case "$CT" in
  "200 text/html"*) : ;;
  *) D1_FEHLER="$D1_FEHLER/: $CT (erwartet 200 text/html)"$'\n' ;;
esac
for p in kontakt ki-audit gibt-es-nicht-xyz; do
  c="$(code_of "$BASE/$p")"
  [ "$c" = "200" ] || D1_FEHLER="$D1_FEHLER/$p: HTTP $c (erwartet 200 — die SPA fängt jeden Pfad ab)"$'\n'
done
if [ -z "$D1_FEHLER" ]; then
  ergebnis ok "D1" "Website wird ausgeliefert, SPA-Fallback greift"
else
  ergebnis blocker "D1" "Website wird ausgeliefert, SPA-Fallback greift" \
    "${D1_FEHLER%$'\n'}" \
    "404 auf Unterseiten = try_files/file_server-Fallback auf index.html fehlt.
000 = TLS oder DNS. Ausrollverzeichnis: $WEB_ROOT/dist"
fi

# D1b — www
CODE="$(code_of "https://www.$DOMAIN/")"
if [ "$CODE" = "200" ] || [ "$CODE" = "301" ] || [ "$CODE" = "302" ] || [ "$CODE" = "308" ]; then
  ergebnis ok "D1b" "www.$DOMAIN wird ebenfalls bedient (HTTP $CODE)"
else
  ergebnis warn "D1b" "www.$DOMAIN wird ebenfalls bedient" \
    "HTTP $CODE" \
    "Meist fehlt der A-Record für www oder www steht nicht in der Adresszeile
des Site-Blocks. Kein Blocker, solange die Hauptdomain läuft — Besucher mit
www landen aber im Nichts."
fi

# D2 — Bundle-Auslieferung und Caching
INDEX="$(curl -s --globoff --max-time "$TIMEOUT" "$BASE/" 2>/dev/null)"
BUNDLE="$(printf '%s' "$INDEX" | grep -oE '/assets/[A-Za-z0-9._-]+\.js' | head -1)"
if [ -z "$BUNDLE" ]; then
  ergebnis offen_w "D2" "JS-Bundle wird mit Langzeit-Caching ausgeliefert" \
    "In der ausgelieferten index.html steht kein /assets/*.js" \
    "Ist $WEB_ROOT/dist/index.html wirklich der Vite-Build?"
else
  HDR="$(curl -s --globoff -I --max-time "$TIMEOUT" "$BASE$BUNDLE" 2>/dev/null)"
  BCODE="$(printf '%s' "$HDR" | head -1 | grep -oE '[0-9]{3}' | head -1)"
  if [ "$BCODE" != "200" ]; then
    ergebnis blocker "D2" "JS-Bundle wird ausgeliefert" \
      "$BUNDLE → HTTP ${BCODE:-000}" \
      "Ohne Bundle ist die Seite weiß. Ausrollstand prüfen: ls $WEB_ROOT/dist/assets"
  elif printf '%s' "$HDR" | grep -qi 'immutable'; then
    ergebnis ok "D2" "JS-Bundle wird mit Langzeit-Caching ausgeliefert ($BUNDLE)"
  else
    ergebnis warn "D2" "JS-Bundle wird mit Langzeit-Caching ausgeliefert" \
      "$BUNDLE liefert 200, aber ohne Cache-Control: … immutable" \
      "Nur ein Performance-Punkt. Im Site-Block fehlt der @assets_bundles-Header."
  fi
fi

# D3 — Zieht die Website ihre Inhalte überhaupt aus dem CMS?
# Ohne VITE_STRAPI_URL zur Bauzeit fragt die SPA das CMS NIE — sie zeigt dann
# den eingebauten Fallback-Content. Der sieht identisch aus (beides stammt aus
# derselben Quelle), niemand merkt es. Deshalb wird hier im ausgelieferten
# Bundle nach der CMS-Basis-URL gesucht.
D3_TREFFER=0
if [ -d "$WEB_ROOT/dist/assets" ] && [ -r "$WEB_ROOT/dist/assets" ]; then
  if grep -rlF "https://$DOMAIN" "$WEB_ROOT/dist/assets" --include='*.js' >/dev/null 2>&1; then
    D3_TREFFER=1
  fi
elif [ -n "$BUNDLE" ]; then
  # Erst in eine Datei holen, dann darin suchen. `curl … | grep -q` würde curl
  # nach dem ersten Treffer per SIGPIPE abwürgen; unter `set -o pipefail` käme
  # 141 zurück und das Bundle gälte als „kennt die CMS-Adresse nicht" — ein
  # BLOCKER auf einem völlig gesunden Deploy. Bundles sind hunderte Kilobyte
  # groß, der Fall tritt also zuverlässig ein.
  if curl -s --globoff --max-time "$TIMEOUT" -o "$TMPD/bundle.js" "$BASE$BUNDLE" 2>/dev/null &&
     grep -qF "https://$DOMAIN" "$TMPD/bundle.js" 2>/dev/null; then
    D3_TREFFER=1
  fi
  rm -f "$TMPD/bundle.js"
fi
if [ "$D3_TREFFER" -eq 1 ]; then
  ergebnis ok "D3" "Das ausgelieferte Bundle kennt die CMS-Adresse (https://$DOMAIN)"
else
  ergebnis blocker "D3" "Das ausgelieferte Bundle kennt die CMS-Adresse" \
    "Weder in $WEB_ROOT/dist/assets noch im Haupt-Bundle steht https://$DOMAIN" \
    "Die Website wurde ohne VITE_STRAPI_URL gebaut und läuft rein statisch:
sie sieht richtig aus, ignoriert das CMS aber vollständig. Redaktionelle
Änderungen erscheinen dann NIE auf der Seite.
Abhilfe: $WEB_DIR/.env.production prüfen (VITE_STRAPI_URL, VITE_API_URL auf
https://$DOMAIN), danach: sudo $CMS_DIR/deploy/update.sh website"
fi

# D3b — antwortet die API auch für den Browser-Origin?
CODE="$(code_of -H "Origin: https://$DOMAIN" "$BASE/api/home")"
if [ "$CODE" = "200" ]; then
  ergebnis ok "D3b" "Die CMS-API antwortet auf der Website-Origin (/api/home → 200)"
else
  ergebnis blocker "D3b" "Die CMS-API antwortet auf der Website-Origin" \
    "/api/home mit Origin https://$DOMAIN → HTTP $CODE" \
    "403 = öffentliche Leserechte fehlen (siehe B4).
Sonst CORS_ORIGINS in $CMS_DIR/.env prüfen."
fi

# D4 — ist der ausgerollte Stand der gebaute Stand?
if [ -d "$WEB_DIR/dist" ] && [ -d "$WEB_ROOT/dist" ] && da diff; then
  if diff -rq "$WEB_DIR/dist" "$WEB_ROOT/dist" >/dev/null 2>&1; then
    ergebnis ok "D4" "Ausgerollter Stand entspricht dem gebauten Stand"
  else
    ergebnis warn "D4" "Ausgerollter Stand entspricht dem gebauten Stand" \
      "$WEB_DIR/dist und $WEB_ROOT/dist unterscheiden sich" \
      "Meist harmlos (älterer Build im Repo). Sicher gleichziehen:
sudo $CMS_DIR/deploy/update.sh website
Genauer ansehen: diff -rq $WEB_DIR/dist $WEB_ROOT/dist"
  fi
else
  ergebnis offen_w "D4" "Ausgerollter Stand entspricht dem gebauten Stand" \
    "Eines der beiden Verzeichnisse fehlt oder ist nicht lesbar" \
    "Kein Fehler, wenn nach dem Deploy aufgeräumt wurde."
fi

# D5 — /uploads (Bilder aus dem CMS)
CODE="$(code_of "$BASE/uploads/")"
if [ "$CODE" = "502" ] || [ "$CODE" = "000" ]; then
  ergebnis blocker "D5" "/uploads ist erreichbar (Bilder aus dem CMS)" \
    "HTTP $CODE — der Pfad zeigt ins Leere" \
    "Hochgeladene Bilder wären damit tot. /uploads* muss im Site-Block auf
Strapi zeigen."
else
  ergebnis ok "D5" "/uploads ist erreichbar (HTTP $CODE — kein 502)"
fi

# ============================================================================
# E — Koexistenz: der Fremddienst muss unverändert weiterlaufen
# ============================================================================
abschnitt "E · Koexistenz (Fremddienst darf nicht gelitten haben)"

if [ "$MM_PRUEFEN" -eq 0 ]; then
  ergebnis info "E1" "Koexistenz-Prüfung abgeschaltet (--ohne-mattermost)"
else
  CODE="$(http "https://$MM_HOST/api/v4/system/ping")"
  koerper_lesen
  if [ "$CODE" = "200" ] && hat "$BODY" '"status":"OK"'; then
    ergebnis ok "E1" "$MM_HOST antwortet fachlich (system/ping → status OK)"
  elif [ "$CODE" = "200" ]; then
    ergebnis warn "E1" "$MM_HOST antwortet fachlich" \
      "HTTP 200, aber ohne \"status\":\"OK\" — vielleicht kein Mattermost unter dieser Adresse" \
      "Mit --mattermost=<host> die richtige Adresse angeben oder
--ohne-mattermost setzen, wenn dort nichts läuft."
  else
    ergebnis blocker "E1" "$MM_HOST antwortet fachlich (system/ping → status OK)" \
      "HTTP $CODE — der produktive Fremddienst antwortet nicht mehr" \
      "SOFORT zurückbauen. Der Caddy-Einbau hat Mattermost getroffen:
sudo caddy validate --config /etc/caddy/Caddyfile
Backup und rollback.sh liegen unter /root/newedge-caddy-*/
Notfallweg: curl -X POST http://127.0.0.1:2019/load \\
  -H 'Content-Type: application/json' --data-binary @/root/.../live-vorher.json
NIEMALS 'systemctl restart caddy' — nur reload."
  fi

  CODE="$(code_of "https://$MM_HOST/")"
  case "$CODE" in
    200|301|302|307|308) ergebnis ok "E2" "$MM_HOST liefert weiter aus (HTTP $CODE)" ;;
    *) ergebnis blocker "E2" "$MM_HOST liefert weiter aus" \
         "HTTP $CODE (502/404 heißt: das Routing des Fremddienstes ist zerschossen)" \
         "Siehe E1 — zurückbauen, nicht vorwärts reparieren." ;;
  esac

  if [ "$DOCKER_DA" -eq 1 ]; then
    MMPS="$(docker ps --format '{{.Names}}\t{{.Status}}' 2>/dev/null | grep -iE 'mattermost|hermes')"
    if [ -n "$MMPS" ]; then
      # Sekunden-Laufzeit heißt: der Container wurde eben neu gestartet. Ein
      # Caddy-RELOAD fasst fremde Container nicht an — ein restart/down schon.
      if printf '%s\n' "$MMPS" | grep -qiE 'Up (About a minute|[0-9]+ seconds?)'; then
        ergebnis warn "E3" "Fremd-Container laufen ununterbrochen" \
          "Sehr kurze Laufzeit — sieht nach einem Neustart aus:
$MMPS" \
          "Ein Reload darf Mattermost nicht neu starten. Prüfen, ob jemand
'systemctl restart caddy' oder 'docker compose down' benutzt hat.
Ist der Neustart erklärbar (Server-Reboot), ist das kein Befund."
      else
        ergebnis ok "E3" "Fremd-Container laufen ununterbrochen"
      fi
    else
      ergebnis info "E3" "Keine Container mit 'mattermost'/'hermes' im Namen gefunden (läuft evtl. als Systemdienst)"
    fi
  fi
fi

# E4 — Webserver-Zustand
if da systemctl; then
  if systemctl is-active --quiet caddy 2>/dev/null; then
    ergebnis ok "E4" "caddy.service ist active"
  elif systemctl is-active --quiet nginx 2>/dev/null; then
    ergebnis info "E4" "nginx.service ist active (caddy nicht) — Modus --webserver=nginx"
  else
    ergebnis warn "E4" "Webserver-Dienst ist aktiv" \
      "Weder caddy noch nginx melden 'active'" \
      "systemctl status caddy --no-pager
Wenn 80/443 dennoch antworten, läuft der Webserver im Container."
  fi
fi

# ============================================================================
# Zusammenfassung
# ============================================================================
printf '\n%b' "$C_HEAD"
echo "════════════════════════════════════════════════════════════════════════"
printf ' ERGEBNIS%b\n' "$C_0"
printf '   %b✔ %d bestanden%b   %b✖ %d Blocker%b   %b⚠ %d Warnungen%b   %b? %d ungeprüft%b\n' \
  "$C_OK" "$N_OK" "$C_0" "$C_ERR" "$N_BLOCK" "$C_0" "$C_WARN" "$N_WARN" "$C_0" \
  "$C_WARN" "$((N_OFFEN_B+N_OFFEN_W))" "$C_0"

if [ "$N_BLOCK" -gt 0 ]; then
  printf '\n%b  Offene BLOCKER — der Deploy gilt als gescheitert:%b\n' "$C_ERR" "$C_0"
  for e in "${BLOCKER_LISTE[@]}"; do printf '    ✖ %s\n' "$e"; done
fi
if [ "$N_OFFEN_B" -gt 0 ]; then
  printf '\n%b  Blockierende Prüfungen, die NICHT durchgeführt werden konnten:%b\n' "$C_WARN" "$C_0"
  for e in "${OFFEN_LISTE[@]}"; do
    case "$e" in *"(blockierend)") printf '    ? %s\n' "$e" ;; esac
  done
  printf '    → Das Ergebnis ist unvollständig. Meist genügt: sudo %s\n' "$0"
fi
if [ "$N_WARN" -gt 0 ]; then
  printf '\n%b  Warnungen — läuft, aber unvollständig:%b\n' "$C_WARN" "$C_0"
  for e in "${WARN_LISTE[@]}"; do printf '    ⚠ %s\n' "$e"; done
fi

if [ "$MIT_FORMULAREN" -eq 1 ]; then
  printf '\n%b  Testdaten aus diesem Lauf — bitte entfernen:%b\n' "$C_WARN" "$C_0"
  [ -n "${TESTLEAD_KONTAKT:-}" ] && printf '    · Kontakt-Lead  %s  in %s/data/contacts.jsonl\n' "$TESTLEAD_KONTAKT" "$LEAD_DIR"
  [ -n "${TESTLEAD_ROI:-}" ]     && printf '    · ROI-Lead      %s  in %s/data/leads.jsonl (+ PDF in data/reports/)\n' "$TESTLEAD_ROI" "$LEAD_DIR"
  if [ -z "${TESTLEAD_KONTAKT:-}" ] && [ -z "${TESTLEAD_ROI:-}" ]; then
    printf '    · keine — es wurde kein Lead angelegt\n'
  else
    printf '    Im CMS zusätzlich: Content-Manager → Lead → die Einträge mit\n'
    printf '    "%s" löschen.\n' "$TEST_MAIL"
    printf '    In den Dateien: die betreffende Zeile entfernen (jede Zeile ist ein Lead).\n'
  fi
fi

printf '\n  Was ein Skript NICHT beweisen kann:\n'
printf '    · dass die Mail wirklich im Postfach von NOTIFY_TO liegt (SPF/DKIM, Spam)\n'
printf '    · dass sich im Admin alle Felder bequem bearbeiten lassen\n'
printf '    · dass eine redaktionelle Änderung auf der Seite ankommt — dafür einmal\n'
printf '      im Admin ein sichtbares Feld ändern, publizieren, Seite hart neu laden\n'

if [ "$N_BLOCK" -gt 0 ]; then
  printf '\n%b  ✖ ABNAHME NICHT ERTEILT (%d Blocker)%b\n\n' "$C_ERR" "$N_BLOCK" "$C_0"
  exit 1
elif [ "$N_OFFEN_B" -gt 0 ]; then
  printf '\n%b  ? ABNAHME UNVOLLSTÄNDIG — %d blockierende Prüfung(en) waren nicht prüfbar%b\n\n' "$C_WARN" "$N_OFFEN_B" "$C_0"
  exit 2
else
  printf '\n%b  ✔ ABNAHME ERTEILT — kein Blocker offen%b\n' "$C_OK" "$C_0"
  [ "$N_WARN" -gt 0 ] && printf '    (%d Warnung(en) offen — siehe oben, sie blockieren nicht)\n' "$N_WARN"
  printf '\n'
  exit 0
fi
