-- Full Circle Formations — growth offers and free requests
-- Run this once in Supabase (SQL Editor > New query > paste > Run), after 0001_init.sql.

-- Group add-ons: "launch" (setup items) vs "growth" (business credit and free reviews).
alter table public.addon_prices add column if not exists grp text not null default 'launch'
  check (grp in ('launch', 'growth'));

insert into public.addon_prices (key, label, description, price_cents, kind, sort, grp) values
  ('business_credit', 'Business credit builder', 'Get started today. We build credit in your company''s name, separate from your SSN, and map your full plan on your strategy call.', 50000, 'addon', 50, 'growth'),
  ('funding_review', 'Funding readiness review', 'See what funding you could qualify for, and what to fix first.', 0, 'addon', 60, 'growth'),
  ('credit_review', 'Personal credit review', 'We go through your credit report and show you what''s holding your score back.', 0, 'addon', 70, 'growth'),
  ('protection_quote', 'Protection plan quote', 'Life insurance that protects your family and your business.', 0, 'addon', 80, 'growth')
on conflict (key) do nothing;

-- Orders that only contain free requests are saved as "requested" (no payment needed).
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check
  check (status in ('requested','awaiting_payment','paid','filed','approved','scorp_filed','complete','cancelled'));

-- Where each sign-up came from (e.g. the business credit card on the welcome screen).
alter table public.orders add column if not exists source text;
