import React from 'react';

export default function LandingMagazine() {
  return (
    <div className="min-h-screen bg-[#f4f4f4] text-[#111] font-serif p-8 md:p-16">

        {/* Header */}
        <header className="border-b-[1px] border-black pb-8 mb-12 text-center">
            <div className="text-xs font-sans font-bold tracking-[0.2em] uppercase mb-4 text-gray-500">Vol. 142 — The Hardware Issue</div>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none mb-4 font-sans">CIRCUIT</h1>
            <div className="flex justify-between border-t border-black pt-2 font-sans text-xs font-bold uppercase tracking-wider">
                <span>Est. 2024</span>
                <span>The Definitive Guide</span>
                <span>$5.99 US</span>
            </div>
        </header>

        {/* Main Story */}
        <main className="grid grid-cols-12 gap-8">

            <div className="col-span-12 md:col-span-8">
                <div className="aspect-[4/3] bg-gray-200 mb-6 grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&q=80&w=1000" alt="Console" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6 hover:underline cursor-pointer">
                    The Golden Age of Silicon: Why 16-bit Still Matters.
                </h2>
                <div className="grid grid-cols-2 gap-8 font-sans text-sm leading-relaxed text-gray-600">
                    <p>
                        In an era defined by teraflops and ray tracing, we return to the fundamental architectures that defined a generation. The Super Nintendo and Sega Genesis weren't just toys; they were engineering marvels of their time.
                    </p>
                    <p>
                        We dive deep into the Motorola 68000 and the Ricoh 5A22 to understand the design decisions that shaped the 90s console wars and how they influence modern hardware design today.
                    </p>
                </div>
            </div>

            {/* Sidebar / Headlines */}
            <div className="col-span-12 md:col-span-4 border-l border-black pl-8 flex flex-col justify-between">

                <div className="space-y-12">
                    <div className="cursor-pointer group">
                        <span className="font-sans text-xs font-bold uppercase text-red-600 mb-2 block">Feature</span>
                        <h3 className="text-2xl font-bold leading-tight group-hover:text-red-600 transition-colors">
                            Analysing the PS2 Emotion Engine: A Technical Retrospective.
                        </h3>
                    </div>

                    <div className="cursor-pointer group">
                        <span className="font-sans text-xs font-bold uppercase text-blue-600 mb-2 block">Review</span>
                        <h3 className="text-2xl font-bold leading-tight group-hover:text-blue-600 transition-colors">
                            The Steam Deck OLED vs. Switch OLED: Display Shootout.
                        </h3>
                    </div>

                    <div className="cursor-pointer group">
                        <span className="font-sans text-xs font-bold uppercase text-green-600 mb-2 block">Database</span>
                        <h3 className="text-2xl font-bold leading-tight group-hover:text-green-600 transition-colors">
                            New entries added: PC-Engine CD, Neo Geo Pocket Color.
                        </h3>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-black">
                     <p className="font-sans text-xs font-bold uppercase mb-4">Subscribe to our newsletter</p>
                     <div className="flex border border-black p-1">
                         <input type="email" placeholder="Email Address" className="bg-transparent border-none outline-none flex-1 px-2 font-sans text-sm" />
                         <button className="bg-black text-white px-4 py-2 font-sans text-xs font-bold uppercase hover:bg-gray-800">Join</button>
                     </div>
                </div>

            </div>

        </main>

    </div>
  );
}
