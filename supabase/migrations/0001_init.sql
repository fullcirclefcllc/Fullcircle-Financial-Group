-- Full Circle Formations — database schema
-- Run this once in Supabase: SQL Editor > New query > paste > Run.

-- ───────── Profiles & roles ─────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  role text not null default 'client' check (role in ('client', 'admin')),
  created_at timestamptz not null default now()
);

-- Create a profile automatically for every new sign-up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- ───────── Prices (admin-editable) ─────────
create table if not exists public.addon_prices (
  key text primary key,
  label text not null,
  description text,
  price_cents integer,              -- null = quoted later, not charged at checkout
  kind text not null check (kind in ('package', 'addon')),
  sort integer not null default 0,
  active boolean not null default true
);

create table if not exists public.state_fees (
  code text primary key,            -- two-letter code
  name text not null,
  llc_fee_cents integer,            -- null = not set yet (shown as "confirmed after order")
  holding_allowed boolean not null default false
);

-- ───────── Orders ─────────
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  path text not null check (path in ('new_llc', 'holding', 'existing')),
  business_name text not null,
  business_purpose text,
  state text not null,
  members jsonb not null default '[]',
  management text not null default 'member',
  holding_state text,
  addons text[] not null default '{}',
  totals jsonb not null default '{}',
  total_cents integer not null default 0,
  contact_name text,
  contact_phone text,
  status text not null default 'awaiting_payment'
    check (status in ('awaiting_payment','paid','filed','approved','scorp_filed','complete','cancelled')),
  stripe_session_id text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_user_idx on public.orders(user_id);

create table if not exists public.order_status_history (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.guide_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  messages jsonb not null default '[]',
  updated_at timestamptz not null default now()
);

-- ───────── Row-level security ─────────
alter table public.profiles enable row level security;
alter table public.addon_prices enable row level security;
alter table public.state_fees enable row level security;
alter table public.orders enable row level security;
alter table public.order_status_history enable row level security;
alter table public.documents enable row level security;
alter table public.guide_conversations enable row level security;

-- Profiles: you see and edit yourself (but not your role); admins see everyone.
create policy "own profile read" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "own profile update" on public.profiles for update using (id = auth.uid())
  with check (id = auth.uid() and role = (select p.role from public.profiles p where p.id = auth.uid()));
create policy "admin profile update" on public.profiles for update using (public.is_admin());

-- Prices: anyone can read; only admins change.
create policy "prices read" on public.addon_prices for select using (true);
create policy "prices admin" on public.addon_prices for all using (public.is_admin()) with check (public.is_admin());
create policy "fees read" on public.state_fees for select using (true);
create policy "fees admin" on public.state_fees for all using (public.is_admin()) with check (public.is_admin());

-- Orders: clients read their own (created only by the server); admins do everything.
create policy "orders own read" on public.orders for select using (user_id = auth.uid() or public.is_admin());
create policy "orders admin write" on public.orders for all using (public.is_admin()) with check (public.is_admin());

create policy "history read" on public.order_status_history for select using (
  public.is_admin() or exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "history admin" on public.order_status_history for all using (public.is_admin()) with check (public.is_admin());

create policy "docs read" on public.documents for select using (user_id = auth.uid() or public.is_admin());
create policy "docs admin" on public.documents for all using (public.is_admin()) with check (public.is_admin());

create policy "guide own" on public.guide_conversations for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ───────── Private storage for filing documents ─────────
insert into storage.buckets (id, name, public) values ('documents', 'documents', false)
  on conflict (id) do nothing;
-- No storage policies: files are uploaded and served only through the server (signed links).

-- ───────── Seed prices ─────────
insert into public.addon_prices (key, label, description, price_cents, kind, sort) values
  ('llc_package', 'LLC formation', 'Articles filed for you, registered agent (first year), S-corp election, lifetime client portal', 19900, 'package', 1),
  ('holding_package', 'Holding company formation', 'Wyoming or Delaware holding company, built for privacy', 25000, 'package', 2),
  ('holding_addon', 'Wyoming holding company', 'Privacy layer that owns your LLC', 25000, 'addon', 10),
  ('expedite', 'Expedite', 'Move to the front of the line', 5000, 'addon', 20),
  ('identity_kit', 'Business identity kit', 'Domain, business email, phone and address', null, 'addon', 30),
  ('virtual_office', 'Virtual office', 'Professional mailing address', null, 'addon', 40)
on conflict (key) do nothing;

-- State list. Filing fees are left blank on purpose: enter each state's current
-- fee in the app's Admin > Prices screen (check the state's official site).
insert into public.state_fees (code, name, holding_allowed) values
  ('AL','Alabama',false),('AK','Alaska',false),('AZ','Arizona',false),('AR','Arkansas',false),
  ('CA','California',false),('CO','Colorado',false),('CT','Connecticut',false),('DE','Delaware',true),
  ('DC','District of Columbia',false),('FL','Florida',false),('GA','Georgia',false),('HI','Hawaii',false),
  ('ID','Idaho',false),('IL','Illinois',false),('IN','Indiana',false),('IA','Iowa',false),
  ('KS','Kansas',false),('KY','Kentucky',false),('LA','Louisiana',false),('ME','Maine',false),
  ('MD','Maryland',false),('MA','Massachusetts',false),('MI','Michigan',false),('MN','Minnesota',false),
  ('MS','Mississippi',false),('MO','Missouri',false),('MT','Montana',false),('NE','Nebraska',false),
  ('NV','Nevada',false),('NH','New Hampshire',false),('NJ','New Jersey',false),('NM','New Mexico',false),
  ('NY','New York',false),('NC','North Carolina',false),('ND','North Dakota',false),('OH','Ohio',false),
  ('OK','Oklahoma',false),('OR','Oregon',false),('PA','Pennsylvania',false),('RI','Rhode Island',false),
  ('SC','South Carolina',false),('SD','South Dakota',false),('TN','Tennessee',false),('TX','Texas',false),
  ('UT','Utah',false),('VT','Vermont',false),('VA','Virginia',false),('WA','Washington',false),
  ('WV','West Virginia',false),('WI','Wisconsin',false),('WY','Wyoming',true)
on conflict (code) do nothing;

-- After you sign up in the app, make yourself the admin (replace the email):
-- update public.profiles set role = 'admin' where email = 'Breyon@fullcircle-credit.com';
