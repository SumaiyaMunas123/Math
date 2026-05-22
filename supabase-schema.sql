create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null unique,
  contact_number text not null default '',
  role text not null default 'user' check (role in ('admin', 'user')),
  content_access boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, contact_number, role, content_access)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'contact_number', ''),
    'user',
    false
  )
  on conflict (id) do update
  set full_name = excluded.full_name,
      email = excluded.email,
      contact_number = excluded.contact_number,
      updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

create or replace function public.has_content_access()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and (p.role = 'admin' or p.content_access = true)
  );
$$;

drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Admins can read all profiles" on public.profiles;
drop policy if exists "Admins can manage profiles" on public.profiles;

create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id or public.is_admin());

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

create policy "Admins can read all profiles"
on public.profiles
for select
to authenticated
using (public.is_admin());

create policy "Admins can manage profiles"
on public.profiles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create table if not exists public.topic_recordings (
  id uuid primary key default gen_random_uuid(),
  grade_id text not null,
  topic_id text not null,
  title text not null,
  video_url text not null,
  preview_text text default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.topic_recordings enable row level security;

drop policy if exists "Unlocked users can read recordings" on public.topic_recordings;
drop policy if exists "Admins can manage recordings" on public.topic_recordings;

create policy "Unlocked users can read recordings"
on public.topic_recordings
for select
to authenticated
using (public.has_content_access());

create policy "Admins can manage recordings"
on public.topic_recordings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
