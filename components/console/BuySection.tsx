import Link from 'next/link';

export default function BuySection() {
    return (
        <div className="bg-bg-primary border border-border-normal p-6">
            <h3 className="font-pixel text-[10px] text-gray-500 uppercase mb-4 tracking-widest">
                ACQUISITION
            </h3>
            <div className="font-mono text-xs text-gray-500 italic text-center py-4 border border-white/5 bg-white/5">
                [ CHANNELS PENDING ]
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 text-center">
                <Link href="#" className="font-mono text-[10px] text-gray-600 hover:text-primary underline opacity-50 cursor-not-allowed pointer-events-none">
                    VIEW PRICE HISTORY
                </Link>
            </div>
        </div>
    );
}
