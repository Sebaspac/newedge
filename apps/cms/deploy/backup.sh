#!/usr/bin/env bash
# ============================================================================
# NEWEDGE — Backup (Postgres-Dump + Uploads + Leads), behält die letzten 14 Stände.
#   sudo ./apps/cms/deploy/backup.sh
# Als täglichen Cron einrichten (3 Uhr) — die fertige Zeile mit dem HIER
# gültigen Pfad steht am Ende der Skript-Ausgabe, nicht raten:
#   sudo ./apps/cms/deploy/backup.sh | tail -2
# ============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CMS_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="/opt/newedge/backups"
STAMP="$(date +%F_%H%M)"
KEEP=14

# 0700: die Archive enthalten die komplette Lead-Datenbank inkl. Namen und
# E-Mail-Adressen. Der Kommentar unten hat das schon immer versprochen — hier
# passiert es auch.
mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"
cd "$CMS_DIR"

# Datenbank
docker compose exec -T postgres pg_dump -U strapi strapi | gzip > "$BACKUP_DIR/db-$STAMP.sql.gz"

# Uploads (Volume-Name = <projektordner>_uploads)
VOL="$(basename "$CMS_DIR")_uploads"
docker run --rm -v "$VOL":/u -v "$BACKUP_DIR":/out alpine \
  tar czf "/out/uploads-$STAMP.tar.gz" -C /u . 2>/dev/null

# Leads des Lead-Service (apps/lead-api/data — Bind-Mount, KEIN Docker-Volume).
# Wichtigster Teil des Backups: leads.jsonl/contacts.jsonl sind die Primärablage,
# das CMS hat die Leads nur als Zweitablage. Enthält personenbezogene Daten —
# das Backup-Verzeichnis gehört entsprechend geschützt (chmod 700).
LEAD_DATA="$(dirname "$CMS_DIR")/lead-api/data"
if [ -d "$LEAD_DATA" ]; then
  tar czf "$BACKUP_DIR/leads-$STAMP.tar.gz" -C "$LEAD_DATA" .
  LEAD_MSG=" + leads-$STAMP.tar.gz"
else
  echo "⚠  $LEAD_DATA nicht gefunden — Leads NICHT gesichert."
  LEAD_MSG=""
fi

# Rotation
# `|| true` ist Pflicht: passt ein Glob auf nichts, gibt `ls` einen Fehler
# zurück, `set -o pipefail` reicht ihn durch und `set -e` beendet das Skript —
# genau in dem Fall, den der Zweig oben abfängt (kein lead-api/data → keine
# leads-*.tar.gz). Das Backup wäre fertig, der Cron-Log meldete trotzdem Fehler
# und die Abschlusszeile fehlte.
rotate() {
  { ls -1t "$BACKUP_DIR"/$1 2>/dev/null || true; } | tail -n +$((KEEP+1)) | xargs -r rm --
}
rotate 'db-*.sql.gz'
rotate 'uploads-*.tar.gz'
rotate 'leads-*.tar.gz'

echo "✔ Backup: $BACKUP_DIR/db-$STAMP.sql.gz + uploads-$STAMP.tar.gz$LEAD_MSG (behalte $KEEP)"
echo "  Cron-Zeile für täglich 3 Uhr:"
echo "  echo '0 3 * * * root $SCRIPT_DIR/backup.sh >/var/log/newedge-backup.log 2>&1' > /etc/cron.d/newedge-backup"
