export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { createClient } from '../../../lib/supabase/server';
import { ConsoleDetails } from '../../../lib/types';
import { getBrandTheme } from '../../../data/static';
import AdminEditTrigger from '../../../components/admin/AdminEditTrigger';
import Button from '../../../components/ui/Button';

type Props = {
  params: Promise<{ slug: string }>
};

export async function generateMetadata(props: Props) {
    const params = await props.params;
    const supabase = await createClient();
    const { data: profile } = await supabase
        .from('manufacturer')
        .select('name')
        .eq('slug', params.slug)
        .single();
        
    const titleName = profile?.name || decodeURIComponent(params.slug);
    
    return {
        title: `${titleName} Handheld History | The Retro Circuit`,
        description: `Explore the complete hardware archive of ${titleName}.`,
    };
}

export async function generateStaticParams() {
    return []; // Disable static param generation to enforce dynamic fetching
}

export default async function FabricatorDetailPage(props: Props) {
    const params = await props.params;
    const supabase = await createClient();
    const slug = params.slug;

    // DIAGNOSTIC FETCH FOR FABRICATOR
    let profile: any = null;
    let fetchError: any = null;
    const diagnostic: string[] = [];

    try {
        // Step 1: Basic Fetch (ID/Name only)
        const { data: step1, error: err1 } = await supabase
            .from('manufacturer')
            .select('id, name')
            .eq('slug', slug)
            .limit(1);

        if (err1) throw new Error(`[STEP 1] Basic Fetch Failed: ${err1.message}`);
        if (!step1 || step1.length === 0) throw new Error(`[STEP 1] Fabricator slug '${slug}' not found.`);
        diagnostic.push("Step 1 OK: Found ID " + step1[0].id);

        // Step 2: Full Fetch
        const { data, error } = await supabase
            .from('manufacturer')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) throw new Error(`[STEP 2] Full Fetch Failed: ${error.message}`);
        profile = data;
        diagnostic.push("Step 2 OK: Full profile loaded");

    } catch (e: any) {
        fetchError = { message: e.message, details: diagnostic };
    }

    // 2. Fetch Consoles (Only if profile loaded)
    let consoles: ConsoleDetails[] = [];
    if (profile) {
        // Query by name first to ensure we get everything, regardless of NULL release years in parent table
        const { data, error } = await supabase
            .from('consoles')
            .select('*, manufacturer:manufacturer(*), variants:console_variants(*)')
            .eq('manufacturer_id', profile.id)
            .order('name', { ascending: true });
        
        if (error) {
            console.error('[FabricatorPage] Console Fetch Error:', error.message);
        }

        // Normalize & Backfill data from variants
        consoles = ((data as any) || []).map((c: any) => {
             const variants = c.variants || [];
             const defaultVar = variants.find((v: any) => v.is_default) || variants[0];
             // Polyfill image if missing
             if (!c.image_url && defaultVar?.image_url) {
                 c.image_url = defaultVar.image_url;
             }
             if (!c.release_year && defaultVar?.release_year) {
                 c.release_year = defaultVar.release_year;
             }
             return c;
        });

        // Manual Sort: Newest First (handling TBA/Nulls at top)
        consoles.sort((a, b) => {
            const yA = Number(a.release_year) || 9999;
            const yB = Number(b.release_year) || 9999;
            return yB - yA;
        });
    }

    if (!profile) {
        return (
             <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
                <h2 className="font-pixel text-accent text-xl mb-4">FABRICATOR NOT FOUND</h2>
                <div className="bg-red-900/20 border border-red-500 p-4 mb-8 max-w-lg overflow-auto w-full text-left">
                    <p className="font-mono text-red-400 text-xs mb-2 font-bold uppercase border-b border-red-500 pb-1">DIAGNOSTIC REPORT</p>
                    <div className="font-mono text-red-300 text-xs whitespace-pre-wrap">
                        <div className="mb-2"><span className="text-red-500">ERROR:</span> {fetchError?.message || "Unknown Error"}</div>
                        {fetchError?.details && (
                            <div className="mt-2 border-t border-red-800/50 pt-2">
                                <p className="text-gray-500 mb-1">SUCCESSFUL STEPS:</p>
                                {fetchError.details.map((step: string, i: number) => (
                                    <div key={i} className="text-green-400/80">✓ {step}</div>
                                ))}
                            </div>
                        )}
                         <div className="mt-4 text-[10px] text-gray-500">
                             TIMESTAMP: {new Date().toISOString()}<br/>
                             SLUG: {slug}
                        </div>
                    </div>
                </div>
                 <Link href="/console">
                    <Button variant="secondary">RETURN TO VAULT</Button>
                </Link>
             </div>
        );
    }

    const theme = getBrandTheme(profile.name);
    const themeColorClass = theme.color.split(' ')[0]; // Extract text color class

    return (
        <div className="w-full max-w-7xl mx-auto p-4 animate-[fadeIn_0.5s_ease-in-out]">
            {/* Header / Dossier */}
            <div className={`border-l-8 ${theme.color} bg-bg-primary p-6 md:p-8 mb-8 shadow-lg`}>
                <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-800 pb-6 mb-6 gap-6">
                    {/* Left Column: Title & Identity */}
                    <div className="flex-1 w-full">
                        <div className="flex flex-wrap gap-2 mb-2 items-center justify-between md:justify-start">
                             <div className="font-mono text-xs text-gray-500">
                                <Link href="/" className="hover:text-white">HOME</Link> &gt; <Link href="/console" className="hover:text-white">FABRICATORS</Link> &gt; {profile.name.toUpperCase()}
                             </div>
                             <div className={`font-mono text-xs border inline-block px-2 py-0.5 ${theme.color}`}>CONFIDENTIAL</div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 mt-4">
                            {profile.image_url && (
                                <div className="bg-black/20 p-2 border border-gray-700 rounded md:hidden">
                                     <img src={profile.image_url} className="h-12 w-auto object-contain" />
                                </div>
                            )}
                            <h1 className={`text-3xl sm:text-4xl md:text-6xl font-pixel ${themeColorClass} opacity-90 drop-shadow-[4px_4px_0_rgba(0,0,0,1)] break-words leading-tight`}>
                                {profile.name}
                            </h1>
                            
                            <AdminEditTrigger 
                                id={profile.id} 
                                type="fabricator" 
                                displayMode="inline" 
                                className="mt-1"
                            />
                        </div>

                        {profile.website && (
                             <a href={profile.website} target="_blank" className="font-mono text-xs text-gray-500 hover:text-white mt-2 inline-block break-all">
                                 [ {profile.website.replace('https://', '').replace('http://', '')} ]
                             </a>
                        )}
                    </div>

                    {/* Right Column: Stats & Logo (Desktop) */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:gap-2">
                        {profile.image_url && (
                            <img src={profile.image_url} className="hidden md:block h-20 lg:h-24 w-auto object-contain mb-4" />
                        )}
                        <div className="flex flex-col md:items-end">
                            <div className="font-mono text-gray-500 text-[10px] uppercase">FOUNDED</div>
                            <div className="font-pixel text-white text-lg">{profile.founded_year}</div>
                        </div>
                        <div className="flex flex-col md:items-end">
                            <div className="font-mono text-gray-500 text-[10px] uppercase">HQ ORIGIN</div>
                            <div className="font-pixel text-white text-lg">{profile.country}</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <h3 className={`font-pixel text-lg mb-4 ${themeColorClass}`}>CORPORATE HISTORY</h3>
                        <p className="font-mono text-gray-300 text-sm md:text-base leading-relaxed border-l-2 border-gray-700 pl-4 whitespace-pre-line">
                            {profile.description}
                        </p>
                    </div>
                    
                    <div className={`bg-black/30 p-6 border border-gray-800 h-fit`}>
                        <div className="mb-0">
                            <h4 className="font-pixel text-xs text-gray-500 mb-4 border-b border-gray-800 pb-2">KEY FRANCHISES</h4>
                            <div className="flex flex-wrap gap-2">
                                {(profile.key_franchises || "").split(',').map((f: string) => (
                                    <span key={f.trim()} className={`font-mono text-xs border px-2 py-1 ${theme.color} bg-black/50`}>
                                        {f.trim()}
                                    </span>
                                ))}
                            </div>
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
                                className={`group block border border-border-normal bg-bg-primary relative overflow-hidden transition-all ${theme.hover}`}
                            >
                                <div className="h-32 bg-black/40 flex items-center justify-center p-4 relative">
                                    {console.image_url ? (
                                        <img src={console.image_url} className="max-h-full object-contain" />
                                    ) : (
                                        <span className="font-pixel text-gray-700 text-2xl">?</span>
                                    )}
                                </div>
                                <div className="p-3 border-t border-border-normal">
                                    <div className="flex justify-between text-[10px] font-mono text-gray-500 mb-1">
                                        <span>{console.release_year || 'TBA'}</span>
                                        <span>{console.generation}</span>
                                    </div>
                                    <h3 className="font-pixel text-xs text-white group-hover:text-secondary truncate">
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
