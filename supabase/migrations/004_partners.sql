-- Partners table for logos/links in hero carousel
create table if not exists public.partners (
  id serial primary key,
  name text not null,
  logo_url text,
  link text,
  sort_order int default 0,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Optional RLS (uncomment if you use row level security)
-- alter table public.partners enable row level security;
-- create policy "partners_public_active" on public.partners
--   for select using (active = true);
-- create policy "partners_write_service_role" on public.partners
--   for all using (auth.jwt()->>'role' = 'service_role');
