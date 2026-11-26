-- Starting data copied from values that were written into the code. Safe to run twice.

-- Compare-at price now belongs to the variant.
update public.product_variants v
set compare_at_amount = p.compare_at_amount
from public.products p
where v.product_id = p.id and v.sku = p.slug || '-default'
  and v.compare_at_amount is null and p.compare_at_amount > v.price_amount;

-- Sizes from product-experience.tsx. A null price means the product's own price.
with sizes(slug, title, sku, price, sort_order) as (values
  ('khaise', 'SINGLE (60X90 IN.)', 'FKH-137-KHAISE-SINGLE (60X90 IN.)', null::numeric, 1),
  ('khaise', 'DOUBLE (90X95 IN.)', 'FKH-137-KHAISE-DOUBLE (90X95 IN.)', 18000, 2),
  ('silk-plain-bed-sheet-set', 'KING (100X100 IN.)', 'FPBS-199-SILK PLAIN BED SHEET SET-KING (100X100 IN.)', null, 1),
  ('capp-169-qf-rp', 'King', 'CAPP-169-QF-RP-Bed In a Bag-King', null, 1)
)
insert into public.product_variants
  (product_id, sku, title, price_amount, price_currency, compare_at_amount, inventory_quantity, is_default, sort_order)
select p.id, s.sku, s.title, coalesce(s.price, p.price_amount), p.price_currency,
  case when p.compare_at_amount > coalesce(s.price, p.price_amount) then p.compare_at_amount end,
  0, false, s.sort_order
from sizes s join public.products p on p.slug = s.slug
where not exists (select 1 from public.product_variants x where lower(x.sku) = lower(s.sku));

-- The placeholder variant stops being sold once real sizes exist. It is kept, not removed.
update public.product_variants v
set is_active = false
from public.products p
where v.product_id = p.id and v.sku = p.slug || '-default'
  and p.slug in ('khaise', 'silk-plain-bed-sheet-set', 'capp-169-qf-rp')
  and exists (select 1 from public.product_variants x where x.product_id = p.id and x.sku <> v.sku);

update public.products p set color = c.color
from (values ('silk-plain-bed-sheet-set', 'PEACH'), ('khaise', 'O-WHITE'), ('capp-169-qf-rp', 'GREY')) c(slug, color)
where p.slug = c.slug and p.color is null;

-- Hero slides from cms-block-renderer.tsx.
insert into public.banners (key, placement, sort_order, image_url, eyebrow, title, href, cta_label, status) values
  ('hero-1', 'hero', 1, '/home/hero-3.jpg', 'New Collection', 'Wall Art', '/collections/new-in', 'Shop Now', 'published'),
  ('hero-2', 'hero', 2, '/home/hero-bedding.jpg', 'Premium Quality', 'Bedding', '/collections/new-in', 'Shop Now', 'published'),
  ('hero-3', 'hero', 3, '/home/hero-decor.jpg', 'Complete Your Home', 'Home Decor', '/collections/new-in', 'Explore All', 'published')
on conflict (key) do nothing;

-- Category tiles from domain/cms categoryTiles.
insert into public.banners (key, placement, sort_order, title, href, image_url, badge, cta_label, status) values
  ('tile-1', 'category_tile', 1, 'Home Decor', '/collections/home-decor', '/home/banner-a1.jpg', '50%*', 'Shop Now', 'published'),
  ('tile-2', 'category_tile', 2, 'Baby & Nursery', '/collections/baby-and-nursery', '/home/banner-a3.jpg', null, 'Shop Now', 'published'),
  ('tile-3', 'category_tile', 3, 'Bedding', '/collections/bedding', '/home/cat-1.jpg', '30%*', 'Shop Bedding', 'published'),
  ('tile-4', 'category_tile', 4, 'Canvas & Wall Art', '/collections/canvas-and-wall-art',
    coalesce((select i.url from public.product_images i join public.products p on p.id = i.product_id
              where p.slug = 'makkah-madinah-scenic-frame-set' and i.is_primary limit 1), '/home/cat-4.jpg'),
    '50%*', 'Discover Now', 'published'),
  ('tile-5', 'category_tile', 5, 'Curtains & Blinds', '/collections/curtains-and-blinds', '/home/p1.jpg', null, 'Explore All', 'published'),
  ('tile-6', 'category_tile', 6, 'Cushions & Throws', '/collections/new-in', '/home/banner-a2.jpg', null, 'Shop Now', 'published')
on conflict (key) do nothing;

insert into public.shipping_zones (name, delivery_charge, estimated_days)
select 'Standard delivery', 200, 5
where not exists (select 1 from public.shipping_zones where name = 'Standard delivery');

insert into public.settings (key, value)
select 'shipping', jsonb_build_object('defaultZoneId', z.id, 'freeDeliveryThreshold', 5000)
from public.shipping_zones z where z.name = 'Standard delivery'
on conflict (key) do nothing;

insert into public.settings (key, value) values ('payments', '{"codEnabled": true}')
on conflict (key) do nothing;

insert into public.roles (key, name) values ('super_admin', 'Super Admin')
on conflict (key) do nothing;
