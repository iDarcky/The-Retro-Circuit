
import { fetchRealWorldLatest } from '@/lib/api/real-world';
import { fetchLatestConsoles } from '@/lib/api/latest';
import { fetchConsoleList } from '@/lib/api/consoles';
import Link from 'next/link';
import { ArrowRight, Terminal, Zap, Database, Activity, Cpu } from 'lucide-react';
import Image from 'next/image';

// --- COMPONENTS ---

const CyberHeader = () => (
  <nav className="border-b border-[#00f3ff]/30 bg-[#050505] p-4 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="flex items-center gap-2 text-[#00f3ff]">
        <Terminal size={20} />
        <span className="font-pixel text-xs md:text-sm tracking-widest">RETRO_CIRCUIT // V.4.0</span>
      </div>
      <div className="flex gap-6 font-tech text-sm tracking-widest text-gray-400">
        <span className="hidden md:inline hover:text-[#ff0055] cursor-pointer transition-colors">sys_status: ONLINE</span>
        <span className="hover:text-[#ff0055] cursor-pointer transition-colors">net_link: SECURE</span>
      </div>
    </div>
  </nav>
);

const GlitchText = ({ text, size = "text-4xl" }: { text: string, size?: string }) => (
  <h1 className={`${size} font-pixel text-white relative inline-block`} style={{ textShadow: '2px 0 #ff0055, -2px 0 #00f3ff' }}>
    {text}
  </h1>
);

const CyberCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative bg-black border border-[#00f3ff]/40 p-6 group hover:border-[#ff0055] transition-colors overflow-hidden ${className}`}>
    <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-t-[#00f3ff]/20 border-l-[20px] border-l-transparent group-hover:border-t-[#ff0055] transition-colors"></div>
    <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#00f3ff]/40 group-hover:bg-[#ff0055] transition-colors"></div>
    {children}
  </div>
);

// --- PAGE ---

export default async function CyberpunkConcept() {
  const [realWorldLatest, dbLatest, allConsoles] = await Promise.all([
    fetchRealWorldLatest(4),
    fetchLatestConsoles(5),
    fetchConsoleList()
  ]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono selection:bg-[#ff0055] selection:text-white">
      {/* SCANLINE OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-5" style={{ background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}></div>

      <CyberHeader />

      <main className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

        {/* HERO / FINDER */}
        <section className="py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="mb-4 inline-block bg-[#ff0055]/10 border border-[#ff0055] px-2 py-1 text-[#ff0055] text-xs font-pixel">
              SYSTEM_ALERT: NEW_HARDWARE_DETECTED
            </div>
            <GlitchText text="IDENTIFY YOUR HARDWARE" size="text-4xl md:text-6xl" />
            <p className="mt-6 text-xl text-gray-400 font-tech leading-relaxed border-l-2 border-[#00f3ff] pl-4 max-w-lg">
              Initiate the neural matching sequence to find the perfect retro console for your biological interface requirements.
            </p>

            <div className="mt-10 flex gap-4">
              <Link href="/finder" className="bg-[#00f3ff] text-black font-bold font-pixel text-xs px-8 py-4 hover:bg-white hover:shadow-[0_0_15px_#00f3ff] transition-all clip-path-slant">
                START_SCAN_
              </Link>
              <Link href="/consoles" className="border border-[#00f3ff] text-[#00f3ff] font-bold font-pixel text-xs px-8 py-4 hover:bg-[#00f3ff]/10 transition-all clip-path-slant">
                 BROWSE_DB_
              </Link>
            </div>
          </div>

          <div className="relative h-[400px] border border-[#333] bg-black/50 p-4 flex items-center justify-center">
            {/* DECORATIVE HUD */}
            <div className="absolute top-4 left-4 text-[#ff0055] font-tech text-xs">TARGET_LOCK: ACTIVE</div>
            <div className="absolute bottom-4 right-4 text-[#00f3ff] font-tech text-xs">COORDS: 44.201.99</div>
            <div className="absolute inset-0 border-[1px] border-[#00f3ff]/20 m-4 clip-corners"></div>

            <div className="text-center animate-pulse">
               <Zap size={64} className="text-[#fcee0a] mx-auto mb-4" />
               <p className="font-pixel text-[#fcee0a] text-sm">AWAITING INPUT...</p>
            </div>
          </div>
        </section>

        {/* VS MODE */}
        <section className="py-20 border-t border-[#333]">
           <div className="flex justify-between items-end mb-12">
              <h2 className="text-3xl font-pixel text-white"><span className="text-[#ff0055]">BATTLE</span>_MODE</h2>
              <div className="hidden md:block h-px flex-grow bg-[#333] mx-8 relative top-[-10px]"></div>
              <span className="font-tech text-[#00f3ff]">SELECT_COMBATANTS</span>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-8 border border-[#333] bg-black p-8 relative">
              {/* Fighter 1 */}
              <div className="col-span-1 md:col-span-5 border-2 border-dashed border-[#333] hover:border-[#00f3ff] h-40 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                 <span className="text-4xl text-[#333] group-hover:text-[#00f3ff] font-bold">+</span>
                 <span className="font-tech text-gray-500 mt-2">UPLOAD_UNIT_01</span>
              </div>

              {/* VS Badge */}
              <div className="col-span-1 md:col-span-2 flex items-center justify-center py-4 md:py-0">
                  <div className="w-16 h-16 bg-[#ff0055] text-black font-pixel font-bold flex items-center justify-center text-xl skew-x-[-10deg]">
                     VS
                  </div>
              </div>

               {/* Fighter 2 */}
               <div className="col-span-1 md:col-span-5 border-2 border-dashed border-[#333] hover:border-[#fcee0a] h-40 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                 <span className="text-4xl text-[#333] group-hover:text-[#fcee0a] font-bold">+</span>
                 <span className="font-tech text-gray-500 mt-2">UPLOAD_UNIT_02</span>
              </div>
           </div>
        </section>

        {/* FRESH DROPS (Real World Latest) */}
        <section className="py-20">
           <div className="flex items-center gap-4 mb-12">
              <Activity className="text-[#00f3ff]" />
              <h2 className="text-2xl font-pixel text-white">FRESH_DROPS [RELEASED]</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {realWorldLatest.map((console) => (
                <CyberCard key={console.id} className="h-full">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[#00f3ff] font-tech text-xs tracking-wider">{console.manufacturer?.name}</span>
                        <span className="text-[#ff0055] font-pixel text-[10px] border border-[#ff0055] px-1">{console.release_year || 'YYYY'}</span>
                    </div>
                    <div className="h-32 bg-[#111] mb-4 flex items-center justify-center relative overflow-hidden">
                       {console.image_url ? (
                         <Image
                           src={console.image_url}
                           alt={console.name}
                           width={200}
                           height={200}
                           className="object-contain max-h-24 mix-blend-screen opacity-90"
                         />
                       ) : <Cpu className="text-[#333]" />}
                       {/* Grid overlay on image */}
                       <div className="absolute inset-0 bg-[url('/grid.png')] opacity-20 bg-[length:10px_10px]"></div>
                    </div>
                    <h3 className="font-bold text-lg leading-tight mb-2 truncate">{console.name}</h3>
                    <div className="font-tech text-gray-500 text-sm flex gap-4">
                       <span>CPU: {console.specs?.cpu_clock_max_mhz ? `${console.specs.cpu_clock_max_mhz}MHz` : 'N/A'}</span>
                    </div>
                </CyberCard>
              ))}
           </div>
        </section>

        {/* DATABASE LOGS (Latest Added) */}
        <section className="py-20 grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="col-span-1 md:col-span-4">
                <h2 className="text-2xl font-pixel text-white mb-6">DB_UPDATE_LOG</h2>
                <p className="font-tech text-gray-400 mb-8">
                   Recent entities archived into the central mainframe. Synchronization complete.
                </p>
                <Link href="/consoles" className="inline-flex items-center gap-2 text-[#00f3ff] hover:translate-x-2 transition-transform font-bold font-mono">
                   ACCESS_FULL_ARCHIVE <ArrowRight size={16} />
                </Link>
            </div>

            <div className="col-span-1 md:col-span-8 space-y-2">
                {dbLatest.map((console, idx) => (
                    <div key={console.id} className="flex items-center justify-between bg-[#111] border-l-2 border-[#333] hover:border-[#00f3ff] p-4 transition-colors group cursor-default">
                        <div className="flex items-center gap-4">
                            <span className="font-mono text-[#444] text-xs">0{idx + 1}</span>
                            <span className="font-bold text-sm md:text-base group-hover:text-[#00f3ff] transition-colors">{console.name}</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="font-tech text-xs text-gray-500 hidden md:block">{console.manufacturer?.name}</span>
                            <span className="font-pixel text-[10px] text-[#ff0055]">{console.specs?.price_launch_usd ? `$${console.specs.price_launch_usd}` : 'NO_DATA'}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>

      </main>

      <footer className="border-t border-[#333] bg-[#020202] py-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent opacity-50"></div>
          <p className="font-pixel text-xs text-[#555] mb-4">SYSTEM_HALT // REBOOT_REQUIRED</p>
          <div className="font-tech text-[#333] text-sm">
             NO COPYRIGHT INTENDED. CONCEPT PROTOTYPE. <br/>
             <span className="text-[#00f3ff]">RETRO_CIRCUIT</span>
          </div>
      </footer>
    </div>
  );
}
