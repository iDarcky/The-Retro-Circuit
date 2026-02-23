'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ConsoleDetails, Manufacturer, ConsoleVariant } from '@/lib/types';
import { ConsoleForm } from '@/components/admin/ConsoleForm';
import { VariantForm } from '@/components/admin/VariantForm';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

type EditorClientProps = {
    initialConsole: ConsoleDetails;
    initialManufacturers: Manufacturer[];
};

export default function AdminConsoleEditorClient({ initialConsole, initialManufacturers }: EditorClientProps) {
    const router = useRouter();
    const [consoleData, setConsoleData] = useState<ConsoleDetails>(initialConsole);
    const [error, setError] = useState<string | null>(null);

    // Variant Modal State
    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
    const [editingVariant, setEditingVariant] = useState<ConsoleVariant | null>(null);
    const [variantError, setVariantError] = useState<string | null>(null);

    useEffect(() => {
        setConsoleData(initialConsole);
    }, [initialConsole]);

    const handleOpenCreateVariant = () => {
        setEditingVariant(null);
        setVariantError(null);
        setIsVariantModalOpen(true);
    };

    const handleOpenEditVariant = (variant: ConsoleVariant) => {
        setEditingVariant(variant);
        setVariantError(null);
        setIsVariantModalOpen(true);
    };

    const handleVariantSuccess = (_msg: string) => {
        setIsVariantModalOpen(false);
        router.refresh();
        // Optional: Show toast or success message
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/10 pb-6 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-mono font-bold text-white mb-2 uppercase tracking-tighter">
                        Edit Console
                    </h1>
                    <div className="flex gap-4 items-center">
                        <Link href="/admin/consoles" className="font-mono text-xs text-zinc-500 hover:text-white hover:underline uppercase">
                            &lt; Back to Index
                        </Link>
                        <span className="font-mono text-xs text-zinc-700">|</span>
                        <p className="font-mono text-xs text-zinc-400 tracking-widest uppercase">
                            TARGET: {consoleData.name}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {/* UPDATED LINK: Points to new Admin Preview Route */}
                    <Link href={`/admin/preview/consoles/${consoleData.slug}`} target="_blank">
                        <Button variant="swiss" className="text-xs">
                             PREVIEW [↗]
                        </Button>
                    </Link>
                </div>
            </div>

            {error && (
                <div className="p-4 mb-4 border border-red-500 bg-red-500/10 text-red-500 font-mono text-xs">
                    ERROR: {error}
                </div>
            )}

            {/* Editor Area */}
            <div className="bg-bg-primary border border-white/10 p-6 relative mb-12">
                 <div className="relative z-10">
                    <ConsoleForm
                        initialData={consoleData}
                        manufacturers={initialManufacturers}
                        onConsoleCreated={() => {
                             // On update success logic
                             router.refresh();
                        }}
                        onError={(msg) => setError(msg)}
                    />
                 </div>
            </div>

            {/* NEW VARIANTS SECTION */}
            <div className="mt-8 border-t border-white/10 pt-8">
                 <div className="flex justify-between items-center mb-6">
                     <h3 className="font-mono font-bold text-lg text-white uppercase tracking-tighter">Hardware Variants</h3>
                     <Button variant="swiss" className="text-xs" onClick={handleOpenCreateVariant}>
                        + ADD NEW VARIANT
                     </Button>
                 </div>

                 <div className="grid grid-cols-1 gap-4">
                     {consoleData.variants && consoleData.variants.length > 0 ? (
                         consoleData.variants.map((variant) => (
                             <div key={variant.id} className="bg-bg-primary border border-white/10 p-4 flex justify-between items-center hover:border-white transition-colors group">
                                 <div>
                                     <div className="font-mono font-bold text-white mb-1 uppercase text-sm">
                                         {variant.variant_name}
                                         {variant.is_default && <span className="ml-2 text-[10px] bg-white text-black px-1.5 py-0.5 font-bold">DEFAULT</span>}
                                     </div>
                                     <div className="text-[10px] font-mono text-zinc-500 uppercase">
                                         Released: {variant.release_date || 'TBA'}
                                     </div>
                                 </div>
                                 <button
                                    className="text-[10px] font-mono border border-white/10 text-zinc-400 px-3 py-1.5 hover:bg-white hover:text-black hover:border-white transition-colors uppercase tracking-widest"
                                    onClick={() => handleOpenEditVariant(variant)}
                                 >
                                     [ EDIT SPECS ]
                                 </button>
                             </div>
                         ))
                     ) : (
                         <div className="p-8 text-center border border-dashed border-zinc-800 text-zinc-600 font-mono text-xs uppercase tracking-widest">
                             NO VARIANTS DEFINED. ADD ONE TO DISPLAY SPECS.
                         </div>
                     )}
                 </div>
            </div>

            {/* Variant Modal */}
            <Modal
                isOpen={isVariantModalOpen}
                onClose={() => setIsVariantModalOpen(false)}
                title={editingVariant ? `EDIT SPECS: ${editingVariant.variant_name}` : "DEFINE NEW HARDWARE SPECS"}
            >
                <VariantForm
                    consoleList={[{ name: consoleData.name, id: consoleData.id }]}
                    preSelectedConsoleId={consoleData.id}
                    initialData={editingVariant}
                    onSuccess={handleVariantSuccess}
                    onError={setVariantError}
                />
                 {variantError && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500 text-red-500 font-mono text-xs uppercase font-bold">
                        ERROR: {variantError}
                    </div>
                )}
            </Modal>
        </div>
    );
}
