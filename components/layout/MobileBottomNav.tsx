'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { IconHome, IconChip, IconDatabase, IconVS } from '../ui/Icons';

const MobileBottomNav = () => {
    const pathname = usePathname();

    const navItems = [
        { label: 'Home', icon: IconHome, path: '/', exact: true },
        { label: 'Fabricators', icon: IconChip, path: '/fabricators' },
        { label: 'Consoles', icon: IconDatabase, path: '/consoles' },
        { label: 'VS Mode', icon: IconVS, path: '/arena' },
    ];

    return (
        <div className="md:hidden fixed bottom-6 left-6 right-6 h-14 bg-bg-primary/95 backdrop-blur-md border border-violet-500/30 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.4)] z-50 flex items-center justify-around px-4">
            {navItems.map((item) => {
                const isActive = item.exact
                    ? pathname === item.path
                    : pathname.startsWith(item.path);

                return (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`relative flex flex-col items-center justify-center w-10 h-10 rounded-full transition-all duration-300 group ${
                            isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                        }`}
                    >
                        {/* Icon Container with subtle glow on active */}
                        <div className={`transition-transform duration-300 ${
                            isActive
                                ? 'scale-110 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]'
                                : 'group-hover:scale-105'
                        }`}>
                            <item.icon className="w-5 h-5" />
                        </div>

                        {/* Purple Active Dot */}
                        {isActive && (
                            <span className="absolute -bottom-1 w-1 h-1 bg-violet-500 rounded-full shadow-[0_0_4px_rgba(139,92,246,0.8)]" />
                        )}
                    </Link>
                );
            })}
        </div>
    );
};

export default MobileBottomNav;
