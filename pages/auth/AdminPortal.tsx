import { useEffect, useState, type FC, type FormEvent } from 'react';
import { retroAuth, addGame, addConsole, addNewsItem, fetchConsoleList } from '../../services/geminiService';
import Button from '../../components/ui/Button';
import { ConsoleDetails, GameOfTheWeekData, NewsItem, NewsItemSchema, GameSchema, ConsoleSchema } from '../../types';

type AdminTab = 'NEWS' | 'GAME' | 'CONSOLE';

const AdminPortal: FC = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<AdminTab>('NEWS');
    const [message, setMessage] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [availableConsoles, setAvailableConsoles] = useState<{name: string, slug: string}[]>([]);

    // News Form State
    const [newsHeadline, setNewsHeadline] = useState('');
    const [newsSummary, setNewsSummary] = useState('');
    const [newsCategory, setNewsCategory] = useState<NewsItem['category']>('Hardware');

    // Game Form State
    const [gameTitle, setGameTitle] = useState('');
    const [gameSlug, setGameSlug] = useState('');
    const [gameDev, setGameDev] = useState('');
    const [gameYear, setGameYear] = useState('');
    const [gameGenre, setGameGenre] = useState('');
    const [gameContent, setGameContent] = useState('');
    const [gameMatter, setGameMatter] = useState('');
    const [gameImage, setGameImage] = useState('');
    const [gameConsoleSlug, setGameConsoleSlug] = useState('');

    // Console Form State
    const [consoleName, setConsoleName] = useState('');
    const [consoleSlug, setConsoleSlug] = useState('');
    const [consoleManu, setConsoleManu] = useState('');
    const [consoleYear, setConsoleYear] = useState('1990');
    const [consoleType, setConsoleType] = useState('Home');
    const [consoleGen, setConsoleGen] = useState('4');
    const [consoleIntro, setConsoleIntro] = useState('');
    const [consoleImage, setConsoleImage] = useState('');
    const [consoleSpecs, setConsoleSpecs] = useState('{}'); // JSON string for specs

    useEffect(() => {
        const check = async () => {
            const admin = await retroAuth.isAdmin();
            setIsAdmin(admin);
            if (admin) {
                const consoles = await fetchConsoleList();
                setAvailableConsoles(consoles);
            }
            setLoading(false);
        };
        check();
    }, []);

    const fillSpecTemplate = () => {
        const template = {
            release_date: "YYYY-MM-DD",
            discontinued_date: "YYYY-MM-DD",
            dimensions: "00 x 00 x 00 mm",
            weight: "000g",
            casing: "Material description",
            cpu: "Processor Name",
            gpu: "Graphics Chip",
            ram: "0 KB/MB",
            media: "Cartridge/CD/Digital",
            audio: "Sound Chip Details",
            resolution: "000x000",
            display_type: "N/A or LCD Type",
            storage: "Internal Capacity",
            units_sold: "00 million",
            launch_price: "$000",
            inflation_price: "$000",
            best_selling_game: "Game Title",
            ports: ["Port 1", "Port 2"],
            power_supply: "Battery or Adapter",
            battery_life: "00 hours",
            connectivity: "N/A or Wi-Fi/Link Cable"
        };
        setConsoleSpecs(JSON.stringify(template, null, 4));
    };

    const handleSubmitNews = async (e: FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setErrorMsg(null);

        // Validation
        const rawData = { headline: newsHeadline, summary: newsSummary, category: newsCategory };
        const result = NewsItemSchema.safeParse(rawData);
        
        if (!result.success) {
            setErrorMsg(result.error.issues.map(i => i.message).join(', '));
            return;
        }

        setLoading(true);
        const item: NewsItem = { ...result.data, date: new Date().toISOString() };
        const success = await addNewsItem(item);
        if (success) {
            setMessage("NEWS UPLINK SUCCESSFUL");
            setNewsHeadline(''); setNewsSummary('');
        } else setErrorMsg("TRANSMISSION FAILED - CHECK DB CONNECTION");
        setLoading(false);
    };

    const handleSubmitGame = async (e: FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setErrorMsg(null);

        // Validation
        const rawData = {
            title: gameTitle,
            slug: gameSlug || gameTitle.toLowerCase().replace(/ /g, '-'),
            developer: gameDev,
            year: gameYear,
            genre: gameGenre,
            content: gameContent,
            whyItMatters: gameMatter,
            rating: 5,
            image: gameImage,
            console_slug: gameConsoleSlug || undefined
        };

        const result = GameSchema.safeParse(rawData);
        if (!result.success) {
             setErrorMsg(result.error.issues.map(i => `${String(i.path[0])}: ${i.message}`).join(', '));
             return;
        }

        setLoading(true);
        const success = await addGame(result.data as GameOfTheWeekData);
        if (success) {
            setMessage("GAME ARCHIVED SUCCESSFULLY");
            setGameTitle(''); setGameContent('');
        } else setErrorMsg("ARCHIVE FAILED - CHECK DB CONNECTION");
        setLoading(false);
    };

    const handleSubmitConsole = async (e: FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setErrorMsg(null);

        try {
            const specs = JSON.parse(consoleSpecs);
            const rawData = {
                id: '', 
                name: consoleName,
                slug: consoleSlug || consoleName.toLowerCase().replace(/ /g, '-'),
                manufacturer: consoleManu,
                release_year: consoleYear, // string from input, z.coerce handles it
                type: consoleType,
                generation: consoleGen, // string from input, z.coerce handles it
                intro_text: consoleIntro,
                image_url: consoleImage,
                ...specs
            };

            const result = ConsoleSchema.safeParse(rawData);
            if (!result.success) {
                setErrorMsg(result.error.issues.map(i => `${String(i.path[0])}: ${i.message}`).join(', '));
                return;
            }

            setLoading(true);
            const success = await addConsole(result.data as ConsoleDetails);
            if (success) {
                setMessage("HARDWARE REGISTERED");
                setConsoleName('');
            }
            else setErrorMsg("REGISTRATION FAILED - CHECK DB CONNECTION");
        } catch (err) {
            setErrorMsg("INVALID JSON IN SPECS FIELD");
        }
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
        <div className="max-w-4xl mx-auto p-4 font-mono text-gray-300">
            <div className="border-b-4 border-retro-neon pb-4 mb-8 flex justify-between items-end">
                <h1 className="text-4xl font-pixel text-retro-neon">ROOT TERMINAL</h1>
                <div className="text-xs text-retro-blue">ADMIN_MODE_ACTIVE</div>
            </div>

            {message && (
                <div className="bg-retro-grid border border-retro-neon text-retro-neon p-4 mb-6 animate-pulse">
                    &gt; {message}
                </div>
            )}
            
            {errorMsg && (
                <div className="bg-red-900/30 border border-red-500 text-red-400 p-4 mb-6">
                    ⚠ ERROR: {errorMsg}
                </div>
            )}

            <div className="flex gap-4 mb-8">
                {(['NEWS', 'GAME', 'CONSOLE'] as AdminTab[]).map(tab => (
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
                        <input className="w-full bg-black border border-gray-700 p-2" placeholder="Headline" value={newsHeadline} onChange={e => setNewsHeadline(e.target.value)} />
                        <select className="w-full bg-black border border-gray-700 p-2" value={newsCategory} onChange={e => setNewsCategory(e.target.value as NewsItem['category'])}>
                            <option value="Hardware">Hardware</option>
                            <option value="Software">Software</option>
                            <option value="Industry">Industry</option>
                            <option value="Rumor">Rumor</option>
                        </select>
                        <textarea className="w-full bg-black border border-gray-700 p-2 h-32" placeholder="Summary" value={newsSummary} onChange={e => setNewsSummary(e.target.value)} />
                        <Button type="submit">TRANSMIT</Button>
                    </form>
                )}

                {activeTab === 'GAME' && (
                    <form onSubmit={handleSubmitGame} className="space-y-4 grid grid-cols-2 gap-4">
                        <input className="bg-black border border-gray-700 p-2 col-span-2" placeholder="Title" value={gameTitle} onChange={e => setGameTitle(e.target.value)} />
                        <input className="bg-black border border-gray-700 p-2" placeholder="Slug (optional)" value={gameSlug} onChange={e => setGameSlug(e.target.value)} />
                        <select className="bg-black border border-gray-700 p-2" value={gameConsoleSlug} onChange={e => setGameConsoleSlug(e.target.value)}>
                            <option value="">-- Link Console (Optional) --</option>
                            {availableConsoles.map(c => (
                                <option key={c.slug} value={c.slug}>{c.name}</option>
                            ))}
                        </select>
                        <input className="bg-black border border-gray-700 p-2" placeholder="Developer" value={gameDev} onChange={e => setGameDev(e.target.value)} />
                        <input className="bg-black border border-gray-700 p-2" placeholder="Year" value={gameYear} onChange={e => setGameYear(e.target.value)} />
                        <input className="bg-black border border-gray-700 p-2" placeholder="Genre" value={gameGenre} onChange={e => setGameGenre(e.target.value)} />
                        <input className="bg-black border border-gray-700 p-2 col-span-2" placeholder="Image URL" value={gameImage} onChange={e => setGameImage(e.target.value)} />
                        <textarea className="bg-black border border-gray-700 p-2 col-span-2 h-32" placeholder="Main Content" value={gameContent} onChange={e => setGameContent(e.target.value)} />
                        <textarea className="bg-black border border-gray-700 p-2 col-span-2 h-20" placeholder="Why It Matters" value={gameMatter} onChange={e => setGameMatter(e.target.value)} />
                        <div className="col-span-2"><Button type="submit">ARCHIVE GAME</Button></div>
                    </form>
                )}

                {activeTab === 'CONSOLE' && (
                    <form onSubmit={handleSubmitConsole} className="space-y-4 grid grid-cols-2 gap-4">
                        <input className="bg-black border border-gray-700 p-2" placeholder="Name" value={consoleName} onChange={e => setConsoleName(e.target.value)} />
                        <input className="bg-black border border-gray-700 p-2" placeholder="Manufacturer" value={consoleManu} onChange={e => setConsoleManu(e.target.value)} />
                        <input className="bg-black border border-gray-700 p-2" placeholder="Year" value={consoleYear} onChange={e => setConsoleYear(e.target.value)} />
                        <input className="bg-black border border-gray-700 p-2" placeholder="Generation" value={consoleGen} onChange={e => setConsoleGen(e.target.value)} />
                        <input className="bg-black border border-gray-700 p-2 col-span-2" placeholder="Image URL" value={consoleImage} onChange={e => setConsoleImage(e.target.value)} />
                        <textarea className="bg-black border border-gray-700 p-2 col-span-2 h-20" placeholder="Intro Text" value={consoleIntro} onChange={e => setConsoleIntro(e.target.value)} />
                        <div className="col-span-2">
                            <div className="flex justify-between items-end mb-2">
                                <label className="text-xs text-retro-neon block">ADDITIONAL SPECS (JSON)</label>
                                <button type="button" onClick={fillSpecTemplate} className="text-[10px] text-retro-blue hover:text-white border border-retro-blue px-2 py-1">
                                    LOAD TEMPLATE
                                </button>
                            </div>
                            <textarea className="bg-black border border-gray-700 p-2 w-full h-64 font-mono text-xs" value={consoleSpecs} onChange={e => setConsoleSpecs(e.target.value)} 
                            placeholder='{ "cpu": "...", "ram": "..." }' />
                        </div>
                        <div className="col-span-2"><Button type="submit">REGISTER HARDWARE</Button></div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AdminPortal;