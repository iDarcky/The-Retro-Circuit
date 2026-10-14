-- NOT YET APPLIED. Waiting on the owner's go-ahead.
--
-- 2026-10-14 cleanup from the database review. Additive rules plus two small removals.
-- Every CHECK below was verified against live data first: no current row violates one.

-- 1. updated_at on the tables that lacked it, using the trigger consoles already uses.
alter table public.console_variants add column if not exists updated_at timestamptz not null default now();
alter table public.manufacturer     add column if not exists updated_at timestamptz not null default now();
alter table public.console_images   add column if not exists updated_at timestamptz not null default now();
alter table public.console_links    add column if not exists updated_at timestamptz not null default now();
create trigger update_console_variants_modtime before update on public.console_variants
  for each row execute function public.update_modified_column();
create trigger update_manufacturer_modtime before update on public.manufacturer
  for each row execute function public.update_modified_column();
create trigger update_console_images_modtime before update on public.console_images
  for each row execute function public.update_modified_column();
create trigger update_console_links_modtime before update on public.console_links
  for each row execute function public.update_modified_column();

-- 2. Values that can never be valid.
alter table public.console_variants
  add constraint chk_price_launch_nonneg check (price_launch_usd is null or price_launch_usd >= 0),
  add constraint chk_price_avg_nonneg    check (price_avg_usd is null or price_avg_usd >= 0),
  add constraint chk_ram_nonneg          check (ram_mb is null or ram_mb >= 0),
  add constraint chk_weight_pos          check (weight_g is null or weight_g > 0),
  add constraint chk_battery_nonneg      check (battery_capacity_mah is null or battery_capacity_mah >= 0),
  add constraint chk_screen_pos          check (screen_size_inch is null or screen_size_inch > 0);
alter table public.consoles
  add constraint chk_device_category
  check (device_category is null or device_category in ('emulation', 'pc_gaming', 'fpga', 'legacy'));

-- 3. Uniqueness. One console_links row was imported twice (same console, same URL, same
-- timestamp, both unapproved); keep one.
delete from public.console_links a
  using public.console_links b
  where a.console_id = b.console_id and a.url = b.url and a.id > b.id;
alter table public.console_links add constraint console_links_console_url_key unique (console_id, url);
-- Arena and configuration URLs are built from (console, variant slug).
alter table public.console_variants add constraint console_variants_console_slug_key unique (console_id, slug);

-- 4. Duplicate index: the primary key already covers variant_id.
alter table public.variant_input_profile drop constraint if exists variant_input_profile_variant_id_key;

-- 5. consoles.setup_ease is empty on all rows and read by nothing; setup_ease_score holds the data.
alter table public.consoles drop column if exists setup_ease;

-- 6. Launch prices as money, like price_avg_usd.
alter table public.console_variants alter column price_launch_usd type numeric(10,2);

-- 7. Consoles with variants but no default: the page already falls back to a variant;
-- make the earliest-created one the explicit default.
update public.console_variants v set is_default = true
where v.id in (
  select distinct on (console_id) id from public.console_variants
  where console_id in (
    select console_id from public.console_variants group by console_id
    having not bool_or(coalesce(is_default, false)))
  order by console_id, created_at, id);
