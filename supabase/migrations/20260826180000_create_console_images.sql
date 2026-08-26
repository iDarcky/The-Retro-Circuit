-- Gallery images for console detail pages.
--
-- consoles.image_url stays the single cover shot used in listings; this table holds the
-- additional shots (front / back / ports / in-hand). alt_text is a first-class column
-- because it is what makes an image rank in Google Images — without a dedicated field
-- it never gets written.

create table if not exists public.console_images (
  id          uuid primary key default gen_random_uuid(),
  console_id  uuid not null references public.consoles(id) on delete cascade,
  url         text not null,
  alt_text    text,
  kind        text check (kind in ('front','back','side','ports','in_hand','screen','detail','other')),
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists console_images_console_id_sort_idx
  on public.console_images (console_id, sort_order);

alter table public.console_images enable row level security;

-- Public read is limited to images whose parent console is actually published, matching
-- how every other public read is gated.
drop policy if exists "console_images public read" on public.console_images;
create policy "console_images public read"
  on public.console_images for select
  using (
    exists (
      select 1 from public.consoles c
      where c.id = console_images.console_id
        and c.status = 'published'
    )
  );

-- Writes are admin-only, consistent with the consoles table.
drop policy if exists "console_images admin write" on public.console_images;
create policy "console_images admin write"
  on public.console_images for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );
