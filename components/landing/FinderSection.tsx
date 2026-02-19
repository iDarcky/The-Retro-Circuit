'use client';

import { useRouter } from 'next/navigation';
import { ConsoleSearch } from '../arena/ConsoleSearch';
import { Search, List } from 'lucide-react';
import Link from 'next/link';

interface FinderSectionProps {
    consoles: any[];
}

export default function FinderSection({ consoles }: FinderSectionProps) {
    const router = useRouter();

    const handleSelect = (slug: string) => {
        router.push(`/consoles/${slug}`);
    };

    const searchableConsoles = consoles.map(c => ({ name: c.name, slug: c.slug }));

    return (
        <section className="py-24 border-b border-border-subtle bg-bg-secondary/10 relative overflow-hidden">
            {/* Subtle Cyan Gradient */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-cyan-900/5 via-transparent to-transparent pointer-events-none" />

            <div className="max-w-[1800px] mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                    <div className="md:col-span-5 lg:col-span-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-900/30 bg-cyan-950/10 text-xs font-mono uppercase tracking-widest text-cyan-400 mb-6">
                            <Search className="w-3 h-3" /> Database Access
                        </div>
                        <h2 className="text-4xl font-bold tracking-tighter mb-4">THE FINDER.</h2>
                        <p className="text-text-secondary font-light max-w-md">
                            Instant access to the complete archive. Search by system name or manufacturer code.
                        </p>
                    </div>

                    <div className="md:col-span-7 lg:col-span-8 flex flex-col md:flex-row gap-4 w-full">
                        <div className="flex-1 bg-bg-primary border border-border-normal p-1 shadow-lg">
                             <ConsoleSearch
                                consoles={searchableConsoles}
                                onSelect={handleSelect}
                                placeholder="TYPE SYSTEM NAME..."
                                themeColor="primary"
                            />
                        </div>

                        <Link
                            href="/consoles"
                            className="bg-bg-tertiary hover:bg-white hover:text-black border border-border-normal text-text-primary px-8 py-4 font-mono text-sm uppercase tracking-widest transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            <List className="w-4 h-4" /> Full Index
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
