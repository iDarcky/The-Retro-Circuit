import React from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingAppleLight() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans">
      {/* Navbar Placeholder */}
      <div className="w-full h-12 bg-[#fff]/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 flex items-center justify-center text-xs text-gray-500 gap-8">
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
      <div className="flex flex-col items-center pt-20 pb-12 text-center bg-white">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-2">The Retro Circuit.</h1>
          <h2 className="text-2xl md:text-3xl font-medium text-[#6e6e73] mb-6">Pro-grade analysis.</h2>
          <div className="flex gap-6 text-[#0066cc] text-lg md:text-xl">
              <Link href="/console" className="flex items-center hover:underline group">
              Learn more <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
               <Link href="/console" className="flex items-center hover:underline group">
              Buy <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
          </div>

          {/* Hero Image Mockup */}
          <div className="mt-12 w-full max-w-4xl h-[400px] bg-white flex items-center justify-center relative overflow-hidden">
               <div className="z-10 text-center">
                   <div className="w-64 h-64 bg-gradient-to-tr from-[#ff9a9e] to-[#fad0c4] rounded-3xl shadow-2xl flex items-center justify-center text-white font-bold text-4xl">
                       RC
                   </div>
               </div>
          </div>
      </div>

      {/* Feature Grid */}
      <div className="bg-white py-4">
          <div className="max-w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Feature 1 */}
              <div className="bg-[#fbfbfd] h-[500px] flex flex-col items-center justify-start pt-12 overflow-hidden relative group cursor-pointer">
                  <div className="text-center z-10 px-6">
                      <div className="text-xs font-bold text-orange-500 uppercase mb-2">New</div>
                      <h3 className="text-4xl font-bold mb-2">Console Vault</h3>
                      <p className="text-lg text-gray-500 max-w-md">Titanium. Strong. Light. Pro.</p>
                  </div>
              </div>

               {/* Feature 2 */}
              <div className="bg-[#fbfbfd] h-[500px] flex flex-col items-center justify-start pt-12 overflow-hidden relative group cursor-pointer">
                  <div className="text-center z-10 px-6">
                      <div className="text-xs font-bold text-blue-500 uppercase mb-2">Updated</div>
                      <h3 className="text-4xl font-bold mb-2">VS Mode</h3>
                      <p className="text-lg text-gray-500 max-w-md">Blows everything else away.</p>
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
}
