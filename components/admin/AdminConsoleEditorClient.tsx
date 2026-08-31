'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ConsoleDetails, Manufacturer, ConsoleVariant } from '@/lib/types';
import { deleteConsoleVariant } from '@/app/actions';
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
    const [error, _setError] = useState<string | null>(null);

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

    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDeleteVariant = async (variant: ConsoleVariant) => {
        const name = variant.variant_name || 'this variant';
        if (!window.confirm(`Delete "${name}"? Its specs, input profile and emulation grades go with it. This cannot be undone.`)) return;
        setDeletingId(variant.id);
        setVariantError(null);
        const res = await deleteConsoleVariant(variant.id);
        setDeletingId(null);
        if (res.success) router.refresh();
        else setVariantError(res.message || 'Delete failed.');
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
        <div className="w-full max-w-[1600px] mx-auto p-4 animate-fadeIn">
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
                    {/* UPDATED LINK: Points to new Admin Preview Route */}
                    <Link href={`/admin/preview/consoles/${consoleData.slug}`} target="_blank">
                        <Button variant="secondary" className="text-xs border border-gray-700 text-gray-400">
                             PREVIEW [↗]
                        </Button>
                    </Link>
                </div>
            </div>

            {error && (
                <div className="p-4 mb-4 border border-accent bg-accent/10 text-accent font-mono">
                    ERROR: {error}
                </div>
            )}

            {/* What stands between this draft and published, stated rather than inferred. */}
            {consoleData.status !== 'published' && (() => {
                const variants = consoleData.variants || [];
                const hasImage = Boolean(consoleData.image_url) || variants.some((v: any) => v.image_url);
                const hasPrice = variants.some((v: any) => (v.price_launch_usd ?? 0) > 0 || (v.price_avg_usd ?? 0) > 0);
                const blockers = [
                    !hasImage && 'No image',
                    variants.length === 0 && 'No variant',
                    variants.length > 0 && !hasPrice && 'No price',
                ].filter(Boolean) as string[];

                return (
                    <div className={`flex flex-wrap items-center gap-4 p-4 mb-6 border-l-[3px] ${
                        blockers.length === 0
                            ? 'border-l-secondary bg-secondary/[0.06]'
                            : 'border-l-primary bg-primary/[0.07]'
                    }`}>
                        <span className={`font-mono text-[10px] uppercase tracking-widest font-bold ${
                            blockers.length === 0 ? 'text-secondary' : 'text-primary'
                        }`}>
                            {blockers.length === 0 ? 'Ready to publish' : 'Blocking publish'}
                        </span>
                        <span className="flex flex-wrap gap-2">
                            {blockers.length === 0 ? (
                                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
                                    Set status to Published above
                                </span>
                            ) : blockers.map(b => (
                                <span key={b} className="font-mono text-[9px] uppercase tracking-widest border border-primary/50 text-primary px-2 py-1">
                                    {b}
                                </span>
                            ))}
                        </span>
                        <span className="ml-auto font-mono text-[9px] uppercase tracking-widest text-gray-600">
                            {variants.length} variant{variants.length === 1 ? '' : 's'}
                        </span>
                    </div>
                );
            })()}

            {/* Editor Area */}
            <div className="bg-bg-primary border border-border-normal p-6 shadow-lg relative mb-12">
                 <div className="relative z-10">
                    <ConsoleForm
                        initialData={consoleData}
                        manufacturers={initialManufacturers}
                    />
                 </div>
            </div>

            {/* NEW VARIANTS SECTION */}
            <div className="mt-8 border-t border-dashed border-gray-800 pt-8">
                 <div className="flex justify-between items-center mb-6">
                     <h3 className="font-pixel text-lg text-white">HARDWARE VARIANTS</h3>
                     <Button variant="secondary" className="text-xs" onClick={handleOpenCreateVariant}>
                        + ADD NEW VARIANT
                     </Button>
                 </div>

                 <div className="grid grid-cols-1 gap-4">
                     {consoleData.variants && consoleData.variants.length > 0 ? (
                         consoleData.variants.map((variant) => (
                             <div key={variant.id} className="bg-black/40 border border-border-normal p-4 flex justify-between items-center hover:border-secondary transition-colors">
                                 <div>
                                     <div className="font-bold text-white mb-1">
                                         {variant.variant_name}
                                         {variant.is_default && <span className="ml-2 text-[10px] bg-secondary text-black px-1.5 py-0.5 font-mono">DEFAULT</span>}
                                     </div>
                                     <div className="text-xs font-mono text-gray-500 flex flex-wrap items-center gap-3">
                                         <span>Released: {variant.release_date || 'TBA'}</span>
                                         {(() => {
                                             const v = variant as any;
                                             const checks = [
                                                 Boolean(v.soc_name || v.soc || v.cpu_model),
                                                 Boolean(v.ram_mb),
                                                 Boolean(v.screen_size_inch),
                                                 (v.price_launch_usd ?? 0) > 0 || (v.price_avg_usd ?? 0) > 0,
                                                 Boolean(v.emulation_profile || v.emulation_profiles),
                                             ];
                                             const done = checks.filter(Boolean).length;
                                             return (
                                                 <span className="flex items-center gap-2" title={`${done} of ${checks.length} spec groups filled`}>
                                                     <span className="flex gap-0.5" aria-hidden="true">
                                                         {checks.map((ok, i) => (
                                                             <span key={i} className={`w-2 h-2 ${
                                                                 ok ? (done === checks.length ? 'bg-secondary' : 'bg-amber-500') : 'bg-gray-800'
                                                             }`} />
                                                         ))}
                                                     </span>
                                                     <span className="tabular-nums text-gray-600">{done}/{checks.length}</span>
                                                 </span>
                                             );
                                         })()}
                                     </div>
                                 </div>
                                 <div className="flex items-center gap-2 shrink-0">
                                     <Button
                                        variant="secondary"
                                        className="text-xs border-gray-600 text-gray-400 hover:border-white hover:text-white"
                                        onClick={() => handleOpenEditVariant(variant)}
                                     >
                                         EDIT SPECS
                                     </Button>
                                     <button
                                        type="button"
                                        disabled={deletingId === variant.id}
                                        onClick={() => handleDeleteVariant(variant)}
                                        title="Delete this variant"
                                        className="px-3 py-2 border border-rose-500/30 text-rose-400 font-mono text-xs uppercase tracking-wider hover:bg-rose-500 hover:text-black hover:border-rose-500 transition-colors disabled:opacity-40"
                                     >
                                         {deletingId === variant.id ? '...' : 'DELETE'}
                                     </button>
                                 </div>
                             </div>
                         ))
                     ) : (
                         <div className="p-8 text-center border border-dashed border-gray-800 text-gray-600 font-mono text-xs">
                             NO VARIANTS DEFINED. ADD ONE TO DISPLAY SPECS.
                         </div>
                     )}
                 </div>
            </div>

            {/* Variant editor — full screen: the spec form is long and benefits from the
                extra width/height, and a stray backdrop click can't discard the form. */}
            <Modal
                isOpen={isVariantModalOpen}
                onClose={() => setIsVariantModalOpen(false)}
                fullScreen
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
                    <div className="mt-4 p-3 bg-accent/10 border border-accent text-accent font-mono text-xs">
                        ERROR: {variantError}
                    </div>
                )}
            </Modal>
        </div>
    );
}
