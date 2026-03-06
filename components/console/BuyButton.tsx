interface BuyButtonProps {
    asin: string | null;
}

export default function BuyButton({ asin }: BuyButtonProps) {
    if (!asin) return null;

    return (
        <div className="flex flex-col gap-3 w-full">
            <p className="text-xs text-gray-500 font-mono tracking-widest text-left">
                As an Amazon Associate I earn from qualifying purchases.
            </p>
            <a
                href={`https://www.amazon.com/dp/${asin}?tag=theretrocircu-20`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 border border-dashed border-orange-500/50 bg-orange-500/[0.02] hover:bg-orange-500/[0.05] hover:border-orange-500 transition-colors w-full"
            >
                <div className="flex flex-col gap-1 text-left">
                    <span className="font-pixel text-base text-white group-hover:text-orange-400 transition-colors">Buy on Amazon</span>
                </div>
                <div className="whitespace-nowrap shrink-0 text-[10px] font-mono text-orange-500/80 uppercase px-2 py-1 bg-orange-500/5 border border-orange-500/20 group-hover:bg-orange-500/20 group-hover:text-orange-400 group-hover:border-orange-500/40 transition-colors">
                    [ EXTERNAL ]
                </div>
            </a>
        </div>
    );
}
