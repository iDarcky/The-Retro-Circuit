'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ConsoleDetails } from '../../lib/types';
import SwissButton from '../console/swiss/SwissButton';

interface KeyDevicesProps {
    consoles: ConsoleDetails[];
}

export default function KeyDevices({ consoles }: KeyDevicesProps) {
    if (!consoles || consoles.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
            {consoles.map(consoleItem => {
                // Get price for display
                let displayPrice = 0;
                if (consoleItem.variants && consoleItem.variants.length > 0) {
                    const defaultVar = consoleItem.variants.find(v => v.is_default) || consoleItem.variants[0];
                    displayPrice = defaultVar?.price_launch_usd || 0;
                } else if (consoleItem.specs) {
                    displayPrice = consoleItem.specs?.price_launch_usd || 0;
                }

                // Construct proper image URL logic
                let imageUrl = consoleItem.image_url;
                if (!imageUrl && consoleItem.variants && consoleItem.variants.length > 0) {
                    const defaultVar = consoleItem.variants.find(v => v.is_default) || consoleItem.variants[0];
                    imageUrl = defaultVar?.image_url;
                }

                return (
                    <div key={consoleItem.id} className="border border-white/10 bg-white/[0.02] p-6 flex flex-col relative group hover:border-white/30 transition-colors">
                        <div className="absolute top-0 right-0 bg-white/10 text-[var(--brand-color)] font-mono text-[10px] px-3 py-1 uppercase tracking-wider">
                            FEATURED
                        </div>

                        <div className="h-48 bg-black/20 flex items-center justify-center mb-6 p-4 border border-white/5 relative">
                            {imageUrl ? (
                                <Image
                                    src={imageUrl.startsWith('http') ? imageUrl : `/${imageUrl.replace(/^\//, '')}`}
                                    alt={consoleItem.name}
                                    fill
                                    className="object-contain drop-shadow-lg opacity-80 group-hover:opacity-100 transition-opacity p-4"
                                />
                            ) : (
                                <span className="font-pixel text-4xl text-zinc-800">?</span>
                            )}
                        </div>

                        <div className="flex-1 flex flex-col">
                            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">
                                {consoleItem.manufacturer?.name || 'UNKNOWN'}
                            </div>
                            <h4 className="text-xl font-bold text-white mb-4 leading-tight">
                                {consoleItem.name}
                            </h4>

                            <div className="grid grid-cols-2 gap-2 mb-6 font-mono text-[10px] text-zinc-500">
                                <div className="bg-white/[0.02] p-2 text-center border border-white/5">
                                    <span className="block text-white mb-0.5">{displayPrice > 0 ? `$${displayPrice}` : 'N/A'}</span>
                                    PRICE
                                </div>
                                <div className="bg-white/[0.02] p-2 text-center border border-white/5">
                                    <span className="block text-white mb-0.5">{consoleItem.form_factor?.toUpperCase() || 'N/A'}</span>
                                    FORM
                                </div>
                            </div>

                            <div className="mt-auto">
                                <Link href={`/consoles/${consoleItem.slug}`} className="w-full">
                                    <SwissButton variant="orange" className="w-full text-xs">
                                        VIEW DETAILS
                                    </SwissButton>
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
