interface BuyButtonProps {
    asin: string | null;
}

export default function BuyButton({ asin }: BuyButtonProps) {
    if (!asin) return null;

    return (
        <div className="flex flex-col gap-3 w-full">
            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest text-left">
                As an Amazon Associate I earn from qualifying purchases.
            </p>
            <a
                href={`https://www.amazon.com/dp/${asin}?tag=theretrocircu-20`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 border border-dashed border-white/20 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/40 transition-colors w-full"
            >
                <div className="flex flex-col gap-1 text-left">
                    <span className="font-pixel text-lg text-white group-hover:text-white transition-colors">BUY ON AMAZON</span>
                </div>
                <div className="text-[10px] font-mono text-gray-500 uppercase px-2 py-1 bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:text-white transition-colors">
                    [ EXTERNAL ]
                </div>
            </a>
        </div>
    );
}
