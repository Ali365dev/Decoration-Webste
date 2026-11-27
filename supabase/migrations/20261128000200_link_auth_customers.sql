-- Links each storefront sign-in (auth.users) to exactly one public.customers row, which the
-- customer RLS policies and current_customer_id() rely on. Additive only: it never deletes
-- rows and never replaces an auth_user_id that is already set.
--
-- Linking waits for a confirmed email, so nobody can claim someone else's guest orders by
-- signing up with their address. When email confirmation is off, email_confirmed_at is set on
-- insert and the link happens at once.

create function public.link_customer_to_auth_user(p_user_id uuid, p_email text, p_full_name text)
returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  select id into v_id from public.customers where auth_user_id = p_user_id;
  if v_id is not null then
    return v_id;
  end if;

  -- An existing guest customer with this email becomes this user's customer.
  update public.customers
  set auth_user_id = p_user_id,
      full_name = coalesce(full_name, nullif(p_full_name, ''))
  where id = (
    select id from public.customers
    where lower(email) = lower(p_email) and auth_user_id is null
    order by created_at
    limit 1
  )
  returning id into v_id;
  if v_id is not null then
    return v_id;
  end if;

  insert into public.customers (email, full_name, auth_user_id)
  values (lower(p_email), nullif(p_full_name, ''), p_user_id)
  on conflict do nothing
  returning id into v_id;
  return v_id;
end $$;

revoke all on function public.link_customer_to_auth_user(uuid, text, text) from public, anon, authenticated;

create function public.handle_auth_user_confirmed() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.email_confirmed_at is not null and new.email is not null then
    begin
      perform public.link_customer_to_auth_user(new.id, new.email, new.raw_user_meta_data ->> 'full_name');
    exception when others then
      -- Never block a sign-up or confirmation; checkout links the customer as a fallback.
      raise warning 'link_customer_to_auth_user failed for %: %', new.id, sqlerrm;
    end;
  end if;
  return new;
end $$;

revoke all on function public.handle_auth_user_confirmed() from public, anon, authenticated;

create trigger on_auth_user_confirmed
  after insert or update of email_confirmed_at on auth.users
  for each row execute function public.handle_auth_user_confirmed();

-- Link users who already confirmed before this migration.
select public.link_customer_to_auth_user(u.id, u.email, u.raw_user_meta_data ->> 'full_name')
from auth.users u
where u.email_confirmed_at is not null and u.email is not null
  and not exists (select 1 from public.customers c where c.auth_user_id = u.id);
