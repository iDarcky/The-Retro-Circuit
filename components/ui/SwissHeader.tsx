import { FC, ReactNode } from 'react';

interface SwissHeaderProps {
    title: ReactNode;
    subtitle: string;
    // accentColor is now implied by the title structure or passed as a class if generic text
    // We'll keep it flexible by accepting specific accent styling if needed in title
}

export const SwissHeader: FC<SwissHeaderProps> = ({ title, subtitle }) => {
    return (
        <div className="relative pt-24 pb-12 px-6 md:px-12 border-b border-white/5 overflow-hidden">
             {/* Background Effects */}
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05] pointer-events-none"></div>

             <div className="max-w-[1800px] mx-auto relative z-10">
                <div className="flex flex-col items-start gap-4">
                     <h1 className="text-4xl md:text-6xl font-pixel font-bold tracking-tighter text-white uppercase drop-shadow-lg leading-tight">
                        {title}
                     </h1>
                     <p className="text-lg md:text-xl text-zinc-400 max-w-2xl font-light font-mono">
                        {subtitle}
                     </p>
                </div>
             </div>
        </div>
    );
};
