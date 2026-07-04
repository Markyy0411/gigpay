-- Run this in the Supabase SQL Editor to create your database!

create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  amount numeric not null,
  status text not null default 'Available',
  freelancer text,
  client text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security (RLS) but allow anonymous access for the hackathon MVP
alter table public.tasks enable row level security;

create policy "Allow anonymous read access"
  on public.tasks for select
  to anon
  using (true);

create policy "Allow anonymous insert access"
  on public.tasks for insert
  to anon
  with check (true);

create policy "Allow anonymous update access"
  on public.tasks for update
  to anon
  using (true);
