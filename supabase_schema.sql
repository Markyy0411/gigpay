-- 1. Create a profiles table that links to auth.users
create table public.profiles (
  id uuid references auth.users(id) primary key,
  role text not null check (role in ('client', 'freelancer')),
  display_name text,
  bio text,
  company_name text,
  portfolio_url text,
  is_kyc_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can update their own profile." on public.profiles for update using (auth.uid() = id);

-- Trigger to automatically create a profile on signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, display_name)
  values (new.id, new.raw_user_meta_data->>'role', new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Drop the old tasks table and recreate with proper UUID references
drop table if exists public.tasks;

create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  amount numeric not null,
  status text not null default 'Available',
  freelancer_id uuid references public.profiles(id),
  client_id uuid references public.profiles(id) not null,
  contract_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable strict RLS on tasks
alter table public.tasks enable row level security;

-- Anyone authenticated can view all tasks
create policy "Authenticated users can view tasks"
  on public.tasks for select
  to authenticated
  using (true);

-- Only clients can insert tasks
create policy "Clients can create tasks"
  on public.tasks for insert
  to authenticated
  with check (auth.uid() = client_id and exists (select 1 from public.profiles where id = auth.uid() and role = 'client'));

-- Clients can update their own tasks (e.g. mark Completed), freelancers can update tasks they accepted
create policy "Clients and Freelancers can update their tasks"
  on public.tasks for update
  to authenticated
  using (
    auth.uid() = client_id or 
    (auth.uid() = freelancer_id) or 
    (status = 'Available' and exists (select 1 from public.profiles where id = auth.uid() and role = 'freelancer'))
  );
