import Link from 'next/link';
import Button from '../ui/Button';

export default function BuySection() {
    return (
        <div className="bg-bg-primary border border-border-normal p-6">
            <h3 className="font-pixel text-[10px] text-gray-500 uppercase mb-4 tracking-widest">
                ACQUISITION
            </h3>
            <div className="space-y-3">
                <Button variant="secondary" className="w-full text-xs justify-between group">
                    <span>OFFICIAL STORE</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Button>
                {/*
                   Wait, 'ghost' variant is not supported by Button component (it only supports primary/secondary/danger).
                   I should use a regular HTML button with custom classes for the "ghost" look,
                   or fallback to 'primary'/'secondary' if I want the sound effects,
                   but styling it as "ghost" requires overriding the base classes which is messy.

                   Better approach: Use a standard button element for these specific links to match the "quiet" requirement
                   without hacking the Button component, OR add a 'ghost' variant to Button.tsx.

                   Given I can't modify Button.tsx easily (it affects everywhere), I'll just use a styled link/button here.
                */}
                <button className="w-full flex items-center justify-between px-6 py-2 border border-white/10 hover:border-white text-gray-400 hover:text-white group font-mono text-xs font-bold uppercase transition-all duration-200">
                    <span>AMAZON</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                </button>
                <button className="w-full flex items-center justify-between px-6 py-2 border border-white/10 hover:border-white text-gray-400 hover:text-white group font-mono text-xs font-bold uppercase transition-all duration-200">
                    <span>ALIEXPRESS</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                </button>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 text-center">
                <Link href="#" className="font-mono text-[10px] text-gray-600 hover:text-primary underline">
                    VIEW PRICE HISTORY
                </Link>
            </div>
        </div>
    );
}
