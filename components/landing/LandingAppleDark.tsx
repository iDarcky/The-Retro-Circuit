import React from 'react';
import { ChevronRight, Play } from 'lucide-react';
import Link from 'next/link';

export default function LandingAppleDark() {
  return (
    <div className="min-h-screen bg-[#000] text-[#f5f5f7] font-sans">
      {/* Navbar Placeholder */}
      <div className="w-full h-12 bg-[#000]/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/10 flex items-center justify-center text-xs text-gray-400 gap-8">
          <span>Store</span>
          <span>Mac</span>
          <span>iPad</span>
          <span>iPhone</span>
          <span>Watch</span>
          <span>Vision</span>
          <span>AirPods</span>
          <span>TV & Home</span>
          <span>Entertainment</span>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center pt-20 pb-12 text-center">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-2">The Retro Circuit.</h1>
          <h2 className="text-2xl md:text-3xl font-medium text-[#6e6e73] mb-6">Pro-grade analysis.</h2>
          <div className="flex gap-6 text-blue-400 text-lg md:text-xl">
              <Link href="/console" className="flex items-center hover:underline group">
              Learn more <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
               <Link href="/console" className="flex items-center hover:underline group">
              Buy <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
          </div>

          {/* Hero Image Mockup */}
          <div className="mt-12 w-full max-w-4xl h-[400px] bg-gradient-to-b from-[#1c1c1e] to-black rounded-t-3xl border-t border-l border-r border-gray-800 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black"></div>
               <div className="z-10 text-center">
                   <div className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-gray-200 to-gray-600">M4</div>
                   <div className="text-gray-500 tracking-widest mt-2 uppercase">Analysis Engine</div>
               </div>
          </div>
      </div>

      {/* Feature Grid */}
      <div className="bg-[#101010] py-4">
          <div className="max-w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Feature 1 */}
              <div className="bg-black h-[500px] flex flex-col items-center justify-end pb-12 overflow-hidden relative group cursor-pointer">
                  <div className="absolute top-12 text-center z-10">
                      <h3 className="text-4xl font-bold mb-2">Console Vault</h3>
                      <p className="text-lg">Titanium. Strong. Light. Pro.</p>
                  </div>
                   <div className="w-64 h-64 bg-gray-900 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              </div>

               {/* Feature 2 */}
              <div className="bg-black h-[500px] flex flex-col items-center justify-end pb-12 overflow-hidden relative group cursor-pointer">
                  <div className="absolute top-12 text-center z-10">
                      <h3 className="text-4xl font-bold mb-2">VS Mode</h3>
                      <p className="text-lg">Blows everything else away.</p>
                  </div>
                  <div className="flex items-center gap-4 mt-auto z-10">
                     <Play className="fill-current w-8 h-8 rounded-full border border-[#00ff9d] p-2" />
                     <span>Watch the film</span>
                  </div>
                  <div className="w-full h-1/2 absolute bottom-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
              </div>

          </div>
      </div>
    </div>
  );
}
