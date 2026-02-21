'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getVariantById, getManufacturerById, getConsoleById, fetchConsoleList, fetchRoadmapItems, deleteRoadmapItem, updateRoadmapItem } from '../../lib/api';
import { Manufacturer, ConsoleVariant, ConsoleDetails, RoadmapFeature } from '../../lib/types';
import { ManufacturerForm } from '../../components/admin/ManufacturerForm';
import { ConsoleForm } from '../../components/admin/ConsoleForm';
import { VariantForm } from '../../components/admin/VariantForm';
import { RoadmapForm } from '../../components/admin/RoadmapForm';
import Button from '../../components/ui/Button';

type AdminTab = 'CONSOLE' | 'VARIANTS' | 'FABRICATOR' | 'ROADMAP';

type AdminDashboardProps = {
    initialManufacturers: Manufacturer[];
    initialConsoles: { name: string, id: string }[];
    isAdmin: boolean;
};

export default function AdminDashboardClient({ initialManufacturers, initialConsoles, isAdmin }: AdminDashboardProps) {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<AdminTab>('CONSOLE');
    const [message, setMessage] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Shared Data
    const [manufacturers] = useState<Manufacturer[]>(initialManufacturers);
    const [consoleList, setConsoleList] = useState<{name: string, id: string}[]>(initialConsoles);

    // State for Workflow & Edit Mode
    const [newlyCreatedConsoleId, setNewlyCreatedConsoleId] = useState<string | null>(null);

    // Edit Objects
    const [editingVariant, setEditingVariant] = useState<ConsoleVariant | null>(null);
    const [editingManufacturer, setEditingManufacturer] = useState<Manufacturer | null>(null);
    const [editingConsoleFolder, setEditingConsoleFolder] = useState<ConsoleDetails | null>(null);

    // Roadmap State
    const [roadmapItems, setRoadmapItems] = useState<RoadmapFeature[]>([]);
    const [editingRoadmapItem, setEditingRoadmapItem] = useState<RoadmapFeature | null>(null);

    const loadRoadmap = async () => {
        const items = await fetchRoadmapItems();
        setRoadmapItems(items);
    };

    useEffect(() => {
        if (activeTab === 'ROADMAP') {
            loadRoadmap();
        }
    }, [activeTab]);

    // Check for URL edit modes on mount
    useEffect(() => {
        const checkParams = async () => {
            if (!isAdmin) return;

            const mode = searchParams?.get('mode');
            const type = searchParams?.get('type');
            const id = searchParams?.get('id');

            // Check for new console ID passed via URL (from Editor)
            const newConsoleId = searchParams?.get('new_console_id');
            if (newConsoleId) {
                setNewlyCreatedConsoleId(newConsoleId);
            }

            // 1. Edit Variant
            const variantId = searchParams?.get('variant_id') || (type === 'variant' ? id : null);
            if (mode === 'edit' && variantId) {
                const variantData = await getVariantById(variantId);
                if (variantData) {
                    setEditingVariant(variantData);
                    setNewlyCreatedConsoleId(variantData.console_id);
                    setActiveTab('VARIANTS');
                    setMessage(`EDIT MODE ACTIVE: ${variantData.variant_name}`);
                } else {
                    setErrorMsg("FAILED TO FETCH VARIANT FOR EDITING.");
                }
            }
            // 2. Edit Fabricator
            else if (mode === 'edit' && type === 'fabricator' && id) {
                 const manu = await getManufacturerById(id);
                 if (manu) {
                     setEditingManufacturer(manu);
                     setActiveTab('FABRICATOR');
                     setMessage(`EDITING FABRICATOR: ${manu.name}`);
                 } else {
                     setErrorMsg("FAILED TO FETCH FABRICATOR.");
                 }
            }
            // 3. Edit Console Folder
            else if (mode === 'edit' && type === 'console' && id) {
                 const cons = await getConsoleById(id);
                 if (cons) {
                     setEditingConsoleFolder(cons);
                     setActiveTab('CONSOLE');
                     setMessage(`EDITING CONSOLE IDENTITY: ${cons.name}`);
                 } else {
                     setErrorMsg("FAILED TO FETCH CONSOLE FOLDER.");
                 }
            }
            // 4. Tab Navigation
            else {
                const tabParam = searchParams?.get('tab');
                if (tabParam && ['CONSOLE', 'VARIANTS', 'FABRICATOR'].includes(tabParam)) {
                    setActiveTab(tabParam as AdminTab);
                }
            }
        };
        checkParams();
    }, [searchParams, isAdmin]);

    const handleConsoleCreated = (id: string, name: string) => {
        if (editingConsoleFolder) {
            setMessage(`CONSOLE FOLDER UPDATED: "${name}"`);
            // Optional: exit edit mode?
            // setEditingConsoleFolder(null);
        } else {
            setNewlyCreatedConsoleId(id);
            // Refresh list so the new console appears in dropdowns immediately
            fetchConsoleList().then((list) => setConsoleList(list as any));
            setActiveTab('VARIANTS');
            setMessage(`FOLDER CREATED: "${name}". NOW ADD SPECS.`);
        }
    };

    const clearEditMode = () => {
        setEditingVariant(null);
        setEditingManufacturer(null);
        setEditingConsoleFolder(null);
        setEditingRoadmapItem(null);
        setNewlyCreatedConsoleId(null);
        setMessage(null);
        setErrorMsg(null);
        window.history.replaceState(null, '', '/admin');
    };

    const handleTabChange = (tab: AdminTab) => {
        setActiveTab(tab);
        clearEditMode();
    };

    const handleFinishItem = async (item: RoadmapFeature) => {
        if (!confirm(`Mark "${item.title}" as completed?`)) return;

        try {
            await updateRoadmapItem(item.id, {
                status: 'completed',
                target_date: new Date().toISOString()
            });
            setMessage(`MISSION COMPLETED: ${item.title}`);
            loadRoadmap();
        } catch (e: any) {
            setErrorMsg(e.message || "Failed to complete item");
        }
    };

    if (!isAdmin) return <div className="p-8 text-center font-mono text-accent border-2 border-accent m-8">ACCESS DENIED. ADMIN CLEARANCE REQUIRED.</div>;

    const tabs: AdminTab[] = ['CONSOLE', 'VARIANTS', 'FABRICATOR', 'ROADMAP'];

    return (
        <div className="w-full max-w-7xl mx-auto p-4 animate-fadeIn">

            {/* RESTORED HEADER AESTHETIC */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b-2 border-border-normal pb-6 gap-4">
                <div>
                    <h1 className="text-4xl md:text-6xl font-pixel text-secondary mb-2 drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
                        ROOT TERMINAL
                    </h1>
                    <div className="flex gap-4">
                        <p className="font-mono text-xs text-gray-500 tracking-widest">
                            // SECURE DATABASE CONNECTION ESTABLISHED
                        </p>
                    </div>
                </div>

                {/* NEW INDEX LINK */}
                <div className="flex items-center gap-4">
                     <Link href="/admin/consoles">
                        <Button variant="secondary" className="font-pixel text-xs px-4 py-2 border-2 border-secondary hover:bg-secondary hover:text-black transition-colors shadow-[0_0_15px_rgba(0,255,136,0.3)]">
                            &gt; CONSOLE INDEX
                        </Button>
                     </Link>
                    <div className="bg-black border border-cyan-400 px-3 py-1 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                        <span className="font-pixel text-[10px] text-cyan-400 tracking-widest animate-pulse">
                            ADMIN_MODE_ACTIVE
                        </span>
                    </div>
                </div>
            </div>

            {/* Messages */}
            {message && (
                <div className="bg-secondary/10 border border-secondary text-secondary p-4 mb-6 font-mono font-bold animate-pulse">
                    &gt; {message}
                </div>
            )}
            {errorMsg && (
                <div className="bg-accent/10 border border-accent text-accent p-4 mb-6 font-mono font-bold">
                    &gt; ERROR: {errorMsg}
                </div>
            )}

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-8 border-b border-border-normal pb-1">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={`font-mono text-sm px-4 py-2 border-t border-l border-r transition-all ${
                            activeTab === tab
                            ? 'bg-bg-primary text-secondary border-secondary -mb-[1px] font-bold'
                            : 'bg-black text-gray-500 border-gray-800 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {/* Dynamic Label based on Edit Mode */}
                        {tab === 'VARIANTS' && editingVariant ? 'EDIT VARIANT' :
                         tab === 'FABRICATOR' && editingManufacturer ? 'EDIT FABRICATOR' :
                         tab === 'CONSOLE' && editingConsoleFolder ? 'EDIT CONSOLE' :
                         tab === 'ROADMAP' ? 'SYSTEM ROADMAP' :
                         tab}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-bg-primary border border-border-normal p-6 min-h-[500px] shadow-lg relative">

                <div className="relative z-10">

                    {activeTab === 'CONSOLE' && (
                        <div>
                            <h2 className="font-pixel text-xl text-white mb-6">
                                {editingConsoleFolder ? `EDITING: ${editingConsoleFolder.name}` : 'NEW CONSOLE FOLDER'}
                            </h2>
                            <ConsoleForm
                                initialData={editingConsoleFolder}
                                manufacturers={manufacturers}
                                onConsoleCreated={handleConsoleCreated}
                                onError={setErrorMsg}
                            />
                            {editingConsoleFolder && (
                                <div className="mt-4 pt-4 border-t border-dashed border-gray-700">
                                    <Button variant="secondary" onClick={clearEditMode} className="text-xs">
                                        CANCEL EDITING
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'VARIANTS' && (
                        <div>
                            <h2 className="font-pixel text-xl text-white mb-6">
                                {editingVariant ? `EDITING: ${editingVariant.variant_name}` : 'HARDWARE SPECIFICATIONS'}
                            </h2>
                            <VariantForm
                                consoleList={consoleList}
                                preSelectedConsoleId={newlyCreatedConsoleId}
                                initialData={editingVariant}
                                onSuccess={(msg) => {
                                    setMessage(msg);
                                    if (editingVariant) {
                                        // Exit edit mode on success
                                        setTimeout(() => {
                                            clearEditMode();
                                        }, 1500);
                                    }
                                }}
                                onError={setErrorMsg}
                            />
                            {editingVariant && (
                                <div className="mt-4 pt-4 border-t border-dashed border-gray-700">
                                    <Button variant="secondary" onClick={clearEditMode} className="text-xs">
                                        CANCEL EDITING
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'FABRICATOR' && (
                        <div>
                            <h2 className="font-pixel text-xl text-white mb-6">
                                {editingManufacturer ? `EDITING: ${editingManufacturer.name}` : 'REGISTER FABRICATOR'}
                            </h2>
                            <ManufacturerForm
                                initialData={editingManufacturer}
                                onSuccess={setMessage}
                                onError={setErrorMsg}
                            />
                            {editingManufacturer && (
                                <div className="mt-4 pt-4 border-t border-dashed border-gray-700">
                                    <Button variant="secondary" onClick={clearEditMode} className="text-xs">
                                        CANCEL EDITING
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'ROADMAP' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Left Column: Form (Create or Edit) */}
                            <div className="lg:col-span-1 border-r border-white/10 pr-8">
                                <h2 className="font-pixel text-lg text-white mb-6">
                                    {editingRoadmapItem ? `EDITING: ${editingRoadmapItem.title}` : 'ADD NEW MISSION'}
                                </h2>

                                <RoadmapForm
                                    initialData={editingRoadmapItem}
                                    onSuccess={(msg) => {
                                        setMessage(msg);
                                        loadRoadmap();
                                        setEditingRoadmapItem(null);
                                    }}
                                    onError={setErrorMsg}
                                />

                                {editingRoadmapItem && (
                                    <div className="mt-4">
                                        <Button variant="secondary" onClick={() => setEditingRoadmapItem(null)} className="w-full text-xs">
                                            CANCEL EDITING
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Right Column: List */}
                            <div className="lg:col-span-2">
                                <h2 className="font-pixel text-lg text-white mb-6">
                                    MISSION LOG // <span className="text-secondary">{roadmapItems.length}</span>
                                </h2>

                                <div className="grid gap-2 max-h-[600px] overflow-y-auto pr-2">
                                    {roadmapItems.map(item => (
                                        <div key={item.id} className={`flex items-center justify-between p-3 border transition-colors group ${
                                            editingRoadmapItem?.id === item.id
                                            ? 'bg-secondary/10 border-secondary'
                                            : 'bg-white/5 border-white/10 hover:border-secondary'
                                        }`}>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider min-w-[80px] text-center ${
                                                    item.status === 'completed' ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-900' :
                                                    item.status === 'in-progress' ? 'bg-blue-900/50 text-blue-400 border border-blue-900' :
                                                    'bg-gray-800/50 text-gray-400 border border-gray-700'
                                                }`}>
                                                    {item.status}
                                                </span>
                                                <div>
                                                    <div className="font-mono text-sm text-white font-bold">{item.title}</div>
                                                    <div className="text-[10px] text-gray-500 uppercase flex gap-2">
                                                        <span>{item.category}</span>
                                                        {item.target_date && <span>// DUE: {new Date(item.target_date).toLocaleDateString()}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {item.status !== 'completed' && (
                                                    <button onClick={() => handleFinishItem(item)} className="text-[10px] font-mono border border-emerald-900 bg-emerald-900/20 text-emerald-400 hover:bg-emerald-900/40 px-2 py-1 uppercase tracking-wider">
                                                        Finish
                                                    </button>
                                                )}
                                                <button onClick={() => setEditingRoadmapItem(item)} className="text-[10px] font-mono border border-blue-900 bg-blue-900/20 text-blue-400 hover:bg-blue-900/40 px-2 py-1 uppercase tracking-wider">
                                                    Edit
                                                </button>
                                                <button onClick={async () => {
                                                    if(confirm('Delete this item?')) {
                                                        await deleteRoadmapItem(item.id);
                                                        loadRoadmap();
                                                    }
                                                }} className="text-[10px] font-mono border border-red-900 bg-red-900/20 text-red-400 hover:bg-red-900/40 px-2 py-1 uppercase tracking-wider">
                                                    Del
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {roadmapItems.length === 0 && (
                                        <div className="text-center py-8 text-gray-600 font-mono text-xs uppercase">
                                            // NO MISSIONS FOUND IN DATABASE
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
