
import Link from 'next/link';
import { createClient } from '../../../../lib/supabase/server';
import { ConsoleDetails, ManufacturerProfile } from '../../../../lib/types';
import { getBrandTheme } from '../../../../data/static';
import { Metadata } from 'next';

type Props = {
  params: { name: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const name = decodeURIComponent(params.name);
    return {
        title: `${name} - Corporate Profile`,
        description: `Explore the history of ${name}, including their console releases, key franchises, and market impact.`,
    };
}

// Fallback data if DB entry is missing
const FALLBACK_MANUFACTURERS: Record<string, Partial<ManufacturerProfile>> = {
    'Nintendo': { founded: '1889', origin: 'Kyoto, Japan', description: 'Legendary manufacturer responsible for Mario, Zelda, and the modernization of video games.' },
    'Sega': { founded: '1940', origin: 'Tokyo, Japan', description: 'Arcade titan and former console giant. Creator of Sonic the Hedgehog.' },
    'Sony': { founded: '1946', origin: 'Tokyo, Japan', description: 'Electronics giant that entered the market with PlayStation and dominated 3D gaming.' },
    'Microsoft': { founded: '1975', origin: 'Redmond, USA', description: 'PC software giant that entered the console war with Xbox and Halo.' },
    'Atari': { founded: '1972', origin: 'California, USA', description: 'The pioneer of the arcade and home console industry.' },
};

export default async function ManufacturerDetailPage({ params }: Props) {
    const supabase = await createClient();
    const name = decodeURIComponent(params.name);

    // Parallel Fetching
    const [profileRes, consolesRes] = await Promise.all([
        supabase.from('manufacturers').select('*').ilike('name', name).single(),
        supabase.from('consoles').select('*').eq('manufacturer', name).order('release_year', { ascending: true })
    ]);

    let profile: ManufacturerProfile = profileRes.data;
    const consoles: ConsoleDetails[] = consolesRes.data || [];

    // Construct Fallback if profile missing from DB
    if (!profile) {
        const fallback = Object.entries(FALLBACK_MANUFACTURERS).find(([k]) => k.toLowerCase() === name.toLowerCase())?.[1];
        profile = {
            name: name,
            founded: fallback?.founded || 'Unknown',
            origin: fallback?.origin || 'Unknown',
            description: fallback?.description || 'No corporate dossier available in archives.',
            ceo: 'Unknown',
            key_franchises: []
        };
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
                             <Link href="/systems" className="font-mono text-xs text-gray-500 hover:text-white">&lt; HARDWARE DB</Link>
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
                                {profile.key_franchises?.map((f: string) => (
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
                                href={`/systems/${console.slug}`} 
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
}