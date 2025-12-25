import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const concepts = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    desc: 'High contrast, neon, glitch, terminal. The mandatory theme.',
    colors: ['#00FF9D', '#FF0055', '#121212']
  },
  {
    id: 'museum',
    name: 'Museum',
    desc: 'Clean, archival, serif, minimalist art gallery.',
    colors: ['#F5F5F5', '#333333', '#888888']
  },
  {
    id: 'blueprint',
    name: 'Blueprint',
    desc: 'Technical, schematic, grid lines, monospaced.',
    colors: ['#0044BB', '#FFFFFF', '#88CCFF']
  },
  {
    id: 'magazine',
    name: 'Retro Mag',
    desc: '90s EGM style, chaotic, stickers, rotated text.',
    colors: ['#FFCC00', '#FF0000', '#0000FF']
  },
  {
    id: 'y2k',
    name: 'Y2K / Aero',
    desc: 'Blobjects, translucent plastic, Frutiger Aero.',
    colors: ['#00AAFF', '#FFFFFF', '#CCCCCC']
  },
  {
    id: '8bit',
    name: '8-Bit',
    desc: 'Pixel art, chunky borders, primary colors.',
    colors: ['#FF0000', '#000000', '#FFFFFF']
  },
  {
    id: 'industrial',
    name: 'Industrial',
    desc: 'Brutalist, concrete, heavy typography, raw.',
    colors: ['#444444', '#111111', '#AAAAAA']
  },
  {
    id: 'synthwave',
    name: 'Synthwave',
    desc: 'Sunset gradients, outrun grid, wireframes.',
    colors: ['#AA00FF', '#FF9900', '#220033']
  },
  {
    id: 'terminal',
    name: 'Terminal',
    desc: 'CLI, green screen, ASCII art, hacker mode.',
    colors: ['#00FF00', '#000000', '#003300']
  },
  {
    id: 'glass',
    name: 'Glass',
    desc: 'Modern frosted glass, blurs, soft shadows.',
    colors: ['rgba(255,255,255,0.1)', '#FFFFFF', '#000000']
  },
  {
    id: 'cowboy',
    name: 'Cowboy',
    desc: 'Western, sepia tones, wanted posters, rugged.',
    colors: ['#dccfb4', '#4a3b2a', '#8b4513']
  },
  {
    id: 'luxury',
    name: 'Luxury Fashion',
    desc: 'High-end lookbook, massive whitespace, editorial.',
    colors: ['#ffffff', '#000000', '#f3f4f6']
  },
  {
    id: 'journal',
    name: 'Scientific Journal',
    desc: 'Academic paper, two-column, formal citations.',
    colors: ['#f8f9fa', '#2c3e50', '#bdc3c7']
  },
  {
    id: 'estate',
    name: 'Real Estate',
    desc: 'Luxury listings, full-width imagery, property specs.',
    colors: ['#f5f5f7', '#1d1d1f', '#d2d2d7']
  },
  {
    id: 'menu',
    name: 'Tasting Menu',
    desc: 'Michelin-star menu, serif headers, course structure.',
    colors: ['#fffcf5', '#2c2c2c', '#e5e5e5']
  },
  {
    id: 'airport',
    name: 'Airport Departure',
    desc: 'Flight information display, high contrast tables.',
    colors: ['#222222', '#f0c420', '#ffffff']
  },
  {
    id: 'audio',
    name: 'Audio Guide',
    desc: 'Museum audio device, dark mode, large buttons.',
    colors: ['#333333', '#ff6600', '#ffffff']
  },
  {
    id: 'psych',
    name: 'Personality Test',
    desc: 'Soft gradients, therapy tools, friendly UI.',
    colors: ['#fdfbf7', '#ff9a9e', '#6b7c93']
  },
  {
    id: 'weather',
    name: 'Weather Forecast',
    desc: 'Climate dashboard, icons, temporal structure.',
    colors: ['#4facfe', '#00f2fe', '#ffffff']
  },
  {
    id: 'legal',
    name: 'Legal Contract',
    desc: 'Terms sheet, dense text, monochrome formal.',
    colors: ['#ffffff', '#000000', '#e5e5e5']
  },
  {
    id: 'auction',
    name: 'Auction House',
    desc: 'Christie’s style catalog, elegant, provenance focused.',
    colors: ['#f3f4f6', '#c5a059', '#333333']
  },
];

export default function ConceptsIndex() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8 md:p-16 font-mono">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 border-b border-neutral-800 pb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter">
            DESIGN CONCEPTS_
          </h1>
          <p className="text-neutral-400 max-w-2xl text-lg">
            Ten distinct homepage directions for The Retro Circuit.
            Each concept explores a different visual language while maintaining core functionality.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {concepts.map((c) => (
            <Link
              key={c.id}
              href={`/concepts/${c.id}`}
              className="group block bg-neutral-900 border border-neutral-800 hover:border-white transition-all duration-300 overflow-hidden relative"
            >
              <div className="p-8 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold group-hover:text-cyan-400 transition-colors">
                    {c.name}
                  </h2>
                  <ArrowRight className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-cyan-400" />
                </div>

                <p className="text-neutral-500 mb-8 flex-grow">
                  {c.desc}
                </p>

                <div className="flex gap-2 mt-auto">
                  {c.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border border-white/10"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <footer className="mt-16 text-center text-neutral-600 text-sm">
          <Link href="/" className="hover:text-white underline">Back to Main Site</Link>
        </footer>
      </div>
    </div>
  );
}
