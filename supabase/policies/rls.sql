-- REPLACED, do not run. Access rules now live in supabase/migrations/20261127000700_policies_storage.sql.
-- (This file was never applied: PostgreSQL rejects `create policy if not exists`.)

-- RLS baselines for Dec Walls (apply in Supabase SQL editor / migrations).
-- Enable RLS on public commerce tables; policies are permissive for published reads
-- and ownership-scoped for customer writes. Staff writes use service role or
-- security-definer RPCs from the domain layer.

alter table if exists products enable row level security;
alter table if exists collections enable row level security;
alter table if exists pages enable row level security;
alter table if exists carts enable row level security;
alter table if exists cart_items enable row level security;
alter table if exists orders enable row level security;
alter table if exists customers enable row level security;
alter table if exists media_assets enable row level security;

-- Public can read published catalog/CMS content
create policy if not exists products_public_read on products
  for select using (status = 'published');

create policy if not exists collections_public_read on collections
  for select using (status = 'published');

create policy if not exists pages_public_read on pages
  for select using (
    status = 'published'
    or (status = 'scheduled' and scheduled_at <= now())
  );

create policy if not exists media_public_read on media_assets
  for select using (true);

-- Customers manage their own carts/orders (auth.uid() mapped via customers.auth_user_id)
create policy if not exists carts_owner_all on carts
  for all using (
    customer_id in (
      select id from customers where auth_user_id = auth.uid()
    )
  )
  with check (
    customer_id in (
      select id from customers where auth_user_id = auth.uid()
    )
  );

create policy if not exists orders_owner_read on orders
  for select using (
    customer_id in (
      select id from customers where auth_user_id = auth.uid()
    )
  );
