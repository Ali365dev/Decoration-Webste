-- Reverses 000500. Removes rules and indexes only; no data changes.
begin;
drop trigger if exists categories_no_cycle on public.categories;
drop function if exists public.prevent_category_cycle();
do $$
declare i record;
begin
  for i in select indexname from pg_indexes where schemaname = 'public' and indexname like '%\_fk\_idx' loop
    execute format('drop index public.%I', i.indexname);
  end loop;
end $$;
drop index if exists public.product_variants_sku_lower_uq;
drop index if exists public.product_variants_one_default_uq;
drop index if exists public.product_images_one_primary_uq;
drop index if exists public.product_images_one_hover_uq;
drop index if exists public.inventory_movements_order_uq;
drop index if exists public.addresses_one_default_uq;
drop index if exists public.wishlists_customer_uq;
drop index if exists public.orders_idempotency_uq;
drop index if exists public.order_addresses_order_uq;
drop index if exists public.payments_order_uq;
drop index if exists public.discounts_code_lower_uq;
drop index if exists public.coupon_usages_order_uq;
drop index if exists public.shipping_zones_name_uq;
drop index if exists public.newsletter_subscribers_email_uq;
drop index if exists public.products_status_created_idx;
drop index if exists public.orders_status_created_idx;
drop index if exists public.orders_created_idx;
drop index if exists public.orders_email_idx;
alter table public.products
  drop constraint if exists products_price_check,
  drop constraint if exists products_status_check,
  drop constraint if exists products_slug_check;
alter table public.categories
  drop constraint if exists categories_status_check,
  drop constraint if exists categories_slug_check,
  drop constraint if exists categories_parent_fk;
alter table public.collections
  drop constraint if exists collections_status_check,
  drop constraint if exists collections_slug_check;
alter table public.product_variants
  drop constraint if exists product_variants_price_check,
  drop constraint if exists product_variants_stock_check,
  drop constraint if exists product_variants_reorder_check,
  drop constraint if exists product_variants_compare_check;
alter table public.inventory_movements
  drop constraint if exists inventory_movements_delta_check,
  drop constraint if exists inventory_movements_type_check,
  drop constraint if exists inventory_movements_result_check,
  drop constraint if exists inventory_movements_order_fk,
  drop constraint if exists inventory_movements_staff_fk;
alter table public.customers
  drop constraint if exists customers_email_check,
  drop constraint if exists customers_auth_user_fk;
alter table public.staff_users
  drop constraint if exists staff_users_email_check;
alter table public.orders
  drop constraint if exists orders_status_check,
  drop constraint if exists orders_amounts_check,
  drop constraint if exists orders_total_check,
  drop constraint if exists orders_email_check,
  drop constraint if exists orders_coupon_fk;
alter table public.order_items
  drop constraint if exists order_items_quantity_check,
  drop constraint if exists order_items_price_check,
  drop constraint if exists order_items_product_fk;
alter table public.cart_items
  drop constraint if exists cart_items_quantity_check;
alter table public.payments
  drop constraint if exists payments_method_check,
  drop constraint if exists payments_status_check,
  drop constraint if exists payments_amount_check,
  drop constraint if exists payments_verified_by_fk;
alter table public.refunds
  drop constraint if exists refunds_amount_check,
  drop constraint if exists refunds_staff_fk;
alter table public.discounts
  drop constraint if exists discounts_type_check,
  drop constraint if exists discounts_value_check,
  drop constraint if exists discounts_percentage_check,
  drop constraint if exists discounts_limits_check,
  drop constraint if exists discounts_active_check;
alter table public.order_status_history
  drop constraint if exists order_status_history_kind_check,
  drop constraint if exists order_status_history_order_fk,
  drop constraint if exists order_status_history_staff_fk;
alter table public.coupon_usages
  drop constraint if exists coupon_usages_amount_check,
  drop constraint if exists coupon_usages_coupon_fk,
  drop constraint if exists coupon_usages_order_fk,
  drop constraint if exists coupon_usages_customer_fk;
alter table public.shipping_zones
  drop constraint if exists shipping_zones_values_check;
alter table public.payment_accounts
  drop constraint if exists payment_accounts_kind_check,
  drop constraint if exists payment_accounts_wallet_check;
alter table public.banners
  drop constraint if exists banners_placement_check;
alter table public.contact_messages
  drop constraint if exists contact_messages_email_check,
  drop constraint if exists contact_messages_length_check;
alter table public.newsletter_subscribers
  drop constraint if exists newsletter_subscribers_email_check,
  drop constraint if exists newsletter_subscribers_source_check;
commit;
