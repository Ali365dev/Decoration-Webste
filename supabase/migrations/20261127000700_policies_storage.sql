-- Access rules from DATABASE_ARCHITECTURE.md section 10.2. These also apply to direct Supabase API calls.
-- Everything not granted here stays closed (see 000100).

grant usage on schema public to anon, authenticated;

-- ── Public catalog ──────────────────────────────────────────────────────────
grant select on public.products, public.product_images, public.category_products,
  public.collection_products, public.categories, public.collections, public.banners
to anon, authenticated;
-- Exact stock counts are not public.
grant select (id, product_id, sku, title, price_amount, price_currency, compare_at_amount,
  is_default, is_active, sort_order, created_at, updated_at)
on public.product_variants to anon, authenticated;

create policy products_public_read on public.products
  for select to anon, authenticated using (status = 'published');
create policy product_variants_public_read on public.product_variants
  for select to anon, authenticated using (
    is_active and exists (select 1 from public.products p where p.id = product_id and p.status = 'published'));
create policy product_images_public_read on public.product_images
  for select to anon, authenticated using (
    exists (select 1 from public.products p where p.id = product_id and p.status = 'published'));
create policy category_products_public_read on public.category_products
  for select to anon, authenticated using (
    exists (select 1 from public.products p where p.id = product_id and p.status = 'published'));
create policy collection_products_public_read on public.collection_products
  for select to anon, authenticated using (
    exists (select 1 from public.products p where p.id = product_id and p.status = 'published'));
create policy categories_public_read on public.categories
  for select to anon, authenticated using (status = 'published');
create policy collections_public_read on public.collections
  for select to anon, authenticated using (status = 'published');
create policy banners_public_read on public.banners
  for select to anon, authenticated using (
    status = 'published'
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at > now()));

-- ── A customer's own records ────────────────────────────────────────────────
grant select on public.customers to authenticated;
grant update (full_name, phone) on public.customers to authenticated;
create policy customers_own_read on public.customers
  for select to authenticated using (auth_user_id = (select auth.uid()));
create policy customers_own_update on public.customers
  for update to authenticated using (auth_user_id = (select auth.uid())) with check (auth_user_id = (select auth.uid()));

grant select, insert, update, delete on public.addresses, public.wishlists, public.wishlist_items to authenticated;
create policy addresses_own on public.addresses
  for all to authenticated
  using (customer_id = (select public.current_customer_id()))
  with check (customer_id = (select public.current_customer_id()));
create policy wishlists_own on public.wishlists
  for all to authenticated
  using (customer_id = (select public.current_customer_id()))
  with check (customer_id = (select public.current_customer_id()));
create policy wishlist_items_own on public.wishlist_items
  for all to authenticated
  using (exists (select 1 from public.wishlists w where w.id = wishlist_id and w.customer_id = (select public.current_customer_id())))
  with check (exists (select 1 from public.wishlists w where w.id = wishlist_id and w.customer_id = (select public.current_customer_id())));

-- Orders are read-only for customers. The checkout server writes them.
grant select (id, number, customer_id, email, status, currency, subtotal_amount, shipping_amount,
  total_amount, created_at, updated_at, contact_name, contact_phone, whatsapp, discount_amount,
  coupon_id, coupon_code, shipping_zone_name, estimated_days)
on public.orders to authenticated;
grant select on public.order_items, public.order_addresses to authenticated;
grant select (id, order_id, method, status, amount, currency, created_at) on public.payments to authenticated;
grant select (id, order_id, kind, from_status, to_status, created_at) on public.order_status_history to authenticated;

create policy orders_own_read on public.orders
  for select to authenticated using (customer_id = (select public.current_customer_id()));
create policy order_items_own_read on public.order_items
  for select to authenticated using (
    exists (select 1 from public.orders o where o.id = order_id and o.customer_id = (select public.current_customer_id())));
create policy order_addresses_own_read on public.order_addresses
  for select to authenticated using (
    exists (select 1 from public.orders o where o.id = order_id and o.customer_id = (select public.current_customer_id())));
create policy payments_own_read on public.payments
  for select to authenticated using (
    exists (select 1 from public.orders o where o.id = order_id and o.customer_id = (select public.current_customer_id())));
create policy order_status_history_own_read on public.order_status_history
  for select to authenticated using (
    exists (select 1 from public.orders o where o.id = order_id and o.customer_id = (select public.current_customer_id())));

-- ── Storage ─────────────────────────────────────────────────────────────────
-- No storage.objects policy on purpose: only server-issued signed URLs can upload,
-- and receipts can only be read through short-lived signed links.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('catalog', 'catalog', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('receipts', 'receipts', false, 10485760, array['image/jpeg', 'image/png', 'application/pdf'])
on conflict (id) do nothing;
