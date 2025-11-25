
import React, { useEffect, useState } from 'react';
import { retroAuth, addGame, addConsole, addNewsItem } from '../services/geminiService';
import Button from './Button';
import { ConsoleDetails, GameOfTheWeekData, NewsItem } from '../types';

type AdminTab = 'NEWS' | 'GAME' | 'CONSOLE';

const AdminPortal: React.FC = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<AdminTab>('NEWS');
    const [message, setMessage] = useState<string | null>(null);

    // News Form State
    const [newsHeadline, setNewsHeadline] = useState('');
    const [newsSummary, setNewsSummary] = useState('');
    const [newsCategory, setNewsCategory] = useState<'Hardware' | 'Software'>('Hardware');

    // Game Form State
    const [gameTitle, setGameTitle] = useState('');
    const [gameSlug, setGameSlug] = useState('');
    const [gameDev, setGameDev] = useState('');
    const [gameYear, setGameYear] = useState('');
    const [gameGenre, setGameGenre] = useState('');
    const [gameContent, setGameContent] = useState('');
    const [gameMatter, setGameMatter] = useState('');
    const [gameImage, setGameImage] = useState('');

    // Console Form State (Simplified)
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
            setLoading(false);
        };
        check();
    }, []);

    const handleSubmitNews = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const item: NewsItem = { headline: newsHeadline, summary: newsSummary, category: newsCategory as any, date: new Date().toISOString() };
        const success = await addNewsItem(item);
        if (success) {
            setMessage("NEWS UPLINK SUCCESSFUL");
            setNewsHeadline(''); setNewsSummary('');
        } else setMessage("TRANSMISSION FAILED");
        setLoading(false);
    };

    const handleSubmitGame = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const game: GameOfTheWeekData = {
            title: gameTitle,
            slug: gameSlug || gameTitle.toLowerCase().replace(/ /g, '-'),
            developer: gameDev,
            year: gameYear,
            genre: gameGenre,
            content: gameContent,
            whyItMatters: gameMatter,
            rating: 5,
            image: gameImage
        };
        const success = await addGame(game);
        if (success) {
            setMessage("GAME ARCHIVED SUCCESSFULLY");
            setGameTitle(''); setGameContent('');
        } else setMessage("ARCHIVE FAILED");
        setLoading(false);
    };

    const handleSubmitConsole = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const specs = JSON.parse(consoleSpecs);
            const cons: ConsoleDetails = {
                id: '', // DB generated
                name: consoleName,
                slug: consoleSlug || consoleName.toLowerCase().replace(/ /g, '-'),
                manufacturer: consoleManu,
                release_year: parseInt(consoleYear),
                type: consoleType,
                generation: parseInt(consoleGen),
                intro_text: consoleIntro,
                image_url: consoleImage,
                ...specs
            };
            const success = await addConsole(cons);
            if (success) setMessage("HARDWARE REGISTERED");
            else setMessage("REGISTRATION FAILED");
        } catch (err) {
            setMessage("INVALID JSON IN SPECS FIELD");
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
                    > {message}
                </div>
            )}

            <div className="flex gap-4 mb-8">
                {(['NEWS', 'GAME', 'CONSOLE'] as AdminTab[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setMessage(null); }}
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
                        <select className="w-full bg-black border border-gray-700 p-2" value={newsCategory} onChange={e => setNewsCategory(e.target.value as any)}>
                            <option value="Hardware">Hardware</option>
                            <option value="Software">Software</option>
                        </select>
                        <textarea className="w-full bg-black border border-gray-700 p-2 h-32" placeholder="Summary" value={newsSummary} onChange={e => setNewsSummary(e.target.value)} />
                        <Button type="submit">TRANSMIT</Button>
                    </form>
                )}

                {activeTab === 'GAME' && (
                    <form onSubmit={handleSubmitGame} className="space-y-4 grid grid-cols-2 gap-4">
                        <input className="bg-black border border-gray-700 p-2 col-span-2" placeholder="Title" value={gameTitle} onChange={e => setGameTitle(e.target.value)} />
                        <input className="bg-black border border-gray-700 p-2" placeholder="Slug (optional)" value={gameSlug} onChange={e => setGameSlug(e.target.value)} />
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
                            <label className="text-xs text-retro-neon mb-1 block">ADDITIONAL SPECS (JSON)</label>
                            <textarea className="bg-black border border-gray-700 p-2 w-full h-40 font-mono text-xs" value={consoleSpecs} onChange={e => setConsoleSpecs(e.target.value)} 
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
