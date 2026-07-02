create extension if not exists pgcrypto;

create schema if not exists private;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'client' check (role in ('client', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'client' check (role in ('client', 'admin')),
  created_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

create table if not exists public.logo_votes (
  project_id uuid not null,
  user_id uuid not null,
  logo_id text not null,
  vote smallint not null check (vote in (-1, 1)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (project_id, user_id, logo_id),
  foreign key (project_id, user_id)
    references public.project_members(project_id, user_id)
    on delete cascade,
  foreign key (user_id)
    references public.profiles(id)
    on delete cascade
);

create index if not exists project_members_user_id_idx
  on public.project_members(user_id);

create index if not exists logo_votes_project_logo_id_idx
  on public.logo_votes(project_id, logo_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update
    set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists logo_votes_set_updated_at on public.logo_votes;
create trigger logo_votes_set_updated_at
before update on public.logo_votes
for each row execute function public.set_updated_at();

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

create or replace function private.is_project_member(p_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.project_members pm
    where pm.project_id = p_project_id
      and pm.user_id = auth.uid()
  );
$$;

revoke all on schema private from public;
grant usage on schema private to authenticated;
revoke all on function private.is_admin() from public, anon, authenticated;
revoke all on function private.is_project_member(uuid) from public, anon, authenticated;
grant execute on function private.is_admin() to authenticated;
grant execute on function private.is_project_member(uuid) to authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.set_updated_at() from public, anon, authenticated;

alter table public.projects enable row level security;
alter table public.profiles enable row level security;
alter table public.project_members enable row level security;
alter table public.logo_votes enable row level security;

drop policy if exists "projects readable by members and admins" on public.projects;
create policy "projects readable by members and admins"
on public.projects for select
to authenticated
using (private.is_admin() or private.is_project_member(id));

drop policy if exists "profiles readable by self and admins" on public.profiles;
create policy "profiles readable by self and admins"
on public.profiles for select
to authenticated
using (id = (select auth.uid()) or private.is_admin());

drop policy if exists "admins manage profiles" on public.profiles;
create policy "admins manage profiles"
on public.profiles for update
to authenticated
using (private.is_admin())
with check (private.is_admin());

drop policy if exists "memberships readable by self and admins" on public.project_members;
create policy "memberships readable by self and admins"
on public.project_members for select
to authenticated
using (user_id = (select auth.uid()) or private.is_admin());

drop policy if exists "admins insert memberships" on public.project_members;
create policy "admins insert memberships"
on public.project_members for insert
to authenticated
with check (private.is_admin());

drop policy if exists "admins update memberships" on public.project_members;
create policy "admins update memberships"
on public.project_members for update
to authenticated
using (private.is_admin())
with check (private.is_admin());

drop policy if exists "admins delete memberships" on public.project_members;
create policy "admins delete memberships"
on public.project_members for delete
to authenticated
using (private.is_admin());

drop policy if exists "votes readable by owner and admins" on public.logo_votes;
create policy "votes readable by owner and admins"
on public.logo_votes for select
to authenticated
using (user_id = (select auth.uid()) or private.is_admin());

drop policy if exists "clients insert own votes" on public.logo_votes;
create policy "clients insert own votes"
on public.logo_votes for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and private.is_project_member(project_id)
);

drop policy if exists "clients update own votes" on public.logo_votes;
create policy "clients update own votes"
on public.logo_votes for update
to authenticated
using (
  user_id = (select auth.uid())
  and private.is_project_member(project_id)
)
with check (
  user_id = (select auth.uid())
  and private.is_project_member(project_id)
);

drop policy if exists "clients delete own votes" on public.logo_votes;
create policy "clients delete own votes"
on public.logo_votes for delete
to authenticated
using (
  user_id = (select auth.uid())
  and private.is_project_member(project_id)
);

create or replace view public.logo_rankings
with (security_invoker = true)
as
select
  logo_votes.project_id,
  logo_votes.logo_id,
  coalesce(sum(logo_votes.vote), 0)::integer as total_score,
  count(*) filter (where logo_votes.vote = 1)::integer as upvotes,
  count(*) filter (where logo_votes.vote = -1)::integer as downvotes,
  count(*)::integer as total_votes
from public.logo_votes
where private.is_admin()
group by logo_votes.project_id, logo_votes.logo_id;

grant select on table public.projects to authenticated;
grant select, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.project_members to authenticated;
grant select, insert, update, delete on table public.logo_votes to authenticated;
grant select on table public.logo_rankings to authenticated;

insert into public.projects (id, name)
values ('00000000-0000-4000-8000-000000000001', 'EEG Branding Explorations')
on conflict (id) do nothing;
