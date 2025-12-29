'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ConsoleDetails, Manufacturer } from '@/lib/types';
import { ConsoleForm } from '@/components/admin/ConsoleForm';
import Button from '@/components/ui/Button';

type EditorClientProps = {
    initialConsole: ConsoleDetails;
    initialManufacturers: Manufacturer[];
};

export default function AdminConsoleEditorClient({ initialConsole, initialManufacturers }: EditorClientProps) {
    const [consoleData] = useState<ConsoleDetails>(initialConsole);
    const [error, setError] = useState<string | null>(null);

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

            {/* Editor Area */}
            <div className="bg-bg-primary border border-border-normal p-6 shadow-lg relative mb-12">
                 <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(0,255,157,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                 <div className="relative z-10">
                    <ConsoleForm
                        initialData={consoleData}
                        manufacturers={initialManufacturers}
                        onConsoleCreated={() => {
                             // On update success logic (refresh or toast)
                        }}
                        onError={(msg) => setError(msg)}
                    />
                 </div>
            </div>

            {/* NEW VARIANTS SECTION */}
            <div className="mt-8 border-t border-dashed border-gray-800 pt-8">
                 <div className="flex justify-between items-center mb-6">
                     <h3 className="font-pixel text-lg text-white">HARDWARE VARIANTS</h3>
                     <Link href={`/admin?tab=VARIANTS&new_console_id=${consoleData.id}`}>
                        <Button variant="secondary" className="text-xs">
                            + ADD NEW VARIANT
                        </Button>
                     </Link>
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
                                     <div className="text-xs font-mono text-gray-500">
                                         Released: {variant.release_date || 'TBA'}
                                     </div>
                                 </div>
                                 <Link href={`/admin?mode=edit&type=variant&variant_id=${variant.id}`}>
                                     <Button variant="secondary" className="text-xs border-gray-600 text-gray-400 hover:border-white hover:text-white">
                                         EDIT SPECS
                                     </Button>
                                 </Link>
                             </div>
                         ))
                     ) : (
                         <div className="p-8 text-center border border-dashed border-gray-800 text-gray-600 font-mono text-xs">
                             NO VARIANTS DEFINED. ADD ONE TO DISPLAY SPECS.
                         </div>
                     )}
                 </div>
            </div>

        </div>
    );
}
