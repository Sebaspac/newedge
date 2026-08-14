#!/usr/bin/env bash
# ============================================================================
# NEWEDGE — One-Command-Server-Setup (Monorepo: Website + CMS + Lead-Service)
# ----------------------------------------------------------------------------
#   sudo ./apps/cms/deploy/setup.sh <domain> [tls-email] [--webserver=MODUS]
#   z. B.: sudo ./apps/cms/deploy/setup.sh newedgebrand.com admin@newedgebrand.com
#
# --webserver= steuert, ob und wie der Webserver angefasst wird:
#   nginx  (Default) nginx installieren + konfigurieren + certbot. Läuft NUR an,
#          wenn Port 80/443 frei sind oder bereits nginx darauf lauscht.
#   caddy  nginx-Teil UND certbot komplett überspringen. Für Server, auf denen
#          schon Caddy die Ports hält (z. B. neben einem produktiven Mattermost).
#          Das Skript nennt am Ende die restlichen Handgriffe; der fertige
#          Site-Block liegt in apps/cms/deploy/Caddyfile.newedge.
#          Ausführlich: apps/cms/deploy/CADDY-KOEXISTENZ.md
#   none   Nur Stack + Website bauen und ausrollen. Kein Webserver, kein certbot.
#
# Das Skript läuft AUS dem Monorepo heraus — EIN Klon genügt für alles:
#   apps/website/   Vite+React  → Build landet in /var/www/newedgebrand/dist
#   apps/cms/       Strapi 5 + Postgres (docker compose; hier liegt dieses Skript)
#   apps/lead-api/  FastAPI: Kontaktformular + ROI-Report (Container im selben Stack)
# Kein separater Website-Klon mehr: was hier gebaut wird, ist exakt der Stand,
# aus dem das Skript selbst stammt — kein zweiter Checkout, der wegdriften kann.
#
# Macht auf einem frischen Ubuntu/Debian-Server ALLES:
#   0. Vorab-Prüfung (rein lesend): Wer hält Port 80/443? Sind 1337/8090 frei?
#      Fremder Webserver → Abbruch, BEVOR irgendetwas verändert wurde.
#   1. Docker, nginx, git, rsync, Node 22 installieren (falls fehlend)
#   2. .env-Dateien anlegen: CMS-Secrets frisch generiert, Lead-Service aus der
#      Vorlage — bestehende .env-Dateien werden NIE überschrieben
#   3. Stack bauen & starten (Postgres + Strapi + Lead-Service, Erststart mit Seed)
#   4. Website aus apps/website bauen und nach /var/www ausrollen
#   5. nginx konfigurieren (Same-Origin: Website + CMS + Formulare auf einer Domain)
#   6. TLS via certbot (wenn E-Mail übergeben)
# Idempotent: erneuter Lauf aktualisiert, statt zu zerstören.
#
# Update-Lauf: im Monorepo `git pull`, danach dieses Skript erneut aufrufen.
# (Das Skript zieht bewusst NICHT selbst — es würde sich sonst mitten im Lauf
# unter den eigenen Füßen austauschen.)
# ============================================================================
set -euo pipefail

# ── Parameter ────────────────────────────────────────────────────────────────
usage() {
  cat <<'EOF'
Usage: sudo ./apps/cms/deploy/setup.sh <domain> [tls-email] [--webserver=nginx|caddy|none]

  --webserver=nginx  (Default) nginx einrichten + certbot. Bricht ab, wenn ein
                     ANDERER Webserver Port 80/443 hält.
  --webserver=caddy  nginx und certbot komplett überspringen — für Server, auf
                     denen Caddy die Ports hält (z. B. neben Mattermost).
                     Vorgehen: apps/cms/deploy/CADDY-KOEXISTENZ.md
  --webserver=none   Nur Stack + Website. Webserver wird nicht angefasst.
EOF
}

# Flags dürfen überall stehen, die Reihenfolge <domain> [tls-email] bleibt.
WEBSERVER="nginx"
POSITIONAL=()
for arg in "$@"; do
  case "$arg" in
    --webserver=*) WEBSERVER="${arg#*=}" ;;
    -h|--help)     usage; exit 0 ;;
    -*)            echo "Unbekannte Option: $arg"; echo; usage; exit 1 ;;
    *)             POSITIONAL+=("$arg") ;;
  esac
done

DOMAIN="${POSITIONAL[0]:-}"
TLS_EMAIL="${POSITIONAL[1]:-}"
[ -z "$DOMAIN" ] && { usage; exit 1; }

# VOR der sudo-Prüfung: ein Tippfehler im Modus (--webserver=cady) soll seine
# eigene Meldung bekommen und nicht als „Bitte mit sudo ausführen" durchgehen —
# sonst ruft der Operator denselben falschen Befehl gleich nochmal mit sudo auf
# und landet unbemerkt im Default nginx.
case "$WEBSERVER" in
  nginx|caddy|none) ;;
  *) echo "Unbekannter --webserver-Wert: $WEBSERVER (erlaubt: nginx, caddy, none)"; exit 1 ;;
esac

[ "$(id -u)" -eq 0 ] || { echo "Bitte mit sudo ausführen."; exit 1; }

# Die Domain landet in sed-Ersetzungen, nginx-Config und certbot-Aufrufen —
# deshalb einmal prüfen, statt Sonderzeichen durchzureichen.
case "$DOMAIN" in
  *[!a-zA-Z0-9.-]*|-*|.*|*.|*-) echo "Ungültige Domain: $DOMAIN"; exit 1 ;;
esac

# ── Pfade (alle relativ zum Skript — das Skript liegt im Monorepo) ───────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"  # apps/cms/deploy
CMS_DIR="$(dirname "$SCRIPT_DIR")"                          # apps/cms  (docker-compose.yml + .env)
APPS_DIR="$(dirname "$CMS_DIR")"                            # apps/
REPO_ROOT="$(dirname "$APPS_DIR")"                          # Monorepo-Wurzel
WEB_DIR="$APPS_DIR/website"                                 # Vite-Quellen (../../website)
LEAD_DIR="$APPS_DIR/lead-api"                               # FastAPI-Quellen
WEB_ROOT="/var/www/newedgebrand"                            # Ausrollziel des fertigen Builds

# Ein von außen mitgegebenes SEED (z. B. `SEED=1 sudo -E ./setup.sh …` oder eine
# in der Shell hängengebliebene Variable) würde über ${SEED:-0} in JEDEN
# compose-Aufruf dieses Skripts durchschlagen und sich in der Container-
# Konfiguration festsetzen. Deshalb hier einmal hart auf 0: der Seed wird
# ausschließlich über die Override-Datei weiter unten eingeschaltet.
export SEED=0

say()  { printf '\033[1;35m▸ %s\033[0m\n' "$*"; }
ok()   { printf '\033[1;32m✔ %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m⚠ %s\033[0m\n' "$*"; }
err()  { printf '\033[1;31m✖ %s\033[0m\n' "$*" >&2; }

# ── 0. Vorab-Checks ──────────────────────────────────────────────────────────
say "Vorab-Checks"

# Monorepo-Layout: das Skript baut ausschließlich Geschwister-Ordner. Fehlt einer,
# wurde das deploy/-Verzeichnis aus dem Repo herausgelöst — dann lieber sofort
# abbrechen als halb ausrollen.
[ -f "$WEB_DIR/package.json" ] || {
  echo "apps/website nicht gefunden (erwartet: $WEB_DIR)."
  echo "Dieses Skript muss aus einem vollständigen Monorepo-Klon laufen."
  exit 1
}
[ -f "$LEAD_DIR/.env.example" ] || {
  echo "apps/lead-api nicht gefunden (erwartet: $LEAD_DIR)."
  echo "Dieses Skript muss aus einem vollständigen Monorepo-Klon laufen."
  exit 1
}
ok "Monorepo erkannt → $REPO_ROOT"

MEM_MB=$(free -m | awk '/^Mem:/{print $2}')
[ "$MEM_MB" -lt 1900 ] && warn "Nur ${MEM_MB} MB RAM — Admin- und Vite-Build brauchen ~2 GB (Swap empfohlen)."

# ── 0b. Fremdinstallationen erkennen — dieser Block LIEST nur ────────────────
# Alles hier läuft VOR dem ersten apt-get, vor jedem Schreibzugriff und vor jedem
# Dienst-Neustart. Ein Abbruch in diesem Abschnitt hinterlässt den Server in
# exakt dem Zustand, in dem das Skript ihn vorgefunden hat.
#
# Warum das nötig ist: Server werden geteilt. Läuft dort schon ein Caddy mit
# einem produktiven Mattermost auf 80/443, wäre ein blindes `apt-get install
# nginx` + `certbot --nginx` im besten Fall wirkungslos (nginx startet nicht,
# Port belegt) — im schlechtesten Fall geht der fremde Dienst offline.
say "Umgebung prüfen (hier wird noch nichts verändert)"

# Ohne ss/lsof lässt sich nicht feststellen, wer die Ports hält. Dann wird
# NICHT geraten: lieber abbrechen, als einen laufenden Fremddienst zu überbauen.
PORT_TOOL=""
if   command -v ss   >/dev/null 2>&1; then PORT_TOOL=ss
elif command -v lsof >/dev/null 2>&1; then PORT_TOOL=lsof
fi
if [ -z "$PORT_TOOL" ]; then
  err "Weder 'ss' noch 'lsof' vorhanden — die Port-Prüfung ist nicht möglich."
  cat >&2 <<'EOF'

  Ohne diese Prüfung könnte das Skript einen laufenden Fremddienst überbauen.
  Erst nachrüsten, dann erneut starten:

      apt-get install -y iproute2      # liefert 'ss'

  Es wurde nichts verändert.
EOF
  exit 1
fi

# Prozessnamen, die auf einem Port LAUSCHEN — einer pro Zeile, leer = niemand.
# ss zeigt die Namen nur als root; das Skript läuft ohnehin nur mit sudo.
listeners_on() {
  local port="$1"
  case "$PORT_TOOL" in
    ss)
      ss -ltnp 2>/dev/null | awk -v re=":$port\$" '
        NR > 1 && $4 ~ re {
          rest = $0; found = 0
          # users:(("nginx",pid=1,fd=6),("nginx",pid=2,fd=6)) → nginx (einmal)
          while (match(rest, /"[^"]*"/)) {
            n = substr(rest, RSTART + 1, RLENGTH - 2)
            if (!(n in seen)) { seen[n] = 1; print n }
            rest = substr(rest, RSTART + RLENGTH); found = 1
          }
          # Lauscht jemand ohne erkennbaren Namen, ist der Port trotzdem belegt.
          if (found == 0 && !("?" in seen)) { seen["?"] = 1; print "unbekannter-prozess" }
        }'
      ;;
    lsof)
      lsof -nP -iTCP:"$port" -sTCP:LISTEN 2>/dev/null | awk 'NR > 1 { print $1 }' | sort -u
      ;;
  esac
}

# Mehrzeilige Prozessliste → eine lesbare Zeile für die Ausgabe.
oneline() { printf '%s' "$1" | tr '\n' ' ' | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'; }

LISTEN_80="$(listeners_on 80)"
LISTEN_443="$(listeners_on 443)"
WEB_LISTENERS="$(printf '%s\n%s\n' "$LISTEN_80" "$LISTEN_443" | sed '/^$/d' | sort -u)"
LISTEN_80_TXT="$(oneline "$LISTEN_80")";  [ -n "$LISTEN_80_TXT"  ] || LISTEN_80_TXT="frei"
LISTEN_443_TXT="$(oneline "$LISTEN_443")"; [ -n "$LISTEN_443_TXT" ] || LISTEN_443_TXT="frei"

# Alles außer nginx gilt als Fremddienst. Die üblichen Verdächtigen heißen
# caddy, apache2/httpd, traefik, lighttpd, haproxy oder docker-proxy (= ein
# Container hält den Port) — erkannt wird aber JEDER fremde Lauscher, auch einer,
# dessen Namen wir nicht kennen. Die Namen stehen unten wörtlich in der Meldung.
FOREIGN_NAMES=""
while read -r n; do
  [ -n "$n" ] || continue
  case "$n" in
    nginx) ;;                       # unser Erwartungsfall, kein Fremddienst
    *)     FOREIGN_NAMES="$FOREIGN_NAMES $n" ;;
  esac
done <<<"$WEB_LISTENERS"
FOREIGN_NAMES="$(oneline "$FOREIGN_NAMES")"

# ── Docker-Bestand ───────────────────────────────────────────────────────────
# WICHTIG und nicht bloß informativ: ein Webserver im Container taucht in
# `ss -ltnp` NICHT zuverlässig auf. Mit der Docker-Voreinstellung
# (`userland-proxy: true`) hält ein sichtbarer `docker-proxy` den Port — den
# fängt die Namensprüfung oben ab. Steht in /etc/docker/daemon.json aber
# `"userland-proxy": false` (auf getunten Servern durchaus üblich), gibt es
# GAR KEINEN Host-Socket: die Veröffentlichung läuft rein über DNAT-Regeln in
# iptables/nftables. `ss` meldet dann „Port frei", obwohl hinter demselben Port
# ein produktives Mattermost hängt. Deshalb ist `docker ps --filter publish=…`
# eine EIGENSTÄNDIGE, gleichwertige Quelle — und unten ein Abbruchgrund.
DOCKER_OK=0
OUR_CONTAINER_IDS=""
DOCKER_WEB=""
DOCKER_WEB_DORMANT=""
if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  DOCKER_OK=1
  DOCKER_PS="$(docker ps --format '{{.Names}}  ·  {{.Image}}  ·  {{.Ports}}' 2>/dev/null || true)"
  if [ -n "$DOCKER_PS" ]; then
    echo "    Laufende Container (nur zur Information):"
    printf '%s\n' "$DOCKER_PS" | sed 's/^/      /'
  else
    echo "    Laufende Container: keine"
  fi
  # Container unseres eigenen Compose-Projekts. Auf dem Erstlauf leer; bei einem
  # Update-Lauf brauchen wir sie, um „Port belegt" von „Port von UNS belegt" zu
  # unterscheiden. 2>/dev/null: ohne .env quittiert compose config mit Fehler.
  OUR_CONTAINER_IDS="$( (cd "$CMS_DIR" && docker compose ps -q 2>/dev/null) || true )"
  # Gleiche Filter-Schlüssel werden von Docker ODER-verknüpft: 80 ODER 443.
  DOCKER_WEB="$(docker ps --filter publish=80 --filter publish=443 \
                          --format '{{.Names}} ({{.Image}})' 2>/dev/null || true)"
  [ -n "$DOCKER_WEB" ] && warn "Ein Container hält Port 80/443: $(oneline "$DOCKER_WEB")"
  # Und der ruhende Fall: ein GESTOPPTER Webserver-Container mit
  # restart-Policy holt sich den Port beim nächsten Docker-Start zurück.
  # Für gestoppte Container liefert der publish-Filter nichts mehr, deshalb
  # hier über den Image-Namen. Rein heuristisch → nur Warnung + DORMANT.
  DOCKER_WEB_DORMANT="$(docker ps -a --filter status=exited --filter status=created \
                          --format '{{.Names}} ({{.Image}})' 2>/dev/null \
                        | grep -Ei '(^|[/:( ])(caddy|nginx|traefik|apache|httpd|haproxy)' || true)"
fi

# Hält einer UNSERER Container den Port? `docker ps -q` liefert kurze IDs,
# `compose ps -q` lange — die kurze ist Präfix der langen.
port_is_ours() {
  local port="$1" ids id
  [ "$DOCKER_OK" -eq 1 ] || return 1
  [ -n "$OUR_CONTAINER_IDS" ] || return 1
  ids="$(docker ps --filter "publish=$port" -q 2>/dev/null || true)"
  [ -n "$ids" ] || return 1
  while read -r id; do
    [ -n "$id" ] || continue
    if grep -q "^$id" <<<"$OUR_CONTAINER_IDS"; then return 0; fi
  done <<<"$ids"
  return 1
}

# ── Unsere eigenen Ports: 1337 (Strapi) und 8090 (Lead-Service) ──────────────
# Beide werden von docker-compose auf 127.0.0.1 gebunden. Hält sie jemand
# anderes, scheitert `docker compose up` mitten im Lauf („port is already
# allocated") — und zwar NACHDEM schon Pakete installiert und Configs
# geschrieben wurden. Deshalb hier, vorher, hart abbrechen.
for p in 1337 8090; do
  L="$(listeners_on "$p")"
  [ -n "$L" ] || continue
  if port_is_ours "$p"; then
    ok "Port $p gehört unserem eigenen Stack (Update-Lauf)"
    continue
  fi
  err "ABBRUCH: Port $p ist bereits belegt — und zwar NICHT von unserem Stack."
  cat >&2 <<EOF

  Auf Port $p lauscht: $(oneline "$L")

  Dieses Skript braucht 1337 (Strapi) und 8090 (Lead-Service) auf 127.0.0.1.
  Solange dort etwas anderes hängt, würde 'docker compose up' mittendrin
  abbrechen — mit halb ausgerolltem Server.

  Es wurde NICHTS verändert. Bitte den fremden Dienst verlegen oder beenden,
  danach dieses Skript erneut starten.
EOF
  exit 1
done

# ── Webserver-Entscheidung ───────────────────────────────────────────────────
case "$WEBSERVER" in
  nginx)
    # Reihenfolge der Prüfungen ist Absicht: der ABBRUCH-Fall zuerst.
    # Ein fremder Webserver zählt aus ZWEI unabhängigen Quellen:
    #   FOREIGN_NAMES  ein fremder Prozess lauscht laut ss/lsof auf 80/443
    #   DOCKER_WEB     ein Container veröffentlicht 80/443
    # Die zweite Quelle ist NICHT redundant: mit `userland-proxy: false` sieht
    # ss überhaupt keinen Host-Socket, obwohl der Port an einen Container
    # (z. B. Caddy vor Mattermost) geht. Würde hier nur ss zählen, käme das
    # Skript zu „Port frei" und installierte nginx neben einem produktiven
    # Dienst — genau der Fall, den dieser Block verhindern soll.
    if [ -n "$FOREIGN_NAMES" ] || [ -n "$DOCKER_WEB" ]; then
      err "ABBRUCH: Auf Port 80/443 läuft bereits ein ANDERER Webserver."
      cat >&2 <<EOF

  Gefunden:
      Port 80 : $LISTEN_80_TXT
      Port 443: $LISTEN_443_TXT
$(if [ -n "$DOCKER_WEB" ]; then
    printf '      Container auf 80/443: %s\n' "$(oneline "$DOCKER_WEB")"
    [ -n "$FOREIGN_NAMES" ] ||
      printf '      (Kein Host-Socket sichtbar — der Port geht per DNAT direkt in\n       den Container. Genau deshalb zählt hier auch der Docker-Befund.)'
  fi)
  Es wurde NICHTS verändert — kein Paket installiert, keine Konfiguration
  geschrieben, kein Dienst neu gestartet.

  Warum der Abbruch: im Modus --webserver=nginx installiert dieses Skript nginx,
  überschreibt /etc/nginx/sites-available/newedge.conf, entfernt den
  default-Site-Link und ruft certbot --nginx. Neben einem laufenden fremden
  Webserver ist das im besten Fall wirkungslos (nginx startet nicht, Port
  belegt) — im schlechtesten Fall geht ein produktiver Dienst offline.

  So geht es weiter — passenden Weg wählen:

    a) Es läuft Caddy und soll Caddy bleiben (Normalfall, z. B. neben einem
       produktiven Mattermost):

           sudo $0 $DOMAIN ${TLS_EMAIL:-<tls-mail>} --webserver=caddy

       Das baut Stack + Website, fasst aber weder nginx noch certbot an. Der
       fertige Site-Block liegt im Repo, das Einhängen bleibt bewusst manuell:
           $SCRIPT_DIR/Caddyfile.newedge      (Site-Block, 1:1 zu nginx.conf)
           $SCRIPT_DIR/CADDY-KOEXISTENZ.md    (Runbook Schritt für Schritt)

    b) Webserver komplett selbst verkabeln:

           sudo $0 $DOMAIN --webserver=none

    c) Wirklich auf nginx umstellen: den fremden Dienst bewusst und geplant
       stoppen (Konfiguration vorher sichern!), dann dieses Skript erneut.
       ACHTUNG: solange dort ein produktiver Dienst hängt, ist das ein Ausfall.
EOF
      exit 1

    elif [ -n "$WEB_LISTENERS" ]; then
      # Es lauscht jemand, aber kein Fremder → nur nginx. Genau der erwartete
      # Zustand beim Zweit-/Update-Lauf.
      ok "Port 80/443 werden von nginx gehalten — erwarteter Zustand"

    else
      # ── 80/443 sehen frei aus ────────────────────────────────────────────
      # „Frei" heißt nicht „harmlos": ein installierter, gerade gestoppter Caddy
      # (Wartung, Reboot-Reihenfolge, Fehlstart) holt sich den Port beim nächsten
      # Start zurück. Dann streiten sich zwei Dienste um 80 und es gewinnt der,
      # der zufällig zuerst dran ist. Deshalb auch den ruhenden Fall abfangen.
      DORMANT=""
      for svc in caddy apache2 httpd traefik lighttpd; do
        if command -v "$svc" >/dev/null 2>&1; then DORMANT="$DORMANT $svc"; continue; fi
        if systemctl is-enabled --quiet "$svc" 2>/dev/null; then DORMANT="$DORMANT $svc"; fi
      done
      # Gestoppter Webserver-Container mit restart-Policy: kommt beim nächsten
      # Docker-Start zurück und nimmt sich den Port.
      [ -n "$DOCKER_WEB_DORMANT" ] && DORMANT="$DORMANT container:$(oneline "$DOCKER_WEB_DORMANT" | tr ' ' '_')"
      # Docker installiert, Daemon aber nicht erreichbar: dann konnte die
      # zweite Quelle (DOCKER_WEB) gar nicht antworten. Auf einem angeblich
      # frischen Server ist das verdächtig genug, um nachzufragen — bei
      # laufendem Daemon hätte ein Webserver-Container den Abbruch oben ausgelöst.
      if [ "$DOCKER_OK" -eq 0 ] && command -v docker >/dev/null 2>&1; then
        DORMANT="$DORMANT docker-daemon-nicht-erreichbar"
      fi
      DORMANT="$(oneline "$DORMANT")"

      if [ -z "$DORMANT" ]; then
        ok "Port 80/443 frei — nginx kann eingerichtet werden"
      elif [ "${ALLOW_NGINX:-0}" = "1" ]; then
        warn "Anderer Webserver installiert ($DORMANT), aber ALLOW_NGINX=1 gesetzt."
        warn "Weiter auf eigene Verantwortung — beim nächsten Start streiten sich beide um Port 80."
      else
        err "ABBRUCH: 80/443 sind frei, aber es ist bereits ein anderer Webserver installiert."
        cat >&2 <<EOF

  Gefunden: $DORMANT (installiert bzw. als Dienst eingerichtet, lauscht aber
  gerade nicht auf 80/443 — vermutlich nur vorübergehend gestoppt).

  Es wurde NICHTS verändert.

  Würde jetzt nginx eingerichtet, hätten wir zwei Webserver, die denselben Port
  wollen: sobald der andere Dienst wieder startet, gewinnt der Zufall.

  Empfohlen — das Skript den Webserver gar nicht anfassen lassen:

      sudo $0 $DOMAIN ${TLS_EMAIL:-<tls-mail>} --webserver=caddy
      (Site-Block: $SCRIPT_DIR/Caddyfile.newedge,
       Runbook:    $SCRIPT_DIR/CADDY-KOEXISTENZ.md)

  Nur wenn Sie sicher sind, dass $DORMANT hier nichts bedient und auch nicht
  wieder starten wird:

      ALLOW_NGINX=1 sudo $0 $DOMAIN ${TLS_EMAIL:-<tls-mail>}
EOF
        exit 1
      fi
    fi
    ;;
  caddy)
    # Kein Abbruchgrund, egal was lauscht: in diesem Modus fasst das Skript
    # weder nginx noch certbot noch den laufenden Webserver an.
    if grep -qx "caddy" <<<"$WEB_LISTENERS"; then
      ok "Caddy hält Port 80/443 als Systemdienst — nginx und certbot werden übersprungen"
    elif [ -n "$DOCKER_WEB" ]; then
      # Caddy im Container ist ein anderer Fall: 127.0.0.1:1337/:8090 zeigen dort
      # auf den Container selbst, /var/www ist nicht gemountet. Der Site-Block
      # würde validieren und trotzdem 502 liefern. Kein Abbruch — Stack und
      # Website sollen ja gebaut werden —, aber die Warnung gehört hierhin.
      warn "Port 80/443 hält ein CONTAINER: $(oneline "$DOCKER_WEB")"
      warn "Fall C im Runbook — Site-Block NICHT einfach einhängen:"
      warn "  $SCRIPT_DIR/CADDY-KOEXISTENZ.md → Abschnitt 6"
    elif [ -z "$WEB_LISTENERS" ]; then
      warn "Modus caddy gewählt, aber auf 80/443 lauscht niemand — läuft Caddy überhaupt?"
    else
      warn "Modus caddy gewählt, auf 80/443 lauscht aber: $LISTEN_80_TXT / $LISTEN_443_TXT"
      warn "Das Skript fasst den Webserver trotzdem nicht an (so gewollt)."
    fi
    ;;
  none)
    if [ -n "$WEB_LISTENERS" ]; then
      ok "Modus none — Port 80: $LISTEN_80_TXT, Port 443: $LISTEN_443_TXT (bleibt unangetastet)"
    else
      ok "Modus none — Webserver wird nicht angefasst (80/443 sind frei)"
    fi
    ;;
esac

# Fremde nginx-Sites sind kein Abbruchgrund (nginx ist ja der erwartete Server),
# aber der Operator soll wissen, dass er hier nicht allein ist.
if [ "$WEBSERVER" = "nginx" ] && [ -d /etc/nginx/sites-enabled ]; then
  OTHER_SITES="$(find /etc/nginx/sites-enabled -mindepth 1 \
                   ! -name newedge.conf ! -name default -printf '%f ' 2>/dev/null || true)"
  [ -n "$OTHER_SITES" ] && warn "Weitere aktive nginx-Sites: $OTHER_SITES (bleiben unverändert)"
fi

# ── 1. Pakete ────────────────────────────────────────────────────────────────
# Ab HIER wird verändert.
say "Basis-Pakete prüfen"
export DEBIAN_FRONTEND=noninteractive

# Nur nachinstallieren, was tatsächlich fehlt. Auf einem Server mit fremden
# Diensten ist jedes überflüssige `apt-get install` ein Risiko: es kann Pakete
# mitziehen, Dienste neu starten und — im Fall von nginx — einen Konkurrenten
# um Port 80 hochfahren.
need_pkg() {
  local pkg="$1" cmd="${2:-}"
  if [ -n "$cmd" ] && command -v "$cmd" >/dev/null 2>&1; then return 1; fi
  if dpkg-query -W -f='${Status}' "$pkg" 2>/dev/null | grep -q 'ok installed'; then return 1; fi
  return 0
}

PKGS=()
if need_pkg git   git;      then PKGS+=(git); fi
if need_pkg rsync rsync;    then PKGS+=(rsync); fi
if need_pkg curl  curl;     then PKGS+=(curl); fi
if need_pkg ca-certificates; then PKGS+=(ca-certificates); fi
# nginx AUSSCHLIESSLICH im nginx-Modus. In den Modi caddy/none würde die
# Installation einen Dienst starten, der sofort mit dem laufenden Webserver um
# Port 80 streitet — genau das, was hier verhindert werden soll.
if [ "$WEBSERVER" = "nginx" ] && need_pkg nginx nginx; then PKGS+=(nginx); fi

if [ "${#PKGS[@]}" -gt 0 ]; then
  say "Fehlende Pakete installieren: ${PKGS[*]}"
  apt-get update -qq
  apt-get install -y -qq "${PKGS[@]}" >/dev/null
else
  ok "Basis-Pakete vollständig — kein apt-get nötig"
fi

if ! command -v docker >/dev/null 2>&1; then
  say "Docker installieren"
  curl -fsSL https://get.docker.com | sh >/dev/null
fi
ok "Docker $(docker --version | cut -d' ' -f3 | tr -d ',')"

if ! command -v node >/dev/null 2>&1 || [ "$(node -e 'console.log(process.versions.node.split(".")[0])')" -lt 20 ]; then
  say "Node 22 installieren (NodeSource)"
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash - >/dev/null
  apt-get install -y -qq nodejs >/dev/null
fi
ok "Node $(node -v)"

# ── 2. CMS-Secrets (.env) — nur beim ersten Lauf ─────────────────────────────
cd "$CMS_DIR"
if [ ! -f .env ]; then
  say "Secrets generieren → .env"
  gen() { openssl rand -base64 32 | tr -d '\n'; }
  # umask VOR dem Schreiben: `cat > .env` legt die Datei sonst zuerst mit 0644 an
  # und erst danach greift chmod — auf einem Server mit mehreren Logins ein
  # offenes Fenster auf sämtliche Strapi-Secrets und das DB-Passwort.
  # Subshell, damit die umask nicht im restlichen Skript weiterwirkt (sonst
  # entstünde /var/www/... mit 0700 und nginx könnte die Website nicht lesen).
  ( umask 077
    cat > .env <<EOF
HOST=0.0.0.0
PORT=1337
APP_KEYS="$(gen),$(gen),$(gen),$(gen)"
API_TOKEN_SALT=$(gen)
ADMIN_JWT_SECRET=$(gen)
TRANSFER_TOKEN_SALT=$(gen)
JWT_SECRET=$(gen)
ENCRYPTION_KEY=$(gen)
PUBLIC_URL=https://$DOMAIN
IS_PROXIED=true
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=$(gen)
CORS_ORIGINS=https://$DOMAIN,https://www.$DOMAIN
EOF
  )
  chmod 600 .env
  ok ".env erzeugt (Secrets frisch generiert, chmod 600)"
else
  ok ".env existiert — wird nicht überschrieben"
fi

# ── 2b. Lead-Service-Env (.env) — nur beim ersten Lauf ───────────────────────
# Kontaktformular + ROI-Report. Die Vorlage wird 1:1 übernommen, nur drei Werte
# setzt das Skript passend zur Domain bzw. sicherheitshalber:
#   ALLOWED_ORIGINS         → diese Domain (Vorlage kennt sie nicht)
#   SEND_DISABLED=1         → Testmodus, bis SMTP-Zugangsdaten eingetragen sind.
#                             Sonst quittiert jedes Formular mit 502 „mail_failed",
#                             weil in der Vorlage nur ein SMTP_PASS-Platzhalter steht.
#                             Im Testmodus werden Leads normal gespeichert.
#   FOLLOWUP_UNSUBSCRIBE_BASE → diese Domain. nginx proxied /abmelden/<token>
#                             seit der Stack-Zusammenlegung mit an den Lead-Service
#                             (eigener location-Block in nginx.conf), der Abmeldelink
#                             funktioniert also auf der Hauptdomain. Wichtig: dieser
#                             Pfad steht in versendeten Mails und darf sich später
#                             nicht mehr ändern.
LEAD_ENV_NEW=0
if [ ! -f "$LEAD_DIR/.env" ]; then
  say "Lead-Service-Env anlegen → apps/lead-api/.env (aus .env.example)"
  # umask + sofortiges chmod, danach erst sed: die Datei bekommt gleich das
  # SMTP-Passwort, sie darf nie auch nur kurz 0644 sein. (GNU sed -i übernimmt
  # die Rechte der Originaldatei, das chmod hält also.)
  ( umask 077
    {
      echo "# Erzeugt von deploy/setup.sh für $DOMAIN."
      echo "# SMTP_PASS eintragen und SEND_DISABLED=0 setzen, sonst geht keine Mail raus."
      echo
      cat "$LEAD_DIR/.env.example"
    } > "$LEAD_DIR/.env"
  )
  chmod 600 "$LEAD_DIR/.env"
  sed -i \
    -e "s|^ALLOWED_ORIGINS=.*|ALLOWED_ORIGINS=https://$DOMAIN,https://www.$DOMAIN|" \
    -e "s|^SEND_DISABLED=.*|SEND_DISABLED=1|" \
    -e "s|^FOLLOWUP_UNSUBSCRIBE_BASE=.*|FOLLOWUP_UNSUBSCRIBE_BASE=https://$DOMAIN|" \
    "$LEAD_DIR/.env"
  chmod 600 "$LEAD_DIR/.env"
  LEAD_ENV_NEW=1
  ok "apps/lead-api/.env erzeugt (chmod 600) — SMTP-Zugangsdaten fehlen noch"
else
  ok "apps/lead-api/.env existiert — wird nicht überschrieben"
fi
# Ablage für Leads, PDFs und Follow-up-Warteschlange (Bind-Mount des Containers).
# 0700: hier liegen Name, E-Mail und Firma echter Interessenten. Ohne chmod wäre
# der Ordner 0755 und jeder Shell-Login auf dem Server könnte mitlesen. Der
# Container läuft als root und kommt trotzdem rein.
mkdir -p "$LEAD_DIR/data"
chmod 700 "$LEAD_DIR/data"

# ── Seed-Steuerung: einmalig statt dauerhaft ─────────────────────────────────
# WARUM DIESER AUFWAND:
# docker compose löst ${SEED:-0} beim ANLEGEN des Containers auf und friert den
# Wert in dessen Konfiguration ein. Ein mit SEED=1 erzeugter strapi-Container
# seedet deshalb bei JEDEM weiteren Start erneut — und `restart: unless-stopped`
# startet ihn nach Reboot, Docker-Neustart oder Absturz von ganz allein. Zwei
# Wochen redaktionelle Arbeit wären nach einem Kernel-Update weg, ohne dass
# jemand einen Befehl abgesetzt hätte und ohne Spur, wo man suchen müsste.
#
# GEWÄHLTES VERFAHREN — drei Sperren, jede allein schon wirksam:
#   1. Der Seed-Lauf läuft mit einer Ad-hoc-Override-Datei, die neben SEED=1
#      auch `restart: "no"` setzt. Der seedende Container kann sich damit NIE
#      selbst wiederbeleben. Bricht der Lauf mittendrin ab (OOM, Stromausfall,
#      Strg-C), ist der schlimmste Ausgang ein stehender Container — niemals
#      ein unbemerkter zweiter Seed nach dem nächsten Neustart.
#   2. Unmittelbar nach dem Seed wird strapi aus der BASIS-Datei ohne SEED neu
#      erzeugt (--force-recreate) und läuft wieder mit unless-stopped.
#   3. Danach wird per `docker inspect` KONTROLLIERT, dass SEED=1 wirklich aus
#      der Container-Konfiguration verschwunden ist. Ist es das nicht, bricht
#      das Skript ab, statt eine Datenverlust-Falle stehen zu lassen.
# Schritt 3 läuft bei JEDEM Lauf — also auch auf einem Server, den eine frühere
# Fassung dieses Skripts bereits mit SEED=1 eingefroren hinterlassen hat.
#
# BEWUSST NICHT GEWÄHLT:
#   • Markierung im Volume statt Umgebungsvariable. Wäre die sauberste Lösung,
#     verlangt aber eine Änderung an apps/cms/src/index.ts — das ist Anwendungs-
#     code, nicht Deploy, und wird hier nicht angefasst.
#   • `docker compose run --rm` als Einmal-Lauf. Strapi beendet sich nach dem
#     Bootstrap nicht, der Einmal-Container bliebe also hängen; und wie `run`
#     mit Restart-Policies umgeht, ist nicht so eindeutig dokumentiert, dass man
#     eine Datenverlust-Sperre darauf bauen sollte.
#   • Nur „hinterher zurücksetzen" ohne Sperre 1. Dann bliebe genau das Fenster
#     offen, in dem ein Absturz den Container mit SEED=1 zurücklässt.
SEED_OVERRIDE=""
seed_override_weg() {
  [ -n "$SEED_OVERRIDE" ] || return 0
  rm -f "$SEED_OVERRIDE"
  SEED_OVERRIDE=""
}
trap seed_override_weg EXIT

seed_override_anlegen() {
  SEED_OVERRIDE="$(mktemp)"
  cat > "$SEED_OVERRIDE" <<'YML'
# Ad-hoc-Override, gilt nur für diesen einen Seed-Lauf und wird danach gelöscht.
#   SEED=1        schaltet den Seeder in src/index.ts scharf
#   restart: "no" nimmt dem Container die Fähigkeit, von selbst wiederzukommen
services:
  strapi:
    restart: "no"
    environment:
      SEED: "1"
YML
}

# Steht SEED=1 in der eingefrorenen Konfiguration eines strapi-Containers?
# Auch gestoppte Container zählen (-a): genau die holt die Restart-Policy zurück.
strapi_seed_eingefroren() {
  local ids cid umgebung
  ids="$( (cd "$CMS_DIR" && docker compose ps -a -q strapi) 2>/dev/null || true )"
  [ -n "$ids" ] || return 1
  while read -r cid; do
    [ -n "$cid" ] || continue
    # Erst einsammeln, dann prüfen: `docker inspect | grep -q` würde den
    # Erzeuger per SIGPIPE abwürgen und unter `set -o pipefail` einen
    # Fehlalarm (bzw. hier ein falsches „ist sauber") auslösen.
    umgebung="$(docker inspect --format '{{range .Config.Env}}{{println .}}{{end}}' "$cid" 2>/dev/null || true)"
    grep -qx 'SEED=1' <<<"$umgebung" && return 0
  done <<<"$ids"
  return 1
}

# Wartet auf den Strapi-Healthcheck. Strapi lauscht erst NACH dem bootstrap() —
# antwortet /_health, ist ein laufender Seed also bereits durch.
warte_auf_strapi() {
  local versuche="${1:-60}" i
  say "Warte auf Strapi-Healthcheck …"
  for i in $(seq 1 "$versuche"); do
    if curl -sf -o /dev/null http://127.0.0.1:1337/_health; then ok "Strapi läuft"; return 0; fi
    sleep 5
  done
  err "Strapi ist nach $((versuche * 5)) Sekunden nicht healthy geworden."
  cat >&2 <<EOF

  Häufigste Ursache auf einem geteilten Server: zu wenig Arbeitsspeicher. Der
  Strapi-Admin-Build braucht ~2 GB; laufen daneben schon andere Dienste (hier:
  Mattermost), killt der OOM-Killer den Build oder den Node-Prozess. Prüfen:

      free -m
      dmesg | tail -30 | grep -i -e oom -e 'killed process'
      cd $CMS_DIR && docker compose logs --tail=80 strapi

  Abhilfe — 2 GB Swap, übersteht den Reboot:

      fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile
      swapon /swapfile && echo '/swapfile none swap sw 0 0' >> /etc/fstab

  Danach dieses Skript ERNEUT aufrufen, das ist gefahrlos: vorhandene .env-
  Dateien und Secrets bleiben unangetastet.
  ACHTUNG: Das Datenbank-Volume existiert nach diesem Lauf bereits — der zweite
  Lauf gilt damit als Wiederholungslauf und seedet NICHT mehr. Kam der Abbruch
  vor der Meldung „Content-Seed abgeschlossen", fehlen die öffentlichen
  Leserechte und /api antwortet mit 403. Dann den Seed gezielt nachholen:

      sudo $SCRIPT_DIR/update.sh reseed
EOF
  exit 1
}

# Nimmt den eingefrorenen Seed-Schalter wieder aus der Container-Konfiguration.
seed_entschaerfen() {
  seed_override_weg
  strapi_seed_eingefroren || return 0
  say "Seed-Schalter zurücknehmen — strapi ohne SEED neu erzeugen"
  ( cd "$CMS_DIR" && docker compose up -d --no-deps --force-recreate strapi )
  warte_auf_strapi 60
  if strapi_seed_eingefroren; then
    err "ABBRUCH: In der Konfiguration des strapi-Containers steht weiterhin SEED=1."
    cat >&2 <<EOF

  So darf der Server nicht stehen bleiben: bei jedem Neustart (Reboot, Docker-
  Neustart, Absturz) liefe der Seed erneut und überschriebe den Redaktionsstand
  mit dem Code-Stand — ohne dass jemand etwas getan hätte.

  Stack und Website laufen; es fehlt nur diese eine Sicherung. Von Hand
  nachziehen und das Ergebnis kontrollieren:

      cd $CMS_DIR
      SEED=0 docker compose up -d --no-deps --force-recreate strapi
      docker inspect --format '{{range .Config.Env}}{{println .}}{{end}}' \\
        \$(docker compose ps -q strapi) | grep '^SEED='      → muss SEED=0 zeigen

  Danach dieses Skript erneut aufrufen.
EOF
    exit 1
  fi
  ok "SEED steht wieder auf 0 — ein Neustart des Servers seedet NICHT erneut"
}

# ── 3. Stack starten: Postgres + Strapi + Lead-Service (Erststart mit Seed) ──
# Alle Dienste hängen in EINEM Compose-Projekt (apps/cms/docker-compose.yml):
# postgres, strapi und lead-api. `docker compose up` startet sie deshalb gemeinsam.
# Volume-Präfix = Compose-Projektname = Ordnername von apps/cms ("cms") —
# genauso rechnet backup.sh. ACHTUNG bei Migration von der alten Einzel-Codebasis:
# deren Volumes hießen nach dem alten Ordner; unter dem neuen Namen startet der
# Stack mit LEEREM Datenstand (Seed). Alte Daten vorher per backup.sh sichern
# und einspielen.
FIRST_RUN=0
docker volume inspect "$(basename "$CMS_DIR")_pgdata" >/dev/null 2>&1 || FIRST_RUN=1
if [ "$FIRST_RUN" -eq 1 ]; then
  say "Erststart: Build + Content-Seed (dauert einige Minuten)"
  # NICHT `SEED=1 docker compose up`: compose löst ${SEED:-0} beim ANLEGEN des
  # Containers auf und friert den Wert dauerhaft ein — der Container seedete dann
  # bei jedem Neustart erneut und überschriebe den Redaktionsstand. Stattdessen
  # eine Ad-hoc-Override-Datei, die nur für diesen einen Lauf gilt.
  seed_override_anlegen
  docker compose -f docker-compose.yml -f "$SEED_OVERRIDE" up -d --build
else
  say "Stack aktualisieren (ohne Seed — redaktionelle Inhalte bleiben)"
  docker compose up -d --build
fi

warte_auf_strapi 60

# Seed-Schalter wieder aus der Container-Konfiguration nehmen. Selbst prüfend und
# idempotent: steckt nichts fest, kehrt die Funktion sofort zurück.
seed_entschaerfen

if [ "$FIRST_RUN" -eq 1 ]; then
  # Logs erst einsammeln, dann prüfen: `… | grep -q` würde den Erzeuger per
  # SIGPIPE abwürgen und unter `set -o pipefail` einen Fehlalarm auslösen.
  SEED_LOG="$(docker compose logs strapi 2>/dev/null || true)"
  if grep -q "\[seed\] DONE" <<<"$SEED_LOG"; then
    ok "Content-Seed abgeschlossen"
  else
    warn "Seed-Marker nicht gefunden — bitte Logs prüfen (docker compose logs strapi | grep seed)"
  fi
fi

# Lead-Service: nur prüfen, wenn der Compose-Service auch existiert — so bleibt
# das Skript benutzbar, falls jemand mit einem älteren docker-compose.yml arbeitet.
LEAD_UP=0
COMPOSE_SERVICES="$(docker compose config --services 2>/dev/null || true)"
if grep -qx "lead-api" <<<"$COMPOSE_SERVICES"; then
  say "Warte auf Lead-Service-Healthcheck …"
  for i in $(seq 1 24); do
    if curl -sf -o /dev/null http://127.0.0.1:8090/health; then
      LEAD_UP=1; ok "Lead-Service läuft (Kontaktformular + ROI-Report)"; break
    fi
    sleep 5
  done
  # Kein Abbruch: die Website funktioniert auch ohne den Service, nur die
  # Formulare nicht. Lieber fertig ausrollen und hier deutlich warnen.
  [ "$LEAD_UP" -eq 1 ] || warn "Lead-Service nicht erreichbar — Logs: docker compose logs lead-api"
else
  warn "Compose-Service 'lead-api' fehlt in apps/cms/docker-compose.yml — Formulare bleiben tot."
fi

# ── 4. Website bauen & ausrollen ─────────────────────────────────────────────
# Gebaut wird apps/website aus DIESEM Checkout — kein zweiter Klon.

# .env.production nur anlegen, wenn sie fehlt. Eine vorhandene Datei bleibt
# unangetastet — sie kann händisch angepasst worden sein.
if [ ! -f "$WEB_DIR/.env.production" ]; then
  say "Website-Produktions-Env anlegen → apps/website/.env.production"
  # Erst in eine Temp-Datei, dann umbenennen. `sed … > .env.production` würde die
  # Zieldatei ANLEGEN, bevor sed überhaupt läuft — schlägt sed fehl (Vorlage weg,
  # Platte voll), bliebe eine LEERE .env.production zurück. Der Zweig darüber
  # würde sie beim nächsten Lauf als „existiert schon" durchwinken.
  if ! sed -e "s|^VITE_STRAPI_URL=.*|VITE_STRAPI_URL=https://$DOMAIN|" \
           -e "s|^VITE_API_URL=.*|VITE_API_URL=https://$DOMAIN|" \
           "$WEB_DIR/.env.production.example" > "$WEB_DIR/.env.production.tmp"; then
    rm -f "$WEB_DIR/.env.production.tmp"
    echo "Konnte .env.production nicht erzeugen — fehlt apps/website/.env.production.example?"
    exit 1
  fi
  mv -f "$WEB_DIR/.env.production.tmp" "$WEB_DIR/.env.production"
  ok ".env.production erzeugt (Domain eingesetzt)"
else
  ok ".env.production existiert — wird nicht überschrieben"
fi

say "Website bauen (npm ci + vite build)"
# Die beiden URLs werden dem Build zusätzlich inline mitgegeben: Vite priorisiert
# VITE_*-Variablen aus der Umgebung über .env/.env.production. Damit passt der
# Build auch dann zur übergebenen Domain, wenn eine ältere .env.production
# herumliegt — sonst zeigen Formulare und CMS-Abfragen ins Leere.
#   VITE_STRAPI_URL → Same-Origin, nginx proxied /api, /uploads, /admin an Strapi
#   VITE_API_URL    → Lead-Service, nginx proxied /contact und /roi-report
(
  cd "$WEB_DIR"
  npm ci --silent
  VITE_STRAPI_URL="https://$DOMAIN" \
  VITE_API_URL="https://$DOMAIN" \
  npm run build >/dev/null
)

# Guards vor dem rsync --delete: nur ein echtes Build-Ergebnis darf ausgerollt
# werden, und das Ziel muss der erwartete /var/www-Pfad sein.
[ -f "$WEB_DIR/dist/index.html" ] || { warn "Build ohne dist/index.html — nichts ausgerollt."; exit 1; }
case "$WEB_ROOT" in
  /var/www/?*) ;;
  *) warn "WEB_ROOT unerwartet ($WEB_ROOT) — Abbruch vor rsync --delete."; exit 1 ;;
esac
mkdir -p "$WEB_ROOT/dist"
rsync -a --delete "$WEB_DIR/dist/" "$WEB_ROOT/dist/"
ok "Website ausgerollt → $WEB_ROOT/dist"

# ── 5. Webserver ────────────────────────────────────────────────────────────
# NUR im Modus nginx wird hier überhaupt etwas angefasst. In den Modi caddy und
# none endet das Skript mit einer Anleitung statt mit einem Eingriff: auf einem
# Server, auf dem ein fremder Webserver produktiv läuft, ist Nichtstun die
# einzige sichere Option. Die Prüfung ganz oben hat bereits sichergestellt, dass
# wir hier im nginx-Modus nur landen, wenn 80/443 frei sind oder nginx gehören.
if [ "$WEBSERVER" = "nginx" ]; then

  say "nginx konfigurieren"
  NGINX_SITE=/etc/nginx/sites-available/newedge.conf

  # WICHTIG für den zweiten Lauf: certbot --nginx schreibt seine TLS-Direktiven
  # (listen 443 ssl, ssl_certificate, HTTP→HTTPS-Redirect) DIREKT in genau diese
  # Datei. Sie stumpf zu überschreiben hieße: nach jedem Update-Lauf ist HTTPS weg
  # — und wenn dabei keine TLS-E-Mail übergeben wurde, bleibt es weg. Deshalb
  # merken, ob TLS drin war, Backup ziehen und unten wieder einhängen.
  TLS_WAS_ACTIVE=0
  NGINX_BACKUP=""
  if [ -f "$NGINX_SITE" ] && grep -q "ssl_certificate" "$NGINX_SITE"; then
    TLS_WAS_ACTIVE=1
    NGINX_BACKUP="$NGINX_SITE.bak-$(date +%Y%m%d-%H%M%S)"
    cp -a "$NGINX_SITE" "$NGINX_BACKUP"
    warn "Bestehende TLS-Config gesichert → $NGINX_BACKUP"
  fi

  sed -e "s/newedgebrand\.com/$DOMAIN/g" \
      -e "s|/var/www/newedgebrand/dist|$WEB_ROOT/dist|g" \
      "$SCRIPT_DIR/nginx.conf" > "$NGINX_SITE"
  ln -sf "$NGINX_SITE" /etc/nginx/sites-enabled/newedge.conf
  rm -f /etc/nginx/sites-enabled/default
  nginx -t
  # reload scheitert, wenn nginx (noch) gar nicht läuft — etwa weil das Paket
  # eben erst installiert oder der Dienst von Hand gestoppt wurde. Dann starten.
  systemctl reload nginx || systemctl restart nginx
  ok "nginx aktiv (HTTP)"

  # ── 6. TLS (optional, wenn E-Mail übergeben) ──────────────────────────────
  if [ -n "$TLS_EMAIL" ]; then
    say "TLS via certbot"
    # certbot ebenfalls nur nachinstallieren, wenn er fehlt.
    if need_pkg certbot certbot || need_pkg python3-certbot-nginx; then
      apt-get install -y -qq certbot python3-certbot-nginx >/dev/null
    fi
    # --keep-until-expiring: ohne das bricht certbot beim ZWEITEN Lauf ab, weil
    #   das Zertifikat noch gültig ist und es im --non-interactive-Modus nicht
    #   nachfragen darf.
    # Kein `&& ok …` mehr: unter `set -e` hätte ein certbot-Fehler das Skript hier
    #   beendet — die offenen SMTP-Handgriffe am Ende wären nie ausgegeben worden.
    if certbot --nginx --non-interactive --agree-tos --keep-until-expiring \
         -m "$TLS_EMAIL" -d "$DOMAIN" -d "www.$DOMAIN" --redirect; then
      ok "HTTPS aktiv (Auto-Renewal via systemd-Timer)"
    else
      warn "certbot fehlgeschlagen — die Seite läuft GERADE NUR ÜBER HTTP."
      echo "    Manuell nachziehen: certbot --nginx -d $DOMAIN -d www.$DOMAIN --redirect"
      [ -n "$NGINX_BACKUP" ] && echo "    Vorherige (funktionierende) Config: $NGINX_BACKUP"
    fi
  elif [ "$TLS_WAS_ACTIVE" -eq 1 ]; then
    # Re-Run ohne TLS-E-Mail: HTTPS lief vorher, unsere frisch geschriebene Config
    # kann es aber noch nicht. `certbot install` hängt das VORHANDENE Zertifikat
    # wieder ein — kein ACME-Call, keine E-Mail, kein Rate-Limit-Risiko.
    say "TLS wieder einhängen (Zertifikat ist schon da)"
    if command -v certbot >/dev/null 2>&1 &&
       certbot install --nginx --non-interactive --cert-name "$DOMAIN" --redirect; then
      ok "HTTPS wiederhergestellt"
    else
      warn "TLS konnte NICHT wieder eingehängt werden — HTTPS ist JETZT AUS!"
      echo "    Sofort: certbot --nginx -d $DOMAIN -d www.$DOMAIN --redirect"
      [ -n "$NGINX_BACKUP" ] && echo "    Notfall-Rückfall: cp $NGINX_BACKUP $NGINX_SITE && nginx -t && systemctl reload nginx"
    fi
  else
    warn "Kein TLS-E-Mail übergeben — HTTPS später aktivieren mit:"
    echo "    certbot --nginx -d $DOMAIN -d www.$DOMAIN"
  fi

elif [ "$WEBSERVER" = "caddy" ]; then

  # Hier wird bewusst NICHTS am System geändert: kein nginx, kein certbot, kein
  # systemctl. Caddy holt sein Zertifikat selbst (ACME ist eingebaut) — ein
  # certbot-Lauf daneben wäre im besten Fall überflüssig, im schlechtesten ein
  # Rate-Limit-Verbrauch auf einer Domain, die schon ein Zertifikat hat.
  say "Modus caddy — nginx und certbot werden übersprungen"
  ok "Website ausgerollt nach $WEB_ROOT/dist"
  # Der fertige Site-Block steht NICHT hier im Skript, sondern in
  # deploy/Caddyfile.newedge. Zwei Kopien derselben Routing-Regeln in einem Repo
  # driften auseinander — und die Kopie, die niemand liest, gewinnt am Ende auf
  # dem Server. Deshalb nur die Handgriffe, die Datei bleibt die einzige Quelle.
  # Hier stand früher eine Copy-&-Paste-Anleitung für den Einbau von Hand. Sie ist
  # ersatzlos entfallen, seit es caddy-einbinden.sh gibt — und zwar nicht, weil sie
  # überflüssig war, sondern weil sie GEFÄHRLICH war: zwei ihrer Befehle waren
  # nachweislich falsch (ein 'tee -a' ohne führenden Zeilenumbruch, und ein
  # grep-Muster, das auch ein EINGERÜCKTES 'import' akzeptiert — das steht dann im
  # Site-Block des fremden Dienstes). Eine Anleitung, die zum Tippen einlädt,
  # gewinnt gegen ein Skript, das dieselbe Arbeit geprüft erledigt.
  cat <<EOF

  Es fehlt noch der Webserver-Teil. Dafür gibt es ein eigenes Skript, das den
  Site-Block neben den bestehenden, produktiven Dienst hängt:

      sudo $SCRIPT_DIR/caddy-einbinden.sh $DOMAIN --dry-run   # prüft nur
      sudo $SCRIPT_DIR/caddy-einbinden.sh $DOMAIN             # baut ein

  Es sichert vorher, prüft, ob Caddys LAUFENDE Konfiguration überhaupt aus
  /etc/caddy/Caddyfile stammt, lädt erst nach bestandener Prüfung neu — und rollt
  automatisch zurück, wenn der fremde Dienst danach nicht mehr antwortet.

  Bau den Block NICHT von Hand ein. Hintergrund und Notfallwege:
  $SCRIPT_DIR/CADDY-KOEXISTENZ.md

  Leserechte setzt das Skript mit; falls du sie vorab prüfen willst:
      sudo -u caddy test -r $WEB_ROOT/dist/index.html && echo "caddy kann lesen"
EOF

else

  say "Modus none — Webserver wurde nicht angefasst"
  cat <<EOF

  Stack und Website sind fertig, aber von außen erreichbar ist noch nichts.
  Der Reverse-Proxy muss selbst verkabelt werden:

      Statische Dateien : $WEB_ROOT/dist   (SPA-Fallback auf /index.html)
      Strapi            : 127.0.0.1:1337
                          /api /uploads /upload /admin /content-manager
                          /content-type-builder /users-permissions /i18n /_health
      Lead-Service      : 127.0.0.1:8090
                          /contact /roi-report /abmelden/<token>
                          /health NICHT nach außen geben (Betriebsinterna)

  Vorlagen: $SCRIPT_DIR/nginx.conf  ·  $SCRIPT_DIR/Caddyfile.newedge
EOF

fi

# ── Fertig ───────────────────────────────────────────────────────────────────
echo
RERUN_HINT=""
if [ "$WEBSERVER" = "nginx" ]; then
  ok "SETUP KOMPLETT"
else
  # Ehrlich bleiben: ohne Webserver-Teil ist der Server noch nicht erreichbar.
  ok "SETUP KOMPLETT — bis auf den Webserver (Modus: $WEBSERVER, siehe oben)"
  # Der Schalter ist nicht persistent. Wer ihn beim nächsten Lauf vergisst,
  # landet im Default nginx — und damit im Abbruch der Vorab-Prüfung.
  RERUN_HINT="
                WICHTIG: --webserver=$WEBSERVER wieder mitgeben, sonst greift der
                Default nginx (und bricht auf diesem Server ab)."
fi
cat <<EOF

  Website:      https://$DOMAIN
  CMS-Admin:    https://$DOMAIN/admin   ← beim ersten Aufruf Admin-Benutzer anlegen!
  Health CMS:   curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:1337/_health  (→ 204)
  Health Leads: curl -s http://127.0.0.1:8090/health

  Updates:      git pull im Monorepo, danach dieses Skript erneut
                (oder sudo ./apps/cms/deploy/update.sh website | cms | all)$RERUN_HINT
  Backups:      sudo ./apps/cms/deploy/backup.sh   (Cron-Zeile am Ende der Ausgabe)
EOF

# Offene Handgriffe, die das Skript nicht erledigen kann — bewusst zum Schluss,
# damit sie nicht zwischen den Build-Logs untergehen.
#
# Gemeldet wird der TATSÄCHLICHE Stand der Datei, nicht nur „gerade neu angelegt".
# Sonst verschwindet die Warnung ab dem zweiten Lauf, und ein Server kann
# monatelang im Testmodus stehen: die Formulare antworten mit HTTP 200, die Leads
# landen in leads.jsonl — aber weder Interessent noch Team bekommen je eine Mail.
LEAD_TESTMODE=0
if [ -f "$LEAD_DIR/.env" ]; then
  grep -qE '^[[:space:]]*SEND_DISABLED=1'   "$LEAD_DIR/.env" && LEAD_TESTMODE=1
  grep -qE '^[[:space:]]*SMTP_PASS=xxxx'    "$LEAD_DIR/.env" && LEAD_TESTMODE=1
  grep -qE '^[[:space:]]*SMTP_PASS=[[:space:]]*$' "$LEAD_DIR/.env" && LEAD_TESTMODE=1
fi

if [ "$LEAD_TESTMODE" -eq 1 ]; then
  echo
  warn "Lead-Service läuft im TESTMODUS — Formulare antworten OK, es geht keine Mail raus."
  [ "$LEAD_ENV_NEW" -eq 0 ] && warn "(Das steht schon seit einem früheren Lauf so in apps/lead-api/.env.)"
  cat <<EOF

  1) SMTP-Zugangsdaten eintragen:  \$EDITOR $LEAD_DIR/.env
     SMTP_PASS=<App-Passwort>  ·  SEND_DISABLED=0
  2) Optional: Leads zusätzlich im CMS sichtbar machen — API-Token im Strapi-Admin
     anlegen (Rechte: nur Lead → create) und STRAPI_URL/STRAPI_TOKEN in derselben
     Datei setzen.
  3) Übernehmen:  cd $CMS_DIR && docker compose up -d lead-api
EOF
fi
