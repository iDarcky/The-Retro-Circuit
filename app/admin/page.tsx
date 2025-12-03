'use client';

import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import { retroAuth } from '../../lib/auth';
import { addGame, addConsole, addNewsItem, fetchManufacturers, addManufacturer } from '../../lib/api';
import Button from '../../components/ui/Button';
import { NewsItem, NewsItemSchema, GameSchema, ConsoleSchema, ConsoleSpecsSchema, Manufacturer, ManufacturerSchema } from '../../lib/types';

type AdminTab = 'NEWS' | 'GAME' | 'CONSOLE' | 'MANUFACTURER';

export default function AdminPortalPage() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<AdminTab>('NEWS');
    const [message, setMessage] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);

    // News Form
    const [newsHeadline, setNewsHeadline] = useState('');
    const [newsSummary, setNewsSummary] = useState('');
    const [newsCategory, setNewsCategory] = useState<NewsItem['category']>('Hardware');

    // Manufacturer Form
    const [manuName, setManuName] = useState('');
    const [manuFounded, setManuFounded] = useState('');
    const [manuOrigin, setManuOrigin] = useState('');
    const [manuWebsite, setManuWebsite] = useState('');
    const [manuDesc, setManuDesc] = useState('');
    const [manuFranchises, setManuFranchises] = useState('');
    const [manuLogo, setManuLogo] = useState('');

    // Game Form
    const [gameTitle, setGameTitle] = useState('');
    const [gameSlug, setGameSlug] = useState('');
    const [gameDev, setGameDev] = useState('');
    const [gameYear, setGameYear] = useState('');
    const [gameGenre, setGameGenre] = useState('');
    const [gameContent, setGameContent] = useState('');
    const [gameMatter, setGameMatter] = useState('');
    const [gameImage, setGameImage] = useState('');
    const [gameConsoleSlug, setGameConsoleSlug] = useState('');
    const [gameRating, setGameRating] = useState('5');

    // Console Form
    const [consoleName, setConsoleName] = useState('');
    const [consoleSlug, setConsoleSlug] = useState('');
    const [consoleManuId, setConsoleManuId] = useState('');
    const [consoleYear, setConsoleYear] = useState('1990');
    const [consoleType, setConsoleType] = useState('Home Console');
    const [consoleGen, setConsoleGen] = useState('4th Gen');
    const [consoleIntro, setConsoleIntro] = useState('');
    const [consoleImage, setConsoleImage] = useState('');
    
    // Console Specs Form
    const [specCpu, setSpecCpu] = useState('');
    const [specGpu, setSpecGpu] = useState('');
    const [specRam, setSpecRam] = useState('');
    const [specStorage, setSpecStorage] = useState('');
    const [specMedia, setSpecMedia] = useState('');
    const [specRes, setSpecRes] = useState('');
    const [specDisplay, setSpecDisplay] = useState('');
    const [specPorts, setSpecPorts] = useState('');
    const [specConn, setSpecConn] = useState('');
    const [specDim, setSpecDim] = useState('');
    const [specWeight, setSpecWeight] = useState('');
    const [specBattery, setSpecBattery] = useState('');
    const [specPower, setSpecPower] = useState('');
    const [specPrice, setSpecPrice] = useState('');
    const [specInflation, setSpecInflation] = useState('');
    const [specSold, setSpecSold] = useState('');
    const [specBestGame, setSpecBestGame] = useState('');

    useEffect(() => {
        const check = async () => {
            const admin = await retroAuth.isAdmin();
            setIsAdmin(admin);
            if (admin) {
                const manus = await fetchManufacturers();
                setManufacturers(manus);
            }
            setLoading(false);
        };
        check();
    }, []);

    const handleSubmitNews = async (e: FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setErrorMsg(null);
        const result = NewsItemSchema.safeParse({ headline: newsHeadline, summary: newsSummary, category: newsCategory });
        if (!result.success) { setErrorMsg(result.error.issues[0].message); return; }
        setLoading(true);
        if (await addNewsItem({ ...result.data, date: new Date().toISOString() })) {
            setMessage("NEWS TRANSMITTED");
            setNewsHeadline(''); setNewsSummary('');
        } else setErrorMsg("TRANSMISSION FAILED");
        setLoading(false);
    };

    const handleSubmitManufacturer = async (e: FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setErrorMsg(null);
        
        const raw = {
            name: manuName,
            founded_year: manuFounded,
            origin_country: manuOrigin,
            website: manuWebsite,
            description: manuDesc,
            key_franchises: manuFranchises,
            logo_url: manuLogo
        };
        const result = ManufacturerSchema.safeParse(raw);
        if (!result.success) { setErrorMsg(result.error.issues[0].message); return; }
        
        setLoading(true);
        if (await addManufacturer(result.data as Omit<Manufacturer, 'id'>)) {
            setMessage("CORPORATION REGISTERED");
            setManufacturers(await fetchManufacturers()); // Refresh list
            setManuName(''); setManuDesc('');
        } else setErrorMsg("REGISTRATION FAILED");
        setLoading(false);
    }

    const handleSubmitConsole = async (e: FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setErrorMsg(null);

        // 1. Validate Base Data
        const rawConsole = {
            name: consoleName,
            slug: consoleSlug || consoleName.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''),
            manufacturer_id: consoleManuId,
            release_year: consoleYear,
            form_factor: consoleType,
            generation: consoleGen,
            description: consoleIntro,
            image_url: consoleImage,
        };
        const consoleResult = ConsoleSchema.safeParse(rawConsole);
        if (!consoleResult.success) { setErrorMsg(consoleResult.error.issues[0].message); return; }

        // 2. Validate Specs
        const rawSpecs = {
            cpu: specCpu, gpu: specGpu, ram: specRam, storage: specStorage,
            display_type: specDisplay, resolution: specRes, media: specMedia,
            ports: specPorts, connectivity: specConn, dimensions: specDim,
            weight: specWeight, battery_life: specBattery, power_supply: specPower,
            launch_price: specPrice, launch_price_inflation: specInflation,
            units_sold: specSold, best_selling_game: specBestGame
        };
        const specsResult = ConsoleSpecsSchema.safeParse(rawSpecs);
        if(!specsResult.success) { setErrorMsg(specsResult.error.issues[0].message); return; }

        setLoading(true);
        if (await addConsole(consoleResult.data as any, specsResult.data as any)) {
            setMessage("HARDWARE & SPECS REGISTERED");
            setConsoleName('');
        } else setErrorMsg("REGISTRATION FAILED");
        setLoading(false);
    };

    const handleSubmitGame = async (e: FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setErrorMsg(null);
        
        const raw = {
            title: gameTitle,
            slug: gameSlug || gameTitle.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''),
            developer: gameDev,
            year: gameYear,
            genre: gameGenre,
            content: gameContent,
            whyItMatters: gameMatter,
            rating: parseInt(gameRating) || 5,
            image: gameImage,
            console_slug: gameConsoleSlug || undefined
        };
        
        const result = GameSchema.safeParse(raw);
        if (!result.success) { setErrorMsg(result.error.issues[0].message); return; }
        
        setLoading(true);
        if (await addGame(result.data)) {
            setMessage("GAME ARCHIVED");
            setGameTitle(''); setGameContent(''); setGameMatter('');
        } else setErrorMsg("ARCHIVAL FAILED");
        setLoading(false);
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
        <div className="max-w-5xl mx-auto p-4 font-mono text-gray-300">
            <div className="border-b-4 border-retro-neon pb-4 mb-8 flex justify-between items-end">
                <h1 className="text-4xl font-pixel text-retro-neon">ROOT TERMINAL</h1>
                <div className="text-xs text-retro-blue">ADMIN_MODE_ACTIVE</div>
            </div>

            {message && <div className="bg-retro-grid border border-retro-neon text-retro-neon p-4 mb-6 animate-pulse">&gt; {message}</div>}
            {errorMsg && <div className="bg-red-900/30 border border-red-500 text-red-400 p-4 mb-6">⚠ ERROR: {errorMsg}</div>}

            <div className="flex gap-4 mb-8 flex-wrap">
                {(['NEWS', 'GAME', 'CONSOLE', 'MANUFACTURER'] as AdminTab[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setMessage(null); setErrorMsg(null); }}
                        className={`px-4 py-2 border-2 ${activeTab === tab ? 'border-retro-neon text-retro-neon bg-retro-neon/10' : 'border-gray-700 text-gray-500'}`}
                    >
                        ADD {tab}
                    </button>
                ))}
            </div>

            <div className="border-2 border-retro-grid p-8 bg-retro-dark">
                {activeTab === 'NEWS' && (
                    <form onSubmit={handleSubmitNews} className="space-y-4">
                        <input className="w-full bg-black border border-gray-700 p-2" placeholder="Headline" value={newsHeadline} onChange={(e: ChangeEvent<HTMLInputElement>) => setNewsHeadline(e.target.value)} />
                        <select className="w-full bg-black border border-gray-700 p-2" value={newsCategory} onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewsCategory(e.target.value as NewsItem['category'])}>
                            <option value="Hardware">Hardware</option>
                            <option value="Software">Software</option>
                            <option value="Industry">Industry</option>
                            <option value="Rumor">Rumor</option>
                        </select>
                        <textarea className="w-full bg-black border border-gray-700 p-2 h-32" placeholder="Summary" value={newsSummary} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewsSummary(e.target.value)} />
                        <Button type="submit">TRANSMIT</Button>
                    </form>
                )}

                {activeTab === 'MANUFACTURER' && (
                    <form onSubmit={handleSubmitManufacturer} className="space-y-4 grid grid-cols-2 gap-4">
                        <input className="bg-black border border-gray-700 p-2" placeholder="Name (e.g. Nintendo)" value={manuName} onChange={(e: ChangeEvent<HTMLInputElement>) => setManuName(e.target.value)} required />
                        <input className="bg-black border border-gray-700 p-2" placeholder="Founded (e.g. 1889)" value={manuFounded} onChange={(e: ChangeEvent<HTMLInputElement>) => setManuFounded(e.target.value)} required />
                        <input className="bg-black border border-gray-700 p-2" placeholder="Origin (e.g. Kyoto, Japan)" value={manuOrigin} onChange={(e: ChangeEvent<HTMLInputElement>) => setManuOrigin(e.target.value)} required />
                        <input className="bg-black border border-gray-700 p-2" placeholder="Website" value={manuWebsite} onChange={(e: ChangeEvent<HTMLInputElement>) => setManuWebsite(e.target.value)} />
                        <input className="bg-black border border-gray-700 p-2" placeholder="Logo URL" value={manuLogo} onChange={(e: ChangeEvent<HTMLInputElement>) => setManuLogo(e.target.value)} />
                        <input className="bg-black border border-gray-700 p-2" placeholder="Key Franchises (comma separated)" value={manuFranchises} onChange={(e: ChangeEvent<HTMLInputElement>) => setManuFranchises(e.target.value)} />
                        <textarea className="bg-black border border-gray-700 p-2 col-span-2 h-32" placeholder="Description" value={manuDesc} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setManuDesc(e.target.value)} required />
                        <div className="col-span-2"><Button type="submit">REGISTER ENTITY</Button></div>
                    </form>
                )}

                {activeTab === 'GAME' && (
                    <form onSubmit={handleSubmitGame} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input className="bg-black border border-gray-700 p-2" placeholder="Title" value={gameTitle} onChange={(e: ChangeEvent<HTMLInputElement>) => setGameTitle(e.target.value)} required />
                            <input className="bg-black border border-gray-700 p-2" placeholder="Slug (optional)" value={gameSlug} onChange={(e: ChangeEvent<HTMLInputElement>) => setGameSlug(e.target.value)} />
                            <input className="bg-black border border-gray-700 p-2" placeholder="Developer" value={gameDev} onChange={(e: ChangeEvent<HTMLInputElement>) => setGameDev(e.target.value)} required />
                            <input className="bg-black border border-gray-700 p-2" placeholder="Year" value={gameYear} onChange={(e: ChangeEvent<HTMLInputElement>) => setGameYear(e.target.value)} required />
                            <input className="bg-black border border-gray-700 p-2" placeholder="Genre" value={gameGenre} onChange={(e: ChangeEvent<HTMLInputElement>) => setGameGenre(e.target.value)} required />
                            
                            <div className="flex gap-2">
                                <input className="bg-black border border-gray-700 p-2 flex-1" placeholder="Console Slug (e.g. snes)" value={gameConsoleSlug} onChange={(e: ChangeEvent<HTMLInputElement>) => setGameConsoleSlug(e.target.value)} />
                                <input type="number" min="1" max="5" className="bg-black border border-gray-700 p-2 w-20 text-center" placeholder="Rate 1-5" value={gameRating} onChange={(e: ChangeEvent<HTMLInputElement>) => setGameRating(e.target.value)} />
                            </div>

                            <input className="bg-black border border-gray-700 p-2 col-span-2" placeholder="Image URL" value={gameImage} onChange={(e: ChangeEvent<HTMLInputElement>) => setGameImage(e.target.value)} />
                        </div>
                        <textarea className="w-full bg-black border border-gray-700 p-2 h-32" placeholder="Review Content" value={gameContent} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setGameContent(e.target.value)} required />
                        <textarea className="w-full bg-black border border-gray-700 p-2 h-20" placeholder="Why It Matters" value={gameMatter} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setGameMatter(e.target.value)} required />
                        <Button type="submit">ARCHIVE GAME</Button>
                    </form>
                )}

                {activeTab === 'CONSOLE' && (
                    <form onSubmit={handleSubmitConsole} className="space-y-4">
                         <h3 className="text-retro-neon border-b border-gray-700 pb-2 mb-4">I. IDENTITY</h3>
                         <div className="grid grid-cols-2 gap-4">
                            <select className="bg-black border border-gray-700 p-2" value={consoleManuId} onChange={(e: ChangeEvent<HTMLSelectElement>) => setConsoleManuId(e.target.value)} required>
                                <option value="">-- Select Manufacturer --</option>
                                {manufacturers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                            <input className="bg-black border border-gray-700 p-2" placeholder="Console Name" value={consoleName} onChange={(e: ChangeEvent<HTMLInputElement>) => setConsoleName(e.target.value)} required />
                            <input className="bg-black border border-gray-700 p-2" placeholder="Slug (optional)" value={consoleSlug} onChange={(e: ChangeEvent<HTMLInputElement>) => setConsoleSlug(e.target.value)} />
                            <input className="bg-black border border-gray-700 p-2" placeholder="Release Year" value={consoleYear} onChange={(e: ChangeEvent<HTMLInputElement>) => setConsoleYear(e.target.value)} required />
                            
                            <select className="bg-black border border-gray-700 p-2" value={consoleGen} onChange={(e: ChangeEvent<HTMLSelectElement>) => setConsoleGen(e.target.value)}>
                                <option value="1st Gen">1st Gen</option>
                                <option value="2nd Gen">2nd Gen</option>
                                <option value="3rd Gen">3rd Gen</option>
                                <option value="4th Gen">4th Gen</option>
                                <option value="5th Gen">5th Gen</option>
                                <option value="6th Gen">6th Gen</option>
                                <option value="7th Gen">7th Gen</option>
                                <option value="8th Gen">8th Gen</option>
                                <option value="9th Gen">9th Gen</option>
                            </select>

                            <select className="bg-black border border-gray-700 p-2" value={consoleType} onChange={(e: ChangeEvent<HTMLSelectElement>) => setConsoleType(e.target.value)}>
                                <option value="Home Console">Home Console</option>
                                <option value="Handheld">Handheld</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Micro Console">Micro Console</option>
                            </select>
                            <input className="bg-black border border-gray-700 p-2 col-span-2" placeholder="Image URL" value={consoleImage} onChange={(e: ChangeEvent<HTMLInputElement>) => setConsoleImage(e.target.value)} />
                            <textarea className="bg-black border border-gray-700 p-2 col-span-2 h-20" placeholder="Intro Description" value={consoleIntro} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setConsoleIntro(e.target.value)} required />
                        </div>

                        <h3 className="text-retro-neon border-b border-gray-700 pb-2 mb-4 mt-8">II. TECHNICAL SPECS</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <input className="bg-black border border-gray-700 p-2" placeholder="CPU" value={specCpu} onChange={(e: ChangeEvent<HTMLInputElement>) => setSpecCpu(e.target.value)} />
                            <input className="bg-black border border-gray-700 p-2" placeholder="GPU" value={specGpu} onChange={(e: ChangeEvent<HTMLInputElement>) => setSpecGpu(e.target.value)} />
                            <input className="bg-black border border-gray-700 p-2" placeholder="RAM" value={specRam} onChange={(e: ChangeEvent<HTMLInputElement>) => setSpecRam(e.target.value)} />
                            <input className="bg-black border border-gray-700 p-2" placeholder="Storage" value={specStorage} onChange={(e: ChangeEvent<HTMLInputElement>) => setSpecStorage(e.target.value)} />
                            <input className="bg-black border border-gray-700 p-2" placeholder="Display Type" value={specDisplay} onChange={(e: ChangeEvent<HTMLInputElement>) => setSpecDisplay(e.target.value)} />
                            <input className="bg-black border border-gray-700 p-2" placeholder="Resolution" value={specRes} onChange={(e: ChangeEvent<HTMLInputElement>) => setSpecRes(e.target.value)} />
                            <input className="bg-black border border-gray-700 p-2" placeholder="Media" value={specMedia} onChange={(e: ChangeEvent<HTMLInputElement>) => setSpecMedia(e.target.value)} />
                            <input className="bg-black border border-gray-700 p-2" placeholder="Ports" value={specPorts} onChange={(e: ChangeEvent<HTMLInputElement>) => setSpecPorts(e.target.value)} />
                            <input className="bg-black border border-gray-700 p-2" placeholder="Connectivity" value={specConn} onChange={(e: ChangeEvent<HTMLInputElement>) => setSpecConn(e.target.value)} />
                            <input className="bg-black border border-gray-700 p-2" placeholder="Dimensions" value={specDim} onChange={(e: ChangeEvent<HTMLInputElement>) => setSpecDim(e.target.value)} />
                            <input className="bg-black border border-gray-700 p-2" placeholder="Weight" value={specWeight} onChange={(e: ChangeEvent<HTMLInputElement>) => setSpecWeight(e.target.value)} />
                            <input className="bg-black border border-gray-700 p-2" placeholder="Battery Life" value={specBattery} onChange={(e: ChangeEvent<HTMLInputElement>) => setSpecBattery(e.target.value)} />
                            <input className="bg-black border border-gray-700 p-2" placeholder="Power Supply" value={specPower} onChange={(e: ChangeEvent<HTMLInputElement>) => setSpecPower(e.target.value)} />
                        </div>

                        <h3 className="text-retro-neon border-b border-gray-700 pb-2 mb-4 mt-8">III. COMMERCIAL DATA</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input className="bg-black border border-gray-700 p-2" placeholder="Launch Price" value={specPrice} onChange={(e: ChangeEvent<HTMLInputElement>) => setSpecPrice(e.target.value)} />
                            <input className="bg-black border border-gray-700 p-2" placeholder="Inflation Adj. Price" value={specInflation} onChange={(e: ChangeEvent<HTMLInputElement>) => setSpecInflation(e.target.value)} />
                            <input className="bg-black border border-gray-700 p-2" placeholder="Units Sold" value={specSold} onChange={(e: ChangeEvent<HTMLInputElement>) => setSpecSold(e.target.value)} />
                            <input className="bg-black border border-gray-700 p-2" placeholder="Best Selling Game" value={specBestGame} onChange={(e: ChangeEvent<HTMLInputElement>) => setSpecBestGame(e.target.value)} />
                        </div>

                        <div className="mt-8"><Button type="submit">REGISTER HARDWARE</Button></div>
                    </form>
                )}
            </div>
        </div>
    );
}