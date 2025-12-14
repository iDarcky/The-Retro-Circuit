import Link from 'next/link';
import { fetchConsoleList, fetchManufacturers } from '../../lib/api';

export const metadata = {
  title: 'System Directory | Site Map',
  description: 'Complete directory of all consoles and manufacturers archived on The Retro Circuit.',
};

export default async function SitemapPage() {
    const [consoles, brands] = await Promise.all([
        fetchConsoleList(),
        fetchManufacturers()
    ]);

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            <h1 className="text-3xl font-pixel text-retro-neon mb-8 border-b-2 border-retro-grid pb-4">
                SYSTEM DIRECTORY (SITEMAP)
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Main Pages */}
                <div>
                    <h2 className="font-pixel text-xl text-white mb-4">SECTORS</h2>
                    <ul className="space-y-2 font-mono text-sm">
                        <li><Link href="/" className="text-retro-blue hover:text-white hover:underline">Control Room</Link></li>
                        <li><Link href="/console" className="text-retro-blue hover:text-white hover:underline">Console Vault</Link></li>
                        <li><Link href="/arena" className="text-retro-blue hover:text-white hover:underline">VS Mode</Link></li>
                    </ul>

                    <h2 className="font-pixel text-xl text-white mt-8 mb-4">FABRICATORS</h2>
                    <ul className="space-y-2 font-mono text-sm">
                        {brands.map(b => (
                            <li key={b.id}>
                                <Link href={`/fabricators/${b.slug}`} className="text-gray-400 hover:text-retro-pink hover:underline">
                                    {b.name}
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
                                <Link href={`/console/${c.slug}`} className="text-gray-400 hover:text-retro-neon hover:underline">
                                    {c.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    );
}
