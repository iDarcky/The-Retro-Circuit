-- Gaps found while publishing the catalogue by hand.

-- Port position is not one value: several devices charge on the bottom and carry a
-- second port on top. Keep the singular column as a display fallback, read the array.
alter table public.console_variants
  add column if not exists charge_port_positions text[];

update public.console_variants
set charge_port_positions = array[charge_port_position]
where charge_port_position is not null
  and charge_port_position not in ('multiple', '')
  and charge_port_positions is null;

-- Storage in whole GB cannot express 512 MB (SF2000 class) or 2 TB (PC handhelds).
-- Mirror ram_mb and make MB the stored unit; storage_gb stays until the UI is migrated.
alter table public.console_variants
  add column if not exists storage_mb bigint;

update public.console_variants
set storage_mb = storage_gb::bigint * 1024
where storage_gb is not null and storage_gb > 0 and storage_mb is null;

-- Headphone jack has a position for the same reason the charge port does.
alter table public.console_variants
  add column if not exists headphone_jack_position text;

-- GPU clocks boost like CPU clocks do. gpu_clock_mhz keeps its meaning as the max.
alter table public.console_variants
  add column if not exists gpu_clock_min_mhz integer;

-- Miyoo Mini and the Anbernic SP line take a removable pack.
alter table public.console_variants
  add column if not exists battery_swappable boolean;

-- Dual boot: the Odin ships Android and takes Windows, GPD ships Windows and takes
-- Linux. One os_family cannot say that, and free text is not filterable.
alter table public.console_variants
  add column if not exists os_secondary_family public.os_family,
  add column if not exists os_secondary_version text;

comment on column public.console_variants.charge_port_positions is
  'All positions a charge port appears in. Supersedes charge_port_position.';
comment on column public.console_variants.storage_mb is
  'Base internal storage in MB. Supersedes storage_gb, which cannot hold sub-GB or TB.';
comment on column public.console_variants.gpu_clock_mhz is
  'Maximum / boost GPU clock. gpu_clock_min_mhz holds the base clock.';
comment on column public.console_variants.os_secondary_family is
  'Second bootable OS where the device ships or officially supports dual boot.';
