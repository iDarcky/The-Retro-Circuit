import React from 'react';
import { Search, Rss, Battery, Cpu, Wifi } from 'lucide-react';
import Link from 'next/link';

export default function LandingGSM() {
  return (
    <div className="min-h-screen bg-[#f0f0f0] text-[#333] font-sans text-[13px] leading-tight pb-10">

      {/* Header - GSM Style */}
      <header className="bg-[#A40000] text-white py-3 px-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold tracking-tight uppercase">GSM<span className="text-gray-200">Arena</span></h1>
            <nav className="hidden md:flex gap-6 text-sm font-bold uppercase tracking-wide">
              <a href="#" className="hover:text-gray-200">Home</a>
              <a href="#" className="hover:text-gray-200">News</a>
              <a href="#" className="hover:text-gray-200">Reviews</a>
              <a href="#" className="hover:text-gray-200">Videos</a>
              <a href="#" className="hover:text-gray-200">Featured</a>
            </nav>
          </div>
          <div className="flex items-center gap-2 bg-white rounded px-2 py-1">
             <Search className="w-4 h-4 text-gray-500" />
             <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-black w-40" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto mt-4 grid grid-cols-12 gap-4 px-2">

        {/* LEFT COLUMN: MANUFACTURERS */}
        <aside className="col-span-2 hidden md:block">
            <div className="bg-white border border-gray-300 rounded overflow-hidden mb-4">
                <div className="bg-[#eee] px-3 py-2 font-bold text-[#b71c1c] border-b border-gray-300 uppercase">
                    Console Finder
                </div>
                <div className="p-3">
                     <div className="mb-2 text-xs text-gray-500 uppercase font-bold">Brand</div>
                     <select className="w-full border border-gray-300 p-1 mb-2 text-xs"><option>All brands</option></select>
                     <button className="w-full bg-[#eee] border border-gray-400 text-gray-700 py-1 uppercase font-bold text-xs hover:bg-[#ddd]">Search</button>
                </div>
            </div>

            <div className="bg-white border border-gray-300 rounded overflow-hidden">
                 <div className="bg-[#eee] px-3 py-2 font-bold text-[#b71c1c] border-b border-gray-300 uppercase">
                    Brands
                </div>
                <ul className="text-[#005599] font-medium">
                    {['Nintendo', 'Sega', 'Sony', 'Microsoft', 'Atari', 'SNK', 'NEC', 'Bandai', 'Panasonic', 'Philips', 'Commodore', 'Sinclair'].map(brand => (
                        <li key={brand} className="border-b border-gray-100 px-3 py-2 hover:bg-gray-50 hover:underline cursor-pointer flex justify-between">
                            {brand} <span className="text-gray-400 text-[10px] font-normal">({Math.floor(Math.random() * 50)})</span>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>

        {/* CENTER COLUMN: NEWS */}
        <main className="col-span-12 md:col-span-7">
             {/* Hero Article */}
             <div className="bg-white border border-gray-300 p-1 mb-4 shadow-sm relative group cursor-pointer">
                  <div className="h-64 bg-gray-800 relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                       <div className="absolute bottom-0 left-0 p-6 text-white">
                           <h2 className="text-3xl font-bold mb-2 group-hover:underline decoration-[#b71c1c] decoration-2">Nintendo Switch 2: Leaked specs confirm 12GB RAM</h2>
                           <p className="text-gray-300 text-sm">The long awaited successor might finally be here, and it brings DLSS support.</p>
                           <div className="flex gap-4 mt-2 text-xs text-gray-400">
                               <span>1 hour ago</span>
                               <span>243 comments</span>
                           </div>
                       </div>
                  </div>
             </div>

             {/* News List */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="bg-white border border-gray-300 p-3 shadow-sm flex gap-3 hover:shadow-md transition-shadow cursor-pointer">
                           <div className="w-20 h-20 bg-gray-200 shrink-0"></div>
                           <div>
                               <h3 className="font-bold text-[#005599] hover:underline mb-1">Sony PS5 Pro detailed review: Is it worth the upgrade?</h3>
                               <p className="text-xs text-gray-500 line-clamp-2">We put the new console through its paces in our detailed battery and thermal tests...</p>
                               <span className="text-[10px] text-gray-400 mt-1 block">Yesterday</span>
                           </div>
                      </div>
                  ))}
             </div>
        </main>

        {/* RIGHT COLUMN: POPULAR */}
        <aside className="col-span-3 hidden md:block">
            <div className="bg-white border border-gray-300 rounded overflow-hidden mb-4">
                 <div className="bg-[#eee] px-3 py-2 font-bold text-[#b71c1c] border-b border-gray-300 uppercase">
                    Top 10 by Daily Interest
                </div>
                 <table className="w-full text-xs">
                     <tbody>
                         {[
                             { name: 'Switch 2', hits: '45,231' },
                             { name: 'PS5 Pro', hits: '32,109' },
                             { name: 'Steam Deck 2', hits: '28,400' },
                             { name: 'Analogue 3D', hits: '19,200' },
                             { name: 'Xbox Series X', hits: '15,000' }
                         ].map((item, idx) => (
                             <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                 <td className="px-3 py-2 font-bold text-gray-500 w-6">{idx + 1}.</td>
                                 <td className="px-2 py-2 text-[#005599] font-bold hover:underline cursor-pointer">{item.name}</td>
                                 <td className="px-3 py-2 text-gray-400 text-right">{item.hits}</td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
            </div>

            <div className="bg-white border border-gray-300 rounded overflow-hidden p-4">
                <h4 className="font-bold uppercase text-gray-600 mb-3 border-b border-gray-200 pb-1">Specifications</h4>
                <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-2 text-xs text-gray-600">
                         <Cpu className="w-4 h-4" /> <span>Processor</span>
                     </div>
                     <div className="flex items-center gap-2 text-xs text-gray-600">
                         <Battery className="w-4 h-4" /> <span>Battery Life</span>
                     </div>
                     <div className="flex items-center gap-2 text-xs text-gray-600">
                         <Wifi className="w-4 h-4" /> <span>Connectivity</span>
                     </div>
                </div>
            </div>
        </aside>

      </div>
    </div>
  );
}
