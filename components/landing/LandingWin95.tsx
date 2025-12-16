import React from 'react';
import { Minus, Square, X } from 'lucide-react';

export default function LandingWin95() {
  return (
    <div className="min-h-screen bg-[#008080] font-sans p-8 flex items-center justify-center relative overflow-hidden">

        {/* Desktop Icons */}
        <div className="absolute top-4 left-4 flex flex-col gap-6 text-white text-center text-xs w-16">
            <div className="flex flex-col items-center gap-1 cursor-pointer group">
                <img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png" className="w-8 h-8" alt="My Computer" />
                <span className="bg-[#008080] group-hover:bg-[#000080] px-1 dotted-border">My Console</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer group">
                <img src="https://win98icons.alexmeub.com/icons/png/network_internet_pcs_installer-2.png" className="w-8 h-8" alt="Network" />
                <span className="bg-[#008080] group-hover:bg-[#000080] px-1 dotted-border">Network</span>
            </div>
             <div className="flex flex-col items-center gap-1 cursor-pointer group">
                <img src="https://win98icons.alexmeub.com/icons/png/recycle_bin_empty-4.png" className="w-8 h-8" alt="Recycle Bin" />
                <span className="bg-[#008080] group-hover:bg-[#000080] px-1 dotted-border">Recycle Bin</span>
            </div>
        </div>

        {/* Window */}
        <div className="bg-[#c0c0c0] w-full max-w-2xl border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black p-1 shadow-xl">
             {/* Title Bar */}
             <div className="bg-[#000080] text-white px-2 py-1 flex justify-between items-center font-bold text-sm">
                 <div className="flex items-center gap-2">
                     <img src="https://win98icons.alexmeub.com/icons/png/world-4.png" className="w-4 h-4" alt="Icon" />
                     <span>Welcome to The Circuit</span>
                 </div>
                 <div className="flex gap-1">
                       <button className="bg-[#c0c0c0] border-t border-l border-white border-b border-r border-black w-4 h-4 flex items-center justify-center text-black">
                           <Minus className="w-3 h-3 text-black" />
                       </button>
                       <button className="bg-[#c0c0c0] border-t border-l border-white border-b border-r border-black w-4 h-4 flex items-center justify-center text-black">
                           <Square className="w-3 h-3 text-black" />
                       </button>
                       <button className="bg-[#c0c0c0] border-t border-l border-white border-b border-r border-black w-4 h-4 flex items-center justify-center text-black">
                           <X className="w-3 h-3 text-black" />
                       </button>
                 </div>
             </div>

             {/* Menu Bar */}
             <div className="flex gap-4 px-2 py-1 text-black text-sm border-b border-gray-400 mb-2">
                 <span className="underline">F</span>ile
                 <span className="underline">E</span>dit
                 <span className="underline">V</span>iew
                 <span className="underline">H</span>elp
             </div>

             {/* Content */}
             <div className="bg-white border-2 border-inset border-gray-400 p-6 h-96 overflow-y-auto font-serif">
                 <h1 className="text-4xl font-bold mb-4 text-black">The Retro Circuit</h1>
                 <p className="mb-4 text-black">Welcome to the ultimate archive of gaming hardware. Constructed to preserve technical specifications for future generations.</p>
                 <hr className="my-4 border-gray-400" />

                 <h2 className="text-xl font-bold mb-2 text-black">Quick Links</h2>
                 <ul className="list-disc pl-5 text-blue-800 underline cursor-pointer space-y-1">
                     <li>Browse Console Database</li>
                     <li>Compare Hardware Specifications</li>
                     <li>View Fabricator History</li>
                 </ul>

             </div>

             {/* Status Bar */}
             <div className="border-t border-gray-400 mt-1 pt-1 flex gap-2 text-xs text-black">
                 <div className="border-2 border-inset border-gray-400 px-2 py-0.5 flex-1">35 objects</div>
                 <div className="border-2 border-inset border-gray-400 px-2 py-0.5 w-32">1.24MB</div>
             </div>
        </div>

        {/* Taskbar */}
        <div className="fixed bottom-0 left-0 w-full bg-[#c0c0c0] border-t-2 border-white p-1 flex items-center gap-2 z-50">
            <button className="flex items-center gap-1 font-bold px-2 py-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white">
                <img src="https://win98icons.alexmeub.com/icons/png/windows-0.png" className="w-5 h-5" alt="Start" />
                <span className="text-black">Start</span>
            </button>
            <div className="border-l border-gray-400 h-6 mx-1"></div>
            <div className="flex-1 bg-[#d4d0c8] border-2 border-inset border-white border-b-black border-r-black px-2 py-1 flex items-center gap-2 active:bg-[#eee]">
                <img src="https://win98icons.alexmeub.com/icons/png/console_prompt-0.png" className="w-4 h-4" alt="App" />
                <span className="text-xs font-bold text-black">The Retro Circuit</span>
            </div>
            <div className="border-2 border-inset border-gray-400 px-4 py-1 text-xs text-black bg-[#c0c0c0]">
                14:20 PM
            </div>
        </div>

    </div>
  );
}
