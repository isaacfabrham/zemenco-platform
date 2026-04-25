-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS TABLE
create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  subscription_status text default 'inactive',
  plan_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SITES TABLE
create table if not exists public.sites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  template_type text not null,
  site_data jsonb not null default '{}'::jsonb,
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SUBSCRIPTIONS TABLE
create table if not exists public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  status text,
  plan text,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ONBOARDING SESSIONS TABLE
create table if not exists public.onboarding_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  template_type text not null,
  answers jsonb not null default '{}'::jsonb,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS
alter table public.users enable row level security;
alter table public.sites enable row level security;
alter table public.subscriptions enable row level security;
alter table public.onboarding_sessions enable row level security;

-- Users policies
create policy "Users can view their own data"
  on public.users for select
  using ( auth.uid() = id );

create policy "Users can update their own data"
  on public.users for update
  using ( auth.uid() = id );

-- Sites policies
create policy "Users can view their own sites"
  on public.sites for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own sites"
  on public.sites for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own sites"
  on public.sites for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own sites"
  on public.sites for delete
  using ( auth.uid() = user_id );

-- Subscriptions policies (Users can only read their subscriptions)
create policy "Users can view their own subscriptions"
  on public.subscriptions for select
  using ( auth.uid() = user_id );

-- Onboarding Sessions policies
create policy "Users can view their own onboarding sessions"
  on public.onboarding_sessions for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own onboarding sessions"
  on public.onboarding_sessions for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own onboarding sessions"
  on public.onboarding_sessions for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own onboarding sessions"
  on public.onboarding_sessions for delete
  using ( auth.uid() = user_id );

-- Create trigger to automatically insert into public.users when auth.user is created
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
