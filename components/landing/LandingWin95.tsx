import React from 'react';
import { Minus, Square, X } from 'lucide-react';

export default function LandingWin95() {
  return (
    <div className="min-h-screen bg-[#008080] font-sans p-4 overflow-hidden relative selection:bg-[#000080] selection:text-white">

      {/* Desktop Icons */}
      <div className="flex flex-col gap-8 w-24 text-white text-center text-xs drop-shadow-md">
          <div className="flex flex-col items-center gap-1 cursor-pointer group">
              <img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png" className="w-8 h-8 group-hover:opacity-80" alt="My Computer" />
              <span className="bg-transparent px-1 group-hover:bg-[#000080] group-hover:border-dotted group-hover:border-white group-hover:border">My Console</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer group">
              <img src="https://win98icons.alexmeub.com/icons/png/network_internet_pcs_installer-2.png" className="w-8 h-8 group-hover:opacity-80" alt="Network" />
              <span className="bg-transparent px-1 group-hover:bg-[#000080] group-hover:border-dotted group-hover:border-white group-hover:border">Network</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer group">
              <img src="https://win98icons.alexmeub.com/icons/png/recycle_bin_empty-4.png" className="w-8 h-8 group-hover:opacity-80" alt="Bin" />
              <span className="bg-transparent px-1 group-hover:bg-[#000080] group-hover:border-dotted group-hover:border-white group-hover:border">Recycle Bin</span>
          </div>
      </div>

      {/* Main Window */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black shadow-xl">
          {/* Title Bar */}
          <div className="bg-[#000080] px-1 py-0.5 flex items-center justify-between text-white select-none">
               <div className="flex items-center gap-2">
                   <img src="https://win98icons.alexmeub.com/icons/png/world-4.png" className="w-4 h-4" alt="Icon" />
                   <span className="font-bold text-sm">Welcome to The Circuit</span>
               </div>
               <div className="flex gap-0.5">
                   <button className="w-4 h-4 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-black flex items-center justify-center active:border-t-black active:border-l-black active:border-b-white active:border-r-white">
                       <Minus className="w-3 h-3 text-black" />
                   </button>
                   <button className="w-4 h-4 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-black flex items-center justify-center active:border-t-black active:border-l-black active:border-b-white active:border-r-white">
                       <Square className="w-3 h-3 text-black" />
                   </button>
                   <button className="w-4 h-4 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-black flex items-center justify-center active:border-t-black active:border-l-black active:border-b-white active:border-r-white ml-0.5">
                       <X className="w-3 h-3 text-black" />
                   </button>
               </div>
          </div>

          {/* Menu Bar */}
          <div className="flex gap-4 px-2 py-1 text-sm text-black border-b border-gray-400">
               <span className="underline cursor-pointer">F</span>ile
               <span className="underline cursor-pointer">E</span>dit
               <span className="underline cursor-pointer">V</span>iew
               <span className="underline cursor-pointer">H</span>elp
          </div>

          {/* Content Area */}
          <div className="p-4 text-black font-sans">
              <div className="bg-white border-2 border-gray-500 border-b-white border-r-white inset-2 p-6 overflow-y-auto h-[300px]">
                  <h1 className="text-3xl font-bold mb-4 font-serif">The Retro Circuit</h1>
                  <p className="mb-4">
                      Welcome to the ultimate archive of gaming hardware. <br/>
                      Constructed to preserve technical specifications for future generations.
                  </p>

                  <hr className="border-t border-gray-400 my-4" />

                  <h2 className="text-lg font-bold mb-2">Quick Links</h2>
                  <ul className="list-disc pl-5 text-blue-800 underline cursor-pointer">
                      <li>Browse Console Database</li>
                      <li>Compare Hardware Specifications</li>
                      <li>View Fabricator History</li>
                  </ul>

                  <div className="mt-8 flex gap-4">
                      <button className="px-6 py-1 bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white focus:border-dotted focus:border-black font-bold">OK</button>
                      <button className="px-6 py-1 bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white focus:border-dotted focus:border-black">Cancel</button>
                  </div>
              </div>
          </div>

          {/* Status Bar */}
          <div className="border-t border-gray-400 p-1 text-xs text-gray-600 flex gap-4 bg-[#c0c0c0]">
               <div className="border border-gray-400 border-b-white border-r-white px-2 w-1/2">35 objects</div>
               <div className="border border-gray-400 border-b-white border-r-white px-2 w-1/2">1.24MB</div>
          </div>
      </div>

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#c0c0c0] border-t-2 border-white flex items-center px-1 gap-1 z-50">
          <button className="flex items-center gap-1 px-2 py-1 bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white font-bold text-sm">
               <img src="https://win98icons.alexmeub.com/icons/png/windows-0.png" className="w-5 h-5" alt="Start" />
               Start
          </button>
          <div className="h-6 w-0.5 bg-gray-400 mx-1"></div>
          <div className="flex-1 bg-[#c0c0c0] border-t-2 border-l-2 border-black border-b-2 border-r-2 border-white px-2 py-1 text-xs font-bold flex items-center bg-[url('https://win98icons.alexmeub.com/icons/png/console_prompt-0.png')] bg-no-repeat bg-[length:16px] pl-6 h-7 active:bg-gray-300">
              The Retro Circuit
          </div>
          <div className="border-t-2 border-l-2 border-gray-400 border-b-2 border-r-2 border-white px-3 py-1 text-xs inset-y-1 my-1">
              14:20 PM
          </div>
      </div>

    </div>
  );
}
