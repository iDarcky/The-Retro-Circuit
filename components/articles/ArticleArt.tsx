import Image from 'next/image';

/**
 * Card art for an article: a flat colour field with the cover photo on it, or a small
 * pixel handheld when there is no photo. Square corners, no shadows.
 */
export default function ArticleArt({
    color,
    image,
    alt,
    className = '',
    sizes = '400px',
    priority = false,
}: {
    color: string;
    image?: string | null;
    alt: string;
    className?: string;
    sizes?: string;
    priority?: boolean;
}) {
    return (
        <div className={`relative overflow-hidden ${className}`} style={{ background: color }}>
            {/* Scanline bands, the one retro texture on the card. */}
            <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.12]"
                style={{ backgroundImage: 'repeating-linear-gradient(0deg, #000 0 14px, transparent 14px 42px)' }}
            />
            {image ? (
                <Image src={image} alt={alt} fill sizes={sizes} priority={priority} className="object-contain p-5" />
            ) : (
                <svg viewBox="0 0 120 190" aria-hidden="true" className="absolute left-1/2 top-1/2 h-[78%] -translate-x-1/2 -translate-y-1/2">
                    <rect x="0" y="0" width="120" height="190" fill="#1d1d22" stroke="rgba(255,255,255,.18)" />
                    <rect x="12" y="14" width="96" height="74" fill="#0a0a0c" />
                    <rect x="18" y="20" width="84" height="62" fill="#2ec4b6" opacity=".85" />
                    <rect x="20" y="118" width="12" height="36" fill="#0a0a0c" />
                    <rect x="8" y="130" width="36" height="12" fill="#0a0a0c" />
                    <rect x="78" y="116" width="14" height="14" fill="#ff7a1a" />
                    <rect x="94" y="132" width="14" height="14" fill="#f2b705" />
                </svg>
            )}
        </div>
    );
}
