import { type ReactNode } from 'react';

export const SpecCard = ({ title, className = "", children }: { title: string, className?: string, children?: ReactNode }) => (
    <div className={`bg-retro-dark border border-retro-grid relative overflow-hidden group hover:border-retro-blue/50 transition-colors ${className}`}>
        {/* Header Strip */}
        <div className="bg-black/40 border-b border-retro-grid px-4 py-2 flex justify-between items-center">
            <h3 className="font-pixel text-[10px] text-retro-blue uppercase tracking-widest">{title}</h3>
            <div className="flex gap-1">
                <div className="w-1 h-1 bg-gray-700 rounded-full group-hover:bg-retro-neon transition-colors"></div>
                <div className="w-1 h-1 bg-gray-700 rounded-full group-hover:bg-retro-neon transition-colors delay-75"></div>
            </div>
        </div>
        {/* Content Body */}
        <div className="p-4 space-y-3">
            {children}
        </div>
    </div>
);