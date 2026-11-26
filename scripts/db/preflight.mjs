// Usage: DB_URL=... node scripts/db/preflight.mjs      Run BEFORE applying migrations.
import { readOnly, runPreflight, targetUrl } from "./lib.mjs";

const results = await readOnly(targetUrl(), runPreflight);
for (const { rule, violations } of results) console.log(`${violations === 0 ? "ok  " : "FAIL"} ${rule}: ${violations}`);
process.exit(results.some((r) => r.violations > 0) ? 1 : 0);
