
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { timeAgo } from '@/lib/utils/date-formatter';
import Button from '@/components/ui/Button';
import { ConsoleForm } from '@/components/admin/ConsoleForm';
import Modal from '@/components/ui/Modal';
import { Manufacturer } from '@/lib/types';
import { deleteConsole } from '@/app/actions';

interface ConsoleIndexClientProps {
    initialConsoles: {
        name: string,
        slug: string,
        id: string,
        status?: string,
        updated_at?: string,
        manufacturer?: { name: string } | null
    }[];
    initialManufacturers: Manufacturer[];
}

export default function ConsoleIndexClient({ initialConsoles, initialManufacturers }: ConsoleIndexClientProps) {
    const router = useRouter();
    const [consoles, setConsoles] = useState(initialConsoles);
    const [filter, setFilter] = useState<'ALL' | 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED'>('ALL');
    const [search, setSearch] = useState('');

    // Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createError, _setCreateError] = useState<string | null>(null);

    // Sync state with props if they change (e.g. after router.refresh)
    useEffect(() => {
        setConsoles(initialConsoles);
    }, [initialConsoles]);

    const counts = {
        ALL: consoles.length,
        DRAFT: consoles.filter(c => c.status === 'draft' || !c.status).length,
        REVIEW: consoles.filter(c => c.status === 'review').length,
        PUBLISHED: consoles.filter(c => c.status === 'published').length,
        ARCHIVED: consoles.filter(c => c.status === 'archived').length,
    };

    const filteredConsoles = consoles.filter(c => {
        const nameMatch = c.name ? c.name.toLowerCase().includes(search.toLowerCase()) : false;
        const slugMatch = c.slug ? c.slug.toLowerCase().includes(search.toLowerCase()) : false;
        const matchesSearch = nameMatch || slugMatch;

        const currentStatus = c.status ? c.status.toUpperCase() : 'DRAFT';
        const matchesFilter = filter === 'ALL' || currentStatus === filter;

        return matchesSearch && matchesFilter;
    });


    const handleDelete = async (id: string, name: string) => {
        if (confirm(`PERMANENTLY DELETE "${name}"?\n\nThis console is in DRAFT and can be safely removed.`)) {
            const result = await deleteConsole(id);
            if (result.success) {
                router.refresh();
            } else {
                alert(`Delete Failed: ${result.message}`);
            }
        }
    };

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
                    <Button variant="secondary" className="text-xs" onClick={() => setIsCreateModalOpen(true)}>
                         + NEW CONSOLE FOLDER
                    </Button>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
                <div className="flex gap-2">
                    {['ALL', 'DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`font-mono text-xs px-3 py-1 border transition-colors uppercase tracking-wider ${
                                filter === f
                                ? 'bg-secondary text-black border-secondary font-bold'
                                : 'bg-black text-gray-500 border-gray-800 hover:text-white hover:border-gray-600'
                            }`}
                        >
                            {f} ({counts[f as keyof typeof counts]})
                        </button>
                    ))}
                </div>
                <div className="relative">
                     <input
                        type="text"
                        placeholder="SEARCH_DB..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-black border border-gray-700 text-white font-mono text-sm px-4 py-2 w-full md:w-64 focus:border-secondary outline-none uppercase placeholder:text-gray-700"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-bg-primary border border-border-normal shadow-lg overflow-hidden relative">
                 <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left font-mono text-sm">
                        <thead>
                            <tr className="border-b border-gray-800 bg-black/50 text-gray-500 text-xs uppercase tracking-widest">
                                <th className="p-4 w-16">ID</th>
                                <th className="p-4">Console Name</th>
                                <th className="p-4">Manufacturer</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Last Updated</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredConsoles.map((console) => (
                                <tr
                                    key={console.id}
                                    onClick={() => router.push(`/admin/consoles/${console.slug}`)}
                                    className="border-b border-gray-800 hover:bg-white/5 transition-colors group cursor-pointer"
                                >
                                    <td className="p-4 text-gray-600 font-xs truncate max-w-[50px]">{console.id.substring(0,4)}</td>
                                    <td className="p-4 font-bold text-white group-hover:text-secondary">
                                        {console.name}
                                        <div className="text-[10px] text-gray-500 font-normal mt-1 lowercase opacity-50">{console.slug}</div>
                                    </td>
                                    <td className="p-4 text-gray-400">
                                        {console.manufacturer?.name || '-'}
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-[10px] px-2 py-1 border uppercase tracking-wider ${
                                            console.status === 'published' ? 'border-secondary text-secondary bg-secondary/10' :
                                            console.status === 'review' ? 'border-accent text-accent bg-accent/10' :
                                            console.status === 'archived' ? 'border-red-500 text-red-500 bg-red-900/10' :
                                            'border-yellow-500 text-yellow-500 bg-yellow-900/10'
                                        }`}>
                                            {console.status || 'DRAFT'}
                                        </span>
                                    </td>
                                    <td className="p-4 font-mono text-xs text-gray-500">
                                        {timeAgo(console.updated_at)}
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/admin/consoles/${console.slug}`);
                                            }}
                                            className="text-[10px] border border-gray-600 text-gray-400 px-3 py-1 hover:border-white hover:text-white transition-colors uppercase tracking-widest"
                                        >
                                            EDIT
                                        </button>

                                        {console.status === 'draft' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(console.id, console.name);
                                                }}
                                                className="text-[10px] border border-red-900 text-red-700 px-3 py-1 hover:bg-red-900 hover:text-white transition-colors uppercase tracking-widest"
                                                title="Delete Draft"
                                            >
                                                DEL
                                            </button>
                                        )}

                                        <Link
                                            href={console.status === 'published' ? `/consoles/${console.slug}` : `/admin/preview/consoles/${console.slug}`}
                                            target="_blank"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                className={`text-[10px] border px-3 py-1 transition-colors uppercase tracking-widest ${
                                                    console.status === 'draft' || console.status === 'review'
                                                    ? 'border-dashed border-gray-700 text-gray-500 hover:border-yellow-500 hover:text-yellow-500'
                                                    : 'border-gray-800 text-gray-600 hover:border-cyan-400 hover:text-cyan-400'
                                                }`}
                                                title={console.status !== 'published' ? "Admin preview (not public)" : undefined}
                                            >
                                                {console.status !== 'published' ? 'PREVIEW' : 'VIEW'}
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {filteredConsoles.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500 border-dashed border-gray-800 uppercase tracking-widest">
                                        // NO RECORDS FOUND.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                 </div>
            </div>

            {/* Create Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="INITIALIZE NEW CONSOLE FOLDER"
            >
                <ConsoleForm
                    manufacturers={initialManufacturers}
                />
                {createError && (
                    <div className="mt-4 p-3 bg-accent/10 border border-accent text-accent font-mono text-xs uppercase font-bold">
                        ERROR: {createError}
                    </div>
                )}
            </Modal>
        </div>
    );
}
