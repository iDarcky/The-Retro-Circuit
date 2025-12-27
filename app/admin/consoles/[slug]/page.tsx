
'use client';

import { Suspense, useEffect, useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { retroAuth } from '@/lib/auth';
import { fetchConsoleBySlug, fetchManufacturers } from '@/lib/api';
import { ConsoleDetails, Manufacturer } from '@/lib/types';
import { ConsoleForm } from '@/components/admin/ConsoleForm';
import Button from '@/components/ui/Button';

// Next.js 15/16 params handling
type Props = {
    params: Promise<{ slug: string }>;
};

function ConsoleEditor({ slug }: { slug: string }) {
    const [consoleData, setConsoleData] = useState<ConsoleDetails | null>(null);
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            const isAdmin = await retroAuth.isAdmin();
            if (!isAdmin) {
                setError("ACCESS DENIED");
                setLoading(false);
                return;
            }

            try {
                const [consRes, manus] = await Promise.all([
                    fetchConsoleBySlug(slug, true), // includeHidden=true
                    fetchManufacturers()
                ]);

                if (consRes.error || !consRes.data) {
                    setError(consRes.error?.message || "Console not found");
                } else {
                    setConsoleData(consRes.data);
                }
                setManufacturers(manus);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [slug]);

    if (loading) return <div className="p-8 text-center font-mono text-secondary animate-pulse">LOADING DATA STRUCTURE...</div>;
    if (error) return <div className="p-8 text-center font-mono text-accent border-2 border-accent m-8">ERROR: {error}</div>;
    if (!consoleData) return notFound();

    return (
        <div className="w-full max-w-7xl mx-auto p-4 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b-2 border-border-normal pb-6 gap-4">
                <div>
                    <h1 className="text-3xl md:text-5xl font-pixel text-secondary mb-2 drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
                        EDIT CONSOLE
                    </h1>
                    <div className="flex gap-4 items-center">
                        <Link href="/admin/consoles" className="font-mono text-xs text-gray-500 hover:text-white hover:underline">
                            &lt; BACK TO INDEX
                        </Link>
                        <span className="font-mono text-xs text-gray-700">|</span>
                        <p className="font-mono text-xs text-secondary tracking-widest uppercase">
                            TARGET: {consoleData.name}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Link href={`/consoles/${consoleData.slug}`} target="_blank">
                        <Button variant="secondary" className="text-xs border border-gray-700 text-gray-400">
                             PREVIEW [↗]
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Editor Area */}
            <div className="bg-bg-primary border border-border-normal p-6 shadow-lg relative">
                 <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(0,255,157,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                 <div className="relative z-10">
                    <ConsoleForm
                        initialData={consoleData}
                        manufacturers={manufacturers}
                        onConsoleCreated={() => {
                             // On update success, maybe show toast?
                             // Currently ConsoleForm refreshes the page, which is fine.
                        }}
                        onError={(msg) => setError(msg)}
                    />
                 </div>
            </div>

            <div className="mt-8 border-t border-dashed border-gray-800 pt-4">
                 <h3 className="font-pixel text-xs text-gray-600 mb-4">RELATED ACTIONS</h3>
                 <div className="flex gap-4">
                     <Link href={`/admin?mode=edit&type=variant&variant_id=${consoleData.variants?.[0]?.id || ''}`}>
                        <Button variant="secondary" disabled={!consoleData.variants?.length} className="text-xs">
                            EDIT HARDWARE SPECS
                        </Button>
                     </Link>
                 </div>
            </div>

        </div>
    );
}

export default function AdminConsoleEditPage(props: Props) {
    // Unwrap params in Next 15/16
    const params = use(props.params);
    return (
        <Suspense fallback={<div className="p-8 text-center text-secondary">LOADING EDITOR...</div>}>
            <ConsoleEditor slug={params.slug} />
        </Suspense>
    );
}
