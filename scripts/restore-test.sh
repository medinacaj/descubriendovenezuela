#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
backup_file="${1:?Indica el archivo .dump}"
[[ -s "$backup_file" ]] || { echo 'Respaldo inexistente o vacío' >&2; exit 1; }
# CREATE refuses an existing database; never overwrite any existing database.
restore_db="restore_check_$$"
docker compose exec -T db createdb -U venezuela "$restore_db"
trap 'docker compose exec -T db dropdb -U venezuela "$restore_db"' EXIT
docker compose exec -T db pg_restore -U venezuela -d "$restore_db" --exit-on-error < "$backup_file"
docker compose exec -T db psql -U venezuela -d "$restore_db" -v ON_ERROR_STOP=1 -c 'SELECT count(*) AS restored_places FROM places; SELECT postgis_version();'
