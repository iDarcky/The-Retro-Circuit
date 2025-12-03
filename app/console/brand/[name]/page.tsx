import Link from 'next/link';
import { createClient } from '../../../../lib/supabase/server';
import { ConsoleDetails } from '../../../../lib/types';
import { getBrandTheme } from '../../../../data/static';

type Props = {
  params: { name: string }
};

export async function generateMetadata({ params }: Props) {
    const supabase = await createClient();
    const { data: profile } = await supabase
        .from('manufacturer')
        .select('name')
        .eq('slug', params.name)
        .single();
        
    const titleName = profile?.name || decodeURIComponent(params.name);
    
    return {
        title: `${titleName} - Corporate Profile`,
        description: `Explore the history of ${titleName}, including their console releases, key franchises, and market impact.`,
    };
}

export default async function ManufacturerDetailPage({ params }: Props) {
    const supabase = await createClient();
    const slug = params.name; // Route param 'name' matches the slug from the URL

    // 1. Fetch Profile
    const { data: profile } = await supabase
        .from('manufacturer')
        .select('*')
        .eq('slug', slug)
        .single();
    
    // 2. Fetch Consoles associated with this Manufacturer ID
    let consoles: ConsoleDetails[] = [];
    if (profile) {
        const { data } = await supabase
            .from('consoles')
            .select('*, manufacturer:manufacturer(*), specs:console_specs(*)')
            .eq('manufacturer_id', profile.id)
            .order('release_year', { ascending: true });
        consoles = (data as any) || [];
    }

    if (!profile) {
        return <div className="p-12 text-center font-mono text-gray-500">CORPORATE ENTITY NOT FOUND IN DATABASE.</div>;
    }

    const theme = getBrandTheme(profile.name);
    const themeColorClass = theme.color.split(' ')[0]; // Extract text color class

    return (
        <div className="w-full max-w-7xl mx-auto p-4 animate-[fadeIn_0.5s_ease-in-out]">
            {/* Header / Dossier */}
            <div className={`border-l-8 ${theme.color} bg-retro-dark p-6 md:p-8 mb-8 shadow-lg`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-800 pb-6 mb-6 gap-6 md:gap-0">
                    <div>
                        <div className="flex gap-2 mb-2 items-center">
                             <Link href="/console" className="font-mono text-xs text-gray-500 hover:text-white">&lt; HARDWARE DB</Link>
                             <div className={`font-mono text-xs border inline-block px-2 py-0.5 ${theme.color}`}>CONFIDENTIAL</div>
                        </div>
                        <h1 className={`text-4xl md:text-5xl lg:text-7xl font-pixel ${themeColorClass} opacity-90 drop-shadow-[4px_4px_0_rgba(0,0,0,1)] break-words`}>
                            {profile.name}
                        </h1>
                        {profile.website && (
                             <a href={profile.website} target="_blank" className="font-mono text-xs text-gray-500 hover:text-white mt-2 inline-block break-all">
                                 [ {profile.website.replace('https://', '').replace('http://', '')} ]
                             </a>
                        )}
                    </div>
                    <div className="text-left md:text-right flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-0 w-full md:w-auto">
                        {profile.image_url && (
                            <img src={profile.image_url} className="h-12 md:h-16 w-auto object-contain mb-0 md:mb-4 ml-0 md:ml-auto" />
                        )}
                        <div className="flex flex-col md:items-end">
                            <div className="font-mono text-gray-500 text-xs">FOUNDED</div>
                            <div className="font-pixel text-white text-lg">{profile.founded_year}</div>
                        </div>
                        <div className="flex flex-col md:items-end">
                            <div className="font-mono text-gray-500 text-xs mt-0 md:mt-2">ORIGIN</div>
                            <div className="font-pixel text-white text-lg">{profile.country}</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <h3 className={`font-pixel text-lg mb-4 ${themeColorClass}`}>CORPORATE HISTORY</h3>
                        <p className="font-mono text-gray-300 text-base md:text-lg leading-relaxed border-l-2 border-gray-700 pl-4 whitespace-pre-line">
                            {profile.description}
                        </p>
                    </div>
                    
                    <div className={`bg-black/30 p-6 border border-gray-800`}>
                        <div className="mb-6">
                            <h4 className="font-pixel text-xs text-gray-500 mb-2">KEY FRANCHISES</h4>
                            <ul className="space-y-2">
                                {(profile.key_franchises || "").split(',').map((f: string) => (
                                    <li key={f.trim()} className={`font-mono text-sm border-b border-gray-800 pb-1 ${themeColorClass}`}>
                                        {f.trim()}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hardware Grid */}
            <div className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                    <h3 className={`font-pixel text-xl md:text-2xl ${themeColorClass}`}>KNOWN HARDWARE UNITS</h3>
                    <div className="flex-1 h-px bg-gray-800"></div>
                </div>
                
                {consoles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {consoles.map((console) => (
                            <Link 
                                href={`/console/${console.slug}`} 
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
                                        <span>{console.generation}</span>
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