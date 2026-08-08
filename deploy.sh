#!/usr/bin/env bash
# ============================================================================
# NEWEDGE — EIN Befehl für das komplette Deployment
# ----------------------------------------------------------------------------
#   sudo ./deploy.sh <domain> [tls-email] [--dry-run] [--ohne-caddy]
#   sudo ./deploy.sh <domain> --nur-pruefen
#   ./deploy.sh --hilfe
#
#   z. B.: sudo ./deploy.sh newedgebrand.com admin@newedgebrand.com
#
# Die Schalter der beiden Unterskripte werden DURCHGEREICHT, damit niemand den
# Aufruf von Hand nachbauen muss, wenn eine Prüfung dort überstimmt werden soll:
#   an caddy-einbinden.sh: --catchall-erlauben --dns-egal --ohne-mm-abnahme
#                          --ohne-www --conf-dir=<pfad>
#   an verify.sh:          --mit-formularen --ohne-mattermost --mattermost=<host>
#                          --test-mail=<adresse> --timeout=<sekunden>
#
# Dieses Skript SCHREIBT selbst nichts am System. Es prüft die Voraussetzungen,
# fängt die bekannten Stolperfallen eines Wiederholungslaufs ab und ruft dann
# der Reihe nach auf, was es schon gibt:
#
#   1. apps/cms/deploy/setup.sh --webserver=caddy   Stack + Website
#   2. apps/cms/deploy/caddy-einbinden.sh           Site-Block additiv einhängen
#   3. ./verify.sh                                  Abnahme
#
# Alle Aufrufe laufen über Pfade relativ zu DIESEM Skript, nicht zum aktuellen
# Arbeitsverzeichnis — das Skript darf also von überall gestartet werden.
#
# WARNUNG, die dieses Skript überall wiederholt: Auf diesem Server läuft ein
# PRODUKTIVES Mattermost hinter demselben Caddy. Es wird nichts gelöscht, nichts
# gestoppt und nichts neu gestartet. Der Caddy-Schritt arbeitet ausschließlich
# additiv; im Zweifel: --ohne-caddy.
# ============================================================================
set -euo pipefail

# ── Ausgabe ─────────────────────────────────────────────────────────────────
say()   { printf '\033[1;35m▸ %s\033[0m\n' "$*"; }
ok()    { printf '\033[1;32m✔ %s\033[0m\n' "$*"; }
warn()  { printf '\033[1;33m⚠ %s\033[0m\n' "$*"; }
err()   { printf '\033[1;31m✖ %s\033[0m\n' "$*" >&2; }
titel() { printf '\n\033[1;36m══ %s ══════════════════════════════════════\033[0m\n' "$*"; }

usage() {
  cat <<'EOF'
NEWEDGE — Deployment auf dem VPS (Website + CMS + Lead-Service)

  sudo ./deploy.sh <domain> [tls-email] [Schalter]

Beispiel für diesen Server:
  sudo ./deploy.sh newedgebrand.com admin@newedgebrand.com

Schalter:
  --dry-run       Nichts verändern. Zeigt nur, welche Schritte mit welchen
                  Argumenten liefen. Die Vorab-Prüfungen laufen trotzdem (sie
                  lesen nur). Unterskripte werden NICHT gestartet — außer sie
                  beherrschen selbst --dry-run, dann werden sie damit gerufen.
                  Das trifft hier NUR auf caddy-einbinden.sh zu; setup.sh und
                  verify.sh kennen keinen Trockenlauf und bleiben ungestartet.
  --ohne-caddy    Schritt 2 überspringen (Caddy-Site-Block NICHT einhängen).
                  Für Server, auf denen der Webserver anders verkabelt wird.
                  Stack und Website werden trotzdem gebaut und ausgerollt.
  --nur-pruefen   Nur ./verify.sh laufen lassen. Kein setup.sh, kein Caddy.
                  Geprüft wird vorher nur, was verify.sh selbst braucht — keine
                  Netz-, Platten-, Speicher- oder Compose-Prüfung.
  --hilfe         Diese Ausgabe.

Weiter an apps/cms/deploy/caddy-einbinden.sh (Schritt 2) — Überstimmungen, die
dort ausdrücklich abgestimmt gehören; die Abbruchmeldung des Schritts nennt den
passenden Schalter:
  --catchall-erlauben   Fortfahren, obwohl im Bestand eine Route OHNE
                        Host-Matcher existiert (sie könnte unsere Domain
                        vorher abfangen — erst die Abbruchmeldung lesen).
  --dns-egal            Fortfahren, obwohl der A-Record nicht hierher zeigt
                        (dann bekommt Caddy kein Zertifikat).
  --ohne-mm-abnahme     Fortfahren, obwohl der Fingerabdruck der fremden Hosts
                        nicht erhoben werden konnte. NUR nach Rücksprache.
  --ohne-www            www.<domain> aus der Adresszeile lassen.
  --conf-dir=<pfad>     Ablage des Site-Blocks (Vorgabe: /etc/caddy/conf.d).

Weiter an ./verify.sh (Schritt 3):
  --mit-formularen      Schreibende Formular-Tests einschalten. Erst DAS
                        beweist, dass nach dem SMTP-Handgriff wirklich eine
                        Mail rausgeht. Es entstehen echte Leads — verify.sh
                        sagt am Ende, welche und wo sie zu entfernen sind.
  --ohne-mattermost     Koexistenz-Prüfung aus (nur wenn dort nichts läuft).
  --mattermost=<host>   Anderer Fremddienst-Host (Vorgabe: chat.<domain>).
  --test-mail=<adresse> Absenderadresse der Formular-Tests.
  --timeout=<sekunden>  Zeitlimit je HTTP-Aufruf (Vorgabe: 15).

Kein --web-root: setup.sh rollt fest nach /var/www/newedgebrand aus. Ein hier
abweichender Pfad würde Caddy und Abnahme auf ein Verzeichnis zeigen lassen, in
dem nie ein Build landet.

Die tls-email wird an setup.sh durchgereicht. Im Caddy-Betrieb bleibt sie ohne
Wirkung (Caddy holt seine Zertifikate selbst, apps/cms/deploy/Caddyfile.newedge
enthält bewusst keinen globalen Options-Block).
EOF
}

# ── Parameter ───────────────────────────────────────────────────────────────
DRY=0
OHNE_CADDY=0
NUR_PRUEFEN=0
# Schalter, die NICHT dieses Skript auswertet, sondern die Unterskripte. Sie
# werden unverändert weitergereicht — sonst müsste man den Aufruf von Hand
# nachbauen, sobald eine Prüfung dort überstimmt werden soll.
CADDY_OPTS=()
VERIFY_OPTS=()
POSITIONAL=()
for arg in "$@"; do
  case "$arg" in
    --dry-run)          DRY=1 ;;
    --ohne-caddy)       OHNE_CADDY=1 ;;
    --nur-pruefen)      NUR_PRUEFEN=1 ;;
    # ── weiter an apps/cms/deploy/caddy-einbinden.sh (Schritt 2) ──────────
    --catchall-erlauben|--dns-egal|--ohne-mm-abnahme|--ohne-www|--conf-dir=*)
                        CADDY_OPTS+=("$arg") ;;
    # ── weiter an ./verify.sh (Schritt 3) ────────────────────────────────
    --mit-formularen|--ohne-mattermost|--mattermost=*|--test-mail=*|--timeout=*)
                        VERIFY_OPTS+=("$arg") ;;
    # Absichtlich NICHT angeboten: setup.sh rollt fest nach /var/www/newedgebrand
    # aus und kennt keinen Schalter dafür. Ein hier abweichender Pfad ginge nur
    # an Caddy und die Abnahme — beide zeigten dann auf ein Verzeichnis, in dem
    # nie ein Build landet. Deshalb hier klar abweisen statt still durchreichen.
    --web-root=*)       err "--web-root gibt es hier nicht."
                        echo "     setup.sh rollt fest nach /var/www/newedgebrand aus. Ein abweichender"
                        echo "     Pfad käme nur bei Caddy und der Abnahme an — die Website läge weiter"
                        echo "     woanders. Wenn das wirklich nötig ist: die Schritte einzeln aufrufen"
                        echo "     (setup.sh, caddy-einbinden.sh --web-root=…, verify.sh --web-root=…)."
                        exit 1 ;;
    --hilfe|-h|--help)  usage; exit 0 ;;
    -*)                 err "Unbekannte Option: $arg"; echo; usage; exit 1 ;;
    *)                  POSITIONAL+=("$arg") ;;
  esac
done

DOMAIN="${POSITIONAL[0]:-}"
TLS_EMAIL="${POSITIONAL[1]:-}"
[ -z "$DOMAIN" ] && { err "Domain fehlt."; echo; usage; exit 1; }

# ── Schalter-Kombinationen, die kein Ergebnis liefern können ────────────────
# --nur-pruefen + --dry-run: verify.sh ist selbst rein lesend und kennt keinen
# Trockenlauf. Es würde also gar nicht starten — und ein „bestanden" oder ein
# Exit-Code 0 für eine Prüfung, die nie lief, ist genau die Art Aussage, die
# dieses Skript nirgends macht.
if [ "$NUR_PRUEFEN" -eq 1 ] && [ "$DRY" -eq 1 ]; then
  err "--nur-pruefen und --dry-run zusammen ergeben kein Ergebnis."
  echo
  echo "  verify.sh verändert selbst nichts (es prüft nur) und kennt keinen"
  echo "  Trockenlauf. Es würde deshalb nicht gestartet, und dieses Skript"
  echo "  hätte nichts zu berichten. Gemeint ist vermutlich:"
  echo
  echo "      sudo ./deploy.sh $DOMAIN --nur-pruefen"
  echo
  exit 1
fi
# Schalter für einen Schritt, der gar nicht läuft: lieber jetzt abweisen, als
# den Anwender im Glauben zu lassen, seine Überstimmung sei angekommen.
if [ "$NUR_PRUEFEN" -eq 1 ] && [ "${#CADDY_OPTS[@]}" -gt 0 ]; then
  err "Mit --nur-pruefen läuft Schritt 2 nicht — diese Schalter kämen nirgends an: ${CADDY_OPTS[*]}"
  exit 1
fi
if [ "$OHNE_CADDY" -eq 1 ] && [ "${#CADDY_OPTS[@]}" -gt 0 ]; then
  err "Mit --ohne-caddy wird Schritt 2 übersprungen — diese Schalter kämen nirgends an: ${CADDY_OPTS[*]}"
  exit 1
fi

# Die Domain landet in URLs, sed-Ersetzungen und Webserver-Konfiguration —
# deshalb einmal prüfen, statt Sonderzeichen weiterzureichen (gleiche Regel
# wie in setup.sh, damit beide Skripte dasselbe akzeptieren).
case "$DOMAIN" in
  *[!a-zA-Z0-9.-]*|-*|.*|*.|*-) err "Ungültige Domain: $DOMAIN"; exit 1 ;;
esac
case "$DOMAIN" in
  *.*) ;;
  *) err "Ungültige Domain: $DOMAIN (Punkt fehlt — erwartet wird z. B. newedgebrand.com)"; exit 1 ;;
esac

# ── Pfade (alles relativ zu DIESEM Skript) ──────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$SCRIPT_DIR"
APPS_DIR="$REPO_ROOT/apps"
WEB_DIR="$APPS_DIR/website"
CMS_DIR="$APPS_DIR/cms"
LEAD_DIR="$APPS_DIR/lead-api"
DEPLOY_DIR="$CMS_DIR/deploy"
SETUP_SH="$DEPLOY_DIR/setup.sh"
CADDY_SH="$DEPLOY_DIR/caddy-einbinden.sh"
BACKUP_SH="$DEPLOY_DIR/backup.sh"
VERIFY_SH="$REPO_ROOT/verify.sh"
WEB_ROOT="/var/www/newedgebrand"
PG_VOLUME="$(basename "$CMS_DIR")_pgdata"   # Compose-Projektname = Ordnername

# Wohin backup.sh schreibt, steht in backup.sh — und zwar als fester Pfad, der
# NICHT aus dem Ort dieses Klons abgeleitet wird. Deshalb hier auslesen statt
# raten: sonst nennt dieses Skript einen Pfad, an dem nichts liegt.
BACKUP_DIR=""
if [ -r "$BACKUP_SH" ]; then
  BACKUP_DIR="$(sed -n 's/^BACKUP_DIR=//p' "$BACKUP_SH" | head -1 | tr -d '"'"'"' ')"
fi
[ -n "$BACKUP_DIR" ] || BACKUP_DIR="/opt/newedge/backups"

# ── Abbruchbericht ──────────────────────────────────────────────────────────
# Kein stilles Weiterlaufen: Jeder Schritt setzt vorher SCHRITT und WEITER.
# Bricht irgendetwas ab, sagt der Bericht, wo es stand, was schon passiert ist
# und wie man weitermacht.
SCHRITT="Start"
WEITER="Nichts verändert. Ursache beheben und ./deploy.sh erneut aufrufen."
STAND=()
FERTIG=0

# Im Trockenlauf passiert nichts — dann darf hier auch nichts als „passiert"
# protokolliert werden.
erledigt() { [ "$DRY" -eq 1 ] || STAND+=("$1"); }

bericht_abbruch() {
  local rc="$1"
  echo
  err "ABBRUCH im Schritt: $SCHRITT   (Exit-Code $rc)"
  echo
  echo "  Bis hierhin ist passiert:"
  if [ "${#STAND[@]}" -eq 0 ]; then
    echo "      – nichts. Der Server ist unverändert."
  else
    local s
    for s in "${STAND[@]}"; do echo "      – $s"; done
  fi
  echo
  echo "  So geht es weiter:"
  printf '      %s\n' "$WEITER"
  echo
  echo "  Nützlich bei der Fehlersuche:"
  echo "      cd $CMS_DIR && docker compose ps"
  echo "      cd $CMS_DIR && docker compose logs --tail=80 strapi"
  echo "      cd $CMS_DIR && docker compose logs --tail=80 lead-api"
  echo "      systemctl status caddy --no-pager | head -5"
  echo "      curl -s https://chat.$DOMAIN/api/v4/system/ping     # Mattermost lebt?"
  echo
}

on_exit() {
  local rc=$?
  trap - EXIT
  if [ "$rc" -ne 0 ] && [ "$FERTIG" -ne 1 ]; then
    bericht_abbruch "$rc"
  fi
  exit "$rc"
}
trap on_exit EXIT

schritt_ok() {
  if [ "$DRY" -eq 1 ]; then
    say "$1 — im Trockenlauf nicht ausgeführt"
  else
    ok "$1 abgeschlossen"
  fi
}

# Ruft ein Unterskript auf. Läuft alles über `bash <pfad>`, damit ein fehlendes
# Ausführungs-Bit (frischer Klon, Kopie per scp) nicht zum Rätsel wird.
#
#   ruf_skript <kennt-dry-run: 0|1> <pfad> [argumente …]
#
# Der erste Parameter ist eine ausdrückliche Angabe der Aufrufstelle, KEINE
# Vermutung: früher wurde die Datei nach der Zeichenkette '--dry-run' durchsucht.
# Das ging zweimal schief — ein Skript, das den Schalter nur im Fließtext
# erwähnt, wäre damit im Trockenlauf gestartet worden (und hätte ihn als
# unbekannte Option abgelehnt), und umgekehrt hing das Verhalten dieses Skripts
# an einem Kommentar in einer fremden Datei. Die Angabe wird trotzdem gegen die
# Datei geprüft — behauptet die Aufrufstelle etwas, was dort nicht vorkommt,
# wird lieber nicht gestartet.
ruf_skript() {
  local kennt_dry="$1" pfad="$2"; shift 2
  if [ "$DRY" -eq 1 ]; then
    if [ "$kennt_dry" -eq 1 ] && grep -q -- '--dry-run' "$pfad" 2>/dev/null; then
      printf '   \033[1;34m[dry-run]\033[0m bash %s %s --dry-run\n' "$pfad" "$*"
      bash "$pfad" "$@" --dry-run
      return $?     # Exit-Code NICHT verschlucken — er entscheidet über Abbruch
    fi
    printf '   \033[1;34m[dry-run]\033[0m würde laufen: bash %s %s\n' "$pfad" "$*"
    printf '   \033[1;34m[dry-run]\033[0m (dieses Skript kennt keinen Trockenlauf — es wird NICHT gestartet)\n'
    return 0
  fi
  bash "$pfad" "$@"
  return $?
}

# ── 1. Begrüßung ────────────────────────────────────────────────────────────
titel "NEWEDGE — Deployment auf $DOMAIN"
cat <<EOF

  Gleich passiert Folgendes: Erst prüft dieses Skript rein lesend, ob der Server
  und dieser Klon vollständig sind. Dann baut apps/cms/deploy/setup.sh den Docker-
  Stack (Postgres + Strapi auf 127.0.0.1:1337 + Lead-Service auf 127.0.0.1:8090)
  und rollt die fertige Website nach $WEB_ROOT/dist aus. Zum Schluss hängt
  caddy-einbinden.sh den Site-Block additiv in den laufenden Caddy und verify.sh
  prüft nach, ob wirklich alles antwortet.

EOF
warn "Auf diesem Server läuft ein PRODUKTIVES Mattermost hinter demselben Caddy."
cat <<EOF

  Deshalb gilt hier: nichts löschen, nichts stoppen, nichts neu starten. Der
  Caddy-Schritt arbeitet ausschließlich additiv, sichert vorher und prüft
  hinterher, dass Mattermost unverändert antwortet. Hintergrund und Rollback:
  $DEPLOY_DIR/CADDY-KOEXISTENZ.md
  Im Zweifel: ./deploy.sh $DOMAIN --ohne-caddy — dann bleibt der Webserver
  vollständig unberührt.

EOF
[ "$DRY"        -eq 1 ] && warn "TROCKENLAUF (--dry-run): Es wird nichts verändert."
[ "$OHNE_CADDY" -eq 1 ] && warn "--ohne-caddy: Der Site-Block wird NICHT eingehängt."
[ "$NUR_PRUEFEN" -eq 1 ] && warn "--nur-pruefen: Es läuft ausschließlich verify.sh."
# Durchgereichte Schalter gehören sichtbar gemacht: zwei davon überstimmen eine
# Schutzprüfung, einer erzeugt echte Leads.
[ "${#CADDY_OPTS[@]}"  -gt 0 ] && warn "An caddy-einbinden.sh: ${CADDY_OPTS[*]}"
[ "${#VERIFY_OPTS[@]}" -gt 0 ] && warn "An verify.sh: ${VERIFY_OPTS[*]}"
case " ${CADDY_OPTS[*]-} " in
  *" --catchall-erlauben "*|*" --dns-egal "*|*" --ohne-mm-abnahme "*)
    warn "Achtung: Damit wird eine Schutzprüfung des Caddy-Schritts überstimmt." ;;
esac
case " ${VERIFY_OPTS[*]-} " in
  *" --mit-formularen "*)
    warn "Achtung: --mit-formularen legt ECHTE Leads an (verify.sh nennt sie am Ende)." ;;
esac

# ── 2. Vorab-Prüfungen (lesen nur) ──────────────────────────────────────────
SCHRITT="Vorab-Prüfungen"
WEITER="Es wurde nichts verändert. Die oben genannten Punkte beheben, dann
      ./deploy.sh erneut aufrufen."

titel "Vorab-Prüfungen"

PROBLEME=()
problem() { PROBLEME+=("$1"); }

# Umfang der Vorab-Prüfungen. Geprüft wird ausschließlich, was die Schritte
# dieses Laufs WIRKLICH benutzen — jede darüber hinausgehende Bedingung würde
# einen Lauf verhindern, der sonst durchgelaufen wäre.
#   VOLL=1  setup.sh und (meist) caddy-einbinden.sh laufen: Pakete, Build,
#           Netzzugriff nach draußen, Platte, Speicher, Docker.
#   VOLL=0  --nur-pruefen: es läuft NUR verify.sh, und das ist rein lesend.
#           Dann sind apt-get, Registry-Erreichbarkeit, Plattenplatz und die
#           Compose-Version schlicht nicht Gegenstand — eine Abnahme darf nicht
#           daran scheitern, dass die Docker-Registry gerade nicht antwortet.
VOLL=1
[ "$NUR_PRUEFEN" -eq 1 ] && VOLL=0
if [ "$VOLL" -eq 0 ]; then
  say "Nur die Abnahme läuft — geprüft wird deshalb nur, was verify.sh selbst braucht."
  echo "     (Kein apt-get, kein Netz nach draußen, kein Platten-, Speicher- oder"
  echo "      Compose-Test. Diese Punkte gehören zum schreibenden Lauf.)"
fi

# 2a. Wurzelrechte -----------------------------------------------------------
IST_ROOT=0
[ "$(id -u)" -eq 0 ] && IST_ROOT=1
if [ "$IST_ROOT" -eq 1 ]; then
  ok "Wurzelrechte vorhanden"
elif [ "$DRY" -eq 1 ]; then
  warn "Kein root — im Trockenlauf zulässig. Prüfungen auf geschützte Dateien entfallen."
  warn "Der echte Lauf braucht: sudo ./deploy.sh $DOMAIN"
elif [ "$VOLL" -eq 0 ]; then
  # verify.sh läuft auch ohne root — es meldet die dann nicht prüfbaren Punkte
  # als UNGEPRÜFT und endet mit Exit-Code 2. Das ist ein ehrliches Ergebnis und
  # kein Grund, den Lauf hier abzuweisen.
  warn "Kein root. verify.sh läuft trotzdem, kann aber docker, die .env-Dateien"
  warn "und die Prozesse auf 80/443 nicht lesen — die Abnahme bleibt unvollständig."
  warn "Vollständig: sudo ./deploy.sh $DOMAIN --nur-pruefen"
else
  problem "Keine Wurzelrechte. Aufruf: sudo ./deploy.sh $DOMAIN${TLS_EMAIL:+ $TLS_EMAIL}"
fi

# 2b. Betriebssystem ---------------------------------------------------------
# Nur für den schreibenden Lauf: die apt-get/dpkg/systemd-Abhängigkeit steckt in
# setup.sh. verify.sh kommt mit curl und (optional) docker aus.
if [ "$VOLL" -eq 1 ]; then
  OS_NAME="unbekannt"
  if [ -r /etc/os-release ]; then
    # shellcheck disable=SC1091
    . /etc/os-release
    OS_NAME="${PRETTY_NAME:-${NAME:-unbekannt}}"
    case "${ID:-} ${ID_LIKE:-}" in
      *debian*|*ubuntu*) ok "Betriebssystem: $OS_NAME" ;;
      *) problem "Betriebssystem '$OS_NAME' ist weder Debian noch Ubuntu. setup.sh nutzt apt-get, dpkg-query und systemd — auf allem anderen läuft es nicht." ;;
    esac
  else
    problem "/etc/os-release fehlt — Betriebssystem nicht bestimmbar. Erwartet wird Ubuntu 24.04 oder Debian."
  fi
  command -v apt-get   >/dev/null 2>&1 || problem "apt-get fehlt (setup.sh installiert damit Pakete)."
  command -v systemctl >/dev/null 2>&1 || problem "systemctl fehlt — ohne systemd lässt sich Caddy nicht neu laden."
fi

# 2c. Werkzeuge --------------------------------------------------------------
# Diese vier braucht JEDER Lauf: ohne curl macht verify.sh keine einzige Prüfung
# (es steigt selbst mit Exit 1 aus), awk/sed/grep stecken in beiden Skripten.
for werkzeug in curl awk sed grep; do
  command -v "$werkzeug" >/dev/null 2>&1 || problem "$werkzeug fehlt (apt-get install -y coreutils curl gawk sed grep)."
done

if [ "$VOLL" -eq 1 ]; then
  # df und free wertet dieses Skript weiter unten selbst aus (Platte, Speicher);
  # free braucht zusätzlich setup.sh.
  command -v df   >/dev/null 2>&1 || problem "df fehlt (Paket coreutils) — Plattenplatz nicht prüfbar: apt-get install -y coreutils"
  command -v free >/dev/null 2>&1 || problem "free fehlt (Paket procps) — setup.sh bricht sonst kommentarlos ab: apt-get install -y procps"
  if ! command -v ss >/dev/null 2>&1 && ! command -v lsof >/dev/null 2>&1; then
    problem "Weder ss noch lsof vorhanden — setup.sh kann nicht feststellen, wer Port 80/443 hält, und bricht ab: apt-get install -y iproute2"
  fi

  # openssl ist die gefährlichste Lücke: setup.sh erzeugt damit die acht Secrets
  # in apps/cms/.env. Fehlt es, entsteht eine .env mit LEEREN Werten — und weil
  # setup.sh eine vorhandene .env nie überschreibt, ist der Server danach dauerhaft
  # kaputt. Deshalb hier abfangen, bevor irgendetwas geschrieben wird.
  if [ ! -f "$CMS_DIR/.env" ] && ! command -v openssl >/dev/null 2>&1; then
    problem "openssl fehlt, apps/cms/.env existiert noch nicht. setup.sh schriebe LEERE Secrets und der Stack wäre dauerhaft defekt: apt-get install -y openssl"
  fi

  # tar und gzip benutzt backup.sh — und das läuft vor jedem Wiederholungslauf.
  # Beim Erstlauf gibt es nichts zu sichern, deshalb hier nur eine Warnung: ein
  # fehlendes Archivwerkzeug soll den Erstlauf nicht aufhalten, aber niemand
  # soll später überrascht sein, dass die Sicherung nie lief.
  for werkzeug in tar gzip; do
    command -v "$werkzeug" >/dev/null 2>&1 || warn "$werkzeug fehlt — backup.sh kann keine Sicherung packen: apt-get install -y $werkzeug"
  done
fi

# Werkzeuge des Caddy-Schritts. Die Liste stammt 1:1 aus caddy-einbinden.sh [P1]
# — dort bricht jedes fehlende Stück hart ab, und zwar erst NACH dem zehn- bis
# fünfzehnminütigen Build von Schritt 1.
# python3 macht dort die gesamte JSON-Auswertung (Vorher/Nachher-Vergleich der
# laufenden Konfiguration) und die TLS-Proben gegen die fremden Hosts.
# jq wird ausdrücklich NICHT gebraucht und deshalb hier auch nicht verlangt —
# siehe caddy-einbinden.sh, Kopfkommentar und [P1] ("jq wird NICHT gebraucht").
# Auf einem frischen Ubuntu-24.04-Server ist jq nicht installiert; es zur
# Bedingung zu machen hieße, den Lauf an einem Paket scheitern zu lassen, das
# kein einziger Schritt benutzt.
if [ "$OHNE_CADDY" -eq 0 ] && [ "$NUR_PRUEFEN" -eq 0 ]; then
  command -v python3 >/dev/null 2>&1 || problem "python3 fehlt — der Caddy-Schritt vergleicht damit die laufende Konfiguration und prüft die fremden Hosts: apt-get install -y python3"

  for werkzeug in diff cat cp mkdir rm date; do
    command -v "$werkzeug" >/dev/null 2>&1 || problem "$werkzeug fehlt — der Caddy-Schritt bricht ohne dieses Werkzeug ab ([P1]): apt-get install -y diffutils coreutils"
  done

  # Prüfsumme: eines von dreien genügt. Sie unterscheidet 'wir haben die Datei
  # zuletzt angefasst' von 'jemand anders hat inzwischen editiert' — ohne sie
  # verweigert der Caddy-Schritt die Arbeit.
  if ! command -v sha256sum >/dev/null 2>&1 && ! command -v shasum >/dev/null 2>&1 && ! command -v openssl >/dev/null 2>&1; then
    problem "Kein Werkzeug für Prüfsummen (sha256sum, shasum oder openssl) — der Caddy-Schritt bricht ab ([P1]): apt-get install -y coreutils"
  fi

  # Der ganze Modus setzt voraus, dass Caddy hier als Systemdienst läuft (auf
  # diesem Server: vor dem produktiven Mattermost). Läuft er nicht oder steckt
  # er in einem Container, bräche Schritt 2 ab — dann lieber jetzt, vor einem
  # zehnminütigen Build.
  if command -v systemctl >/dev/null 2>&1; then
    CADDY_STATUS="$(systemctl is-active caddy 2>/dev/null || true)"
    if [ "$CADDY_STATUS" = "active" ]; then
      ok "caddy.service läuft (Systemdienst)"
    else
      problem "Kein aktiver caddy.service (systemctl is-active caddy → '${CADDY_STATUS:-unbekannt}'). Der Caddy-Schritt setzt Caddy als Systemdienst voraus; im Container wäre der Site-Block nicht einhängbar. Entweder klären oder mit --ohne-caddy laufen (Stack und Website werden trotzdem ausgerollt)."
    fi
  fi
fi

# 2d. Umgebungsvariablen, die den Lauf still ruinieren -----------------------
if [ "$VOLL" -eq 1 ] && [ "${NODE_ENV:-}" = "production" ]; then
  problem "NODE_ENV=production ist gesetzt. 'npm ci' ließe die devDependencies weg und der Vite-Build scheiterte. Ohne diese Variable starten (z. B. 'sudo env -u NODE_ENV ./deploy.sh $DOMAIN')."
fi
if [ -n "${COMPOSE_PROJECT_NAME:-}" ] && [ "$COMPOSE_PROJECT_NAME" != "$(basename "$CMS_DIR")" ]; then
  problem "COMPOSE_PROJECT_NAME='$COMPOSE_PROJECT_NAME' weicht vom Ordnernamen '$(basename "$CMS_DIR")' ab. Damit heißt das Datenbank-Volume anders, setup.sh hält den Lauf für einen Erststart und seedet gegen eine womöglich befüllte Datenbank. Variable entfernen."
fi

# 2e. Ist dieses Repo vollständig? -------------------------------------------
# Die Liste enthält genau die Dateien, ohne die ein späterer Schritt hart
# abbricht — und zwar erst, NACHDEM Pakete installiert, Secrets erzeugt und
# Container gebaut sind. Genau das soll diese Prüfung verhindern, deshalb gehört
# jede solche Datei hier hinein:
#   .env.production.example   Vorlage, aus der setup.sh apps/website/.env.production
#                             baut; fehlt sie, steigt setup.sh mit exit 1 aus.
#   Dockerfile (cms/lead-api) Build-Kontexte aus docker-compose.yml — ohne sie
#                             scheitert 'docker compose up -d --build'.
PFLICHT_DATEIEN=( "$VERIFY_SH" )
if [ "$VOLL" -eq 1 ]; then
  PFLICHT_DATEIEN+=(
    "$WEB_DIR/package.json"
    "$WEB_DIR/package-lock.json"
    "$WEB_DIR/.env.production.example"
    "$CMS_DIR/docker-compose.yml"
    "$CMS_DIR/package.json"
    "$CMS_DIR/Dockerfile"
    "$LEAD_DIR/.env.example"
    "$LEAD_DIR/server.py"
    "$LEAD_DIR/Dockerfile"
    "$SETUP_SH"
    "$DEPLOY_DIR/Caddyfile.newedge"
    "$BACKUP_SH"
  )
fi
FEHLT=()
for pfad in "${PFLICHT_DATEIEN[@]}"
do
  [ -f "$pfad" ] || FEHLT+=("$pfad")
done
for verzeichnis in "$WEB_DIR" "$CMS_DIR" "$LEAD_DIR"; do
  [ -d "$verzeichnis" ] || FEHLT+=("$verzeichnis/ (Verzeichnis)")
done
if [ "${#FEHLT[@]}" -eq 0 ]; then
  if [ "$VOLL" -eq 1 ]; then
    ok "Monorepo vollständig → $REPO_ROOT (apps/website, apps/cms, apps/lead-api)"
  else
    ok "verify.sh und die drei apps-Verzeichnisse liegen vor → $REPO_ROOT"
  fi
else
  for f in "${FEHLT[@]}"; do
    problem "Fehlt im Klon: $f"
  done
  problem "Dieses Skript muss aus einem VOLLSTÄNDIGEN Monorepo-Klon laufen (erwartet unter /opt/newedge)."
fi

# Das Skript für Schritt 2 — nur nötig, wenn Schritt 2 auch läuft.
if [ "$NUR_PRUEFEN" -eq 0 ] && [ "$OHNE_CADDY" -eq 0 ] && [ ! -f "$CADDY_SH" ]; then
  problem "$CADDY_SH fehlt. Entweder den Klon vervollständigen oder mit --ohne-caddy laufen (dann bleibt der Webserver unberührt)."
fi

# 2f. Internetzugang ---------------------------------------------------------
# Nur für den schreibenden Lauf. verify.sh spricht ausschließlich mit diesem
# Server und der eigenen Domain — eine Abnahme darf nicht daran scheitern, dass
# die Docker-Registry oder npm gerade nicht erreichbar sind (Firewall, die
# ausgehend nur ausgewählte Ziele zulässt, gestörte Registry).
# Jede Antwort zählt, auch 401/403: sie beweist, dass der Host erreichbar ist.
netz_test() { curl -sS --max-time 10 -o /dev/null "$1" >/dev/null 2>&1; }
if [ "$VOLL" -eq 1 ] && command -v curl >/dev/null 2>&1; then
  ZIELE=("https://registry.npmjs.org/" "https://registry-1.docker.io/v2/")
  command -v docker >/dev/null 2>&1 || ZIELE+=("https://get.docker.com")
  command -v node   >/dev/null 2>&1 || ZIELE+=("https://deb.nodesource.com/")
  if [ "$OHNE_CADDY" -eq 0 ] && [ "$NUR_PRUEFEN" -eq 0 ]; then
    ZIELE+=("https://acme-v02.api.letsencrypt.org/directory")
  fi
  NETZ_FEHLT=()
  for ziel in "${ZIELE[@]}"; do
    netz_test "$ziel" || NETZ_FEHLT+=("$ziel")
  done
  if [ "${#NETZ_FEHLT[@]}" -eq 0 ]; then
    ok "Internetzugang zu allen benötigten Quellen (${#ZIELE[@]} geprüft)"
  else
    for z in "${NETZ_FEHLT[@]}"; do
      problem "Nicht erreichbar: $z"
    done
    problem "Ohne diese Quellen scheitert der Lauf mitten im Build (Images, npm-Pakete, ACME). Firewall/Proxy klären."
  fi
fi

# 2g. Plattenplatz -----------------------------------------------------------
# Nur für den schreibenden Lauf: verify.sh legt nichts an außer einem winzigen
# Temp-Verzeichnis.
frei_mb() { df -Pk "$1" 2>/dev/null | awk 'NR==2{print int($4/1024)}'; }
if [ "$VOLL" -eq 1 ] && command -v df >/dev/null 2>&1; then
  DOCKER_PFAD="/var/lib/docker"
  [ -d "$DOCKER_PFAD" ] || DOCKER_PFAD="/var"
  DOCKER_FREI="$(frei_mb "$DOCKER_PFAD")"
  REPO_FREI="$(frei_mb "$REPO_ROOT")"
  if [ -n "$DOCKER_FREI" ]; then
    if   [ "$DOCKER_FREI" -lt 6000 ]; then problem "Nur ${DOCKER_FREI} MB frei auf $DOCKER_PFAD. Drei Images (Strapi-Build, Postgres, Python) brauchen realistisch 4–6 GB."
    elif [ "$DOCKER_FREI" -lt 10000 ]; then warn "Nur ${DOCKER_FREI} MB frei auf $DOCKER_PFAD — knapp, aber machbar."
    else ok "Plattenplatz $DOCKER_PFAD: ${DOCKER_FREI} MB frei"; fi
  else
    warn "Plattenplatz auf $DOCKER_PFAD nicht ermittelbar."
  fi
  if [ -n "$REPO_FREI" ] && [ "$REPO_FREI" -lt 2000 ]; then
    problem "Nur ${REPO_FREI} MB frei auf $REPO_ROOT — node_modules und der Vite-Build brauchen dort ~1,5 GB."
  fi
fi

# 2h. Arbeitsspeicher --------------------------------------------------------
# Der häufigste Abbruch überhaupt: der OOM-Killer holt sich mitten in Schritt 1
# den Strapi-Admin-Build (~2 GB) oder danach node beim Vite-Build (1–2 GB).
# Auf diesem Server laufen zusätzlich Mattermost und Hermes — deshalb zählt
# nicht nur der Gesamtspeicher, sondern vor allem der GERADE FREIE.
if [ "$VOLL" -eq 1 ] && command -v free >/dev/null 2>&1; then
  MEM_MB="$(free -m | awk '/^Mem:/{print $2}')"
  MEM_FREI="$(free -m | awk '/^Mem:/{print $NF}')"      # available
  SWAP_MB="$(free -m | awk '/^Swap:/{print $2}')"
  SWAP_FREI="$(free -m | awk '/^Swap:/{print $4}')"
  MEM_MB="${MEM_MB:-0}"; SWAP_MB="${SWAP_MB:-0}"
  MEM_FREI="${MEM_FREI:-0}"; SWAP_FREI="${SWAP_FREI:-0}"
  case "$MEM_FREI$SWAP_FREI" in ''|*[!0-9]*) MEM_FREI=0; SWAP_FREI=0 ;; esac
  SWAP_HINWEIS=0
  if [ "$((MEM_MB + SWAP_MB))" -lt 2500 ]; then
    warn "Nur ${MEM_MB} MB RAM + ${SWAP_MB} MB Swap. Der Strapi-Admin-Build braucht ~2 GB, der Vite-Build danach nochmal 1–2 GB — der OOM-Killer greift gern genau dort."
    SWAP_HINWEIS=1
  elif [ "$((MEM_FREI + SWAP_FREI))" -lt 2500 ]; then
    warn "Speicher insgesamt reicht (${MEM_MB} MB RAM + ${SWAP_MB} MB Swap), gerade FREI sind aber nur ${MEM_FREI} MB + ${SWAP_FREI} MB Swap."
    warn "Hier laufen bereits Mattermost und Hermes. Genau in dieser Lage killt der OOM-Killer den Build."
    SWAP_HINWEIS=1
  else
    ok "Arbeitsspeicher: ${MEM_MB} MB RAM + ${SWAP_MB} MB Swap (frei: ${MEM_FREI} MB + ${SWAP_FREI} MB)"
  fi
  if [ "$SWAP_HINWEIS" -eq 1 ]; then
    cat <<'EOF'
     Swap anlegen (2 GB, dauerhaft) — greift sofort, kein Neustart nötig:
         sudo fallocate -l 2G /swapfile
         sudo chmod 600 /swapfile
         sudo mkswap /swapfile
         sudo swapon /swapfile
         echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
     Bricht der Lauf trotzdem im Build ab: ein erneuter Aufruf ist gefahrlos
     (keine neuen Secrets, kein zweiter Seed) — siehe Hinweis bei Schritt 1/3.
EOF
  fi
fi

# 2i. Docker und Compose-Version ---------------------------------------------
# docker-compose.yml nutzt `env_file: - path: … required: false` — das setzt
# Compose 2.24 voraus. Auf einem Server, auf dem Docker schon läuft (hier: für
# Mattermost), überspringt setup.sh die Installation; eine alte Compose-Version
# fällt sonst erst auf, NACHDEM Pakete installiert und .env-Dateien erzeugt sind.
if command -v docker >/dev/null 2>&1; then
  if ! docker info >/dev/null 2>&1; then
    problem "Docker ist installiert, aber der Daemon antwortet nicht (docker info schlägt fehl): systemctl start docker"
  elif ! docker compose version >/dev/null 2>&1; then
    problem "'docker compose' (v2-Plugin) fehlt. Das alte docker-compose (v1) reicht nicht: apt-get install -y docker-compose-plugin"
  else
    CV_RAW="$(docker compose version --short 2>/dev/null || echo "")"
    CV="${CV_RAW#v}"
    CV_MAJ="${CV%%.*}"
    CV_REST="${CV#*.}"
    CV_MIN="${CV_REST%%.*}"
    case "$CV_MAJ$CV_MIN" in
      ''|*[!0-9]*)
        warn "Compose-Version nicht auswertbar ('$CV_RAW') — benötigt wird mindestens 2.24." ;;
      *)
        if [ "$CV_MAJ" -lt 2 ] || { [ "$CV_MAJ" -eq 2 ] && [ "$CV_MIN" -lt 24 ]; }; then
          problem "docker compose $CV_RAW ist zu alt. docker-compose.yml nutzt 'env_file: - path: … required: false' — das braucht 2.24 oder neuer: apt-get install -y docker-compose-plugin"
        else
          ok "Docker vorhanden, docker compose $CV_RAW (≥ 2.24)"
        fi ;;
    esac
  fi
else
  say "Docker ist noch nicht installiert — setup.sh holt es über get.docker.com nach (bringt eine aktuelle Compose-Version mit)."
fi

# 2j. Wiederholungslauf: bekannte Fallen abfangen -----------------------------
# Die drei .env-Dateien werden von setup.sh NIE überschrieben. Das ist richtig
# so (Secrets bleiben gültig, die Datenbank bleibt nutzbar) — hat aber zwei
# Konsequenzen, die hier geprüft werden, weil sie sonst still schiefgehen.
ERSTLAUF=1
if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  docker volume inspect "$PG_VOLUME" >/dev/null 2>&1 && ERSTLAUF=0
fi

if [ -f "$CMS_DIR/.env" ]; then
  if [ -r "$CMS_DIR/.env" ]; then
    # (1) Leere Secrets — Spur eines Erstlaufs ohne openssl.
    LEERE=()
    for schluessel in APP_KEYS API_TOKEN_SALT ADMIN_JWT_SECRET TRANSFER_TOKEN_SALT JWT_SECRET ENCRYPTION_KEY DATABASE_PASSWORD; do
      wert="$(sed -n "s/^${schluessel}=//p" "$CMS_DIR/.env" | head -1)"
      wert="${wert//\"/}"
      wert="${wert//,/}"
      wert="${wert// /}"
      [ -z "$wert" ] && LEERE+=("$schluessel")
    done
    if [ "${#LEERE[@]}" -gt 0 ]; then
      err "apps/cms/.env enthält LEERE Secrets: ${LEERE[*]}"
      cat <<EOF

  Das passiert, wenn beim ersten Lauf openssl fehlte. setup.sh überschreibt eine
  vorhandene .env nie — ein erneuter Lauf repariert das also NICHT, er würde nur
  wieder am Stack-Start scheitern. Deshalb hier Schluss, bevor etwas passiert.

  Reparatur:
      sudo apt-get install -y openssl
EOF
      if [ "$ERSTLAUF" -eq 1 ]; then
        cat <<EOF
      # Es gibt noch keine Datenbank (Volume $PG_VOLUME fehlt) — die Datei
      # kann gefahrlos weg, setup.sh legt sie mit frischen Secrets neu an:
      sudo rm -f $CMS_DIR/.env
      sudo ./deploy.sh $DOMAIN${TLS_EMAIL:+ $TLS_EMAIL}
EOF
      else
        cat <<EOF
      # ACHTUNG: Das Datenbank-Volume $PG_VOLUME existiert bereits.
      # Ein neues DATABASE_PASSWORD passt dann nicht mehr zum Postgres-Benutzer.
      # Erst sichern, dann entscheiden:
      sudo $BACKUP_SH
      # a) Datenbestand behalten: nur die LEEREN Zeilen von Hand füllen
      #    (Werte erzeugen mit: openssl rand -base64 32) und DATABASE_PASSWORD
      #    auf das Passwort setzen, mit dem Postgres angelegt wurde.
      # b) Neu anfangen (ALLE CMS-Daten weg):
      #    cd $CMS_DIR && sudo docker compose down -v
      #    sudo rm -f $CMS_DIR/.env
      #    sudo ./deploy.sh $DOMAIN${TLS_EMAIL:+ $TLS_EMAIL}
EOF
      fi
      problem "apps/cms/.env hat leere Secrets (siehe Anleitung oben)."
    fi

    # (2) Domain-Drift: setup.sh zieht die Domain in bestehenden .env-Dateien
    #     NICHT nach. Die Website zeigte auf die neue Domain, CMS und Lead-API
    #     würden sie per CORS abweisen — ohne jede Fehlermeldung im Log.
    ALT_URL="$(sed -n 's/^PUBLIC_URL=//p' "$CMS_DIR/.env" | head -1)"
    ALT_URL="${ALT_URL//\"/}"
    if [ -n "$ALT_URL" ] && [ "$ALT_URL" != "https://$DOMAIN" ]; then
      err "apps/cms/.env ist auf '$ALT_URL' eingestellt, aufgerufen wurde aber '$DOMAIN'."
      cat <<EOF

  setup.sh zieht die Domain in bestehenden .env-Dateien nicht nach. Website und
  CMS liefen danach auf verschiedenen Adressen und würden sich per CORS
  gegenseitig aussperren.

  Entweder mit der bisherigen Domain aufrufen — oder beide Dateien angleichen:

      sudo sed -i -e 's|^PUBLIC_URL=.*|PUBLIC_URL=https://$DOMAIN|' \\
                  -e 's|^CORS_ORIGINS=.*|CORS_ORIGINS=https://$DOMAIN,https://www.$DOMAIN|' \\
                  $CMS_DIR/.env
      sudo sed -i -e 's|^ALLOWED_ORIGINS=.*|ALLOWED_ORIGINS=https://$DOMAIN,https://www.$DOMAIN|' \\
                  -e 's|^FOLLOWUP_UNSUBSCRIBE_BASE=.*|FOLLOWUP_UNSUBSCRIBE_BASE=https://$DOMAIN|' \\
                  $LEAD_DIR/.env

  ACHTUNG bei FOLLOWUP_UNSUBSCRIBE_BASE: Diese Adresse steht in bereits
  versendeten Mails. Nach einer Änderung laufen alte Abmeldelinks ins Leere.
EOF
      problem "Domain-Abweichung zwischen apps/cms/.env und dem Aufruf (siehe oben)."
    fi
  else
    warn "apps/cms/.env ist für diesen Benutzer nicht lesbar — Secret- und Domain-Prüfung übersprungen (als root wiederholen)."
  fi
fi

# 2k. Ergebnis der Vorab-Prüfungen -------------------------------------------
if [ "${#PROBLEME[@]}" -gt 0 ]; then
  echo
  err "Vorab-Prüfung fehlgeschlagen — es wurde NICHTS verändert:"
  for p in "${PROBLEME[@]}"; do printf '   \033[1;31m✖\033[0m %s\n' "$p"; done
  echo
  echo "  Alles beheben und erneut aufrufen:"
  echo "      sudo ./deploy.sh $DOMAIN${TLS_EMAIL:+ $TLS_EMAIL}"
  echo
  FERTIG=1
  exit 1
fi
ok "Alle Vorab-Prüfungen bestanden"

# ── Abkürzung: nur prüfen ───────────────────────────────────────────────────
if [ "$NUR_PRUEFEN" -eq 1 ]; then
  SCHRITT="Abnahme (verify.sh)"
  WEITER="verify.sh selbst ist rein prüfend — der Server bleibt, wie er ist.
      Die Meldungen von verify.sh nennen die betroffenen Prüfpunkte."
  titel "Abnahme (nur prüfen)"
  set +e
  ruf_skript "$VERIFY_SH" "$DOMAIN"
  VERIFY_RC=$?
  set -e
  echo
  if [ "$DRY" -eq 1 ]; then
    # verify.sh kennt kein --dry-run, wurde also gar nicht gestartet. Hier jetzt
    # „bestanden" zu melden wäre eine Behauptung über eine Prüfung, die nie lief.
    warn "TROCKENLAUF: verify.sh wurde NICHT gestartet — es liegt kein Abnahmeergebnis vor."
    echo "     Echte Abnahme: sudo ./deploy.sh $DOMAIN --nur-pruefen"
  elif [ "$VERIFY_RC" -eq 0 ]; then
    ok "verify.sh: bestanden"
  else
    err "verify.sh: fehlgeschlagen (Exit-Code $VERIFY_RC) — Meldungen oben lesen."
  fi
  FERTIG=1
  exit "$VERIFY_RC"
fi

# ── 3. Wiederholungslauf: Lage melden, vorher sichern ───────────────────────
titel "Lagebild"
if [ "$ERSTLAUF" -eq 1 ]; then
  say "ERSTLAUF erkannt (Datenbank-Volume '$PG_VOLUME' existiert noch nicht)."
  echo "     setup.sh startet den Stack mit SEED=1: Content-Typen werden befüllt und"
  echo "     die öffentlichen Leserechte vergeben. Das dauert einige Minuten."
else
  say "WIEDERHOLUNGSLAUF erkannt (Volume '$PG_VOLUME' ist vorhanden)."
  echo "     Es wird KEIN Seed gefahren — redaktionelle Inhalte bleiben unangetastet."
  echo "     Vorhandene .env-Dateien werden nicht überschrieben, Secrets bleiben gültig."
  echo "     Images und Website werden neu gebaut und ausgerollt."

  # Vor einem Wiederholungslauf sichern. backup.sh ist additiv (schreibt nur nach
  # /opt/newedge/backups) und rotiert selbst. Läuft Postgres nicht, gibt es nichts
  # zu sichern — dann bleibt der Schritt aus.
  SCHRITT="Backup vor dem Wiederholungslauf"
  WEITER="Das Backup ist fehlgeschlagen, verändert wurde noch nichts.
      Von Hand versuchen: sudo $BACKUP_SH
      Danach ./deploy.sh erneut aufrufen."
  PG_LAEUFT=0
  if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
    if [ -n "$(cd "$CMS_DIR" && docker compose ps -q postgres 2>/dev/null)" ]; then PG_LAEUFT=1; fi
  fi
  if [ "$PG_LAEUFT" -eq 1 ]; then
    say "Backup vor dem Eingriff"
    if [ "$DRY" -eq 1 ]; then
      printf '   \033[1;34m[dry-run]\033[0m würde laufen: bash %s\n' "$BACKUP_SH"
    else
      set +e
      bash "$BACKUP_SH"
      BACKUP_RC=$?
      set -e
      if [ "$BACKUP_RC" -eq 0 ]; then
        erledigt "Backup nach /opt/newedge/backups geschrieben"
      else
        warn "Backup fehlgeschlagen (Exit-Code $BACKUP_RC). Der Lauf geht weiter, weil"
        warn "setup.sh keine Volumes löscht — aber bitte hinterher nachsehen:"
        warn "    sudo $BACKUP_SH"
      fi
    fi
  else
    warn "Postgres-Container läuft nicht — kein Backup möglich, es gibt gerade nichts zu sichern."
  fi
fi

# ── 4. Stack + Website (setup.sh) ───────────────────────────────────────────
SCHRITT="Stack + Website (setup.sh --webserver=caddy)"
WEITER="setup.sh prüft ZUERST rein lesend (Ports 80/443, 1337, 8090). Bricht es
      dort ab, ist der Server unverändert — die Meldung nennt den Grund.
      Kommt der Abbruch später, kann bereits Folgendes passiert sein: Pakete
      installiert, .env-Dateien erzeugt (werden nie überschrieben, Secrets
      bleiben gültig), Container gebaut und gestartet, Website nach
      $WEB_ROOT/dist ausgerollt.
      Ein erneuter Aufruf von ./deploy.sh ist gefahrlos: er seedet nicht neu und
      erzeugt keine neuen Secrets.
      Logs:  cd $CMS_DIR && docker compose logs --tail=80 strapi"

titel "Schritt 1/3 — Stack und Website"
say "bash $SETUP_SH $DOMAIN${TLS_EMAIL:+ $TLS_EMAIL} --webserver=caddy"
if [ -n "$TLS_EMAIL" ]; then
  echo "     (Die TLS-Adresse bleibt im Caddy-Modus ohne Wirkung — Caddy holt seine"
  echo "      Zertifikate selbst. setup.sh bekommt sie trotzdem, damit ein späterer"
  echo "      Lauf mit --webserver=nginx dieselben Angaben hat.)"
fi
echo
if [ -n "$TLS_EMAIL" ]; then
  ruf_skript "$SETUP_SH" "$DOMAIN" "$TLS_EMAIL" "--webserver=caddy"
else
  ruf_skript "$SETUP_SH" "$DOMAIN" "--webserver=caddy"
fi
erledigt "setup.sh durchgelaufen (Pakete, .env-Dateien, Container, Website-Build)"
schritt_ok "Schritt 1/3"

# Kontrolle direkt danach: Liegt der Build wirklich da?
if [ "$DRY" -eq 0 ]; then
  [ -f "$WEB_ROOT/dist/index.html" ] || {
    err "$WEB_ROOT/dist/index.html fehlt — der Website-Build ist nicht angekommen."
    exit 1
  }
  ok "Website-Build liegt unter $WEB_ROOT/dist"
  erledigt "Website nach $WEB_ROOT/dist ausgerollt"

  # Die stille Falle aus dem Wiederholungslauf: Die öffentlichen Leserechte in
  # Strapi werden AUSSCHLIESSLICH beim Seed vergeben. Nach einem halb geglückten
  # Erstlauf existiert das Volume, der Seed lief aber nie — dann antwortet /api
  # mit 403 und die Website fällt still auf ihren eingebauten Inhalt zurück.
  if curl -sf -o /dev/null --max-time 10 http://127.0.0.1:1337/_health 2>/dev/null; then
    # `|| true`, NICHT `|| echo "000"`: curl schreibt bei einem Verbindungsfehler
    # über -w bereits selbst "000". Ein zusätzliches echo hängte eine zweite
    # Zeile an und die Meldung unten läse "antwortet 000 000".
    API_CODE="$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 http://127.0.0.1:1337/api/home || true)"
    API_CODE="${API_CODE:-000}"
    case "$API_CODE" in
      200) ok "Öffentliche Leserechte stehen (127.0.0.1:1337/api/home → 200)" ;;
      403)
        warn "127.0.0.1:1337/api/home antwortet 403 — die öffentlichen Leserechte fehlen."
        cat <<EOF

  Das heißt: Der Content-Seed ist nie durchgelaufen (die Rechte werden nur dabei
  vergeben). Die Website läge zwar aus, zöge ihre Inhalte aber nicht aus dem CMS —
  und weil Seed- und Fallback-Texte identisch aussehen, fällt das im Browser nicht auf.

  Reparatur (überschreibt redaktionelle Änderungen mit dem Code-Stand, legt vorher
  selbst ein Backup an und fragt zur Sicherheit nach):
      sudo $DEPLOY_DIR/update.sh reseed

EOF
        ;;
      *) warn "127.0.0.1:1337/api/home antwortet $API_CODE — bitte in der Abnahme unten beachten." ;;
    esac
  else
    warn "Strapi antwortet lokal nicht auf /_health — verify.sh unten wird das aufgreifen."
  fi
fi

# ── 5. Caddy einhängen ──────────────────────────────────────────────────────
if [ "$OHNE_CADDY" -eq 1 ]; then
  titel "Schritt 2/3 — Caddy (übersprungen)"
  warn "--ohne-caddy: Der Site-Block wurde NICHT eingehängt."
  echo "     Von außen ist damit noch nichts erreichbar. Der fertige Block liegt in:"
  echo "         $DEPLOY_DIR/Caddyfile.newedge"
  echo "     Nachholen:  sudo bash $CADDY_SH $DOMAIN"
  echo "     Hintergrund: $DEPLOY_DIR/CADDY-KOEXISTENZ.md"
else
  SCHRITT="Caddy-Site-Block einhängen (caddy-einbinden.sh)"
  WEITER="Der Caddy-Schritt sichert vor jedem Schreibzugriff und rollt bei einer
      Abweichung selbst zurück — seine Ausgabe oben nennt Sicherungs- und
      Rollback-Pfad. Zuerst prüfen, ob Mattermost unverändert läuft:
          curl -s https://chat.$DOMAIN/api/v4/system/ping     → {\"status\":\"OK\"}
          systemctl status caddy --no-pager | head -5
      Stack und Website sind bereits ausgerollt und bleiben es. Nach der
      Reparatur genügt:
          sudo bash $CADDY_SH $DOMAIN
      Oder ohne Webserver-Eingriff weitermachen:
          sudo ./deploy.sh $DOMAIN --ohne-caddy"

  titel "Schritt 2/3 — Site-Block in den laufenden Caddy einhängen"
  warn "Ab hier ist der produktive Mattermost-Caddy im Spiel: additiv, mit Sicherung."
  say "bash $CADDY_SH $DOMAIN"
  echo
  if [ "$DRY" -eq 1 ]; then
    # Im Trockenlauf läuft caddy-einbinden.sh mit --dry-run — aber setup.sh lief
    # NICHT (es kennt kein --dry-run). Auf einem frischen Server fehlen deshalb
    # zwangsläufig dist/index.html und der laufende Stack, und der Probelauf
    # bricht in [P7] ab. Das ist erwartet und kein Grund, hier alles abzuwürgen:
    # aussagekräftig sind im Trockenlauf [P1]–[P6].
    set +e
    ruf_skript "$CADDY_SH" "$DOMAIN"
    CADDY_RC=$?
    set -e
    if [ "$CADDY_RC" -ne 0 ]; then
      echo
      warn "Probelauf des Caddy-Schritts endete mit Exit-Code $CADDY_RC."
      warn "Vor dem ersten echten Lauf ist das der Normalfall: [P7] verlangt"
      warn "$WEB_ROOT/dist/index.html sowie Strapi und Lead-Service — beides"
      warn "legt erst setup.sh an, und setup.sh läuft im Trockenlauf nicht."
      warn "Maßgeblich sind hier [P1]–[P6] (Rechte, Werkzeuge, Systemdienst,"
      warn "Wahrheitsprüfung, Struktur, Kollisionen). Bricht es schon dort ab,"
      warn "ist das ein echter Befund — Meldung oben lesen."
    fi
  else
    ruf_skript "$CADDY_SH" "$DOMAIN"
  fi
  erledigt "Caddy-Site-Block für $DOMAIN eingehängt und neu geladen"
  schritt_ok "Schritt 2/3"
fi

# ── 6. Abnahme ──────────────────────────────────────────────────────────────
SCHRITT="Abnahme (verify.sh)"
WEITER="verify.sh prüft nur, es verändert nichts. Die Meldungen oben nennen den
      betroffenen Punkt. Nach einer Korrektur wiederholen:
          sudo ./deploy.sh $DOMAIN --nur-pruefen"

titel "Schritt 3/3 — Abnahme"
say "bash $VERIFY_SH $DOMAIN"
echo
set +e
ruf_skript "$VERIFY_SH" "$DOMAIN"
VERIFY_RC=$?
set -e
echo
if [ "$DRY" -eq 1 ]; then
  # verify.sh kennt kein --dry-run und wurde deshalb nicht gestartet.
  warn "TROCKENLAUF: verify.sh wurde NICHT gestartet — es liegt kein Abnahmeergebnis vor."
elif [ "$VERIFY_RC" -eq 0 ]; then
  ok "verify.sh: bestanden"
else
  err "verify.sh: NICHT bestanden (Exit-Code $VERIFY_RC)"
  warn "Die Meldungen von verify.sh oben sind maßgeblich. Häufigste Ursache direkt"
  warn "nach dem ersten Deploy: Die beiden Handgriffe unten fehlen noch."
fi

# ── 7. Was jetzt noch ein Mensch tun muss ───────────────────────────────────
titel "Jetzt noch von Hand — ohne das ist der Betrieb NICHT vollständig"
cat <<EOF

  1) Strapi-Admin-Konto anlegen. Das geht nur im Browser:

         https://$DOMAIN/admin

     Vorher prüfen, ob wirklich noch keines existiert:
         curl -s https://$DOMAIN/admin/init
     Erwartet vorher: "hasAdmin":false   ·   nachher: "hasAdmin":true

  2) SMTP-App-Passwort eintragen. Bis dahin läuft der Lead-Service im TESTMODUS:
     Die Formulare antworten mit HTTP 200, die Leads werden gespeichert — aber es
     geht KEINE Mail raus, weder an den Interessenten noch an das Team.

         sudo nano $LEAD_DIR/.env
             SMTP_PASS=<Google-Workspace-App-Passwort>
             SEND_DISABLED=0

         cd $CMS_DIR && sudo docker compose up -d lead-api

     WICHTIG: 'up -d', NICHT 'restart'. 'restart' startet nur den Prozess im
     bestehenden Container und liest die .env nicht neu — die Änderung bliebe
     wirkungslos und man sucht an der falschen Stelle.

     Kontrolle:
         curl -s http://127.0.0.1:8090/health          → "mail":true
     Und danach einmal ins Postfach sehen: Ob die Mail auch zugestellt wird
     (SPF/DKIM, Spam-Ordner), kann kein Skript beweisen.

  3) API-Token, damit die Leads auch im CMS landen (nicht nur in den Dateien
     apps/lead-api/data/leads.jsonl und contacts.jsonl):

         https://$DOMAIN/admin  →  Settings  →  API Tokens  →  Create new API Token
         Typ: Custom · Rechte: ausschließlich  Lead → create

         sudo nano $LEAD_DIR/.env
             STRAPI_URL=http://strapi:1337
             STRAPI_TOKEN=<der eben erzeugte Token>

         cd $CMS_DIR && sudo docker compose up -d lead-api

     Kontrolle:
         curl -s http://127.0.0.1:8090/health          → "cms":true

  4) Backup-Zeitplan einrichten — sonst wird nie eines erstellt:

         sudo $BACKUP_SH
         echo '0 3 * * * root $BACKUP_SH >/var/log/newedge-backup.log 2>&1' | sudo tee /etc/cron.d/newedge-backup

  Danach die Abnahme wiederholen:
         sudo ./deploy.sh $DOMAIN --nur-pruefen

EOF

cat <<EOF
  Adressen und Handgriffe für später:

      Website          https://$DOMAIN
      CMS-Admin        https://$DOMAIN/admin
      Health CMS       curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:1337/_health   (→ 204)
      Health Leads     curl -s http://127.0.0.1:8090/health
      Mattermost       curl -s https://chat.$DOMAIN/api/v4/system/ping                        (→ {"status":"OK"})

      Update           git pull im Monorepo, danach: sudo ./deploy.sh $DOMAIN${TLS_EMAIL:+ $TLS_EMAIL}
                       (oder gezielt: sudo $DEPLOY_DIR/update.sh website|cms|lead|all)
      Backup           sudo $BACKUP_SH
      Caddy-Rollback   $DEPLOY_DIR/CADDY-KOEXISTENZ.md

EOF

if [ "$DRY" -eq 1 ]; then
  warn "TROCKENLAUF beendet — es wurde nichts verändert."
  echo "     Echter Lauf: sudo ./deploy.sh $DOMAIN${TLS_EMAIL:+ $TLS_EMAIL}"
  FERTIG=1
  exit 0
fi

echo
if [ "$VERIFY_RC" -eq 0 ]; then
  ok "DEPLOYMENT KOMPLETT — Abnahme bestanden. Es fehlen nur noch die Handgriffe oben."
else
  err "DEPLOYMENT AUSGEROLLT, ABNAHME OFFEN — verify.sh hat beanstandet (Exit-Code $VERIFY_RC)."
  echo "     Erst die Meldungen von verify.sh abarbeiten, dann:"
  echo "         sudo ./deploy.sh $DOMAIN --nur-pruefen"
fi
echo

FERTIG=1
exit "$VERIFY_RC"
