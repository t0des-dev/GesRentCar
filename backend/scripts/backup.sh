#!/bin/bash

set -e

BACKUP_DIR="$(cd "$(dirname "$0")/../../storage/backups" && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="${DB_DATABASE:-vectoria}"
DB_USER="${DB_USERNAME:-root}"
DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PASS="${DB_PASSWORD:-}"

mkdir -p "$BACKUP_DIR"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting backup..."

# Database backup
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Dumping database '$DB_NAME'..."
if [ -n "$DB_PASS" ]; then
    mysqldump -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" | gzip > "$BACKUP_DIR/db_${TIMESTAMP}.sql.gz"
else
    mysqldump -h "$DB_HOST" -u "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_DIR/db_${TIMESTAMP}.sql.gz"
fi
DB_SIZE=$(du -h "$BACKUP_DIR/db_${TIMESTAMP}.sql.gz" | cut -f1)
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Database backup: db_${TIMESTAMP}.sql.gz ($DB_SIZE)"

# Storage/app backup
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Archiving storage/app..."
tar -czf "$BACKUP_DIR/app_${TIMESTAMP}.tar.gz" -C "$(dirname "$BACKUP_DIR")" app
APP_SIZE=$(du -h "$BACKUP_DIR/app_${TIMESTAMP}.tar.gz" | cut -f1)
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Storage backup: app_${TIMESTAMP}.tar.gz ($APP_SIZE)"

# Cleanup backups older than 30 days
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Cleaning up backups older than 30 days..."
DELETED=$(find "$BACKUP_DIR" -type f \( -name "db_*.sql.gz" -o -name "app_*.tar.gz" \) -mtime +30 -print -delete | wc -l)
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Removed $DELETED old backup(s)"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backup completed."
