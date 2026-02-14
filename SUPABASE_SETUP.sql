create extension if not exists pgcrypto;

create table if not exists public.play_sessions (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  is_admin_entry boolean not null default false,
  level_reached integer not null default 0,
  final_time_seconds integer,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.entry_attempts (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  was_successful boolean not null default false,
  is_admin_attempt boolean not null default false,
  attempted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.play_sessions enable row level security;
alter table public.entry_attempts enable row level security;

drop policy if exists "anon can insert sessions" on public.play_sessions;
drop policy if exists "anon can update sessions" on public.play_sessions;
drop policy if exists "anon can select sessions" on public.play_sessions;
drop policy if exists "anon can insert entry attempts" on public.entry_attempts;
drop policy if exists "anon can select entry attempts" on public.entry_attempts;

create policy "anon can insert sessions"
on public.play_sessions
for insert
to anon
with check (true);

create policy "anon can update sessions"
on public.play_sessions
for update
to anon
using (true)
with check (true);

create policy "anon can select sessions"
on public.play_sessions
for select
to anon
using (true);

create policy "anon can insert entry attempts"
on public.entry_attempts
for insert
to anon
with check (true);

create policy "anon can select entry attempts"
on public.entry_attempts
for select
to anon
using (true);
