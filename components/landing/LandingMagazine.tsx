import React from 'react';

export default function LandingMagazine() {
  return (
    <div className="min-h-screen bg-[#e0d8c0] text-[#1a1a1a] font-serif overflow-x-hidden p-2 md:p-8">

      {/* Magazine Header */}
      <header className="border-b-4 border-black mb-8 pb-4 relative">
          <h1 className="text-[12vw] leading-[0.8] font-black tracking-tighter text-center uppercase text-[#cc0000] scale-y-125 transform" style={{fontFamily: 'Impact, sans-serif'}}>
              RETRO<span className="text-black">CIRCUIT</span>
          </h1>
          <div className="absolute top-0 right-0 bg-[#ffd700] text-black font-bold rounded-full p-4 rotate-12 shadow-lg border-2 border-black hidden md:block">
              <span className="block text-xs uppercase text-center">Collector's<br/>Edition</span>
              <span className="block text-2xl text-center">$4.99</span>
          </div>
          <div className="flex justify-between font-bold uppercase text-xs md:text-sm mt-2 px-2 border-t-2 border-black pt-1">
              <span>Vol. 1 Issue #42</span>
              <span>The Ultimate Hardware Guide</span>
              <span>October 2024</span>
          </div>
      </header>

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Left Column (Main Story) */}
          <main className="md:col-span-8 relative">
              <div className="relative group cursor-pointer">
                  <div className="absolute -inset-2 bg-[#00ffcc] rotate-1 rounded border-2 border-black"></div>
                  <div className="relative bg-white border-2 border-black p-2">
                       <div className="bg-black h-[400px] w-full mb-4 relative overflow-hidden">
                           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592155931584-901ac15763e3?q=80&w=2075&auto=format&fit=crop')] bg-cover bg-center mix-blend-hard-light opacity-80"></div>
                           <h2 className="absolute bottom-4 left-4 text-6xl font-black text-white uppercase italic leading-[0.9] drop-shadow-[4px_4px_0_#cc0000]" style={{fontFamily: 'Arial Black, sans-serif'}}>
                               The 128-Bit<br/>Revolution!
                           </h2>
                       </div>
                       <div className="columns-2 gap-6 text-justify text-sm leading-tight font-medium">
                           <p className="mb-4"><span className="float-left text-5xl font-black mr-2 text-[#cc0000] leading-[0.8]">W</span>e take a deep dive into the silicon that powered the sixth generation. From the Emotion Engine to the Gecko, find out what made these machines tick.</p>
                           <p>Is the Dreamcast still worth it in 2024? Our experts weigh in on the GD-ROM format and its legacy. Plus: A look back at the GameCube handle - genius or gimmick?</p>
                       </div>
                  </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="bg-yellow-300 p-4 border-2 border-black -rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <h3 className="font-black text-2xl uppercase mb-2">Top 10</h3>
                      <ol className="list-decimal pl-5 font-bold text-sm">
                          <li>PlayStation 2</li>
                          <li>Game Boy Advance</li>
                          <li>Dreamcast</li>
                          <li>Nintendo 64</li>
                          <li>Sega Saturn</li>
                      </ol>
                  </div>
                  <div className="bg-[#ff99cc] p-4 border-2 border-black rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center text-center">
                      <h3 className="font-black text-3xl uppercase leading-none mb-2">HOT TIP!</h3>
                      <p className="font-bold text-xs">Don't blow into your cartridges! It causes corrosion!</p>
                  </div>
              </div>
          </main>

          {/* Right Column (Sidebars) */}
          <aside className="md:col-span-4 space-y-6">
              <div className="bg-white border-2 border-black p-4">
                  <h3 className="bg-black text-white text-center font-black uppercase text-xl py-1 mb-4">Inside This Issue</h3>
                  <ul className="space-y-2 font-bold text-sm">
                      <li className="flex justify-between border-b border-gray-400 pb-1">
                          <span>Console Database</span>
                          <span className="text-[#cc0000]">Page 4</span>
                      </li>
                      <li className="flex justify-between border-b border-gray-400 pb-1">
                          <span>Handheld History</span>
                          <span className="text-[#cc0000]">Page 12</span>
                      </li>
                      <li className="flex justify-between border-b border-gray-400 pb-1">
                          <span>Tech Specs Brawl</span>
                          <span className="text-[#cc0000]">Page 24</span>
                      </li>
                      <li className="flex justify-between border-b border-gray-400 pb-1">
                          <span>Reader Mail</span>
                          <span className="text-[#cc0000]">Page 30</span>
                      </li>
                  </ul>
              </div>

              <div className="bg-[#cc0000] p-4 border-2 border-black text-white text-center">
                  <h3 className="font-black text-3xl uppercase mb-2 italic">Subscribe Now!</h3>
                  <p className="text-xs font-bold mb-4">Get 12 issues for the price of 10!</p>
                  <button className="bg-yellow-300 text-black font-black uppercase px-6 py-2 border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                      Click Here
                  </button>
              </div>

               <div className="relative">
                   <div className="absolute -top-4 -right-4 bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center font-black text-xs rotate-12 border-2 border-white shadow-md z-10">
                       NEW!
                   </div>
                   <img src="https://images.unsplash.com/photo-1551103782-8ab07afd45c1?q=80&w=2070&auto=format&fit=crop" className="w-full h-48 object-cover border-2 border-black grayscale contrast-125" alt="Ad" />
                   <div className="bg-black text-white text-center font-bold text-xs py-1">
                       Advertisement
                   </div>
               </div>

          </aside>
      </div>

    </div>
  );
}
