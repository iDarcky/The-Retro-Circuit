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
                    <Link href={`/consoles/${consoleData.slug}`} target="_blank">
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
            <div className="bg-bg-primary border border-border-normal p-6 shadow-lg relative">
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
