#!/usr/bin/env bash
# Rebuilds the LOCAL database: existing baseline, catalog fixture, then every newer migration.
# Never touches a hosted database. Needs `supabase start`.
set -euo pipefail
cd "$(dirname "$0")/../.."

BASELINE=20261126000000
CONTAINER=supabase_db_dec-walls

supabase db reset --local --no-seed --version "$BASELINE"
docker exec -i "$CONTAINER" psql -U postgres -q -v ON_ERROR_STOP=1 < tests/db/fixtures/baseline-catalog.sql > /dev/null
supabase migration up --local

# The reset restarts services; wait until Storage answers through the local gateway.
for _ in $(seq 1 60); do
  curl -fs -o /dev/null http://127.0.0.1:54321/storage/v1/status && exit 0
  sleep 1
done
echo "Storage did not become ready" >&2
exit 1
