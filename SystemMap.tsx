
import { useEffect, useState, type FC } from 'react';
import { Link } from 'react-router-dom';
import { fetchConsoleList, fetchGameList, fetchManufacturers } from '../services/dataService';
import RetroLoader from '../components/ui/RetroLoader';
import SEOHead from '../components/ui/SEOHead';

const SystemMap: FC = () => {
    const [consoles, setConsoles] = useState<{name: string, slug: string}[]>([]);
    const [games, setGames] = useState<{title: string, slug: string, id: string}[]>([]);
    const [brands, setBrands] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const [c, g, b] = await Promise.all([
                fetchConsoleList(),
                fetchGameList(),
                fetchManufacturers()
            ]);
            setConsoles(c);
            setGames(g);
            setBrands(b);
            setLoading(false);
        };
        load();
    }, []);

    if (loading) return <RetroLoader />;

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            <SEOHead title="Site Map" description="Directory of all retro games, consoles, and manufacturers on The Retro Circuit." />
            
            <h1 className="text-3xl font-pixel text-retro-neon mb-8 border-b-2 border-retro-grid pb-4">
                SYSTEM DIRECTORY (SITEMAP)
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Main Pages */}
                <div>
                    <h2 className="font-pixel text-xl text-white mb-4">SECTORS</h2>
                    <ul className="space-y-2 font-mono text-sm">
                        <li><Link to="/" className="text-retro-blue hover:text-white hover:underline">Control Room</Link></li>
                        <li><Link to="/signals" className="text-retro-blue hover:text-white hover:underline">Signal Feed</Link></li>
                        <li><Link to="/archive" className="text-retro-blue hover:text-white hover:underline">Game Vault</Link></li>
                        <li><Link to="/systems" className="text-retro-blue hover:text-white hover:underline">Console Vault</Link></li>
                        <li><Link to="/arena" className="text-retro-blue hover:text-white hover:underline">VS Mode</Link></li>
                        <li><Link to="/chrono" className="text-retro-blue hover:text-white hover:underline">History Line</Link></li>
                    </ul>

                    <h2 className="font-pixel text-xl text-white mt-8 mb-4">MANUFACTURERS</h2>
                    <ul className="space-y-2 font-mono text-sm">
                        {brands.map(b => (
                            <li key={b}>
                                <Link to={`/systems/brand/${b}`} className="text-gray-400 hover:text-retro-pink hover:underline">
                                    {b}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Consoles */}
                <div>
                    <h2 className="font-pixel text-xl text-white mb-4">HARDWARE UNITS</h2>
                    <ul className="space-y-2 font-mono text-sm max-h-[80vh] overflow-y-auto custom-scrollbar pr-2">
                        {consoles.map(c => (
                            <li key={c.slug}>
                                <Link to={`/systems/${c.slug}`} className="text-gray-400 hover:text-retro-neon hover:underline">
                                    {c.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Games */}
                <div>
                    <h2 className="font-pixel text-xl text-white mb-4">GAME CARTRIDGES</h2>
                    <ul className="space-y-2 font-mono text-sm max-h-[80vh] overflow-y-auto custom-scrollbar pr-2">
                        {games.map(g => (
                            <li key={g.id}>
                                <Link to={`/archive/${g.slug || g.id}`} className="text-gray-400 hover:text-retro-neon hover:underline">
                                    {g.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default SystemMap;
