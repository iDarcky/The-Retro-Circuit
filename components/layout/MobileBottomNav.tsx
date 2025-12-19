
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSound } from '../ui/SoundContext';
import { IconHome, IconChip, IconDatabase, IconVS } from '../ui/Icons';

const MobileBottomNav = () => {
    const pathname = usePathname();
    const { playClick } = useSound();

    const navItems = [
        { label: 'Home', icon: IconHome, path: '/', exact: true },
        { label: 'Fabricators', icon: IconChip, path: '/fabricators' },
        { label: 'Consoles', icon: IconDatabase, path: '/console' },
        { label: 'VS Mode', icon: IconVS, path: '/arena' },
    ];

    return (
        <div className="md:hidden fixed bottom-4 left-4 right-4 h-16 backdrop-blur-xl bg-black/30 border border-white/10 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)] z-50 flex items-center justify-around px-2 pb-safe-0">
            {navItems.map((item) => {
                const isActive = item.exact 
                    ? pathname === item.path 
                    : pathname.startsWith(item.path);

                return (
                    <Link
                        key={item.path}
                        href={item.path}
                        onClick={playClick}
                        className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                            isActive ? 'text-secondary' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <div className={`transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(0,255,157,0.8)]' : ''}`}>
                            <item.icon className="w-6 h-6" />
                        </div>
                        {isActive && (
                            <div className="absolute -bottom-1 w-1 h-1 bg-secondary rounded-full shadow-[0_0_5px_rgba(0,255,157,1)]"></div>
                        )}
                    </Link>
                );
            })}
        </div>
    );
};

export default MobileBottomNav;
