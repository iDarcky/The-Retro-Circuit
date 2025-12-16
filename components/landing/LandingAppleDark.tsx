import React from 'react';
import { ChevronRight, Play } from 'lucide-react';
import Link from 'next/link';

export default function LandingAppleDark() {
  return (
    <div className="min-h-screen bg-[#000000] text-gray-100 font-sans selection:bg-pink-500 selection:text-white pb-20">
      {/* Navigation Bar - Apple Style */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between text-xs font-medium tracking-wide text-gray-300">
          <div className="flex items-center gap-6">
             <span className="text-white font-bold text-lg tracking-tighter">Circuit</span>
             <Link href="#" className="hover:text-white transition-colors">Store</Link>
             <Link href="#" className="hover:text-white transition-colors">Mac</Link>
             <Link href="#" className="hover:text-white transition-colors">iPad</Link>
             <Link href="#" className="hover:text-white transition-colors">iPhone</Link>
             <Link href="#" className="hover:text-white transition-colors">Consoles</Link>
             <Link href="#" className="hover:text-white transition-colors">Support</Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">Search</span>
            <span className="hover:text-white cursor-pointer">Bag</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-[#ff00ff] font-semibold text-xl md:text-2xl mb-2 tracking-wide animate-fade-in-up">New</h2>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">
            Console Pro Max.
          </h1>
          <p className="text-2xl md:text-3xl text-gray-400 font-light mb-8 max-w-2xl mx-auto leading-relaxed">
            Titanium. So strong. So light. So Pro.
          </p>
          <div className="flex items-center justify-center gap-6 text-xl text-[#00ff9d]">
            <Link href="/console" className="hover:underline flex items-center gap-1 group">
              Learn more <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/console" className="hover:underline flex items-center gap-1 group">
              Buy <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Hero Image Placeholder */}
        <div className="mt-12 relative w-full h-[400px] md:h-[600px] flex items-center justify-center">
            <div className="w-[300px] h-[500px] md:w-[800px] md:h-[500px] bg-gradient-to-b from-gray-800 to-black rounded-[3rem] border border-gray-700 shadow-2xl flex items-center justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-50 group-hover:opacity-70 transition-opacity duration-700"></div>
                 <span className="relative z-10 font-mono text-xs text-gray-500">HARDWARE_PREVIEW_MODE</span>
            </div>
        </div>
      </section>

      {/* Feature Section 1 */}
      <section className="bg-[#121212] py-32">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
             <div className="order-2 md:order-1 flex flex-col items-start text-left">
                <h3 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
                    A17 Pro chip.<br />
                    A monster win for gaming.
                </h3>
                <p className="text-gray-400 text-lg md:text-xl mb-8 leading-relaxed">
                    It’s here. The biggest redesign in the history of GPUs. A17 Pro is an entirely new class of iPhone chip that delivers our best graphics performance by far.
                </p>
                 <div className="flex items-center gap-2 text-[#00ff9d]">
                     <Play className="fill-current w-8 h-8 rounded-full border border-[#00ff9d] p-2" />
                     <span className="font-medium">Watch the film</span>
                 </div>
             </div>
             <div className="order-1 md:order-2 bg-black rounded-3xl h-[500px] border border-gray-800 flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 to-blue-900/20"></div>
                  <div className="text-center z-10">
                      <div className="text-6xl font-bold text-gray-700 mb-2">A17</div>
                      <div className="text-xl text-gray-500 font-mono">PRO</div>
                  </div>
             </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="bg-black py-4">
        <div className="max-w-[95%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1 */}
            <div className="bg-[#121212] h-[600px] relative overflow-hidden group">
                <div className="absolute top-12 left-0 right-0 text-center">
                     <h3 className="text-4xl font-bold text-white mb-2">Retro Vision.</h3>
                     <p className="text-xl text-gray-400">See what you've been missing.</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-purple-900/10 to-transparent flex items-end justify-center pb-20">
                     <div className="w-64 h-64 border border-gray-700 rounded-full animate-pulse"></div>
                </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#121212] h-[600px] relative overflow-hidden group">
                 <div className="absolute top-12 left-0 right-0 text-center">
                     <h3 className="text-4xl font-bold text-white mb-2">Database.</h3>
                     <p className="text-xl text-gray-400">Knowledge is power.</p>
                </div>
                 <div className="absolute inset-0 flex items-center justify-center pt-32">
                      <div className="grid grid-cols-3 gap-2 opacity-50">
                          {[...Array(9)].map((_, i) => (
                              <div key={i} className="w-16 h-16 bg-gray-800 rounded-lg"></div>
                          ))}
                      </div>
                 </div>
            </div>
        </div>
      </section>

       <footer className="bg-[#121212] py-12 mt-4 text-xs text-gray-500">
           <div className="max-w-5xl mx-auto px-4">
               <p className="mb-4">1. Data simulation only. Actual performance may vary depending on your nostalgia levels.</p>
               <div className="border-t border-gray-800 pt-8 flex justify-between">
                   <span>Copyright © 2024 The Circuit Inc. All rights reserved.</span>
                   <div className="flex gap-4">
                       <Link href="#" className="hover:underline">Privacy Policy</Link>
                       <Link href="#" className="hover:underline">Terms of Use</Link>
                       <Link href="#" className="hover:underline">Sales and Refunds</Link>
                   </div>
               </div>
           </div>
       </footer>

    </div>
  );
}
