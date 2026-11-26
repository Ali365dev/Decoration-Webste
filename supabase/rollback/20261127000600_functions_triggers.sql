-- Reverses 000600. No data changes.
begin;
drop trigger if exists sync_product_price on public.product_variants;
drop trigger if exists refunds_within_payment on public.refunds;
drop function if exists public.enforce_refund_cap();
do $$
declare t record;
begin
  for t in select event_object_table as tbl from information_schema.triggers
           where trigger_schema = 'public' and trigger_name = 'set_updated_at' group by 1 loop
    execute format('drop trigger set_updated_at on public.%I', t.tbl);
  end loop;
end $$;
alter table public.orders alter column number drop default;
drop sequence if exists public.order_number_seq;
drop function if exists public.sync_product_price();
drop function if exists public.set_updated_at();
drop function if exists public.current_customer_id();
drop function if exists public.adjust_stock(uuid, integer, text, text, uuid, uuid);
commit;
