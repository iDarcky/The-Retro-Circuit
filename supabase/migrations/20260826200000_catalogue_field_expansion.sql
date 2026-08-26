-- Fields the v3/v4 spreadsheets carry that had nowhere to go, plus the editorial
-- scores and link storage discussed in docs/DATA_MAPPING.md.

-- 1. VARIANT SPECS ---------------------------------------------------------
alter table public.console_variants
  add column if not exists microsd_type      text,   -- UHS-I / UHS-II — a real buying factor
  add column if not exists screen_lens       text,   -- sheet col 41
  add column if not exists sensors           text,   -- sheet col 55; the gyro boolean stays
  add column if not exists performance_grade text,   -- sheet col 6 ("Performance Rating")
  -- The sheet's price column is an AVERAGE street price, not a launch price. Kept separate
  -- rather than renamed so genuine launch prices already recorded are not relabelled.
  add column if not exists price_avg_usd     numeric;

comment on column public.console_variants.price_avg_usd is
  'Average street price from the source spreadsheet. Prefer over price_launch_usd for display.';

-- 2. RELEASE STATUS --------------------------------------------------------
-- Distinct from consoles.status (draft/published), which is editorial workflow.
do $$ begin
  create type release_status as enum ('released', 'upcoming', 'rumoured', 'discontinued');
exception when duplicate_object then null; end $$;

alter table public.consoles
  add column if not exists release_status release_status not null default 'released',
  add column if not exists price_tier     text,             -- sheet col 71
  add column if not exists pros           text[],           -- sheet col 77
  add column if not exists cons           text[],           -- sheet col 78
  -- Editorial, hand-scored: nothing in the spreadsheet supplies these.
  add column if not exists setup_ease     numeric(3,1) check (setup_ease     is null or (setup_ease     between 0 and 10)),
  add column if not exists community_score numeric(3,1) check (community_score is null or (community_score between 0 and 10));

-- Anything dated in the future is not out yet.
update public.consoles c
set release_status = 'upcoming'
where c.release_status = 'released'
  and exists (
    select 1 from public.console_variants v
    where v.console_id = c.id and v.release_date > current_date
  );

-- 3. LINKS -----------------------------------------------------------------
-- One table covers sheet columns 64-68 (video reviews), 69 (written review)
-- and 72-76 (vendor links).
do $$ begin
  create type console_link_kind as enum ('video_review', 'written_review', 'vendor', 'official', 'other');
exception when duplicate_object then null; end $$;

create table if not exists public.console_links (
  id         uuid primary key default gen_random_uuid(),
  console_id uuid not null references public.consoles(id) on delete cascade,
  kind       console_link_kind not null default 'other',
  url        text not null,
  label      text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists console_links_console_id_kind_idx
  on public.console_links (console_id, kind, sort_order);

alter table public.console_links enable row level security;

drop policy if exists "console_links public read" on public.console_links;
create policy "console_links public read"
  on public.console_links for select
  to anon
  using (exists (select 1 from public.consoles c
                 where c.id = console_links.console_id and c.status = 'published'));

drop policy if exists "console_links admin all" on public.console_links;
create policy "console_links admin all"
  on public.console_links for all
  to authenticated
  using ((select auth.uid()) in (select id from public.profiles where role = 'admin'))
  with check ((select auth.uid()) in (select id from public.profiles where role = 'admin'));
