'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Manufacturer } from '@/lib/types';
import Button from '@/components/ui/Button';
import { ManufacturerForm } from '@/components/admin/ManufacturerForm';
import Modal from '@/components/ui/Modal';
import { deleteManufacturer } from '@/app/actions';

interface FabricatorClientProps {
    initialManufacturers: Manufacturer[];
}

export default function FabricatorClient({ initialManufacturers }: FabricatorClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [manufacturers, setManufacturers] = useState(initialManufacturers);
    const [search, setSearch] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingManufacturer, setEditingManufacturer] = useState<Manufacturer | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        setManufacturers(initialManufacturers);
    }, [initialManufacturers]);

    // Check for Deep Link Edit
    useEffect(() => {
        const editId = searchParams?.get('edit_id');
        if (editId && manufacturers.length > 0) {
            const target = manufacturers.find(m => m.id === editId);
            if (target) {
                setEditingManufacturer(target);
                setIsModalOpen(true);
                // Clean URL without refresh
                window.history.replaceState(null, '', '/admin/fabricators');
            }
        }
    }, [searchParams, manufacturers]);

    const filteredManufacturers = manufacturers.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        (m.country && m.country.toLowerCase().includes(search.toLowerCase()))
    );

    const handleOpenCreate = () => {
        setEditingManufacturer(null);
        setErrorMsg(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (manu: Manufacturer) => {
        setEditingManufacturer(manu);
        setErrorMsg(null);
        setIsModalOpen(true);
    };

    const handleSuccess = (_msg: string) => {
        setIsModalOpen(false);
        router.refresh();
    };

    const handleDelete = async (e: React.MouseEvent, manu: Manufacturer) => {
        e.stopPropagation();
        if (confirm(`PERMANENTLY DELETE FABRICATOR "${manu.name}"?\n\nThis action cannot be undone.`)) {
            const result = await deleteManufacturer(manu.id);
            if (result.success) {
                router.refresh();
            } else {
                alert(`Delete Failed: ${result.message}`);
            }
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 animate-fadeIn">
            {/* Header - Consistent Swiss/Hub Style */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/10 pb-6 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-mono font-bold text-white mb-2 uppercase tracking-tighter">
                        Fabricators
                    </h1>
                    <div className="flex gap-4 font-mono text-xs text-zinc-500 uppercase tracking-widest">
                        <Link href="/admin" className="hover:text-white hover:underline">
                            &lt; Root Terminal
                        </Link>
                        <span>|</span>
                        <p>
                            // TOTAL ENTITIES: {manufacturers.length}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="swiss" className="text-xs" onClick={handleOpenCreate}>
                         + REGISTER FABRICATOR
                    </Button>
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-end mb-6">
                <div className="relative w-full md:w-auto">
                     <input
                        type="text"
                        placeholder="SEARCH_ENTITIES..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-bg-primary border border-white/10 text-white font-mono text-xs px-4 py-2 w-full md:w-64 focus:border-white outline-none uppercase placeholder:text-zinc-700 transition-colors"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-[8px]">▼</div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredManufacturers.map((manu) => (
                    <div
                        key={manu.id}
                        className="bg-bg-primary border border-white/10 p-6 hover:border-white transition-colors group relative overflow-hidden flex flex-col h-full min-h-[160px]"
                    >
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <h3 className="font-mono font-bold text-lg text-white group-hover:text-white transition-colors mb-1 uppercase tracking-tight">
                                    {manu.name}
                                </h3>
                                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider flex flex-col">
                                    <span>ORIGIN: {manu.country || 'UNKNOWN'}</span>
                                    <span>EST: {manu.founded_year || '????'}</span>
                                </div>
                            </div>
                            {manu.image_url && (
                                <img src={manu.image_url} alt={manu.name} className="w-8 h-8 object-contain opacity-50 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" />
                            )}
                        </div>

                        <div className="mt-auto relative z-10 flex justify-between items-center border-t border-white/10 pt-4">
                            <span className="text-[9px] font-mono text-zinc-600 group-hover:text-zinc-400">ID: {manu.id.substring(0,6)}</span>

                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => handleDelete(e, manu)}
                                    className="text-[10px] font-mono border border-red-900/50 text-red-700 px-2 py-1 hover:bg-red-500 hover:text-white transition-colors uppercase tracking-widest"
                                    title="Delete Fabricator"
                                >
                                    [ DEL ]
                                </button>
                                <button
                                    onClick={() => handleOpenEdit(manu)}
                                    className="text-[10px] font-mono border border-white/10 text-zinc-400 px-2 py-1 hover:bg-white hover:text-black hover:border-white transition-colors uppercase tracking-widest"
                                >
                                    [ EDIT ]
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredManufacturers.length === 0 && (
                    <div className="col-span-full p-12 text-center text-zinc-500 font-mono text-xs border border-dashed border-zinc-800 uppercase tracking-widest">
                        // NO RECORDS FOUND MATCHING QUERY.
                    </div>
                )}
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingManufacturer ? `EDIT ENTITY: ${editingManufacturer.name}` : "REGISTER NEW FABRICATOR"}
            >
                <ManufacturerForm
                    initialData={editingManufacturer}
                    onSuccess={handleSuccess}
                    onError={setErrorMsg}
                />
                 {errorMsg && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500 text-red-500 font-mono text-xs uppercase font-bold">
                        ERROR: {errorMsg}
                    </div>
                )}
            </Modal>
        </div>
    );
}
