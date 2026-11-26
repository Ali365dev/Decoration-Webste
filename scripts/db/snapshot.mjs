// Usage: DB_URL=... node scripts/db/snapshot.mjs      Compare before and after.
import { readOnly, takeSnapshot, targetUrl } from "./lib.mjs";

console.log(JSON.stringify(await readOnly(targetUrl(), takeSnapshot), null, 2));
