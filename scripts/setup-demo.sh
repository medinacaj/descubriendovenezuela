#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if [[ ! -f .env ]]; then
  node --input-type=module <<'JS'
import {randomBytes} from 'node:crypto';import {writeFileSync} from 'node:fs';
const p=randomBytes(24).toString('hex');writeFileSync('.env',`POSTGRES_PASSWORD=${p}\nDATABASE_URL=postgresql://venezuela:${p}@127.0.0.1:5432/venezuela\nAPP_ORIGIN=http://localhost:3000\n`,{mode:0o600});
JS
fi
npm ci
docker compose up -d --wait
npm run db:migrate
ALLOW_DEMO_IMPORT=yes npx tsx scripts/demo.ts
npm run catalog:import
npx tsx scripts/demo-admin.ts
