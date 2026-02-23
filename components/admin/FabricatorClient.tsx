'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Manufacturer } from '@/lib/types';
import Button from '@/components/ui/Button';
import { ManufacturerForm } from '@/components/admin/ManufacturerForm';
import Modal from '@/components/ui/Modal';

interface FabricatorClientProps {
    initialManufacturers: Manufacturer[];
}

export default function FabricatorClient({ initialManufacturers }: FabricatorClientProps) {
    const router = useRouter();
    const [manufacturers, setManufacturers] = useState(initialManufacturers);
    const [search, setSearch] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingManufacturer, setEditingManufacturer] = useState<Manufacturer | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        setManufacturers(initialManufacturers);
    }, [initialManufacturers]);

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

    return (
        <div className="w-full max-w-7xl mx-auto p-4 animate-fadeIn">
            {/* Header - Consistent Swiss/Hub Style */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b-2 border-border-normal pb-6 gap-4">
                <div>
                    <h1 className="text-4xl md:text-6xl font-pixel text-secondary mb-2 drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
                        FABRICATORS
                    </h1>
                    <div className="flex gap-4 font-mono text-xs text-gray-500 uppercase tracking-widest">
                        <Link href="/admin" className="hover:text-white hover:underline">
                            &lt; ROOT TERMINAL
                        </Link>
                        <span>|</span>
                        <p>
                            // TOTAL ENTITIES: {manufacturers.length}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="secondary" className="text-xs" onClick={handleOpenCreate}>
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
                        className="bg-black border border-border-normal text-white font-mono text-sm px-4 py-2 w-full md:w-64 focus:border-white outline-none uppercase placeholder:text-gray-700 transition-colors"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[10px]">▼</div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                {filteredManufacturers.map((manu) => (
                    <div
                        key={manu.id}
                        className="bg-bg-secondary border border-border-normal p-6 hover:border-white transition-colors group relative overflow-hidden flex flex-col h-full min-h-[160px]"
                    >
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <h3 className="font-pixel text-lg text-white group-hover:text-secondary transition-colors mb-1">
                                    {manu.name}
                                </h3>
                                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider flex flex-col">
                                    <span>ORIGIN: {manu.country || 'UNKNOWN'}</span>
                                    <span>EST: {manu.founded_year || '????'}</span>
                                </div>
                            </div>
                            {manu.image_url && (
                                <img src={manu.image_url} alt={manu.name} className="w-8 h-8 object-contain opacity-50 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" />
                            )}
                        </div>

                        <div className="mt-auto relative z-10 flex justify-between items-center border-t border-border-normal pt-4">
                            <span className="text-[9px] font-mono text-gray-600 group-hover:text-gray-400">ID: {manu.id.substring(0,6)}</span>
                            <button
                                onClick={() => handleOpenEdit(manu)}
                                className="text-[10px] font-mono border border-border-normal text-gray-400 px-3 py-1 hover:bg-white hover:text-black hover:border-white transition-colors uppercase tracking-widest"
                            >
                                [ EDIT ]
                            </button>
                        </div>

                         {/* Hover Effect: Subtle Scanline */}
                         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-700 ease-in-out pointer-events-none"></div>
                    </div>
                ))}
                {filteredManufacturers.length === 0 && (
                    <div className="col-span-full p-12 text-center text-gray-500 font-mono text-xs border border-dashed border-gray-800 uppercase tracking-widest">
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
                    <div className="mt-4 p-3 bg-accent/10 border border-accent text-accent font-mono text-xs uppercase font-bold">
                        ERROR: {errorMsg}
                    </div>
                )}
            </Modal>
        </div>
    );
}
