-- RLS for tables added in Phase 6 (shipping_zones, contact_messages,
-- newsletter_subscribers). These were not covered by 20261127000700_policies_storage.sql.

-- ── Shipping zones ───────────────────────────────────────────────────────────
-- Delivery charges and zone names are public read (shown at checkout).
grant select on public.shipping_zones to anon, authenticated;
create policy shipping_zones_public_read on public.shipping_zones
  for select to anon, authenticated using (true);

-- ── Contact messages ─────────────────────────────────────────────────────────
-- Anyone can submit a message; nobody can read them through the API (admin reads
-- via the postgres role only).
grant insert on public.contact_messages to anon, authenticated;
create policy contact_messages_insert on public.contact_messages
  for insert to anon, authenticated with check (true);

-- ── Newsletter subscribers ───────────────────────────────────────────────────
-- Anyone can subscribe; duplicates are silently ignored via the unique index.
-- Nobody can read the list through the API.
grant insert on public.newsletter_subscribers to anon, authenticated;
create policy newsletter_subscribers_insert on public.newsletter_subscribers
  for insert to anon, authenticated with check (true);
