-- Seed baseline roles/permissions for Dec Walls (run after migrations).

insert into roles (id, key, name) values
  ('11111111-1111-4111-8111-111111111111', 'super_admin', 'Super Admin')
on conflict (key) do nothing;

insert into permissions (key, description) values
  ('products.read', 'Read products'),
  ('products.write', 'Write products'),
  ('inventory.read', 'Read inventory'),
  ('inventory.write', 'Write inventory'),
  ('orders.read', 'Read orders'),
  ('orders.write', 'Write orders'),
  ('customers.read', 'Read customers'),
  ('customers.write', 'Write customers'),
  ('cms.read', 'Read CMS'),
  ('cms.write', 'Write CMS'),
  ('cms.publish', 'Publish CMS'),
  ('media.read', 'Read media'),
  ('media.write', 'Write media'),
  ('users.read', 'Read users'),
  ('users.write', 'Write users'),
  ('settings.read', 'Read settings'),
  ('settings.write', 'Write settings'),
  ('analytics.read', 'Read analytics')
on conflict (key) do nothing;
