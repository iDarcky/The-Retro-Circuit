'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ConsoleImage } from '../../app/actions/consoles';

const KIND_LABEL: Record<string, string> = {
    front: 'FRONT', back: 'BACK', side: 'SIDE', ports: 'PORTS',
    in_hand: 'IN HAND', screen: 'SCREEN', detail: 'DETAIL', other: 'VIEW',
};

/**
 * Thumbnail strip + active shot. Renders nothing when a console has no gallery images,
 * so pages that only have a cover are untouched.
 */
export default function ConsoleGallery({ images, deviceName }: { images: ConsoleImage[]; deviceName: string }) {
    const [active, setActive] = useState(0);
    if (!images?.length) return null;

    const current = images[Math.min(active, images.length - 1)];

    return (
        <div className="mt-8">
            <div className="relative aspect-[4/3] w-full border border-white/10 bg-white/[0.02]">
                <Image
                    src={current.url}
                    alt={current.alt_text || `${deviceName} — ${KIND_LABEL[current.kind || 'other'] || 'view'}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-contain"
                />
            </div>

            {images.length > 1 && (
                <ul className="mt-3 grid grid-cols-4 gap-3">
                    {images.map((img, i) => (
                        <li key={img.id}>
                            <button
                                type="button"
                                onClick={() => setActive(i)}
                                aria-label={img.alt_text || `View ${KIND_LABEL[img.kind || 'other'] || 'image'} of ${deviceName}`}
                                aria-current={i === active}
                                className={`relative block aspect-[4/3] w-full border transition-colors ${
                                    i === active
                                        ? 'border-violet-500'
                                        : 'border-white/10 hover:border-white/40'
                                }`}
                            >
                                <Image
                                    src={img.url}
                                    alt=""
                                    fill
                                    sizes="20vw"
                                    className="object-contain"
                                />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
