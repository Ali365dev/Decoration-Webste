-- Removes the trigger and functions. Links already written to customers.auth_user_id are kept:
-- they are customer data, and clearing them would hide those customers' own records from them.
drop trigger if exists on_auth_user_confirmed on auth.users;
drop function if exists public.handle_auth_user_confirmed();
drop function if exists public.link_customer_to_auth_user(uuid, text, text);
