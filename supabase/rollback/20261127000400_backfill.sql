-- Reverses 000400. Run only before anyone edits these rows or orders them.
begin;
delete from public.settings where key in ('shipping', 'payments');
delete from public.shipping_zones where name = 'Standard delivery';
delete from public.banners where key in ('hero-1','hero-2','hero-3','tile-1','tile-2','tile-3','tile-4','tile-5','tile-6');
delete from public.roles r where r.key = 'super_admin' and not exists (select 1 from public.staff_users s where s.role_id = r.id);
delete from public.product_variants where sku in (
  'FKH-137-KHAISE-SINGLE (60X90 IN.)', 'FKH-137-KHAISE-DOUBLE (90X95 IN.)',
  'FPBS-199-SILK PLAIN BED SHEET SET-KING (100X100 IN.)', 'CAPP-169-QF-RP-Bed In a Bag-King');
update public.product_variants v set is_active = true, compare_at_amount = null
from public.products p where v.product_id = p.id and v.sku = p.slug || '-default';
update public.products set color = null where slug in ('silk-plain-bed-sheet-set', 'khaise', 'capp-169-qf-rp');
commit;
