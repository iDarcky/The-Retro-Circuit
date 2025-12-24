import Link from 'next/link';
import { fetchManufacturers } from '../../lib/api';
import RetroStatusBar from '../../components/ui/RetroStatusBar';
import { ensureHighContrast, hexToRgb } from '../../lib/utils/colors';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Fabricators | Manufacturer Database',
  description: 'Authorized hardware fabricators and corporate entities.',
};

export default async function FabricatorsPage() {
  const manufacturers = await fetchManufacturers();

  // Map existing static themes to Hex for fallback consistency
  const staticHexMap: Record<string, string> = {
    'Nintendo': '#ef4444', // red-500
    'Sega': '#3b82f6',     // blue-500
    'Sony': '#facc15',     // yellow-400
    'Atari': '#f97316',    // orange-500
    'Microsoft': '#22c55e',// green-500
    'NEC': '#c084fc',      // purple-400
    'SNK': '#2dd4bf',      // teal-400
  };

  return (
    <div className="w-full">
      <RetroStatusBar
        rcPath="RC://RETRO_CIRCUIT/VAULT/MANUFACTURERS"
        docId="FABRICATORS_INDEX_V1"
      />

      <div className="max-w-7xl mx-auto p-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-pixel text-secondary mb-4 drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
            FABRICATOR ARCHIVES
        </h2>
        <p className="font-mono text-gray-400">AUTHORIZED HARDWARE MANUFACTURERS</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {manufacturers.map((brand) => {
            const initial = brand.name.charAt(0).toUpperCase();

            // Resolve Colors
            const rawBrandColor = brand.brand_color || staticHexMap[brand.name] || '#00ff9d';
            const readableText = ensureHighContrast(rawBrandColor);
            const brandRgb = hexToRgb(rawBrandColor);

            const cssVars = {
                '--brand-color': rawBrandColor,
                '--brand-text': readableText,
                '--brand-rgb': brandRgb,
            } as React.CSSProperties;

            return (
                <Link 
                    href={`/fabricators/${brand.slug}`} 
                    key={brand.id}
                    style={cssVars}
                    className={`group relative bg-bg-primary border-2 border-[var(--brand-color)] p-8 flex flex-col items-center justify-center hover:bg-[rgba(var(--brand-rgb),0.1)] transition-all duration-300 overflow-hidden min-h-[300px] shadow-[0_0_15px_rgba(var(--brand-rgb),0.1)] hover:shadow-[0_0_25px_rgba(var(--brand-rgb),0.3)]`}
                >
                    {/* Decorative Corner */}
                    <div className={`absolute top-0 right-0 p-2 border-b border-l border-[var(--brand-color)] bg-black/50`}>
                        <span className="font-mono text-[10px] text-gray-500">EST. {brand.founded_year}</span>
                    </div>

                    {/* Avatar Circle */}
                    <div className={`w-32 h-32 rounded-full border-4 border-[var(--brand-color)] flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform bg-black relative`}>
                        <div className={`absolute inset-0 rounded-full border-2 border-[var(--brand-color)] opacity-50 animate-pulse`}></div>
                        <span className={`font-pixel text-6xl text-[var(--brand-text)] drop-shadow-[0_0_5px_var(--brand-color)]`}>{initial}</span>
                    </div>

                    {/* Name */}
                    <h3 className={`font-pixel text-2xl text-white mb-8 text-center uppercase tracking-widest group-hover:text-[var(--brand-text)] transition-colors`}>
                        {brand.name}
                    </h3>

                    {/* Button */}
                    <div className={`mt-auto font-mono text-xs border border-dashed border-[var(--brand-color)] px-6 py-2 text-gray-400 group-hover:text-[var(--brand-text)] group-hover:border-solid group-hover:bg-[rgba(var(--brand-rgb),0.2)] transition-all`}>
                        ACCESS FOLDER &gt;
                    </div>
                </Link>
            );
        })}
      </div>
      </div>
    </div>
  );
}
