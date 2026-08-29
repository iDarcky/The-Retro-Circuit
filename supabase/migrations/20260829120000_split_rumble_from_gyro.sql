-- Rumble is not gyro.
--
-- `has_gyro` (motion sensing) already lived on variant_input_profile, but rumble had no
-- structured home at all: it sat in the free-text `console_variants.haptics` column, which
-- is on the drop list. That column turned out to be a boolean wearing a string costume --
-- 'true'/'True'/'Yes' (117) and 'false' (109) -- plus four rows where an importer pasted the
-- system-button list into it.
--
-- So: give rumble its own boolean next to the gyro one, backfill from the strings, and
-- rescue the four mis-filed rows into the column they were meant for.

alter table public.variant_input_profile
  add column if not exists has_rumble boolean;

comment on column public.variant_input_profile.has_rumble is
  'Vibration / force feedback. Distinct from has_gyro, which is motion sensing.';

-- Rescue first, so the button text is not lost when `haptics` is eventually dropped.
update public.variant_input_profile p
set    system_buttons_text = v.haptics
from   public.console_variants v
where  p.variant_id = v.id
  and  v.haptics ilike '%steam%'
  and  coalesce(p.system_buttons_text, '') = '';

update public.variant_input_profile p
set    has_rumble = case
         when lower(trim(v.haptics)) in ('true', 'yes', 'y', '1') then true
         when lower(trim(v.haptics)) in ('false', 'no', 'n', '0') then false
       end
from   public.console_variants v
where  p.variant_id = v.id
  and  p.has_rumble is null
  and  lower(trim(coalesce(v.haptics, ''))) in ('true', 'yes', 'y', '1', 'false', 'no', 'n', '0');
