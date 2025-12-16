import React from 'react';
import { Cpu, HardDrive, Zap, Activity } from 'lucide-react';
import Link from 'next/link';

export default function LandingDashboard() {
  return (
    <div className="w-full min-h-screen bg-retro-dark p-6 md:p-12 font-mono text-gray-300">

      {/* Header Widget */}
      <div className="w-full border-b border-retro-grid mb-8 pb-4 flex justify-between items-end">
        <div>
           <h1 className="text-3xl font-pixel text-retro-neon mb-2">DASHBOARD_V1</h1>
           <div className="flex items-center gap-2 text-xs text-retro-neon/60">
             <span className="w-2 h-2 bg-retro-neon rounded-full animate-pulse"></span>
             SYSTEM ONLINE
           </div>
        </div>
        <div className="text-right hidden md:block">
           <div className="text-sm text-retro-pink">USER_ID: GUEST</div>
           <div className="text-xs text-gray-500">ACCESS_LEVEL: 1</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Left Column: Navigation Cards */}
        <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Consoles Card */}
            <Link href="/console" className="group relative bg-[#151525] border border-retro-grid p-6 rounded hover:border-retro-neon transition-all overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <HardDrive size={64} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-retro-neon">CONSOLES</h3>
                <p className="text-sm text-gray-400 mb-4">Access the complete archive of retro gaming hardware.</p>
                <div className="text-xs text-retro-neon font-bold flex items-center gap-2">
                    ACCESS DATABASE <Zap size={12} />
                </div>
            </Link>

            {/* Compare/Arena Card */}
            <Link href="/arena" className="group relative bg-[#151525] border border-retro-grid p-6 rounded hover:border-retro-pink transition-all overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Activity size={64} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-retro-pink">VS MODE</h3>
                <p className="text-sm text-gray-400 mb-4">Compare specifications and performance metrics.</p>
                 <div className="text-xs text-retro-pink font-bold flex items-center gap-2">
                    INITIATE COMPARISON <Zap size={12} />
                </div>
            </Link>

             {/* Fabricators (Placeholder) */}
            <Link href="#" className="group relative bg-[#151525] border border-retro-grid p-6 rounded hover:border-retro-blue transition-all overflow-hidden md:col-span-2">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Cpu size={64} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-retro-blue">FABRICATORS</h3>
                <p className="text-sm text-gray-400">View manufacturer profiles and history.</p>
            </Link>

        </div>

        {/* Right Column: Stats & Info */}
        <div className="md:col-span-4 flex flex-col gap-6">

            {/* System Status Panel */}
            <div className="bg-[#0a0a12] border border-retro-grid p-4 rounded relative">
                <div className="absolute -top-3 left-4 bg-retro-dark px-2 text-xs text-gray-500">SYSTEM STATS</div>

                <div className="flex flex-col gap-4 mt-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">DATABASE</span>
                        <span className="text-retro-neon">CONNECTED</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">LATENCY</span>
                        <span className="text-green-400">12ms</span>
                    </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">UPTIME</span>
                        <span className="text-white">99.9%</span>
                    </div>
                </div>

                {/* Decorative Graph */}
                <div className="mt-6 flex items-end gap-1 h-12">
                    {[40, 70, 45, 90, 60, 80, 50, 95, 30, 60].map((h, i) => (
                        <div key={i} style={{ height: `${h}%`}} className="flex-1 bg-retro-grid hover:bg-retro-neon transition-colors"></div>
                    ))}
                </div>
            </div>

            {/* Recent Activity (Mock) */}
             <div className="bg-[#0a0a12] border border-retro-grid p-4 rounded relative flex-1">
                <div className="absolute -top-3 left-4 bg-retro-dark px-2 text-xs text-gray-500">RECENT LOGS</div>

                <ul className="mt-2 space-y-3 text-xs">
                    <li className="flex gap-2">
                        <span className="text-retro-blue">[10:42]</span>
                        <span className="text-gray-400">System initialization complete.</span>
                    </li>
                    <li className="flex gap-2">
                         <span className="text-retro-blue">[10:43]</span>
                        <span className="text-gray-400">User session established.</span>
                    </li>
                     <li className="flex gap-2">
                         <span className="text-retro-blue">[10:45]</span>
                        <span className="text-gray-400">New hardware detected: NES-001.</span>
                    </li>
                     <li className="flex gap-2">
                         <span className="text-retro-blue">[10:48]</span>
                        <span className="text-gray-400">Updated fabricator index.</span>
                    </li>
                </ul>
            </div>

        </div>

      </div>
    </div>
  );
}
