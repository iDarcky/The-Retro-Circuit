'use client';

import Image from 'next/image';

interface PhotoGalleryProps {
    imageUrl: string | null;
    altText: string;
}

export default function PhotoGallery({ imageUrl, altText }: PhotoGalleryProps) {
    return (
        <figure className="relative w-full aspect-[4/3] md:aspect-[16/9] border border-white/10 bg-black overflow-hidden group">
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <span className="bg-secondary text-black font-mono text-[10px] font-bold px-2 py-1 transform -rotate-2 shadow-lg">
                    GALLERY
                </span>
                <span className="bg-black/90 text-secondary border border-secondary font-mono text-[10px] font-bold px-2 py-1 transform -rotate-2 shadow-lg">
                    01/01
                </span>
            </div>

            {imageUrl ? (
                <Image
                    src={imageUrl}
                    alt={altText}
                    fill
                    className="object-contain p-8 md:p-12 transition-transform duration-500 group-hover:scale-105"
                    priority
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-pixel text-4xl text-white/20 uppercase">NO SIGNAL</span>
                </div>
            )}

            {/* Overlay Gradient (Optional for depth) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none opacity-50"></div>
        </figure>
    );
}
