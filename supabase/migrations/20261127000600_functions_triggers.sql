-- Stock changes go through one function so every change leaves a movement.
create function public.adjust_stock(
  p_variant_id uuid, p_delta integer, p_type text, p_reason text,
  p_order_id uuid default null, p_staff_id uuid default null
) returns integer
language plpgsql set search_path = '' as $$
declare v_quantity integer;
begin
  update public.product_variants
  set inventory_quantity = inventory_quantity + p_delta
  where id = p_variant_id and inventory_quantity + p_delta >= 0
  returning inventory_quantity into v_quantity;

  if not found then
    if exists (select 1 from public.product_variants where id = p_variant_id) then
      raise exception 'insufficient_stock';
    end if;
    raise exception 'variant_not_found';
  end if;

  insert into public.inventory_movements (variant_id, delta, type, reason, resulting_quantity, order_id, staff_id)
  values (p_variant_id, p_delta, p_type, p_reason, v_quantity, p_order_id, p_staff_id);
  return v_quantity;
end $$;

create function public.current_customer_id() returns uuid
language sql stable security definer set search_path = '' as
$$ select id from public.customers where auth_user_id = auth.uid() $$;

create sequence public.order_number_seq start with 10001;
alter table public.orders alter column number set default 'DW-' || nextval('public.order_number_seq')::text;

create function public.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

do $$
declare t text;
begin
  for t in
    select table_name from information_schema.columns
    where table_schema = 'public' and column_name = 'updated_at'
  loop
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- products.price_amount and compare_at_amount are a read-only copy of the cheapest active variant.
create function public.sync_product_price() returns trigger
language plpgsql set search_path = '' as $$
declare v_product uuid := case when tg_op = 'DELETE' then old.product_id else new.product_id end;
begin
  update public.products p
  set price_amount = v.price_amount, compare_at_amount = v.compare_at_amount
  from (
    select price_amount, compare_at_amount from public.product_variants
    where product_id = v_product and is_active
    order by price_amount, sort_order, id
    limit 1
  ) v
  where p.id = v_product
    and (p.price_amount, p.compare_at_amount) is distinct from (v.price_amount, v.compare_at_amount);
  return null;
end $$;

create trigger sync_product_price
  after insert or delete or update of price_amount, compare_at_amount, is_active, product_id, sort_order
  on public.product_variants for each row execute function public.sync_product_price();

revoke execute on function
  public.adjust_stock(uuid, integer, text, text, uuid, uuid),
  public.current_customer_id(), public.set_updated_at(), public.sync_product_price()
from public, anon, authenticated;
grant execute on function public.current_customer_id() to authenticated;

-- Refunds on one payment may never add up to more than the payment.
create function public.enforce_refund_cap() returns trigger
language plpgsql set search_path = '' as $$
declare v_paid numeric; v_refunded numeric;
begin
  -- Locking the payment makes simultaneous refunds wait for each other.
  select amount into v_paid from public.payments where id = new.payment_id for update;
  select coalesce(sum(amount), 0) into v_refunded from public.refunds where payment_id = new.payment_id and id <> new.id;
  if v_refunded + new.amount > v_paid then
    raise exception 'refund_exceeds_payment';
  end if;
  return new;
end $$;
revoke execute on function public.enforce_refund_cap() from public, anon, authenticated;
create trigger refunds_within_payment before insert or update of amount, payment_id on public.refunds
  for each row execute function public.enforce_refund_cap();
