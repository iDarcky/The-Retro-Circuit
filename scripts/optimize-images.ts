/**
 * optimize-images.ts
 * ------------------
 * Downscale + recompress raster images so the site ships smaller payloads.
 *
 * WHY: `next.config.mjs` sets `images.unoptimized: true` (an intentional HARD RULE), so
 * Next.js does NOT resize or convert images at request time — every source byte is served
 * as-is. The lever left to us is shipping already-optimized source assets. This script does
 * that for locally-committed assets in `public/`.
 *
 * SCOPE / LIMITATION: This only touches files on disk (the `public/` directory by default).
 * Most console/fabricator artwork lives in Supabase Storage and is referenced by remote URL —
 * those cannot be reprocessed from here. Re-optimizing and re-uploading Storage assets is a
 * follow-up data operation (run this script against a local export, then re-upload).
 *
 * USAGE:
 *   pnpm add -D sharp             # sharp is not a project dependency yet
 *   npx tsx scripts/optimize-images.ts [dir] [--max-width=1600] [--quality=80] [--dry-run]
 *
 * Defaults: dir=public, max-width=1600px, quality=80, writes in place (backs nothing up — commit first).
 */

import { promises as fs } from 'fs';
import path from 'path';

type Options = { dir: string; maxWidth: number; quality: number; dryRun: boolean };

function parseArgs(argv: string[]): Options {
  const opts: Options = { dir: 'public', maxWidth: 1600, quality: 80, dryRun: false };
  for (const arg of argv) {
    if (arg.startsWith('--max-width=')) opts.maxWidth = parseInt(arg.split('=')[1], 10) || opts.maxWidth;
    else if (arg.startsWith('--quality=')) opts.quality = parseInt(arg.split('=')[1], 10) || opts.quality;
    else if (arg === '--dry-run') opts.dryRun = true;
    else if (!arg.startsWith('--')) opts.dir = arg;
  }
  return opts;
}

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(full) : Promise.resolve([full]);
    })
  );
  return files.flat();
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  // sharp is loaded lazily (and untyped) so the repo doesn't need it installed — or typed —
  // unless this script is actually run.
  let sharp: any;
  try {
    sharp = (await import('sharp' as string)).default;
  } catch {
    console.error('\n[optimize-images] `sharp` is not installed. Run:\n  pnpm add -D sharp\n');
    process.exit(1);
  }

  const root = path.resolve(process.cwd(), opts.dir);
  const all = await walk(root);
  const targets = all.filter((f) => /\.(png|jpe?g)$/i.test(f));

  console.log(
    `[optimize-images] ${targets.length} image(s) under ${opts.dir} | max-width=${opts.maxWidth} quality=${opts.quality}${opts.dryRun ? ' | DRY RUN' : ''}`
  );

  let savedBytes = 0;
  for (const file of targets) {
    const before = (await fs.stat(file)).size;
    const image = sharp(file);
    const meta: { width?: number } = await image.metadata();
    const isPng = /\.png$/i.test(file);

    let pipeline = image;
    if (meta.width && meta.width > opts.maxWidth) {
      pipeline = pipeline.resize({ width: opts.maxWidth, withoutEnlargement: true });
    }
    pipeline = isPng
      ? pipeline.png({ compressionLevel: 9, palette: true, quality: opts.quality })
      : pipeline.jpeg({ quality: opts.quality, mozjpeg: true });

    const buffer = await pipeline.toBuffer();
    if (buffer.length < before) {
      savedBytes += before - buffer.length;
      if (!opts.dryRun) await fs.writeFile(file, buffer);
      console.log(
        `  ${opts.dryRun ? 'would save' : 'saved'} ${(before - buffer.length) / 1024 | 0}KB  ${path.relative(root, file)}`
      );
    }
  }

  console.log(`[optimize-images] total ${opts.dryRun ? 'potential ' : ''}savings: ${(savedBytes / 1024 / 1024).toFixed(2)}MB`);
}

main().catch((err) => {
  console.error('[optimize-images] failed:', err);
  process.exit(1);
});
