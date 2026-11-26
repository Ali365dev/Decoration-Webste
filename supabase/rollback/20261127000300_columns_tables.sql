-- Reverses 000300. DESTROYS any data held in these columns and tables.
-- Only for a rehearsal, or straight after applying and before the apps write anything.
begin;
drop table if exists public.newsletter_subscribers;
drop table if exists public.contact_messages;
drop table if exists public.payment_accounts;
drop table if exists public.shipping_zones;
drop table if exists public.coupon_usages;
drop table if exists public.order_status_history;
alter table public.products
  drop column if exists material,
  drop column if exists color;
alter table public.product_variants
  drop column if exists compare_at_amount,
  drop column if exists reorder_level,
  drop column if exists is_active,
  drop column if exists sort_order;
alter table public.product_images
  drop column if exists storage_path;
alter table public.categories
  drop column if exists status,
  drop column if exists image_url,
  drop column if exists image_storage_path;
alter table public.inventory_movements
  drop column if exists type,
  drop column if exists resulting_quantity,
  drop column if exists order_id,
  drop column if exists staff_id;
alter table public.addresses
  drop column if exists area;
alter table public.orders
  drop column if exists contact_name,
  drop column if exists contact_phone,
  drop column if exists whatsapp,
  drop column if exists discount_amount,
  drop column if exists coupon_id,
  drop column if exists coupon_code,
  drop column if exists shipping_zone_name,
  drop column if exists estimated_days,
  drop column if exists idempotency_key;
alter table public.order_items
  drop column if exists product_id,
  drop column if exists variant_title,
  drop column if exists sku,
  drop column if exists image_url;
alter table public.order_addresses
  drop column if exists area,
  drop column if exists instructions;
alter table public.payments
  drop column if exists method,
  drop column if exists receipt_path,
  drop column if exists account_snapshot,
  drop column if exists verified_by,
  drop column if exists verified_at;
alter table public.refunds
  drop column if exists staff_id;
alter table public.discounts
  drop column if exists min_order_amount,
  drop column if exists usage_limit,
  drop column if exists per_customer_limit;
alter table public.banners
  drop column if exists placement,
  drop column if exists eyebrow,
  drop column if exists cta_label,
  drop column if exists badge,
  drop column if exists sort_order,
  drop column if exists image_storage_path;
alter table public.order_addresses alter column type drop default;
alter table public.payments alter column provider drop default, alter column status drop default;
alter table public.inventory_movements alter column location_id set not null;
alter table public.product_variants drop column if exists created_at;
alter table public.product_variants drop column if exists updated_at;
alter table public.product_images drop column if exists created_at;
alter table public.product_images drop column if exists updated_at;
alter table public.categories drop column if exists created_at;
alter table public.categories drop column if exists updated_at;
alter table public.collections drop column if exists created_at;
alter table public.collections drop column if exists updated_at;
alter table public.category_products drop column if exists created_at;
alter table public.category_products drop column if exists updated_at;
alter table public.collection_products drop column if exists created_at;
alter table public.collection_products drop column if exists updated_at;
alter table public.inventory_movements drop column if exists updated_at;
alter table public.customers drop column if exists updated_at;
alter table public.addresses drop column if exists created_at;
alter table public.addresses drop column if exists updated_at;
alter table public.wishlists drop column if exists created_at;
alter table public.wishlists drop column if exists updated_at;
alter table public.wishlist_items drop column if exists created_at;
alter table public.wishlist_items drop column if exists updated_at;
alter table public.staff_users drop column if exists updated_at;
alter table public.roles drop column if exists updated_at;
alter table public.orders drop column if exists updated_at;
alter table public.order_items drop column if exists created_at;
alter table public.order_items drop column if exists updated_at;
alter table public.order_addresses drop column if exists created_at;
alter table public.order_addresses drop column if exists updated_at;
alter table public.payments drop column if exists updated_at;
alter table public.refunds drop column if exists updated_at;
alter table public.discounts drop column if exists created_at;
alter table public.discounts drop column if exists updated_at;
alter table public.banners drop column if exists created_at;
alter table public.banners drop column if exists updated_at;
alter table public.settings drop column if exists created_at;
alter table public.settings drop column if exists updated_at;
commit;
