import Link from 'next/link';
import { fetchManufacturers } from '../../lib/api';
import { getBrandTheme } from '../../data/static';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Fabricators | Manufacturer Database',
  description: 'Authorized hardware fabricators and corporate entities.',
};

export default async function FabricatorsPage() {
  const manufacturers = await fetchManufacturers();

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-pixel text-retro-neon mb-4 drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
            FABRICATOR ARCHIVES
        </h2>
        <p className="font-mono text-gray-400">AUTHORIZED HARDWARE MANUFACTURERS</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {manufacturers.map((brand) => {
            const theme = getBrandTheme(brand.name);
            const initial = brand.name.charAt(0).toUpperCase();
            const colorClass = theme.color.split(' ')[0]; // extract text color like text-red-500
            const borderClass = theme.color.split(' ')[1]; // extract border color like border-red-500

            return (
                <Link 
                    href={`/fabricators/${brand.slug}`} 
                    key={brand.id}
                    className={`group relative bg-retro-dark border-2 ${borderClass} p-8 flex flex-col items-center justify-center hover:bg-white/5 transition-all duration-300 overflow-hidden min-h-[300px]`}
                >
                    {/* Decorative Corner */}
                    <div className={`absolute top-0 right-0 p-2 border-b border-l ${borderClass} bg-black/50`}>
                        <span className="font-mono text-[10px] text-gray-500">EST. {brand.founded_year}</span>
                    </div>

                    {/* Avatar Circle */}
                    <div className={`w-32 h-32 rounded-full border-4 ${borderClass} flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform bg-black relative`}>
                        <div className={`absolute inset-0 rounded-full border-2 ${borderClass} opacity-50 animate-pulse`}></div>
                        <span className={`font-pixel text-6xl ${colorClass}`}>{initial}</span>
                    </div>

                    {/* Name */}
                    <h3 className={`font-pixel text-2xl text-white mb-8 text-center uppercase tracking-widest group-hover:${colorClass}`}>
                        {brand.name}
                    </h3>

                    {/* Button */}
                    <div className={`mt-auto font-mono text-xs border border-dashed ${borderClass} px-6 py-2 text-gray-400 group-hover:text-white group-hover:border-solid group-hover:bg-white/10 transition-all`}>
                        ACCESS FOLDER &gt;
                    </div>
                </Link>
            );
        })}
      </div>
    </div>
  );
}