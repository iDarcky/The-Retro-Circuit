
'use client';

import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import { retroAuth } from '../../lib/auth';
import { addGame, addConsole, addNewsItem, fetchManufacturers, addManufacturer, fetchConsoleList, addConsoleVariant } from '../../lib/api';
import Button from '../../components/ui/Button';
import { NewsItem, NewsItemSchema, GameSchema, ConsoleSchema, ConsoleSpecsSchema, Manufacturer, ManufacturerSchema, ConsoleVariantSchema, VARIANT_FORM_GROUPS, CONSOLE_FORM_FIELDS, CONSOLE_SPECS_FORM_FIELDS, MANUFACTURER_FORM_FIELDS } from '../../lib/types';

type AdminTab = 'NEWS' | 'GAME' | 'CONSOLE' | 'VARIANTS' | 'MANUFACTURER' | 'SETTINGS';

// Extracted Component to prevent re-render focus loss
const RenderInput = ({ field, value, onChange }: { 
    field: { label: string, key: string, type: string, required?: boolean, step?: string },
    value: any,
    onChange: (key: string, val: any) => void
}) => {
    const val = value || (field.type === 'checkbox' ? false : '');
    
    if (field.type === 'textarea') {
        return (
            <div className="col-span-1 md:col-span-2">
                <label className="text-[10px] text-gray-500 mb-1 block uppercase">{field.label}</label>
                <textarea 
                    className="w-full bg-black border border-gray-700 p-3 h-24 focus:border-retro-neon outline-none font-mono text-sm"
                    value={val}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    required={field.required}
                />
            </div>
        );
    }

    if (field.type === 'checkbox') {
            return (
            <div className="flex items-center gap-3 border border-gray-800 p-3 bg-black">
                <input 
                    type="checkbox"
                    className="accent-retro-neon w-4 h-4"
                    checked={!!val}
                    onChange={(e) => onChange(field.key, e.target.checked)}
                />
                <label className="text-xs text-gray-300 uppercase cursor-pointer" onClick={() => onChange(field.key, !val)}>{field.label}</label>
            </div>
        );
    }

    return (
        <div>
            <label className="text-[10px] text-gray-500 mb-1 block uppercase">{field.label}</label>
            <input 
                type={field.type}
                step={field.step}
                className="w-full bg-black border border-gray-700 p-3 focus:border-retro-neon outline-none text-white font-mono"
                value={val}
                onChange={(e) => onChange(field.key, e.target.value)}
                required={field.required}
            />
        </div>
    );
};

export default function AdminPortalPage() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<AdminTab>('NEWS');
    const [message, setMessage] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [consoleList, setConsoleList] = useState<{name: string, id: string}[]>([]);

    // Generic Form State (Mapped by key)
    const [formData, setFormData] = useState<Record<string, any>>({});

    const handleInputChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    // News Form State
    const [newsHeadline, setNewsHeadline] = useState('');
    const [newsSummary, setNewsSummary] = useState('');
    const [newsCategory, setNewsCategory] = useState<NewsItem['category']>('Hardware');

    // Settings
    const [customLogo, setCustomLogo] = useState<string | null>(null);

    useEffect(() => {
        const check = async () => {
            const admin = await retroAuth.isAdmin();
            setIsAdmin(admin);
            if (admin) {
                const manus = await fetchManufacturers();
                setManufacturers(manus);
                const consoles = await fetchConsoleList();
                setConsoleList(consoles as any);
                const savedLogo = localStorage.getItem('retro_custom_logo');
                if (savedLogo) setCustomLogo(savedLogo);
            }
            setLoading(false);
        };
        check();
    }, []);

    const resetForms = () => {
        setFormData({});
        setNewsHeadline(''); setNewsSummary('');
    };

    const handleSubmitNews = async (e: FormEvent) => {
        e.preventDefault();
        setMessage(null); setErrorMsg(null);
        const result = NewsItemSchema.safeParse({ headline: newsHeadline, summary: newsSummary, category: newsCategory });
        if (!result.success) { setErrorMsg(result.error.issues[0].message); return; }
        setLoading(true);
        if (await addNewsItem({ ...result.data, date: new Date().toISOString() })) {
            setMessage("NEWS TRANSMITTED");
            resetForms();
        } else setErrorMsg("TRANSMISSION FAILED");
        setLoading(false);
    };

    const handleSubmitManufacturer = async (e: FormEvent) => {
        e.preventDefault();
        setMessage(null); setErrorMsg(null);
        
        // Auto-generate slug if missing
        if (!formData.slug && formData.name) {
             formData.slug = formData.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        }

        const result = ManufacturerSchema.safeParse(formData);
        if (!result.success) { setErrorMsg(result.error.issues[0].message); return; }
        
        setLoading(true);
        const response = await addManufacturer(result.data as Omit<Manufacturer, 'id'>);
        if (response.success) {
            setMessage("CORPORATION REGISTERED");
            setManufacturers(await fetchManufacturers()); 
            resetForms();
        } else {
            setErrorMsg(`REGISTRATION FAILED: ${response.message}`);
        }
        setLoading(false);
    }

    const handleSubmitConsole = async (e: FormEvent) => {
        e.preventDefault();
        setMessage(null); setErrorMsg(null);

        if (!formData.slug && formData.name) {
             formData.slug = formData.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        }

        // Split data into Console and Specs
        const consoleData: any = { manufacturer_id: formData.manufacturer_id };
        CONSOLE_FORM_FIELDS.forEach(f => { if(formData[f.key]) consoleData[f.key] = formData[f.key]; });
        
        const specsData: any = {};
        CONSOLE_SPECS_FORM_FIELDS.forEach(f => { if(formData[f.key]) specsData[f.key] = formData[f.key]; });

        const consoleResult = ConsoleSchema.safeParse(consoleData);
        if (!consoleResult.success) { setErrorMsg(`CONSOLE: ${consoleResult.error.issues[0].message}`); return; }

        const specsResult = ConsoleSpecsSchema.safeParse(specsData);
        if(!specsResult.success) { setErrorMsg(`SPECS: ${specsResult.error.issues[0].message}`); return; }

        setLoading(true);
        const response = await addConsole(consoleResult.data as any, specsResult.data as any);
        if (response.success) {
            setMessage("HARDWARE & SPECS REGISTERED");
            setConsoleList(await fetchConsoleList() as any);
            resetForms();
        } else {
            setErrorMsg(`REGISTRATION FAILED: ${response.message}`);
        }
        setLoading(false);
    };

    const handleSubmitVariant = async (e: FormEvent) => {
        e.preventDefault();
        setMessage(null); setErrorMsg(null);

        const rawVariant = { ...formData };
        if (!rawVariant.slug && rawVariant.variant_name) {
             rawVariant.slug = rawVariant.variant_name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        }

        const result = ConsoleVariantSchema.safeParse(rawVariant);
        if (!result.success) { setErrorMsg(result.error.issues[0].message); return; }

        setLoading(true);
        const response = await addConsoleVariant(result.data as any);
        if (response.success) {
            setMessage("VARIANT MODEL REGISTERED");
            resetForms();
        } else {
            setErrorMsg(`VARIANT FAILED: ${response.message}`);
        }
        setLoading(false);
    };

    const handleSubmitGame = async (e: FormEvent) => {
        e.preventDefault();
        setMessage(null); setErrorMsg(null);
        
        if (!formData.slug && formData.title) {
             formData.slug = formData.title.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        }
        
        const result = GameSchema.safeParse(formData);
        if (!result.success) { setErrorMsg(result.error.issues[0].message); return; }
        
        setLoading(true);
        if (await addGame(result.data)) {
            setMessage("GAME ARCHIVED");
            resetForms();
        } else setErrorMsg("ARCHIVAL FAILED");
        setLoading(false);
    };

    const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setCustomLogo(base64String);
                localStorage.setItem('retro_custom_logo', base64String);
                setMessage("LOGO UPDATED SUCCESSFULLY. (Local Override)");
                window.dispatchEvent(new Event('storage'));
                setTimeout(() => window.location.reload(), 1000);
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) return <div className="p-10 text-center font-mono text-retro-neon">VERIFYING CLEARANCE...</div>;

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-red-600 font-pixel flex-col gap-4">
                <div className="text-6xl">ACCESS DENIED</div>
                <div className="font-mono text-white">SECURITY LEVEL TOO LOW</div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-4 font-mono text-gray-300">
            <div className="border-b-4 border-retro-neon pb-4 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <h1 className="text-3xl md:text-4xl font-pixel text-retro-neon">ROOT TERMINAL</h1>
                <div className="text-xs text-retro-blue font-bold tracking-widest border border-retro-blue px-2 py-1">ADMIN_MODE_ACTIVE</div>
            </div>

            {message && <div className="bg-retro-grid border border-retro-neon text-retro-neon p-4 mb-6 animate-pulse shadow-[0_0_10px_rgba(0,255,157,0.2)]">&gt; {message}</div>}
            
            {errorMsg && (
                <div className="bg-red-900/30 border border-red-500 text-red-400 p-4 mb-6 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                    <div className="font-bold mb-1">⚠ ERROR</div>
                    <div className="break-words">{errorMsg}</div>
                </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex gap-2 md:gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {(['NEWS', 'MANUFACTURER', 'CONSOLE', 'VARIANTS', 'GAME', 'SETTINGS'] as AdminTab[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setMessage(null); setErrorMsg(null); resetForms(); }}
                        className={`flex-shrink-0 px-6 py-3 border-2 transition-all font-pixel text-xs md:text-sm ${activeTab === tab ? 'border-retro-neon text-retro-neon bg-retro-neon/10 shadow-[0_0_15px_rgba(0,255,157,0.2)]' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}
                    >
                        {tab === 'SETTINGS' ? 'SETTINGS' : `ADD ${tab}`}
                    </button>
                ))}
            </div>

            <div className="border-2 border-retro-grid p-4 md:p-8 bg-retro-dark shadow-xl min-h-[500px]">
                
                {/* --- NEWS TAB --- */}
                {activeTab === 'NEWS' && (
                    <form onSubmit={handleSubmitNews} className="space-y-4 max-w-2xl">
                        <input className="w-full bg-black border border-gray-700 p-3 focus:border-retro-neon outline-none" placeholder="Headline" value={newsHeadline} onChange={(e) => setNewsHeadline(e.target.value)} />
                        <select className="w-full bg-black border border-gray-700 p-3 focus:border-retro-neon outline-none" value={newsCategory} onChange={(e) => setNewsCategory(e.target.value as NewsItem['category'])}>
                            <option value="Hardware">Hardware</option>
                            <option value="Software">Software</option>
                            <option value="Industry">Industry</option>
                            <option value="Rumor">Rumor</option>
                        </select>
                        <textarea className="w-full bg-black border border-gray-700 p-3 h-32 focus:border-retro-neon outline-none" placeholder="Summary" value={newsSummary} onChange={(e) => setNewsSummary(e.target.value)} />
                        <div className="flex justify-end"><Button type="submit">TRANSMIT</Button></div>
                    </form>
                )}

                {/* --- MANUFACTURER TAB --- */}
                {activeTab === 'MANUFACTURER' && (
                    <form onSubmit={handleSubmitManufacturer} className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {MANUFACTURER_FORM_FIELDS.map(field => (
                                <RenderInput key={field.key} field={field} value={formData[field.key]} onChange={handleInputChange} />
                            ))}
                         </div>
                         <div className="flex justify-end pt-4"><Button type="submit">REGISTER ENTITY</Button></div>
                    </form>
                )}

                {/* --- CONSOLE TAB --- */}
                {activeTab === 'CONSOLE' && (
                    <form onSubmit={handleSubmitConsole} className="space-y-6">
                        <div className="mb-8">
                             <div className="text-xs text-retro-neon border-b border-gray-700 pb-2 mb-4 font-bold uppercase">I. Identity</div>
                             <div className="mb-4">
                                <label className="text-[10px] text-gray-500 mb-1 block uppercase">Manufacturer</label>
                                <select 
                                    className="w-full bg-black border border-gray-700 p-3 focus:border-retro-neon outline-none text-white" 
                                    value={formData.manufacturer_id || ''} 
                                    onChange={(e) => handleInputChange('manufacturer_id', e.target.value)}
                                    required
                                >
                                    <option value="">-- Select Manufacturer --</option>
                                    {manufacturers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </select>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {CONSOLE_FORM_FIELDS.map(field => (
                                    <RenderInput key={field.key} field={field} value={formData[field.key]} onChange={handleInputChange} />
                                ))}
                             </div>
                        </div>

                        <div>
                            <div className="text-xs text-retro-neon border-b border-gray-700 pb-2 mb-4 font-bold uppercase">II. Base Specifications</div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {CONSOLE_SPECS_FORM_FIELDS.map(field => (
                                    <RenderInput key={field.key} field={field} value={formData[field.key]} onChange={handleInputChange} />
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end pt-4"><Button type="submit">REGISTER HARDWARE</Button></div>
                    </form>
                )}

                {/* --- VARIANTS TAB --- */}
                {activeTab === 'VARIANTS' && (
                    <form onSubmit={handleSubmitVariant} className="space-y-8">
                        <div className="bg-retro-grid/10 p-4 border border-retro-grid">
                            <h3 className="text-sm font-bold text-retro-blue mb-2">INSTRUCTIONS</h3>
                            <p className="text-xs text-gray-400">
                                Select a parent console. Variants override base specs. Only fill fields that differ.
                            </p>
                        </div>

                        <div className="mb-4">
                            <label className="text-[10px] text-gray-500 mb-1 block uppercase">Parent Console</label>
                            <select 
                                className="w-full bg-black border border-gray-700 p-3 focus:border-retro-neon outline-none text-white" 
                                value={formData.console_id || ''} 
                                onChange={(e) => handleInputChange('console_id', e.target.value)}
                                required
                            >
                                <option value="">-- Select Console --</option>
                                {consoleList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        {VARIANT_FORM_GROUPS.map((group, idx) => (
                            <div key={idx} className="bg-black/30 p-4 border border-gray-800">
                                <div className="text-xs text-retro-neon border-b border-gray-700 pb-2 mb-4 font-bold uppercase">{group.title}</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {group.fields.map(field => (
                                        <RenderInput key={field.key} field={field} value={formData[field.key]} onChange={handleInputChange} />
                                    ))}
                                </div>
                            </div>
                        ))}
                        
                        <div className="flex justify-end pt-4"><Button type="submit">REGISTER VARIANT</Button></div>
                    </form>
                )}

                {/* --- GAME TAB --- */}
                {activeTab === 'GAME' && (
                     <form onSubmit={handleSubmitGame} className="space-y-4">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <RenderInput field={{ label: 'Title', key: 'title', type: 'text', required: true }} value={formData.title} onChange={handleInputChange} />
                             <RenderInput field={{ label: 'Slug (opt)', key: 'slug', type: 'text' }} value={formData.slug} onChange={handleInputChange} />
                             <RenderInput field={{ label: 'Developer', key: 'developer', type: 'text', required: true }} value={formData.developer} onChange={handleInputChange} />
                             <RenderInput field={{ label: 'Year', key: 'year', type: 'text', required: true }} value={formData.year} onChange={handleInputChange} />
                             <RenderInput field={{ label: 'Genre', key: 'genre', type: 'text', required: true }} value={formData.genre} onChange={handleInputChange} />
                             
                             <div className="flex gap-2">
                                <div className="flex-1">
                                    <RenderInput field={{ label: 'Console Slug', key: 'console_slug', type: 'text' }} value={formData.console_slug} onChange={handleInputChange} />
                                </div>
                                <div className="w-24">
                                    <RenderInput field={{ label: 'Rating (1-5)', key: 'rating', type: 'number' }} value={formData.rating} onChange={handleInputChange} />
                                </div>
                             </div>
                             
                             <div className="md:col-span-2">
                                <RenderInput field={{ label: 'Image URL', key: 'image', type: 'url' }} value={formData.image} onChange={handleInputChange} />
                             </div>
                             <div className="md:col-span-2">
                                 <RenderInput field={{ label: 'Review Content', key: 'content', type: 'textarea', required: true }} value={formData.content} onChange={handleInputChange} />
                             </div>
                             <div className="md:col-span-2">
                                 <RenderInput field={{ label: 'Why It Matters', key: 'whyItMatters', type: 'textarea', required: true }} value={formData.whyItMatters} onChange={handleInputChange} />
                             </div>
                         </div>
                         <div className="flex justify-end"><Button type="submit">ARCHIVE GAME</Button></div>
                     </form>
                )}

                {/* --- SETTINGS TAB --- */}
                {activeTab === 'SETTINGS' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="text-xs text-retro-neon border-b border-gray-700 pb-2 mb-4 font-bold uppercase tracking-widest">Global Assets</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <div className="space-y-4">
                                <label className="block text-sm font-bold mb-2 text-retro-blue">CUSTOM LOGO UPLOAD</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-mono file:bg-retro-grid file:text-retro-neon hover:file:bg-retro-neon hover:file:text-black"
                                />
                                {customLogo && (
                                    <div className="mt-4">
                                        <Button variant="danger" onClick={() => { localStorage.removeItem('retro_custom_logo'); setCustomLogo(null); window.location.reload(); }} className="text-xs">
                                            RESET TO DEFAULT LOGO
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <div className="bg-black/50 border border-gray-700 p-8 flex flex-col items-center justify-center min-h-[200px]">
                                <p className="text-[10px] text-gray-500 mb-4 uppercase tracking-widest">Preview</p>
                                {customLogo ? (
                                    <img src={customLogo} alt="Logo Preview" className="h-24 w-auto object-contain" />
                                ) : (
                                    <div className="text-gray-600 font-pixel text-sm">NO CUSTOM LOGO</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
