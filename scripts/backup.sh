#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p .data
umask 077
# Do not overwrite a pre-existing backup.
backup_file=".data/backup-$(date -u +%Y%m%dT%H%M%S)-$$.dump"
docker compose exec -T db pg_dump -U venezuela -d venezuela -Fc > "$backup_file"
echo "Respaldo creado: $backup_file"
