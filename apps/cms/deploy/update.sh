#!/usr/bin/env bash
# ============================================================================
# NEWEDGE — Update-Skript
#   sudo ./apps/cms/deploy/update.sh website   → Website: build + ausrollen
#   sudo ./apps/cms/deploy/update.sh cms       → CMS: Image neu bauen, neu starten
#   sudo ./apps/cms/deploy/update.sh lead      → Lead-Service allein neu bauen/starten
#   sudo ./apps/cms/deploy/update.sh all       → alle drei
#   sudo ./apps/cms/deploy/update.sh reseed    → CMS-Content aus Code neu einspielen
#                                                (ÜBERSCHREIBT redaktionelle Änderungen!)
#
# Monorepo wie setup.sh: alle Pfade leiten sich aus dem Skript-Ort ab, es gibt
# KEINEN zweiten Website-Klon mehr.
#
# CMS und Lead-Service liegen in EINEM Compose-Projekt (apps/cms/docker-compose.yml).
# `cms` und `lead` sprechen deshalb denselben Stack an, nur unterschiedliche
# Services — der jeweils andere läuft dabei ungestört weiter.
# ============================================================================
set -euo pipefail

MODE="${1:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"  # apps/cms/deploy
CMS_DIR="$(dirname "$SCRIPT_DIR")"                          # apps/cms
APPS_DIR="$(dirname "$CMS_DIR")"                            # apps/
WEB_DIR="$APPS_DIR/website"                                 # Vite-Quellen im SELBEN Klon
WEB_ROOT="/var/www/newedgebrand"

say()  { printf '\033[1;35m▸ %s\033[0m\n' "$*"; }
ok()   { printf '\033[1;32m✔ %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m⚠ %s\033[0m\n' "$*"; }

# EIN Klon, also EIN pull — und genau einmal pro Lauf. Vorher zog jede der drei
# Funktionen einzeln, im `all`-Modus also dreimal dasselbe Repo. Ein `git pull`
# tauscht dabei auch dieses Skript aus, während bash noch daraus liest; je
# seltener das passiert, desto besser.
PULLED=0
pull_repo() {
  [ "$PULLED" -eq 1 ] && return 0
  say "Monorepo aktualisieren (git pull)"
  git -C "$CMS_DIR" pull -q
  PULLED=1
}

update_website() {
  pull_repo
  # OHNE .env.production baut Vite mit leerem VITE_API_URL — die Formulare gehen
  # dann live in den Testmodus: der Besucher sieht „gesendet", es passiert nichts,
  # und niemand bekommt eine Fehlermeldung. Lieber hier laut abbrechen.
  [ -f "$WEB_DIR/.env.production" ] || {
    warn "apps/website/.env.production fehlt — der Build hätte TOTE Formulare (Testmodus)."
    warn "Anlegen: cp apps/website/.env.production.example apps/website/.env.production"
    warn "         und VITE_STRAPI_URL / VITE_API_URL auf die Domain setzen."
    return 1
  }
  say "Website: build + ausrollen"
  ( cd "$WEB_DIR" && npm ci --silent && npm run build >/dev/null )
  [ -f "$WEB_DIR/dist/index.html" ] || { warn "Build ohne dist/index.html — nichts ausgerollt."; return 1; }
  rsync -a --delete "$WEB_DIR/dist/" "$WEB_ROOT/dist/"
  ok "Website aktualisiert"
}

update_cms() {
  pull_repo
  say "CMS: rebuild (ohne Seed — Inhalte bleiben)"
  # Nur die CMS-Services anfassen: der Lead-Service soll durch ein CMS-Update
  # nicht neu starten (laufende PDF-Erzeugung, Follow-up-Worker).
  ( cd "$CMS_DIR" && docker compose up -d --build postgres strapi )
  ok "CMS aktualisiert"
}

update_lead() {
  pull_repo
  say "Lead-Service: rebuild (Formulare kurz offline, ~Sekunden)"
  ( cd "$CMS_DIR" && docker compose up -d --build lead-api )
  # Health kurz prüfen — die Formulare sind die einzige Lead-Quelle der Website.
  for i in $(seq 1 12); do
    curl -sf -o /dev/null http://127.0.0.1:8090/health && { ok "Lead-Service aktualisiert und erreichbar"; return 0; }
    sleep 5
  done
  warn "Lead-Service antwortet nicht — Logs: cd $CMS_DIR && docker compose logs lead-api"
  return 1
}

reseed_cms() {
  echo "⚠  RESEED überschreibt ALLE redaktionellen CMS-Änderungen mit dem Code-Stand."
  read -r -p "   Fortfahren? Tippe 'RESEED': " CONFIRM
  [ "$CONFIRM" = "RESEED" ] || { echo "Abgebrochen."; exit 1; }
  say "Backup vor Reseed"
  "$SCRIPT_DIR/backup.sh"
  pull_repo
  say "Reseed"
  # NICHT `SEED=1 docker compose up`: compose friert den Wert beim Anlegen in der
  # Container-Konfiguration ein. Mit `restart: unless-stopped` seedete der
  # Container dann bei JEDEM Neustart erneut und überschriebe genau den
  # Redaktionsstand, den dieses Skript einmalig ersetzen sollte. Deshalb eine
  # Override-Datei nur für diesen Lauf — und danach zurück auf die Basis.
  local override
  override="$(mktemp)"
  # shellcheck disable=SC2064  # $override soll JETZT ausgewertet werden, nicht später
  trap "rm -f '$override'" RETURN
  cat > "$override" <<'YML'
services:
  strapi:
    restart: "no"
    environment:
      SEED: "1"
YML
  ( cd "$CMS_DIR" && docker compose -f docker-compose.yml -f "$override" up -d --build )

  say "Warte auf Strapi, danach Seed-Schalter zurücknehmen …"
  local i
  for i in $(seq 1 60); do
    curl -sf -o /dev/null http://127.0.0.1:1337/_health && break
    sleep 5
  done
  ( cd "$CMS_DIR" && SEED=0 docker compose up -d --no-deps --force-recreate strapi )

  # Kontrolle statt Hoffnung: bleibt SEED=1 stehen, ist das ein stiller
  # Datenverlust beim nächsten Reboot — dann lieber laut abbrechen.
  local cid umgebung
  cid="$( (cd "$CMS_DIR" && docker compose ps -q strapi) 2>/dev/null || true )"
  umgebung="$(docker inspect --format '{{range .Config.Env}}{{println .}}{{end}}' "$cid" 2>/dev/null || true)"
  if grep -qx 'SEED=1' <<<"$umgebung"; then
    warn "ACHTUNG: In der Container-Konfiguration steht weiterhin SEED=1."
    warn "So darf der Server nicht bleiben — bei jedem Neustart liefe der Seed erneut."
    warn "Von Hand: cd $CMS_DIR && SEED=0 docker compose up -d --no-deps --force-recreate strapi"
    return 1
  fi
  ok "Reseed durch, SEED steht wieder auf 0 — Logs: docker compose logs -f strapi"
}

case "$MODE" in
  website) update_website ;;
  cms)     update_cms ;;
  lead)    update_lead ;;
  # set -e würde bei einem hängenden Lead-Service sonst das Website-Release
  # verschlucken — die Warnung steht dann oben, ausgerollt wird trotzdem.
  all)     update_cms; update_lead || warn "Lead-Service übersprungen — Meldung oben beachten"; update_website ;;
  reseed)  reseed_cms ;;
  *) echo "Usage: sudo $0 {website|cms|lead|all|reseed}"; exit 1 ;;
esac
