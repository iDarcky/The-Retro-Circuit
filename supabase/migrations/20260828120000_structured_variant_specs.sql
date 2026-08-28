-- Batch B, part 1 of 2: structure the spec columns that were free text.
--
-- WHY: the imported spreadsheet text is unfilterable and inconsistent. Cooling has
-- 40 spellings for what is really three facts ("Active" 86, "Heatsink Fan Ventilation
-- cutouts" 35, "PAssive" 1). Audio has 48 spellings of count + config + placement
-- ("Dual Stereo Front facing", "Stereo Front Firing", "Dual Front-Facing",
-- "DUal Bottom Facing"). `ports` carries the charge port for most rows. `microsd_type`
-- was created for UHS speed class but the import filled it with slot counts.
--
-- SAFETY: purely additive — ADD COLUMN IF NOT EXISTS plus a backfill of the new
-- columns only. No existing column is altered or dropped; the free-text originals stay
-- as the source of truth until the drops in part 2. Back up before applying.
--
-- Text + CHECK rather than Postgres enums: these vocabularies will grow as new hardware
-- lands, and adding a value must not need an ALTER TYPE and a deploy.

-- 1. COOLING -----------------------------------------------------------------------
alter table public.console_variants
  add column if not exists cooling_type          text,
  add column if not exists cooling_fan_count     smallint,
  add column if not exists cooling_heatsink      boolean,
  add column if not exists cooling_heatpipe      boolean,
  add column if not exists cooling_vapor_chamber boolean,
  add column if not exists cooling_vents         boolean;

do $$ begin
  alter table public.console_variants
    add constraint console_variants_cooling_type_check
    check (cooling_type is null or cooling_type in ('passive', 'active', 'hybrid'));
exception when duplicate_object then null; end $$;

comment on column public.console_variants.cooling_solution is
  'Free-text notes for unusual cooling only. The structured cooling_* columns are canonical.';

-- 2. AUDIO -------------------------------------------------------------------------
alter table public.console_variants
  add column if not exists speaker_count     smallint,
  add column if not exists speaker_config    text,
  add column if not exists speaker_placement text;

do $$ begin
  alter table public.console_variants
    add constraint console_variants_speaker_config_check
    check (speaker_config is null or speaker_config in ('mono', 'stereo', 'surround'));
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.console_variants
    add constraint console_variants_speaker_placement_check
    check (speaker_placement is null or speaker_placement in
      ('front', 'bottom', 'rear', 'top', 'side', 'front_side', 'internal'));
exception when duplicate_object then null; end $$;

-- 3. CHARGE PORT -------------------------------------------------------------------
-- Lives beside the battery, not in the I/O list: it is the fact you reach for when
-- filling in charging speed. `ports` keeps the full physical I/O list.
alter table public.console_variants
  add column if not exists charge_port          text,
  add column if not exists charge_port_count    smallint,
  add column if not exists charge_port_position text;

do $$ begin
  alter table public.console_variants
    add constraint console_variants_charge_port_check
    check (charge_port is null or charge_port in
      ('usb_c', 'micro_usb', 'mini_usb', 'barrel_dc', 'proprietary', 'none'));
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.console_variants
    add constraint console_variants_charge_port_position_check
    check (charge_port_position is null or charge_port_position in
      ('top', 'bottom', 'side', 'back', 'multiple'));
exception when duplicate_object then null; end $$;

-- 4. STORAGE EXPANSION -------------------------------------------------------------
alter table public.console_variants
  add column if not exists expansion_slot_count  smallint,
  add column if not exists expansion_card_type   text,
  add column if not exists expansion_speed_class text;

do $$ begin
  alter table public.console_variants
    add constraint console_variants_expansion_card_type_check
    check (expansion_card_type is null or expansion_card_type in
      ('microsd', 'sd', 'memory_stick', 'cfexpress', 'proprietary'));
exception when duplicate_object then null; end $$;

comment on column public.console_variants.expansion_speed_class is
  'UHS-I / UHS-II etc. This is what microsd_type was meant to hold before the import put slot counts in it.';

-- 5. SCREEN LENS -------------------------------------------------------------------
alter table public.console_variants
  add column if not exists lens_material text,
  add column if not exists lens_laminated boolean;

do $$ begin
  alter table public.console_variants
    add constraint console_variants_lens_material_check
    check (lens_material is null or lens_material in
      ('tempered_glass', 'gorilla_glass', 'plastic', 'none'));
exception when duplicate_object then null; end $$;

-- 6. SILICON IDENTITY --------------------------------------------------------------
-- Vendor was inconsistently prefixed ("Snapdragon 8 Gen 2" vs "Qualcomm Snapdragon
-- G3x Gen 2", "Helio G99" with no MediaTek). Splitting it makes "all Snapdragon
-- devices" a real filter. Generation matters more than clock for ranking: a 2.0 GHz
-- Gen 8 part beats a 3.0 GHz Gen 1 part.
alter table public.console_variants
  add column if not exists soc_vendor text,
  add column if not exists soc_name   text,
  add column if not exists soc_gen    text,
  add column if not exists gpu_vendor text,
  add column if not exists gpu_name   text;

-- 7. CPU CLUSTERS ------------------------------------------------------------------
-- "Cortex-A76 / Cortex-A55  2x / 6x" interleaves two facts and reads as neither.
-- Shape: [{"count": 2, "core": "Cortex-A78", "clock_mhz": 2400, "uarch_year": 2020}]
alter table public.console_variants
  add column if not exists cpu_clusters jsonb;

do $$ begin
  alter table public.console_variants
    add constraint console_variants_cpu_clusters_is_array
    check (cpu_clusters is null or jsonb_typeof(cpu_clusters) = 'array');
exception when duplicate_object then null; end $$;

comment on column public.console_variants.cpu_clusters is
  'Ordered big-to-little core clusters: [{count, core, clock_mhz, uarch_year}]. Rendered one line each.';

-- 8. SECOND SCREEN — mirror the primary panel ---------------------------------------
alter table public.console_variants
  add column if not exists second_screen_display_type text,
  add column if not exists second_screen_tech         text,
  add column if not exists second_screen_lens         text;

-- 9. INDEXES for the new public filters ---------------------------------------------
create index if not exists idx_console_variants_soc_vendor   on public.console_variants (soc_vendor);
create index if not exists idx_console_variants_charge_port  on public.console_variants (charge_port);
create index if not exists idx_console_variants_cooling_type on public.console_variants (cooling_type);
