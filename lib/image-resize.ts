/**
 * Downscale and re-encode an image in the browser before upload.
 *
 * next.config.mjs sets `images.unoptimized: true` (an intentional hard rule) and both
 * Vercel Hobby and Supabase Free lack a transformation service, so whatever byte count
 * is stored is the byte count every visitor downloads. Shrinking at upload time is the
 * only free lever, and it is a one-time cost per image.
 *
 * Falls back to the original File if anything goes wrong — a failed optimisation must
 * never block an upload.
 */
export async function resizeImageFile(
  file: File,
  { maxWidth = 1600, quality = 0.82 }: { maxWidth?: number; quality?: number } = {}
): Promise<{ file: File; before: number; after: number }> {
  const original = { file, before: file.size, after: file.size };

  // SVGs are vectors and GIFs may be animated; re-encoding either loses the point.
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') return original;
  if (typeof createImageBitmap !== 'function' || typeof document === 'undefined') return original;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxWidth / bitmap.width);
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return original;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', quality)
    );
    if (!blob) return original;

    // A tiny source (already-optimised icon) can grow as WebP. Keep whichever is smaller.
    if (blob.size >= file.size) return original;

    const name = file.name.replace(/\.[^.]+$/, '') + '.webp';
    return {
      file: new File([blob], name, { type: 'image/webp' }),
      before: file.size,
      after: blob.size,
    };
  } catch {
    return original;
  }
}
