-- Kept in its own file: a new enum value cannot be used in the transaction that adds it.
alter type public.publish_status add value if not exists 'archived';
alter type public.order_status add value if not exists 'processing';
alter type public.order_status add value if not exists 'shipped';
alter type public.order_status add value if not exists 'delivered';
alter type public.order_status add value if not exists 'returned';
