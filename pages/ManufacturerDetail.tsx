
import { useEffect, useState, type FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchManufacturerProfile, fetchConsolesFiltered, getBrandTheme } from '../services/geminiService';
import { ConsoleDetails, ManufacturerProfile } from '../types';
import RetroLoader from '../components/ui/RetroLoader';
import Button from '../components/ui/Button';

const ManufacturerDetail: FC = () => {
    const { name } = useParams<{ name: string }>();
    const [profile, setProfile] = useState<ManufacturerProfile | null>(null);
    const [consoles, setConsoles] = useState<ConsoleDetails[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!name) return;
            
            // Reset scroll position to top
            window.scrollTo(0, 0);
            
            setLoading(true);
            try {
                // Fetch profile and all consoles for this manufacturer
                const [profileData, consoleData] = await Promise.all([
                    fetchManufacturerProfile(name),
                    fetchConsolesFiltered({ 
                        minYear: 1970, 
                        maxYear: 2005, 
                        generations: [], 
                        types: [], 
                        manufacturer: name 
                    }, 1, 100) // Fetch up to 100 to show comprehensive list
                ]);
                setProfile(profileData);
                setConsoles(consoleData.data);
            } catch (e) {
                console.error(e);
            }
            setLoading(false);
        };
        loadData();
    }, [name]);

    if (loading) return <RetroLoader />;

    if (!profile) {
        return (
            <div className="text-center p-12">
                <h2 className="text-2xl font-pixel text-retro-pink mb-4">DATA CORRUPTED</h2>
                <Link to="/systems"><Button>RETURN TO DB</Button></Link>
            </div>
        );
    }

    const theme = getBrandTheme(profile.name);
    const themeColorClass = theme.color.split(' ')[0]; // Extract text color class

    return (
        <div className="w-full max-w-7xl mx-auto p-4 animate-[fadeIn_0.5s_ease-in-out]">
            {/* Header / Dossier */}
            <div className={`border-l-8 ${theme.color} bg-retro-dark p-8 mb-8 shadow-lg`}>
                <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-800 pb-6 mb-6">
                    <div>
                        <div className="flex gap-2 mb-2">
                             <Link to="/systems" className="font-mono text-xs text-gray-500 hover:text-white">&lt; HARDWARE DB</Link>
                             <div className={`font-mono text-xs border inline-block px-2 py-0.5 ${theme.color}`}>CONFIDENTIAL</div>
                        </div>
                        <h1 className={`text-5xl md:text-7xl font-pixel ${themeColorClass} opacity-90 drop-shadow-[4px_4px_0_rgba(0,0,0,1)]`}>
                            {profile.name}
                        </h1>
                    </div>
                    <div className="text-right mt-4 md:mt-0">
                        <div className="font-mono text-gray-500 text-xs">FOUNDED</div>
                        <div className="font-pixel text-white text-lg">{profile.founded}</div>
                        <div className="font-mono text-gray-500 text-xs mt-2">ORIGIN</div>
                        <div className="font-pixel text-white text-lg">{profile.origin}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <h3 className={`font-pixel text-lg mb-4 ${themeColorClass}`}>CORPORATE HISTORY</h3>
                        <p className="font-mono text-gray-300 text-lg leading-relaxed border-l-2 border-gray-700 pl-4 whitespace-pre-line">
                            {profile.description}
                        </p>
                    </div>
                    
                    <div className={`bg-black/30 p-6 border border-gray-800`}>
                        <div className="mb-6">
                            <h4 className="font-pixel text-xs text-gray-500 mb-2">KEY FRANCHISES</h4>
                            <ul className="space-y-2">
                                {profile.key_franchises.map((f: string) => (
                                    <li key={f} className={`font-mono text-sm border-b border-gray-800 pb-1 ${themeColorClass}`}>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-pixel text-xs text-gray-500 mb-2">CURRENT CEO</h4>
                            <div className="font-mono text-white text-sm">{profile.ceo}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hardware Grid */}
            <div className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                    <h3 className={`font-pixel text-2xl ${themeColorClass}`}>KNOWN HARDWARE UNITS</h3>
                    <div className="flex-1 h-px bg-gray-800"></div>
                </div>
                
                {consoles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {consoles.map((console) => (
                            <Link 
                                to={`/systems/${console.slug}`} 
                                key={console.id}
                                className={`group block border border-retro-grid bg-retro-dark relative overflow-hidden transition-all ${theme.hover}`}
                            >
                                <div className="h-32 bg-black/40 flex items-center justify-center p-4 relative">
                                    {console.image_url ? (
                                        <img src={console.image_url} className="max-h-full object-contain" />
                                    ) : (
                                        <span className="font-pixel text-gray-700 text-2xl">?</span>
                                    )}
                                </div>
                                <div className="p-3 border-t border-retro-grid">
                                    <div className="flex justify-between text-[10px] font-mono text-gray-500 mb-1">
                                        <span>{console.release_year}</span>
                                        <span>GEN {console.generation}</span>
                                    </div>
                                    <h3 className="font-pixel text-xs text-white group-hover:text-retro-neon truncate">
                                        {console.name}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 border-2 border-dashed border-gray-800 text-center font-mono text-gray-500">
                        NO UNITS DECLASSIFIED IN DATABASE.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManufacturerDetail;
