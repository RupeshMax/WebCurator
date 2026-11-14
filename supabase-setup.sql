-- Run this in Supabase SQL Editor

create table public.sites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  url text not null,
  title text not null default '',
  favicon text not null default '',
  tags text[] not null default '{}',
  notes text not null default '',
  collection text not null default 'default',
  visit_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- Row Level Security: users can only see their own sites
alter table public.sites enable row level security;

create policy "Users can manage their own sites"
  on public.sites
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
