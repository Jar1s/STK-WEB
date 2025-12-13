-- Notifications table
create table if not exists public.notifications (
  id serial primary key,
  text text,
  background_color text,
  background_gradient text,
  border_color text,
  text_color text,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Statistics table (single-row)
create table if not exists public.statistics (
  id int primary key default 1,
  performed_inspections int,
  years_experience_start int,
  satisfaction_percentage numeric,
  google_place_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Optional: Row Level Security
-- Uncomment if you use RLS; allow reads for anon, writes for service_role
-- alter table public.notifications enable row level security;
-- alter table public.statistics enable row level security;
-- create policy "notifications_select_active" on public.notifications
--   for select using (active = true);
-- create policy "notifications_write_service_role" on public.notifications
--   for all using (auth.jwt()->>'role' = 'service_role');
-- create policy "statistics_read" on public.statistics
--   for select using (true);
-- create policy "statistics_write_service_role" on public.statistics
--   for all using (auth.jwt()->>'role' = 'service_role');
