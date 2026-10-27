-- Splash schema + row-level security.
-- Privacy rule: swimmer details are readable by instructors only, enforced here (not just in the UI).

-- ── Public program data (any signed-in user) ──────────────────────────────

create table public.locations (
  id text primary key,
  name text not null,
  short_name text not null,
  address text not null,
  pool_note text not null
);

create table public.instructors (
  id text primary key,
  name text not null,
  location_id text not null references public.locations (id),
  years_experience int not null,
  teaching_interests text[] not null default '{}',
  availability text not null
);

create table public.class_slots (
  id text primary key,
  location_id text not null references public.locations (id),
  weekday smallint not null check (weekday between 0 and 6), -- 0 = Sunday
  start_time time not null,
  end_time time not null,
  starts_on date not null, -- session start; class repeats weekly until ends_on
  ends_on date not null
);

-- ── Swimmer data (restricted) ─────────────────────────────────────────────

create table public.swimmers (
  id text primary key,
  display_name text not null,
  location_id text not null references public.locations (id),
  class_slot_id text not null references public.class_slots (id),
  pool text not null check (pool in ('Instructional pool', 'Lap pool'))
);

create table public.swimmer_instructors (
  swimmer_id text not null references public.swimmers (id) on delete cascade,
  instructor_id text not null references public.instructors (id),
  primary key (swimmer_id, instructor_id)
);

create table public.swimmer_profiles (
  swimmer_id text primary key references public.swimmers (id) on delete cascade,
  condition text not null,
  nonverbal text not null,
  considerations text not null,
  years_with_snapkids int not null,
  session_focus text not null,
  past_instructors text not null
);

-- ── User profiles ─────────────────────────────────────────────────────────

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  role text check (role in ('instructor', 'family')), -- null until onboarding
  swimmer_id text references public.swimmers (id), -- families only
  created_at timestamptz not null default now()
);

-- Create a profile row for every new sign-in.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Helpers used by policies (security definer avoids recursive RLS) ──────

create function public.is_instructor() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'instructor');
$$;

create function public.my_swimmer_id() returns text
language sql stable security definer set search_path = '' as $$
  select swimmer_id from public.profiles where id = auth.uid() and role = 'family';
$$;

-- ── Row-level security ────────────────────────────────────────────────────

alter table public.locations enable row level security;
alter table public.instructors enable row level security;
alter table public.class_slots enable row level security;
alter table public.swimmers enable row level security;
alter table public.swimmer_instructors enable row level security;
alter table public.swimmer_profiles enable row level security;
alter table public.profiles enable row level security;

create policy "signed-in users read locations" on public.locations
  for select to authenticated using (true);
create policy "signed-in users read instructors" on public.instructors
  for select to authenticated using (true);
create policy "signed-in users read class slots" on public.class_slots
  for select to authenticated using (true);

create policy "instructors read all swimmers; families read their own" on public.swimmers
  for select to authenticated using (public.is_instructor() or id = public.my_swimmer_id());
create policy "instructors read all pairings; families read their own" on public.swimmer_instructors
  for select to authenticated using (public.is_instructor() or swimmer_id = public.my_swimmer_id());
create policy "only instructors read swimmer profiles" on public.swimmer_profiles
  for select to authenticated using (public.is_instructor());

-- Users read their own profile. No insert/update/delete policies: role and swimmer
-- changes go through server actions that use the service role key.
create policy "users read own profile" on public.profiles
  for select to authenticated using (id = auth.uid());

-- ── Narrow functions families may call (no names or medical details) ──────

-- Sign-up pick list: which swimmer is yours?
create function public.swimmer_choices()
returns table (id text, display_name text, location_id text)
language sql stable security definer set search_path = '' as $$
  select s.id, s.display_name, s.location_id from public.swimmers s
  where auth.uid() is not null
  order by s.location_id, s.display_name;
$$;

-- Calendar class detail: swimmer counts per pool.
create function public.class_pool_counts(slot_id text)
returns table (pool text, swimmer_count int)
language sql stable security definer set search_path = '' as $$
  select s.pool, count(*)::int from public.swimmers s
  where s.class_slot_id = slot_id and auth.uid() is not null
  group by s.pool;
$$;

-- Calendar class detail: which instructors teach this class.
create function public.class_instructor_ids(slot_id text)
returns table (instructor_id text)
language sql stable security definer set search_path = '' as $$
  select distinct si.instructor_id from public.swimmer_instructors si
  join public.swimmers s on s.id = si.swimmer_id
  where s.class_slot_id = slot_id and auth.uid() is not null;
$$;

-- Lock helper functions down to signed-in users.
revoke execute on function public.is_instructor(), public.my_swimmer_id(),
  public.swimmer_choices(), public.class_pool_counts(text), public.class_instructor_ids(text)
  from public, anon;
grant execute on function public.is_instructor(), public.my_swimmer_id(),
  public.swimmer_choices(), public.class_pool_counts(text), public.class_instructor_ids(text)
  to authenticated;

-- Table privileges: signed-in users may only read (RLS then filters rows); anonymous visitors get nothing.
revoke all on public.locations, public.instructors, public.class_slots, public.swimmers,
  public.swimmer_instructors, public.swimmer_profiles, public.profiles from anon, authenticated;
grant select on public.locations, public.instructors, public.class_slots, public.swimmers,
  public.swimmer_instructors, public.swimmer_profiles, public.profiles to authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
