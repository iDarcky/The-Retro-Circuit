-- Backfill of the columns added in 20260828120000_structured_variant_specs.sql,
-- derived entirely from the free-text originals. Re-runnable: every statement
-- recomputes from source columns that this migration never writes.
--
-- Applied to the remote project on 2026-08-28 as migration
-- `backfill_structured_variant_specs`.
--
-- Rows filled: cooling 247 · audio 372 · charge port 274 · expansion 472 ·
-- lens 231 · soc_vendor 411 · gpu_vendor 393 · soc_gen 68 · cpu_clusters 39.

update public.console_variants
set
  cooling_heatsink      = cooling_solution ilike '%heatsink%' or cooling_solution ilike '%heat sink%' or cooling_solution ilike '%radiator%',
  cooling_heatpipe      = cooling_solution ilike '%heatpipe%' or cooling_solution ilike '%heat pipe%',
  cooling_vapor_chamber = cooling_solution ilike '%vapor%',
  cooling_vents         = cooling_solution ilike '%vent%' or cooling_solution ilike '%intake%' or cooling_solution ilike '%exhaust%' or cooling_solution ilike '%cutout%',
  cooling_fan_count     = case
      when cooling_solution ilike '%dual fan%' or cooling_solution ilike '%2 fan%' or cooling_solution ilike '%two fan%' then 2
      when cooling_solution ilike '%fan%' then 1
      else 0
    end
where cooling_solution is not null and btrim(cooling_solution) <> '';

update public.console_variants
set cooling_type = case
    when cooling_solution ilike 'no' or cooling_solution ilike 'none' or cooling_solution ilike '%passive%' then 'passive'
    when coalesce(cooling_fan_count, 0) > 0 and (cooling_heatpipe or cooling_vapor_chamber) then 'hybrid'
    when coalesce(cooling_fan_count, 0) > 0 or cooling_solution ilike '%active%' then 'active'
    else 'passive'
  end
where cooling_solution is not null and btrim(cooling_solution) <> '';

-- Source typos are matched on purpose: "Botton", "Facin", "DUal", "Read facing".
update public.console_variants
set
  speaker_count = case
      when audio_speakers ilike '%quad%' or audio_speakers ilike '%4x%' then 4
      when audio_speakers ilike '%dual%' or audio_speakers ilike '%2-speaker%' or audio_speakers ilike '%2x%' then 2
      when audio_speakers ilike '%single%' or audio_speakers ilike '%mono%' or audio_speakers ilike '1x%' then 1
      when audio_speakers ilike '%stereo%' then 2
      else null
    end,
  speaker_config = case
      when audio_speakers ilike '%surround%' or audio_speakers ilike '%quad%' then 'surround'
      when audio_speakers ilike '%stereo%' then 'stereo'
      when audio_speakers ilike '%mono%' then 'mono'
      when audio_speakers ilike '%dual%' then 'stereo'
      when audio_speakers ilike '%single%' or audio_speakers ilike '1x%' then 'mono'
      else null
    end,
  speaker_placement = case
      when audio_speakers ilike '%front%' and (audio_speakers ilike '%side%' or audio_speakers ilike '%bottom%') then 'front_side'
      when audio_speakers ilike '%front%' then 'front'
      when audio_speakers ilike '%botto%' then 'bottom'
      when audio_speakers ilike '%rear%' or audio_speakers ilike '%read facing%' then 'rear'
      when audio_speakers ilike '%top%' or audio_speakers ilike '%upward%' then 'top'
      when audio_speakers ilike '%side%' then 'side'
      when audio_speakers ilike '%internal%' then 'internal'
      else null
    end
where audio_speakers is not null and btrim(audio_speakers) <> '';

update public.console_variants
set
  charge_port = case
      when ports ilike '%usb%c%' or ports ilike '%usc-c%' or ports ilike '%type-c%' or ports ilike '%type c%' then 'usb_c'
      when ports ilike '%micro%usb%' then 'micro_usb'
      when ports ilike '%mini%usb%' then 'mini_usb'
      when ports ilike '%barrel%' or ports ilike '%dc power%' then 'barrel_dc'
      when ports ilike '%proprietary%' or ports ilike '%ext port%' then 'proprietary'
      else null
    end,
  charge_port_count = case when ports ilike '%x3%' then 3 when ports ilike '%x2%' then 2 else 1 end,
  charge_port_position = case
      when ports ilike '%top%' and ports ilike '%bottom%' then 'multiple'
      when ports ilike '%top%'    then 'top'
      when ports ilike '%bottom%' then 'bottom'
      when ports ilike '%side%'   then 'side'
      else null
    end
where ports is not null and btrim(ports) <> '';

update public.console_variants
set
  expansion_slot_count = case
      when microsd_type ilike '%dual%' or microsd_type ilike '%2x%' then 2
      when microsd_type is not null and btrim(microsd_type) <> '' then 1
      when storage_expandable then 1
      else 0
    end,
  expansion_card_type = case
      when microsd_type ilike '%microsd%' then 'microsd'
      when microsd_type ilike '%memory stick%' then 'memory_stick'
      when microsd_type ilike '%cfexpress%' then 'cfexpress'
      when microsd_type ilike '%sd%' then 'sd'
      when storage_expandable then 'microsd'
      else null
    end,
  expansion_speed_class = nullif((regexp_match(coalesce(microsd_type, ''), '(UHS-[I]{1,3})', 'i'))[1], '');

update public.console_variants
set
  lens_material = case
      when screen_lens ilike '%gorilla%' then 'gorilla_glass'
      when screen_lens ilike '%tempered%' or screen_lens ilike '%temperated%' then 'tempered_glass'
      when screen_lens ilike '%plastic%' then 'plastic'
      when screen_lens ilike '%none%' then 'none'
      else null
    end,
  lens_laminated = case
      when screen_lens ilike '%laminat%' or screen_lens ilike '%oca%' then true
      when screen_lens is not null and btrim(screen_lens) <> '' then false
      else null
    end
where screen_lens is not null and btrim(screen_lens) <> '';

update public.console_variants
set soc_vendor = case
    when soc ilike '%snapdragon%' or soc ilike '%qualcomm%' then 'Qualcomm'
    when soc ilike '%helio%' or soc ilike '%dimensity%' or soc ilike '%mediatek%' then 'MediaTek'
    when soc ilike '%rockchip%' or soc ilike '%rk3%' then 'Rockchip'
    when soc ilike '%allwinner%' then 'Allwinner'
    when soc ilike '%amd%' or soc ilike '%ryzen%' then 'AMD'
    when soc ilike '%intel%' or soc ilike '%core i%' or soc ilike '%lunar lake%' or soc ilike '%panther lake%' then 'Intel'
    when soc ilike '%ingenic%' or soc ilike '%jz4%' then 'Ingenic'
    when soc ilike '%actions%' or soc ilike '%ats3%' then 'Actions Semiconductor'
    when soc ilike '%sigmastar%' or soc ilike '%ssd2%' then 'SigmaStar'
    when soc ilike '%broadcom%' or soc ilike '%bcm%' then 'Broadcom'
    when soc ilike '%samsung%' or soc ilike '%exynos%' then 'Samsung'
    when soc ilike '%apple%' then 'Apple'
    when soc ilike '%nvidia%' or soc ilike '%tegra%' then 'NVIDIA'
    else null
  end
where soc is not null and btrim(soc) <> '';

update public.console_variants
set
  soc_gen = nullif(btrim((regexp_match(soc, '(Gen\s*\d+)', 'i'))[1]), ''),
  soc_name = nullif(btrim(regexp_replace(
      regexp_replace(soc, '(?i)\m(qualcomm|mediatek|rockchip|allwinner|amd|intel|ingenic|actions semiconductor|actions|sigmastar|broadcom|samsung|apple|nvidia)\M', '', 'g'),
      '(?i)\s*Gen\s*\d+\s*$', '', 'g')), '')
where soc is not null and btrim(soc) <> '';

update public.console_variants
set
  gpu_vendor = case
      when gpu_model ilike '%adreno%' then 'Qualcomm'
      when gpu_model ilike '%mali%' or gpu_model ilike '%immortalis%' then 'ARM'
      when gpu_model ilike '%radeon%' or gpu_model ilike '%vega%' then 'AMD'
      when gpu_model ilike '%iris%' or gpu_model ilike '%intel%' or gpu_model ilike '%arc%' then 'Intel'
      when gpu_model ilike '%videocore%' or gpu_model ilike '%broadcom%' then 'Broadcom'
      when gpu_model ilike '%powervr%' then 'Imagination'
      when gpu_model ilike '%geforce%' or gpu_model ilike '%nvidia%' then 'NVIDIA'
      else null
    end,
  gpu_name = nullif(btrim(regexp_replace(gpu_model, '(?i)\m(qualcomm|amd|intel|broadcom|nvidia|arm)\M', '', 'g')), '')
where gpu_model is not null and btrim(gpu_model) <> '';

-- CPU clusters. A fixed regex mis-parsed the 3- and 4-cluster rows, so split the
-- trailing "1x / 3x / 4x" run off the end and pair it with the core list. Rows whose
-- two sides do not line up are left for manual entry rather than guessed at.
with parsed as (
  select id, cpu_model,
    btrim((regexp_match(cpu_model, '((?:\d+\s*[xX]\s*(?:[/,]\s*)?)+)\s*$'))[1]) tail
  from public.console_variants
  where cpu_model ~ '(?:\d+\s*[xX]\s*(?:[/,]\s*)?)+\s*$'
), split as (
  select id,
    regexp_split_to_array(btrim(left(cpu_model, length(cpu_model) - length(tail))), '\s*[/,]\s*') cores,
    regexp_split_to_array(btrim(tail), '\s*[/,]\s*') counts
  from parsed
), ok as (
  select id, cores, counts from split
  where array_length(cores, 1) = array_length(counts, 1) and array_length(cores, 1) between 2 and 6
), built as (
  select id, jsonb_agg(
      jsonb_build_object(
        'count', (regexp_replace(counts[i], '[^0-9]', '', 'g'))::int,
        'core',  btrim(cores[i]),
        'clock_mhz', null::int,
        'uarch_year', null::int
      ) order by i) clusters
  from ok, lateral generate_subscripts(cores, 1) i
  group by id
)
update public.console_variants v
set cpu_clusters = b.clusters
from built b
where v.id = b.id and v.cpu_clusters is null;
