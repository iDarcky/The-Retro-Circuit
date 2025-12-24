-- Migration: Refactor CPU Clock to Min/Max Range
-- Renames cpu_clock_mhz to cpu_clock_max_mhz
-- Adds cpu_clock_min_mhz

ALTER TABLE public.console_variants
RENAME COLUMN cpu_clock_mhz TO cpu_clock_max_mhz;

ALTER TABLE public.console_variants
ADD COLUMN cpu_clock_min_mhz integer NULL;
