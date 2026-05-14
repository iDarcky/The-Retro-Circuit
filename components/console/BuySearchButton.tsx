interface BuySearchButtonProps {
    query: string;
}

export default function BuySearchButton({ query }: BuySearchButtonProps) {
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=theretrocircu-20`;

    return (
        <div className="flex flex-col gap-3 w-full">
            <p className="text-xs text-gray-500 font-mono tracking-widest text-left">
                As an Amazon Associate I earn from qualifying purchases.
            </p>
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="group flex items-center justify-between p-4 border border-dashed border-white/20 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/60 transition-colors w-full"
            >
                <div className="flex flex-col gap-1 text-left">
                    <span className="font-pixel text-base text-white group-hover:text-orange-400 transition-colors">Search on Amazon</span>
                    <span className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">No direct listing — search by name</span>
                </div>
                <div className="whitespace-nowrap shrink-0 text-[10px] font-mono text-white/60 uppercase px-2 py-1 bg-white/5 border border-white/20 group-hover:bg-orange-500/20 group-hover:text-orange-400 group-hover:border-orange-500/40 transition-colors">
                    [ EXTERNAL ]
                </div>
            </a>
        </div>
    );
}
