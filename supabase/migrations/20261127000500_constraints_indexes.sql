-- Rules from DATABASE_ARCHITECTURE.md sections 4 to 9. Run preflight first on a database with data.

alter table public.products
  add constraint products_price_check check (price_amount >= 0),
  add constraint products_status_check check (status::text <> 'scheduled'),
  add constraint products_slug_check check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$');

alter table public.categories
  add constraint categories_status_check check (status::text in ('draft', 'published')),
  add constraint categories_slug_check check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  add constraint categories_parent_fk foreign key (parent_id) references public.categories(id) on delete restrict;

alter table public.collections
  add constraint collections_status_check check (status::text in ('draft', 'published')),
  add constraint collections_slug_check check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$');

alter table public.product_variants
  add constraint product_variants_price_check check (price_amount > 0),
  add constraint product_variants_stock_check check (inventory_quantity >= 0),
  add constraint product_variants_reorder_check check (reorder_level >= 0),
  add constraint product_variants_compare_check check (compare_at_amount is null or compare_at_amount > price_amount);
create unique index product_variants_sku_lower_uq on public.product_variants (lower(sku));
create unique index product_variants_one_default_uq on public.product_variants (product_id) where is_default;
create unique index product_images_one_primary_uq on public.product_images (product_id) where is_primary;
create unique index product_images_one_hover_uq on public.product_images (product_id) where is_hover;

alter table public.inventory_movements
  add constraint inventory_movements_delta_check check (delta <> 0),
  add constraint inventory_movements_type_check check (type in ('restock', 'sale', 'adjustment', 'return')),
  add constraint inventory_movements_result_check check (resulting_quantity >= 0),
  add constraint inventory_movements_order_fk foreign key (order_id) references public.orders(id),
  add constraint inventory_movements_staff_fk foreign key (staff_id) references public.staff_users(id);
create unique index inventory_movements_order_uq on public.inventory_movements (order_id, variant_id, type) where order_id is not null;

alter table public.customers
  add constraint customers_email_check check (email = lower(btrim(email))),
  add constraint customers_auth_user_fk foreign key (auth_user_id) references auth.users(id) on delete set null;
alter table public.staff_users add constraint staff_users_email_check check (email = lower(btrim(email)));
create unique index addresses_one_default_uq on public.addresses (customer_id) where is_default;
create unique index wishlists_customer_uq on public.wishlists (customer_id);

alter table public.orders
  add constraint orders_status_check check (status::text in ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
  add constraint orders_amounts_check check (subtotal_amount >= 0 and discount_amount >= 0 and shipping_amount >= 0 and total_amount >= 0 and discount_amount <= subtotal_amount),
  add constraint orders_total_check check (total_amount = subtotal_amount - discount_amount + shipping_amount),
  add constraint orders_email_check check (email = lower(btrim(email))),
  add constraint orders_coupon_fk foreign key (coupon_id) references public.discounts(id);
create unique index orders_idempotency_uq on public.orders (idempotency_key);

alter table public.order_items
  add constraint order_items_quantity_check check (quantity > 0),
  add constraint order_items_price_check check (unit_price_amount >= 0),
  add constraint order_items_product_fk foreign key (product_id) references public.products(id);
alter table public.cart_items add constraint cart_items_quantity_check check (quantity > 0);

create unique index order_addresses_order_uq on public.order_addresses (order_id);

alter table public.payments
  add constraint payments_method_check check (method in ('cod', 'bank', 'jazzcash', 'easypaisa')),
  add constraint payments_status_check check (status in ('pending', 'verified', 'rejected', 'refunded')),
  add constraint payments_amount_check check (amount >= 0),
  add constraint payments_verified_by_fk foreign key (verified_by) references public.staff_users(id);
create unique index payments_order_uq on public.payments (order_id);

alter table public.refunds
  add constraint refunds_amount_check check (amount > 0),
  add constraint refunds_staff_fk foreign key (staff_id) references public.staff_users(id);

alter table public.discounts
  add constraint discounts_type_check check (type in ('percentage', 'fixed')),
  add constraint discounts_value_check check (value > 0),
  add constraint discounts_percentage_check check (type <> 'percentage' or value <= 100),
  add constraint discounts_limits_check check (min_order_amount >= 0 and (usage_limit is null or usage_limit > 0) and (per_customer_limit is null or per_customer_limit > 0)),
  add constraint discounts_active_check check (is_active in (0, 1));
create unique index discounts_code_lower_uq on public.discounts (lower(code));

alter table public.order_status_history
  add constraint order_status_history_kind_check check (kind in ('order', 'payment')),
  add constraint order_status_history_order_fk foreign key (order_id) references public.orders(id),
  add constraint order_status_history_staff_fk foreign key (staff_id) references public.staff_users(id);

alter table public.coupon_usages
  add constraint coupon_usages_amount_check check (discount_amount >= 0),
  add constraint coupon_usages_coupon_fk foreign key (coupon_id) references public.discounts(id),
  add constraint coupon_usages_order_fk foreign key (order_id) references public.orders(id),
  add constraint coupon_usages_customer_fk foreign key (customer_id) references public.customers(id);
create unique index coupon_usages_order_uq on public.coupon_usages (order_id);

alter table public.shipping_zones add constraint shipping_zones_values_check check (delivery_charge >= 0 and estimated_days >= 0);
create unique index shipping_zones_name_uq on public.shipping_zones (name);

alter table public.payment_accounts
  add constraint payment_accounts_kind_check check (kind in ('bank', 'wallet')),
  add constraint payment_accounts_wallet_check check (kind <> 'wallet' or provider in ('easypaisa', 'jazzcash', 'sadapay'));

alter table public.banners add constraint banners_placement_check check (placement in ('hero', 'category_tile'));

alter table public.contact_messages
  add constraint contact_messages_email_check check (email = lower(btrim(email))),
  add constraint contact_messages_length_check check (char_length(name) <= 200 and char_length(email) <= 320 and char_length(coalesce(subject, '')) <= 300 and char_length(message) <= 5000);
alter table public.newsletter_subscribers
  add constraint newsletter_subscribers_email_check check (email = lower(btrim(email)) and char_length(email) <= 320),
  add constraint newsletter_subscribers_source_check check (source in ('home', 'footer'));
create unique index newsletter_subscribers_email_uq on public.newsletter_subscribers (email);

-- A category may not sit under itself, directly or through its children.
create function public.prevent_category_cycle() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.parent_id is not null and exists (
    with recursive up(id) as (
      select new.parent_id
      union
      select c.parent_id from public.categories c join up on c.id = up.id where c.parent_id is not null
    )
    select 1 from up where up.id = new.id
  ) then
    raise exception 'category_cycle';
  end if;
  return new;
end $$;
revoke execute on function public.prevent_category_cycle() from public, anon, authenticated;
create trigger categories_no_cycle before insert or update of parent_id on public.categories
  for each row execute function public.prevent_category_cycle();

-- Lookup indexes.
create index products_status_created_idx on public.products (status, created_at);
create index orders_status_created_idx on public.orders (status, created_at);
create index orders_created_idx on public.orders (created_at);
create index orders_email_idx on public.orders (email);

-- One index for every foreign key that does not already lead one.
do $$
declare f record;
begin
  for f in
    select c.conrelid::regclass as tbl, cl.relname, a.attname
    from pg_constraint c
    join pg_class cl on cl.oid = c.conrelid
    join pg_attribute a on a.attrelid = c.conrelid and a.attnum = c.conkey[1]
    where c.contype = 'f' and c.connamespace = 'public'::regnamespace
      and not exists (select 1 from pg_index i where i.indrelid = c.conrelid and i.indkey[0] = c.conkey[1] and i.indpred is null)
  loop
    execute format('create index if not exists %I on %s (%I)', f.relname || '_' || f.attname || '_fk_idx', f.tbl, f.attname);
  end loop;
end $$;
