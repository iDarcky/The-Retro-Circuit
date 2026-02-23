'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
        router.refresh(); // Refresh data
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b-2 border-border-normal pb-6 gap-4">
                <div>
                    <h1 className="text-4xl md:text-6xl font-pixel text-secondary mb-2 drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
                        FABRICATORS
                    </h1>
                    <div className="flex gap-4">
                        <Link href="/admin" className="font-mono text-xs text-gray-500 hover:text-white hover:underline">
                            &lt; ROOT TERMINAL
                        </Link>
                        <p className="font-mono text-xs text-gray-500 tracking-widest">
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
                <div className="relative">
                     <input
                        type="text"
                        placeholder="SEARCH_ENTITIES..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-black border border-gray-700 text-white font-mono text-sm px-4 py-2 w-full md:w-64 focus:border-secondary outline-none uppercase"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredManufacturers.map((manu) => (
                    <div
                        key={manu.id}
                        className="bg-bg-secondary border border-border-normal p-4 hover:border-white transition-colors group relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <h3 className="font-bold text-white text-lg group-hover:text-secondary transition-colors">
                                    {manu.name}
                                </h3>
                                <p className="text-[10px] font-mono text-gray-500 uppercase">
                                    {manu.country || 'UNKNOWN ORIGIN'} // EST. {manu.founded_year || '????'}
                                </p>
                            </div>
                            {manu.image_url && (
                                <img src={manu.image_url} alt={manu.name} className="w-8 h-8 object-contain opacity-50 group-hover:opacity-100 transition-opacity" />
                            )}
                        </div>

                        <div className="relative z-10 pt-4 border-t border-gray-800 flex justify-end">
                            <button
                                onClick={() => handleOpenEdit(manu)}
                                className="text-[10px] font-mono border border-gray-700 text-gray-400 px-3 py-1 hover:border-secondary hover:text-secondary transition-colors uppercase"
                            >
                                Edit Entity
                            </button>
                        </div>

                         {/* Hover Effect */}
                         <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>
                ))}
                {filteredManufacturers.length === 0 && (
                    <div className="col-span-full p-8 text-center text-gray-500 font-mono text-xs border border-dashed border-gray-800">
                        NO RECORDS FOUND matching query.
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
                    <div className="mt-4 p-3 bg-accent/10 border border-accent text-accent font-mono text-xs">
                        ERROR: {errorMsg}
                    </div>
                )}
            </Modal>
        </div>
    );
}
