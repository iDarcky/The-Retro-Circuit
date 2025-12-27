
'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { retroAuth } from '@/lib/auth';
import { fetchConsoleList } from '@/lib/api/consoles';
import Button from '@/components/ui/Button';

function ConsoleIndex() {
    const [consoles, setConsoles] = useState<{name: string, slug: string, id: string, status?: string}[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDenied, setIsDenied] = useState(false);

    const [filter, setFilter] = useState<'ALL' | 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('ALL');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const isAdmin = await retroAuth.isAdmin();
                if (isAdmin) {
                    const list = await fetchConsoleList(true); // includeHidden = true
                    setConsoles(list);
                } else {
                    setIsDenied(true);
                }
            } catch (err: any) {
                console.error("Failed to load console index", err);
                setError(err.message || "Unknown Error");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filteredConsoles = consoles.filter(c => {
        const nameMatch = c.name ? c.name.toLowerCase().includes(search.toLowerCase()) : false;
        const slugMatch = c.slug ? c.slug.toLowerCase().includes(search.toLowerCase()) : false;
        const matchesSearch = nameMatch || slugMatch;
        const matchesFilter = filter === 'ALL' || c.status?.toUpperCase() === filter;
        return matchesSearch && matchesFilter;
    });

    if (loading) return <div className="p-8 text-center font-mono text-secondary animate-pulse">LOADING INDEX...</div>;
    if (isDenied) return <div className="p-8 text-center font-mono text-accent border-2 border-accent m-8">ACCESS DENIED. ADMIN CLEARANCE REQUIRED.</div>;
    if (error) return <div className="p-8 text-center font-mono text-accent border-2 border-accent m-8">SYSTEM ERROR: {error}</div>;

    return (
        <div className="w-full max-w-7xl mx-auto p-4 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b-2 border-border-normal pb-6 gap-4">
                <div>
                    <h1 className="text-4xl md:text-6xl font-pixel text-secondary mb-2 drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
                        CONSOLE INDEX
                    </h1>
                    <div className="flex gap-4">
                        <Link href="/admin" className="font-mono text-xs text-gray-500 hover:text-white hover:underline">
                            &lt; ROOT TERMINAL
                        </Link>
                        <p className="font-mono text-xs text-gray-500 tracking-widest">
                            // TOTAL RECORDS: {consoles.length}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Link href="/admin?tab=CONSOLE">
                        <Button variant="secondary" className="text-xs">
                             + NEW CONSOLE FOLDER
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
                <div className="flex gap-2">
                    {['ALL', 'DRAFT', 'PUBLISHED', 'ARCHIVED'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`font-mono text-xs px-3 py-1 border transition-colors ${
                                filter === f
                                ? 'bg-secondary text-black border-secondary font-bold'
                                : 'bg-black text-gray-500 border-gray-800 hover:text-white hover:border-gray-600'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="relative">
                     <input
                        type="text"
                        placeholder="SEARCH_DB..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-black border border-gray-700 text-white font-mono text-sm px-4 py-2 w-full md:w-64 focus:border-secondary outline-none uppercase"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-bg-primary border border-border-normal shadow-lg overflow-hidden relative">
                 <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(0,255,157,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                 <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left font-mono text-sm">
                        <thead>
                            <tr className="border-b border-gray-800 bg-black/50 text-gray-500 text-xs uppercase">
                                <th className="p-4 w-16">ID</th>
                                <th className="p-4">Console Name</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredConsoles.map((console) => (
                                <tr key={console.id} className="border-b border-gray-800 hover:bg-white/5 transition-colors group">
                                    <td className="p-4 text-gray-600 font-xs truncate max-w-[50px]">{console.id.substring(0,4)}</td>
                                    <td className="p-4 font-bold text-white group-hover:text-secondary">
                                        {console.name}
                                        <div className="text-[10px] text-gray-500 font-normal mt-1 lowercase opacity-50">{console.slug}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-[10px] px-2 py-1 border ${
                                            console.status === 'published' ? 'border-secondary text-secondary bg-secondary/10' :
                                            console.status === 'archived' ? 'border-red-500 text-red-500 bg-red-900/10' :
                                            'border-yellow-500 text-yellow-500 bg-yellow-900/10'
                                        }`}>
                                            {console.status || 'DRAFT'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <Link href={`/admin/consoles/${console.slug}`}>
                                            <button className="text-xs border border-gray-600 text-gray-400 px-3 py-1 hover:border-white hover:text-white transition-colors">
                                                EDIT
                                            </button>
                                        </Link>
                                        <Link href={`/consoles/${console.slug}`} target="_blank">
                                            <button className="text-xs border border-gray-800 text-gray-600 px-3 py-1 hover:border-cyan-400 hover:text-cyan-400 transition-colors">
                                                VIEW
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {filteredConsoles.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">
                                        NO RECORDS FOUND.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
    );
}

export default function AdminConsolesPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-secondary">INITIALIZING...</div>}>
            <ConsoleIndex />
        </Suspense>
    );
}
