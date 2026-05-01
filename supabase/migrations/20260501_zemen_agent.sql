create extension if not exists vector;

-- Update SITES table to include slug if not exists
alter table public.sites add column if not exists slug text unique;

-- AGENT MEMORY TABLE
create table if not exists public.agent_memory (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references public.sites(id) on delete cascade not null,
  content text not null,
  embedding vector(1536), -- nomic-embed-text size
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- AGENT ERRORS TABLE
create table if not exists public.agent_errors (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references public.sites(id) on delete cascade not null,
  agent_name text not null,
  error_message text not null,
  stack_trace text,
  input_context jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- EDIT HISTORY TABLE
create table if not exists public.edit_history (
  id uuid default uuid_generate_v4() primary key,
  site_id uuid references public.sites(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  change_description text not null,
  site_data_snapshot jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INDEXES
create index on public.agent_memory using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Vector Similarity Search Function
create or replace function match_agent_memory (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  p_business_id uuid
)
returns table (
  id uuid,
  content text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    agent_memory.id,
    agent_memory.content,
    1 - (agent_memory.embedding <=> query_embedding) as similarity
  from agent_memory
  where agent_memory.business_id = p_business_id
  and 1 - (agent_memory.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
end;
$$;

-- RLS POLICIES
alter table public.agent_memory enable row level security;
alter table public.agent_errors enable row level security;
alter table public.edit_history enable row level security;

create policy "Users can view their own business memory"
  on public.agent_memory for select
  using ( exists (select 1 from public.sites where id = business_id and user_id = auth.uid()) );

create policy "Users can view their own business errors"
  on public.agent_errors for select
  using ( exists (select 1 from public.sites where id = business_id and user_id = auth.uid()) );

create policy "Users can view their own site history"
  on public.edit_history for select
  using ( site_id in (select id from public.sites where user_id = auth.uid()) );
