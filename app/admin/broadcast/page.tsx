import Link from 'next/link';

export default function BroadcastHub() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 animate-fadeIn min-h-screen flex flex-col">

      {/* HEADER */}
      <header className="mb-12 pt-8 border-b border-white pb-6">
        <div className="flex justify-between items-end">
           <div>
              <h1 className="text-4xl md:text-8xl font-pixel text-white leading-none tracking-tighter mix-blend-difference">
                 BROADCAST
              </h1>
              <p className="font-mono text-xs md:text-sm text-gray-500 mt-2 tracking-widest uppercase">
                 {'//'} PUBLIC TRANSMISSION CONTROL // v1.0
              </p>
           </div>
           <div className="hidden md:block">
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                 <span className="font-mono text-xs text-emerald-500">UPLINK ACTIVE</span>
              </div>
           </div>
        </div>
      </header>

      {/* GRID NAV */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">

         {/* 1. SIGNALS */}
         <Link href="/admin/signals" className="group relative block h-64 bg-bg-secondary border border-border-normal overflow-hidden hover:border-emerald-500/50 transition-colors">
            <div className="absolute top-4 left-4 z-10">
               <span className="font-mono text-xs text-emerald-500/70 group-hover:text-emerald-400 transition-colors">01 // STATUS</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
               <h2 className="font-pixel text-3xl text-gray-700 group-hover:text-emerald-400 transition-colors duration-300">
                  SIGNALS
               </h2>
            </div>
            <div className="absolute bottom-4 right-4">
               <span className="font-mono text-[10px] text-gray-600 group-hover:text-emerald-500 transition-colors">
                  [QUICK UPDATES]
               </span>
            </div>
            <div className="absolute inset-0 bg-emerald-900/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
         </Link>

         {/* 2. REVIEWS */}
         <Link href="/admin/reviews" className="group relative block h-64 bg-bg-secondary border border-border-normal overflow-hidden hover:border-cyan-500/50 transition-colors">
            <div className="absolute top-4 left-4 z-10">
               <span className="font-mono text-xs text-cyan-500/70 group-hover:text-cyan-400 transition-colors">02 // ANALYSIS</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
               <h2 className="font-pixel text-3xl text-gray-700 group-hover:text-cyan-400 transition-colors duration-300">
                  REVIEWS
               </h2>
            </div>
            <div className="absolute bottom-4 right-4">
               <span className="font-mono text-[10px] text-gray-600 group-hover:text-cyan-500 transition-colors">
                  [HARDWARE LOGS]
               </span>
            </div>
            <div className="absolute inset-0 bg-cyan-900/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
         </Link>

         {/* 3. NEWS */}
         <Link href="/admin/news" className="group relative block h-64 bg-bg-secondary border border-border-normal overflow-hidden hover:border-violet-500/50 transition-colors">
            <div className="absolute top-4 left-4 z-10">
               <span className="font-mono text-xs text-violet-500/70 group-hover:text-violet-400 transition-colors">03 // PRESS</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
               <h2 className="font-pixel text-3xl text-gray-700 group-hover:text-violet-400 transition-colors duration-300">
                  NEWS
               </h2>
            </div>
            <div className="absolute bottom-4 right-4">
               <span className="font-mono text-[10px] text-gray-600 group-hover:text-violet-500 transition-colors">
                  [ARTICLES]
               </span>
            </div>
            <div className="absolute inset-0 bg-violet-900/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
         </Link>

      </main>

    </div>
  );
}
