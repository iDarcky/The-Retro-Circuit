
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { retroAuth } from '../../lib/auth';
import { fetchManufacturers, fetchConsoleList, getVariantById, getManufacturerById, getConsoleById } from '../../lib/api';
import { Manufacturer, ConsoleVariant, ConsoleDetails } from '../../lib/types';
import { NewsForm } from '../../components/admin/NewsForm';
import { ManufacturerForm } from '../../components/admin/ManufacturerForm';
import { ConsoleForm } from '../../components/admin/ConsoleForm';
import { VariantForm } from '../../components/admin/VariantForm';
import { GameForm } from '../../components/admin/GameForm';
import { SettingsForm } from '../../components/admin/SettingsForm';
import Button from '../../components/ui/Button';

type AdminTab = 'NEWS' | 'GAME' | 'CONSOLE' | 'VARIANTS' | 'FABRICATOR' | 'SETTINGS';

function AdminPortalContent() {
    const searchParams = useSearchParams();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<AdminTab>('NEWS');
    const [message, setMessage] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    
    // Shared Data
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [consoleList, setConsoleList] = useState<{name: string, id: string}[]>([]);
    const [customLogo, setCustomLogo] = useState<string | null>(null);

    // State for Workflow & Edit Mode
    const [newlyCreatedConsoleId, setNewlyCreatedConsoleId] = useState<string | null>(null);
    
    // Edit Objects
    const [editingVariant, setEditingVariant] = useState<ConsoleVariant | null>(null);
    const [editingManufacturer, setEditingManufacturer] = useState<Manufacturer | null>(null);
    const [editingConsoleFolder, setEditingConsoleFolder] = useState<ConsoleDetails | null>(null);

    // Initial Auth & Data Load
    useEffect(() => {
        const check = async () => {
            try {
                const admin = await retroAuth.isAdmin();
                setIsAdmin(admin);
                
                if (admin) {
                    // Fetch initial data
                    const [manus, consoles] = await Promise.all([
                        fetchManufacturers(),
                        fetchConsoleList()
                    ]);
                    setManufacturers(manus);
                    setConsoleList(consoles as any);
                    
                    const savedLogo = localStorage.getItem('retro_custom_logo');
                    if (savedLogo) setCustomLogo(savedLogo);

                    // --- CHECK FOR EDIT MODE IN URL ---
                    const mode = searchParams?.get('mode');
                    const type = searchParams?.get('type');
                    const id = searchParams?.get('id');

                    // 1. Edit Variant (Supports old param 'variant_id' or new generic 'type=variant&id=...')
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
                        if (tabParam && ['NEWS', 'GAME', 'CONSOLE', 'VARIANTS', 'FABRICATOR', 'SETTINGS'].includes(tabParam)) {
                            setActiveTab(tabParam as AdminTab);
                        }
                    }
                }
            } catch (err) {
                console.error("Admin Check Failed", err);
            } finally {
                setLoading(false);
            }
        };
        check();
    }, [searchParams]);

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

    const handleLogoUpdate = (base64: string | null) => {
        setCustomLogo(base64);
    };

    const clearEditMode = () => {
        setEditingVariant(null);
        setEditingManufacturer(null);
        setEditingConsoleFolder(null);
        setNewlyCreatedConsoleId(null);
        setMessage(null);
        setErrorMsg(null);
        window.history.replaceState(null, '', '/admin');
    };

    const handleTabChange = (tab: AdminTab) => {
        setActiveTab(tab);
        clearEditMode();
    };

    if (loading) return <div className="p-8 text-center font-mono text-retro-neon">VERIFYING BIOMETRICS...</div>;
    if (!isAdmin) return <div className="p-8 text-center font-mono text-retro-pink border-2 border-retro-pink m-8">ACCESS DENIED. ADMIN CLEARANCE REQUIRED.</div>;

    const tabs: AdminTab[] = ['NEWS', 'GAME', 'CONSOLE', 'VARIANTS', 'FABRICATOR', 'SETTINGS'];

    return (
        <div className="w-full max-w-7xl mx-auto p-4 animate-fadeIn">
            
            {/* RESTORED HEADER AESTHETIC */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b-2 border-retro-grid pb-6 gap-4">
                <div>
                    <h1 className="text-4xl md:text-6xl font-pixel text-retro-neon mb-2 drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
                        ROOT TERMINAL
                    </h1>
                    <p className="font-mono text-xs text-gray-500 tracking-widest">
                        // SECURE DATABASE CONNECTION ESTABLISHED
                    </p>
                </div>
                <div className="bg-black border border-cyan-400 px-3 py-1 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                    <span className="font-pixel text-[10px] text-cyan-400 tracking-widest animate-pulse">
                        ADMIN_MODE_ACTIVE
                    </span>
                </div>
            </div>

            {/* Messages */}
            {message && (
                <div className="bg-retro-neon/10 border border-retro-neon text-retro-neon p-4 mb-6 font-mono font-bold animate-pulse">
                    &gt; {message}
                </div>
            )}
            {errorMsg && (
                <div className="bg-retro-pink/10 border border-retro-pink text-retro-pink p-4 mb-6 font-mono font-bold">
                    &gt; ERROR: {errorMsg}
                </div>
            )}

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-8 border-b border-retro-grid pb-1">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={`font-mono text-sm px-4 py-2 border-t border-l border-r transition-all ${
                            activeTab === tab 
                            ? 'bg-retro-dark text-retro-neon border-retro-neon -mb-[1px] font-bold' 
                            : 'bg-black text-gray-500 border-gray-800 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {/* Dynamic Label based on Edit Mode */}
                        {tab === 'VARIANTS' && editingVariant ? 'EDIT VARIANT' : 
                         tab === 'FABRICATOR' && editingManufacturer ? 'EDIT FABRICATOR' :
                         tab === 'CONSOLE' && editingConsoleFolder ? 'EDIT CONSOLE' :
                         tab}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-retro-dark border border-retro-grid p-6 min-h-[500px] shadow-lg relative">
                
                {/* Background Grid */}
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(0,255,157,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                <div className="relative z-10">

                    {activeTab === 'NEWS' && (
                        <div>
                            <h2 className="font-pixel text-xl text-white mb-6">TRANSMIT SIGNAL</h2>
                            <NewsForm onSuccess={setMessage} onError={setErrorMsg} />
                        </div>
                    )}

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

                    {activeTab === 'GAME' && (
                        <div>
                            <h2 className="font-pixel text-xl text-white mb-6">ARCHIVE GAME</h2>
                            <GameForm onSuccess={setMessage} onError={setErrorMsg} />
                        </div>
                    )}

                    {activeTab === 'SETTINGS' && (
                        <div>
                            <h2 className="font-pixel text-xl text-white mb-6">SYSTEM CONFIG</h2>
                            <SettingsForm 
                                customLogo={customLogo} 
                                onLogoUpdate={handleLogoUpdate}
                                onSuccess={setMessage} 
                            />
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default AdminPortalContent;
