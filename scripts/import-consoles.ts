/**
 * import-consoles.ts — bulk-add consoles from a JSON file.
 *
 * WHY: the admin UI creates exactly one console at a time (ConsoleForm → VariantForm),
 * which is painful for adding many devices. This script takes a list and creates the
 * console + its variants + emulation profile in one pass.
 *
 * USAGE:
 *   npx tsx scripts/import-consoles.ts path/to/consoles.json [--dry-run]
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (writes bypass RLS) and NEXT_PUBLIC_SUPABASE_URL
 * in .env.local. ALWAYS back up the database before a real (non-dry) run.
 *
 * INPUT FORMAT — an array of objects. Only `name` and `manufacturer` are required;
 * every other field is optional and simply skipped when absent:
 *
 * [
 *   {
 *     "name": "RG 40XX H",
 *     "manufacturer": "Anbernic",          // matched by name or slug (must already exist)
 *     "slug": "anbernic-rg-40xxh",         // optional; derived from manufacturer + name
 *     "form_factor": "horizontal",
 *     "device_category": "emulation",
 *     "description": "...",
 *     "image_url": "https://...",
 *     "status": "draft",                   // default draft — review before publishing
 *     "variants": [
 *       {
 *         "variant_name": "Base",
 *         "is_default": true,
 *         "price_launch_usd": 85,
 *         "release_date": "2024-07-01",
 *         "os": "Android 13",
 *         "os_family": "android",          // structured fields supported
 *         "soc": "Unisoc T820",
 *         "amazon_asin": "B0XXXXXXX",
 *         "emulation": { "ps1_state": "Perfect", "psp_state": "Great" }
 *       }
 *     ]
 *   }
 * ]
 */

import 'dotenv/config';
import { promises as fs } from 'fs';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

interface InputVariant {
  variant_name?: string;
  is_default?: boolean;
  emulation?: Record<string, string>;
  [key: string]: unknown;
}

interface InputConsole {
  name: string;
  manufacturer: string;
  slug?: string;
  variants?: InputVariant[];
  [key: string]: unknown;
}

async function main() {
  const [, , file, ...flags] = process.argv;
  const dryRun = flags.includes('--dry-run');

  if (!file) {
    console.error('Usage: npx tsx scripts/import-consoles.ts <file.json> [--dry-run]');
    process.exit(1);
  }

  const raw = await fs.readFile(file, 'utf8');
  const items: InputConsole[] = JSON.parse(raw);
  if (!Array.isArray(items)) throw new Error('Input must be a JSON array of consoles.');

  // Resolve manufacturers up front so a typo fails fast, before anything is written.
  const { data: manufacturers, error: mErr } = await supabase.from('manufacturer').select('id, name, slug');
  if (mErr) throw new Error(`Could not load manufacturers: ${mErr.message}`);

  const findManufacturer = (needle: string) => {
    const n = needle.toLowerCase().trim();
    return (manufacturers || []).find(
      (m: any) => m.name?.toLowerCase() === n || m.slug?.toLowerCase() === n
    );
  };

  const problems: string[] = [];
  items.forEach((item, i) => {
    if (!item.name) problems.push(`[${i}] missing "name"`);
    if (!item.manufacturer) problems.push(`[${i}] missing "manufacturer"`);
    else if (!findManufacturer(item.manufacturer))
      problems.push(`[${i}] unknown manufacturer "${item.manufacturer}" — create it first`);
  });

  if (problems.length) {
    console.error(`\nValidation failed (${problems.length}):`);
    problems.forEach((p) => console.error('  - ' + p));
    process.exit(1);
  }

  console.log(`${items.length} console(s) validated${dryRun ? ' — DRY RUN, nothing will be written' : ''}\n`);

  let created = 0;
  let skipped = 0;

  for (const item of items) {
    const manufacturer = findManufacturer(item.manufacturer)!;
    const slug = item.slug || slugify(`${manufacturer.name} ${item.name}`);

    const { data: existing } = await supabase.from('consoles').select('id').eq('slug', slug).maybeSingle();
    if (existing) {
      console.log(`  = skip ${slug} (already exists)`);
      skipped++;
      continue;
    }

    const { variants, manufacturer: _m, ...consoleFields } = item;
    const payload = {
      ...consoleFields,
      slug,
      manufacturer_id: manufacturer.id,
      // Default to draft so imported data is reviewed before going public.
      status: (consoleFields.status as string) || 'draft',
    };

    if (dryRun) {
      console.log(`  + would create ${slug} (${(variants || []).length} variant(s))`);
      created++;
      continue;
    }

    const { data: newConsole, error: cErr } = await supabase
      .from('consoles')
      .insert([payload])
      .select('id')
      .single();

    if (cErr || !newConsole) {
      console.error(`  ! failed ${slug}: ${cErr?.message}`);
      continue;
    }

    for (const v of variants || []) {
      const { emulation, ...variantFields } = v;
      const { data: newVariant, error: vErr } = await supabase
        .from('console_variants')
        .insert([{ ...variantFields, console_id: newConsole.id }])
        .select('id')
        .single();

      if (vErr || !newVariant) {
        console.error(`  ! variant failed for ${slug}: ${vErr?.message}`);
        continue;
      }

      if (emulation && Object.keys(emulation).length) {
        // The DB trigger creates a row per variant, so upsert on variant_id.
        const { error: eErr } = await supabase
          .from('emulation_profiles')
          .upsert({ ...emulation, variant_id: newVariant.id }, { onConflict: 'variant_id' });
        if (eErr) console.error(`  ! emulation profile failed for ${slug}: ${eErr.message}`);
      }
    }

    console.log(`  + created ${slug} (${(variants || []).length} variant(s))`);
    created++;
  }

  console.log(`\nDone. ${created} created, ${skipped} skipped.`);
  if (!dryRun && created > 0) {
    console.log('Imported consoles are in DRAFT — review in /admin/consoles, then publish.');
  }
}

main().catch((err) => {
  console.error('Import failed:', err);
  process.exit(1);
});
