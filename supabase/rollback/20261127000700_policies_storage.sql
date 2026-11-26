-- Reverses 000700: removes the rules and grants, which leaves every table closed.
-- Storage buckets are kept: they may hold files. Remove them by hand only if empty.
begin;
drop policy if exists products_public_read on public.products;
drop policy if exists product_variants_public_read on public.product_variants;
drop policy if exists product_images_public_read on public.product_images;
drop policy if exists category_products_public_read on public.category_products;
drop policy if exists collection_products_public_read on public.collection_products;
drop policy if exists categories_public_read on public.categories;
drop policy if exists collections_public_read on public.collections;
drop policy if exists banners_public_read on public.banners;
drop policy if exists customers_own_read on public.customers;
drop policy if exists customers_own_update on public.customers;
drop policy if exists addresses_own on public.addresses;
drop policy if exists wishlists_own on public.wishlists;
drop policy if exists wishlist_items_own on public.wishlist_items;
drop policy if exists orders_own_read on public.orders;
drop policy if exists order_items_own_read on public.order_items;
drop policy if exists order_addresses_own_read on public.order_addresses;
drop policy if exists payments_own_read on public.payments;
drop policy if exists order_status_history_own_read on public.order_status_history;
revoke all on all tables in schema public from anon, authenticated;
commit;
