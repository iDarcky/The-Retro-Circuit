import React from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingAppleLight() {
  return (
    // Force white background and black text, overriding any global dark defaults
    <div className="fixed inset-0 overflow-y-auto bg-white text-black font-sans z-50">

      {/* Navigation Bar - Apple Style Light */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between text-xs font-medium tracking-wide text-gray-600">
          <div className="flex items-center gap-6">
             <span className="text-black font-bold text-lg tracking-tighter">Circuit</span>
             <Link href="#" className="hover:text-black transition-colors">Store</Link>
             <Link href="#" className="hover:text-black transition-colors">Mac</Link>
             <Link href="#" className="hover:text-black transition-colors">iPad</Link>
             <Link href="#" className="hover:text-black transition-colors">iPhone</Link>
             <Link href="#" className="hover:text-black transition-colors">Consoles</Link>
             <Link href="#" className="hover:text-black transition-colors">Support</Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-black cursor-pointer">Search</span>
            <span className="hover:text-black cursor-pointer">Bag</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-2 text-black">
            Console Air.
          </h1>
          <p className="text-2xl md:text-3xl text-black font-normal mb-8 max-w-2xl mx-auto">
            Light. Speed.
          </p>
          <div className="flex items-center justify-center gap-8 text-xl text-[#0066cc]">
            <Link href="/console" className="hover:underline flex items-center gap-1 group">
              Learn more <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/console" className="hover:underline flex items-center gap-1 group">
              Buy <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mt-12 mx-auto w-full max-w-5xl h-[500px] flex items-center justify-center relative">
             <div className="w-[800px] h-[450px] bg-gray-100 rounded-xl shadow-xl flex items-center justify-center border border-gray-200">
                  {/* Abstract colorful blobs representing screen content */}
                  <div className="w-[700px] h-[350px] bg-white rounded shadow-sm overflow-hidden relative">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                        <div className="absolute top-0 -right-4 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-20 w-40 h-40 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold tracking-tight text-gray-800">
                            Supercharged.
                        </div>
                  </div>
             </div>
        </div>
      </section>

      {/* Grid Section - White Cards */}
      <section className="bg-gray-50 py-4">
         <div className="max-w-[95%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Card 1 */}
             <div className="bg-white h-[600px] flex flex-col items-center justify-start pt-16 text-center border border-gray-100 shadow-sm">
                 <h3 className="text-4xl font-semibold text-black mb-3">Retro Watch</h3>
                 <p className="text-xl text-black mb-8">Smarter. Brighter. Mightier.</p>
                 <div className="flex gap-4 text-[#0066cc] mb-12">
                     <span className="hover:underline cursor-pointer">Learn more &gt;</span>
                     <span className="hover:underline cursor-pointer">Buy &gt;</span>
                 </div>
                 <div className="w-48 h-48 bg-orange-500 rounded-full shadow-lg"></div>
             </div>

             {/* Card 2 */}
             <div className="bg-black h-[600px] flex flex-col items-center justify-start pt-16 text-center text-white border border-gray-100 shadow-sm relative overflow-hidden">
                 <h3 className="text-4xl font-semibold mb-3">Vision Pro</h3>
                 <p className="text-xl text-gray-300 mb-8">Welcome to the era of spatial computing.</p>
                  <div className="flex gap-4 text-white mb-12">
                     <span className="hover:underline cursor-pointer">Learn more &gt;</span>
                     <span className="hover:underline cursor-pointer">Buy &gt;</span>
                 </div>
                 <div className="w-full h-full bg-gradient-to-t from-blue-900 to-black opacity-50 absolute bottom-0"></div>
             </div>
         </div>
      </section>

      <footer className="bg-gray-100 py-12 text-xs text-gray-500">
           <div className="max-w-5xl mx-auto px-4">
               <p className="mb-4">1. Light mode simulation. If your eyes hurt, switch back to dark mode immediately.</p>
               <div className="border-t border-gray-300 pt-8 flex justify-between">
                   <span>Copyright © 2024 The Circuit Inc. All rights reserved.</span>
                   <div className="flex gap-4 text-gray-700">
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
