# Applying the Phase 3 migrations to the live database

**Nothing here has been run against live.** Every step marked 🔒 needs the owner's approval for that run.
The files were rehearsed on local Supabase (PostgreSQL 17) with a catalog built from the seed script,
not a copy of live data. Preflight is what checks the live rows.

## Before you start

1. 🔒 Confirm which project this is and that a **backup exists that you know how to restore**
   (Supabase dashboard → Database → Backups). Do not continue without one.
2. Stop anything that edits the catalog while you apply.
3. Use the **session** connection string (port 5432), not the transaction pooler (6543) that the app uses.
   Keep the password out of your shell history: type the string at this prompt.

```bash
read -rs DB_URL && export DB_URL
```

The Supabase CLI needs special characters in the password percent-encoded (for example `;` is `%3B`,
`/` is `%2F`, `)` is `%29`). Connect as `postgres`, not as any other database user.

4. Rehearse once more locally (Docker running):

```bash
supabase start
```

```bash
npm run db:rehearse && npm run test:db
```

## Check live (read-only)

```bash
node scripts/db/preflight.mjs
```

Every line must say `ok`. **If any line says `FAIL`, stop.** Nothing has changed.

```bash
node scripts/db/snapshot.mjs > snapshot-before.json
```

## Apply

5. 🔒 Record that the existing schema is already there. This writes only to the migration history.

```bash
supabase migration repair --db-url "$DB_URL" --status applied 20261126000000
```

6. See what would run. It must list exactly the seven files `20261127000100` to `20261127000700`,
   and **not** `20261126000000`.

```bash
supabase db push --db-url "$DB_URL" --dry-run
```

7. 🔒 Apply.

```bash
supabase db push --db-url "$DB_URL"
```

If a file fails, the files before it stay applied. Do not retry blindly: read the error first.

8. Compare.

```bash
node scripts/db/snapshot.mjs > snapshot-after.json
```

Expected differences only: `banners` +9, `roles` +1, `settings` +2, `product_variants` +4 (if live has
the Khaise, silk sheet and Bed in a Bag products), six new tables with `shipping_zones` 1 and the rest 0.
`productSlugs` and `imageUrls` must be **identical**. A table that already had rows (for example `roles`)
rises by less.

9. Open the store home page, a collection and a product. They should look as before.

## Undo

Each rollback file runs as one transaction: if it fails, it changes nothing. Run the whole file.

🔒 Run files in `supabase/rollback/` **newest first**, only for the migrations that were applied, with
`psql "$DB_URL" -v ON_ERROR_STOP=1 -f <file>` (or paste into the SQL editor). Then mark each undone
version: `supabase migration repair --db-url "$DB_URL" --status reverted <version>`.

- `000300` rollback **destroys data** in the new columns and tables. Use it only before the apps write to them.
- `000400` rollback removes the starting rows and the four new size variants. It fails if orders use them.
- `000200` cannot be undone: enum values stay. `000100` is deliberately not undone: it would reopen tables.

If real orders exist, restore from the backup or fix forward instead.

## What changes for the current apps

| Item | Effect until fixed in a later phase |
|---|---|
| Dashboard "delete product" | **Stops working.** It writes status `scheduled`, which the database now refuses. |
| Database definitions in `packages/db/src/schema` | Not updated yet. Update them **after** live is migrated, before Phase 4 code. |
| Four new size variants | Exist in the database with stock 0. The store still shows its hardcoded sizes. |
| `products.price_amount` | Now overwritten from the cheapest active variant whenever a variant's price changes. |
| Supabase API roles | Can read the public catalog; signed-in customers can read their own records. The apps do not use this path yet. |

Customer queries in later phases must go through `withCustomer` and select columns by name.
