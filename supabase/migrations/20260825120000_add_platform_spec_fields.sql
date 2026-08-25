-- Add structured platform/silicon fields to console_variants.
--
-- WHY: `os` and `cpu_architecture` are free text today, which makes Windows handhelds and
-- Android emulators impossible to filter reliably. Production data already shows the drift:
-- "Android 13", "Andorid 13" (typo), "Android 13, Linux", "Windows 11 Home",
-- "SteamOS 3.0 (Arch Linux)". These columns add structure WITHOUT dropping `os`, which is
-- kept as the human-readable display string.
--
-- SAFETY: purely additive (ADD COLUMN IF NOT EXISTS + a backfill of the new columns only).
-- No existing column is altered or dropped. Back up the database before applying.

-- 1. Structured OS -----------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE os_family AS ENUM ('android', 'linux', 'steamos', 'windows', 'proprietary', 'other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE console_variants ADD COLUMN IF NOT EXISTS os_family os_family;
ALTER TABLE console_variants ADD COLUMN IF NOT EXISTS os_version text;

COMMENT ON COLUMN console_variants.os_family IS 'Structured OS family for filtering. `os` remains the display string.';
COMMENT ON COLUMN console_variants.os_version IS 'Version portion only, e.g. "13" for Android 13.';

-- 2. Structured CPU architecture ---------------------------------------------------
DO $$ BEGIN
    CREATE TYPE cpu_arch AS ENUM ('arm64', 'arm32', 'x86_64', 'other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE console_variants ADD COLUMN IF NOT EXISTS cpu_arch cpu_arch;
COMMENT ON COLUMN console_variants.cpu_arch IS 'Structured architecture. cpu_architecture stays as free-text detail.';

-- 3. SoC / chipset -----------------------------------------------------------------
-- Android device comparison hinges on the SoC (e.g. "Snapdragon 8 Gen 2"), which is
-- currently smeared across cpu_model and gpu_model.
ALTER TABLE console_variants ADD COLUMN IF NOT EXISTS soc text;
COMMENT ON COLUMN console_variants.soc IS 'Full SoC/chipset name, e.g. "Snapdragon 8 Gen 2".';

-- 4. Emulation-relevant capability fields ------------------------------------------
ALTER TABLE console_variants ADD COLUMN IF NOT EXISTS vulkan_support text;
ALTER TABLE console_variants ADD COLUMN IF NOT EXISTS gpu_driver text;
ALTER TABLE console_variants ADD COLUMN IF NOT EXISTS benchmark_score integer;

COMMENT ON COLUMN console_variants.vulkan_support IS 'Vulkan version supported, e.g. "1.3". Key for Android emulator performance.';
COMMENT ON COLUMN console_variants.gpu_driver IS 'GPU driver / Mesa-Turnip support notes.';
COMMENT ON COLUMN console_variants.benchmark_score IS 'Synthetic benchmark (AnTuTu) for cross-chip ranking.';

-- 5. Backfill the new structured columns from existing free text --------------------
UPDATE console_variants
SET os_family = CASE
        -- tolerate the known "Andorid" typo present in the data
        WHEN os ILIKE '%andorid%' OR os ILIKE '%android%' THEN 'android'::os_family
        WHEN os ILIKE '%steamos%'                          THEN 'steamos'::os_family
        WHEN os ILIKE '%windows%'                          THEN 'windows'::os_family
        WHEN os ILIKE '%linux%'                            THEN 'linux'::os_family
        WHEN os ILIKE '%analogue%' OR os ILIKE '%retroid os%' THEN 'proprietary'::os_family
        ELSE 'other'::os_family
    END
WHERE os IS NOT NULL AND os <> '' AND os_family IS NULL;

-- Pull the leading version number out of strings like "Android 13" / "Windows 11 Home".
UPDATE console_variants
SET os_version = NULLIF((regexp_match(os, '(\d+(?:\.\d+)*)'))[1], '')
WHERE os IS NOT NULL AND os <> '' AND os_version IS NULL;

UPDATE console_variants
SET cpu_arch = CASE
        WHEN cpu_architecture ILIKE '%x86%' OR cpu_architecture ILIKE '%amd64%' THEN 'x86_64'::cpu_arch
        WHEN cpu_architecture ILIKE '%arm64%' OR cpu_architecture ILIKE '%aarch64%' THEN 'arm64'::cpu_arch
        WHEN cpu_architecture ILIKE '%armv7%' OR cpu_architecture ILIKE '%arm32%' THEN 'arm32'::cpu_arch
        WHEN cpu_architecture ILIKE '%arm%' THEN 'arm64'::cpu_arch
        ELSE NULL
    END
WHERE cpu_architecture IS NOT NULL AND cpu_architecture <> '' AND cpu_arch IS NULL;

-- 6. Indexes for the new public filters --------------------------------------------
CREATE INDEX IF NOT EXISTS idx_console_variants_os_family ON console_variants (os_family);
CREATE INDEX IF NOT EXISTS idx_console_variants_cpu_arch ON console_variants (cpu_arch);
