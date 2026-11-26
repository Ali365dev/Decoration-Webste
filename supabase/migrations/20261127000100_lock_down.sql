-- Closes every public table to the Supabase API roles. Later migrations grant back
-- only what DATABASE_ARCHITECTURE.md section 10.2 allows.
-- The app connects as `postgres`, so these statements do not affect it.

do $$
declare t record;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t.tablename);
  end loop;
end $$;

revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke execute on all functions in schema public from public, anon, authenticated;

-- New objects start closed too.
alter default privileges for role postgres in schema public revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on sequences from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on functions from anon, authenticated;
-- PUBLIC's execute right is a global default; a per-schema revoke cannot remove it.
alter default privileges for role postgres revoke execute on functions from public;
