-- Additive only: new columns and tables from DATABASE_ARCHITECTURE.md sections 4 to 9.

-- Some new columns are required with no default, so these tables must still be empty.
do $$
begin
  if exists (select 1 from public.orders) or exists (select 1 from public.order_items)
     or exists (select 1 from public.payments) or exists (select 1 from public.inventory_movements)
     or exists (select 1 from public.banners) then
    raise exception 'orders_not_empty: orders, order_items, payments, inventory_movements and banners must be empty';
  end if;
end $$;

alter table public.products
  add column if not exists material text,
  add column if not exists color text;

alter table public.product_variants
  add column if not exists compare_at_amount numeric(12,2),
  add column if not exists reorder_level integer not null default 10,
  add column if not exists is_active boolean not null default true,
  add column if not exists sort_order integer not null default 0;

alter table public.product_images add column if not exists storage_path text;

alter table public.categories
  add column if not exists status public.publish_status not null default 'published',
  add column if not exists image_url text,
  add column if not exists image_storage_path text;

alter table public.inventory_movements
  alter column location_id drop not null,
  add column if not exists type text not null,
  add column if not exists resulting_quantity integer not null,
  add column if not exists order_id uuid,
  add column if not exists staff_id uuid;

alter table public.addresses add column if not exists area text;

alter table public.orders
  add column if not exists contact_name text not null,
  add column if not exists contact_phone text not null,
  add column if not exists whatsapp text,
  add column if not exists discount_amount numeric(12,2) not null default 0,
  add column if not exists coupon_id uuid,
  add column if not exists coupon_code text,
  add column if not exists shipping_zone_name text,
  add column if not exists estimated_days integer,
  add column if not exists idempotency_key text not null;

alter table public.order_items
  add column if not exists product_id uuid,
  add column if not exists variant_title text not null,
  add column if not exists sku text not null,
  add column if not exists image_url text;

alter table public.order_addresses
  alter column type set default 'shipping',
  add column if not exists area text,
  add column if not exists instructions text;

alter table public.payments
  alter column provider set default 'manual',
  alter column status set default 'pending',
  add column if not exists method text not null,
  add column if not exists receipt_path text,
  add column if not exists account_snapshot jsonb,
  add column if not exists verified_by uuid,
  add column if not exists verified_at timestamptz;

alter table public.refunds add column if not exists staff_id uuid;

alter table public.discounts
  add column if not exists min_order_amount numeric(12,2) not null default 0,
  add column if not exists usage_limit integer,
  add column if not exists per_customer_limit integer;

alter table public.banners
  add column if not exists placement text not null,
  add column if not exists eyebrow text,
  add column if not exists cta_label text,
  add column if not exists badge text,
  add column if not exists sort_order integer not null default 0,
  add column if not exists image_storage_path text;

create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null,
  kind text not null,
  from_status text,
  to_status text not null,
  staff_id uuid,
  note text
);

create table if not exists public.coupon_usages (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null,
  order_id uuid not null,
  customer_id uuid not null,
  discount_amount numeric(12,2) not null,
  released_at timestamptz
);

create table if not exists public.shipping_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  delivery_charge numeric(12,2) not null,
  estimated_days integer not null,
  is_active boolean not null default true
);

create table if not exists public.payment_accounts (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  provider text not null,
  account_title text not null,
  account_number text not null,
  iban text,
  is_active boolean not null default true
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text not null default 'new'
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null
);

-- Timestamps on every table the apps use, and RLS on the new tables.
do $$
declare t text;
begin
  foreach t in array array[
    'products','product_variants','product_images','categories','collections','category_products',
    'collection_products','inventory_movements','customers','addresses','wishlists','wishlist_items',
    'staff_users','roles','orders','order_items','order_addresses','payments','refunds','discounts',
    'banners','settings','order_status_history','coupon_usages','shipping_zones','payment_accounts',
    'contact_messages','newsletter_subscribers'
  ] loop
    execute format('alter table public.%I add column if not exists created_at timestamptz not null default now()', t);
    execute format('alter table public.%I add column if not exists updated_at timestamptz not null default now()', t);
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;
