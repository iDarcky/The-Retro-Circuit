-- Migration: Auto-clone profiles for new variants

-- Function to clone profiles
CREATE OR REPLACE FUNCTION clone_variant_profiles()
RETURNS TRIGGER AS $$
DECLARE
    source_variant_id UUID;
    col_list TEXT;
    val_list TEXT;
BEGIN
    -- 1. Find Source Variant
    -- Priority: Default -> Oldest Created
    SELECT id INTO source_variant_id
    FROM console_variants
    WHERE console_id = NEW.console_id
      AND id != NEW.id
    ORDER BY is_default DESC, created_at ASC
    LIMIT 1;

    -- 2. Clone or Create Blank: variant_input_profile
    IF source_variant_id IS NOT NULL AND EXISTS(SELECT 1 FROM variant_input_profile WHERE variant_id = source_variant_id) THEN
        -- Dynamic Insert to copy all columns except id, variant_id, timestamps
        SELECT string_agg(quote_ident(column_name), ', ') INTO col_list
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'variant_input_profile'
          AND column_name NOT IN ('id', 'variant_id', 'created_at', 'updated_at');

        IF col_list IS NOT NULL THEN
            EXECUTE format('INSERT INTO variant_input_profile (variant_id, %s) SELECT $1, %s FROM variant_input_profile WHERE variant_id = $2', col_list, col_list)
            USING NEW.id, source_variant_id;
        END IF;
    ELSE
        -- Create Blank
        INSERT INTO variant_input_profile (variant_id, input_confidence) VALUES (NEW.id, 'unknown');
    END IF;

    -- 3. Clone or Create Blank: emulation_profiles
    IF source_variant_id IS NOT NULL AND EXISTS(SELECT 1 FROM emulation_profiles WHERE variant_id = source_variant_id) THEN
         SELECT string_agg(quote_ident(column_name), ', ') INTO col_list
         FROM information_schema.columns
         WHERE table_schema = 'public'
           AND table_name = 'emulation_profiles'
           AND column_name NOT IN ('id', 'variant_id', 'created_at', 'updated_at');

         IF col_list IS NOT NULL THEN
            EXECUTE format('INSERT INTO emulation_profiles (variant_id, %s) SELECT $1, %s FROM emulation_profiles WHERE variant_id = $2', col_list, col_list)
            USING NEW.id, source_variant_id;
         END IF;
    ELSE
         -- Blank Emulation Profile
         INSERT INTO emulation_profiles (
             variant_id,
             nes_state, snes_state, master_system, genesis_state, gb_state, gbc_state, gba_state,
             ps1_state, n64_state, saturn_state, nds_state, dreamcast_state,
             psp_state, x3ds_state, vita_state,
             ps2_state, gamecube_state, xbox,
             wii_state, wii_u, ps3_state, xbox_360, switch_state
         ) VALUES (
             NEW.id,
             'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A',
             'N/A', 'N/A', 'N/A', 'N/A', 'N/A',
             'N/A', 'N/A', 'N/A',
             'N/A', 'N/A', 'N/A',
             'N/A', 'N/A', 'N/A', 'N/A', 'N/A'
         );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS trigger_clone_variant_profiles ON console_variants;
CREATE TRIGGER trigger_clone_variant_profiles
AFTER INSERT ON console_variants
FOR EACH ROW
EXECUTE FUNCTION clone_variant_profiles();

-- Backfill Logic
DO $$
DECLARE
    v_rec RECORD;
    source_id UUID;
    col_list TEXT;
BEGIN
    FOR v_rec IN SELECT id, console_id FROM console_variants LOOP
        -- Check/Create Input Profile
        IF NOT EXISTS (SELECT 1 FROM variant_input_profile WHERE variant_id = v_rec.id) THEN
            -- Find Source
            SELECT id INTO source_id FROM console_variants WHERE console_id = v_rec.console_id AND id != v_rec.id ORDER BY is_default DESC, created_at ASC LIMIT 1;

            IF source_id IS NOT NULL AND EXISTS(SELECT 1 FROM variant_input_profile WHERE variant_id = source_id) THEN
                SELECT string_agg(quote_ident(column_name), ', ') INTO col_list
                FROM information_schema.columns
                WHERE table_schema = 'public'
                  AND table_name = 'variant_input_profile'
                  AND column_name NOT IN ('id', 'variant_id', 'created_at', 'updated_at');

                IF col_list IS NOT NULL THEN
                    EXECUTE format('INSERT INTO variant_input_profile (variant_id, %s) SELECT $1, %s FROM variant_input_profile WHERE variant_id = $2', col_list, col_list)
                    USING v_rec.id, source_id;
                END IF;
            ELSE
                 INSERT INTO variant_input_profile (variant_id, input_confidence) VALUES (v_rec.id, 'unknown');
            END IF;
        END IF;

        -- Check/Create Emulation Profile
        IF NOT EXISTS (SELECT 1 FROM emulation_profiles WHERE variant_id = v_rec.id) THEN
            SELECT id INTO source_id FROM console_variants WHERE console_id = v_rec.console_id AND id != v_rec.id ORDER BY is_default DESC, created_at ASC LIMIT 1;

            IF source_id IS NOT NULL AND EXISTS(SELECT 1 FROM emulation_profiles WHERE variant_id = source_id) THEN
                 SELECT string_agg(quote_ident(column_name), ', ') INTO col_list
                 FROM information_schema.columns
                 WHERE table_schema = 'public'
                   AND table_name = 'emulation_profiles'
                   AND column_name NOT IN ('id', 'variant_id', 'created_at', 'updated_at');

                 IF col_list IS NOT NULL THEN
                    EXECUTE format('INSERT INTO emulation_profiles (variant_id, %s) SELECT $1, %s FROM emulation_profiles WHERE variant_id = $2', col_list, col_list)
                    USING v_rec.id, source_id;
                 END IF;
            ELSE
                 INSERT INTO emulation_profiles (
                     variant_id,
                     nes_state, snes_state, master_system, genesis_state, gb_state, gbc_state, gba_state,
                     ps1_state, n64_state, saturn_state, nds_state, dreamcast_state,
                     psp_state, x3ds_state, vita_state,
                     ps2_state, gamecube_state, xbox,
                     wii_state, wii_u, ps3_state, xbox_360, switch_state
                 ) VALUES (
                     v_rec.id,
                     'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A',
                     'N/A', 'N/A', 'N/A', 'N/A', 'N/A',
                     'N/A', 'N/A', 'N/A',
                     'N/A', 'N/A', 'N/A',
                     'N/A', 'N/A', 'N/A', 'N/A', 'N/A'
                 );
            END IF;
        END IF;
    END LOOP;
END;
$$;

-- Enforce Constraints
DELETE FROM emulation_profiles WHERE variant_id IS NULL;
ALTER TABLE emulation_profiles ALTER COLUMN variant_id SET NOT NULL;
