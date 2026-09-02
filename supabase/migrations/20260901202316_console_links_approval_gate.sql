-- Imported links are not publishable by default.
--
-- The 1,332 console_links rows came from a spreadsheet: 821 video reviews pointing at
-- other people's channels, 433 vendor links, 78 written reviews. None of it was chosen,
-- it was inherited, and it was rendering on live product pages. Nothing from an import
-- should reach a reader before a person has looked at it.
--
-- Default false so a future import is quarantined the same way. The admin sets it true
-- one row at a time, at /admin/links.

alter table public.console_links
  add column if not exists approved boolean not null default false,
  add column if not exists approved_at timestamptz;

comment on column public.console_links.approved is
  'A person has greenlit this link for public display. Imports default to false.';

create index if not exists console_links_approved_idx
  on public.console_links (console_id, approved);
