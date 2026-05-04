-- purchases
create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text,
  stripe_session_id text unique not null,
  stripe_payment_intent text,
  payment_method text,
  product_id text not null default 'the-longest-flight',
  amount_paid integer not null,
  currency text not null default 'usd',
  country text,
  download_token uuid unique not null default gen_random_uuid(),
  token_expires_at timestamptz not null,
  download_count integer not null default 0,
  max_downloads integer not null default 5,
  last_download_at timestamptz,
  email_sent boolean not null default false,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
alter table public.purchases enable row level security;
create index purchases_email_idx on public.purchases(email);
create index purchases_token_idx on public.purchases(download_token);

-- leads
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text,
  created_at timestamptz not null default now()
);
alter table public.leads enable row level security;

-- private ebooks bucket
insert into storage.buckets (id, name, public)
values ('ebooks', 'ebooks', false)
on conflict (id) do nothing;
-- No storage policies = service role only access (which is what we want).